// Little hand-drawn bits: icons, ivy, fairy lights, shelf decorations.
import { hash } from "./covers.js";

const s = (d, extra = "") => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="square" stroke-linejoin="miter" aria-hidden="true" ${extra}>${d}</svg>`;
export const ICON = {
  book: s('<path d="M4 19.5V5a2 2 0 0 1 2-2h13v16H6a2 2 0 0 0-2 2zm0 0A2 2 0 0 0 6 22h13"/><path d="M8 7h7"/>'),
  film: s('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 4v16M17 4v16M3 9h4M3 15h4M17 9h4M17 15h4"/>'),
  show: s('<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M8 2l4 4 4-4M8 22h8"/>'),
  song: s('<path d="M9 18V5l11-2v13"/><circle cx="6.5" cy="18" r="2.5"/><circle cx="17.5" cy="16" r="2.5"/>'),
  quill: s('<path d="M20 3C11 4 6 10 5 19"/><path d="M20 3c-1 5-4 9-10 11"/><path d="M5 19l-2 2"/><path d="M9.5 10.5L14 12"/>'),
  search: s('<circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/>'),
  sparkle: s('<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/>'),
  share: s('<path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><path d="M16 6l-4-4-4 4M12 2v13"/>'),
  link: s('<path d="M10 14a5 5 0 0 0 7 0l3-3a5 5 0 0 0-7-7l-1 1"/><path d="M14 10a5 5 0 0 0-7 0l-3 3a5 5 0 0 0 7 7l1-1"/>'),
  door: s('<path d="M15 18l-6-6 6-6"/>'),
  user: s('<circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 4.5-6 8-6s6.5 2 8 6"/>'),
  plus: s('<path d="M12 5v14M5 12h14"/>'),
  wand: s('<path d="M4 20L16 8"/><path d="M15 3v2M19 7h2M18 4l1.5-1.5M20.5 9.5L19 11M12 5l1 1"/>'),
  move: s('<path d="M7 7h11l-3-3M17 17H6l3 3"/>'),
  trash: s('<path d="M4 7h16M10 11v6M14 11v6M6 7l1 13h10l1-13M9 7V4h6v3"/>'),
  edit: s('<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13 7l4 4"/>'),
  heart: s('<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10z"/>'),
  download: s('<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>'),
  brush: s('<path d="M14 4l6 6-8.5 8.5a3 3 0 0 1-4.2 0l-1.8-1.8a3 3 0 0 1 0-4.2z"/><path d="M5.5 14.5C4 16 4 19 2 21c3 0 5.5-.5 7-2"/><path d="M11 7l6 6"/>'),
  door2: s('<path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/><path d="M3 21h18M14 12h.01"/>'),
};

// An engraved rule with a lozenge, like a printer's ornament.
export const FLOURISH = `<svg class="flourish" viewBox="0 0 420 18" fill="none" stroke="currentColor" aria-hidden="true">
  <path d="M0 9h176M244 9h176" stroke-width="1"/><path d="M40 5h136M244 13h136" stroke-width=".6" opacity=".6"/>
  <path d="M210 1l8 8-8 8-8-8z" fill="currentColor" stroke="none"/><path d="M190 9l6-5 6 5-6 5zM218 9l6-5 6 5-6 5z" stroke-width="1"/>
  <rect x="0" y="7" width="4" height="4" fill="currentColor" stroke="none"/><rect x="416" y="7" width="4" height="4" fill="currentColor" stroke="none"/></svg>`;

// A window onto the night (or day), shaped and dressed for each room.
const WIN = {
  academia: { shape: "lancet", sky: ["#1b2433", "#222b38", "#2b2a2c"], moon: "#e9e4cf", weather: "rain", frame: "#14100c", trim: "#3a2c1e" },
  gothic: { shape: "lancet", sky: ["#2a0a14", "#3d0f1c", "#1a0a12"], moon: "#e8c0b0", weather: "none", frame: "#0a0809", trim: "#4a4a52", stained: true },
  forest: { shape: "arch", sky: ["#0d2a26", "#123a30", "#0c1f18"], moon: "#e8f0d0", weather: "fireflies", frame: "#1a1a10", trim: "#3a4a2a", trees: true },
  celestial: { shape: "round", sky: ["#0a1030", "#141c48", "#0a0e26"], moon: "#f4ecd0", weather: "stars", frame: "#0a0c18", trim: "#b8975a" },
  cabin: { shape: "rect", sky: ["#141c30", "#1e2a44", "#2c3446"], moon: "#f0ecd8", weather: "snow", frame: "#3a2412", trim: "#6a4426", trees: true },
  modern: { shape: "tall", sky: ["#b9d6ec", "#d6e7f2", "#eef4f6"], moon: null, weather: "clouds", frame: "#2a2a2a", trim: "#d8d4cc" },
};
const SHAPES = {
  lancet: "M10 240 V96 Q10 34 60 6 Q110 34 110 96 V240 Z",
  arch: "M10 240 V62 A50 50 0 0 1 110 62 V240 Z",
  round: "M60 20 A50 50 0 1 1 59.9 20 Z",
  rect: "M8 240 V30 H112 V240 Z",
  tall: "M12 240 V4 H108 V240 Z",
};
export function windowSVG(i = 0, theme = "academia") {
  const w = WIN[theme] || WIN.academia; const id = "gw" + theme + i; const clip = SHAPES[w.shape];
  const mx = 78 - (i % 3) * 14, my = w.shape === "round" ? 60 + (i % 2) * 10 : 56 + (i % 2) * 18;
  const stars = (n, top = 240) => Array.from({ length: n }, (_, k) => `<rect x="${(k * 47 + i * 19) % 116 + 2}" y="${(k * 71 + i * 23) % top}" width="${k % 5 ? 1.2 : 2}" height="${k % 5 ? 1.2 : 2}" fill="#fff" opacity="${.4 + (k % 3) * .2}"/>`).join("");
  let scene = "";
  if (w.weather === "stars") scene += stars(46, 160) + `<path d="M24 54 L40 40 L58 50 L74 34 M40 40 L36 22" stroke="#cdd6ff" stroke-width=".5" opacity=".5"/>`;
  else if (w.weather !== "clouds") scene += stars(8);
  if (w.moon) scene += w.weather === "stars"
    ? `<circle cx="${mx}" cy="${my}" r="12" fill="${w.moon}"/><circle cx="${mx + 5}" cy="${my - 3}" r="11" fill="${w.sky[1]}"/>`
    : `<circle cx="${mx}" cy="${my}" r="11" fill="${w.moon}" opacity=".85"/><circle cx="${mx}" cy="${my}" r="30" fill="${w.moon}" opacity=".06"/>`;
  if (w.weather === "clouds") scene += `<g fill="#fff" opacity=".85"><ellipse cx="${30 + (i * 17) % 50}" cy="60" rx="22" ry="8"/><ellipse cx="${44 + (i * 17) % 50}" cy="54" rx="14" ry="9"/><ellipse cx="${80 - (i * 11) % 40}" cy="120" rx="18" ry="6"/></g>`;
  if (w.trees) scene += `<path d="M0 240 V200 L10 180 L20 200 L26 170 L38 200 L48 176 L60 204 L70 168 L82 202 L92 182 L104 206 L114 174 L120 196 V240 Z" fill="${theme === "cabin" ? "#0c1420" : "#06120c"}"/>` + (theme === "cabin" ? `<path d="M0 240 V226 Q60 214 120 226 V240 Z" fill="#dfe6ee"/>` : "");
  if (w.weather === "rain") scene += `<g class="rain">${Array.from({ length: 16 }, (_, k) => `<line x1="${(k * 37 + i * 13) % 120}" y1="${(k * 53) % 240}" x2="${(k * 37 + i * 13) % 120 - 3}" y2="${(k * 53) % 240 + 18}" stroke="#a9b8c9" stroke-width=".7" opacity=".35"/>`).join("")}</g>`;
  if (w.weather === "snow") scene += `<g class="snow">${Array.from({ length: 22 }, (_, k) => `<circle cx="${(k * 37 + i * 13) % 120}" cy="${(k * 53) % 240}" r="${k % 3 ? 1.1 : 1.7}" fill="#fff" opacity=".8"/>`).join("")}</g>`;
  if (w.weather === "fireflies") scene += Array.from({ length: 9 }, (_, k) => `<circle class="ff" style="animation-delay:${-k * .5}s" cx="${(k * 41 + i * 17) % 110 + 5}" cy="${150 + (k * 29) % 80}" r="1.6" fill="#e8ff9a"/>`).join("");
  if (w.stained) scene += `<g opacity=".55"><path d="M10 150 H110 V200 H10Z" fill="#5a0e1e"/><path d="M60 150 V200" stroke="#0a0809" stroke-width="3"/><circle cx="35" cy="175" r="10" fill="#2a1a5a"/><circle cx="85" cy="175" r="10" fill="#1a3a2a"/><path d="M10 200 H110 V240 H10Z" fill="#3a0a40"/></g>`;
  const bars = {
    lancet: `<path d="M60 6 V240"/><path d="M10 150 H110"/><path d="M10 200 H110"/><path d="M10 104 Q10 70 35 52 Q60 70 60 104"/><path d="M60 104 Q60 70 85 52 Q110 70 110 104"/><circle cx="60" cy="36" r="13"/>`,
    arch: `<path d="M60 12 V240"/><path d="M10 110 H110"/><path d="M10 176 H110"/><path d="M60 62 m-26 0 a26 26 0 0 1 52 0"/>`,
    round: `<path d="M60 20 V120 M10 70 H110"/><circle cx="60" cy="70" r="20"/>`,
    rect: `<path d="M60 30 V240"/><path d="M8 100 H112"/><path d="M8 170 H112"/>`,
    tall: `<path d="M12 150 H108"/>`,
  }[w.shape];
  const outer = `<path d="${clip}" fill="${w.frame}" stroke="${w.frame}" stroke-width="16" stroke-linejoin="round"/>`;
  const sill = w.shape === "round" ? "" : `<rect x="0" y="234" width="120" height="6" fill="${w.trim}"/>`;
  return `<div class="window w-${w.shape}"><svg viewBox="0 0 120 240" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
    <defs><linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${w.sky[0]}"/><stop offset=".6" stop-color="${w.sky[1]}"/><stop offset="1" stop-color="${w.sky[2]}"/></linearGradient>
    <clipPath id="${id}c"><path d="${clip}"/></clipPath></defs>
    ${outer}
    <g clip-path="url(#${id}c)"><rect width="120" height="240" fill="url(#${id}g)"/>${scene}</g>
    <g fill="none" stroke="${w.frame}" stroke-width="${w.shape === "tall" ? 4 : 5}" clip-path="url(#${id}c)">${bars}</g>
    <path d="${clip}" fill="none" stroke="${w.trim}" stroke-width="${w.shape === "tall" ? 6 : 2}"/>${sill}
  </svg></div>`;
}
export const gothicWindowSVG = i => windowSVG(i, "academia");

// A trailing ivy vine that hangs from a shelf board.
export function vineSVG(seed) {
  const len = 70 + (hash("vl" + seed) % 110), sway = (hash("vs" + seed) % 2 ? 1 : -1);
  let leaves = "", d = "M10 0";
  for (let y = 10, k = 0; y < len; y += 11, k++) {
    const x = 10 + Math.sin(y / 18) * 5 * sway;
    d += ` L${x.toFixed(1)} ${y}`;
    const side = k % 2 ? 1 : -1, r = side * (40 + (hash("vr" + seed + k) % 30));
    leaves += `<path transform="translate(${x.toFixed(1)} ${y}) rotate(${r}) scale(${0.55 + (hash("vz" + seed + k) % 30) / 100})" d="M0 0 C -6 -2, -9 -10, -6 -15 C -3 -12, 0 -14, 0 -18 C 0 -14, 3 -12, 6 -15 C 9 -10, 6 -2, 0 0Z" fill="url(#g-leaf)"/>`;
  }
  return `<svg class="vine-svg" width="20" height="${len + 10}" viewBox="0 0 20 ${len + 10}" aria-hidden="true"><path d="${d}" stroke="#2c4a22" stroke-width="1.3" fill="none"/>${leaves}</svg>`;
}

// A brass wall sconce with a single candle.
export const SCONCE = `<div class="sconce" aria-hidden="true"><svg viewBox="0 0 40 90">
  <circle cx="20" cy="18" r="22" fill="#ffc46b" opacity=".12"/>
  <path class="flame" d="M20 6 C 16 13, 17 19, 20 21 C 23 19, 24 13, 20 6 Z" fill="#ffcf6e"/><path d="M20 12 C 19 15, 19 18, 20 19 C 21 18, 21 15, 20 12Z" fill="#fff4d0"/>
  <rect x="16" y="21" width="8" height="26" fill="#e6dcc3"/><rect x="16" y="21" width="3" height="26" fill="#fff" opacity=".25"/>
  <path d="M10 47 H30 L27 52 H13 Z" fill="#a8844c"/><path d="M20 52 V66 M20 66 H34 V80" stroke="#a8844c" stroke-width="3" fill="none"/>
  <rect x="30" y="76" width="8" height="12" fill="#7d6036"/></svg></div>`;

/* ═══════════ shelf objects ═══════════
   Shared gradients live once in the page (SHARED_DEFS); objects reference them,
   so brass, glass, marble and bone are all lit from the upper left. */
export const SHARED_DEFS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
  <linearGradient id="g-brass" x1="0" x2="1"><stop offset="0" stop-color="#5e4422"/><stop offset=".22" stop-color="#e9cf93"/><stop offset=".38" stop-color="#b8924f"/><stop offset=".7" stop-color="#7a5a2c"/><stop offset="1" stop-color="#3d2b14"/></linearGradient>
  <linearGradient id="g-brass-v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#e9cf93"/><stop offset=".45" stop-color="#a8823f"/><stop offset="1" stop-color="#4a3418"/></linearGradient>
  <radialGradient id="g-sphere" cx=".36" cy=".32" r=".75"><stop offset="0" stop-color="#cdb98a"/><stop offset=".35" stop-color="#9c8150"/><stop offset=".75" stop-color="#5a4424"/><stop offset="1" stop-color="#22180c"/></radialGradient>
  <radialGradient id="g-marble" cx=".38" cy=".3" r=".8"><stop offset="0" stop-color="#f4f0e6"/><stop offset=".5" stop-color="#cfc8b9"/><stop offset="1" stop-color="#6e685c"/></radialGradient>
  <linearGradient id="g-marble-h" x1="0" x2="1"><stop offset="0" stop-color="#e9e4d8"/><stop offset=".55" stop-color="#bdb6a6"/><stop offset="1" stop-color="#5f594e"/></linearGradient>
  <radialGradient id="g-bone" cx=".38" cy=".32" r=".8"><stop offset="0" stop-color="#f1e7cf"/><stop offset=".55" stop-color="#cbbb98"/><stop offset="1" stop-color="#6b5c42"/></radialGradient>
  <linearGradient id="g-wax" x1="0" x2="1"><stop offset="0" stop-color="#fbf4e2"/><stop offset=".45" stop-color="#eadfc4"/><stop offset="1" stop-color="#9c8d6c"/></linearGradient>
  <radialGradient id="g-flame" cx=".5" cy=".75" r=".6"><stop offset="0" stop-color="#fffbe8"/><stop offset=".35" stop-color="#ffd77a"/><stop offset=".8" stop-color="#f08a2a"/><stop offset="1" stop-color="#f08a2a" stop-opacity="0"/></radialGradient>
  <radialGradient id="g-glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#ffcf7a" stop-opacity=".55"/><stop offset=".4" stop-color="#ffb860" stop-opacity=".18"/><stop offset="1" stop-color="#ffb860" stop-opacity="0"/></radialGradient>
  <linearGradient id="g-green-glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5fa47e"/><stop offset=".35" stop-color="#1f5a3c"/><stop offset="1" stop-color="#0b2618"/></linearGradient>
  <linearGradient id="g-glass" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".05"/><stop offset=".25" stop-color="#fff" stop-opacity=".35"/><stop offset=".35" stop-color="#fff" stop-opacity=".06"/><stop offset="1" stop-color="#fff" stop-opacity=".12"/></linearGradient>
  <linearGradient id="g-ink" x1="0" x2="1"><stop offset="0" stop-color="#1c2a36"/><stop offset=".3" stop-color="#3b5266"/><stop offset=".45" stop-color="#101820"/><stop offset="1" stop-color="#05080b"/></linearGradient>
  <linearGradient id="g-wood" x1="0" x2="1"><stop offset="0" stop-color="#2a170c"/><stop offset=".3" stop-color="#6e4224"/><stop offset="1" stop-color="#1e1008"/></linearGradient>
  <linearGradient id="g-sand" x1="0" x2="1"><stop offset="0" stop-color="#e3c48a"/><stop offset="1" stop-color="#9b7a44"/></linearGradient>
  <linearGradient id="g-quill" x1="0" x2="1"><stop offset="0" stop-color="#f4eee0"/><stop offset="1" stop-color="#a99f8a"/></linearGradient>
  <linearGradient id="g-leaf" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7fa858"/><stop offset=".5" stop-color="#3c6a32"/><stop offset="1" stop-color="#1a3a1c"/></linearGradient>
  <linearGradient id="g-leaf2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#b4d27a"/><stop offset=".55" stop-color="#5e9244"/><stop offset="1" stop-color="#2e5a2a"/></linearGradient>
  <linearGradient id="g-terra" x1="0" x2="1"><stop offset="0" stop-color="#6a3018"/><stop offset=".3" stop-color="#c8784a"/><stop offset=".7" stop-color="#9a5232"/><stop offset="1" stop-color="#4a2210"/></linearGradient>
  <linearGradient id="g-ceramic" x1="0" x2="1"><stop offset="0" stop-color="#c9c4b8"/><stop offset=".3" stop-color="#ffffff"/><stop offset=".65" stop-color="#e6e1d6"/><stop offset="1" stop-color="#a39d90"/></linearGradient>
  <linearGradient id="g-sage" x1="0" x2="1"><stop offset="0" stop-color="#7c8a6c"/><stop offset=".3" stop-color="#c4cfb2"/><stop offset=".7" stop-color="#97a585"/><stop offset="1" stop-color="#5c6950"/></linearGradient>
  <linearGradient id="g-silver" x1="0" x2="1"><stop offset="0" stop-color="#4c4c54"/><stop offset=".25" stop-color="#ececf2"/><stop offset=".45" stop-color="#a8a8b4"/><stop offset=".75" stop-color="#62626c"/><stop offset="1" stop-color="#2c2c32"/></linearGradient>
  <linearGradient id="g-iron" x1="0" x2="1"><stop offset="0" stop-color="#0e0e10"/><stop offset=".3" stop-color="#4a4a52"/><stop offset=".6" stop-color="#1e1e22"/><stop offset="1" stop-color="#08080a"/></linearGradient>
  <linearGradient id="g-rust" x1="0" x2="1"><stop offset="0" stop-color="#6e2410"/><stop offset=".3" stop-color="#c4643a"/><stop offset=".7" stop-color="#94401e"/><stop offset="1" stop-color="#4e180a"/></linearGradient>
  <radialGradient id="g-rose" cx=".4" cy=".35" r=".7"><stop offset="0" stop-color="#e8505e"/><stop offset=".55" stop-color="#9a1424"/><stop offset="1" stop-color="#46050e"/></radialGradient>
  <radialGradient id="g-moon" cx=".38" cy=".32" r=".78"><stop offset="0" stop-color="#f6f4ec"/><stop offset=".6" stop-color="#c8c5ba"/><stop offset="1" stop-color="#5e5c56"/></radialGradient>
  <linearGradient id="g-crystal" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#eedcff"/><stop offset=".4" stop-color="#9c6ad6"/><stop offset="1" stop-color="#3e2270"/></linearGradient>
  <radialGradient id="g-glow-green" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#e6ff9a" stop-opacity=".5"/><stop offset=".45" stop-color="#b8f070" stop-opacity=".14"/><stop offset="1" stop-color="#b8f070" stop-opacity="0"/></radialGradient>
  <radialGradient id="g-glow-cool" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#dfe8ff" stop-opacity=".35"/><stop offset=".45" stop-color="#b8c8ff" stop-opacity=".1"/><stop offset="1" stop-color="#b8c8ff" stop-opacity="0"/></radialGradient>
</defs></svg>`;

const svgObj = (cls, w, h, body) => ({ w: w + 14, html: `<div class="deco obj ${cls}" style="width:${w}px"><svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${body}</svg></div>` });

const OBJECTS = {
  candle: () => svgObj("candle", 44, 150, `
    <circle class="halo" cx="22" cy="30" r="40" fill="url(#g-glow)"/>
    <path class="flame" d="M22 8 C 16 18, 17 27, 22 30 C 27 27, 28 18, 22 8 Z" fill="url(#g-flame)"/>
    <rect x="21.3" y="29" width="1.4" height="5" fill="#1a130d"/>
    <path d="M16 34 H28 V96 H16 Z" fill="url(#g-wax)"/>
    <path d="M16 34 H28 C 28 40 26 39 25.5 46 C 25 41 23 40 22.5 44 C 22 39 19 41 18.5 50 C 18 44 16 41 16 38 Z" fill="#fffaf0" opacity=".85"/>
    <path d="M10 96 H34 L32 102 H12 Z" fill="url(#g-brass)"/><rect x="18" y="102" width="8" height="10" fill="url(#g-brass)"/>
    <ellipse cx="22" cy="114" rx="7" ry="3" fill="url(#g-brass)"/><path d="M19 116 h6 l3 18 h-12 z" fill="url(#g-brass)"/>
    <path d="M6 134 H38 L42 142 H2 Z" fill="url(#g-brass)"/><rect x="1" y="142" width="42" height="5" fill="#4a3418"/>`),
  lamp: () => svgObj("lamp", 86, 132, `
    <ellipse class="halo" cx="43" cy="104" rx="60" ry="26" fill="url(#g-glow)"/>
    <path d="M14 44 L72 44 L66 28 C 60 22, 26 22, 20 28 Z" fill="url(#g-green-glass)"/>
    <path d="M20 28 C 26 22, 60 22, 66 28" stroke="#9fd0b2" stroke-width="1" fill="none" opacity=".6"/>
    <path d="M22 30 C 30 26, 40 25, 46 26" stroke="#fff" stroke-width="2" opacity=".35" fill="none"/>
    <rect x="12" y="43" width="62" height="3" fill="url(#g-brass)"/>
    <path d="M16 46 L70 46 L78 60 L8 60 Z" fill="#ffdc96" opacity=".18"/>
    <rect x="40.5" y="46" width="5" height="62" fill="url(#g-brass)"/><rect x="38" y="62" width="10" height="5" fill="url(#g-brass)"/>
    <path d="M56 48 V68" stroke="url(#g-brass)" stroke-width="1.6"/><circle cx="56" cy="70" r="2.4" fill="url(#g-brass)"/>
    <path d="M18 108 H68 L72 118 H14 Z" fill="url(#g-brass)"/><rect x="10" y="118" width="66" height="8" fill="url(#g-brass-v)"/>`),
  globe: () => svgObj("globe", 74, 132, `
    <circle cx="37" cy="52" r="29" fill="url(#g-sphere)"/>
    <path d="M18 40 c7 -5 12 2 16 -2 s9 -9 14 -4 c5 7 -5 12 0 16 s12 0 9 9 c-5 7 -14 5 -18 9 M13 58 c7 0 9 7 14 11" stroke="#3a2a14" stroke-width="3.2" fill="none" opacity=".55"/>
    <ellipse cx="37" cy="52" rx="29" ry="10" fill="none" stroke="#2a1d0e" stroke-width=".6" opacity=".5"/><path d="M37 23 v58" stroke="#2a1d0e" stroke-width=".6" opacity=".5"/>
    <ellipse cx="28" cy="40" rx="9" ry="6" fill="#fff" opacity=".14"/>
    <path d="M37 17 A 35 35 0 0 1 37 87" stroke="url(#g-brass)" stroke-width="3.4" fill="none"/>
    <path d="M37 87 V108" stroke="url(#g-brass)" stroke-width="5"/><path d="M18 108 H56 L51 118 H23 Z" fill="url(#g-wood)"/><rect x="13" y="118" width="48" height="8" fill="url(#g-wood)"/>`),
  skull: () => svgObj("skull", 76, 104, `
    <rect x="2" y="70" width="72" height="14" fill="#4a1418"/><rect x="2" y="70" width="72" height="14" fill="url(#g-glass)" opacity=".35"/><rect x="2" y="73" width="72" height="1.2" fill="url(#g-brass)"/><rect x="2" y="80" width="72" height="1.2" fill="url(#g-brass)"/><rect x="70" y="71" width="3" height="12" fill="#e3d8bd"/>
    <rect x="6" y="84" width="66" height="14" fill="#1d3226"/><rect x="6" y="84" width="66" height="14" fill="url(#g-glass)" opacity=".3"/><rect x="6" y="87" width="66" height="1.2" fill="url(#g-brass)"/><rect x="6" y="94" width="66" height="1.2" fill="url(#g-brass)"/>
    <path d="M38 14 C 21 14, 14 26, 15 38 C 16 45, 19 49, 23 51 L 23 60 C 26 66, 50 66, 53 60 L 53 51 C 57 49, 60 45, 61 38 C 62 26, 55 14, 38 14 Z" fill="url(#g-bone)"/>
    <path d="M22 35 C 24 31, 31 31, 33 36 C 33 42, 24 44, 22 39 Z M43 36 C 45 31, 52 31, 54 35 C 54 40, 45 42, 43 36 Z" fill="#1a120a"/>
    <path d="M38 41 L34 50 H42 Z" fill="#2a1d12"/>
    <path d="M27 58 V63 M31 59 V64 M35 59 V65 M39 59 V65 M43 59 V64 M47 58 V63" stroke="#7d6e52" stroke-width="1"/>
    <path d="M19 28 C 23 20, 31 17, 37 17" stroke="#fff" stroke-width="2" opacity=".35" fill="none"/>`),
  hourglass: () => svgObj("hourglass", 50, 110, `
    <rect x="3" y="4" width="44" height="8" fill="url(#g-wood)"/><rect x="3" y="98" width="44" height="8" fill="url(#g-wood)"/>
    <rect x="6" y="12" width="4" height="86" fill="url(#g-wood)"/><rect x="40" y="12" width="4" height="86" fill="url(#g-wood)"/>
    <path d="M13 12 H37 C 37 34 27 46 26 55 C 27 64 37 76 37 98 H13 C 13 76 23 64 24 55 C 23 46 13 34 13 12 Z" fill="#d9e4e6" opacity=".14" stroke="#e8f0f0" stroke-opacity=".4"/>
    <path d="M16 26 H34 C 32 38 27 45 25 52 C 23 45 18 38 16 26 Z" fill="url(#g-sand)"/>
    <path d="M14 98 C 16 84 22 78 25 74 C 28 78 34 84 36 98 Z" fill="url(#g-sand)"/><path d="M25 55 V74" stroke="#d9b779" stroke-width="1"/>
    <path d="M16 16 C 16 30 20 40 22 48" stroke="#fff" stroke-width="1.6" opacity=".4" fill="none"/>`),
  bust: () => svgObj("bust", 66, 138, `
    <path d="M26 10 C 37 3, 50 10, 48 25 C 50 29, 51 33, 48 35 L 48 43 C 46 49, 39 51, 33 50 L 33 58 L 24 58 L 24 47 C 17 43, 16 32, 18 24 C 19 17, 22 13, 26 10 Z" fill="url(#g-marble)"/>
    <path d="M23 13 c4-6 11-7 16-4 c5-3 10 0 10 5 c3 2 3 7 1 9 M21 20 c2-2 5-2 7 0" stroke="#a9a395" stroke-width="2.2" fill="none"/>
    <path d="M46 28 l3 4 -3 1" stroke="#8a8478" stroke-width="1" fill="none"/>
    <path d="M8 82 C 10 66, 19 60, 24 58 L 33 58 C 42 60, 53 66, 57 82 Z" fill="url(#g-marble)"/><path d="M22 62 L 35 80" stroke="#9c968a" stroke-width="1.3"/>
    <rect x="16" y="82" width="34" height="6" fill="url(#g-marble-h)"/><rect x="21" y="88" width="24" height="18" fill="url(#g-marble-h)"/>
    <rect x="11" y="106" width="44" height="9" fill="url(#g-marble-h)"/><rect x="6" y="115" width="54" height="12" fill="url(#g-marble-h)"/><path d="M6 120 h54" stroke="#8a8579" stroke-width=".7"/>`),
  ink: () => svgObj("ink", 62, 118, `
    <path d="M42 4 C 33 22, 27 46, 27 80 L 30 80 C 31 50, 38 26, 49 9 Z" fill="url(#g-quill)"/><path d="M42 4 C 37 20, 32 36, 29 56" stroke="#8d8370" stroke-width=".8" fill="none"/>
    <rect x="11" y="84" width="38" height="26" fill="url(#g-ink)"/><rect x="11" y="84" width="38" height="26" fill="url(#g-glass)"/>
    <rect x="19" y="76" width="22" height="9" fill="url(#g-brass)"/><rect x="7" y="110" width="46" height="5" fill="url(#g-wood)"/>`),
  /* forest */
  fern: () => svgObj("fern", 72, 124, `<path d="M36 90 C 30 62, 16 46, 2 42" stroke="url(#g-leaf)" stroke-width="8" stroke-dasharray="2.4 1.3" fill="none"/><path d="M36 90 C 30 62, 16 46, 2 42" stroke="#24461f" stroke-width=".8" fill="none"/><path d="M36 90 C 42 60, 56 44, 70 40" stroke="url(#g-leaf)" stroke-width="8" stroke-dasharray="2.4 1.3" fill="none"/><path d="M36 90 C 42 60, 56 44, 70 40" stroke="#24461f" stroke-width=".8" fill="none"/><path d="M36 90 C 34 56, 34 30, 38 6" stroke="url(#g-leaf)" stroke-width="9" stroke-dasharray="2.4 1.3" fill="none"/><path d="M36 90 C 34 56, 34 30, 38 6" stroke="#24461f" stroke-width=".8" fill="none"/><path d="M36 90 C 24 74, 12 70, 2 74" stroke="url(#g-leaf)" stroke-width="6" stroke-dasharray="2.4 1.3" fill="none"/><path d="M36 90 C 24 74, 12 70, 2 74" stroke="#24461f" stroke-width=".8" fill="none"/><path d="M36 90 C 48 74, 60 70, 70 74" stroke="url(#g-leaf)" stroke-width="6" stroke-dasharray="2.4 1.3" fill="none"/><path d="M36 90 C 48 74, 60 70, 70 74" stroke="#24461f" stroke-width=".8" fill="none"/><path d="M36 90 C 28 60, 22 38, 18 20" stroke="url(#g-leaf)" stroke-width="7" stroke-dasharray="2.4 1.3" fill="none"/><path d="M36 90 C 28 60, 22 38, 18 20" stroke="#24461f" stroke-width=".8" fill="none"/><path d="M36 90 C 44 60, 50 38, 54 22" stroke="url(#g-leaf)" stroke-width="7" stroke-dasharray="2.4 1.3" fill="none"/><path d="M36 90 C 44 60, 50 38, 54 22" stroke="#24461f" stroke-width=".8" fill="none"/>
    <path d="M18 92 H54 L50 120 H22 Z" fill="url(#g-terra)"/><rect x="15" y="86" width="42" height="9" fill="url(#g-terra)"/><rect x="15" y="86" width="42" height="1.5" fill="#f0b080" opacity=".4"/>`),
  cloche: () => svgObj("cloche", 66, 112, `
    <rect x="4" y="98" width="58" height="11" fill="url(#g-wood)"/><ellipse cx="33" cy="98" rx="26" ry="4" fill="#24361a"/>
    <ellipse cx="20" cy="96" rx="9" ry="4" fill="#3c5a26"/><ellipse cx="44" cy="96" rx="10" ry="4" fill="#4a6a2c"/>
    <path d="M22 97 V83" stroke="#efe6d2" stroke-width="3"/><path d="M13 85 Q22 70 31 85 Z" fill="#b8322a"/><circle cx="19" cy="80" r="1.2" fill="#fff"/><circle cx="25" cy="79" r="1" fill="#fff"/>
    <path d="M41 97 V88" stroke="#efe6d2" stroke-width="2.4"/><path d="M35 89 Q41 79 47 89 Z" fill="#c8402e"/><circle cx="41" cy="84" r=".9" fill="#fff"/>
    <path d="M9 98 C 7 70, 12 42, 33 30 C 54 42, 59 70, 57 98 Z" fill="#d8eee6" opacity=".12" stroke="#eef8f4" stroke-opacity=".5"/>
    <path d="M15 90 C 14 68, 18 50, 27 40" stroke="#fff" stroke-opacity=".4" stroke-width="2" fill="none"/>
    <circle cx="33" cy="26" r="4.5" fill="url(#g-brass)"/>`),
  crystal: () => svgObj("crystal", 58, 74, `
    <path d="M4 72 H54 L49 62 H9 Z" fill="#2a2234"/>
    <path d="M12 64 L16 30 L22 22 L27 64 Z" fill="url(#g-crystal)"/><path d="M22 22 L27 64 L22 64 Z" fill="#2a1450" opacity=".35"/>
    <path d="M23 64 L27 14 L33 3 L39 16 L37 64 Z" fill="url(#g-crystal)"/><path d="M33 3 L39 16 L37 64 L32 64 Z" fill="#2a1450" opacity=".3"/>
    <path d="M35 64 L41 34 L47 30 L50 64 Z" fill="url(#g-crystal)"/>
    <path d="M28 16 L30 56 M17 32 L19 58" stroke="#fff" stroke-opacity=".5" stroke-width="1"/>`),
  fireflyjar: () => svgObj("fireflyjar", 52, 98, `
    <circle class="halo" cx="26" cy="60" r="42" fill="url(#g-glow-green)"/>
    <path d="M9 24 Q26 12 43 24 Z" fill="#cdbb94"/><path d="M9 26 H43" stroke="#8a7650" stroke-width="2"/>
    <rect x="11" y="26" width="30" height="7" fill="url(#g-brass)"/>
    <path d="M8 33 H44 V88 Q44 95 37 95 H15 Q8 95 8 88 Z" fill="#dff2e8" opacity=".14" stroke="#eef8f2" stroke-opacity=".5"/>
    ${[[18, 50], [32, 44], [26, 64], [36, 72], [16, 80], [28, 84], [22, 40]].map(([x, y], k) => `<circle class="ff" style="animation-delay:${-k * .4}s" cx="${x}" cy="${y}" r="1.8" fill="#f2ffb0"/>`).join("")}
    <path d="M13 40 C 12 60, 12 76, 14 88" stroke="#fff" stroke-opacity=".35" stroke-width="2" fill="none"/>`),
  /* celestial */
  telescope: () => svgObj("telescope", 92, 142, `
    <path d="M46 96 L14 140 M46 96 L78 140 M46 96 L46 140" stroke="url(#g-wood)" stroke-width="4"/>
    <rect x="40" y="88" width="12" height="10" fill="url(#g-brass)"/>
    <g transform="rotate(-28 46 84)"><rect x="8" y="77" width="76" height="14" fill="url(#g-brass-v)"/><rect x="0" y="79" width="10" height="10" fill="url(#g-brass-v)"/><rect x="82" y="75" width="9" height="18" fill="url(#g-brass-v)"/><rect x="34" y="76" width="3" height="16" fill="#5e4422"/><rect x="58" y="76" width="3" height="16" fill="#5e4422"/></g>`),
  moon: () => svgObj("moon", 72, 124, `
    <circle class="halo" cx="36" cy="48" r="46" fill="url(#g-glow-cool)"/>
    <circle cx="36" cy="48" r="30" fill="url(#g-moon)"/>
    <circle cx="26" cy="40" r="6" fill="#a19e94" opacity=".55"/><circle cx="44" cy="58" r="8" fill="#a19e94" opacity=".45"/><circle cx="46" cy="36" r="3.5" fill="#a19e94" opacity=".5"/><circle cx="30" cy="62" r="3" fill="#a19e94" opacity=".5"/>
    <path d="M36 78 V100" stroke="url(#g-brass)" stroke-width="4"/><path d="M18 100 H54 L50 110 H22 Z" fill="url(#g-wood)"/><rect x="12" y="110" width="48" height="9" fill="url(#g-wood)"/>`),
  armillary: () => svgObj("armillary", 76, 130, `
    <circle cx="38" cy="52" r="29" fill="none" stroke="url(#g-brass)" stroke-width="2.6"/>
    <ellipse cx="38" cy="52" rx="29" ry="9" fill="none" stroke="url(#g-brass)" stroke-width="2.2"/>
    <ellipse cx="38" cy="52" rx="29" ry="9" fill="none" stroke="url(#g-brass)" stroke-width="2" transform="rotate(-26 38 52)"/>
    <ellipse cx="38" cy="52" rx="9" ry="29" fill="none" stroke="url(#g-brass)" stroke-width="2"/>
    <circle cx="38" cy="52" r="7" fill="url(#g-sphere)"/><path d="M38 14 V90" stroke="url(#g-brass)" stroke-width="1.4"/>
    <path d="M38 90 V108" stroke="url(#g-brass)" stroke-width="5"/><path d="M20 108 H56 L51 118 H25 Z" fill="url(#g-brass)"/><rect x="15" y="118" width="46" height="8" fill="url(#g-brass-v)"/>`),
  starlantern: () => svgObj("starlantern", 52, 112, `
    <circle class="halo" cx="26" cy="62" r="46" fill="url(#g-glow)"/>
    <circle cx="26" cy="8" r="5" fill="none" stroke="url(#g-brass)" stroke-width="2"/>
    <path d="M9 28 L26 13 L43 28 Z" fill="url(#g-brass)"/>
    <rect x="12" y="28" width="28" height="56" fill="#24180c"/>
    <path d="M26 40 l2.6 5.4 6 .8 -4.4 4.1 1.1 5.9 -5.3-2.9 -5.3 2.9 1.1-5.9 -4.4-4.1 6-.8z" fill="#ffd77a"/>
    ${[[17, 66], [33, 70], [26, 76], [19, 36], [34, 34], [30, 60]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.4" fill="#ffd77a"/>`).join("")}
    <rect x="12" y="28" width="28" height="56" fill="none" stroke="url(#g-brass)" stroke-width="2"/>
    <rect x="8" y="84" width="36" height="8" fill="url(#g-brass)"/><rect x="12" y="92" width="28" height="5" fill="url(#g-brass-v)"/>`),
  /* cabin */
  mug: () => svgObj("mug", 58, 78, `
    <path class="steam" d="M22 24 C 16 16, 28 12, 22 3 M32 26 C 26 18, 38 14, 32 5" stroke="#fff" stroke-opacity=".28" stroke-width="2" fill="none"/>
    <path d="M44 40 C 57 40, 57 62, 44 62" stroke="url(#g-rust)" stroke-width="5" fill="none"/>
    <path d="M8 32 H44 V68 Q44 76 36 76 H16 Q8 76 8 68 Z" fill="url(#g-rust)"/>
    <ellipse cx="26" cy="32" rx="18" ry="3.2" fill="#3a1a0c"/><ellipse cx="26" cy="32.6" rx="15" ry="2.2" fill="#5a3418"/>
    <path d="M8 44 H44 M8 48 H44" stroke="#f0e2c8" stroke-width="1.6" opacity=".7"/>`),
  lantern: () => svgObj("lantern", 56, 118, `
    <circle class="halo" cx="28" cy="70" r="50" fill="url(#g-glow)"/>
    <path d="M10 32 C 10 6, 46 6, 46 32" stroke="url(#g-iron)" stroke-width="2.4" fill="none"/>
    <path d="M14 36 L28 24 L42 36 Z" fill="#8a2014"/><rect x="12" y="36" width="32" height="5" fill="#6a180e"/>
    <path d="M14 41 C 6 58, 6 82, 14 96 H42 C 50 82, 50 58, 42 41 Z" fill="#fff2d0" opacity=".18" stroke="#fff" stroke-opacity=".35"/>
    <path class="flame" d="M28 60 C 24 68, 25 76, 28 78 C 31 76, 32 68, 28 60Z" fill="url(#g-flame)"/>
    <rect x="21" y="78" width="14" height="6" fill="url(#g-brass)"/><path d="M12 41 V96 M44 41 V96" stroke="url(#g-iron)" stroke-width="1.6"/>
    <rect x="10" y="96" width="36" height="14" fill="#8a2014"/><rect x="10" y="96" width="36" height="14" fill="url(#g-glass)" opacity=".4"/><rect x="8" y="108" width="40" height="6" fill="#5a120a"/>`),
  succulent: () => svgObj("succulent", 56, 74, `
    ${[[-70, 1], [-40, 1.05], [-10, 1.1], [20, 1.05], [50, 1], [80, .9], [-100, .9], [0, .7], [-45, .7], [40, .7]].map(([r, sc]) => `<path transform="translate(28 46) rotate(${r}) scale(${sc})" d="M0 0 C -6 -8, -5 -20, 0 -26 C 5 -20, 6 -8, 0 0Z" fill="url(#g-leaf2)" stroke="#2e5a2a" stroke-width=".6"/>`).join("")}
    <path d="M12 46 H44 L40 72 H16 Z" fill="url(#g-terra)"/><rect x="10" y="44" width="36" height="6" fill="url(#g-terra)"/>`),
  pinecones: () => svgObj("pinecones", 84, 58, `
    ${[[22, 30, -20], [42, 26, 10], [60, 31, 30]].map(([x, y, r]) => `<g transform="translate(${x} ${y}) rotate(${r})"><ellipse rx="12" ry="9" fill="#5a3418"/>${[-8, -3, 2, 7].map(dx => `<path d="M${dx} -7 q3 7 0 14" stroke="#2a1608" stroke-width="1.4" fill="none"/>`).join("")}<path d="M-10 -2 q10 4 20 0 M-10 3 q10 4 20 0" stroke="#8a5a30" stroke-width="1" fill="none"/></g>`).join("")}
    <path d="M4 36 H80 C 78 50, 64 56, 42 56 C 20 56, 6 50, 4 36 Z" fill="url(#g-wood)"/><path d="M4 36 H80" stroke="#8a5a30" stroke-width="1.4"/>`),
  /* gothic */
  candelabra: () => svgObj("candelabra", 92, 152, `
    ${[[16, 34], [46, 20], [76, 34]].map(([x, y]) => `<circle class="halo" cx="${x}" cy="${y - 10}" r="26" fill="url(#g-glow)"/><path class="flame" d="M${x} ${y - 20} C ${x - 5} ${y - 11}, ${x - 4} ${y - 4}, ${x} ${y - 2} C ${x + 4} ${y - 4}, ${x + 5} ${y - 11}, ${x} ${y - 20} Z" fill="url(#g-flame)"/><rect x="${x - 5}" y="${y}" width="10" height="${70 - y}" fill="url(#g-wax)"/><path d="M${x - 5} ${y} h10 v6 c-1 4 -2 2 -2.5 8 c-.5-5 -2-6 -2.5-2 c-.5-4 -2-3 -2.5 4 c-.4-6 -2-8 -2.5-10z" fill="#fffaf0" opacity=".9"/><rect x="${x - 7}" y="70" width="14" height="4" fill="url(#g-iron)"/>`).join("")}
    <path d="M16 74 C 16 96, 76 96, 76 74" stroke="url(#g-iron)" stroke-width="4" fill="none"/>
    <rect x="43" y="74" width="6" height="58" fill="url(#g-iron)"/><circle cx="46" cy="102" r="5" fill="url(#g-iron)"/>
    <path d="M28 132 H64 L72 144 H20 Z" fill="url(#g-iron)"/><rect x="16" y="144" width="60" height="6" fill="url(#g-iron)"/>`),
  raven: () => svgObj("raven", 72, 100, `
    <path d="M14 72 C 10 52, 24 34, 40 32 C 48 24, 58 22, 62 28 L 72 32 L 61 34 C 61 42, 57 54, 51 64 C 47 74, 37 80, 27 82 L 4 94 L 16 78 Z" fill="#0c0b10"/>
    <path d="M22 64 C 30 52, 42 46, 50 48 M24 70 C 32 60, 42 56, 48 58" stroke="#3c3c50" stroke-width="1.4" fill="none"/>
    <circle cx="58" cy="30" r="1.5" fill="#d8c070"/><path d="M62 28 L72 32 L62 34Z" fill="#202026"/>
    <path d="M36 81 V92 M44 79 V92" stroke="#2a2a2e" stroke-width="2"/>
    <rect x="6" y="92" width="62" height="8" fill="#3a0a12"/><rect x="6" y="94" width="62" height="1" fill="url(#g-silver)"/><rect x="64" y="93" width="3" height="6" fill="#e3d8bd"/>`),
  rose: () => svgObj("rose", 42, 132, `
    <path d="M21 122 C 20 92, 22 52, 21 32" stroke="#2a4a22" stroke-width="2" fill="none"/>
    <path d="M21 72 C 10 66, 8 58, 12 54 C 16 60, 20 64, 21 72Z" fill="url(#g-leaf)"/><path d="M21 84 C 31 80, 34 72, 31 68 C 27 74, 23 78, 21 84Z" fill="url(#g-leaf)"/>
    <circle cx="21" cy="25" r="11" fill="url(#g-rose)"/>
    <path d="M13 23 C 17 14, 26 14, 29 23 M15 29 C 19 33, 26 31, 28 26 M18 20 C 21 17, 25 19, 24 23" stroke="#4a0610" stroke-width="1.2" fill="none"/>
    <path d="M14 132 H28 C 30 118, 26 106, 23 96 V68 H19 V96 C 16 106, 12 118, 14 132Z" fill="#cfe0e8" opacity=".16" stroke="#e8f0f4" stroke-opacity=".45"/>`),
  /* modern */
  pothos: () => svgObj("pothos", 100, 112, `
    <path d="M50 70 C 40 66, 30 70, 24 84 C 20 94, 18 104, 18 110 M50 70 C 62 66, 72 70, 78 80" stroke="#3a6a2c" stroke-width="1.4" fill="none"/>
    <path d="M30 70 H70 L66 108 H34 Z" fill="url(#g-ceramic)"/><rect x="28" y="66" width="44" height="7" fill="url(#g-ceramic)"/>
    <path transform="translate(50 62) rotate(0) scale(1)" d="M0 0 C -8 -6, -9 -16, 0 -21 C 9 -16, 8 -6, 0 0Z" fill="url(#g-leaf2)"/><path transform="translate(50 62) rotate(0) scale(1)" d="M0 0 V-18" stroke="#2e5a2a" stroke-width=".6" opacity=".6"/><path transform="translate(40 60) rotate(-30) scale(0.9)" d="M0 0 C -8 -6, -9 -16, 0 -21 C 9 -16, 8 -6, 0 0Z" fill="url(#g-leaf2)"/><path transform="translate(40 60) rotate(-30) scale(0.9)" d="M0 0 V-18" stroke="#2e5a2a" stroke-width=".6" opacity=".6"/><path transform="translate(60 60) rotate(28) scale(0.9)" d="M0 0 C -8 -6, -9 -16, 0 -21 C 9 -16, 8 -6, 0 0Z" fill="url(#g-leaf2)"/><path transform="translate(60 60) rotate(28) scale(0.9)" d="M0 0 V-18" stroke="#2e5a2a" stroke-width=".6" opacity=".6"/><path transform="translate(32 64) rotate(-60) scale(0.85)" d="M0 0 C -8 -6, -9 -16, 0 -21 C 9 -16, 8 -6, 0 0Z" fill="url(#g-leaf2)"/><path transform="translate(32 64) rotate(-60) scale(0.85)" d="M0 0 V-18" stroke="#2e5a2a" stroke-width=".6" opacity=".6"/><path transform="translate(68 64) rotate(62) scale(0.85)" d="M0 0 C -8 -6, -9 -16, 0 -21 C 9 -16, 8 -6, 0 0Z" fill="url(#g-leaf2)"/><path transform="translate(68 64) rotate(62) scale(0.85)" d="M0 0 V-18" stroke="#2e5a2a" stroke-width=".6" opacity=".6"/><path transform="translate(46 52) rotate(-10) scale(0.8)" d="M0 0 C -8 -6, -9 -16, 0 -21 C 9 -16, 8 -6, 0 0Z" fill="url(#g-leaf2)"/><path transform="translate(46 52) rotate(-10) scale(0.8)" d="M0 0 V-18" stroke="#2e5a2a" stroke-width=".6" opacity=".6"/><path transform="translate(56 50) rotate(14) scale(0.75)" d="M0 0 C -8 -6, -9 -16, 0 -21 C 9 -16, 8 -6, 0 0Z" fill="url(#g-leaf2)"/><path transform="translate(56 50) rotate(14) scale(0.75)" d="M0 0 V-18" stroke="#2e5a2a" stroke-width=".6" opacity=".6"/><path transform="translate(26 72) rotate(-110) scale(0.8)" d="M0 0 C -8 -6, -9 -16, 0 -21 C 9 -16, 8 -6, 0 0Z" fill="url(#g-leaf2)"/><path transform="translate(26 72) rotate(-110) scale(0.8)" d="M0 0 V-18" stroke="#2e5a2a" stroke-width=".6" opacity=".6"/><path transform="translate(20 84) rotate(-150) scale(0.75)" d="M0 0 C -8 -6, -9 -16, 0 -21 C 9 -16, 8 -6, 0 0Z" fill="url(#g-leaf2)"/><path transform="translate(20 84) rotate(-150) scale(0.75)" d="M0 0 V-18" stroke="#2e5a2a" stroke-width=".6" opacity=".6"/><path transform="translate(18 98) rotate(-170) scale(0.7)" d="M0 0 C -8 -6, -9 -16, 0 -21 C 9 -16, 8 -6, 0 0Z" fill="url(#g-leaf2)"/><path transform="translate(18 98) rotate(-170) scale(0.7)" d="M0 0 V-18" stroke="#2e5a2a" stroke-width=".6" opacity=".6"/><path transform="translate(74 72) rotate(105) scale(0.8)" d="M0 0 C -8 -6, -9 -16, 0 -21 C 9 -16, 8 -6, 0 0Z" fill="url(#g-leaf2)"/><path transform="translate(74 72) rotate(105) scale(0.8)" d="M0 0 V-18" stroke="#2e5a2a" stroke-width=".6" opacity=".6"/><path transform="translate(80 84) rotate(140) scale(0.7)" d="M0 0 C -8 -6, -9 -16, 0 -21 C 9 -16, 8 -6, 0 0Z" fill="url(#g-leaf2)"/><path transform="translate(80 84) rotate(140) scale(0.7)" d="M0 0 V-18" stroke="#2e5a2a" stroke-width=".6" opacity=".6"/>`),
  vase: () => svgObj("vase", 56, 152, `
    <path d="M28 98 C 26 72, 18 50, 10 18 M27 72 C 34 58, 42 46, 48 30 M24 56 C 20 48, 14 44, 7 42 M30 84 C 36 78, 42 76, 50 76" stroke="#6a5038" stroke-width="1.6" fill="none"/>
    ${[[10, 18], [48, 30], [7, 42], [50, 76], [16, 34], [40, 44]].map(([x, y]) => `<ellipse cx="${x}" cy="${y}" rx="2.4" ry="4" fill="#c8b48a"/>`).join("")}
    <path d="M18 152 H38 C 47 140, 47 116, 36 104 V96 H20 V104 C 9 116, 9 140, 18 152Z" fill="url(#g-sage)"/>
    <path d="M20 108 C 15 118, 15 134, 20 146" stroke="#fff" stroke-opacity=".35" stroke-width="2" fill="none"/>`),
  frame: () => svgObj("frame", 92, 112, `
    <g transform="skewX(-3)"><rect x="12" y="4" width="76" height="106" fill="#1e1e1e"/><rect x="18" y="10" width="64" height="94" fill="#f4f1ea"/>
    <circle cx="50" cy="44" r="17" fill="#d9794a"/><rect x="26" y="64" width="48" height="26" fill="#3e5e4a"/><rect x="26" y="64" width="20" height="26" fill="#e6c25a"/></g>`),
  sphere: () => svgObj("sphere", 62, 66, `
    <ellipse cx="31" cy="56" rx="27" ry="9" fill="url(#g-ceramic)"/><ellipse cx="31" cy="42" rx="19" ry="8" fill="url(#g-sage)"/><circle cx="31" cy="25" r="12" fill="url(#g-marble)"/>`),

};

/* decorative (untitled) old books, built like the real ones so they share the textures */
const DECOR = {
  objects: ["lamp", "globe", "candle", "bust", "hourglass", "ink", "skull"],
  tops: ["skull", "hourglass", "candle"],
  cols: ["#3d1013", "#162a1f", "#5a3a20", "#141b29", "#120f0c", "#4e1a20", "#2b2a18", "#6a5a3c"],
  bindings: ["b-leather", "b-cloth", "b-leather", "b-vellum"],
};
// Each room (theme) brings its own objects and old-book colours.
export function setDecor(d) { Object.assign(DECOR, d); }
function hstack(seed, top, used = new Set()) {
  const n = 3 + (hash("hn" + seed) % 3);
  let books = "", maxW = 0;
  for (let i = 0; i < n; i++) {
    const w = 96 - i * 7 + (hash("hw" + seed + i) % 12), h = 13 + (hash("hh" + seed + i) % 9);
    const x = (hash("hx" + seed + i) % 9) - 4; maxW = Math.max(maxW, w + Math.abs(x));
    const style = DECOR.bindings[hash("hs" + seed + i) % DECOR.bindings.length];
    books = `<span class="hbook ${style}" style="--c:${DECOR.cols[hash("hc" + seed + i) % DECOR.cols.length]};width:${w}px;height:${h}px;margin-left:${x + 6}px"></span>` + books;
  }
  let topObj = "";
  if (top) {
    const opts = DECOR.tops, st = hash("ht" + seed) % opts.length;
    let k = opts[st];
    for (let j = 0; j < opts.length; j++) if (!used.has(opts[(st + j) % opts.length])) { k = opts[(st + j) % opts.length]; break; }
    used.add(k);
    const o = OBJECTS[k]();
    topObj = o.html.replace('class="deco obj', 'class="deco obj on-stack');
  }
  return { w: maxW + 22, html: `<div class="deco hstack">${topObj}${books}</div>` };
}
function upright(seed, room) {
  const n = Math.max(2, Math.min(6, Math.floor((room - 30) / 28)));
  let out = "", w = 0;
  for (let i = 0; i < n; i++) {
    const bw = 20 + (hash("uw" + seed + i) % 16), bh = 150 + (hash("uh" + seed + i) % 46);
    const style = DECOR.bindings[hash("us" + seed + i + 1) % DECOR.bindings.length];
    out += `<span class="vol decor ${style}" aria-hidden="true" style="--w:${bw}px;--h:${bh}px;--c:${DECOR.cols[hash("uc" + seed + i) % DECOR.cols.length]};--ink:#c9a35c"><span class="body"><span class="face spine"><span class="orn"></span></span><span class="face cover-face"></span><span class="face back-face"></span><span class="face top-face"></span></span></span>`;
    w += bw + 2;
  }
  out += `<div class="deco bookend"><svg width="22" height="96" viewBox="0 0 22 96"><path d="M2 94 V20 C 2 8 10 2 20 2 V94 Z" fill="url(#g-brass)"/><path d="M2 94 H22" stroke="#3d2b14" stroke-width="3"/></svg></div>`;
  return { w: w + 30, html: `<div class="deco upright">${out}</div>` };
}

// Pick an object that fits, preferring ones not already on this bookcase.
function pickObject(seed, room, used = new Set()) {
  const OBJ_ORDER = DECOR.objects;
  const start = hash("o" + seed) % OBJ_ORDER.length;
  for (const fresh of [true, false]) {
    for (let k = 0; k < OBJ_ORDER.length; k++) {
      const name = OBJ_ORDER[(start + k) % OBJ_ORDER.length];
      if (fresh && used.has(name)) continue;
      const o = OBJECTS[name]();
      if (o.w <= room) { used.add(name); return o; }
    }
  }
  return null;
}

// Fill `room` pixels of a bay with a believable arrangement. `empty` = no real books in this bay.
// `used` is shared across one bookcase so the same object doesn't repeat everywhere.
export function fillBay(seed, room, empty, used = new Set()) {
  const parts = [];
  const add = p => { if (p && p.w <= room) { parts.push(p); room -= p.w; return true; } return false; };
  if (empty) {
    // Mostly old books, one object per bay at most, like a real lived-in shelf.
    const plan = hash("plan" + seed) % 3;
    if (plan === 0) { add(upright(seed, Math.min(room * 0.55, 200))); add(pickObject(seed + 1, room, used)); if (room > 110) add(hstack(seed + 2, false, used)); }
    else if (plan === 1) { add(hstack(seed, true, used)); add(upright(seed + 3, Math.min(room, 220))); }
    else { add(pickObject(seed, Math.min(room, 140), used)); add(upright(seed + 4, Math.min(room - 110, 200))); if (room > 110) add(hstack(seed + 6, false, used)); }
  } else {
    if (room >= 230) { add(hstack(seed, hash("t" + seed) % 2 === 0, used)); add(pickObject(seed + 1, room, used)); }
    else if (room >= 120) { (hash("c" + seed) % 2 ? add(hstack(seed, false, used)) : add(pickObject(seed, room, used))); }
    else if (room >= 60) add(pickObject(seed, room, used));
  }
  return parts;
}
