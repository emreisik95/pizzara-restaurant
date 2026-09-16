# Pizzara redesign verification

The local preview uses the existing local SQLite menu: eight seeded dishes. No production data, settings, or reservations were changed.

## Build

Run `UPLOAD_DIR="$PWD/public/uploads" npm run build` from the project root. The upload directory override is needed locally because the existing upload route otherwise defaults to `/data/uploads`.

The Next.js production build includes TypeScript checking. The existing parent-workspace lockfile warning is unrelated to this UI change.

## Browser checks

Chromium checks cover widths 360, 390, 768, and 1440 pixels, including:

- No document overflow; menu CTA visible in the first viewport.
- Loaded campaign image and unobstructed supporting copy.
- Category filtering, category URL persistence, and direct category links.
- Name/ingredient search, Turkish case handling, empty results, and reset.
- Dish detail focus trapping, Escape, and return focus.
- Reservation dialog focus trapping and success focus.
- Mobile navigation and Escape.
- Reduced motion and no uncaught page errors.
- Server-rendered headline and full menu without JavaScript.

Reservation success/error UI is verified using intercepted responses; tests do not create bookings or claim to verify production delivery. See `browser-results.json` for the completed run.

## Artwork

`public/images/pizzara-hero.png` is original campaign artwork generated using the requested GPT Image 2 skill with a temporary newer Codex CLI. The site serves the optimized WebP version. The artwork is not substituted for real menu-item photographs. Missing dish images are labeled clearly.

No production deployment was performed.
