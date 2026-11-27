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

## Launch offer (November 2026)

Basic, Standard and Premium keep their existing full-payment and installment prices.
During the launch window, each coaching package includes 3 months + 1 free month.
The EGP 100 standalone training plan does not participate.

- Starts: Friday 27 November 2026, 18:30 Africa/Cairo (16:30 UTC).
- Ends: Sunday 29 November 2026, 18:30 Africa/Cairo (16:30 UTC).
- Configuration: `launchOffer.startsAt` and `launchOffer.durationHours` in `site.config.json`.
- End is calculated once from the configured start plus 48 elapsed hours, never from a visitor's first visit.
- Before start: scheduled announcement only. While active: countdown, bonus, package duration text and booking-message offer. At expiry: ordinary three-month content returns automatically.
- The subscription still starts when the program is delivered. Three installments remain three installments.
- Footer credit: Developed by Mohamed abdullwahab.

`src/launchOffer.mjs` holds the pure schedule, eligibility and WhatsApp message logic.
`src/LaunchOffer.jsx` provides the clock, banner, bonus label and FAQ. The clock resyncs on focus and visibility changes; there is no per-visitor storage.
This static promotional site uses the visitor device clock, not an authoritative payment server; Ahmed confirms eligibility and payment on WhatsApp.
Social metadata stays evergreen so cached social cards do not promise an expired bonus.

Run `npm test` for schedule boundaries, eligibility, WhatsApp messages and rendered home/package pages in both languages before, during and after the offer.
After upload, confirm the deployment succeeds and check the live mobile layout and links. Local tests do not confirm a production deployment.
