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
js/notify-404.js  on a 404: pings ntfy (instant alert) + fires a Vercel Analytics "404" event
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

## 404 tracking

When a visitor hits a broken link, `404.html` loads and `js/notify-404.js` records it two ways:

- **Instant alert** — a ping to a private [ntfy.sh](https://ntfy.sh) topic (`solkpg-404-472f6470f7`); subscribe in the ntfy app to get a push the moment a dead link is followed. ntfy only caches ~12h, so it is the *alert*, not the record.
- **Durable record** — a Vercel **Web Analytics** `404` custom event carrying the bad `path` and `referrer`. Web Analytics is enabled on the project; the analytics script is loaded site-wide from `/_vercel/insights/script.js`, and the event is queued via the `window.va` shim so it fires even before the script finishes loading.

To see the broken links, open the project's **Analytics → Events** in Vercel and filter to `eventName = 404`, or group by `eventData/path` and `referrerHostname` to rank which links break and where visitors come from. (The same data is queryable through Vercel's Web Analytics API/MCP, so it can be pulled and summarized on demand.)

## Deploy

Hosted on Vercel (`vercel --prod` from the project root; no build command, no framework). The GitHub repo is connected for auto-deploy on push to `master`. A `404.html` at the root is served automatically for any unmatched path.
