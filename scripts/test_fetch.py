import urllib.request
import re

url = 'https://www.pexels.com/photo/adult-man-working-out-on-a-lat-pulldown-machine-in-a-modern-gym-setting-7031706/'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8', errors='ignore')
        matches = re.findall(r'https://images.pexels.com/photos/7031706/[^"\s\?]+', html)
        print('Found images:', len(matches))
        for m in set(matches[:5]):
            print(m)
except Exception as e:
    print('Error:', e)
