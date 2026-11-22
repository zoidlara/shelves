# ✦ Moonwood ✦

A moonlit forest hall of 3D bookshelves. Every reader gets their own bookcase with their name on a brass plate: books you've read and want to read, films, TV shows and songs.

- **Type a title** and the Hall finds the author, year, genres, description and cover (Google Books, Open Library, iTunes, TVmaze, Wikipedia; all free, no keys).
- **No cover online?** It binds a handmade hardcover with gold foil, corner studs and a little emblem that fits the story (a dragon, a wand, a crown…).
- **Fics too**: add AO3, Wattpad and Tumblr stories by hand with a link; they get a coloured ribbon on their cover.
- **Click any spine** to pull the book off the shelf: description, genres, your stars and a note, and everyone else's ratings.
- **Pull from the shelf**: type “dragons” or “magic school” and matching books glow and slide forward.
- **Share card**: a pretty picture of any book or film to send to friends, plus a direct link.
- **Find me something…**: give a few themes and get book suggestions, ready-made AO3/Wattpad/Tumblr/Goodreads searches, and matches from your friends' shelves.
- **Friends**: send your invite link; each friend builds a named bookcase in the same Hall and can rate the books on yours (and you on theirs).

Everything is free. There is no AI service and nothing to pay for.

---

## Opening it

### Step 1 · Put it online (GitHub Pages, free)

1. On GitHub, open this repository → **Settings** → **Pages**.
2. Under **Build and deployment**, pick **Deploy from a branch**, branch **main**, folder **/ (root)**, then **Save**.
3. After a minute the page shows your address, something like `https://YOUR-NAME.github.io/shelves/`. That's your Hall.

At this point it works for **you alone**: your shelf is saved in your browser.

### Step 2 · Open the Hall to friends (Supabase, free)

This gives everyone accounts and puts all bookcases in one shared room.

1. Go to [supabase.com](https://supabase.com), sign up (free), and click **New project**. Any name and password is fine; pick a region near you.
2. When it's ready, open **SQL Editor** (left sidebar) → **New query**, paste everything from [`supabase/schema.sql`](supabase/schema.sql), and press **Run**. You should see “Success”.
3. Open **Authentication** → **Sign In / Providers** → **Email**, and switch **Confirm email** off. (This lets friends start right away without hunting for a confirmation email. You can leave it on if you prefer.)
4. Open **Authentication** → **URL Configuration** and set **Site URL** to your Hall's address from step 1.
5. Open **Project Settings** → **API** (or the **Connect** button) and copy two things: the **Project URL** and the **anon public** key.
6. In this repository, open [`js/config.js`](js/config.js), click the pencil to edit, paste them between the quotes:
   ```js
   export const SUPABASE_URL = "https://abcdefgh.supabase.co";
   export const SUPABASE_ANON_KEY = "eyJhbGciOi...";
   ```
   and **Commit changes**. (The anon key is meant to be public; the database rules only let people change their own shelf.)
7. Reload your Hall, press **Make my bookcase** and sign up. If your username is `mirko`, your starter books and films appear on your shelf automatically. Already added things in browser-only mode? Open the account button (top right) → **Bring shelf from this browser**.
8. Press **Invite a friend**, copy the link and send it. Each friend who opens it can build their own bookcase next to yours.

### Optional

- **Sharper film posters**: get a free key at [themoviedb.org](https://www.themoviedb.org/settings/api) and paste it as `TMDB_API_KEY` in `js/config.js`.
- **Rename the room**: set `HALL_NAME` in `js/config.js` (leave it empty to use the look's own name).
- **Change the look**: the brush button switches between rooms; `DEFAULT_THEME` in `js/config.js` sets the one new visitors see (Moonwood).

---

## For tinkerers

Plain HTML, CSS and JavaScript modules. No build step.

```
index.html          the page
css/style.css       all the candlelight, wood and parchment
js/app.js           the Hall, shelves, dialogs, search
js/db.js            saving (browser-only or Supabase)
js/lookup.js        finding books, films, shows and songs online
js/covers.js        handmade covers, spine colours, share cards
js/art.js           icons, ivy, fairy lights, shelf decorations
js/seeds.js         the starter shelf
supabase/schema.sql database tables and safety rules
```

Run locally with any static server, for example `npx serve .`, then open the address it prints.
