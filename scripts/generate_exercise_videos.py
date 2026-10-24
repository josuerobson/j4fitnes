import cv2
import numpy as np
import os
import math

VIDEO_DIR = "assets/videos"
IMAGE_DIR = "assets/images"
os.makedirs(VIDEO_DIR, exist_ok=True)

TARGET_WIDTH = 720
TARGET_HEIGHT = 540
FPS = 25
DURATION_SEC = 3
TOTAL_FRAMES = FPS * DURATION_SEC

# Lista de exercícios e seus respectivos arquivos de imagem
EXERCISES_MAP = [
    {
        "id": "homem_agachamento_frente",
        "image": "treino-homem-agachamento-frente.jpg",
        "angle_name": "VISAO FRONTAL - HOMEM",
        "phase_1": "Descida (Excentrica)",
        "phase_2": "Paralela 90",
        "phase_3": "Subida (Concentrica)"
    },
    {
        "id": "homem_agachamento_lado",
        "image": "treino-homem-agachamento-lado.jpg",
        "angle_name": "VISAO LATERAL 90 - HOMEM",
        "phase_1": "Retracao Escapular",
        "phase_2": "Profundidade 90",
        "phase_3": "Extensao Quadril"
    },
    {
        "id": "mulher_agachamento_frente",
        "image": "treino-mulher-agachamento-frente.jpg",
        "angle_name": "VISAO FRONTAL - MULHER",
        "phase_1": "Descida Controlada",
        "phase_2": "Joelhos Alinhados",
        "phase_3": "Pressao nos Calcanhares"
    },
    {
        "id": "mulher_agachamento_lado",
        "image": "treino-mulher-agachamento-lado.jpg",
        "angle_name": "VISAO LATERAL 90 - MULHER",
        "phase_1": "Coluna Neutra",
        "phase_2": "Paralelo 90",
        "phase_3": "Ativacao de Gluteos"
    },
    {
        "id": "mulher_elevacao_pelvica",
        "image": "treino-mulher-elevacao-pelvica.jpg",
        "angle_name": "VISAO PERFIL - ELEVACAO PELVICA",
        "phase_1": "Flexao de Quadril",
        "phase_2": "Pico de Extensao 90",
        "phase_3": "Retracao Controlada"
    },
    {
        "id": "homem_supino_lado",
        "image": "treino-homem-supino-lado.jpg",
        "angle_name": "VISAO LATERAL - SUPINO",
        "phase_1": "Descida Cotovelos 45",
        "phase_2": "Alongamento Peitoral",
        "phase_3": "Empuxo e Concentracao"
    },
    {
        "id": "mulher_afundo_lado",
        "image": "treino-mulher-afundo-lado.jpg",
        "angle_name": "VISAO LATERAL - PASSADA / AFUNDO",
        "phase_1": "Descida em 90",
        "phase_2": "Equilibrio Pelvico",
        "phase_3": "Subida Unilateral"
    }
]

def make_video_loop(item):
    img_path = os.path.join(IMAGE_DIR, item["image"])
    if not os.path.exists(img_path):
        print(f"Skipping {item['id']}: image not found: {img_path}")
        return

    src_img = cv2.imread(img_path)
    if src_img is None:
        print(f"Error reading {img_path}")
        return

    # Redimensiona mantendo proporção e crop para 720x540
    h, w = src_img.shape[:2]
    target_aspect = TARGET_WIDTH / TARGET_HEIGHT
    current_aspect = w / h

    if current_aspect > target_aspect:
        new_w = int(h * target_aspect)
        start_x = (w - new_w) // 2
        cropped = src_img[:, start_x:start_x+new_w]
    else:
        new_h = int(w / target_aspect)
        start_y = (h - new_h) // 2
        cropped = src_img[start_y:start_y+new_h, :]

    base_frame = cv2.resize(cropped, (TARGET_WIDTH, TARGET_HEIGHT))

    out_path = os.path.join(VIDEO_DIR, f"{item['id']}.mp4")
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(out_path, fourcc, FPS, (TARGET_WIDTH, TARGET_HEIGHT))

    for frame_idx in range(TOTAL_FRAMES):
        # Progress 0.0 to 1.0
        t = frame_idx / TOTAL_FRAMES
        # Smooth sinusoidal cycle (excentric -> peak -> concentric)
        cycle = 0.5 - 0.5 * math.cos(2 * math.pi * t)

        # Micro subtle digital push-in zoom (1.00 to 1.04)
        zoom = 1.0 + 0.04 * cycle
        zh, zw = int(TARGET_HEIGHT * zoom), int(TARGET_WIDTH * zoom)
        zoomed = cv2.resize(base_frame, (zw, zh))
        crop_x = (zw - TARGET_WIDTH) // 2
        crop_y = (zh - TARGET_HEIGHT) // 2
        frame = zoomed[crop_y:crop_y+TARGET_HEIGHT, crop_x:crop_x+TARGET_WIDTH].copy()

        # Laser HUD scan line
        scan_y = int(TARGET_HEIGHT * (t * 2 % 1.0))
        cv2.line(frame, (0, scan_y), (TARGET_WIDTH, scan_y), (255, 120, 37), 1)

        # HUD Corner accents
        accent_color = (255, 160, 50)
        cv2.line(frame, (20, 20), (50, 20), accent_color, 2)
        cv2.line(frame, (20, 20), (20, 50), accent_color, 2)
        cv2.line(frame, (TARGET_WIDTH - 20, 20), (TARGET_WIDTH - 50, 20), accent_color, 2)
        cv2.line(frame, (TARGET_WIDTH - 20, 20), (TARGET_WIDTH - 20, 50), accent_color, 2)

        # Biomechanical progress arc in bottom right
        center_x, center_y = TARGET_WIDTH - 45, TARGET_HEIGHT - 45
        cv2.circle(frame, (center_x, center_y), 22, (40, 40, 40), -1)
        angle = int(360 * t)
        cv2.ellipse(frame, (center_x, center_y), (20, 20), -90, 0, angle, (37, 99, 235), 3)

        out.write(frame)

    out.release()
    print(f"Generated video: {out_path} ({os.path.getsize(out_path)} bytes)")

for it in EXERCISES_MAP:
    make_video_loop(it)

print("All exercise video demonstrations created successfully!")
