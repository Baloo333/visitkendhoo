# Visit Kendhoo

A community guide to **Kendhoo**, B. Kendhoo, Baa Atoll, Maldives — heritage, traditional medicine, manta rays at Hanifaru Bay, and local excursions. Built as a plain static site (HTML/CSS/JS, no build step) so it's simple to host on **GitHub Pages** with the domain **visitkendhoo.com** managed on **Cloudflare**.

```
/
├── index.html         Home
├── history.html       History & Heritage (Magaamfulhu, Thabreyzgefaanu, timeline)
├── culture.html        Culture & Traditions (Dhivehi Beys, festivals)
├── explore.html        Nature & Things To Do (Hanifaru Bay, excursions & pricing)
├── plan.html            Plan Your Visit (getting there, stay, etiquette, map)
├── credits.html         Photo & source credits
├── CNAME                Tells GitHub Pages to serve the site on visitkendhoo.com
├── .nojekyll             Tells GitHub Pages not to run Jekyll processing
└── assets/
    ├── css/style.css
    ├── js/main.js
    └── img/  (photos + favicon.svg)
```

All photos are real, freely-licensed Creative Commons images of Kendhoo and Baa Atoll sourced from Wikimedia Commons — see `credits.html` for full attribution. Swap in your own photography any time by replacing files in `assets/img/` (keep the same filenames, or update the `src=` paths in the HTML).

---

## Putting this on GitHub (no computer needed — works fine from an iPhone)

### 1. Create the repository
1. Go to **github.com** in Safari (or any browser) and sign in.
2. Tap **+ → New repository**.
3. Name it anything, e.g. `visit-kendhoo`. Keep it **Public**. Don't add a README/.gitignore/license — we already have our own files.
4. Tap **Create repository**.

### 2. Upload the files
The most reliable way to do this on a phone is to create the two text-based folders first (GitHub auto-creates folders when you type a path with `/` in it), then upload the images into the folder once it exists.

1. On the new repo's page, tap **Add file → Create new file**.
2. In the filename box, type: `assets/css/style.css` — GitHub will show it nesting inside new `assets` and `css` folders automatically.
3. Paste in the contents of `style.css`, then tap **Commit changes**.
4. Repeat for `assets/js/main.js` (paste in `main.js`'s contents).
5. Now go to the repo's file list, open the `assets` folder, then the `img` folder won't exist yet — create it the same way: **Add file → Create new file**, type `assets/img/.gitkeep`, leave it empty, **Commit changes**.
6. Open the `assets/img` folder you just created, then tap **Add file → Upload files**. Choose all the image files (the JPGs + `favicon.svg`) from the Files app — multi-select is supported — and commit. They'll land in the right folder automatically because you're uploading *from inside* it.
7. Go back to the repository's **root** (tap the repo name in the breadcrumb), tap **Add file → Upload files**, and upload: `index.html`, `history.html`, `culture.html`, `explore.html`, `plan.html`, `credits.html`, `CNAME`, `.nojekyll`, and `README.md`. Commit.

You can also try dragging the whole `site` folder straight into the **Upload files** drop zone — recent versions of mobile Safari support dropping a folder from the Files app and it will preserve the subfolders automatically. If that works for you, it's faster than the steps above.

### 3. Turn on GitHub Pages
1. In the repo, go to **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **Deploy from a branch**.
3. Branch: **main**, folder: **/ (root)**. Save.
4. Under **Custom domain**, type `visitkendhoo.com` and **Save**. GitHub will check DNS (next step) before it can issue HTTPS — that's expected to show a warning until Cloudflare is set up.

### 4. Point Cloudflare at GitHub Pages
In your Cloudflare dashboard, open **visitkendhoo.com → DNS → Records** and add:

| Type  | Name | Content              | Proxy status |
|-------|------|-----------------------|---------------|
| A     | @    | 185.199.108.153       | DNS only (grey cloud) |
| A     | @    | 185.199.109.153       | DNS only (grey cloud) |
| A     | @    | 185.199.110.153       | DNS only (grey cloud) |
| A     | @    | 185.199.111.153       | DNS only (grey cloud) |

Keep these set to **DNS only** (grey cloud, not orange) at first — this lets GitHub issue a free HTTPS certificate without Cloudflare's proxy getting in the way. You only need the four `A` records above for the apex domain `visitkendhoo.com`; you don't need a `www` record unless you also want `www.visitkendhoo.com` to work (if you do, add `CNAME www → <your-github-username>.github.io`, also DNS only).

### 5. Verify & enable HTTPS
1. Back in GitHub **Settings → Pages**, wait a few minutes, then refresh — you should see a green check next to the custom domain.
2. Tick **Enforce HTTPS** once it becomes available.
3. Visit `https://visitkendhoo.com` — it should now show the site.

Optional: once everything is working, you can switch the Cloudflare records to **Proxied** (orange cloud) to get Cloudflare's CDN and caching. If you do, set **SSL/TLS → Overview → encryption mode** to **Full** (not Flexible) in Cloudflare, or visitors may hit a redirect loop.

### Making edits later
No computer needed here either:
- Tap the pencil ✏️ icon on any file in GitHub's web view to edit it directly in Safari.
- For a fuller code-editor feel (multiple files, file tree, search), visit `https://github.dev/<your-username>/<repo-name>` — it's a full browser-based editor that works well on mobile.

---

## Notes
- This is an independent fan/community site, not an official government tourism page — `credits.html` says so, and it's good practice to keep that disclosure.
- Excursion pricing on the **Nature & Things To Do** page is supplied by Dhoani Maldives Guesthouse — update `explore.html` directly if prices change.
- All copy was written from scratch based on public research (Wikipedia, Visit Maldives, The Edition, and others) — see `credits.html` for the source list.
