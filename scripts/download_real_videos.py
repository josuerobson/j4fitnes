import urllib.request
import urllib.parse
import json
import os
import cv2

VIDEO_DIR = "assets/videos"
IMAGE_DIR = "assets/images"
os.makedirs(VIDEO_DIR, exist_ok=True)
os.makedirs(IMAGE_DIR, exist_ok=True)

WIKI_VIDEOS = [
    {
        "wiki_title": "File:Shoulder press - exercise demonstration video.webm",
        "target_id": "real_shoulder_press",
        "exercise_keys": ["desenvolvimento_halteres", "flexao_pike_casa"]
    },
    {
        "wiki_title": "File:Bent-over row - exercise demonstration video.webm",
        "target_id": "real_bent_row",
        "exercise_keys": ["remada_curvada_halteres", "remada_unilateral_serrote"]
    },
    {
        "wiki_title": "File:Pull-ups - exercise demonstration video.webm",
        "target_id": "real_pull_ups",
        "exercise_keys": ["puxada_alta_pulley", "barra_fixa_ou_invertida_casa"]
    },
    {
        "wiki_title": "File:Leg raises - exercise demonstration video.webm",
        "target_id": "real_leg_raises",
        "exercise_keys": ["abdominal_infra_solo"]
    },
    {
        "wiki_title": "File:Video of EZ Bar Curl and Straight Bar Curl.webm",
        "target_id": "real_biceps_curl",
        "exercise_keys": ["rosca_direta_halteres"]
    },
    {
        "wiki_title": "File:How to properly leg press.webm",
        "target_id": "real_leg_press",
        "exercise_keys": ["leg_press_45"]
    }
]

def get_file_url(wiki_title):
    url = f"https://commons.wikimedia.org/w/api.php?action=query&titles={urllib.parse.quote(wiki_title)}&prop=imageinfo&iiprop=url&format=json"
    req = urllib.request.Request(url, headers={'User-Agent': 'J4Fitness/1.0'})
    with urllib.request.urlopen(req) as resp:
        d = json.loads(resp.read().decode())
        for p in d['query']['pages'].values():
            return p['imageinfo'][0]['url']
    return None

for item in WIKI_VIDEOS:
    print(f"\nProcessing {item['target_id']} ({item['wiki_title']})...")
    try:
        remote_url = get_file_url(item['wiki_title'])
        if not remote_url:
            print("  URL not found!")
            continue

        raw_path = f"assets/videos/{item['target_id']}_raw.webm"
        print(f"  Downloading from {remote_url[:60]}... -> {raw_path}")
        req = urllib.request.Request(remote_url, headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'})
        with urllib.request.urlopen(req) as resp, open(raw_path, 'wb') as f:
            f.write(resp.read())
        print(f"  Downloaded: {os.path.getsize(raw_path)} bytes")

        # Process with OpenCV: convert/clip to 540p MP4 and extract thumbnail JPG
        cap = cv2.VideoCapture(raw_path)
        if not cap.isOpened():
            print("  OpenCV cannot open webm, keeping raw webm.")
            continue

        fps = cap.get(cv2.CAP_PROP_FPS) or 25
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT) or 100)
        max_frames = min(total_frames, int(fps * 6)) # Max 6 seconds

        target_mp4 = f"assets/videos/{item['target_id']}.mp4"
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
            # Center crop to 4:3
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
        print(f"  Error processing {item['target_id']}: {e}")

print("\nDone downloading and processing real athlete video demonstrations!")
