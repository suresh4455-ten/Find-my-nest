import logging
import math
import re
import requests
from typing import List
from backend.config import OLLAMA_BASE_URL, OLLAMA_EMBED_MODEL

logger = logging.getLogger(__name__)

class OllamaEmbeddingWrapper:
    """
    Embedding wrapper for Ollama nomic-embed-text with robust local fallback.
    """
    _last_check_time = 0
    _cached_available = False

    def __init__(self, base_url: str = OLLAMA_BASE_URL, model_name: str = OLLAMA_EMBED_MODEL):
        self.base_url = base_url.rstrip("/")
        self.model_name = model_name
        self._dim = 384

    def is_ollama_available(self) -> bool:
        import time
        now = time.time()
        if now - OllamaEmbeddingWrapper._last_check_time < 5.0:
            return OllamaEmbeddingWrapper._cached_available

        OllamaEmbeddingWrapper._last_check_time = now
        try:
            res = requests.get(f"{self.base_url}/api/tags", timeout=0.3)
            OllamaEmbeddingWrapper._cached_available = (res.status_code == 200)
        except Exception:
            OllamaEmbeddingWrapper._cached_available = False
        return OllamaEmbeddingWrapper._cached_available

    def embed_documents(self, texts: List[str]) -> List[List[float]]:
        if self.is_ollama_available():
            try:
                embeddings = []
                for text in texts:
                    res = requests.post(
                        f"{self.base_url}/api/embeddings",
                        json={"model": self.model_name, "prompt": text},
                        timeout=5.0
                    )
                    if res.status_code == 200:
                        data = res.json()
                        embeddings.append(data.get("embedding", []))
                    else:
                        embeddings.append(self._fallback_embed(text))
                return embeddings
            except Exception as e:
                logger.warning(f"Ollama embedding failed ({e}), falling back to deterministic local embedding.")
                return [self._fallback_embed(t) for t in texts]
        else:
            return [self._fallback_embed(t) for t in texts]

    def embed_query(self, text: str) -> List[float]:
        if self.is_ollama_available():
            try:
                res = requests.post(
                    f"{self.base_url}/api/embeddings",
                    json={"model": self.model_name, "prompt": text},
                    timeout=5.0
                )
                if res.status_code == 200:
                    data = res.json()
                    return data.get("embedding", self._fallback_embed(text))
            except Exception as e:
                logger.warning(f"Ollama query embedding failed ({e}), using local fallback.")
        return self._fallback_embed(text)

    def _fallback_embed(self, text: str) -> List[float]:
        """
        Deterministic, dense semantic hashing embedding vector for offline demo robustness.
        """
        words = re.findall(r'\w+', text.lower())
        vec = [0.0] * self._dim
        if not words:
            return vec

        for idx, word in enumerate(words):
            h = hash(word)
            pos = abs(h) % self._dim
            vec[pos] += 1.0 / (1.0 + math.log(idx + 1))
            # Also encode bigram character features
            for i in range(len(word) - 2):
                tri_hash = hash(word[i:i+3])
                tri_pos = abs(tri_hash) % self._dim
                vec[tri_pos] += 0.25

        # L2 normalize
        norm = math.sqrt(sum(x * x for x in vec))
        if norm > 0:
            vec = [x / norm for x in vec]
        return vec
