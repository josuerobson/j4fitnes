import urllib.request
import urllib.parse
import json
import os
import cv2
import numpy as np
from PIL import Image

titles = [
    ('File:Triceps-pushdown-with-rope-1.gif', 'real_triceps_rope_1.gif'),
    ('File:Triceps-pushdown-with-rope-2.gif', 'real_triceps_rope_2.gif'),
    ('File:Fitness model shoulder exercise weight training (32004749753).jpg', 'real_lateral_raise.jpg'),
    ('File:DumbbellLateralRaise.JPG', 'real_lateral_raise_2.jpg')
]

for wiki_title, local_name in titles:
    url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(wiki_title)}&prop=imageinfo&iiprop=url&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'J4Fitness/1.0'})
    try:
        with urllib.request.urlopen(req) as resp:
            d = json.loads(resp.read().decode())
            for p in d['query']['pages'].values():
                remote_url = p['imageinfo'][0]['url']
                print(f"Downloading {wiki_title} from {remote_url[:60]}...")
                r_req = urllib.request.Request(remote_url, headers={'User-Agent': 'Mozilla/5.0'})
                with urllib.request.urlopen(r_req) as r_resp, open(f"assets/images/{local_name}", 'wb') as f:
                    f.write(r_resp.read())
                print(f"  Saved assets/images/{local_name} ({os.path.getsize(f'assets/images/{local_name}')} bytes)")
    except Exception as e:
        print(f"Error {wiki_title}: {e}")
