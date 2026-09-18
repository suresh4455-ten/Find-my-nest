import os
from pathlib import Path
from dotenv import load_dotenv

load_dotenv()

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"
DOCS_DIR = DATA_DIR / "documents"
VECTORSTORE_DIR = BASE_DIR / "vectorstore"

# Ollama Configuration
OLLAMA_BASE_URL = os.getenv("OLLAMA_BASE_URL", "http://localhost:11434")
OLLAMA_LLM_MODEL = os.getenv("OLLAMA_LLM_MODEL", "llama3.2")
OLLAMA_EMBED_MODEL = os.getenv("OLLAMA_EMBED_MODEL", "nomic-embed-text")

# RAG Settings
DEFAULT_TOP_K = 4
SIMILARITY_THRESHOLD = 0.65

# Ensure directories exist
VECTORSTORE_DIR.mkdir(parents=True, exist_ok=True)
