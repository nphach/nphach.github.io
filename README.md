# personal website

Tamagotchi-inspired portfolio built with React, Vite, and Motion. Deployed to GitHub Pages on push to `main`.

## Future ideas

### Log / blog tab

A third LCD tab could show writing or activity — either a lightweight **log** (short updates) or a full **blog** (long-form markdown posts).

#### UI flow

1. **Index** — scrollable list of entries, newest first (date, title, excerpt)
2. **Detail** — full post content inside the same LCD scroll area, with a way to return to the list

#### Log vs blog

| | **Log** | **Blog** |
|---|---|---|
| Length | 2–5 sentences | 500–2000+ words |
| Format | entries in `content.ts` (like projects) | markdown files in `content/posts/` |
| Purpose | "Shipped X", "Started Y" | tutorials, deep dives, devlogs |
| Maintenance | very low | needs regular writing |

Start with a log if the goal is recent activity; upgrade to markdown posts when longer writing is worth it.

#### Posting workflow (blog-as-code)

This site is static — no server or CMS. Posts are files in the repo:

1. Create a markdown file, e.g. `content/posts/2026-03-launching-kotoba-tag.md`
2. Add frontmatter (`title`, `date`, `excerpt`, `tags`) and body content
3. Commit and push to `main`
4. GitHub Actions builds and deploys to GitHub Pages (~1–2 min)

Example frontmatter:

```markdown
---
title: "Launching Kotoba Tag"
date: "2026-03-15"
excerpt: "Shiritori mechanics, vocab scoring, and shipping v1."
tags: ["japanese", "games", "typescript"]
---

First paragraph of the post...
```

At build time, Vite would parse all posts, sort by date, and bundle them into the app.

#### Routing options

| Approach | URL | Sharing | Notes |
|---|---|---|---|
| In-app state only | no URL change | can't link to a post | simplest |
| Hash routes (`/#/log/my-post`) | works on GitHub Pages today | shareable | no 404 changes needed |
| Real paths (`/log/my-post`) | needs SPA fallback | best SEO/sharing | update `404.html` to redirect to `index.html` |

Current `404.html` is a standalone page, not an SPA fallback — real paths would need that fix.

#### Implementation checklist

Minimal log:

- [ ] Add `log` tab next to `about` / `work`
- [ ] Add `LOG_ENTRIES` to `content.ts`
- [ ] List view + in-app detail state

Full blog:

- [ ] Markdown + frontmatter parsing (Vite plugin or build script)
- [ ] Post detail view with styled prose
- [ ] Optional routing + 404 SPA fallback for shareable URLs
- [ ] Optional RSS feed (`/feed.xml` at build time)

#### Other posting options

- **GitHub web editor** — edit `.md` files directly on github.com
- **External blog** (Dev.to, Hashnode) — link entries from the log tab; zero build work but off-site
- **Headless CMS** (Sanity, Contentful) — only worth it for frequent posting with a web UI

### Other page ideas

- **now** — current focus, availability, recent wins (could live at top of `about` or as its own tab)
- **background** — compact work + education timeline
- **stats** — Tamagotchi-style meters (frontend craft, language tools, 日本語)
- **playground** — small interactive demos on the LCD (shiritori widget, flashcard, pixel toy)

Contact links intentionally live in the bottom nav, not a separate tab. Skills live in `about`.
