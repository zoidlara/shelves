// Finding books, films and shows online. All sources are free and need no account.
import { TMDB_API_KEY } from "./config.js";

const strip = (html = "") => {
  const d = document.createElement("div"); d.innerHTML = html; return (d.textContent || "").replace(/\s+/g, " ").trim();
};
const norm = s => (s || "").toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
const https = u => (u || "").replace(/^http:/, "https:");

async function getJSON(url, ms = 9000) {
  const ctl = new AbortController(); const t = setTimeout(() => ctl.abort(), ms);
  try {
    const r = await fetch(url, { signal: ctl.signal });
    if (!r.ok) throw new Error(r.status);
    return await r.json();
  } finally { clearTimeout(t); }
}

let jsonpN = 0;
function jsonp(url, ms = 9000) {
  return new Promise((resolve, reject) => {
    const cb = `__shelvesJsonp${++jsonpN}`;
    const s = document.createElement("script");
    const done = () => { delete window[cb]; s.remove(); clearTimeout(t); };
    const t = setTimeout(() => { done(); reject(new Error("timeout")); }, ms);
    window[cb] = data => { done(); resolve(data); };
    s.onerror = () => { done(); reject(new Error("jsonp failed")); };
    s.src = url + (url.includes("?") ? "&" : "?") + "callback=" + cb;
    document.head.appendChild(s);
  });
}

const tidyGenres = list => {
  const out = [];
  for (const g of list || []) {
    for (const part of String(g).split(/\s*[\/&,]\s*/)) {
      const p = part.trim().replace(/\bfiction\b/i, "").replace(/\s+/g, " ").trim();
      if (!p || p.length > 22 || /general|juvenile|accessible|large type|nyt|reading level|in library|protected|overdrive/i.test(p)) continue;
      const nice = p.replace(/\b\w/g, c => c.toUpperCase());
      if (!out.some(o => o.toLowerCase() === nice.toLowerCase())) out.push(nice);
    }
  }
  return out.slice(0, 5);
};

/* ───────────── Books ───────────── */
async function googleBooks(q) {
  const d = await getJSON(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(q)}&maxResults=10&printType=books`);
  return (d.items || []).map(v => {
    const i = v.volumeInfo || {};
    let cover = i.imageLinks && (i.imageLinks.extraLarge || i.imageLinks.large || i.imageLinks.medium || i.imageLinks.thumbnail);
    cover = cover ? https(cover).replace("&edge=curl", "").replace(/zoom=\d/, "zoom=1") : "";
    const isbn = (i.industryIdentifiers || []).find(x => x.type === "ISBN_13") || (i.industryIdentifiers || [])[0];
    return {
      kind: "book", title: i.title + (i.subtitle && i.subtitle.length < 40 ? `: ${i.subtitle}` : ""),
      creator: (i.authors || []).join(", "), year: (i.publishedDate || "").slice(0, 4),
      description: strip(i.description || ""), cover, genres: tidyGenres(i.categories),
      extra: { pages: i.pageCount || null, isbn: isbn ? isbn.identifier : null }, from: "Google Books",
    };
  });
}

async function openLibrary(q) {
  const d = await getJSON(`https://openlibrary.org/search.json?q=${encodeURIComponent(q)}&limit=10&fields=key,title,author_name,first_publish_year,cover_i,subject,number_of_pages_median`);
  return (d.docs || []).map(b => ({
    kind: "book", title: b.title, creator: (b.author_name || []).slice(0, 2).join(", "), year: b.first_publish_year ? String(b.first_publish_year) : "",
    description: "", cover: b.cover_i ? `https://covers.openlibrary.org/b/id/${b.cover_i}-L.jpg` : "",
    genres: tidyGenres((b.subject || []).slice(0, 12)), extra: { pages: b.number_of_pages_median || null, olKey: b.key }, from: "Open Library",
  }));
}

async function olDescription(key) {
  try {
    const w = await getJSON(`https://openlibrary.org${key}.json`, 6000);
    const d = typeof w.description === "string" ? w.description : (w.description && w.description.value) || "";
    return d.replace(/\(\[source\].*$/s, "").replace(/-{3,}.*$/s, "").trim();
  } catch { return ""; }
}

async function appleBooks(q) {
  const d = await jsonp(`https://itunes.apple.com/search?term=${encodeURIComponent(q)}&media=ebook&entity=ebook&limit=10`);
  return (d.results || []).map(b => ({
    kind: "book", title: b.trackName, creator: (b.artistName || "").replace(/\s*&\s*/g, ", "), year: (b.releaseDate || "").slice(0, 4),
    description: strip(b.description || ""), cover: (b.artworkUrl100 || "").replace(/\/\d+x\d+bb\./, "/600x900bb."),
    genres: tidyGenres((b.genres || []).filter(g => !/^books$/i.test(g))), extra: { pages: null, isbn: null }, from: "Apple Books",
  }));
}

export async function searchBooks(q) {
  // Three free sources at once; whichever answers fills in the others' gaps.
  const [a, g, o] = await Promise.allSettled([appleBooks(q), googleBooks(q), openLibrary(q)]);
  const ok = r => (r.status === "fulfilled" ? r.value : []);
  const ab = ok(a), gb = ok(g), ol = ok(o);
  const same = (x, b) => norm(x.title) === norm(b.title) || norm(b.title).startsWith(norm(x.title)) || norm(x.title).startsWith(norm(b.title));
  const out = [];
  for (const b of [...ab, ...gb]) {
    const twin = out.find(x => same(x, b) && norm(x.creator).split(" ")[0] === norm(b.creator).split(" ")[0]);
    if (twin) { // already have it from another source: only fill what is missing
      if (!twin.description) twin.description = b.description;
      if (!twin.cover) twin.cover = b.cover;
      if (!twin.genres.length) twin.genres = b.genres;
      if (!twin.extra.pages) twin.extra.pages = b.extra.pages;
      if (!twin.extra.isbn) twin.extra.isbn = b.extra.isbn;
      continue;
    }
    out.push(b);
  }
  // Open Library: earliest year, bigger cover when we have none, subjects as genres.
  for (const b of out) {
    const twin = ol.find(x => same(x, b));
    if (!twin) continue;
    if (twin.cover && !b.cover) b.cover = twin.cover;
    if (!b.genres.length) b.genres = twin.genres;
    if (twin.year && (!b.year || twin.year < b.year)) b.year = twin.year;
    if (!b.extra.pages) b.extra.pages = twin.extra.pages;
    if (!b.description) b.extra.olKey = twin.extra.olKey;
    twin._used = true;
  }
  for (const b of ol) if (!b._used) out.push(b);
  // de-duplicate same title+author
  const seen = new Set();
  const uniq = out.filter(b => { const k = norm(b.title) + "|" + norm(b.creator).split(" ")[0]; if (seen.has(k)) return false; seen.add(k); return true; });
  // fill missing descriptions from Open Library for the top results
  await Promise.all(uniq.slice(0, 4).map(async b => {
    if (!b.description && b.extra.olKey) b.description = await olDescription(b.extra.olKey);
  }));
  return uniq.slice(0, 8);
}

/* ───────────── Films ───────────── */
async function tmdbFilms(q) {
  const d = await getJSON(`https://api.themoviedb.org/3/search/movie?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(q)}`);
  return (d.results || []).slice(0, 8).map(m => ({
    kind: "film", title: m.title, creator: "", year: (m.release_date || "").slice(0, 4), description: m.overview || "",
    cover: m.poster_path ? `https://image.tmdb.org/t/p/w500${m.poster_path}` : "", genres: [], extra: { tmdb: m.id }, from: "TMDB",
  }));
}

async function itunes(q, media, entity) {
  const d = await jsonp(`https://itunes.apple.com/search?term=${encodeURIComponent(q)}&media=${media}&entity=${entity}&limit=10`);
  return d.results || [];
}

async function itunesFilms(q) {
  return (await itunes(q, "movie", "movie")).map(m => ({
    kind: "film", title: m.trackName, creator: m.artistName || "", year: (m.releaseDate || "").slice(0, 4),
    description: m.longDescription || m.shortDescription || "",
    cover: (m.artworkUrl100 || "").replace(/\/\d+x\d+bb\./, "/600x900bb."),
    genres: tidyGenres([m.primaryGenreName]), extra: { minutes: m.trackTimeMillis ? Math.round(m.trackTimeMillis / 60000) : null }, from: "iTunes",
  }));
}

async function wikiFilms(q) {
  const s = await getJSON(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(q + " film")}&srlimit=5&format=json&origin=*`);
  const hits = (s.query && s.query.search) || [];
  const out = await Promise.all(hits.map(async h => {
    try {
      const p = await getJSON(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(h.title.replace(/ /g, "_"))}`);
      if (!/film|movie/i.test(p.description || "")) return null;
      return {
        kind: "film", title: p.title.replace(/\s*\((\d{4} )?film\)$/i, ""), creator: "", year: ((p.description || "").match(/\b(19|20)\d{2}\b/) || [""])[0],
        description: p.extract || "", cover: p.originalimage ? p.originalimage.source : (p.thumbnail ? p.thumbnail.source : ""),
        genres: [], extra: {}, from: "Wikipedia",
      };
    } catch { return null; }
  }));
  return out.filter(Boolean);
}

export async function searchFilms(q) {
  const sources = [itunesFilms(q), wikiFilms(q)];
  if (TMDB_API_KEY) sources.unshift(tmdbFilms(q));
  const res = await Promise.allSettled(sources);
  const lists = res.map(r => (r.status === "fulfilled" ? r.value : []));
  const out = [];
  for (const list of lists) {
    for (const f of list) {
      const twin = out.find(x => norm(x.title) === norm(f.title) && (!x.year || !f.year || x.year === f.year));
      if (twin) {
        if (!twin.description && f.description) twin.description = f.description;
        if (!twin.creator && f.creator) twin.creator = f.creator;
        if (!twin.cover && f.cover) twin.cover = f.cover;
        if (!twin.genres.length) twin.genres = f.genres;
      } else out.push(f);
    }
  }
  return out.slice(0, 8);
}

/* ───────────── TV shows ───────────── */
export async function searchShows(q) {
  const d = await getJSON(`https://api.tvmaze.com/search/shows?q=${encodeURIComponent(q)}`);
  return (d || []).slice(0, 8).map(({ show: s }) => ({
    kind: "show", title: s.name, creator: (s.network && s.network.name) || (s.webChannel && s.webChannel.name) || "",
    year: (s.premiered || "").slice(0, 4), description: strip(s.summary || ""),
    cover: s.image ? https(s.image.original || s.image.medium) : "", genres: tidyGenres(s.genres),
    extra: { tvmaze: s.id, ended: s.ended || null }, from: "TVmaze",
  }));
}

/* ───────────── Songs (preview, for later) ───────────── */
export async function searchSongs(q) {
  return (await itunes(q, "music", "song")).slice(0, 8).map(m => ({
    kind: "song", title: m.trackName, creator: m.artistName || "", year: (m.releaseDate || "").slice(0, 4),
    description: m.collectionName ? `From the album “${m.collectionName}”.` : "",
    cover: (m.artworkUrl100 || "").replace(/\/\d+x\d+bb\./, "/600x600bb."), genres: tidyGenres([m.primaryGenreName]),
    extra: { preview: m.previewUrl || null }, from: "iTunes",
  }));
}

export function search(kind, q) {
  return { book: searchBooks, film: searchFilms, show: searchShows, song: searchSongs }[kind](q);
}

// Best single match, used to fill in covers for the starter shelf.
export async function bestMatch(item) {
  try {
    const q = item.kind === "book" ? `${item.title} ${item.creator || ""}` : item.title;
    const list = await search(item.kind, q);
    const t = norm(item.title);
    return list.find(x => norm(x.title) === t && x.cover) || list.find(x => norm(x.title).startsWith(t) && x.cover) || list.find(x => x.cover) || null;
  } catch { return null; }
}

/* ───────────── "Find me something about…" (keyword search) ───────────── */
export async function suggestBooks(themes) {
  const d = await getJSON(`https://openlibrary.org/search.json?q=${encodeURIComponent(themes)}&limit=24&fields=key,title,author_name,first_publish_year,cover_i,subject,ratings_average,ratings_count`);
  return (d.docs || [])
    .filter(b => b.cover_i)
    .sort((a, b) => (b.ratings_count || 0) - (a.ratings_count || 0))
    .slice(0, 12)
    .map(b => ({
      kind: "book", title: b.title, creator: (b.author_name || []).slice(0, 2).join(", "), year: b.first_publish_year ? String(b.first_publish_year) : "",
      description: "", cover: `https://covers.openlibrary.org/b/id/${b.cover_i}-L.jpg`, genres: tidyGenres((b.subject || []).slice(0, 12)),
      extra: { olKey: b.key, rating: b.ratings_average || null }, from: "Open Library",
    }));
}
export { olDescription };

export function ficLinks(themes) {
  const q = encodeURIComponent(themes);
  const tag = encodeURIComponent(themes.split(/[,;]/)[0].trim());
  return [
    { site: "AO3", source: "ao3", label: "Archive of Our Own", url: `https://archiveofourown.org/works/search?work_search%5Bquery%5D=${q}&work_search%5Bsort_column%5D=kudos_count`, hint: "Sorted by most kudos" },
    { site: "Wattpad", source: "wattpad", label: "Wattpad", url: `https://www.wattpad.com/search/${q}`, hint: "Stories & serials" },
    { site: "Tumblr", source: "tumblr", label: "Tumblr", url: `https://www.tumblr.com/tagged/${tag}`, hint: "Fics, recs & moodboards" },
    { site: "Goodreads", source: "goodreads", label: "Goodreads", url: `https://www.goodreads.com/search?q=${q}`, hint: "Reviews & lists" },
  ];
}
