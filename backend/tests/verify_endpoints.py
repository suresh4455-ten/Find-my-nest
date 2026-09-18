import sys
import requests
import json

if hasattr(sys.stdout, "reconfigure"):
    try:
        sys.stdout.reconfigure(encoding="utf-8")
    except Exception:
        pass

BASE_URL = "http://127.0.0.1:8000"

print("=" * 80)
print("1. TESTING /api/properties")
print("=" * 80)
res = requests.get(f"{BASE_URL}/api/properties")
print(f"Status: {res.status_code}")
data = res.json()
print(f"Total properties: {data.get('count')}")
print(f"First 2 properties: {[p['name'] for p in data.get('properties', [])[:2]]}")

print("\n" + "=" * 80)
print("2. TESTING DEMO 1-6 via /api/chat")
print("=" * 80)

demo_queries = [
    ("1. Simple lookup", "Where is Aashraya Co-living?"),
    ("2. Multi-condition", "Find properties in Madhapur with Wi-Fi and food."),
    ("3. Pricing check", "What is the price of a single AC room at Aashraya?"),
    ("4. Trust refusal", "What's the price at Colours Men's PG?"),
    ("5. Availability refusal", "Is Sri Ven PG currently available?"),
    ("6. Memory follow-up (Turn 1)", "Show PGs in Madhapur"),
    ("6. Memory follow-up (Turn 2)", "Which ones have food?")
]

session_id = "test-live-demo-session"
for label, query in demo_queries:
    print(f"\n>>> [{label}] Query: '{query}'")
    resp = requests.post(f"{BASE_URL}/api/chat", json={"session_id": session_id, "message": query})
    if resp.status_code == 200:
        c_data = resp.json()
        print(f"Rewritten Query: {c_data.get('rewritten_query')}")
        print(f"Sources: {[s['name'] + ' (Verified=' + str(s['is_verified']) + ')' for s in c_data.get('sources', [])]}")
        print(f"Flags: {c_data.get('flags')}")
        print(f"Answer: {c_data.get('answer')[:120]}...")
    else:
        print(f"FAILED: {resp.status_code} {resp.text}")

print("\n" + "=" * 80)
print("3. TESTING /api/search (Structured non-LLM fallback)")
print("=" * 80)
s_resp = requests.post(f"{BASE_URL}/api/search", json={"location": "Madhapur", "verified_only": True})
s_data = s_resp.json()
print(f"Structured search count: {s_data.get('count')}")
print(f"Properties found: {[p['name'] for p in s_data.get('properties', [])]}")

print("\n" + "=" * 80)
print("4. TESTING /api/eval (20-Question benchmark API)")
print("=" * 80)
eval_resp = requests.get(f"{BASE_URL}/api/eval")
eval_data = eval_resp.json()
print(f"Benchmark: {eval_data.get('passed')}/{eval_data.get('total_questions')} passed ({eval_data.get('pass_rate_percent')}%)")
print(f"Hallucination Rate: {eval_data.get('hallucination_rate_percent')}%")
print(f"Refusal Accuracy: {eval_data.get('refusal_accuracy_percent')}%")
print("=" * 80)
