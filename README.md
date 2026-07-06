# School of Life — Website

A single-page site for **School of Life** (Koh Phangan, Thailand), for people considering coming to stay. Plain HTML/CSS/JS — no build step, no framework, deploy anywhere.

## Run locally

```
npx serve .
```

Then open the printed localhost URL.

## Structure

```
index.html      all page content/sections
css/style.css   styling (earthy palette: forest green, sage, terracotta, sand)
js/main.js      nav toggle, scroll-reveal animation, contact form handler
images/         placeholder photography (Unsplash, free license)
```

## Content sourced from

- `SOL Business Plan (Draft Dec 2024).pdf` — vision, concept, team bios
- `SOL Investors (Short).pdf` — facility specs (10 Rai / 16,000 m², capacity 160), Wonderland track record

Note: this version is scoped for prospective residents — market sizing, revenue figures, and the investor/expansion pitch from the source documents were deliberately left out.

## Before this goes live, replace these placeholders

- **Photography** — all images in `/images` are stock placeholders (Unsplash), not real photos of the site, team, or Wonderland. Swap in real photography once available.
- **Contact email** — `hello@solkpg.com` is a guess based on the domain; confirm the real inbox.
- **Social links** — Instagram/Facebook/LinkedIn icons in the footer/contact section link nowhere (`href="#"`) — add real profile URLs.
- **Contact form** — currently only shows a "thanks" toast client-side and does not send anywhere. Wire it to an email service (e.g. Formspree, Netlify Forms) or your CRM.
- **Team headshots** — currently show initials in colored circles; swap for real photos.
- **Logo** — "SOL" text mark in the nav is a placeholder; drop in a real logo if one exists.

## Deploy

It's fully static — drag the folder into [Netlify Drop](https://app.netlify.com/drop), or connect the repo to Netlify/Vercel/GitHub Pages. No build command needed; publish directory is the project root.
