# School of Life — Website

A static site for **School of Life** (Koh Phangan, Thailand) — a vision for a long-term, community-centered living experience, currently in development. Plain HTML/CSS/JS — no build step, no framework.

## Run locally

```
npx serve .
```

Then open the printed localhost URL.

## Structure

```
index.html       homepage (single-page: vision, experience, facility, team, schedule, contact)
retreats.html     current, bookable retreats — the real thing you can do today
schedule.html     thin redirect to index.html#schedule (kept for old links/bookmarks)
404.html          branded not-found page
css/style.css     styling (earthy palette: forest green, sage, terracotta, sand)
js/main.js        nav toggle, scroll-reveal, scroll-spy, smooth-scroll (desktop only)
js/schedule.js    live events calendar on index.html#schedule (public Google Calendar API)
js/notify-404.js  pings a private ntfy.sh topic whenever a visitor hits 404.html
bin/collect-404s.mjs   merges cached ntfy hits into a durable JSONL log (run by the Action)
bin/404-log.mjs        views the 404 log (live ntfy cache, or the durable JSONL)
.github/workflows/log-404s.yml   hourly cron that keeps the durable log in GitHub
images/           photography (team + logo are real assets; most others are stock, verified for fit)
images/team/      real founder headshots
images/logo/      real brand logo (logo-full.png used in nav, logo-square.png source for favicons)
favicon-16.png, favicon-32.png, apple-touch-icon.png   generated from images/logo/logo-square.png
robots.txt, sitemap.xml
```

## Content sourced from

- `SOL Business Plan (Draft Dec 2024).pdf` — vision, concept, team bios
- `SOL Investors (Short).pdf` — facility specs, founding team
- `emetway.com` — School of Life is Emet Way's first ashram-hotel project ("In Development")

Market sizing, revenue figures, and the investor/expansion pitch from the source documents are deliberately left out — this site is for prospective residents and retreat guests, not investors.

## 404 hit log

`404.html` pings a private [ntfy.sh](https://ntfy.sh) topic (`solkpg-404-472f6470f7`) on every visit via `js/notify-404.js`, which gives real-time push notifications. But the free public ntfy.sh server only caches messages for ~12 hours, so it is not a durable record.

### Durable log in GitHub (automatic)

`.github/workflows/log-404s.yml` is a scheduled GitHub Action that polls the ntfy topic hourly and appends any new hits (deduped by message id) to `logs/404-hits.jsonl`. That file is kept on a **dedicated `sol-404-log` branch**, deliberately *not* on `master`:

- `master` is what Vercel deploys, so a log there would be publicly downloadable at `solkpg.com/logs/…` and would redeploy the site on every write. The data branch is an orphan branch holding only the log — nothing to serve, nothing to build.
- The Action creates the branch on its first run; no manual setup needed.

**To activate it:** merge this to `master` (scheduled workflows only run from the default branch), then optionally trigger a first run from the repo's **Actions → Log 404 hits → Run workflow**. If the push step is denied, set **Settings → Actions → General → Workflow permissions** to *Read and write*.

To read the durable log locally:

```
git show sol-404-log:logs/404-hits.jsonl > 404-hits.jsonl
bin/404-log.mjs --file 404-hits.jsonl
```

### Live check (ad-hoc)

For a quick look at whatever ntfy still has cached, without the durable log:

```
bin/404-log.mjs            # everything ntfy still has cached (~12h)
bin/404-log.mjs 24h        # last 24 hours only (also: 30m, 2h, 7d)
bin/404-log.mjs --json     # raw ntfy message objects, one JSON per line
```

All scripts need Node 18+ (built-in `fetch`) and no dependencies.

## Deploy

Hosted on Vercel (`vercel --prod` from the project root; no build command, no framework). The GitHub repo is connected for auto-deploy on push to `master`. A `404.html` at the root is served automatically for any unmatched path.
