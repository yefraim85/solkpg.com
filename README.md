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
bin/404-log.mjs   pulls that ntfy topic's cached 404 hits into a readable log
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

`404.html` pings a private [ntfy.sh](https://ntfy.sh) topic (`solkpg-404-472f6470f7`) on every visit via `js/notify-404.js`. To pull those hits into a readable log on demand:

```
bin/404-log.mjs            # everything ntfy still has cached
bin/404-log.mjs 24h        # last 24 hours only (also: 30m, 2h, 7d)
bin/404-log.mjs --json     # raw message objects, one JSON per line
```

Needs Node 18+ (built-in `fetch`), no dependencies. The free public ntfy.sh server only caches messages for about 12 hours, so this is a rolling recent log rather than a full archive — to keep long-term history, pipe it somewhere (`bin/404-log.mjs >> 404-hits.log`) or run it on a schedule (e.g. an hourly cron).

## Deploy

Hosted on Vercel (`vercel --prod` from the project root; no build command, no framework). The GitHub repo is connected for auto-deploy on push to `master`. A `404.html` at the root is served automatically for any unmatched path.
