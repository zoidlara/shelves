// Little hand-drawn bits: icons, ivy, fairy lights, shelf decorations.
import { hash } from "./covers.js";

const s = (d, extra = "") => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${d}</svg>`;
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

export const FLOURISH = `<svg class="flourish" viewBox="0 0 380 22" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true"><path d="M10 11h140M230 11h140"/><path d="M150 11c10-10 20-10 25 0s15 10 15 0-10-10-15 0 15 10 25 0 15-10 25 0"/><path d="M190 4l4 7-4 7-4-7z" fill="currentColor"/><circle cx="10" cy="11" r="2" fill="currentColor"/><circle cx="370" cy="11" r="2" fill="currentColor"/></svg>`;

const LEAF = "M0 0 C -6 -4, -8 -12, 0 -16 C 8 -12, 6 -4, 0 0 Z";
export function ivySVG(side = "left", seed = 1) {
  const pts = [];
  // a drooping vine
  const path = "M4 6 C 40 2, 70 20, 96 18 S 150 34, 176 30 M 44 8 C 50 30, 40 60, 52 92 S 48 140, 60 168 M 120 24 C 128 46, 118 70, 126 96";
  const leafAt = [[14, 6], [30, 5], [48, 9], [66, 15], [84, 18], [104, 20], [124, 25], [146, 30], [166, 31], [47, 26], [43, 46], [46, 66], [52, 86], [50, 106], [52, 128], [56, 150], [60, 166], [123, 42], [121, 62], [124, 82], [126, 98]];
  leafAt.forEach(([x, y], i) => {
    const r = ((hash(side + i + seed) % 120) - 60) + (i % 2 ? 40 : -40);
    const sc = 0.7 + (hash("s" + i + seed) % 50) / 100;
    pts.push(`<path class="${i % 3 === 0 ? "lf2" : ""}" d="${LEAF}" transform="translate(${x} ${y}) rotate(${r}) scale(${sc})" fill="currentColor"/>`);
  });
  return `<svg class="ivy ${side}" viewBox="0 0 190 180" aria-hidden="true"><path class="vine" d="${path}" fill="none" stroke-width="2"/>${pts.join("")}</svg>`;
}

export function fairyLightsSVG(n = 22) {
  const W = 1200, H = 40;
  const colors = ["#ffd27a", "#ffb35c", "#ffe9a8", "#f3a0a8", "#bfe3a0"];
  const bulbs = [];
  const sag = (x, a, b) => { const t = (x - a) / (b - a); return 6 + Math.sin(t * Math.PI) * 22; };
  const segs = 3; const segW = W / segs;
  let d = "";
  for (let s = 0; s < segs; s++) { const a = s * segW, b = a + segW; d += `M${a} 6 Q ${a + segW / 2} 50 ${b} 6 `; }
  for (let i = 0; i < n; i++) {
    const x = (i + 0.5) * (W / n); const seg = Math.floor(x / segW); const y = sag(x, seg * segW, seg * segW + segW);
    const c = colors[i % colors.length];
    bulbs.push(`<g class="bulb" style="animation-delay:${-(hash("b" + i) % 3000) / 1000}s"><circle cx="${x}" cy="${y + 6}" r="9" fill="${c}" opacity=".18"/><circle cx="${x}" cy="${y + 6}" r="3.6" fill="${c}"/><rect x="${x - 1.6}" y="${y}" width="3.2" height="3" fill="#3a2a18"/></g>`);
  }
  return `<div class="fairy-lights" aria-hidden="true"><svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none"><path d="${d}" fill="none" stroke="#3a2a18" stroke-width="1.4"/>${bulbs.join("")}</svg></div>`;
}

/* shelf decorations (inline SVG) */
const DECOS = {
  candle: () => `<div class="deco candle" style="width:46px"><svg width="46" height="120" viewBox="0 0 46 120">
      <circle class="halo" cx="23" cy="36" r="30" fill="url(#cg)" opacity=".7"/>
      <defs><radialGradient id="cg"><stop offset="0" stop-color="#ffcf6e" stop-opacity=".55"/><stop offset="1" stop-color="#ffcf6e" stop-opacity="0"/></radialGradient>
      <linearGradient id="wax" x1="0" x2="1"><stop offset="0" stop-color="#cdbb91"/><stop offset=".45" stop-color="#f6ecd2"/><stop offset="1" stop-color="#bba77c"/></linearGradient></defs>
      <path class="flame" d="M23 22 C 18 30, 19 38, 23 40 C 27 38, 28 30, 23 22 Z" fill="#ffcf6e"/><path class="flame" d="M23 29 C 21 33, 21 37, 23 38 C 25 37, 25 33, 23 29 Z" fill="#fff6d6"/>
      <rect x="22.3" y="38" width="1.4" height="5" fill="#2a1a0e"/>
      <path d="M15 43 h16 v58 h-16 z" fill="url(#wax)"/><path d="M15 43 h16 c0 6-3 4-4 10 c-1 -5 -3 -2 -4 -6 c-2 4 -5 2 -8 -4z" fill="#fff8e6" opacity=".7"/>
      <ellipse cx="23" cy="104" rx="19" ry="5" fill="#6b4a22"/><path d="M6 104 h34 l-3 8 h-28 z" fill="#8a6a3c"/><path d="M38 105 c8 0 8 9 0 9" stroke="#8a6a3c" stroke-width="3" fill="none"/></svg></div>`,
  plant: () => `<div class="deco plant" style="width:62px"><svg width="62" height="120" viewBox="0 0 62 120">
      <path d="M31 70 C 28 50, 18 40, 8 36 M31 70 C 33 48, 44 36, 54 30 M31 70 C 30 46, 32 28, 30 14 M31 70 C 22 64, 12 70, 4 84 M31 72 C 40 68, 52 76, 58 96" stroke="#3f6a35" stroke-width="2" fill="none"/>
      ${[[8, 36, -40], [18, 42, -20], [54, 30, 40], [44, 38, 20], [30, 14, 0], [31, 28, 10], [4, 84, -80], [12, 74, -60], [58, 96, 70], [50, 80, 60], [26, 50, -10], [36, 52, 15]].map(([x, y, r], i) => `<path d="${LEAF}" transform="translate(${x} ${y}) rotate(${r + 180}) scale(.9)" fill="${i % 2 ? "#5b8a45" : "#3f6a35"}"/>`).join("")}
      <path d="M14 78 h34 l-4 34 h-26 z" fill="#9a5a34"/><path d="M12 74 h38 v7 h-38 z" fill="#b0693d"/><path d="M18 88 h26" stroke="#7a4426" stroke-width="1.5"/></svg></div>`,
  mushroom: () => `<div class="deco mushroom" style="width:58px"><svg width="58" height="70" viewBox="0 0 58 70">
      <path d="M18 40 c-2 10 -2 20 0 28 h8 c2 -8 2 -18 0 -28z" fill="#efe1c2"/><path d="M4 42 C 4 22, 40 22, 40 42 Z" fill="#b8323a"/>
      <circle cx="14" cy="34" r="3" fill="#f6ecd2"/><circle cx="26" cy="30" r="2.4" fill="#f6ecd2"/><circle cx="33" cy="37" r="2" fill="#f6ecd2"/>
      <path d="M40 52 c-1 6 -1 11 0 16 h6 c1 -5 1 -10 0 -16z" fill="#efe1c2"/><path d="M33 53 C 33 40, 54 40, 54 53 Z" fill="#c9862f"/><circle cx="41" cy="48" r="1.6" fill="#f6ecd2"/><circle cx="48" cy="50" r="1.4" fill="#f6ecd2"/>
      <path d="M2 68 C 10 62, 20 66, 28 64 S 46 62, 56 68 Z" fill="#3f6a35"/></svg></div>`,
  potion: () => `<div class="deco potion" style="width:44px"><svg width="44" height="96" viewBox="0 0 44 96">
      <defs><radialGradient id="pg" cx=".5" cy=".6"><stop offset="0" stop-color="#b8f0c8"/><stop offset=".6" stop-color="#4fb08a"/><stop offset="1" stop-color="#1f5a48"/></radialGradient></defs>
      <circle cx="22" cy="66" r="26" fill="#6fe0b0" opacity=".12"/>
      <rect x="17" y="18" width="10" height="16" rx="2" fill="#cfe6dd" opacity=".55"/><rect x="15.5" y="12" width="13" height="8" rx="2" fill="#7a5230"/>
      <path d="M17 34 C 4 42, 4 92, 22 92 C 40 92, 40 42, 27 34 Z" fill="url(#pg)" opacity=".92"/>
      <path d="M12 56 C 14 50, 18 46, 20 46" stroke="#fff" stroke-width="2" opacity=".5" fill="none"/>
      <circle cx="24" cy="70" r="2" fill="#eafff4" opacity=".8"/><circle cx="18" cy="78" r="1.4" fill="#eafff4" opacity=".7"/>
      <path d="M15 22 c-6 2 -8 8 -4 10" stroke="#c9a45c" stroke-width="1.2" fill="none"/><rect x="5" y="28" width="9" height="6" rx="1" fill="#efe2c2" transform="rotate(-12 9 31)"/></svg></div>`,
  crystal: () => `<div class="deco crystal" style="width:46px"><svg width="46" height="70" viewBox="0 0 46 70">
      <circle cx="23" cy="44" r="22" fill="#b9a2ff" opacity=".1"/>
      <path d="M14 66 L10 36 L18 18 L24 36 Z" fill="#8e78c9"/><path d="M18 18 L24 36 L22 66 L14 66 Z" fill="#6c5aa8"/>
      <path d="M22 66 L24 30 L31 10 L37 30 L34 66 Z" fill="#a993e0"/><path d="M31 10 L37 30 L34 66 L28 66 Z" fill="#7c67bd"/>
      <path d="M33 66 L36 44 L41 34 L44 46 L41 66 Z" fill="#9781d4"/>
      <path d="M2 68 h42" stroke="#4a3626" stroke-width="4" stroke-linecap="round"/></svg></div>`,
  lantern: () => `<div class="deco lantern" style="width:50px"><svg width="50" height="104" viewBox="0 0 50 104">
      <circle cx="25" cy="62" r="30" fill="#ffcf6e" opacity=".14"/>
      <path d="M18 14 a7 7 0 0 1 14 0" stroke="#3a2a18" stroke-width="3" fill="none"/>
      <path d="M12 26 L25 16 L38 26 Z" fill="#3a2a18"/><rect x="12" y="26" width="26" height="6" fill="#2a1d12"/>
      <rect x="14" y="32" width="22" height="52" fill="#ffd98a" opacity=".85"/><path class="flame" d="M25 48 C 21 56, 22 64, 25 66 C 28 64, 29 56, 25 48Z" fill="#ff9d3c"/>
      <path d="M14 32 v52 M36 32 v52 M25 32 v52" stroke="#2a1d12" stroke-width="2.4"/><path d="M14 58 h22" stroke="#2a1d12" stroke-width="1.5"/>
      <rect x="10" y="84" width="30" height="7" rx="1" fill="#2a1d12"/><rect x="14" y="91" width="22" height="5" fill="#3a2a18"/></svg></div>`,
  stack: seed => {
    const cols = ["#6b2430", "#2f4a34", "#a3772c", "#23324a", "#4b2e4f", "#5a3b24"];
    const books = [0, 1, 2].map(i => {
      const c = cols[(hash("st" + seed + i)) % cols.length]; const w = 70 - i * 8 + (hash("w" + seed + i) % 10); const x = (78 - w) / 2 + ((hash("x" + seed + i) % 8) - 4);
      const y = 52 - (i + 1) * 15;
      return `<rect x="${x}" y="${y}" width="${w}" height="14" rx="2" fill="${c}"/><rect x="${x}" y="${y + 3}" width="${w}" height="1.2" fill="#d6b06a" opacity=".7"/><rect x="${x}" y="${y + 10}" width="${w}" height="1.2" fill="#d6b06a" opacity=".7"/><rect x="${x + w - 3}" y="${y + 1}" width="3" height="12" fill="#efe3c4"/>`;
    }).join("");
    return `<div class="deco stack" style="width:78px"><svg width="78" height="${hash("tc" + seed) % 2 ? 88 : 52}" viewBox="0 ${hash("tc" + seed) % 2 ? -36 : 0} 78 ${hash("tc" + seed) % 2 ? 88 : 52}">${books}${hash("tc" + seed) % 2 ? `<path d="M30 7 h18 v-6 c0-6 -18-6 -18 0z" fill="#efe3c4"/><path d="M48 2 c6 0 6 6 0 6" stroke="#efe3c4" stroke-width="2" fill="none"/><path d="M35 -6 c-2 -5 3 -7 1 -12 M41 -6 c-2 -5 3 -7 1 -12" stroke="#efe3c4" stroke-width="1.2" opacity=".5" fill="none"/>` : ""}</svg></div>`;
  },
};
const ORDER = ["candle", "plant", "stack", "mushroom", "potion", "lantern", "crystal", "stack", "candle", "plant"];
export function decoFor(seed) { const k = ORDER[hash("d" + seed) % ORDER.length]; return DECOS[k](seed); }
export const DECO_W = 70;
