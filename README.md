# AJ Curry — Portfolio

A single-page portfolio for **AJ Curry**, Emmy Award-winning sports & entertainment marketing executive.

**Live site:** https://justinrestaino.com/aj-curry-portfolio/

## Editing the content (Pages CMS)

All copy, photos, social links, footer, and the **order of the sections** are
edited through [Pages CMS](https://pagescms.org) — no code required.

1. Go to **https://app.pagescms.org** and sign in with GitHub.
2. Open the **`RestainoCreative/aj-curry-portfolio`** repo.
3. Edit under **Website** and click **Save**. The live site updates in ~1 minute.

Pages CMS reads [`.pages.yml`](.pages.yml) (the editing form definitions) and
writes everything to [`data/content.json`](data/content.json). The site renders
from that file, so a save is all it takes to update the live page.

## Stack

Zero build step — plain HTML/CSS/JS that runs straight from the filesystem.

- `index.html` — page shell + all inline styles
- `app.js` — fetches `data/content.json` and renders the page (nav, hero, sections, footer), plus scroll reveals, parallax, accordions, and the projects rail
- `data/content.json` — **all site content** (the CMS source of truth)
- `.pages.yml` — Pages CMS field/form configuration
- `lenis.min.js` — vendored [Lenis](https://github.com/darkroomengineering/lenis) momentum smooth-scroll
- `images/` — photography (CMS uploads land here)
- `favicon.svg` — site icon

## Local preview

```sh
python3 -m http.server 8000
# then open http://localhost:8000
```

## Deploy

Served by GitHub Pages from the `main` branch root. Any push to `main` — whether
from Pages CMS or a manual commit — redeploys automatically (`.nojekyll` keeps
Pages from running Jekyll).
