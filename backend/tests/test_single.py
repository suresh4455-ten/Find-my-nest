from backend.rag.retriever import PropertyRetriever
from backend.rag.prompt import generate_grounded_response_fallback

retriever = PropertyRetriever()
retriever.load_index()

test_queries = [
    "What amenities are provided at Narenn Living?",
    "What is the price at Colours Men's PG?",
    "What is the rent at Sai Tirumala Ladies PG?",
    "What are the curfew timings for Lakshmi Luxury PG for Women?"
]

for q in test_queries:
    res = retriever.search(q, top_k=4)
    ans = generate_grounded_response_fallback(q, res.get("grouped_properties", {}))
    print(f"\n--- QUERY: {q} ---")
    print(f"Sources: {[p.get('name') for p in res.get('grouped_properties', {}).values()]}")
    print(f"Answer:\n{ans}")
