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
  door2: s('<path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16"/><path d="M3 21h18M14 12h.01"/>'),
};

// An engraved rule with a lozenge, like a printer's ornament.
export const FLOURISH = `<svg class="flourish" viewBox="0 0 420 18" fill="none" stroke="currentColor" aria-hidden="true">
  <path d="M0 9h176M244 9h176" stroke-width="1"/><path d="M40 5h136M244 13h136" stroke-width=".6" opacity=".6"/>
  <path d="M210 1l8 8-8 8-8-8z" fill="currentColor" stroke="none"/><path d="M190 9l6-5 6 5-6 5zM218 9l6-5 6 5-6 5z" stroke-width="1"/>
  <rect x="0" y="7" width="4" height="4" fill="currentColor" stroke="none"/><rect x="416" y="7" width="4" height="4" fill="currentColor" stroke="none"/></svg>`;

// A tall gothic lancet window with tracery; rain runs down the glass.
export function gothicWindowSVG(i = 0) {
  const id = "gw" + i;
  return `<div class="window"><svg viewBox="0 0 120 240" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
    <defs>
      <linearGradient id="${id}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1b2433"/><stop offset=".6" stop-color="#222b38"/><stop offset="1" stop-color="#2b2a2c"/></linearGradient>
      <clipPath id="${id}c"><path d="M10 240 V96 Q10 34 60 6 Q110 34 110 96 V240 Z"/></clipPath>
    </defs>
    <path d="M2 240 V94 Q2 26 60 -2 Q118 26 118 94 V240 Z" fill="#14100c"/>
    <g clip-path="url(#${id}c)">
      <rect width="120" height="240" fill="url(#${id}g)"/>
      <circle cx="${78 - (i % 3) * 14}" cy="${56 + (i % 2) * 18}" r="11" fill="#e9e4cf" opacity=".85"/>
      <circle cx="${78 - (i % 3) * 14}" cy="${56 + (i % 2) * 18}" r="30" fill="#e9e4cf" opacity=".06"/>
      ${[[22, 40], [94, 30], [40, 120], [88, 150], [30, 80], [70, 110]].map(([x, y]) => `<rect x="${x}" y="${y}" width="1.3" height="1.3" fill="#fff" opacity=".7"/>`).join("")}
      <g class="rain">${Array.from({ length: 16 }, (_, k) => `<line x1="${(k * 37 + i * 13) % 120}" y1="${(k * 53) % 240}" x2="${(k * 37 + i * 13) % 120 - 3}" y2="${(k * 53) % 240 + 18}" stroke="#a9b8c9" stroke-width=".7" opacity=".35"/>`).join("")}</g>
    </g>
    <g fill="none" stroke="#14100c" stroke-width="5">
      <path d="M60 6 V240"/><path d="M10 150 H110"/><path d="M10 200 H110"/>
      <path d="M10 104 Q10 70 35 52 Q60 70 60 104"/><path d="M60 104 Q60 70 85 52 Q110 70 110 104"/>
      <circle cx="60" cy="36" r="13"/>
    </g>
    <path d="M10 240 V96 Q10 34 60 6 Q110 34 110 96 V240" fill="none" stroke="#3a2c1e" stroke-width="2"/>
  </svg></div>`;
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
};

/* decorative (untitled) old books, built like the real ones so they share the textures */
const OLD_COLS = ["#3d1013", "#162a1f", "#5a3a20", "#141b29", "#120f0c", "#4e1a20", "#2b2a18", "#6a5a3c"];
function hstack(seed, top, used = new Set()) {
  const n = 3 + (hash("hn" + seed) % 3);
  let books = "", maxW = 0;
  for (let i = 0; i < n; i++) {
    const w = 96 - i * 7 + (hash("hw" + seed + i) % 12), h = 13 + (hash("hh" + seed + i) % 9);
    const x = (hash("hx" + seed + i) % 9) - 4; maxW = Math.max(maxW, w + Math.abs(x));
    const style = ["b-leather", "b-cloth", "b-leather", "b-vellum"][hash("hs" + seed + i) % 4];
    books = `<span class="hbook ${style}" style="--c:${OLD_COLS[hash("hc" + seed + i) % OLD_COLS.length]};width:${w}px;height:${h}px;margin-left:${x + 6}px"></span>` + books;
  }
  let topObj = "";
  if (top) {
    const opts = ["skull", "hourglass", "candle"], st = hash("ht" + seed) % 3;
    let k = opts[st];
    for (let j = 0; j < 3; j++) if (!used.has(opts[(st + j) % 3])) { k = opts[(st + j) % 3]; break; }
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
    const style = ["b-leather", "b-leather", "b-cloth", "b-vellum"][hash("us" + seed + i) % 4];
    out += `<span class="vol decor ${style}" aria-hidden="true" style="--w:${bw}px;--h:${bh}px;--c:${OLD_COLS[hash("uc" + seed + i) % OLD_COLS.length]};--ink:#c9a35c"><span class="body"><span class="face spine"><span class="orn"></span></span><span class="face cover-face"></span><span class="face back-face"></span><span class="face top-face"></span></span></span>`;
    w += bw + 2;
  }
  out += `<div class="deco bookend"><svg width="22" height="96" viewBox="0 0 22 96"><path d="M2 94 V20 C 2 8 10 2 20 2 V94 Z" fill="url(#g-brass)"/><path d="M2 94 H22" stroke="#3d2b14" stroke-width="3"/></svg></div>`;
  return { w: w + 30, html: `<div class="deco upright">${out}</div>` };
}

const OBJ_ORDER = ["lamp", "globe", "candle", "bust", "hourglass", "ink", "skull"];
// Pick an object that fits, preferring ones not already on this bookcase.
function pickObject(seed, room, used = new Set()) {
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
