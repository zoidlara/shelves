"""Procedurally generate the tileable textures used by the site (wood, leather, cloth).
Run:  python3 tools/make_textures.py   (needs numpy + Pillow)"""
import numpy as np
from PIL import Image, ImageFilter
import os

OUT = os.path.join(os.path.dirname(__file__), "..", "assets", "tex")
rng = np.random.default_rng(7)

def fft_noise(h, w, beta=2.0, sx=1.0, sy=1.0, seed=None):
    """Periodic (tileable) 1/f^beta noise. sx/sy stretch the features."""
    r = np.random.default_rng(seed)
    white = r.standard_normal((h, w))
    ky = np.fft.fftfreq(h)[:, None] * h * sy
    kx = np.fft.fftfreq(w)[None, :] * w * sx
    k = np.sqrt(kx ** 2 + ky ** 2)
    k[0, 0] = 1
    f = np.fft.fft2(white) / (k ** (beta / 2))
    f[0, 0] = 0
    n = np.real(np.fft.ifft2(f))
    n = (n - n.mean()) / (n.std() + 1e-9)
    return n

def norm01(a):
    a = a - a.min(); return a / (a.max() + 1e-9)

def colorize(t, stops):
    """t in 0..1 -> RGB using list of (pos, (r,g,b))"""
    t = np.clip(t, 0, 1)
    out = np.zeros(t.shape + (3,))
    for i in range(len(stops) - 1):
        p0, c0 = stops[i]; p1, c1 = stops[i + 1]
        m = (t >= p0) & (t <= p1)
        u = ((t - p0) / (p1 - p0))[m][:, None]
        out[m] = np.array(c0) * (1 - u) + np.array(c1) * u
    return out

def save(arr, name, q=84):
    img = Image.fromarray(np.clip(arr, 0, 255).astype(np.uint8))
    path = os.path.join(OUT, name)
    if name.endswith(".jpg"): img.save(path, quality=q, optimize=True, progressive=True)
    else: img.save(path, optimize=True)
    print(name, img.size, os.path.getsize(path) // 1024, "KB")

def wood(h, w, seed, rings=9, palette=None, fiber=0.35):
    """Plain-sawn wood, grain running along x."""
    warp = fft_noise(h, w, beta=3.4, sx=4, sy=1, seed=seed)          # big lazy waves
    y = np.linspace(0, 1, h, endpoint=False)[:, None]
    v = y * rings + warp * 0.9
    fr = v - np.floor(v)
    ring = 1 - np.exp(-((fr - 0.15) / 0.07) ** 2) * 0.9 - np.exp(-((fr - 0.22) / 0.12) ** 2) * 0.4   # dark latewood lines
    fibers = fft_noise(h, w, beta=1.4, sx=60, sy=0.6, seed=seed + 1)   # long thin streaks
    pores = fft_noise(h, w, beta=0.6, sx=8, sy=0.5, seed=seed + 2)
    figure = fft_noise(h, w, beta=2.6, sx=3, sy=2, seed=seed + 3)      # light/dark patches
    t = 0.5 + 0.26 * (ring - 0.5) + 0.09 * fibers + 0.04 * pores + 0.08 * figure
    rgb = colorize(norm01(t) * 0.9 + 0.05, palette)
    return rgb

WALNUT = [(0, (24, 12, 6)), (0.35, (52, 27, 13)), (0.6, (82, 44, 21)), (0.85, (112, 64, 32)), (1, (140, 86, 44))]
MAHOGANY = [(0, (22, 9, 5)), (0.35, (55, 22, 12)), (0.6, (86, 38, 20)), (0.85, (116, 56, 30)), (1, (146, 78, 42))]
PANEL = [(0, (8, 5, 3)), (0.4, (20, 11, 6)), (0.7, (34, 19, 10)), (1, (50, 29, 15))]

os.makedirs(OUT, exist_ok=True)

# 1. shelf boards / frame: horizontal grain, tileable
save(wood(256, 1024, 11, rings=7, palette=WALNUT), "wood-h.jpg")
# 2. same wood, vertical grain for the uprights
save(np.rot90(wood(256, 1024, 21, rings=6, palette=MAHOGANY)).copy(), "wood-v.jpg")
# 3. back panel: vertical planks, darker
w = np.rot90(wood(512, 512, 31, rings=10, palette=PANEL)).copy()
plank = 128
xs = np.arange(512) % plank
seam = np.ones(512); seam[xs < 2] = 0.35; seam[xs == 2] = 0.7; seam[xs == plank - 1] = 0.8
tint = 1 + 0.10 * np.sin(np.arange(512) // plank * 2.3)   # each plank slightly different
w = w * (seam * tint)[None, :, None]
save(w, "panel.jpg")

# 4. leather: pebbled grain + creases, neutral grey for blending (128 = no change)
n1 = fft_noise(256, 256, beta=1.0, seed=41)
pebble = Image.fromarray((norm01(n1) * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))
pebble = np.asarray(pebble) / 255.0
cells = fft_noise(256, 256, beta=1.8, seed=42)
creases = np.abs(fft_noise(256, 256, beta=2.2, sx=1, sy=3, seed=43))
creases = np.clip(1 - creases * 3.5, 0, 1) ** 4
scuff = np.clip(fft_noise(256, 256, beta=2.8, seed=44), 0, None)
g = 0.5 + 0.16 * (pebble - 0.5) * 2 + 0.07 * cells - 0.18 * creases + 0.06 * scuff
g = np.clip(g, 0, 1) * 255
save(np.stack([g, g, g], -1), "leather.jpg", q=88)

# 5. book cloth: fine weave
yy, xx = np.mgrid[0:256, 0:256]
weave = 0.5 + 0.12 * np.sin(xx * np.pi / 1.5) * np.sin(yy * np.pi / 1.5) + 0.06 * np.sin(yy * np.pi / 1.5)
slub = fft_noise(256, 256, beta=1.2, sx=1, sy=12, seed=51) * 0.05 + fft_noise(256, 256, beta=1.2, sx=12, sy=1, seed=52) * 0.05
wear = fft_noise(256, 256, beta=2.6, seed=53) * 0.06
c = np.clip(weave + slub + wear, 0, 1) * 255
save(np.stack([c, c, c], -1), "cloth.jpg", q=88)

# 6. old paper (for page edges / vellum)
p = 0.5 + 0.05 * fft_noise(256, 256, beta=1.0, seed=61) + 0.08 * fft_noise(256, 256, beta=2.6, seed=62)
p = np.clip(p, 0, 1) * 255
save(np.stack([p, p, p], -1), "grain.jpg", q=86)

# ───────────── theme woods ─────────────
def knots(h, w, seed, n=3):
    """Dark knots for pine: soft ellipses with a ring, tileable by wrapping."""
    r = np.random.default_rng(seed)
    yy, xx = np.mgrid[0:h, 0:w]
    k = np.zeros((h, w))
    for _ in range(n):
        cy, cx = r.uniform(0, h), r.uniform(0, w)
        ry, rx = r.uniform(6, 12), r.uniform(10, 22)
        dy = np.minimum(np.abs(yy - cy), h - np.abs(yy - cy)); dx = np.minimum(np.abs(xx - cx), w - np.abs(xx - cx))
        d = np.sqrt((dy / ry) ** 2 + (dx / rx) ** 2)
        k += np.exp(-d ** 2 * 1.6) * 0.9 + np.exp(-((d - 1.4) / 0.35) ** 2) * 0.25
    return np.clip(k, 0, 1)

def planks(img, plank=128, depth=0.35):
    n = img.shape[1]; xs = np.arange(n) % plank
    seam = np.ones(n); seam[xs < 2] = depth; seam[xs == 2] = 0.7; seam[xs == plank - 1] = 0.82
    tint = 1 + 0.08 * np.sin(np.arange(n) // plank * 2.3)
    return img * (seam * tint)[None, :, None]

THEME_WOODS = {
    # forest: weathered olive oak
    "moss": ([(0, (16, 18, 10)), (0.35, (38, 40, 22)), (0.6, (64, 62, 36)), (0.85, (92, 86, 52)), (1, (120, 112, 72))],
             [(0, (6, 12, 8)), (0.4, (12, 24, 15)), (0.7, (20, 36, 22)), (1, (30, 50, 32))]),
    # celestial: navy-painted wood, grain barely showing through
    "navy": ([(0, (8, 10, 18)), (0.4, (16, 20, 34)), (0.7, (25, 30, 48)), (1, (40, 46, 68))],
             [(0, (4, 5, 10)), (0.4, (8, 10, 19)), (0.7, (12, 15, 28)), (1, (18, 22, 38))]),
    # cabin: honey pine
    "pine": ([(0, (96, 52, 20)), (0.3, (150, 88, 38)), (0.6, (196, 128, 62)), (0.85, (222, 160, 90)), (1, (238, 186, 118))],
             [(0, (70, 36, 14)), (0.35, (118, 66, 28)), (0.7, (164, 102, 50)), (1, (196, 136, 76))]),
    # gothic: ebony
    "ebony": ([(0, (5, 4, 4)), (0.4, (14, 11, 10)), (0.7, (26, 20, 18)), (1, (46, 36, 32))],
              [(0, (3, 2, 2)), (0.5, (10, 8, 7)), (1, (24, 18, 16))]),
    # modern: pale oak
    "oak": ([(0, (150, 112, 74)), (0.35, (184, 146, 104)), (0.6, (206, 172, 130)), (0.85, (224, 196, 158)), (1, (236, 214, 182))],
            [(0, (150, 112, 74)), (0.5, (196, 160, 118)), (1, (226, 200, 164))]),
}
for name, (pal, panel_pal) in THEME_WOODS.items():
    rings = 11 if name == "oak" else 8
    h = wood(256, 1024, 101 + len(name), rings=rings, palette=pal)
    v = np.rot90(wood(256, 1024, 201 + len(name), rings=rings - 1, palette=pal)).copy()
    if name == "pine":
        h = h * (1 - 0.55 * knots(256, 1024, 7, 4))[:, :, None]
        v = v * (1 - 0.55 * np.rot90(knots(256, 1024, 9, 4)))[:, :, None]
    save(h, f"{name}-h.jpg"); save(v, f"{name}-v.jpg")
    p = np.rot90(wood(512, 512, 301 + len(name), rings=10, palette=panel_pal)).copy()
    if name == "pine": p = p * (1 - 0.5 * np.rot90(knots(512, 512, 11, 3)))[:, :, None]
    save(planks(p, 128, 0.45 if name in ("oak", "pine") else 0.35), f"{name}-panel.jpg")

# modern: soft white plaster wall
pl = 240 + 2.2 * fft_noise(512, 512, beta=2.4, seed=71) + 1.4 * fft_noise(512, 512, beta=1.0, seed=72)
save(np.stack([pl, pl - 3, pl - 8], -1), "plaster.jpg", q=86)
