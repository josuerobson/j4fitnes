import urllib.request
import urllib.parse
import json

q = urllib.parse.quote('intitle:"exercise demonstration video"')
url = f'https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch={q}&srnamespace=6&srlimit=50&format=json'
req = urllib.request.Request(url, headers={'User-Agent': 'J4Fitness/1.0'})
try:
    with urllib.request.urlopen(req) as resp:
        d = json.loads(resp.read().decode())
        items = d.get('query', {}).get('search', [])
        print(f"Found: {len(items)}")
        for it in items:
            print(" -", it['title'])
except Exception as e:
    print('Error:', e)
