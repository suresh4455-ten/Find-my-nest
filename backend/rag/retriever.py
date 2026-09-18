import json
import math
import logging
from typing import List, Dict, Any, Optional
from pathlib import Path

from backend.config import VECTORSTORE_DIR, DEFAULT_TOP_K
from backend.rag.embeddings import OllamaEmbeddingWrapper
from backend.rag.prompt import is_query_out_of_domain

logger = logging.getLogger(__name__)

def cosine_similarity(v1: List[float], v2: List[float]) -> float:
    if not v1 or not v2 or len(v1) != len(v2):
        return 0.0
    dot = sum(a * b for a, b in zip(v1, v2))
    norm1 = math.sqrt(sum(a * a for a in v1))
    norm2 = math.sqrt(sum(b * b for b in v2))
    if norm1 == 0.0 or norm2 == 0.0:
        return 0.0
    return dot / (norm1 * norm2)

class PropertyRetriever:
    def __init__(self, persist_dir: Path = VECTORSTORE_DIR):
        self.persist_dir = persist_dir
        self.store_file = self.persist_dir / "index.json"
        self.embedding_wrapper = OllamaEmbeddingWrapper()
        self.documents: List[Dict[str, Any]] = []
        self.load_index()

    def load_index(self):
        if self.store_file.exists():
            try:
                with open(self.store_file, "r", encoding="utf-8") as f:
                    self.documents = json.load(f)
                logger.info(f"Loaded {len(self.documents)} vectorstore documents.")
            except Exception as e:
                logger.error(f"Error loading vectorstore: {e}")
                self.documents = []
        else:
            logger.warning(f"Vectorstore not found at {self.store_file}. Ingestion required.")

    def search(self, query: str, top_k: int = DEFAULT_TOP_K) -> Dict[str, Any]:
        """
        Performs similarity search, retrieves top-k chunks, and groups by property_id.
        """
        if not self.documents:
            self.load_index()
            if not self.documents:
                return {"chunks": [], "grouped_properties": {}, "sources": []}

        # 1. Out of domain check - if the query is outside dataset scope, return empty retrieval
        if is_query_out_of_domain(query):
            return {"chunks": [], "grouped_properties": {}, "sources": []}

        q_vec = self.embedding_wrapper.embed_query(query)
        q_tokens = set(query.lower().split())


        # Check if query specifically mentions a target property name
        target_property_name = None
        generic_words = ['pg', 'hostel', 'hostels', 'men', "men's", 'women', "women's", 'boys', 'girls', 'ladies', 'sri', 'sree', 'and', 'for', 'the', '&', 'students', 'working', 'living', 'stay', 'space']
        for doc in self.documents:
            name = doc.get("metadata", {}).get("name", "")
            if not name:
                continue
            distinct_parts = [p.strip().lower() for p in name.split() if p.strip().lower() not in generic_words and len(p.strip()) > 3]
            if name.lower() in query.lower() or (distinct_parts and any(dp in query.lower() for dp in distinct_parts)):
                target_property_name = name.lower()
                break

        scored_docs = []
        for doc in self.documents:
            meta = doc.get("metadata", {})
            doc_name = meta.get("name", "").lower()
            is_ver = meta.get("is_verified", True)

            vec = doc.get("embedding", [])
            cos_score = cosine_similarity(q_vec, vec)

            # Keyword lexical bonus
            doc_text_lower = doc.get("text", "").lower()
            token_hits = sum(1 for t in q_tokens if len(t) > 2 and t in doc_text_lower)
            lexical_boost = min(0.4, token_hits * 0.08)

            # Property name boost
            if target_property_name:
                if target_property_name == doc_name or target_property_name in doc_name:
                    lexical_boost += 3.0  # Dominant priority for specifically requested property
                else:
                    lexical_boost -= 1.5  # Suppress other properties when a specific one is asked
            elif doc_name and any(p in query.lower() for p in doc_name.split() if len(p) > 4 and p not in ['hostel', 'women', 'ladies']):
                lexical_boost += 1.0

            total_score = cos_score + lexical_boost
            scored_docs.append((total_score, doc))

        # Sort by total score descending
        scored_docs.sort(key=lambda x: x[0], reverse=True)
        top_chunks = [doc for _, doc in scored_docs[:top_k]]

        # If a specific property was named in the query, keep ONLY that property's chunks
        if target_property_name:
            filtered_chunks = [c for c in top_chunks if target_property_name in c.get("metadata", {}).get("name", "").lower()]
            if filtered_chunks:
                top_chunks = filtered_chunks

        # Group by property_id to provide complete property context
        grouped_props: Dict[str, Dict[str, Any]] = {}
        unique_sources: Dict[str, Dict[str, Any]] = {}

        for doc in top_chunks:
            meta = doc.get("metadata", {})
            p_id = meta.get("property_id")
            if not p_id:
                continue

            if p_id not in grouped_props:
                grouped_props[p_id] = {
                    "property_id": p_id,
                    "name": meta.get("name"),
                    "location": meta.get("location"),
                    "source": meta.get("source"),
                    "is_verified": meta.get("is_verified", False),
                    "combined_text": doc.get("text", ""),
                    "chunks": [doc]
                }
                unique_sources[p_id] = {
                    "property_id": p_id,
                    "name": meta.get("name"),
                    "is_verified": meta.get("is_verified", False),
                    "source": meta.get("source")
                }
            else:
                grouped_props[p_id]["chunks"].append(doc)
                if doc.get("text") not in grouped_props[p_id]["combined_text"]:
                    grouped_props[p_id]["combined_text"] += f"\n\n---\n\n{doc.get('text')}"

        return {
            "chunks": top_chunks,
            "grouped_properties": grouped_props,
            "sources": list(unique_sources.values())
        }
