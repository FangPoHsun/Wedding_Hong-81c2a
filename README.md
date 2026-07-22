# 翔鴻 & 晏瑜 · Wedding Invitation

An electronic wedding invitation website for **蕭翔鴻 & 劉晏瑜**.

- **Date:** 2026.10.25 (Sunday) · reception 18:00–22:00 (arrive 17:30)
- **Venue:** 台北晶華酒店 (Regent Taipei), 3F — 台北市中山區中山北路二段39巷3號

## Structure

Plain static site — no build step:

- `index.html` — markup
- `style.css` — styling (modern Chinese luxe: vermillion · gold · rice-paper)
- `script.js` — cover gatefold, countdown, gallery (mosaic + swipe deck), lightbox, RSVP, music
- `images/` — web-optimized photos
- `Bgmusic/` — background music

RSVP submissions post to the couple's Google Form (which feeds a Google Sheet).

## Local preview

Open `index.html` in any modern browser.

## Hosting (GitHub Pages)

Repository **Settings → Pages → Source: `main` branch, `/ (root)`**.
The site will be served at `https://fangpohsun.github.io/Wedding_Hong/`.
