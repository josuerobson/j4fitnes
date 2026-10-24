import urllib.request
import urllib.parse
import json
import os
import time
import cv2

VIDEO_DIR = "assets/videos"
IMAGE_DIR = "assets/images"

REMAINING_VIDEOS = [
    {
        "wiki_title": "File:Pull-ups - exercise demonstration video.webm",
        "target_id": "real_pull_ups"
    },
    {
        "wiki_title": "File:Leg raises - exercise demonstration video.webm",
        "target_id": "real_leg_raises"
    },
    {
        "wiki_title": "File:Video of EZ Bar Curl and Straight Bar Curl.webm",
        "target_id": "real_biceps_curl"
    },
    {
        "wiki_title": "File:How to properly leg press.webm",
        "target_id": "real_leg_press"
    }
]

def get_file_url(wiki_title):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(wiki_title)}&prop=imageinfo&iiprop=url&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'J4FitnessAppBot/2.0 (health@j4fitness.com)'})
    with urllib.request.urlopen(req) as resp:
        d = json.loads(resp.read().decode())
        for p in d['query']['pages'].values():
            return p['imageinfo'][0]['url']
    return None

for item in REMAINING_VIDEOS:
    target_mp4 = f"assets/videos/{item['target_id']}.mp4"
    if os.path.exists(target_mp4) and os.path.getsize(target_mp4) > 10000:
        print(f"Already exists: {target_mp4}")
        continue

    print(f"\nWaiting 3s before fetching {item['target_id']}...")
    time.sleep(3)
    try:
        remote_url = get_file_url(item['wiki_title'])
        if not remote_url:
            print("  URL not found!")
            continue

        raw_path = f"assets/videos/{item['target_id']}_raw.webm"
        print(f"  Downloading from {remote_url[:60]}...")
        req = urllib.request.Request(remote_url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'})
        with urllib.request.urlopen(req) as resp, open(raw_path, 'wb') as f:
            f.write(resp.read())
        print(f"  Downloaded: {os.path.getsize(raw_path)} bytes")

        cap = cv2.VideoCapture(raw_path)
        if not cap.isOpened():
            print("  Cannot open video file!")
            continue

        fps = cap.get(cv2.CAP_PROP_FPS) or 25
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 100)
        max_frames = min(total_frames, int(fps * 6))

        target_img = f"assets/images/{item['target_id']}.jpg"

        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        out_writer = cv2.VideoWriter(target_mp4, fourcc, fps, (720, 540))

        frame_count = 0
        first_frame = None

        while True:
            ret, frame = cap.read()
            if not ret or frame_count >= max_frames:
                break

            h, w = frame.shape[:2]
            target_aspect = 720 / 540
            cur_aspect = w / h
            if cur_aspect > target_aspect:
                new_w = int(h * target_aspect)
                sx = (w - new_w) // 2
                cropped = frame[:, sx:sx+new_w]
            else:
                new_h = int(w / target_aspect)
                sy = (h - new_h) // 2
                cropped = frame[sy:sy+new_h, :]

            resized = cv2.resize(cropped, (720, 540))

            if first_frame is None:
                first_frame = resized.copy()
                cv2.imwrite(target_img, first_frame)

            out_writer.write(resized)
            frame_count += 1

        cap.release()
        out_writer.release()
        print(f"  Converted {frame_count} frames to {target_mp4} ({os.path.getsize(target_mp4)} bytes)")
        print(f"  Saved thumbnail: {target_img}")

    except Exception as e:
        print(f"  Error: {e}")

print("\nDone!")
