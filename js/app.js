import * as db from "./db.js";
import * as lookup from "./lookup.js";
import { SEED_ITEMS } from "./seeds.js";
import { HALL_NAME, STARTER_SHELF_FOR, DEFAULT_THEME } from "./config.js";
import { esc, hash, paletteOf, seriesOf, coverHTML, sampleColor, emblemSVG, emblemFor, makeShareCard, hexHue } from "./covers.js";
import { ICON, FLOURISH, SCONCE, windowSVG, vineSVG, SHARED_DEFS, fillBay } from "./art.js";
import { THEMES, applyTheme, savedTheme, theme, currentThemeId } from "./themes.js";

/* ═══════════════ constants ═══════════════ */
const KINDS = {
  book: { label: "Books", one: "book", done: "Read", want: "Want to read", add: "Add a book", ph: "e.g. Fourth Wing, The Hobbit…", url: "books", by: "by" },
  film: { label: "Films", one: "film", done: "Seen", want: "Want to watch", add: "Add a film", ph: "e.g. Shrek, Howl's Moving Castle…", url: "films", by: "directed by" },
  show: { label: "Shows", one: "show", done: "Watched", want: "Want to watch", add: "Add a show", ph: "e.g. Mr. Bean, Gilmore Girls…", url: "shows", by: "from" },
  song: { label: "Songs", one: "song", done: "Loved", want: "To listen", add: "Add a song", ph: "e.g. Cardigan, Riptide…", url: "songs", by: "by" },
};
const URL_KIND = Object.fromEntries(Object.entries(KINDS).map(([k, v]) => [v.url, k]));
const SOURCES = { "": "A book", ao3: "AO3 fic", wattpad: "Wattpad story", tumblr: "Tumblr fic", other: "Other story" };

/* ═══════════════ state & helpers ═══════════════ */
const state = { me: null, profiles: [], items: [], colors: {}, filter: { genre: null, sort: "shelf", q: "" }, route: {} };
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
const view = $("#view");
const modalRoot = $("#modalRoot");

function toast(msg, ms = 2600) {
  const t = $("#toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove("show"), ms);
}
const nameOf = p => (p ? p.display_name || (p.username === "me" ? "" : p.username) : "Someone");
const possessive = n => (!n ? "Your" : /s$/i.test(n) ? `${n}’` : `${n}’s`);
const profileById = id => state.profiles.find(p => p.id === id);
const myStars = it => (state.me && (it.ratings || []).find(r => r.user_id === state.me.id)) || null;
const ownerStars = it => (it.ratings || []).find(r => r.user_id === it.owner) || null;
const avgStars = it => { const r = it.ratings || []; return r.length ? r.reduce((a, b) => a + b.stars, 0) / r.length : 0; };
const siteBase = () => location.origin + location.pathname;
const shelfHref = (username, kind = "book") => `#/shelf/${encodeURIComponent(username)}/${KINDS[kind].url}`;
const itemLink = it => { const p = profileById(it.owner); return `${siteBase()}${shelfHref(p ? p.username : "me", it.kind)}?item=${it.id}`; };
const debounce = (fn, ms) => { let t; return (...a) => { clearTimeout(t); t = setTimeout(() => fn(...a), ms); }; };

function colorOf(it) {
  if (it.extra && it.extra.color) return it.extra.color;
  if (state.colors[it.id]) return state.colors[it.id];
  return paletteOf(it);
}

/* ═══════════════ boot ═══════════════ */
async function boot() {
  applyTheme(savedTheme(DEFAULT_THEME), false);
  document.body.insertAdjacentHTML("afterbegin", SHARED_DEFS);
  $("#brandName").textContent = HALL_NAME;
  document.title = `${HALL_NAME} · Shelves`;
  try { await db.init(); } catch (e) { console.error(e); }
  state.me = await db.currentProfile().catch(() => null);
  await refresh();

  if (db.mode === "local" && !db.isSeeded()) await seedShelf();
  if (db.mode === "cloud" && state.me && state.me.username === STARTER_SHELF_FOR.toLowerCase() && !state.items.some(i => i.owner === state.me.id)) await seedShelf();

  window.addEventListener("hashchange", route);
  let lastW = innerWidth;
  window.addEventListener("resize", debounce(() => { if (Math.abs(innerWidth - lastW) < 30) return; lastW = innerWidth; if (state.route.page === "shelf") renderShelves(); }, 180));
  db.onAuthChange(async () => {
    const before = state.me && state.me.id;
    state.me = await db.currentProfile().catch(() => null);
    if ((state.me && state.me.id) !== before) {
      await refresh();
      if (state.me && state.me.username === STARTER_SHELF_FOR.toLowerCase() && !state.items.some(i => i.owner === state.me.id)) await seedShelf();
      route(true);
    }
  });
  route();
  startMotes();
  enrichPending();
  if (db.mode === "local" && !state.me.display_name) setTimeout(openNameModal, 900);
}

async function refresh() {
  try {
    [state.profiles, state.items] = await Promise.all([db.listProfiles(), db.listAll()]);
  } catch (e) { console.error(e); toast("The Hall’s doors are stuck. Check your connection and refresh."); }
}

async function seedShelf() {
  const seeds = SEED_ITEMS.map(s => ({ ...s, extra: { ...(s.extra || {}), autoLookup: true } }));
  const added = await db.addItems(seeds);
  for (const it of added) if (it.status === "done") await db.setRating(it.id, it.title === "Fourth Wing" || /Shrek|Legally/.test(it.title) ? 5 : 0);
  db.markSeeded();
  await refresh();
}

// Fill in real covers & genres for starter items, quietly, one by one.
async function enrichPending() {
  if (!state.me) return;
  const pending = state.items.filter(i => i.owner === state.me.id && i.extra && i.extra.autoLookup && (i.extra.tries || 0) < 3);
  for (const it of pending) {
    const m = await lookup.bestMatch(it);
    const extra = { ...it.extra, tries: (it.extra.tries || 0) + 1 };
    const patch = { extra };
    if (m) {
      extra.autoLookup = false;
      if (m.cover) patch.cover = m.cover;
      if (!it.creator && m.creator) patch.creator = m.creator;
      if (!it.description && m.description) patch.description = m.description;
      const g = [...(it.genres || [])]; for (const x of m.genres || []) if (g.length < 5 && !g.some(y => y.toLowerCase() === x.toLowerCase())) g.push(x);
      patch.genres = g;
      if (m.extra && m.extra.pages) extra.pages = m.extra.pages;
    }
    try { await db.updateItem(it.id, patch); Object.assign(it, patch); } catch (e) { console.warn(e); }
    if (m && state.route.page === "shelf" && state.route.kind === it.kind) softRerender();
  }
}
const softRerender = debounce(() => { if (!modalRoot.children.length && state.route.page === "shelf") renderShelves(); }, 600);

/* ═══════════════ routing ═══════════════ */
function parseRoute() {
  const h = decodeURI(location.hash.replace(/^#\/?/, ""));
  const [path, qs] = h.split("?");
  const params = new URLSearchParams(qs || "");
  const parts = path.split("/").filter(Boolean);
  if (parts[0] === "shelf") return { page: "shelf", username: decodeURIComponent(parts[1] || ""), kind: URL_KIND[parts[2]] || "book", item: params.get("item") };
  if (parts[0] === "join") return { page: "hall", join: true };
  return { page: "hall" };
}

function route(force = false) {
  const prev = state.route;
  state.route = parseRoute();
  renderTop();
  const r = state.route;
  const sameShelf = prev.page === "shelf" && r.page === "shelf" && prev.username === r.username && prev.kind === r.kind;
  if (r.page === "shelf") {
    if (!sameShelf || force === true) { state.filter.genre = null; state.filter.q = ""; renderLibrary(); window.scrollTo({ top: 0 }); }
  } else { renderHall(); window.scrollTo({ top: 0 }); }
  if (r.join && db.mode === "cloud" && !state.me) openAuth("join");
  if (r.item) { const it = state.items.find(i => i.id === r.item); if (it && !$(".detail", modalRoot)) openDetail(it); }
}

/* ═══════════════ top bar ═══════════════ */
function renderTop() {
  const el = $("#topActions"); const parts = [];
  if (state.route.page === "shelf") parts.push(`<a class="btn ghost small" href="#/">${ICON.door}<span class="lbl">The Hall</span></a>`);
  if (db.mode === "cloud") {
    if (state.me) {
      parts.push(`<button class="btn moss small" data-act="invite">${ICON.link}<span class="lbl">Invite a friend</span></button>`);
      parts.push(`<a class="btn small" href="${shelfHref(state.me.username)}">${ICON.book}<span class="lbl">My shelf</span></a>`);
      parts.push(`<button class="btn ghost small icon-btn" data-act="account" title="Signed in as ${esc(nameOf(state.me))}" aria-label="Account">${ICON.user}</button>`);
    } else {
      parts.push(`<button class="btn gold small" data-act="join">${ICON.plus}<span class="lbl">Make my bookcase</span></button>`);
      parts.push(`<button class="btn ghost small" data-act="signin">Sign in</button>`);
    }
  } else {
    if (state.route.page !== "shelf") parts.push(`<a class="btn small" href="${shelfHref("me")}">${ICON.book}<span class="lbl">My shelf</span></a>`);
    parts.push(`<button class="btn ghost small icon-btn" data-act="name" title="Your name on the shelf" aria-label="Your name">${ICON.user}</button>`);
  }
  parts.push(`<button class="btn ghost small icon-btn" data-act="theme" title="Change the room" aria-label="Change the room">${ICON.brush}</button>`);
  el.innerHTML = parts.join("");
}
document.addEventListener("click", e => {
  const a = e.target.closest("[data-act]"); if (!a) return;
  const act = a.dataset.act;
  if (act === "invite") openInvite();
  if (act === "join") openAuth("join");
  if (act === "signin") openAuth("signin");
  if (act === "account") openAccount();
  if (act === "name") openNameModal();
  if (act === "theme") openThemes();
});

/* ═══════════════ HALL ═══════════════ */
function miniCase(p, isMe) {
  const its = state.items.filter(i => i.owner === p.id);
  const pick = k => its.filter(i => i.kind === k);
  const shelfA = pick("book").slice(-22), shelfB = [...pick("film"), ...pick("show"), ...pick("song")].slice(-22);
  const spines = list => list.length ? list.map((it, i) => {
    const c = colorOf(it).bg; const w = it.kind === "show" ? 12 : it.kind === "film" ? 7 : 7 + (hash(it.id) % 5);
    const h = it.kind === "book" ? 38 + (hash(it.title) % 14) : 48;
    return `<span class="mini-spine ${i === list.length - 1 && list.length < 16 ? "lean" : ""}" style="--c:${c};--w:${w}px;--h:${h}px"></span>`;
  }).join("") : `<span class="mini-empty">waiting for stories…</span>`;
  const counts = Object.keys(KINDS).map(k => [k, pick(k).length]).filter(([, n]) => n).map(([k, n]) => `${n} ${n === 1 ? KINDS[k].one : KINDS[k].label.toLowerCase()}`);
  return `<a class="minicase ${isMe ? "me" : ""}" href="${shelfHref(p.username)}" aria-label="${esc(possessive(nameOf(p)))} shelf">
    ${isMe ? `<span class="you-tag">You</span>` : ""}
    <div class="crown"></div>
    <div class="frame"><div class="mini-shelf">${spines(shelfA)}</div><div class="mini-shelf">${spines(shelfB)}</div></div>
    <div class="nameplate">${esc(possessive(nameOf(p)))} Shelf<small>${counts.length ? esc(counts.slice(0, 2).join(" · ")) : "a fresh new bookcase"}</small></div>
  </a>`;
}

function renderHall() {
  const meId = state.me && state.me.id;
  const ppl = [...state.profiles].sort((a, b) => (a.id === meId ? -1 : b.id === meId ? 1 : 0));
  let empty = "";
  if (db.mode === "cloud" && state.me) empty = `<div class="alcove-empty"><strong>An empty alcove</strong>Send your link to a friend and their bookcase will appear right here.<button class="btn moss small" data-act="invite">${ICON.link} Invite a friend</button></div>`;
  else if (db.mode === "cloud") empty = `<div class="alcove-empty"><strong>This alcove is free</strong>Claim it and fill a bookcase with your own stories.<button class="btn gold small" data-act="join">${ICON.plus} Make my bookcase</button></div>`;
  else empty = `<div class="alcove-empty"><strong>Room for friends</strong>Once the Hall is opened to friends (see the README), their bookcases appear here.</div>`;

  view.innerHTML = `<section class="hall">
    <div class="hall-head">
      <div class="kicker">${esc(theme().kicker)}</div>
      <h1 class="hall-title">${esc(HALL_NAME)}</h1>
      ${FLOURISH}
      <p class="hall-sub">${esc(theme().sub)}</p>
    </div>
    <div class="room">
      <div class="windows">${[0, 1, 2, 3, 4].map(i => windowSVG(i, currentThemeId()) + (i < 4 && theme().sconces ? SCONCE : "")).join("")}</div>
      <div class="wainscot"></div>
      <div class="runner"></div>
      <div class="alcoves">${ppl.map(p => miniCase(p, p.id === meId)).join("")}${empty}</div>
    </div>
    ${db.mode === "local" ? `<p class="banner-note">Your shelf is saved in this browser for now. To share it and give friends their own bookcases in this Hall, follow the short steps in the README.</p>` : ""}
  </section>`;
}

/* ═══════════════ LIBRARY ═══════════════ */
function currentOwner() {
  const u = state.route.username;
  if (db.mode === "local") return state.profiles[0];
  return state.profiles.find(p => p.username === u) || null;
}
const isMine = owner => !!(state.me && owner && state.me.id === owner.id);

function renderLibrary() {
  const owner = currentOwner();
  if (!owner) {
    view.innerHTML = `<section class="library"><div class="lib-sign"><div class="sign-board"><div class="sign-kicker">Vacant</div><h1 class="sign-title">Nobody here yet</h1><div class="sign-sub">This bookcase hasn’t been built.</div></div></div><p style="text-align:center"><a class="btn" href="#/">${ICON.door} Back to the Hall</a></p></section>`;
    return;
  }
  const kind = state.route.kind; const K = KINDS[kind]; const mine = isMine(owner);
  const ownerItems = state.items.filter(i => i.owner === owner.id);
  const tabs = Object.entries(KINDS).map(([k, v]) => {
    const n = ownerItems.filter(i => i.kind === k).length;
    return `<a class="tab" href="${shelfHref(owner.username, k)}" ${k === kind ? 'aria-current="page"' : ""}>${ICON[k]}${v.label}${n ? `<span class="count">${n}</span>` : ""}</a>`;
  }).join("");
  const name = nameOf(owner);
  view.innerHTML = `<section class="library">
    <div class="lib-sign">
      <div class="sign-board">
        <div class="sign-kicker">${{ book: "Ex Libris", film: "The Picture House of", show: "The Serial Room of", song: "The Music Room of" }[kind]}</div>
        <h1 class="sign-title">${esc(name || "Your Shelf")}</h1>
        ${FLOURISH}
        <div class="sign-sub">${mine ? "Every story you finish earns its place here." : "You are visiting. Leave a rating on anything you have read or watched too."}</div>
      </div>
    </div>
    <nav class="tabs" aria-label="Shelves">${tabs}</nav>
    <div class="toolbar">
      <label class="search-wrap">${ICON.search}<span class="sr-only">Find on this shelf</span>
        <input id="themeSearch" class="field" type="search" placeholder="Pull from the shelf: dragons, magic school, funny…" value="${esc(state.filter.q)}" autocomplete="off"></label>
      <select id="sortSel" class="field" aria-label="Arrange by">
        ${[["shelf", "As placed"], ["title", "By title"], ["creator", kind === "book" ? "By author" : "By creator"], ["rating", "By rating"], ["year", "By year"], ["colour", "By colour (rainbow!)"]].map(([v, l]) => `<option value="${v}" ${state.filter.sort === v ? "selected" : ""}>${l}</option>`).join("")}
      </select>
      ${mine ? `<button class="btn gold" id="addBtn">${ICON.quill} ${K.add}</button>` : ""}
      <button class="btn moss" id="suggestBtn">${ICON.wand} Find me something</button>
    </div>
    <div id="finds"></div>
    <div class="chips" id="genreChips"></div>
    <div class="bookcase" id="bookcase"></div>
  </section>`;

  $("#themeSearch").addEventListener("input", debounce(e => { state.filter.q = e.target.value.trim(); applyThemeSearch(); }, 220));
  $("#sortSel").addEventListener("change", e => { state.filter.sort = e.target.value; renderShelves(); });
  if (mine) $("#addBtn").addEventListener("click", () => openAdd(kind));
  $("#suggestBtn").addEventListener("click", () => openSuggest(kind));
  renderShelves(true);
}

function renderGenreChips(items) {
  const counts = {};
  items.forEach(i => (i.genres || []).forEach(g => (counts[g] = (counts[g] || 0) + 1)));
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 14);
  const el = $("#genreChips"); if (!el) return;
  el.innerHTML = top.length > 1 ? top.map(([g, n]) => `<button class="chip" aria-pressed="${state.filter.genre === g}" data-genre="${esc(g)}">${esc(g)} <span style="opacity:.6">${n}</span></button>`).join("") : "";
  $$(".chip", el).forEach(b => b.addEventListener("click", () => { state.filter.genre = state.filter.genre === b.dataset.genre ? null : b.dataset.genre; renderShelves(); }));
}

function sortItems(list) {
  const s = state.filter.sort; const L = [...list];
  const by = f => (a, b) => String(f(a)).localeCompare(String(f(b)), undefined, { numeric: true });
  if (s === "title") L.sort(by(i => i.title.replace(/^(the|a|an) /i, "")));
  if (s === "creator") L.sort(by(i => (i.creator || "zzz").split(",")[0].split(" ").slice(-1)[0] + i.year + i.title));
  if (s === "year") L.sort(by(i => i.year || "9999"));
  if (s === "rating") L.sort((a, b) => avgStars(b) - avgStars(a));
  if (s === "colour") L.sort((a, b) => { const [ha, , la] = hexHue(colorOf(a).bg), [hb, , lb] = hexHue(colorOf(b).bg); return ha - hb || la - lb; });
  return L;
}

function dims(it) {
  const h = hash(it.id + it.title);
  if (it.kind === "film") return { w: 26, h: 188, d: 132 };
  if (it.kind === "show") return { w: 40 + (h % 12), h: 184, d: 130 };
  if (it.kind === "song") return { w: 14 + (h % 6), h: 160, d: 146 };
  // A series shares one edition height; thickness follows the page count.
  const s = seriesOf(it);
  const height = 150 + (hash(s ? s + "|" + it.creator : it.id + it.title) % 56);
  const pages = it.extra && it.extra.pages;
  const w = pages ? Math.max(22, Math.min(58, Math.round(16 + pages / 20))) : 24 + (h % 20);
  return { w, h: height, d: Math.round(height * 0.68) };
}

// Binding style: modern books with a real cover wear dust jackets; the rest are leather, cloth or vellum.
function bindingOf(it) {
  if (it.kind !== "book") return "";
  const s = seriesOf(it); const k = hash((s ? s + it.creator : it.title) + "bind");
  if (it.cover && k % 6 !== 0) return "b-jacket";
  const b = theme().bindings;
  return b[k % b.length];
}

// Shorter spine text: "Harry Potter and the Chamber of Secrets" → "Chamber of Secrets"
function spineTitle(it) {
  let t = it.title;
  const series = seriesOf(it);
  if (series && t.length > 22) {
    const re = new RegExp("^" + series.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "\\s*(and the|and|:|-)\\s*", "i");
    const short = t.replace(re, "");
    if (short !== t && short.length > 2) t = short.replace(/^\w/, c => c.toUpperCase());
  }
  if (t.length > 26 && t.includes(":")) t = t.split(":")[0];
  return t;
}

function volHTML(it, i, lean) {
  const { w, h, d } = dims(it); const c = colorOf(it); const bind = bindingOf(it);
  const pale = hexHue(c.bg)[2] > 0.55 ? "pale" : "";
  const stitle = spineTitle(it);
  const filmTop = it.kind === "film" ? (it.cover ? 84 : 38) : 0;
  const author = (it.creator || "").split(",")[0].split(" ").slice(-1)[0];
  const authorLen = Math.min(46, author.length * 5 + 10);
  const titleNeed = stitle.length * 0.86 * 9 + 16;
  const showAuthor = w >= 26 && author && it.kind === "book" && h - 64 - authorLen >= titleNeed;
  const avail = it.kind === "film" ? h - filmTop - 34 : h - 64 - (showAuthor ? authorLen : 0);
  const fs = Math.max(7, Math.min(Math.floor(w * 0.4), 12, Math.floor((avail - 16) / Math.max(4, stitle.length * 0.86))));
  const others = (it.ratings || []).some(r => r.user_id !== it.owner);
  const seasons = it.kind === "show" && it.year ? `<span class="seasons">${esc(it.year)}</span>` : "";
  const strip = it.kind === "film" && it.cover ? `<span class="poster-strip"><img src="${esc(it.cover)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.remove()"></span>` : "";
  const head = it.kind === "film" ? strip : emblemSVG(emblemFor(it), "em");
  const tail = it.kind === "film" ? emblemSVG("reel", "em") : seasons || (showAuthor ? `<span class="a">${esc(author)}</span>` : `<span class="a-none"></span>`);
  return `<button class="vol k-${it.kind} ${bind} ${pale} ${lean ? "lean" : ""}" data-id="${it.id}" style="--w:${w}px;--h:${h}px;--d:${d}px;--c:${c.bg};--ink:${c.ink};--i:${i};--fs:${fs}px;--tmax:${avail}px;--ftop:${filmTop}px" aria-label="${esc(it.title)}${it.creator ? ", " + esc(it.creator) : ""}">
    <span class="body">
      <span class="face spine">${head}<span class="lbl"><span class="t">${esc(stitle)}</span></span>${tail}</span>
      <span class="face cover-face">${coverHTML(it)}</span>
      <span class="face back-face"></span>
      <span class="face top-face"></span>
    </span>
    ${others ? `<span class="friend-dot" title="Friends rated this"></span>` : ""}
  </button>`;
}

/* The case is built from bays (the open boxes between upright dividers).
   Books fill bays left to right; leftover space and empty bays get objects. */
const BAY_PAD = 12, GAP = 2, STILE = 18;
const bayCount = w => (w >= 960 ? 3 : w >= 600 ? 2 : 1);

// A few ivy strands hanging from a board, at spots that look random but stay put.
function vinesFor(seed, max = 2) {
  const n = 1 + (hash("vn" + seed) % max);
  return Array.from({ length: n }, (_, k) => `<span class="vine" style="left:${4 + (hash("vx" + seed + k) % 90)}%">${vineSVG(seed + k)}</span>`).join("");
}

function packBays(list, room) {
  const bays = []; let cur = [], used = 0;
  for (const it of list) {
    const w = dims(it).w + GAP;
    if (cur.length && used + w > room) { bays.push({ items: cur, used }); cur = []; used = 0; }
    cur.push(it); used += w;
  }
  if (cur.length) bays.push({ items: cur, used });
  return bays;
}

function renderShelves(animate = false) {
  const owner = currentOwner(); if (!owner) return;
  const kind = state.route.kind; const K = KINDS[kind]; const mine = isMine(owner);
  let items = state.items.filter(i => i.owner === owner.id && i.kind === kind);
  renderGenreChips(items);
  if (state.filter.genre) items = items.filter(i => (i.genres || []).includes(state.filter.genre));
  items = sortItems(items);
  const caseEl = $("#bookcase"); if (!caseEl) return;
  caseEl.classList.toggle("calm", !animate);
  const cs = getComputedStyle(caseEl);
  const caseW = caseEl.clientWidth || Math.min(1240, document.documentElement.clientWidth - 32);
  const innerW = caseW - parseFloat(cs.paddingLeft || 0) - parseFloat(cs.paddingRight || 0);
  const n = bayCount(innerW);
  const bayW = (innerW - (n - 1) * STILE) / n;
  const room = Math.floor(bayW - 2 * BAY_PAD);
  let idx = 0, rowNo = 0;
  const used = new Set();

  const bayHTML = (k, inner, extraCls = "") => {
    const own = bayW / 2, shared = innerW / 2 - k * (bayW + STILE);
    const ox = Math.round(own + (shared - own) * 0.55);
    return `<div class="bay ${extraCls}" style="--ox:${ox}px"><div class="box-clip"><div class="box"><i class="b-back"></i><i class="b-floor"></i><i class="b-wl"></i><i class="b-wr"></i></div></div>${inner}</div>`;
  };
  const decoRun = parts => (parts.length ? `<div class="deco-run">${parts.map(p => p.html).join("")}</div>` : "");
  const rowHTML = (bays, label) => {
    const r = rowNo++;
    const vines = theme().vines ? vinesFor("row" + r + owner.id) : "";
    return `<div class="shelf-row">${label || ""}<div class="bays">${bays.join('<div class="stile"></div>')}</div><div class="shelf-board" style="--wx:${-(hash("bx" + r) % 700)}px;--wy:${-((r * 61) % 200)}px">${vines}</div></div>`;
  };

  const section = (status, labelText) => {
    const list = items.filter(i => i.status === status);
    const seed = hash(owner.id + kind + status) % 997;
    const label = `<div class="label-holder"><span>${labelText}<em>${list.length}</em></span></div>`;
    if (!list.length) {
      const msg = status === "done"
        ? (mine ? `Your first ${K.one} is waiting to be shelved.<br><button class="btn gold small" data-add="${status}">${ICON.quill} ${K.add}</button>` : `Nothing here yet.`)
        : (mine ? `Wishes go here: the ${K.one}s you’d love to get&nbsp;to.<br><button class="btn small" data-add="${status}">${ICON.plus} Add a wish</button>` : `No wishes yet.`);
      const mid = Math.floor(n / 2);
      const bays = Array.from({ length: n }, (_, k) => k === mid
        ? bayHTML(k, `<div class="shelf-note">${msg}</div>`, "note-bay")
        : bayHTML(k, decoRun(fillBay(seed + k * 13, room, true, used)), "decor-bay"));
      return rowHTML(bays, label);
    }
    const packed = packBays(list, room);
    // A short collection sits in the middle bay, with objects either side.
    const offset = packed.length < n ? Math.floor((n - packed.length) / 2) : 0;
    const slots = [...Array(offset).fill(null), ...packed];
    while (slots.length % n) slots.push(null);
    let out = "";
    for (let r = 0; r < slots.length / n; r++) {
      const bays = [];
      for (let k = 0; k < n; k++) {
        const b = slots[r * n + k]; const s = seed + r * 31 + k * 7;
        if (!b) { bays.push(bayHTML(k, decoRun(fillBay(s, room, true, used)), "decor-bay")); continue; }
        let left = room - b.used;
        const lean = left > 46 && b.items.length > 2;
        if (lean) left -= 20;
        const vols = b.items.map((it, j) => volHTML(it, idx++, lean && j === b.items.length - 1)).join("");
        bays.push(bayHTML(k, vols + decoRun(left >= 60 ? fillBay(s, left - 6, false, used) : [])));
      }
      out += rowHTML(bays, r === 0 ? label : "");
    }
    return out;
  };

  caseEl.innerHTML = `<div class="case-crown"><i class="cap"></i><i class="cove"></i><i class="dentils"></i><i class="fascia">${theme().vines ? vinesFor("crown" + owner.id, 3) : ""}</i></div>
    <div class="case-body">${section("done", K.done)}${section("want", K.want)}</div>
    <div class="case-plinth"><i class="torus"></i><i class="base"></i></div>`;

  $$("button.vol[data-id]", caseEl).forEach(b => b.addEventListener("click", () => { const it = state.items.find(i => i.id === b.dataset.id); if (it) openDetail(it); }));
  $$("[data-add]", caseEl).forEach(b => b.addEventListener("click", () => openAdd(kind, { status: b.dataset.add })));
  applyThemeSearch();
  paintColors(items);
}

// Sample real cover colours for spines (and remember them on your own items).
async function paintColors(items) {
  for (const it of items) {
    if ((it.extra && it.extra.color) || state.colors[it.id] || !it.cover) continue;
    const c = await sampleColor(it.cover);
    if (!c) continue;
    state.colors[it.id] = c;
    const el = $(`.vol[data-id="${it.id}"]`);
    if (el) { el.style.setProperty("--c", c.bg); el.style.setProperty("--ink", c.ink); }
    if (state.me && it.owner === state.me.id) {
      const extra = { ...(it.extra || {}), color: c }; it.extra = extra;
      db.updateItem(it.id, { extra }).catch(() => {});
    }
  }
}

/* ═══════════════ theme search on a shelf ═══════════════ */
const STOP = new Set("a an the and or of about with that is are was i me my give find show book books something some story stories where which who read have has in on to for like want".split(" "));
const SYN = {
  magic: ["magic", "wizard", "witch", "spell", "sorcer", "hogwarts", "enchant"],
  dragon: ["dragon", "wyvern", "rider"],
  romance: ["romance", "love", "romantic", "romantasy", "kiss"],
  school: ["school", "academy", "college", "student"],
  princess: ["princess", "prince", "royal", "queen", "king", "kingdom"],
  funny: ["comedy", "funny", "humor", "humour", "hilarious"],
  scary: ["horror", "scary", "ghost", "haunt"],
  friend: ["friend", "friendship", "found family"],
  war: ["war", "battle", "military", "soldier"],
  fairy: ["fairy", "fae", "faerie", "fairy tale"],
  animal: ["animal", "cat", "dog", "donkey", "creature"],
};
function tokenGroups(q) {
  return q.toLowerCase().split(/[\s,;.!?]+/).filter(w => w && !STOP.has(w)).map(w => {
    const stem = w.length > 4 ? w.replace(/(ies)$/, "y").replace(/(es|s)$/, "") : w;
    const key = Object.keys(SYN).find(k => SYN[k].some(s => stem.startsWith(s) || s.startsWith(stem)));
    return key ? SYN[key] : [stem];
  });
}
export function scoreItems(list, q) {
  const groups = tokenGroups(q); if (!groups.length) return [];
  return list.map(it => {
    const f = {
      title: it.title.toLowerCase(), genres: (it.genres || []).join(" ").toLowerCase(), creator: (it.creator || "").toLowerCase(),
      series: ((it.extra && it.extra.series) || "").toLowerCase(), notes: (it.ratings || []).map(r => r.note || "").join(" ").toLowerCase(),
      desc: (it.description || "").toLowerCase(),
    };
    let score = 0, matched = 0;
    for (const g of groups) {
      let gs = 0;
      for (const t of g) {
        if (f.title.includes(t)) gs = Math.max(gs, 4);
        if (f.genres.includes(t)) gs = Math.max(gs, 3);
        if (f.creator.includes(t) || f.series.includes(t)) gs = Math.max(gs, 3);
        if (f.notes.includes(t)) gs = Math.max(gs, 2);
        if (f.desc.includes(t)) gs = Math.max(gs, 1.5);
      }
      if (gs) { matched++; score += gs; }
    }
    return { it, score: score + matched * 5, matched };
  }).filter(x => x.matched >= Math.ceil(groups.length / 2)).sort((a, b) => b.score - a.score).map(x => x.it);
}

function applyThemeSearch() {
  const owner = currentOwner(); const finds = $("#finds"); if (!finds || !owner) return;
  const q = state.filter.q;
  const vols = $$(".vol[data-id]");
  if (!q) { vols.forEach(v => v.classList.remove("pulled", "dim")); finds.innerHTML = ""; return; }
  const all = state.items.filter(i => i.owner === owner.id);
  const hits = scoreItems(all, q);
  const ids = new Set(hits.map(h => h.id));
  vols.forEach(v => { v.classList.toggle("pulled", ids.has(v.dataset.id)); v.classList.toggle("dim", !ids.has(v.dataset.id)); });
  finds.innerHTML = hits.length
    ? `<p class="finds-head">${hits.length} ${hits.length === 1 ? "story answers" : "stories answer"} to “${esc(q)}”</p><div class="finds">${hits.slice(0, 20).map(it => `<button class="find-card" data-id="${it.id}">${coverHTML(it)}<div><b>${esc(it.title)}</b><span>${esc(KINDS[it.kind].one)} · ${esc(it.status === "done" ? KINDS[it.kind].done : KINDS[it.kind].want)}</span></div></button>`).join("")}</div>`
    : `<p class="finds-head">Nothing on this shelf whispers “${esc(q)}” yet. Try another word, or <button class="more-link" style="color:var(--gold-hi)" id="findOnline">find something new about it</button>.</p>`;
  $$(".find-card", finds).forEach(b => b.addEventListener("click", () => openDetail(state.items.find(i => i.id === b.dataset.id))));
  const fo = $("#findOnline"); if (fo) fo.addEventListener("click", () => openSuggest(state.route.kind, q));
  const first = $(".vol.pulled"); if (first && hits.length) first.scrollIntoView({ behavior: "smooth", block: "center", inline: "nearest" });
}

/* ═══════════════ modal plumbing ═══════════════ */
function openModal(html, { wide = false, wax = null, onClose } = {}) {
  closeModal(true);
  const wrap = document.createElement("div");
  wrap.className = "modal-backdrop";
  wrap.innerHTML = `<div class="parchment ${wide ? "wide" : ""} ${wax ? "has-wax" : ""}" role="dialog" aria-modal="true">
    ${wax ? `<div class="wax">${wax}</div>` : ""}<button class="close-x" aria-label="Close">×</button><div class="m-body">${html}</div></div>`;
  modalRoot.appendChild(wrap);
  const close = () => closeModal();
  wrap.addEventListener("mousedown", e => { if (e.target === wrap) close(); });
  $(".close-x", wrap).addEventListener("click", close);
  wrap._onClose = onClose;
  document.body.style.overflow = "hidden";
  setTimeout(() => { const f = $("input:not([type=hidden]), textarea", wrap); if (f && matchMedia("(pointer:fine)").matches) f.focus(); else $(".parchment", wrap).focus?.(); }, 60);
  return wrap;
}
function closeModal(instant = false) {
  const w = modalRoot.firstElementChild; if (!w) return;
  const done = () => { w.remove(); document.body.style.overflow = ""; w._onClose && w._onClose(); };
  if (instant) return done();
  w.classList.add("closing"); setTimeout(done, 180);
}
document.addEventListener("keydown", e => { if (e.key === "Escape" && modalRoot.firstElementChild) closeModal(); });

function sparkleAt(x, y, n = 18) {
  for (let i = 0; i < n; i++) {
    const s = document.createElement("span"); s.className = "sparkle";
    const a = Math.random() * Math.PI * 2, d = 30 + Math.random() * 70;
    s.style.left = x + "px"; s.style.top = y + "px"; s.style.setProperty("--dx", Math.cos(a) * d + "px"); s.style.setProperty("--dy", Math.sin(a) * d - 20 + "px");
    document.body.appendChild(s); setTimeout(() => s.remove(), 950);
  }
}

/* ═══════════════ DETAIL ═══════════════ */
function setItemInURL(id) {
  const base = location.hash.split("?")[0];
  history.replaceState(null, "", id ? `${base}?item=${id}` : base || "#/");
}

function openDetail(it) {
  if (!it) return;
  const owner = profileById(it.owner); const K = KINDS[it.kind]; const mine = isMine(owner);
  const c = colorOf(it);
  const mineR = myStars(it);
  const others = (it.ratings || []).filter(r => !state.me || r.user_id !== state.me.id);
  const avg = avgStars(it);
  const canRate = !!state.me;
  const extra = it.extra || {};
  const facts = [extra.series, extra.pages ? `${extra.pages} pages` : "", extra.minutes ? `${extra.minutes} min` : "", it.source && SOURCES[it.source] ? SOURCES[it.source] : ""].filter(Boolean);
  const html = `<div class="detail">
    <div class="book3d-stage">
      <div class="book3d k-${it.kind}" style="--c:${c.bg}">
        <div class="b-front">${coverHTML(it)}</div><div class="b-spine"></div><div class="b-pages"></div><div class="b-back"></div>
      </div>
      <div class="book3d-shadow"></div>
    </div>
    <div>
      <div class="d-kicker">${esc(K.one)} · ${esc(it.status === "done" ? K.done : K.want)} · ${mine ? "your shelf" : `on ${esc(possessive(nameOf(owner)))} shelf`}</div>
      <h2 class="d-title">${esc(it.title)}</h2>
      <div class="d-by">${it.creator ? `${K.by} ${esc(it.creator)}` : ""}${it.year ? ` · ${esc(it.year)}` : ""}</div>
      ${facts.length ? `<div class="hint" style="margin-top:4px">${esc(facts.join(" · "))}</div>` : ""}
      ${(it.genres || []).length ? `<div class="row" style="margin-top:10px;gap:6px">${it.genres.map(g => `<span class="chip">${esc(g)}</span>`).join("")}</div>` : ""}
      ${it.description ? `<p class="d-desc clamp" id="dDesc">${esc(it.description)}</p>${it.description.length > 420 ? `<button class="more-link" id="moreDesc">Read the whole blurb</button>` : ""}` : `<p class="d-desc hint">No description was found${mine ? ". You can write one with Edit." : "."}</p>`}
      ${it.link ? `<p><a href="${esc(it.link)}" target="_blank" rel="noopener">Open the story ↗</a></p>` : ""}
      <div class="divider"></div>
      ${canRate ? `<span class="label">${mine ? "Your rating" : it.kind === "book" ? "Read it too? Your rating" : "Seen it too? Your rating"}</span>
        <div class="stars" id="myStars" role="radiogroup" aria-label="Your rating">${[1, 2, 3, 4, 5].map(n => `<button role="radio" aria-checked="${mineR && mineR.stars === n}" aria-label="${n} star${n > 1 ? "s" : ""}" data-n="${n}" class="${mineR && mineR.stars >= n ? "on" : ""}">★</button>`).join("")}</div>
        <textarea class="field" id="myNote" rows="2" style="min-height:60px;margin-top:8px" placeholder="A little note: favourite moment, who you’d lend it to…">${esc(mineR ? mineR.note || "" : "")}</textarea>`
      : `<p class="hint">${db.mode === "cloud" ? `<button class="more-link" data-act="join">Make your own bookcase</button> to leave a rating.` : ""}</p>`}
      ${others.length ? `<span class="label">What everyone thought ${avg ? `<span class="avg">· ${avg.toFixed(1)} ★ average</span>` : ""}</span>
        <ul class="ratings-list">${others.map(r => `<li><span class="who">${esc(r.user_id === it.owner ? nameOf(owner) : r.name)}</span><span class="stars readonly">${"★".repeat(r.stars)}${"☆".repeat(5 - r.stars)}</span>${r.note ? `<span class="note">“${esc(r.note)}”</span>` : ""}</li>`).join("")}</ul>` : ""}
      <div class="divider"></div>
      <div class="row">
        ${mine ? `<button class="btn small" id="moveBtn">${ICON.move} Move to ${esc(it.status === "done" ? K.want : K.done)}</button>
                  <button class="btn small" id="editBtn">${ICON.edit} Edit</button>` : ""}
        ${!mine && state.me ? `<button class="btn small" id="wishBtn">${ICON.heart} Add to my ${esc(K.want.toLowerCase())}</button>` : ""}
        <button class="btn gold small" id="cardBtn">${ICON.share} Share card</button>
        <button class="btn small" id="linkBtn">${ICON.link} Copy link</button>
        ${mine ? `<button class="btn danger small" id="delBtn">${ICON.trash} Remove</button>` : ""}
      </div>
    </div>
  </div>`;
  const w = openModal(html, { wide: true, onClose: () => setItemInURL(null) });
  setItemInURL(it.id);

  // gentle tilt with the pointer
  const book = $(".book3d", w); const stage = $(".book3d-stage", w);
  stage.addEventListener("pointermove", e => { const r = stage.getBoundingClientRect(); const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; book.style.transform = `rotateY(${-18 + x * 30}deg) rotateX(${6 - y * 14}deg)`; });
  stage.addEventListener("pointerleave", () => (book.style.transform = ""));

  const more = $("#moreDesc", w); if (more) more.addEventListener("click", () => { $("#dDesc", w).classList.remove("clamp"); more.remove(); });

  if (canRate) {
    const save = async (stars) => {
      const note = $("#myNote", w).value.trim();
      await db.setRating(it.id, stars, note);
      await refresh();
    };
    let current = mineR ? mineR.stars : 0;
    $$("#myStars button", w).forEach(b => b.addEventListener("click", async () => {
      const n = +b.dataset.n; current = current === n ? 0 : n;
      $$("#myStars button", w).forEach(x => { x.classList.toggle("on", +x.dataset.n <= current); x.setAttribute("aria-checked", +x.dataset.n === current); });
      const r = b.getBoundingClientRect(); if (current) sparkleAt(r.left + r.width / 2, r.top + r.height / 2, 10);
      await save(current); toast(current ? `${"★".repeat(current)} saved` : "Rating cleared");
      if (state.route.page === "shelf") renderShelves();
    }));
    $("#myNote", w).addEventListener("change", async () => { if (!current) { toast("Pick some stars first, then your note is saved with them"); return; } await save(current); toast("Note tucked in ✦"); });
  }
  const mv = $("#moveBtn", w);
  if (mv) mv.addEventListener("click", async () => {
    const status = it.status === "done" ? "want" : "done";
    await db.updateItem(it.id, { status }); await refresh(); closeModal(); renderShelves();
    toast(`Moved to ${status === "done" ? K.done : K.want}`);
    const el = $(`.vol[data-id="${it.id}"]`); if (el) { el.scrollIntoView({ block: "center", behavior: "smooth" }); const r = el.getBoundingClientRect(); setTimeout(() => sparkleAt(r.left + r.width / 2, r.top + 40), 400); }
  });
  const ed = $("#editBtn", w); if (ed) ed.addEventListener("click", () => openConfirm({ ...it }, { editing: true }));
  const wish = $("#wishBtn", w);
  if (wish) wish.addEventListener("click", () => {
    const copy = { kind: it.kind, status: "want", title: it.title, creator: it.creator, year: it.year, description: it.description, cover: it.cover, genres: it.genres, link: it.link, source: it.source, extra: { ...(it.extra || {}), color: undefined, from: nameOf(owner) } };
    openConfirm(copy, { note: `Found on ${possessive(nameOf(owner))} shelf` });
  });
  $("#cardBtn", w).addEventListener("click", async e => {
    const btn = e.currentTarget; btn.disabled = true; btn.textContent = "Painting the card…";
    try {
      const blob = await makeShareCard({ ...it, myStars: (ownerStars(it) || {}).stars || 0 }, possessive(nameOf(owner)));
      const file = new File([blob], `${it.title.replace(/[^\w]+/g, "-").toLowerCase()}.png`, { type: "image/png" });
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: it.title, text: `${it.title}: ${itemLink(it)}` }).catch(() => {});
      } else {
        const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = file.name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 4000);
        toast("Card saved to your downloads ✦");
      }
    } catch (err) { console.error(err); toast("The card smudged. Try again?"); }
    btn.disabled = false; btn.innerHTML = `${ICON.share} Share card`;
  });
  $("#linkBtn", w).addEventListener("click", async () => {
    const url = itemLink(it);
    try { await navigator.clipboard.writeText(url); toast("Link copied. Send it to a friend ✦"); } catch { prompt("Copy this link:", url); }
  });
  const del = $("#delBtn", w);
  if (del) del.addEventListener("click", async () => {
    if (!del.dataset.sure) { del.dataset.sure = "1"; del.innerHTML = `${ICON.trash} Really remove?`; return; }
    await db.deleteItem(it.id); await refresh(); closeModal(); renderShelves(); toast(`“${it.title}” was returned to the wild`);
  });
}

/* ═══════════════ ADD: the scribe's desk ═══════════════ */
function openAdd(kind = "book", opts = {}) {
  let status = opts.status || "done";
  const html = `<h2>The Scribe’s Desk</h2>
    <p class="lead">Write a title and I’ll find its author, story and cover. If there’s no cover, I’ll bind a handmade one.</p>
    <div class="row" style="justify-content:space-between">
      <div class="seg" id="kindSeg" role="group" aria-label="What kind">${Object.entries(KINDS).map(([k, v]) => `<button data-k="${k}" aria-pressed="${k === kind}">${v.one}</button>`).join("")}</div>
      <div class="seg" id="statusSeg" role="group" aria-label="Which shelf"><button data-s="done"></button><button data-s="want"></button></div>
    </div>
    <form id="qForm" class="row" style="margin-top:14px;flex-wrap:nowrap">
      <input id="q" class="field" placeholder="${esc(KINDS[kind].ph)}" autocomplete="off" required>
      <button class="btn gold" type="submit">${ICON.search} Find</button>
    </form>
    <div id="results"></div>
    <p class="hint" style="margin-top:16px">Can’t find it, or it’s a fic? <button class="more-link" id="manual">Write it in by hand</button> (AO3, Wattpad, Tumblr and anything else).</p>`;
  const w = openModal(html, { wide: true, wax: ICON.quill });
  const paintStatus = () => $$("#statusSeg button", w).forEach(b => { b.textContent = b.dataset.s === "done" ? KINDS[kind].done : KINDS[kind].want; b.setAttribute("aria-pressed", b.dataset.s === status); });
  paintStatus();
  $$("#kindSeg button", w).forEach(b => b.addEventListener("click", () => { kind = b.dataset.k; $$("#kindSeg button", w).forEach(x => x.setAttribute("aria-pressed", x === b)); $("#q", w).placeholder = KINDS[kind].ph; paintStatus(); $("#results", w).innerHTML = ""; }));
  $$("#statusSeg button", w).forEach(b => b.addEventListener("click", () => { status = b.dataset.s; paintStatus(); }));
  $("#manual", w).addEventListener("click", () => openConfirm({ kind, status, title: $("#q", w).value.trim(), creator: "", year: "", description: "", cover: "", genres: [], extra: {} }, { manual: true }));
  $("#qForm", w).addEventListener("submit", async e => {
    e.preventDefault();
    const q = $("#q", w).value.trim(); if (!q) return;
    const res = $("#results", w);
    res.innerHTML = `<div class="loading">${ICON.quill.replace("<svg", '<svg class="quill-spin"')} Searching the archives…</div>`;
    let list = [];
    try { list = await lookup.search(kind, q); } catch (err) { console.warn(err); }
    if (!list.length) {
      res.innerHTML = `<div class="loading" style="flex-direction:column">Nothing turned up for “${esc(q)}”.<button class="btn small" id="manual2">${ICON.quill} Bind a handmade copy instead</button></div>`;
      $("#manual2", w).addEventListener("click", () => openConfirm({ kind, status, title: q, creator: "", year: "", description: "", cover: "", genres: [], extra: {} }, { manual: true }));
      return;
    }
    res.innerHTML = `<div class="results">${list.map((r, i) => `<button class="result" data-i="${i}">${coverHTML(r)}<b>${esc(r.title)}</b><span>${esc(r.creator || "")}${r.year ? ` · ${esc(r.year)}` : ""}</span><span class="src">${esc(r.from || "")}</span></button>`).join("")}</div>`;
    $$(".result", res).forEach(b => b.addEventListener("click", () => { const r = list[+b.dataset.i]; openConfirm({ ...r, status }); }));
  });
}

async function openConfirm(item, opts = {}) {
  const K = KINDS[item.kind];
  const editing = !!opts.editing; const manual = !!opts.manual;
  let genres = [...(item.genres || [])];
  let stars = editing ? ((myStars(item) || {}).stars || 0) : 0;
  const html = `<h2>${editing ? "Mend the binding" : manual ? "Bind a handmade copy" : "Ready for the shelf?"}</h2>
    <p class="lead">${opts.note ? esc(opts.note) + ". " : ""}${editing ? "Change anything you like." : "Check the details, fix anything, then place it on your shelf."}</p>
    <div class="detail">
      <div class="book3d-stage"><div class="book3d k-${item.kind}" id="pvBook" style="--c:${colorOf(item).bg}"><div class="b-front" id="pvCover">${coverHTML(item)}</div><div class="b-spine"></div><div class="b-pages"></div><div class="b-back"></div></div><div class="book3d-shadow"></div></div>
      <form id="cForm">
        <label class="label" for="fTitle">Title</label><input id="fTitle" class="field" value="${esc(item.title)}" required>
        <div class="row" style="flex-wrap:nowrap">
          <div style="flex:2"><label class="label" for="fCreator">${item.kind === "book" ? "Author" : item.kind === "film" ? "Director" : item.kind === "show" ? "Network / creator" : "Artist"}</label><input id="fCreator" class="field" value="${esc(item.creator)}"></div>
          <div style="flex:1"><label class="label" for="fYear">Year</label><input id="fYear" class="field" value="${esc(item.year)}" inputmode="numeric"></div>
        </div>
        ${manual || item.source || item.link ? `<div class="row" style="flex-wrap:nowrap">
          <div style="flex:1"><label class="label" for="fSource">Where it lives</label><select id="fSource" class="field" style="width:100%">${Object.entries(SOURCES).map(([v, l]) => `<option value="${v}" ${(item.source || "") === v ? "selected" : ""}>${l}</option>`).join("")}</select></div>
          <div style="flex:2"><label class="label" for="fLink">Link (optional)</label><input id="fLink" class="field" value="${esc(item.link || "")}" placeholder="https://archiveofourown.org/works/…"></div></div>` : ""}
        <label class="label">Genres & themes</label>
        <div class="row" id="gChips" style="gap:6px"></div>
        <input id="fGenre" class="field" style="margin-top:8px" placeholder="Add a genre or theme and press Enter (e.g. enemies to lovers)">
        <label class="label" for="fDesc">What it’s about</label><textarea id="fDesc" class="field" placeholder="A few lines about the story…">${esc(item.description)}</textarea>
        ${manual || editing ? `<label class="label" for="fCover">Cover image link (optional)</label><input id="fCover" class="field" value="${esc(item.cover || "")}" placeholder="Leave empty for a handmade cover">` : ""}
        ${!editing ? `<label class="label">Shelf</label><div class="seg" id="cStatus"><button type="button" data-s="done" aria-pressed="${item.status === "done"}">${K.done}</button><button type="button" data-s="want" aria-pressed="${item.status === "want"}">${K.want}</button></div>` : ""}
        <div id="rateWrap" ${item.status === "want" && !editing ? 'hidden' : ""}><label class="label">Your rating</label><div class="stars" id="cStars">${[1, 2, 3, 4, 5].map(n => `<button type="button" data-n="${n}" aria-label="${n} stars" class="${stars >= n ? "on" : ""}">★</button>`).join("")}</div></div>
        <div class="row end" style="margin-top:18px"><button class="btn gold" type="submit">${ICON.sparkle} ${editing ? "Save" : "Place it on the shelf"}</button></div>
      </form>
    </div>`;
  const w = openModal(html, { wide: true, wax: ICON.sparkle });
  const paintChips = () => {
    $("#gChips", w).innerHTML = genres.map((g, i) => `<button type="button" class="chip" aria-pressed="true" data-i="${i}">${esc(g)} <span class="x">×</span></button>`).join("") || `<span class="hint">None yet</span>`;
    $$("#gChips .chip", w).forEach(b => b.addEventListener("click", () => { genres.splice(+b.dataset.i, 1); paintChips(); }));
  };
  paintChips();
  $("#fGenre", w).addEventListener("keydown", e => {
    if (e.key === "Enter" || e.key === ",") { e.preventDefault(); const v = e.target.value.trim().replace(/,$/, ""); if (v && !genres.includes(v)) { genres.push(v.replace(/\b\w/g, c => c.toUpperCase())); paintChips(); } e.target.value = ""; }
  });
  let status = item.status || "done";
  $$("#cStatus button", w).forEach(b => b.addEventListener("click", () => { status = b.dataset.s; $$("#cStatus button", w).forEach(x => x.setAttribute("aria-pressed", x === b)); $("#rateWrap", w).hidden = status === "want"; }));
  $$("#cStars button", w).forEach(b => b.addEventListener("click", () => { const n = +b.dataset.n; stars = stars === n ? 0 : n; $$("#cStars button", w).forEach(x => x.classList.toggle("on", +x.dataset.n <= stars)); }));

  // live handmade-cover preview while typing (when there's no real cover)
  const preview = debounce(() => {
    const cov = $("#fCover", w) ? $("#fCover", w).value.trim() : item.cover;
    const draft = { ...item, title: $("#fTitle", w).value || "Untitled", creator: $("#fCreator", w).value, year: $("#fYear", w).value, source: $("#fSource", w) ? $("#fSource", w).value : item.source, cover: cov, genres };
    $("#pvCover", w).innerHTML = coverHTML(draft);
    $("#pvBook", w).style.setProperty("--c", colorOf(draft).bg);
  }, 250);
  ["#fTitle", "#fCreator", "#fYear", "#fSource", "#fCover"].forEach(s => { const el = $(s, w); if (el) el.addEventListener("input", preview); });

  // fetch a description for Open Library picks that came without one
  if (!item.description && item.extra && item.extra.olKey && !manual) {
    lookup.olDescription(item.extra.olKey).then(d => { const ta = $("#fDesc", w); if (d && ta && !ta.value) ta.value = d; });
  }

  $("#cForm", w).addEventListener("submit", async e => {
    e.preventDefault();
    const btn = e.submitter || $("button[type=submit]", w); btn.disabled = true;
    const data = {
      kind: item.kind, status, title: $("#fTitle", w).value.trim(), creator: $("#fCreator", w).value.trim(), year: $("#fYear", w).value.trim(),
      description: $("#fDesc", w).value.trim(), genres, cover: $("#fCover", w) ? $("#fCover", w).value.trim() : item.cover || "",
      source: $("#fSource", w) ? $("#fSource", w).value : item.source || "", link: $("#fLink", w) ? $("#fLink", w).value.trim() : item.link || "",
      extra: { ...(item.extra || {}) },
    };
    if (!data.title) { btn.disabled = false; return; }
    if (data.cover !== item.cover) delete data.extra.color;
    delete data.extra.autoLookup;
    try {
      if (editing) {
        delete data.status;
        await db.updateItem(item.id, data);
        if (stars !== ((myStars(item) || {}).stars || 0)) await db.setRating(item.id, stars, (myStars(item) || {}).note || "");
        delete state.colors[item.id];
        await refresh(); closeModal(); renderShelves(); toast("Mended ✦");
        return;
      }
      const added = await db.addItem(data);
      if (stars && status === "done") await db.setRating(added.id, stars, "");
      await refresh();
      closeModal(true);
      // walk to the right shelf, then fly the cover onto it
      const target = shelfHref(state.me.username, data.kind);
      if (!location.hash.startsWith(target)) { location.hash = target; await new Promise(r => setTimeout(r, 60)); }
      else renderShelves();
      flyToShelf(added);
    } catch (err) { console.error(err); toast("The ink smudged: " + (err.message || "try again")); btn.disabled = false; }
  });
}

function flyToShelf(it) {
  const el = $(`.vol[data-id="${it.id}"]`);
  if (!el) { toast(`“${it.title}” is on your shelf ✦`); return; }
  el.scrollIntoView({ block: "center", behavior: "smooth" });
  el.style.opacity = "0";
  setTimeout(() => {
    const r = el.getBoundingClientRect();
    const f = document.createElement("div"); f.className = "flyer";
    const W = 180, H = it.kind === "song" ? 180 : 270;
    Object.assign(f.style, { left: innerWidth / 2 - W / 2 + "px", top: innerHeight / 2 - H / 2 + "px", width: W + "px", height: H + "px", transform: "rotate(-6deg)" });
    f.innerHTML = coverHTML(it).replace('class="cover', 'style="position:absolute;inset:0" class="cover');
    document.body.appendChild(f);
    requestAnimationFrame(() => requestAnimationFrame(() => {
      Object.assign(f.style, { left: r.left + "px", top: r.top + "px", width: r.width + "px", height: r.height + "px", transform: "rotate(0deg)", opacity: ".2" });
    }));
    setTimeout(() => { f.remove(); el.style.opacity = ""; el.classList.add("pulled"); sparkleAt(r.left + r.width / 2, r.top + r.height / 3, 26); setTimeout(() => el.classList.remove("pulled"), 1600); }, 880);
    toast(`“${it.title}” is on your shelf ✦`);
  }, 450);
}

/* ═══════════════ "Find me something about…" ═══════════════ */
function openSuggest(kind = "book", preset = "") {
  const html = `<h2>Find me something…</h2>
    <p class="lead">Tell me what you’re in the mood for: a few words like <i>dragons, enemies to lovers, cosy village</i>.</p>
    <form id="sForm" class="row" style="flex-wrap:nowrap"><input id="sq" class="field" value="${esc(preset)}" placeholder="dragons, found family, slow burn…" required><button class="btn gold" type="submit">${ICON.wand} Conjure</button></form>
    <div id="sOut"></div>`;
  const w = openModal(html, { wide: true, wax: ICON.wand });
  const run = async q => {
    const out = $("#sOut", w);
    const friendsHits = scoreItems(state.items.filter(i => !state.me || i.owner !== state.me.id), q).slice(0, 10);
    const ownHits = state.me ? scoreItems(state.items.filter(i => i.owner === state.me.id), q).slice(0, 6) : [];
    const portals = lookup.ficLinks(q);
    const portalColors = { ao3: "#990000", wattpad: "#ff6122", tumblr: "#36465d", goodreads: "#7a5b3a" };
    out.innerHTML = `
      <span class="label">Stories & fics</span>
      <div class="portal-grid">${portals.map(p => `<a class="portal" style="--pc:${portalColors[p.source]}" href="${p.url}" target="_blank" rel="noopener"><b>${esc(p.label)} ↗</b><span>${esc(p.hint)} for “${esc(q)}”</span></a>`).join("")}</div>
      <p class="hint" style="margin:8px 0 0">Found a fic you love? <button class="more-link" id="addFic">Put it on your shelf</button> with a handmade cover.</p>
      ${friendsHits.length ? `<span class="label">Already on friends’ shelves</span><div class="results">${friendsHits.map(it => `<button class="result" data-fid="${it.id}">${coverHTML(it)}<b>${esc(it.title)}</b><span>on ${esc(possessive(nameOf(profileById(it.owner))))} shelf</span></button>`).join("")}</div>` : ""}
      ${ownHits.length ? `<span class="label">You already have</span><div class="results">${ownHits.map(it => `<button class="result" data-fid="${it.id}">${coverHTML(it)}<b>${esc(it.title)}</b><span>${esc(it.status === "done" ? KINDS[it.kind].done : KINDS[it.kind].want)}</span></button>`).join("")}</div>` : ""}
      <span class="label">Books that might enchant you</span>
      <div id="bookSugg"><div class="loading">${ICON.quill.replace("<svg", '<svg class="quill-spin"')} Asking the librarians…</div></div>`;
    $$("[data-fid]", out).forEach(b => b.addEventListener("click", () => openDetail(state.items.find(i => i.id === b.dataset.fid))));
    $("#addFic", out).addEventListener("click", () => openConfirm({ kind: "book", status: "want", title: "", creator: "", year: "", description: "", cover: "", genres: q.split(/,\s*/).slice(0, 3).map(s => s.replace(/\b\w/g, c => c.toUpperCase())), source: "ao3", extra: {} }, { manual: true }));
    let books = [];
    try { books = await lookup.suggestBooks(q); } catch (e) { console.warn(e); }
    const have = new Set(state.items.filter(i => state.me && i.owner === state.me.id).map(i => i.title.toLowerCase()));
    books = books.filter(b => !have.has(b.title.toLowerCase()));
    const bs = $("#bookSugg", w); if (!bs) return;
    bs.innerHTML = books.length ? `<div class="results">${books.map((b, i) => `<div class="sugg-card">${coverHTML(b).replace('class="cover', `data-bi="${i}" class="cover`)}<b>${esc(b.title)}</b><span>${esc(b.creator)}${b.year ? ` · ${esc(b.year)}` : ""}${b.extra.rating ? ` · ${b.extra.rating.toFixed(1)}★` : ""}</span>${state.me ? `<button class="btn small" data-bi="${i}">${ICON.plus} Want to read</button>` : ""}</div>`).join("")}</div>`
      : `<p class="hint">The librarians found nothing for that. Try fewer or simpler words (e.g. “dragons” or “witch romance”).</p>`;
    $$("[data-bi]", bs).forEach(b => b.addEventListener("click", () => { if (!state.me) return; const x = books[+b.dataset.bi]; openConfirm({ ...x, status: "want" }); }));
  };
  $("#sForm", w).addEventListener("submit", e => { e.preventDefault(); const q = $("#sq", w).value.trim(); if (q) run(q); });
  if (preset) run(preset);
}

/* ═══════════════ friends, accounts, names ═══════════════ */
function openInvite() {
  const link = `${siteBase()}#/join`;
  const w = openModal(`<h2>Invite a friend</h2>
    <p class="lead">Anyone with this link can make a bookcase with their own name in ${esc(HALL_NAME)}. They’ll see every shelf here, and you can rate each other’s books and films.</p>
    <div class="link-box"><code>${esc(link)}</code><button class="btn gold small" id="copyInv">${ICON.link} Copy</button></div>
    ${navigator.share ? `<p style="margin-top:14px"><button class="btn small" id="shareInv">${ICON.share} Send it…</button></p>` : ""}
    <p class="hint" style="margin-top:14px">Only people you send the link to will know the Hall exists.</p>`, { wax: ICON.link });
  $("#copyInv", w).addEventListener("click", async () => { try { await navigator.clipboard.writeText(link); toast("Invitation copied ✦"); } catch { prompt("Copy this link:", link); } });
  const sh = $("#shareInv", w); if (sh) sh.addEventListener("click", () => navigator.share({ title: HALL_NAME, text: `Come build your bookcase next to mine in ${HALL_NAME}!`, url: link }).catch(() => {}));
}

function openAuth(which = "join") {
  const w = openModal(`<h2 id="aTitle"></h2><p class="lead" id="aLead"></p>
    <div class="seg" style="margin-bottom:6px"><button data-w="join">Make my bookcase</button><button data-w="signin">Sign in</button></div>
    <form id="aForm">
      <div data-only="join"><label class="label" for="aName">Your name (written on your shelf)</label><input id="aName" class="field" placeholder="e.g. Mirko" maxlength="30"></div>
      <div data-only="join"><label class="label" for="aUser">A short username (for your shelf’s link)</label><input id="aUser" class="field" placeholder="e.g. mirko" maxlength="24" pattern="[a-zA-Z0-9_\\-]{2,24}" autocapitalize="off"></div>
      <label class="label" for="aEmail">Email</label><input id="aEmail" class="field" type="email" required autocomplete="email">
      <label class="label" for="aPass">Password</label><input id="aPass" class="field" type="password" required minlength="6" autocomplete="current-password">
      <p class="hint" id="aMsg" role="alert"></p>
      <div class="row end"><button class="btn gold" type="submit" id="aGo"></button></div>
    </form>`, { wax: ICON.user });
  const paint = () => {
    $$(".seg button", w).forEach(b => b.setAttribute("aria-pressed", b.dataset.w === which));
    $$("[data-only]", w).forEach(el => (el.hidden = el.dataset.only !== which));
    $("#aName", w).required = $("#aUser", w).required = which === "join";
    $("#aTitle", w).textContent = which === "join" ? "Claim your alcove" : "Welcome back";
    $("#aLead", w).textContent = which === "join" ? `Your bookcase will stand in ${HALL_NAME} next to your friends’.` : "Your candle’s still lit.";
    $("#aGo", w).textContent = which === "join" ? "Build my bookcase" : "Sign in";
  };
  paint();
  $("#aName", w).addEventListener("input", e => { const u = $("#aUser", w); if (!u.dataset.touched) u.value = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, "").slice(0, 24); });
  $("#aUser", w).addEventListener("input", e => (e.target.dataset.touched = "1"));
  $$(".seg button", w).forEach(b => b.addEventListener("click", () => { which = b.dataset.w; paint(); }));
  $("#aForm", w).addEventListener("submit", async e => {
    e.preventDefault(); const msg = $("#aMsg", w); msg.textContent = ""; const go = $("#aGo", w); go.disabled = true;
    try {
      const email = $("#aEmail", w).value.trim(), password = $("#aPass", w).value;
      if (which === "join") {
        const username = $("#aUser", w).value.trim().toLowerCase();
        if (state.profiles.some(p => p.username === username)) throw new Error("That username is taken. Try another.");
        const res = await db.signUp({ email, password, username, display_name: $("#aName", w).value.trim() });
        if (!res.session) { msg.textContent = "Almost there! Check your email for a confirmation link, then come back and sign in."; go.disabled = false; return; }
      } else await db.signIn({ email, password });
      state.me = await db.currentProfile(); await refresh();
      if (state.me && state.me.username === STARTER_SHELF_FOR.toLowerCase() && !state.items.some(i => i.owner === state.me.id)) { await seedShelf(); enrichPending(); }
      closeModal(); location.hash = shelfHref(state.me.username); route(true);
      toast(`Welcome, ${nameOf(state.me)} ✦`);
    } catch (err) { msg.textContent = err.message || "Something went wrong."; go.disabled = false; }
  });
}

function openAccount() {
  const w = openModal(`<h2>${esc(nameOf(state.me))}</h2><p class="lead">@${esc(state.me.username)}</p>
    <label class="label" for="nName">Name on your shelf</label><input id="nName" class="field" value="${esc(state.me.display_name || "")}" maxlength="30">
    <div class="row" style="margin-top:16px;justify-content:space-between">
      <button class="btn danger small" id="outBtn">Sign out</button>
      <div class="row">${db.hasLocalItems() ? `<button class="btn small" id="impBtn">Bring shelf from this browser</button>` : ""}<button class="btn gold small" id="saveName">Save</button></div>
    </div>`, { wax: ICON.user });
  $("#saveName", w).addEventListener("click", async () => { state.me = await db.updateProfile({ display_name: $("#nName", w).value.trim() }); await refresh(); closeModal(); route(true); toast("Nameplate polished ✦"); });
  $("#outBtn", w).addEventListener("click", async () => { await db.signOut(); state.me = null; closeModal(); location.hash = "#/"; route(); });
  const imp = $("#impBtn", w);
  if (imp) imp.addEventListener("click", async () => {
    imp.disabled = true; imp.textContent = "Carrying books…";
    const local = db.localExport();
    for (const it of local.items) {
      const added = await db.addItem(it);
      const r = local.ratings.find(x => x.item_id === it.id);
      if (r) await db.setRating(added.id, r.stars, r.note || "");
    }
    await refresh(); closeModal(); route(true); toast(`Brought over ${local.items.length} stories ✦`);
  });
}

function openThemes() {
  const cur = currentThemeId();
  const w = openModal(`<h2>Change the room</h2><p class="lead">Pick a look for the Hall and every shelf in it. Only this browser changes.</p>
    <div class="theme-grid">${Object.entries(THEMES).map(([id, t]) => `<button class="theme-card" data-theme-id="${id}" aria-pressed="${id === cur}">
      <span class="sw">${t.swatch.map(c => `<i style="background:${c}"></i>`).join("")}</span><b>${esc(t.name)}</b><span>${esc(t.blurb)}</span></button>`).join("")}</div>`, { wide: true, wax: ICON.brush });
  $$(".theme-card", w).forEach(b => b.addEventListener("click", () => {
    applyTheme(b.dataset.themeId);
    $$(".theme-card", w).forEach(x => x.setAttribute("aria-pressed", x === b));
    route(true);
    toast(`Welcome to the ${THEMES[b.dataset.themeId].name} ✦`);
  }));
}

function openNameModal() {
  const me = state.me;
  const w = openModal(`<h2>Who keeps this shelf?</h2><p class="lead">Your name goes on the brass plate of your bookcase.</p>
    <form id="nForm"><input id="nName" class="field" value="${esc(me.display_name || "")}" placeholder="Your name" maxlength="30" required>
    <div class="row end" style="margin-top:14px"><button class="btn gold" type="submit">${ICON.sparkle} Engrave it</button></div></form>`, { wax: ICON.quill });
  $("#nForm", w).addEventListener("submit", async e => { e.preventDefault(); state.me = await db.updateProfile({ display_name: $("#nName", w).value.trim() }); await refresh(); closeModal(); route(true); toast("Nameplate engraved ✦"); });
}

/* ═══════════════ dust motes & fireflies ═══════════════ */
function startMotes() {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const c = $("#motes"); const x = c.getContext("2d"); let W, H, dpr;
  const resize = () => { dpr = Math.min(2, devicePixelRatio || 1); W = c.width = innerWidth * dpr; H = c.height = innerHeight * dpr; };
  resize(); addEventListener("resize", resize);
  let kind = null, motes = [], rgb = "255,220,150";
  const spawn = m => {
    const k = m.kind;
    Object.assign(m, { x: Math.random(), y: k === "ember" ? 1 + Math.random() * .2 : Math.random(), r: Math.random() * 1.6 + .4, p: Math.random() * 6.28,
      vx: (Math.random() - .5) * (k === "firefly" ? .00006 : .00012),
      vy: k === "twinkle" ? 0 : k === "ember" ? -Math.random() * .00012 - .00006 : k === "firefly" ? (Math.random() - .5) * .00005 : -Math.random() * .00018 - .00003 });
    return m;
  };
  const rebuild = () => {
    const t = theme().motes; kind = t.kind; rgb = t.rgb;
    const N = Math.round((innerWidth < 700 ? .55 : 1) * t.n);
    motes = Array.from({ length: N }, () => spawn({ kind }));
  };
  let last = performance.now();
  const tick = t => {
    if (theme().motes.kind !== kind) rebuild();
    const dt = Math.min(50, t - last); last = t;
    x.clearRect(0, 0, W, H);
    for (const m of motes) {
      m.x += m.vx * dt + (kind === "twinkle" ? 0 : Math.sin((t / 3000) + m.p) * .00005 * dt); m.y += m.vy * dt; m.p += (kind === "twinkle" ? .0016 : .0008) * dt;
      if (m.y < -.02) { if (kind === "ember") spawn(m); else { m.y = 1.02; m.x = Math.random(); } }
      if (m.y > 1.25) m.y = -.02;
      if (m.x < -.02) m.x = 1.02; if (m.x > 1.02) m.x = -.02;
      let a, R = m.r;
      if (kind === "firefly") { a = .1 + .9 * Math.max(0, Math.sin(m.p * 1.6)) ** 3; R = m.r * 2.2; }
      else if (kind === "twinkle") { a = .15 + .6 * (0.5 + 0.5 * Math.sin(m.p * 2.2)) ** 4; R = m.r * .8; }
      else if (kind === "ember") { a = Math.max(0, .25 + .55 * Math.sin(m.p)) * Math.min(1, m.y * 1.4); R = m.r * 1.1; }
      else a = .14 + .12 * Math.sin(m.p);
      R *= dpr;
      const g = x.createRadialGradient(m.x * W, m.y * H, 0, m.x * W, m.y * H, R * 4);
      g.addColorStop(0, `rgba(${rgb},${a})`); g.addColorStop(1, `rgba(${rgb},0)`);
      x.fillStyle = g; x.beginPath(); x.arc(m.x * W, m.y * H, R * 4, 0, 6.283); x.fill();
    }
    if (!document.hidden) requestAnimationFrame(tick); else setTimeout(() => requestAnimationFrame(tick), 500);
  };
  requestAnimationFrame(tick);
}

boot();
