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

/* shelf objects (inline SVG, drawn with straight edges) */
const BRASS = "#b08d57", BRASS_D = "#7d6036";
const DECOS = {
  lamp: () => `<div class="deco lamp" style="width:70px"><svg width="70" height="118" viewBox="0 0 70 118">
      <ellipse class="halo" cx="35" cy="96" rx="40" ry="16" fill="#ffd27a" opacity=".16"/>
      <path d="M6 40 L64 40 L58 22 L12 22 Z" fill="#1f4a33"/><path d="M12 22 L58 22 L56 18 L14 18 Z" fill="#2c6247"/><path d="M8 40 h54" stroke="${BRASS}" stroke-width="2"/>
      <path d="M14 41 L56 41 L62 52 L8 52 Z" fill="#ffd98a" opacity=".22"/>
      <path d="M35 40 V96" stroke="${BRASS}" stroke-width="4"/><path d="M33 54 H37" stroke="${BRASS_D}" stroke-width="6"/>
      <path d="M48 46 V60" stroke="${BRASS}" stroke-width="1.5"/><rect x="46.5" y="60" width="3" height="5" fill="${BRASS}"/>
      <rect x="12" y="96" width="46" height="10" fill="${BRASS_D}"/><rect x="8" y="106" width="54" height="6" fill="${BRASS}"/></svg></div>`,
  bust: () => `<div class="deco bust" style="width:62px"><svg width="62" height="124" viewBox="0 0 62 124">
      <defs><linearGradient id="mb" x1="0" x2="1"><stop offset="0" stop-color="#8f8a80"/><stop offset=".45" stop-color="#e3ded2"/><stop offset="1" stop-color="#9c968a"/></linearGradient></defs>
      <path d="M24 10 C 34 4, 46 10, 44 24 C 46 28, 47 31, 44 33 L 44 40 C 42 46, 36 48, 30 47 L 30 54 L 22 54 L 22 44 C 16 40, 15 30, 17 22 C 18 16, 20 12, 24 10 Z" fill="url(#mb)"/>
      <path d="M22 12 c3-5 10-6 15-4 c4-3 9 0 9 4 c3 2 3 6 1 8" stroke="#bdb7aa" stroke-width="2.4" fill="none"/>
      <path d="M8 76 C 10 62, 18 56, 22 54 L 30 54 C 38 56, 48 62, 52 76 Z" fill="url(#mb)"/><path d="M20 58 L 32 74" stroke="#a49e92" stroke-width="1.4"/>
      <rect x="16" y="76" width="28" height="6" fill="#d6d0c3"/><rect x="20" y="82" width="20" height="16" fill="url(#mb)"/>
      <rect x="10" y="98" width="40" height="8" fill="#cfc9bb"/><rect x="6" y="106" width="48" height="10" fill="#b2ac9f"/>
      <path d="M14 110 h32" stroke="#8a8579" stroke-width=".8"/></svg></div>`,
  skull: () => `<div class="deco skull" style="width:66px"><svg width="66" height="78" viewBox="0 0 66 78">
      <rect x="2" y="56" width="62" height="10" fill="#4a1418"/><rect x="2" y="59" width="62" height="1" fill="${BRASS}"/><rect x="62" y="57" width="2" height="8" fill="#e3d8bd"/>
      <rect x="6" y="66" width="56" height="10" fill="#1d3226"/><rect x="6" y="69" width="56" height="1" fill="${BRASS}"/>
      <path d="M33 14 C 18 14, 12 24, 13 34 C 14 40, 17 43, 20 45 L 20 52 L 46 52 L 46 45 C 49 43, 52 40, 53 34 C 54 24, 48 14, 33 14 Z" fill="#e2d8c0"/>
      <path d="M20 31 L28 29 L29 37 L21 38 Z M37 29 L45 31 L44 38 L36 37 Z" fill="#1a130d"/><path d="M33 39 L30 45 H36 Z" fill="#2a1f15"/>
      <path d="M24 52 V48 M28 52 V48 M32 52 V48 M36 52 V48 M40 52 V48" stroke="#8d8068" stroke-width="1"/>
      <path d="M16 26 C 20 18, 28 16, 33 16" stroke="#fff" stroke-width="1.5" opacity=".4" fill="none"/></svg></div>`,
  globe: () => `<div class="deco globe" style="width:62px"><svg width="62" height="110" viewBox="0 0 62 110">
      <circle cx="31" cy="44" r="24" fill="#6d5a37"/><path d="M14 36 c6 -4 10 2 14 -2 s8 -8 12 -4 c4 6 -4 10 0 14 s10 0 8 8 c-4 6 -12 4 -16 8 M10 50 c6 0 8 6 12 10" stroke="#3a2e1a" stroke-width="3" fill="none" opacity=".75"/>
      <circle cx="31" cy="44" r="24" fill="none" stroke="#2a1f15" stroke-width="1"/><path d="M7 44 h48 M31 20 v48" stroke="#2a1f15" stroke-width=".6" opacity=".5"/>
      <path d="M31 14 A 30 30 0 0 1 31 74" stroke="${BRASS}" stroke-width="3" fill="none"/>
      <path d="M31 74 V92" stroke="${BRASS}" stroke-width="4"/><path d="M14 92 H48 L44 100 H18 Z" fill="${BRASS_D}"/><rect x="10" y="100" width="42" height="6" fill="${BRASS}"/></svg></div>`,
  hourglass: () => `<div class="deco hourglass" style="width:44px"><svg width="44" height="96" viewBox="0 0 44 96">
      <rect x="4" y="6" width="36" height="6" fill="#3a2414"/><rect x="4" y="84" width="36" height="6" fill="#3a2414"/>
      <path d="M8 12 V84 M36 12 V84" stroke="#5a3a1f" stroke-width="3"/>
      <path d="M12 12 H32 L23 46 L32 84 H12 L21 46 Z" fill="#cfe0e4" opacity=".22" stroke="#cfe0e4" stroke-opacity=".5"/>
      <path d="M15 22 H29 L22 44 Z" fill="#c9a66b"/><path d="M13 84 L22 66 L31 84 Z" fill="#c9a66b"/><path d="M22 46 V66" stroke="#c9a66b" stroke-width="1"/></svg></div>`,
  ink: () => `<div class="deco ink" style="width:58px"><svg width="58" height="104" viewBox="0 0 58 104">
      <path d="M38 6 C 30 20, 24 40, 24 70 L 27 70 C 28 44, 34 22, 44 10 Z" fill="#e8e0cc"/><path d="M38 6 C 34 18, 30 30, 27 46" stroke="#a49a84" stroke-width=".8" fill="none"/>
      <path d="M44 10 C 40 22, 33 34, 30 50 L 27 70" stroke="#d2c8b2" stroke-width="1" fill="none"/>
      <rect x="10" y="74" width="34" height="22" fill="#0d1a24"/><rect x="10" y="74" width="34" height="22" fill="url(#mb)" opacity=".08"/>
      <rect x="18" y="66" width="18" height="8" fill="${BRASS}"/><rect x="6" y="96" width="42" height="5" fill="#3a2414"/>
      <path d="M13 78 h4 v14 h-4z" fill="#fff" opacity=".12"/></svg></div>`,
  candle: () => `<div class="deco candle" style="width:40px"><svg width="40" height="132" viewBox="0 0 40 132">
      <circle class="halo" cx="20" cy="22" r="26" fill="#ffcf6e" opacity=".18"/>
      <path class="flame" d="M20 6 C 15 14, 16 21, 20 23 C 24 21, 25 14, 20 6 Z" fill="#ffcf6e"/><path class="flame" d="M20 13 C 18 17, 18 20, 20 21 C 22 20, 22 17, 20 13 Z" fill="#fff6d6"/>
      <rect x="19.3" y="22" width="1.4" height="4" fill="#1a130d"/>
      <rect x="15" y="26" width="10" height="50" fill="#e8dfc6"/><rect x="15" y="26" width="3" height="50" fill="#fff" opacity=".3"/><path d="M22 26 v12 h3 v-12z" fill="#f6efdc"/>
      <rect x="12" y="76" width="16" height="5" fill="${BRASS}"/><path d="M17 81 h6 l2 30 h-10z" fill="${BRASS_D}"/><rect x="14" y="94" width="12" height="3" fill="${BRASS}"/>
      <path d="M6 111 h28 l-4 9 h-20z" fill="${BRASS}"/><rect x="4" y="120" width="32" height="5" fill="${BRASS_D}"/></svg></div>`,
  stack: seed => {
    const cols = ["#4a1418", "#1d3226", "#6b4a2a", "#1a2233", "#16130f", "#5e1f26"];
    const books = [0, 1, 2, 3].map(i => {
      const c = cols[(hash("st" + seed + i)) % cols.length]; const w = 72 - i * 6 + (hash("w" + seed + i) % 8); const x = (80 - w) / 2 + ((hash("x" + seed + i) % 6) - 3);
      const y = 64 - (i + 1) * 15;
      return `<rect x="${x}" y="${y}" width="${w}" height="14" fill="${c}"/><rect x="${x}" y="${y + 2}" width="${w}" height="1" fill="${BRASS}" opacity=".8"/><rect x="${x}" y="${y + 11}" width="${w}" height="1" fill="${BRASS}" opacity=".8"/><rect x="${x + w - 3}" y="${y + 1}" width="3" height="12" fill="#e3d8bd"/>`;
    }).join("");
    return `<div class="deco stack" style="width:80px"><svg width="80" height="64" viewBox="0 0 80 64">${books}</svg></div>`;
  },
};
const ORDER = ["lamp", "bust", "stack", "skull", "candle", "globe", "hourglass", "ink", "stack", "candle", "lamp", "bust"];
export function decoFor(seed) { const k = ORDER[hash("d" + seed) % ORDER.length]; return DECOS[k](seed); }
export const DECO_W = 80;
