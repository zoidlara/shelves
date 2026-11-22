// The rooms (looks) the Hall can wear. Each one changes colours, fonts, wood,
// book colours, shelf objects, windows and the little floating lights.
import { setPalette } from "./covers.js";
import { setDecor } from "./art.js";

const GF = q => `https://fonts.googleapis.com/css2?${q}&display=swap`;
const P = list => list.map(([bg, ink]) => ({ bg, ink }));

export const THEMES = {
  moonwood: {
    name: "Moonwood", hallName: "Moonwood", blurb: "Mossy wood under a silver moon, ivy, fireflies and stars.",
    swatch: ["#1f3a2c", "#c4d2c8", "#24304a"],
    fonts: GF("family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Cormorant+SC:wght@500;600;700"),
    kicker: "A library in the moonlit wood", sub: "Where the moss is soft, the moon is full, and every shelf glows a little.",
    palette: P([["#1f3a2c", "#dfe8e0"], ["#24304a", "#dfe6ee"], ["#2c4a3a", "#e6eee6"], ["#3a3450", "#e2dcec"], ["#5a6a64", "#f0f4f0"], ["#14201a", "#c8d4cc"], ["#1a2a3a", "#d4dce8"], ["#4a5a3a", "#eef0e0"], ["#b8c4bc", "#1a2420"], ["#2a2030", "#d8d0e0"]]),
    bindings: ["b-cloth", "b-leather", "b-cloth", "b-vellum", "b-cloth", "b-leather"],
    decor: { objects: ["moon", "fern", "cloche", "fireflyjar", "crystal", "starlantern", "ink"], tops: ["fireflyjar", "crystal", "candle"],
      cols: ["#1f3a2c", "#24304a", "#2c4a3a", "#3a3450", "#14201a", "#1a2a3a", "#4a5a3a", "#2a2030"], bindings: ["b-cloth", "b-leather", "b-cloth", "b-vellum"] },
    motes: [{ kind: "firefly", n: 26, rgb: "214,255,170" }, { kind: "twinkle", n: 30, rgb: "220,232,255" }],
    vines: true, sconces: true,
  },
  starfall: {
    name: "Starfall Hollow", hallName: "Starfall Hollow", blurb: "A forest clearing at night, the sky behind every shelf, shooting stars.",
    swatch: ["#141c3a", "#d6ba78", "#1f3a24"],
    fonts: GF("family=Marcellus&family=Marcellus+SC&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500"),
    kicker: "Where the stars come down to read", sub: "A clearing in the woods, a sky full of stars, and a story for every one of them.",
    palette: P([["#141c3a", "#d8c088"], ["#1f3a24", "#d8c98a"], ["#22285a", "#e0c890"], ["#2c4a2e", "#e0d39a"], ["#3a2a5e", "#e6d09a"], ["#18302c", "#cfd8a0"], ["#4a3420", "#d9c48a"], ["#0e1020", "#cfb67a"], ["#5a6478", "#f0e8d0"], ["#6e2a1e", "#ecd8a0"]]),
    bindings: ["b-cloth", "b-leather", "b-cloth", "b-cloth", "b-leather", "b-vellum"],
    decor: { objects: ["telescope", "cloche", "starlantern", "fern", "armillary", "crystal", "moon"], tops: ["starlantern", "crystal", "fireflyjar"],
      cols: ["#141c3a", "#1f3a24", "#22285a", "#2c4a2e", "#3a2a5e", "#18302c", "#0e1020", "#4a3420"], bindings: ["b-cloth", "b-leather", "b-cloth"] },
    motes: [{ kind: "twinkle", n: 46, rgb: "225,232,255" }, { kind: "firefly", n: 14, rgb: "214,255,150" }, { kind: "shooting", n: 2, rgb: "255,250,235" }],
    vines: true, sconces: false,
  },
  elderglow: {
    name: "Elderglow", hallName: "Elderglow", blurb: "Teal and violet magic, glowing mushrooms, crystals and northern lights.",
    swatch: ["#0e3a38", "#96e2cc", "#3a2a6a"],
    fonts: GF("family=Cinzel+Decorative:wght@400;700&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&family=Cormorant+SC:wght@500;600;700"),
    kicker: "Under the northern lights", sub: "Glowing mushrooms, humming crystals, and books that seem to read you back.",
    palette: P([["#0e3a38", "#bff0e2"], ["#3a2a6a", "#e0d4ff"], ["#1a4a3a", "#cdf2dc"], ["#4a2050", "#f0d4f4"], ["#123040", "#c4e8f0"], ["#2a5a54", "#e6fff6"], ["#24183a", "#d4c4f0"], ["#0a2420", "#a8e0cc"], ["#6a5aa0", "#f4f0ff"], ["#8ac8b8", "#0a2420"]]),
    bindings: ["b-cloth", "b-leather", "b-cloth", "b-cloth", "b-leather", "b-vellum"],
    decor: { objects: ["glowshrooms", "crystal", "moon", "fireflyjar", "armillary", "starlantern", "fern"], tops: ["crystal", "fireflyjar", "starlantern"],
      cols: ["#0e3a38", "#3a2a6a", "#1a4a3a", "#4a2050", "#123040", "#24183a", "#0a2420", "#2a5a54"], bindings: ["b-cloth", "b-leather", "b-cloth"] },
    motes: [{ kind: "firefly", n: 24, rgb: "150,255,225" }, { kind: "firefly", n: 10, rgb: "200,160,255" }, { kind: "twinkle", n: 24, rgb: "220,255,245" }],
    vines: true, sconces: false,
  },
  fernstar: {
    name: "The Fern & Star", hallName: "The Fern & Star", blurb: "A glass greenhouse at night: ferns, trailing plants, brass telescopes.",
    swatch: ["#1d3226", "#dcb878", "#121c3a"],
    fonts: GF("family=Josefin+Sans:wght@500;600;700"),
    kicker: "A greenhouse for stories", sub: "Ferns on every shelf, stars through every pane, and a lamp left on for you.",
    palette: P([["#1d3226", "#d1ad66"], ["#1a2233", "#cfae6c"], ["#2c4a2e", "#e0d39a"], ["#4a1418", "#d9b26a"], ["#3b3a22", "#d8bd7c"], ["#141c3a", "#d8c088"], ["#6b3a1f", "#e6c98a"], ["#18302c", "#cfd8a0"], ["#c2b28c", "#2a1a0e"], ["#22285a", "#e0c890"]]),
    bindings: ["b-cloth", "b-leather", "b-cloth", "b-leather", "b-vellum", "b-cloth"],
    decor: { objects: ["pothos", "fern", "telescope", "succulent", "moon", "cloche", "starlantern"], tops: ["succulent", "starlantern", "crystal"],
      cols: ["#1d3226", "#1a2233", "#2c4a2e", "#4a1418", "#3b3a22", "#141c3a", "#6b3a1f", "#18302c"], bindings: ["b-cloth", "b-leather", "b-cloth", "b-vellum"] },
    motes: [{ kind: "twinkle", n: 30, rgb: "230,236,255" }, { kind: "firefly", n: 16, rgb: "255,220,150" }],
    vines: true, sconces: true,
  },
  duskleaf: {
    name: "Duskleaf", hallName: "Duskleaf", blurb: "The forest at twilight: violet sky, warm lanterns, the first stars.",
    swatch: ["#3a2050", "#f0be6e", "#2a4a3a"],
    fonts: GF("family=Uncial+Antiqua&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Cormorant+SC:wght@500;600;700"),
    kicker: "Just after sunset", sub: "Lanterns lit, the sky turning violet, and one more chapter before the stars come out.",
    palette: P([["#3a2050", "#f0d8a8"], ["#5a2a4a", "#f4dcb0"], ["#2a4a3a", "#f0e0b0"], ["#7a3a3a", "#f6e0b8"], ["#1e2a44", "#ecd8b0"], ["#8a5a2a", "#fbe8c4"], ["#4a3a6a", "#f2e2c0"], ["#1a3a30", "#e6d8a8"], ["#c8a8c0", "#2a1830"], ["#2a1a2a", "#e0c890"]]),
    bindings: ["b-cloth", "b-leather", "b-cloth", "b-vellum", "b-cloth", "b-leather"],
    decor: { objects: ["lantern", "fireflyjar", "fern", "moon", "crystal", "starlantern", "cloche"], tops: ["fireflyjar", "crystal", "candle"],
      cols: ["#3a2050", "#5a2a4a", "#2a4a3a", "#7a3a3a", "#1e2a44", "#4a3a6a", "#1a3a30", "#2a1a2a"], bindings: ["b-cloth", "b-leather", "b-cloth", "b-vellum"] },
    motes: [{ kind: "firefly", n: 30, rgb: "255,205,120" }, { kind: "twinkle", n: 16, rgb: "255,240,230" }],
    vines: true, sconces: true,
  },
  academia: {
    name: "Dark Academia", blurb: "Oxblood leather, brass and a rainy night outside.",
    swatch: ["#4a1418", "#b08d57", "#1d3226"],
    fonts: null,
    kicker: "Societas Lectorum · Est. MMXXVI", sub: "A reading room for those who never quite return their books on time.",
    palette: P([["#4a1418", "#d9b26a"], ["#1d3226", "#d1ad66"], ["#1a2233", "#cfae6c"], ["#16130f", "#c9a35c"], ["#6b3a1f", "#e6c98a"], ["#3a2030", "#d4b06e"], ["#2e3236", "#cdb27a"], ["#5e1f26", "#e0bd7a"], ["#3b3a22", "#d8bd7c"], ["#8a7656", "#1e140c"], ["#2a1b12", "#c79f5a"], ["#c2b28c", "#2a1a0e"]]),
    bindings: ["b-leather", "b-cloth", "b-leather", "b-vellum", "b-cloth", "b-leather"],
    decor: { objects: ["lamp", "globe", "candle", "bust", "hourglass", "ink", "skull"], tops: ["skull", "hourglass", "candle"],
      cols: ["#3d1013", "#162a1f", "#5a3a20", "#141b29", "#120f0c", "#4e1a20", "#2b2a18", "#6a5a3c"], bindings: ["b-leather", "b-cloth", "b-leather", "b-vellum"] },
    motes: { kind: "dust", n: 40, rgb: "255,220,150" },
    sconces: true,
  },
  forest: {
    name: "Enchanted Forest", blurb: "Mossy oak, trailing ivy, mushrooms and fireflies.",
    swatch: ["#1f3a24", "#c2b46a", "#6e2a1e"],
    fonts: GF("family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600&family=Cormorant+SC:wght@500;600;700&family=Uncial+Antiqua"),
    kicker: "Deep in the Old Wood", sub: "Where the trees keep their stories and the fireflies read over your shoulder.",
    palette: P([["#1f3a24", "#d8c98a"], ["#2c4a2e", "#e0d39a"], ["#4a3420", "#d9c48a"], ["#6e2a1e", "#ecd8a0"], ["#5a6a3a", "#f0e6c0"], ["#3a2a40", "#d8c49a"], ["#7a5a2a", "#f2e2b0"], ["#18302c", "#cfd8a0"], ["#8a8a5a", "#20200e"], ["#2a1e14", "#cdb47a"]]),
    bindings: ["b-cloth", "b-leather", "b-cloth", "b-vellum", "b-cloth", "b-leather"],
    decor: { objects: ["fern", "cloche", "fireflyjar", "crystal", "candle", "globe", "ink"], tops: ["crystal", "fireflyjar", "candle"],
      cols: ["#1f3a24", "#2c4a2e", "#4a3420", "#3a2a40", "#18302c", "#5a4a2a", "#2a1e14", "#6e2a1e"], bindings: ["b-cloth", "b-leather", "b-cloth", "b-vellum"] },
    motes: { kind: "firefly", n: 34, rgb: "214,255,140" },
    vines: true, sconces: true,
  },
  celestial: {
    name: "Celestial Observatory", blurb: "Midnight blue, gold stars, telescopes and moons.",
    swatch: ["#141c3a", "#d6ba78", "#3a2a5e"],
    fonts: GF("family=Marcellus&family=Marcellus+SC&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400;1,500"),
    kicker: "Observatory of Stories", sub: "Every book a star, every shelf a constellation.",
    palette: P([["#141c3a", "#d8c088"], ["#22285a", "#e0c890"], ["#3a2a5e", "#e6d09a"], ["#1a3440", "#d8c48a"], ["#5a6478", "#f0e8d0"], ["#0e1020", "#cfb67a"], ["#4a2a4a", "#e0c890"], ["#8a7448", "#141020"], ["#2a3a6a", "#efe0b0"], ["#c8c4b4", "#1a1c30"]]),
    bindings: ["b-cloth", "b-leather", "b-cloth", "b-cloth", "b-leather", "b-vellum"],
    decor: { objects: ["telescope", "moon", "armillary", "starlantern", "hourglass", "globe", "candle"], tops: ["starlantern", "hourglass", "candle"],
      cols: ["#141c3a", "#22285a", "#3a2a5e", "#1a3440", "#0e1020", "#4a2a4a", "#2a3a6a", "#5a6478"], bindings: ["b-cloth", "b-leather", "b-cloth"] },
    motes: { kind: "twinkle", n: 70, rgb: "220,230,255" },
    sconces: false,
  },
  cabin: {
    name: "Autumn Cabin", blurb: "Honey pine, plaid, steaming mugs and falling snow.",
    swatch: ["#c88a46", "#8a3a1e", "#2a4a30"],
    fonts: GF("family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400;1,9..144,600&family=Lora:ital,wght@0,400;0,500;0,600;1,400;1,500&family=Josefin+Sans:wght@500;600;700"),
    kicker: "Up the Mountain Road", sub: "Blankets, cocoa and a crackling fire. Stay as long as you like.",
    palette: P([["#8a3a1e", "#f2dcb0"], ["#b8862a", "#2a1a08"], ["#2a4a30", "#ecd9a8"], ["#1e2c44", "#e8d6a8"], ["#6a1e22", "#f0d8a8"], ["#c8b48a", "#3a2410"], ["#5a5a2a", "#f0e4b8"], ["#a8501e", "#fbe6c0"], ["#3a2414", "#e6c88a"], ["#7a2a2a", "#f4e0b8"]]),
    bindings: ["b-cloth", "b-jacket", "b-cloth", "b-leather", "b-jacket", "b-cloth"],
    decor: { objects: ["lantern", "mug", "succulent", "pinecones", "candle", "globe", "hourglass"], tops: ["mug", "succulent", "candle"],
      cols: ["#8a3a1e", "#2a4a30", "#1e2c44", "#6a1e22", "#5a5a2a", "#3a2414", "#a8501e", "#c8b48a"], bindings: ["b-cloth", "b-cloth", "b-leather"] },
    motes: { kind: "ember", n: 30, rgb: "255,150,60" },
    sconces: true,
  },
  gothic: {
    name: "Gothic Romance", blurb: "Black ebony, crimson velvet, ravens and roses.",
    swatch: ["#0e0c10", "#7a0e1c", "#b8b4bc"],
    fonts: GF("family=UnifrakturMaguntia&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500;1,600"),
    kicker: "Sanctum of the Night", sub: "Candles lit, curtains drawn, and a story that won’t let you sleep.",
    palette: P([["#0e0c10", "#c8c0c8"], ["#5a0a14", "#e0c8c0"], ["#2a0e2a", "#d8c0d0"], ["#3a0a1a", "#dcc0c4"], ["#1e1e24", "#c8c8d0"], ["#7a0e1c", "#f0d8d0"], ["#0e2a22", "#c8d0c8"], ["#4a4650", "#e8e4ec"], ["#1a0a10", "#b8a8b0"], ["#2a1a3a", "#d0c4dc"]]),
    bindings: ["b-leather", "b-leather", "b-cloth", "b-leather", "b-vellum", "b-leather"],
    decor: { objects: ["candelabra", "raven", "rose", "skull", "candle", "hourglass", "ink"], tops: ["skull", "raven", "candle"],
      cols: ["#0e0c10", "#5a0a14", "#2a0e2a", "#3a0a1a", "#1e1e24", "#0e2a22", "#4a4650", "#1a0a10"], bindings: ["b-leather", "b-leather", "b-cloth"] },
    motes: { kind: "dust", n: 30, rgb: "235,215,220" },
    sconces: true,
  },
  modern: {
    name: "Bright Bookshop", blurb: "Pale oak, white walls, plants and colourful jackets.",
    swatch: ["#f4f1ea", "#d9b48a", "#3e5e4a"],
    fonts: GF("family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700;1,9..40,400"),
    kicker: "Books · Films · Shows", sub: "A bright little shop of everything you love.",
    palette: P([["#e3b23c", "#1d1b16"], ["#e2725b", "#fff6ec"], ["#2a7f7a", "#f4efe4"], ["#8fb4d9", "#16202c"], ["#9caf88", "#1b2116"], ["#f2c4c0", "#3a1a18"], ["#efe7d6", "#2a2620"], ["#1f1f1f", "#f4efe4"], ["#c0643a", "#fff4ea"], ["#28406a", "#f2eee4"]]),
    bindings: ["b-jacket", "b-jacket", "b-cloth", "b-jacket", "b-jacket", "b-cloth"],
    decor: { objects: ["pothos", "vase", "frame", "sphere", "succulent", "mug"], tops: ["succulent", "sphere", "mug"],
      cols: ["#efe7d6", "#f6f3ec", "#1f1f1f", "#9caf88", "#e3b23c", "#8fb4d9", "#e2725b", "#d8d2c4"], bindings: ["b-cloth", "b-jacket", "b-jacket"] },
    motes: { kind: "none", n: 0, rgb: "0,0,0" },
    sconces: false,
  },
};

export const THEME_KEY = "shelves.theme";
export const currentThemeId = () => (THEMES[document.documentElement.dataset.theme] ? document.documentElement.dataset.theme : "academia");
// The five night-forest rooms shown first in the chooser; the older looks follow.
export const NEW_ROOMS = ["moonwood", "starfall", "elderglow", "fernstar", "duskleaf"];
export const theme = () => THEMES[currentThemeId()];
export function savedTheme(fallback = "academia") {
  try { return localStorage.getItem(THEME_KEY) || fallback; } catch { return fallback; }
}

export function applyTheme(id, remember = true) {
  if (!THEMES[id]) id = "academia";
  const t = THEMES[id];
  document.documentElement.dataset.theme = id;
  let link = document.getElementById("themeFonts");
  if (t.fonts) {
    if (!link) { link = document.createElement("link"); link.id = "themeFonts"; link.rel = "stylesheet"; document.head.appendChild(link); }
    if (link.getAttribute("href") !== t.fonts) link.setAttribute("href", t.fonts);
  } else if (link) link.remove();
  setPalette(t.palette);
  setDecor(t.decor);
  if (remember) { try { localStorage.setItem(THEME_KEY, id); } catch { /* private mode */ } }
  return t;
}
