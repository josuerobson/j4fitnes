import urllib.request
import urllib.parse
import json

terms = ['triceps', 'bicep', 'pulldown', 'lunge', 'calf raise', 'dip', 'lateral raise']
for term in terms:
    q = urllib.parse.quote(f'{term} filetype:video')
    url = f'https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={q}&srnamespace=6&srlimit=10&format=json'
    req = urllib.request.Request(url, headers={'User-Agent': 'J4Fitness/1.0'})
    try:
        with urllib.request.urlopen(req) as resp:
            d = json.loads(resp.read().decode())
            items = d.get('query', {}).get('search', [])
            print(f"=== {term} ({len(items)}) ===")
            for it in items[:4]:
                if any(ext in it['title'].lower() for ext in ['.webm', '.mp4', '.ogg']):
                    print("  *", it['title'])
    except Exception as e:
        print(f"Error {term}: {e}")
