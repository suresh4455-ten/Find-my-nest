import sys
from pathlib import Path

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

sys.path.insert(0, str(Path(__file__).resolve().parent.parent.parent))

from backend.rag.prompt import is_query_out_of_domain, generate_grounded_response_fallback
from backend.rag.retriever import PropertyRetriever

retriever = PropertyRetriever()
test_queries = [
    'Who is the prime minister of India?',
    'Write a python function to reverse a string',
    'What is the capital of France?',
    'Tell me a joke',
    'What is the weather today?',
    'How do I bake a chocolate cake?',
    'Hostels in Bangalore',
    'Where is Aashraya Co-living?',
    'What is the rent at Sunrise PG in Kakinada?',
    'Can you help me solve 2+2?',
    'What is quantum computing?',
    'Who is Donald Trump?',
    'Tell me a story about a dragon',
    'What is the distance to the moon?'
]

for q in test_queries:
    out_domain = is_query_out_of_domain(q)
    res = retriever.search(q)
    ans = generate_grounded_response_fallback(q, res.get('grouped_properties', {}))
    print(f"QUERY: {q}")
    print(f"OUT_OF_DOMAIN: {out_domain}")
    print(f"CHUNKS_COUNT: {len(res.get('chunks', []))}")
    print(f"ANS: {ans}")
    print("-" * 50)
