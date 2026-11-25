// Data layer. Two modes:
//   local  – everything saved in this browser (no setup needed)
//   cloud  – Supabase: accounts, everyone's bookcase in one shared Hall
import { SUPABASE_URL, SUPABASE_ANON_KEY } from "./config.js";

const LS_KEY = "shelves.v1";
const uid = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random().toString(16).slice(2));

export const mode = SUPABASE_URL && SUPABASE_ANON_KEY ? "cloud" : "local";
let sb = null;

/* ───────────── local mode ───────────── */
function load() {
  try { return JSON.parse(localStorage.getItem(LS_KEY)) || null; } catch { return null; }
}
function save(s) { localStorage.setItem(LS_KEY, JSON.stringify(s)); }
function localState() {
  let s = load();
  if (!s) {
    s = { profile: { id: "local", username: "me", display_name: "", created_at: new Date().toISOString() }, items: [], ratings: [], seeded: false };
    save(s);
  }
  return s;
}
export function hasLocalItems() {
  const s = load();
  return !!(s && s.items && s.items.length);
}
export function localExport() { return load(); }

/* ───────────── shared helpers ───────────── */
function attachRatings(items, ratings, profiles, comments = []) {
  const names = Object.fromEntries((profiles || []).map(p => [p.id, p.display_name || p.username]));
  return items.map(it => ({
    ...it,
    ratings: ratings.filter(r => r.item_id === it.id).map(r => ({ ...r, name: names[r.user_id] || r.name || "A friend" })),
    comments: comments.filter(c => c.item_id === it.id).map(c => ({ ...c, name: names[c.user_id] || "A friend" })),
  }));
}

// False until the comments table exists in the database (see supabase/schema.sql).
export let commentsReady = mode === "local";

/* ───────────── API ───────────── */
export async function init() {
  if (mode === "cloud") {
    const { createClient } = await import("https://esm.sh/@supabase/supabase-js@2");
    sb = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } else localState();
}

export async function currentProfile() {
  if (mode === "local") return localState().profile;
  const { data: { session } } = await sb.auth.getSession();
  if (!session) return null;
  let { data } = await sb.from("profiles").select("*").eq("id", session.user.id).maybeSingle();
  if (!data) {
    // profile row is created by a database trigger; create it here as a fallback
    const meta = session.user.user_metadata || {};
    const username = (meta.username || session.user.email.split("@")[0]).toLowerCase();
    const ins = await sb.from("profiles").insert({ id: session.user.id, username, display_name: meta.display_name || username }).select().single();
    data = ins.data;
  }
  return data;
}

export function onAuthChange(cb) {
  if (mode === "cloud") sb.auth.onAuthStateChange((_e, session) => cb(session));
}

export async function signUp({ email, password, username, display_name }) {
  const { data, error } = await sb.auth.signUp({ email, password, options: { data: { username: username.toLowerCase(), display_name } } });
  if (error) throw error;
  return data;
}
export async function signIn({ email, password }) {
  const { error } = await sb.auth.signInWithPassword({ email, password });
  if (error) throw error;
}
export async function signOut() { if (sb) await sb.auth.signOut(); }

export async function updateProfile(patch) {
  if (mode === "local") {
    const s = localState(); Object.assign(s.profile, patch); save(s); return s.profile;
  }
  const me = await currentProfile();
  const { data, error } = await sb.from("profiles").update(patch).eq("id", me.id).select().single();
  if (error) throw error;
  return data;
}

export async function listProfiles() {
  if (mode === "local") return [localState().profile];
  const { data, error } = await sb.from("profiles").select("*").order("created_at");
  if (error) throw error;
  return data;
}

// Everyone's items with ratings (the Hall is small: just you and your friends)
export async function listAll() {
  if (mode === "local") {
    const s = localState();
    return attachRatings(s.items, s.ratings, [s.profile], s.comments || []);
  }
  const [{ data: items, error: e1 }, { data: ratings, error: e2 }, profiles, cm] = await Promise.all([
    sb.from("items").select("*").order("created_at"),
    sb.from("ratings").select("*"),
    listProfiles(),
    sb.from("comments").select("*").order("created_at"),
  ]);
  if (e1 || e2) throw e1 || e2;
  commentsReady = !cm.error; // a missing comments table must not break the shelves
  return attachRatings(items, ratings, profiles, cm.error ? [] : cm.data);
}

export async function addItem(item) {
  const me = await currentProfile();
  const row = {
    owner: me.id, kind: item.kind, status: item.status, title: item.title, creator: item.creator || "",
    year: item.year || "", description: item.description || "", cover: item.cover || "",
    genres: item.genres || [], link: item.link || "", source: item.source || "", extra: item.extra || {},
  };
  if (mode === "local") {
    const s = localState();
    const full = { ...row, id: uid(), created_at: new Date().toISOString() };
    s.items.push(full); save(s); return full;
  }
  const { data, error } = await sb.from("items").insert(row).select().single();
  if (error) throw error;
  return data;
}

export async function addItems(items) {
  const out = [];
  for (const it of items) out.push(await addItem(it));
  return out;
}

export async function updateItem(id, patch) {
  if (mode === "local") {
    const s = localState(); const it = s.items.find(i => i.id === id);
    if (it) Object.assign(it, patch); save(s); return it;
  }
  const { data, error } = await sb.from("items").update(patch).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteItem(id) {
  if (mode === "local") {
    const s = localState(); s.items = s.items.filter(i => i.id !== id); s.ratings = s.ratings.filter(r => r.item_id !== id); save(s); return;
  }
  const { error } = await sb.from("items").delete().eq("id", id);
  if (error) throw error;
}

export async function setRating(item_id, stars, note = "") {
  const me = await currentProfile();
  if (mode === "local") {
    const s = localState();
    s.ratings = s.ratings.filter(r => !(r.item_id === item_id && r.user_id === me.id));
    if (stars) s.ratings.push({ item_id, user_id: me.id, stars, note, created_at: new Date().toISOString() });
    save(s); return;
  }
  if (!stars) {
    await sb.from("ratings").delete().eq("item_id", item_id).eq("user_id", me.id);
    return;
  }
  const { error } = await sb.from("ratings").upsert({ item_id, user_id: me.id, stars, note }, { onConflict: "item_id,user_id" });
  if (error) throw error;
}

export async function addComment(item_id, body) {
  const me = await currentProfile();
  if (mode === "local") {
    const s = localState(); s.comments = s.comments || [];
    const c = { id: uid(), item_id, user_id: me.id, body, created_at: new Date().toISOString() };
    s.comments.push(c); save(s); return c;
  }
  const { data, error } = await sb.from("comments").insert({ item_id, user_id: me.id, body }).select().single();
  if (error) throw error;
  return data;
}

export async function deleteComment(id) {
  if (mode === "local") { const s = localState(); s.comments = (s.comments || []).filter(c => c.id !== id); save(s); return; }
  const { error } = await sb.from("comments").delete().eq("id", id);
  if (error) throw error;
}

export function markSeeded() { if (mode === "local") { const s = localState(); s.seeded = true; save(s); } }
export function isSeeded() { return mode === "local" ? !!localState().seeded : false; }
