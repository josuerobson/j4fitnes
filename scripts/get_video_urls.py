import urllib.request
import urllib.parse
import json

titles = [
    'File:Shoulder press - exercise demonstration video.webm',
    'File:Bent-over row - exercise demonstration video.webm',
    'File:Leg raises - exercise demonstration video.webm',
    'File:Pull-ups - exercise demonstration video.webm'
]

for t in titles:
    url = f'https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(t)}&prop=imageinfo&iiprop=url|size&format=json'
    req = urllib.request.Request(url, headers={'User-Agent': 'J4Fitness/1.0'})
    with urllib.request.urlopen(req) as resp:
        d = json.loads(resp.read().decode())
        for p in d['query']['pages'].values():
            info = p['imageinfo'][0]
            print(t, '=>', info['url'], f"({info.get('width')}x{info.get('height')}, {info.get('size')} bytes)")
