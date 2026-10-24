import urllib.request
import urllib.parse
import json

q = urllib.parse.quote('exercise demonstration video')
url = f'https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={q}&srnamespace=6&srlimit=50&format=json'
req = urllib.request.Request(url, headers={'User-Agent': 'J4FitnessApp/1.0 (contact@j4fitness.com)'})
try:
    with urllib.request.urlopen(req) as resp:
        data = json.loads(resp.read().decode())
        results = data.get('query', {}).get('search', [])
        print(f"Total found: {len(results)}")
        for r in results:
            if '.webm' in r['title'] or '.mp4' in r['title']:
                print(" -", r['title'])
except Exception as e:
    print(f"Error: {e}")
