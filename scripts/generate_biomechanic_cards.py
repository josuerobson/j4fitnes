import os
import math
import numpy as np
import cv2
from PIL import Image, ImageDraw, ImageFont

IMAGE_DIR = "assets/images"
VIDEO_DIR = "assets/videos"
os.makedirs(IMAGE_DIR, exist_ok=True)
os.makedirs(VIDEO_DIR, exist_ok=True)

WIDTH, HEIGHT = 720, 540

EXERCISES_TECH = [
    {
        "id": "puxada_alta",
        "title": "PUXADA ALTA NO PULLEY (LAT PULLDOWN)",
        "muscles": "Latissimo do Dorso (Grande Dorsal) • Biceps • Romboides",
        "key_angle": "Barra puxada a 15 de inclinacao • Cotovelos nos bolsos",
        "cues": ["Pegada pronada aberta", "Peito estufado e escapulas baixas", "Tracao com os cotovelos"],
        "icon": "v_taper"
    },
    {
        "id": "remada_curvada",
        "title": "REMADA CURVADA COM HALTERES / BARRA",
        "muscles": "Dorsais • Romboides • Trapezio Medio • Deltoide Posterior",
        "key_angle": "Tronco inclinado a 45 • Coluna 100% reta",
        "cues": ["Quadril empurrado para tras", "Puxada em arco para o umbigo", "Cotovelos rentes ao tronco"],
        "icon": "bent_row"
    },
    {
        "id": "desenvolvimento_ombros",
        "title": "DESENVOLVIMENTO DE OMBROS (OVERHEAD PRESS)",
        "muscles": "Deltoide Anterior • Deltoide Lateral • Triceps",
        "key_angle": "Plano escapular (cotovelos 30 a frente do corpo)",
        "cues": ["Coluna totalmente apoiada", "Empuxo vertical sem bater pesos", "Core travado"],
        "icon": "overhead_press"
    },
    {
        "id": "elevacao_lateral",
        "title": "ELEVACAO LATERAL DE OMBROS COM HALTERES",
        "muscles": "Deltoide Lateral (Medial) • Trapezio Superior",
        "key_angle": "Elevacao ate 90 (linha dos ombros)",
        "cues": ["Leve inclinacao do tronco (5-10)", "Cotovelos liderando o movimento", "Descida lenta de 3s"],
        "icon": "lateral_raise"
    },
    {
        "id": "rosca_direta",
        "title": "ROSCA DIRETA COM HALTERES (BICEPS CURL)",
        "muscles": "Biceps Braquial • Braquial • Antebracos",
        "key_angle": "Cotovelos estaticos colados nas costelas",
        "cues": ["Sem balanco da coluna lombar", "Supinacao maxima no topo", "Extensao quase completa"],
        "icon": "biceps_curl"
    },
    {
        "id": "triceps_corda",
        "title": "TRICEPS NA POLIA COM CORDA (PUSHDOWN)",
        "muscles": "Triceps Braquial (Cabeca Lateral e Medial)",
        "key_angle": "Abertura das pontas da corda na extensao total",
        "cues": ["Cotovelos fixos como um eixo", "Tronco levemente inclinado a frente", "Pico de contracao de 1s"],
        "icon": "triceps_push"
    },
    {
        "id": "leg_press_45",
        "title": "LEG PRESS 45 ARTICULADO",
        "muscles": "Quadriceps • Gluteo Maximo • Posteriores",
        "key_angle": "Descida a 90 sem descolar a lombar",
        "cues": ["Pes na largura dos ombros", "Sem bloquear/estalar joelhos no topo", "Controle excentrico"],
        "icon": "leg_press"
    },
    {
        "id": "abdominal_infra",
        "title": "ABDOMINAL INFRA NO SOLO (ELEVACAO DE PERNAS)",
        "muscles": "Reto Abdominal (Regiao Infra) • Flexores de Quadril",
        "key_angle": "Subida a 90 • Lombar colada no solo na descida",
        "cues": ["Sem descolar a lombar do chao", "Descida lenta e sustentada", "Transverso engajado"],
        "icon": "core_infra"
    },
    {
        "id": "panturrilha_em_pe",
        "title": "ELEVACAO DE PANTURRILHA EM PE (DEGRAU)",
        "muscles": "Gastrocnemio • Soleo • Fáscia Plantar",
        "key_angle": "Alongamento maximo no fundo • Pico de contracao no topo",
        "cues": ["Pausa de 1s embaixo e 1s em cima", "Sem quicar nos tendoes", "Pressao no dedao do pe"],
        "icon": "calf_raise"
    }
]

def draw_biomechanic_card(ex):
    # Criar canvas escuro elegante esportivo
    img = Image.new('RGB', (WIDTH, HEIGHT), color=(15, 23, 42))
    draw = ImageDraw.Draw(img)

    # Grid de fundo sutil
    for x in range(0, WIDTH, 40):
        draw.line([(x, 0), (x, HEIGHT)], fill=(24, 34, 56), width=1)
    for y in range(0, HEIGHT, 40):
        draw.line([(0, y), (WIDTH, y)], fill=(24, 34, 56), width=1)

    # Moldura holográfica azul atlética
    draw.rectangle([(20, 20), (WIDTH - 20, HEIGHT - 20)], outline=(37, 99, 235), width=2)
    # Cantoneiras de precisão
    accent_len = 30
    draw.line([(20, 20), (20 + accent_len, 20)], fill=(96, 165, 250), width=4)
    draw.line([(20, 20), (20, 20 + accent_len)], fill=(96, 165, 250), width=4)
    draw.line([(WIDTH - 20, 20), (WIDTH - 20 - accent_len, 20)], fill=(96, 165, 250), width=4)
    draw.line([(WIDTH - 20, 20), (WIDTH - 20, 20 + accent_len)], fill=(96, 165, 250), width=4)
    draw.line([(20, HEIGHT - 20), (20 + accent_len, HEIGHT - 20)], fill=(96, 165, 250), width=4)
    draw.line([(20, HEIGHT - 20), (20, HEIGHT - 20 - accent_len)], fill=(96, 165, 250), width=4)
    draw.line([(WIDTH - 20, HEIGHT - 20), (WIDTH - 20 - accent_len, HEIGHT - 20)], fill=(96, 165, 250), width=4)
    draw.line([(WIDTH - 20, HEIGHT - 20), (WIDTH - 20, HEIGHT - 20 - accent_len)], fill=(96, 165, 250), width=4)

    # Header da Ficha Técnica
    draw.text((45, 40), "J4 FITNESS • DEMONSTRACAO BIOMECANICA DE PRECISÃO", fill=(96, 165, 250))
    draw.text((45, 65), ex["title"], fill=(255, 255, 255))
    draw.line([(45, 95), (WIDTH - 45, 95)], fill=(37, 99, 235), width=1)

    # Músculos Ativados
    draw.text((45, 115), "MUSCULOS ALVO PRIMARIOS & SINERGISTAS:", fill=(148, 163, 184))
    draw.text((45, 135), ex["muscles"], fill=(56, 189, 248))

    # Ângulo Chave
    draw.rectangle([(45, 175), (WIDTH - 45, 225)], fill=(30, 41, 59), outline=(51, 65, 85), width=1)
    draw.text((60, 185), "ANGULO CRITICO DE SEGURANCA ARTICULAR:", fill=(251, 191, 36))
    draw.text((60, 202), ex["key_angle"], fill=(255, 255, 255))

    # Cues de Execução
    draw.text((45, 245), "CHECKPOINTS DE EXECUCAO:", fill=(148, 163, 184))
    start_y = 270
    for cue in ex["cues"]:
        draw.text((60, start_y), f"✓ {cue}", fill=(226, 232, 240))
        start_y += 26

    # Ilustração de Radar Biomecânico Centralizada no canto inferior
    center_cx, center_cy = WIDTH - 120, HEIGHT - 110
    draw.ellipse([(center_cx - 50, center_cy - 50), (center_cx + 50, center_cy + 50)], outline=(37, 99, 235), width=1)
    draw.ellipse([(center_cx - 30, center_cy - 30), (center_cx + 30, center_cy + 30)], outline=(96, 165, 250), width=1)
    draw.line([(center_cx - 55, center_cy), (center_cx + 55, center_cy)], fill=(37, 99, 235), width=1)
    draw.line([(center_cx, center_cy - 55), (center_cx, center_cy + 55)], fill=(37, 99, 235), width=1)
    draw.text((center_cx - 35, center_cy - 8), "ANGULO 90", fill=(255, 255, 255))

    # Barra Inferior
    draw.text((45, HEIGHT - 55), "Fase 1: Excentrica Controlada  •  Fase 2: Ponto de Inflexao  •  Fase 3: Concentrica", fill=(148, 163, 184))

    out_img = os.path.join(IMAGE_DIR, f"treino-{ex['id']}.jpg")
    img.save(out_img, quality=95)
    print(f"Created card: {out_img}")

    # Gera também o vídeo MP4 em loop com laser scanline
    cv_frame = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
    out_video = os.path.join(VIDEO_DIR, f"demo_{ex['id']}.mp4")
    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    vw = cv2.VideoWriter(out_video, fourcc, 25, (WIDTH, HEIGHT))

    for frame_idx in range(75):
        t = frame_idx / 75.0
        frame = cv_frame.copy()
        scan_y = int(HEIGHT * (t * 2 % 1.0))
        cv2.line(frame, (22, scan_y), (WIDTH - 22, scan_y), (255, 120, 37), 1)
        vw.write(frame)

    vw.release()
    print(f"Created video: {out_video}")

for ex in EXERCISES_TECH:
    draw_biomechanic_card(ex)

print("All biomechanic technical cards and videos generated successfully!")
