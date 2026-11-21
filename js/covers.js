// Handmade covers, spine colours, and the shareable card.

export const PALETTE = [
  { bg: "#2f4a34", ink: "#e9d9a6" }, // forest
  { bg: "#6b2430", ink: "#f0d79a" }, // burgundy
  { bg: "#23324a", ink: "#e8d49b" }, // midnight
  { bg: "#4b2e4f", ink: "#efd8a8" }, // plum
  { bg: "#8a3f22", ink: "#f4dfae" }, // rust
  { bg: "#22504f", ink: "#ead8a2" }, // deep teal
  { bg: "#5a3b24", ink: "#f0d9a4" }, // walnut
  { bg: "#a3772c", ink: "#2a1a0e" }, // ochre
  { bg: "#4f6b3a", ink: "#f2e2b5" }, // moss
  { bg: "#d8c79f", ink: "#3b2716" }, // vellum
  { bg: "#9c5463", ink: "#f8e6c2" }, // dusty rose
  { bg: "#1f2b22", ink: "#cdb675" }, // ink green
];

export function hash(str = "") {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}
export const paletteFor = key => PALETTE[hash(key) % PALETTE.length];

export const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));

const EMBLEMS = {
  star: '<path d="M12 2l2.6 6.6L21 9.3l-5 4.4 1.6 6.8L12 17l-5.6 3.5L8 13.7 3 9.3l6.4-.7z"/>',
  moon: '<path d="M15.5 3.5a8.5 8.5 0 1 0 5 13.9A7 7 0 0 1 15.5 3.5z"/>',
  leaf: '<path d="M20 4C10 4 4 9 4 16c0 1.3.3 2.5.8 3.5C6 13 10 10 15 8c-4 3-7 6.5-8.6 12 .9.3 1.9.5 2.9.5C16 20.5 20 14 20 4z"/>',
  key: '<path d="M8 4a5 5 0 0 0-1 9.9V22h3v-2h2v-2h-2v-1.5h2v-2h-2v-.6A5 5 0 0 0 8 4zm0 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/>',
  crown: '<path d="M3 8l4.5 4L12 5l4.5 7L21 8l-2 11H5z"/>',
  mushroom: '<path d="M12 3C6.5 3 3 6.8 3 11h18c0-4.2-3.5-8-9-8zM9.5 12h5l.8 7.5a1.5 1.5 0 0 1-1.5 1.5h-3.6a1.5 1.5 0 0 1-1.5-1.5z"/>',
  flower: '<path d="M12 8.5a3 3 0 1 0 0 7 3 3 0 0 0 0-7zm0-6.5c1.7 0 3 1.8 3 4.2l-.1.8a4.6 4.6 0 0 0-5.8 0L9 6.2C9 3.8 10.3 2 12 2zm0 20c-1.7 0-3-1.8-3-4.2l.1-.8a4.6 4.6 0 0 0 5.8 0l.1.8c0 2.4-1.3 4.2-3 4.2zM2 12c0-1.7 1.8-3 4.2-3l.8.1a4.6 4.6 0 0 0 0 5.8l-.8.1C3.8 15 2 13.7 2 12zm20 0c0 1.7-1.8 3-4.2 3l-.8-.1a4.6 4.6 0 0 0 0-5.8l.8-.1C20.2 9 22 10.3 22 12z"/>',
  feather: '<path d="M20.5 3.5C14 3.5 8 8 6.5 14.5L4 20l1.2.8 2.3-3.4c5.5-.5 10.6-4.6 13-13.9zM8.9 15.6c.7-2.6 2.4-5.3 5.1-7.6-1.6 2.6-2.8 5-3.4 7.4z"/>',
  dragon: '<path d="M3 15c3-1 4-4 7-5 2-.7 3.6.2 4.2 1.4L18 9l3 1-2.5 2 .5 3-3-1.4c-1 2.4-3.6 4-6.5 4.4-2.3.3-4.6-.5-6.5-2z"/>',
  wand: '<path d="M4 20L15 9l1.5 1.5-11 11zM17 2l.8 2.2L20 5l-2.2.8L17 8l-.8-2.2L14 5l2.2-.8zM21 9l.5 1.3 1.5.5-1.5.5L21 13l-.5-1.7L19 11l1.5-.7z"/>',
  reel: '<path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20zm0 3a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm-5 5a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm10 0a2 2 0 1 1 0 4 2 2 0 0 1 0-4zm-5 5a2 2 0 1 1 0 4 2 2 0 0 1 0-4z"/>',
  tv: '<path d="M8 2l4 3.5L16 2l1 1-3 2.8h6a2 2 0 0 1 2 2V18a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7.8a2 2 0 0 1 2-2h6L7 3z"/>',
  note: '<path d="M9 3v12.3A3.5 3.5 0 1 0 11 18.5V8h7V3z"/>',
};
export const emblemSVG = (name, cls = "") =>
  `<svg class="${cls}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">${EMBLEMS[name] || EMBLEMS.star}</svg>`;

export function emblemFor(item) {
  const g = (item.genres || []).join(" ").toLowerCase() + " " + (item.title || "").toLowerCase();
  if (item.kind === "film") return "reel";
  if (item.kind === "show") return "tv";
  if (item.kind === "song") return "note";
  if (/dragon|wing/.test(g)) return "dragon";
  if (/magic|wizard|witch|potter|spell/.test(g)) return "wand";
  if (/romance|love|romantasy/.test(g)) return "flower";
  if (/royal|princess|queen|king|crown/.test(g)) return "crown";
  if (/mystery|thriller|crime|secret/.test(g)) return "key";
  if (/night|moon|vampire|gothic|horror/.test(g)) return "moon";
  if (/nature|cottage|garden|forest/.test(g)) return "leaf";
  if (/fairy|fae|whimsical/.test(g)) return "mushroom";
  if (/poetry|classic|histor/.test(g)) return "feather";
  return ["star", "moon", "leaf", "key", "crown", "mushroom", "flower", "feather"][hash(item.title) % 8];
}

const SOURCE_RIBBON = { ao3: ["AO3", "#990000"], wattpad: ["Wattpad", "#ff6122"], tumblr: ["Tumblr", "#36465d"], goodreads: ["Goodreads", "#7a5b3a"] };

// A complete handmade cover (HTML). Used whenever a real cover is missing.
export function handmadeCover(item) {
  const p = paletteFor(item.title + item.creator);
  const em = emblemFor(item);
  const rib = SOURCE_RIBBON[item.source];
  const kindLabel = { film: "a motion picture", show: "a television tale", song: "a song", book: "" }[item.kind] || "";
  const title = esc(item.title);
  const size = item.title.length > 38 ? "xs" : item.title.length > 22 ? "sm" : "md";
  return `<div class="handmade k-${item.kind}" style="--hb:${p.bg};--hi:${p.ink}">
    <div class="hm-frame"><span class="hm-c tl"></span><span class="hm-c tr"></span><span class="hm-c bl"></span><span class="hm-c br"></span></div>
    ${emblemSVG(em, "hm-emblem")}
    <div class="hm-title ${size}">${title}</div>
    <div class="hm-rule"><i></i>${emblemSVG("star", "hm-star")}<i></i></div>
    <div class="hm-author">${esc(item.creator || kindLabel)}</div>
    ${item.year ? `<div class="hm-year">${esc(item.year)}</div>` : ""}
    ${rib ? `<div class="hm-ribbon" style="--rb:${rib[1]}">${rib[0]}</div>` : ""}
  </div>`;
}

// Real cover if we have one (falls back to handmade on load error), else handmade.
export function coverHTML(item, cls = "") {
  const hm = handmadeCover(item);
  if (!item.cover) return `<div class="cover ${cls}">${hm}</div>`;
  return `<div class="cover ${cls}"><div class="cover-fallback">${hm}</div><img src="${esc(item.cover)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()"></div>`;
}

/* ───────────── colour sampling ───────────── */
const colorCache = new Map();
export function sampleColor(url) {
  if (!url) return Promise.resolve(null);
  if (colorCache.has(url)) return colorCache.get(url);
  const p = new Promise(resolve => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.referrerPolicy = "no-referrer";
    img.onload = () => {
      try {
        const c = document.createElement("canvas"); c.width = 24; c.height = 36;
        const x = c.getContext("2d", { willReadFrequently: true });
        x.drawImage(img, 0, 0, 24, 36);
        const d = x.getImageData(0, 0, 24, 36).data;
        // weighted towards saturated-but-not-too-bright pixels
        let r = 0, g = 0, b = 0, w = 0;
        for (let i = 0; i < d.length; i += 4) {
          const R = d[i], G = d[i + 1], B = d[i + 2];
          const mx = Math.max(R, G, B), mn = Math.min(R, G, B);
          const sat = mx ? (mx - mn) / mx : 0; const lum = (R + G + B) / 765;
          const wt = 0.15 + sat * 1.5 * (lum > 0.08 && lum < 0.9 ? 1 : 0.2);
          r += R * wt; g += G * wt; b += B * wt; w += wt;
        }
        resolve(toSpine([r / w, g / w, b / w]));
      } catch { resolve(null); }
    };
    img.onerror = () => resolve(null);
    img.src = url;
  });
  colorCache.set(url, p);
  return p;
}

// Darken/desaturate a bit so every spine sits in the cosy candlelit palette.
function toSpine([r, g, b]) {
  let [h, s, l] = rgbToHsl(r, g, b);
  s = Math.min(s, 0.55) * 0.9; l = Math.min(Math.max(l * 0.78, 0.16), 0.5);
  const [R, G, B] = hslToRgb(h, s, l);
  const hex = "#" + [R, G, B].map(v => Math.round(v).toString(16).padStart(2, "0")).join("");
  return { bg: hex, ink: l > 0.42 ? "#2a1a0e" : "#f0dca8", hue: h, lum: l };
}
function rgbToHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255; const mx = Math.max(r, g, b), mn = Math.min(r, g, b); let h = 0, s = 0; const l = (mx + mn) / 2;
  if (mx !== mn) { const d = mx - mn; s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    h = mx === r ? (g - b) / d + (g < b ? 6 : 0) : mx === g ? (b - r) / d + 2 : (r - g) / d + 4; h /= 6; }
  return [h, s, l];
}
function hslToRgb(h, s, l) {
  if (!s) return [l * 255, l * 255, l * 255];
  const q = l < 0.5 ? l * (1 + s) : l + s - l * s, p = 2 * l - q;
  const f = t => { t = (t + 1) % 1; return 255 * (t < 1 / 6 ? p + (q - p) * 6 * t : t < 1 / 2 ? q : t < 2 / 3 ? p + (q - p) * (2 / 3 - t) * 6 : p); };
  return [f(h + 1 / 3), f(h), f(h - 1 / 3)];
}
export function hexHue(hex) {
  const n = parseInt(hex.slice(1), 16); return rgbToHsl((n >> 16) & 255, (n >> 8) & 255, n & 255);
}

/* ───────────── shareable card (PNG) ───────────── */
function loadImg(url) {
  return new Promise(res => {
    if (!url) return res(null);
    const i = new Image(); i.crossOrigin = "anonymous"; i.referrerPolicy = "no-referrer";
    i.onload = () => res(i); i.onerror = () => res(null); i.src = url;
  });
}
function wrap(ctx, text, maxW) {
  const words = text.split(/\s+/); const lines = []; let line = "";
  for (const w of words) { const t = line ? line + " " + w : w; if (ctx.measureText(t).width > maxW && line) { lines.push(line); line = w; } else line = t; }
  if (line) lines.push(line); return lines;
}
function drawHandmade(ctx, item, x, y, w, h) {
  const p = paletteFor(item.title + item.creator);
  ctx.fillStyle = p.bg; ctx.fillRect(x, y, w, h);
  const g = ctx.createLinearGradient(x, 0, x + w, 0); g.addColorStop(0, "rgba(0,0,0,.35)"); g.addColorStop(.08, "rgba(255,255,255,.08)"); g.addColorStop(.12, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(0,0,0,.25)");
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = p.ink; ctx.globalAlpha = .8; ctx.lineWidth = 3; ctx.strokeRect(x + 22, y + 22, w - 44, h - 44); ctx.lineWidth = 1; ctx.strokeRect(x + 32, y + 32, w - 64, h - 64); ctx.globalAlpha = 1;
  ctx.fillStyle = p.ink; ctx.textAlign = "center";
  ctx.font = "600 44px 'Cinzel Decorative', serif";
  const lines = wrap(ctx, item.title, w - 100).slice(0, 4);
  lines.forEach((l, i) => ctx.fillText(l, x + w / 2, y + h * 0.38 + i * 54));
  ctx.font = "italic 28px 'Cormorant Garamond', serif"; ctx.fillText(item.creator || "", x + w / 2, y + h - 70);
}

export async function makeShareCard(item, ownerName) {
  const W = 1080, H = 1350; const c = document.createElement("canvas"); c.width = W; c.height = H; const ctx = c.getContext("2d");
  try { await document.fonts.ready; } catch {}
  // background
  const bg = ctx.createRadialGradient(W / 2, H * 0.35, 80, W / 2, H * 0.5, H * 0.85);
  bg.addColorStop(0, "#3a4a2c"); bg.addColorStop(0.55, "#1d2617"); bg.addColorStop(1, "#0c100a");
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  // sparkles
  for (let i = 0; i < 90; i++) {
    const x = (hash(item.title + i) % W), y = (hash(i + item.title) % H), r = (hash("r" + i) % 30) / 10 + .4;
    ctx.fillStyle = `rgba(255,214,140,${0.15 + (i % 5) / 12})`; ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fill();
  }
  // gold frame
  ctx.strokeStyle = "#c9a45c"; ctx.lineWidth = 4; ctx.strokeRect(40, 40, W - 80, H - 80);
  ctx.lineWidth = 1.5; ctx.strokeRect(56, 56, W - 112, H - 112);
  // cover
  const cw = 420, ch = 630, cx = (W - cw) / 2, cy = 120;
  ctx.save(); ctx.shadowColor = "rgba(0,0,0,.7)"; ctx.shadowBlur = 50; ctx.shadowOffsetY = 24; ctx.fillStyle = "#000"; ctx.fillRect(cx, cy, cw, ch); ctx.restore();
  const img = await loadImg(item.cover);
  if (img) {
    const r = Math.max(cw / img.width, ch / img.height); const iw = img.width * r, ih = img.height * r;
    ctx.save(); ctx.beginPath(); ctx.rect(cx, cy, cw, ch); ctx.clip(); ctx.drawImage(img, cx + (cw - iw) / 2, cy + (ch - ih) / 2, iw, ih); ctx.restore();
  } else drawHandmade(ctx, item, cx, cy, cw, ch);
  // spine shade on cover
  const sh = ctx.createLinearGradient(cx, 0, cx + 30, 0); sh.addColorStop(0, "rgba(0,0,0,.45)"); sh.addColorStop(1, "rgba(0,0,0,0)"); ctx.fillStyle = sh; ctx.fillRect(cx, cy, 30, ch);
  // text
  ctx.textAlign = "center"; ctx.fillStyle = "#f3e2b3";
  ctx.font = "700 54px 'Cinzel Decorative', serif";
  const tl = wrap(ctx, item.title, W - 200).slice(0, 2); tl.forEach((l, i) => ctx.fillText(l, W / 2, 840 + i * 62));
  let y = 840 + tl.length * 62;
  ctx.font = "italic 34px 'Cormorant Garamond', serif"; ctx.fillStyle = "#d9c08a";
  ctx.fillText([item.creator, item.year].filter(Boolean).join(" · "), W / 2, y + 4); y += 56;
  const stars = item.myStars || 0;
  if (stars) { ctx.font = "40px serif"; ctx.fillStyle = "#e8b84a"; ctx.fillText("★".repeat(stars) + "☆".repeat(5 - stars), W / 2, y + 6); y += 56; }
  ctx.font = "30px 'Cormorant Garamond', serif"; ctx.fillStyle = "#e8dcc0";
  const desc = (item.description || "").slice(0, 240) + ((item.description || "").length > 240 ? "…" : "");
  wrap(ctx, desc, W - 260).slice(0, 4).forEach((l, i) => ctx.fillText(l, W / 2, y + 20 + i * 40));
  ctx.font = "600 26px 'Cinzel Decorative', serif"; ctx.fillStyle = "#c9a45c";
  ctx.fillText(`✦ from ${ownerName} shelf ✦`, W / 2, H - 92);
  return new Promise(res => c.toBlob(res, "image/png"));
}
