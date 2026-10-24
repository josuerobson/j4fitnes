import urllib.request
import json

queries = [
    'triceps demonstration video',
    'biceps demonstration video',
    'exercise demonstration video',
    'cable pushdown',
    'bicep curl video',
    'triceps pushdown'
]

for q in queries:
    url = f'https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={urllib.parse.quote(q)}&srnamespace=6&format=json'
    req = urllib.request.Request(url, headers={'User-Agent': 'J4FitnessApp/1.0 (contact@j4fitness.com)'})
    try:
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
            results = data.get('query', {}).get('search', [])
            print(f"=== {q} ===")
            for r in results[:4]:
                print(" -", r['title'])
    except Exception as e:
        print(f"Error {q}: {e}")
