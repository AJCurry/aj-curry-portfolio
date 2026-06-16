# AJ Curry — Portfolio

A single-page portfolio for **AJ Curry**, Emmy Award-winning sports & entertainment marketing executive.

**Live site:** https://justinrestaino.com/aj-curry-portfolio/

## Stack

Zero build step — plain HTML/CSS/JS that runs straight from the filesystem.

- `index.html` — markup + all inline styles
- `app.js` — content data, scroll reveals, parallax, the Highlights accordion
- `lenis.min.js` — vendored [Lenis](https://github.com/darkroomengineering/lenis) momentum smooth-scroll
- `image-slot.js` — fillable image placeholder web component
- `images/` — photography
- `favicon.svg` — site icon

## Local preview

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy

Served by GitHub Pages from the `main` branch root. Push to `main` and the live
site updates automatically (`.nojekyll` keeps Pages from running Jekyll).
