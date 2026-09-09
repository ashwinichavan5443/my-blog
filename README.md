# Personal site

Static blog built with Astro 7. Two pages: writing index (`/`) and about (`/about`).
Posts are markdown files. No database, no CMS, no build config to maintain.

---

## For whoever handles hosting

```bash
npm install
npm run dev      # local at http://localhost:4321
npm run build    # static output into dist/
```

**Deploy on Vercel or Netlify.** Both auto-detect Astro from `package.json`, so
there is nothing to configure:

- Framework preset: Astro
- Build command: `npm run build`
- Output directory: `dist`
- Node version: 20 or newer

Steps: push this repo to GitHub, connect the repo in the Vercel/Netlify dashboard,
deploy. Then add the custom domain in the dashboard and point DNS at the values it
gives you. HTTPS is issued automatically on both.

One thing to change after DNS resolves: set `site` in `astro.config.mjs` to the real
domain. It only affects canonical URLs, so it's safe to do later.

Every push to `main` redeploys.

---

## Before going live — fill these in

Search the repo for `TODO` and `YOUR-` to find all of them.

- [ ] `src/layouts/Base.astro` — GitHub username in the footer link
- [ ] `src/pages/about.astro` — email address, GitHub and LinkedIn URLs, job title
- [ ] `astro.config.mjs` — real domain in `site`
- [ ] Delete `src/pages/posts/hello.md` once two real posts exist

---

## Writing a post

Create `src/posts/my-post-slug.md`. The filename becomes the URL.

```markdown
---
title: "Structured extraction: 62% valid to 98% without training"
date: 2026-09-20
summary: One line stating the finding, not teasing it.
result: "62% → 98% valid"
repo: https://github.com/YOUR-USERNAME/project-repo
draft: false
---

Body in markdown.
```

**Fields**

| Field | Required | Notes |
| --- | --- | --- |
| `title` | yes | Shown on the index and as the page `h1` |
| `date` | yes | Sorts the index, newest first |
| `summary` | yes | The one line under the title on the index |
| `result` | no | Prints in the margin in oxblood — **measured figures only** |
| `video` | no | Absolute URL to a self-hosted MP4. Renders under the title |
| `poster` | no | URL to a poster frame for `video`. Without it the player is a black box |
| `youtube` | no | Video ID only, not a full URL. Used when `video` is absent |
| `videoCaption` | no | Caption under the recording. Say what it shows |
| `repo` | no | Adds a "Repository" link in the margin |
| `draft` | no | `true` excludes it from the build entirely — no page, no URL |

### The demo recording

Set `video` (or `youtube`) and the layout renders the recording directly under the
title, before the body, and adds a "Demo" link to the margin. This is the place for
the one clip that shows the thing working.

```yaml
video: https://media.YOURDOMAIN.com/clips/schema-retry.mp4
poster: https://media.YOURDOMAIN.com/clips/schema-retry.jpg
videoCaption: >
  Validation rejects the fourth document on a dangling dependency id, the error is
  fed back, and the retry lands. 1280x720, no audio.
```

Prefer a self-hosted MP4 over `youtube` for short clips — it loops silently with no
third-party player chrome and no cookie banner. Use `youtube` for narrated
walkthroughs past a few minutes.

Additional clips inside the body still use raw HTML; see `hello.md` for the snippet.

`result` exists for one purpose: a number you measured yourself. Leave it out when
there isn't one. An empty margin beats a decorative one, and the credibility of the
whole site depends on that field never containing something you didn't measure.

`hello.md` is a template with the section order to reuse in every project writeup.
It is marked `draft: true`, so it is not built at all.

---

## Design notes

Deliberate choices, in case you're tempted to change them later:

- **Left margin column** carries metadata, ruled off with a hairline. Structure
  borrowed from a lab notebook — the margin holds the measurements.
- **Newsreader** for everything readable, **IBM Plex Mono** only for code and real
  figures. Mono is never used for decorative labels.
- **Oxblood `#8a2e27`** is reserved for measured results. Nothing else.
- Tables use tabular figures and right-align after the first column so digits line
  up down the page.
- No cards, no shadows, no gradients, no entrance animations.

Tokens live at the top of `src/styles/global.css`.

---

## Structure

```
src/
├── layouts/
│   ├── Base.astro     masthead, fonts, meta tags, footer
│   └── Post.astro     post page + margin metadata
├── pages/
│   ├── index.astro          thesis + writing index
│   ├── about.astro
│   ├── admin/index.astro    loads the CMS editor
│   └── posts/[...slug].astro  builds a page per non-draft post
├── posts/                   one markdown file per post — write here
└── styles/
    └── global.css           all styling, tokens at the top
```

---

## Video

**Never commit video files to this repo.** Git handles binaries badly, and both
Vercel and Netlify meter bandwidth, so serving video from the site host is the one
way to turn a free tier into a bill.

### Where the files go

| Clip type | Host | Why |
| --- | --- | --- |
| Under ~60s, silent demo | Cloudflare R2 | Free tier is 10 GB storage and zero egress, recurring monthly |
| Narrated walkthrough | YouTube (unlisted or public) | Free transcoding and adaptive bitrate; also gets found in search |
| Terminal session | asciinema | Text, not video — kilobytes, and selectable |

R2 setup once: create a bucket, connect a custom subdomain such as
`media.yourdomain.com`, enable public access, upload with the dashboard or `rclone`.
Since egress is free and a compressed 30-second clip is a few megabytes, the free
tier holds hundreds of clips.

### Compress before uploading

Raw screen recordings are enormous. This produces sharp text at a fraction of the
size:

```bash
ffmpeg -i raw.mov \
  -vf "scale=1280:-2" \
  -c:v libx264 -crf 26 -preset slow \
  -pix_fmt yuv420p -movflags +faststart \
  -an \
  clip.mp4
```

- `-an` strips audio. Use it for anything without narration.
- `-crf` is quality: lower is better and larger. Try 23 if code looks soft, 28 if
  the file is too big.
- `-movflags +faststart` lets playback begin before the whole file downloads.
- Generate a poster frame so the page isn't a black box before play:
  `ffmpeg -i clip.mp4 -ss 00:00:01 -vframes 1 clip.jpg`

**Never use GIF for a screen recording.** An MP4 of the same clip is roughly ten
times smaller and looks better.

### Recording settings

- 1280×720 is enough. Higher resolution makes big files without making code
  more readable.
- Increase your editor and terminal font size before recording. Text that is
  comfortable on your monitor is unreadable on a phone.
- Keep clips short and single-purpose. One clip per thing being shown.
- Capture the failures, not just the working run.

### Embed patterns

See `src/pages/posts/hello.md` for the three HTML snippets to copy — self-hosted
MP4 with a caption, YouTube iframe, and asciinema cast. Markdown accepts raw HTML,
so there is no plugin to install.

Always write in prose what a recording shows. Video is invisible to anyone skimming
and to search engines.

---

## Writing through the CMS

There is an admin panel at `/admin` — Sveltia CMS, a git-based editor that runs
entirely in your browser and commits markdown to this repo on your behalf. No
server, no database, no terminal, and it works on a phone.

It is a real Astro route (`src/pages/admin/index.astro`), so `/admin` resolves both
on `npm run dev` and in production. Its config stays at `public/admin/config.yml`
and the page points at it explicitly.

**Setup, once:**

1. In `public/admin/config.yml`, set `repo` to your GitHub `owner/repo`.
2. Sign in at `https://yourdomain.com/admin` with GitHub. Sveltia authenticates
   client-side; if the sign-in flow needs anything extra for your host, the current
   instructions are at <https://github.com/sveltia/sveltia-cms>.
3. Pin the version in `public/admin/index.html` once it works, so an upstream
   release cannot break your editor unannounced.

**What it gives you:** every frontmatter field as a labelled form input with a hint,
a markdown editor with live preview, drag-and-drop image upload, and a draft
toggle. Save creates a commit; the site redeploys on its own.

Local git still works exactly as before. The CMS is a second door to the same files,
not a replacement — use whichever suits the moment.

### Where video goes

**Do not upload video through the CMS.** The editor commits its uploads into the
repo, and video in git is a problem that gets worse every month.

Video lives on R2. The workflow:

1. Compress with the ffmpeg recipe above.
2. Upload the MP4 to your R2 bucket, via the Cloudflare dashboard or
   `rclone copy clip.mp4 r2:your-bucket/clips/`.
3. Paste the resulting URL into the **Demo recording** field.

Poster frames are small, so those can go through the CMS image upload.

### Why not a spreadsheet in S3

Worth recording the reasoning, since the idea comes up again:

- A long technical post with code blocks and markdown tables is painful to write
  inside spreadsheet cells, and there is no preview.
- S3 cannot trigger a rebuild by itself. You would need a Lambda plus a deploy
  webhook, or fetch and parse the file in the browser — which gives up static
  generation and search indexing.
- No drafts, no diffs, no per-post history.
- S3 charges egress at roughly $0.09/GB. R2 charges nothing, which is the whole
  reason video sits on R2.

The CMS above solves the actual problem — publishing without a terminal — without
adding infrastructure to maintain.


---

## Drafts and what is public

The repo is public, so treat everything committed as published-in-principle.

**A draft is not built.** `draft: true` excludes the post from the build, so there
is no page and no URL — requesting it returns 404. It is not merely hidden from the
index. The markdown itself is still visible in the public repo, so a draft is
private from site visitors, not private in general.

**`/admin` is publicly reachable.** Anyone can load it and see a GitHub sign-in
screen. Sveltia authorises against write access to this repo, so only you can read
or change content through it. The page carries `noindex` so it stays out of search
results. Renaming the route would only reduce noise; the GitHub check is the actual
gate.

**Never commit** API keys (use `.env`, already gitignored) or anything from work —
client documents, internal code, real employee data. If a key does get committed,
rotate it rather than deleting the line, because git history keeps the old version.
