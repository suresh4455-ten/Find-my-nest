import os
import json
import shutil
import argparse
import logging
from pathlib import Path
from typing import List, Dict, Any

from backend.config import (
    DATA_DIR,
    DOCS_DIR,
    VECTORSTORE_DIR,
)
from backend.rag.embeddings import OllamaEmbeddingWrapper

logging.basicConfig(level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s")
logger = logging.getLogger(__name__)

class IngestionPipeline:
    def __init__(self, persist_dir: Path = VECTORSTORE_DIR):
        self.persist_dir = persist_dir
        self.embedding_wrapper = OllamaEmbeddingWrapper()
        self.store_file = self.persist_dir / "index.json"

    def clear_vectorstore(self):
        if self.persist_dir.exists():
            shutil.rmtree(self.persist_dir, ignore_errors=True)
        self.persist_dir.mkdir(parents=True, exist_ok=True)
        logger.info(f"Cleared vectorstore at {self.persist_dir}")

    def chunk_markdown_file(self, md_path: Path) -> List[Dict[str, Any]]:
        chunks = []
        if not md_path.exists():
            return chunks

        with open(md_path, "r", encoding="utf-8") as f:
            content = f.read()

        # Parse sections based on markdown headers
        sections = content.split("## ")
        title_block = sections[0].strip()
        main_title = title_block.replace("#", "").strip() if title_block else md_path.stem

        # Extract property_id from title or filename
        prop_id = md_path.stem.split("_")[0]

        for sec in sections[1:]:
            lines = sec.strip().split("\n")
            sec_title = lines[0].strip()
            sec_body = "\n".join(lines[1:]).strip()
            full_text = f"Property: {main_title}\nSection: {sec_title}\n{sec_body}"

            chunk = {
                "id": f"{prop_id}_{sec_title.lower().replace(' ', '_').replace('&', 'and')}",
                "text": full_text,
                "metadata": {
                    "property_id": prop_id,
                    "name": main_title.split("(")[0].strip(),
                    "section": sec_title,
                    "source": f"documents/{md_path.name}",
                    "is_verified": True
                }
            }
            chunks.append(chunk)

        return chunks

    def load_jsonl_documents(self) -> List[Dict[str, Any]]:
        jsonl_path = DATA_DIR / "properties.jsonl"
        chunks = []
        if not jsonl_path.exists():
            logger.warning(f"{jsonl_path} does not exist.")
            return chunks

        with open(jsonl_path, "r", encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if not line:
                    continue
                item = json.loads(line)
                meta = item.get("metadata", {})
                chunks.append({
                    "id": item.get("id"),
                    "text": item.get("text"),
                    "metadata": {
                        "property_id": meta.get("property_id", item.get("id")),
                        "name": meta.get("name", "Unknown PG"),
                        "location": meta.get("location", "Madhapur"),
                        "source": meta.get("source", "Directory Listing"),
                        "is_verified": bool(meta.get("is_verified", False))
                    }
                })
        return chunks

    def run(self, rebuild: bool = False):
        if rebuild:
            self.clear_vectorstore()
        else:
            self.persist_dir.mkdir(parents=True, exist_ok=True)

        logger.info("Gathering documents from properties.jsonl and documents/*.md...")
        all_docs: List[Dict[str, Any]] = []

        # 1. Load primary JSONL
        jsonl_docs = self.load_jsonl_documents()
        all_docs.extend(jsonl_docs)
        logger.info(f"Loaded {len(jsonl_docs)} documents from properties.jsonl")

        # 2. Chunk markdown files
        if DOCS_DIR.exists():
            for md_file in DOCS_DIR.glob("*.md"):
                md_chunks = self.chunk_markdown_file(md_file)
                all_docs.extend(md_chunks)
                logger.info(f"Added {len(md_chunks)} section chunks from {md_file.name}")

        # 3. Generate embeddings
        texts = [doc["text"] for doc in all_docs]
        logger.info(f"Generating embeddings for {len(texts)} chunks...")
        embeddings = self.embedding_wrapper.embed_documents(texts)

        for doc, emb in zip(all_docs, embeddings):
            doc["embedding"] = emb

        # 4. Persist to vectorstore directory
        with open(self.store_file, "w", encoding="utf-8") as f:
            json.dump(all_docs, f, indent=2)

        logger.info(f"Successfully ingested and persisted {len(all_docs)} chunks to {self.store_file}")
        return len(all_docs)

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Ingest properties data into ChromaDB/Vectorstore")
    parser.add_argument("--rebuild", action="store_true", help="Clear and re-ingest all documents")
    args = parser.parse_args()

    pipeline = IngestionPipeline()
    pipeline.run(rebuild=args.rebuild)
