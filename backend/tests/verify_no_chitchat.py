import sys
import requests

if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

queries = [
    'hi',
    'hello',
    'how are you',
    'who are you',
    'Where is Aashraya Co-living?',
    'What is the rent at Sunrise PG in Kakinada?'
]

for q in queries:
    res = requests.post('http://127.0.0.1:8000/api/chat', json={'message': q})
    data = res.json()
    print(f'INPUT: "{q}"')
    print(f'REFUSAL TRIGGERED: {data["flags"]["refusal_triggered"]}')
    print(f'SOURCES COUNT: {len(data["sources"])}')
    print(f'ANSWER: {data["answer"]}')
    print('-' * 60)
