import urllib.request
import urllib.parse
import json
import os
import cv2

titles = [
    ('File:Girl doing dips Exercise.jpg', 'real_triceps_dips_girl.jpg'),
    ('File:Tricep Dip Exercise.jpg', 'real_triceps_dips_man.jpg')
]

for wiki_title, local_name in titles:
    url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(wiki_title)}&prop=imageinfo&iiprop=url&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'J4Fitness/2.0'})
    try:
        with urllib.request.urlopen(req) as resp:
            d = json.loads(resp.read().decode())
            for p in d['query']['pages'].values():
                remote_url = p['imageinfo'][0]['url']
                print(f"Downloading {wiki_title}...")
                r_req = urllib.request.Request(remote_url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(r_req) as r_resp, open(f"assets/images/{local_name}", 'wb') as f:
                    f.write(r_resp.read())
                print(f"  Saved assets/images/{local_name} ({os.path.getsize(f'assets/images/{local_name}')} bytes)")
    except Exception as e:
        print(f"Error {wiki_title}: {e}")
