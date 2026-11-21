# AboEsmail Coaching

Arabic/English promotional website built with React, Vite, React Router and Three.js.

## Local development

Use Node.js 22 or newer.

```sh
npm ci
npm run dev
```

Open the displayed URL under `/AboEsmail-Coaching/`.

```sh
npm run build
npm run preview
```

## Deployment

Target: https://aboesmail20.github.io/AboEsmail-Coaching/

Upload source to the repository root, including `.github/workflows/deploy.yml`.
Set repository Settings → Pages → Source to GitHub Actions.
The workflow reads the actual Pages URL before building, so repository or domain changes are reflected in the next deployment.

`site.config.json` contains the single fallback URL for local builds. `SITE_URL` overrides it for other hosting targets.
Vite derives its base path from that URL and injects absolute social metadata. React Router and asset paths use the same Vite base.
The post-build script creates package entry files with individual metadata, plus `404.html` and `.nojekyll`.

## Source

- `src/main.jsx`: bilingual content, navigation and WhatsApp booking.
- `src/style.css`: styling and responsive layouts.
- `src/Dumbbell.jsx`: interactive Three.js hero with SVG/CSS fallback.
- `public/assets`: coach photo, logo and social sharing image.
- `scripts/site-url.mjs`: shared deployment URL.

See `START_HERE_AR.md` for Arabic upload and operating instructions.
