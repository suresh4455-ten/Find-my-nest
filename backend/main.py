import csv
import logging
import requests
from typing import List, Optional, Dict, Any
from pathlib import Path
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from backend.config import (
    OLLAMA_BASE_URL,
    OLLAMA_LLM_MODEL,
    DATA_DIR,
)
from backend.rag.retriever import PropertyRetriever
from backend.rag.prompt import build_guardrail_prompt, generate_grounded_response_fallback, is_query_out_of_domain
from backend.rag.memory import session_memory
from backend.rag.ingestion import IngestionPipeline

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s")
logger = logging.getLogger("pgfinder-api")

app = FastAPI(
    title="PGFinder AI API",
    description="Grounded, anti-hallucinating RAG assistant for verified & directory PG accommodations",
    version="1.0.0"
)

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

retriever = PropertyRetriever()

# Ensure ingestion index is present at startup
@app.on_event("startup")
async def startup_event():
    logger.info("Initializing vectorstore & properties index...")
    retriever.load_index()
    if not retriever.documents:
        logger.info("Vectorstore empty. Running ingestion...")
        pipeline = IngestionPipeline()
        pipeline.run(rebuild=False)
        retriever.load_index()

class ChatRequest(BaseModel):
    session_id: Optional[str] = "default-session"
    message: str

class ChatSource(BaseModel):
    property_id: str
    name: str
    is_verified: bool
    source: Optional[str] = ""

class ChatFlags(BaseModel):
    low_confidence: bool = False
    has_unverified_sources: bool = False
    refusal_triggered: bool = False

class ChatResponse(BaseModel):
    answer: str
    sources: List[ChatSource]
    flags: ChatFlags
    rewritten_query: Optional[str] = None

class SearchFilterRequest(BaseModel):
    location: Optional[str] = None
    max_budget: Optional[float] = None
    amenities: Optional[List[str]] = []
    gender: Optional[str] = None
    verified_only: Optional[bool] = False

def is_ollama_online() -> bool:
    try:
        res = requests.get(f"{OLLAMA_BASE_URL}/api/tags", timeout=0.3)
        return res.status_code == 200
    except Exception:
        return False

def call_ollama_llm(prompt: str) -> Optional[str]:
    """
    Calls Ollama llama3.2 API if available.
    """
    if not is_ollama_online():
        return None
    try:
        res = requests.post(
            f"{OLLAMA_BASE_URL}/api/generate",
            json={
                "model": OLLAMA_LLM_MODEL,
                "prompt": prompt,
                "stream": False,
                "options": {
                    "temperature": 0.1,  # Low temperature for anti-hallucination groundedness
                    "top_p": 0.9,
                }
            },
            timeout=5.0
        )
        if res.status_code == 200:
            return res.json().get("response", "").strip()
    except Exception as e:
        logger.warning(f"Ollama generation unavailable: {e}")
    return None

def load_properties_from_csv() -> List[Dict[str, Any]]:
    csv_path = DATA_DIR / "properties.csv"
    properties = []
    if not csv_path.exists():
        return properties

    with open(csv_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            row["is_verified"] = row.get("is_verified", "False").strip().lower() in ("true", "1", "yes")
            properties.append(row)
    return properties

@app.get("/")
def root():
    return {
        "app": "PGFinder AI Backend",
        "status": "online",
        "endpoints": ["/api/chat", "/api/properties", "/api/search", "/api/eval"]
    }

@app.post("/api/chat", response_model=ChatResponse)
def chat_endpoint(payload: ChatRequest):
    raw_query = payload.message.strip()
    if not raw_query:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    session_id = payload.session_id or "default-session"

    # Step 1: Conversation memory query rewriting
    rewritten_query = session_memory.rewrite_query(session_id, raw_query)

    # Step 2: Out-of-Domain Guardrail Check (strict rejection of greetings, chit-chat, off-topic)
    if is_query_out_of_domain(rewritten_query):
        answer = generate_grounded_response_fallback(rewritten_query, {})
        slots = session_memory.extract_slots(raw_query)
        session_memory.add_turn(session_id, raw_query, answer, slots)
        return ChatResponse(
            answer=answer,
            sources=[],
            flags=ChatFlags(
                low_confidence=False,
                has_unverified_sources=False,
                refusal_triggered=True
            ),
            rewritten_query=rewritten_query if rewritten_query != raw_query else None
        )

    # Step 3: RAG Retrieval from Verified Vectorstore
    retrieval_res = retriever.search(rewritten_query, top_k=4)
    grouped_props = retrieval_res.get("grouped_properties", {})
    sources = retrieval_res.get("sources", [])

    if not grouped_props:
        answer = "Couldn't find matching records in the verified dataset."
        slots = session_memory.extract_slots(raw_query)
        session_memory.add_turn(session_id, raw_query, answer, slots)
        return ChatResponse(
            answer=answer,
            sources=[],
            flags=ChatFlags(
                low_confidence=True,
                has_unverified_sources=False,
                refusal_triggered=True
            ),
            rewritten_query=rewritten_query if rewritten_query != raw_query else None
        )

    # Step 5: Guardrail Prompt Assembly
    prompt = build_guardrail_prompt(rewritten_query, grouped_props)

    # Step 6: LLM Generation with fallback
    llm_output = call_ollama_llm(prompt)
    if not llm_output:
        # Fallback to deterministic grounded guardrail engine
        answer = generate_grounded_response_fallback(rewritten_query, grouped_props)
    else:
        answer = llm_output

    # Calculate safety & confidence flags
    has_unverified = any(not s.get("is_verified", False) for s in sources)
    low_confidence = len(sources) == 0
    refusal_triggered = "don't have verified information" in answer.lower() or "cannot guarantee" in answer.lower() or "exclusively to verified" in answer.lower()

    # Step 7: Update session memory
    slots = session_memory.extract_slots(raw_query)
    session_memory.add_turn(session_id, raw_query, answer, slots)

    return ChatResponse(
        answer=answer,
        sources=[
            ChatSource(
                property_id=s.get("property_id"),
                name=s.get("name"),
                is_verified=s.get("is_verified", False),
                source=s.get("source", "")
            )
            for s in sources
        ],
        flags=ChatFlags(
            low_confidence=low_confidence,
            has_unverified_sources=has_unverified,
            refusal_triggered=refusal_triggered
        ),
        rewritten_query=rewritten_query if rewritten_query != raw_query else None
    )


@app.get("/api/properties")
def list_properties():
    """
    Returns full property catalog.
    """
    props = load_properties_from_csv()
    return {"count": len(props), "properties": props}

@app.get("/api/properties/{property_id}")
def get_property(property_id: str):
    props = load_properties_from_csv()
    for p in props:
        if p.get("property_id", "").lower() == property_id.lower():
            return p
    raise HTTPException(status_code=404, detail=f"Property {property_id} not found.")

@app.post("/api/search")
def structured_search(filters: SearchFilterRequest):
    """
    Deterministic non-LLM structured search fallback over properties.csv.
    """
    props = load_properties_from_csv()
    results = []

    for p in props:
        # Location filter
        if filters.location:
            loc_target = filters.location.lower()
            prop_loc = f"{p.get('location', '')} {p.get('address', '')}".lower()
            if loc_target not in prop_loc:
                continue

        # Verified only filter
        if filters.verified_only and not p.get("is_verified", False):
            continue

        # Amenities filter
        if filters.amenities:
            p_amen = p.get("amenities", "").lower()
            if not all(am.lower() in p_amen for am in filters.amenities):
                continue

        # Gender filter
        if filters.gender:
            g_target = filters.gender.lower()
            p_gender = f"{p.get('type', '')} {p.get('name', '')} {p.get('rules', '')}".lower()
            if g_target == "men" and not any(k in p_gender for k in ["men", "boys", "male"]):
                continue
            if g_target == "women" and not any(k in p_gender for k in ["women", "ladies", "girls", "female"]):
                continue

        # Budget filter
        if filters.max_budget:
            pricing_str = p.get("pricing", "")
            # Try to extract minimum number from pricing string
            import re
            numbers = [int(n.replace(",", "")) for n in re.findall(r'₹?\s*(\d[\d,]*)', pricing_str)]
            if numbers:
                min_price = min(numbers)
                if min_price > filters.max_budget:
                    continue

        results.append(p)

    return {
        "count": len(results),
        "filters_applied": filters.dict(),
        "properties": results
    }

@app.get("/api/eval")
def run_evaluation_api():
    """
    Executes the 20-question evaluation benchmark and returns pass/fail and hallucination metrics.
    """
    from backend.tests.run_eval import run_eval_suite
    results = run_eval_suite()
    return results
