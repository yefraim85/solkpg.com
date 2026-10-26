# School of Life — Website

Static marketing site for School of Life (Koh Phangan, Thailand). Plain HTML/CSS/JS, no build step.

## Run locally

```
npx serve .
```

## Deploy

Auto-deploys to Vercel on push to `master`.

## Staff resources

The public useful-links page is at `/links/`. Edit the references in `links/index.html`; its compact layout is in `css/links.css`. SVG icons are from Lucide (license in `links/icons-LICENSE.txt`).

When changing `css/links.css` or `js/links.js`, update its `?v=` value in `links/index.html` to the first 12 characters of the file’s SHA-256 hash so browsers fetch the updated asset.
