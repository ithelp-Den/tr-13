# Zubalenok Lifetime — build conventions

Figma: file `XufOAGVXBActU3hGjeXEhi`, root node `5418:10747` ("lifetime 04.11 чорна п'ятниця").
Desktop artboard **1440**, mobile artboard **428**. Figma session id for MCP calls: `4a4a32cd-c1b6-42ba-ba2b-35d7c2ca4924`.

## Layout of the repo
```
src/index.template.html     page shell (head, fonts, swiper CDN) — <!-- @sections --> is replaced by partials
src/partials/NN-name.html   one <section> per file, in page order
src/css/00-base.css         tokens + the `u` unit system (DO NOT EDIT — owned by the integrator)
src/css/NN-name.css         styles for one section (same NN-name as its partial)
src/js/00-main.js           shared: scroll-reveal + payment-link binding (DO NOT EDIT)
src/js/NN-name.js           optional JS for one section
images/NN-name/*.webp       assets of that section only
build.mjs                   `node build.mjs` -> index.html, css/style.css, js/app.js, preview/NN-name.html
tools/shot.sh, tools/diff.py  headless screenshot + diff vs Figma
```

## The `u` unit (fluid pixel-perfect)
Write every size in the CSS as `Nu` = N px of the artboard. `1u` = `100vw/428` below 800px, `100vw/1440` from 800px,
and exactly `1px` from 1441px (page is centred, 1440 wide). `build.mjs` compiles `24u` -> `calc(24 * var(--u))`.
Use `u` for: font-size, line-height (or unitless), letter-spacing, width/height, padding, margin, gap, border-radius, offsets, blur/shadow sizes.
Use real px only for hairlines (1px borders) if the design has them at 1px. Percentages / unitless / vw are fine where natural.
Never use `px` for layout sizes, never use media queries other than the two below.

**Mobile-first**: base rules = mobile artboard (428). Desktop overrides inside `@media (min-width: 800px) { ... }`.
Markup that exists only on one device: class `only-m` / `only-d` (display helpers in base). Different image per device: `<picture><source media="(min-width:800px)" srcset="…-d.webp"><img src="…-m.webp" alt="…" width= height=></picture>`.

## Rules
* **All text is real HTML text** (headings, prices, labels, button captions, FAQ…). Do NOT bake text into images.
  Exception: the screenshots of chat messages in the reviews slider and any "UI screenshot" that is itself a photo/screenshot.
* Prices/numbers/CTAs are real elements; every CTA/price tag is an `<a>` (or `<button>` inside) with `data-pay="v1"` and `href` = the checkout URL (also bound in js/00-main.js via `ZBL.payUrl`). Give them hover + active + focus-visible states and a smooth transition.
* Fonts available via the template: `var(--font-display)` League Gothic, `var(--font-body)` Source Sans 3, `var(--font-num)` Onest. "Helvetica Neue" -> `var(--font-helv)`. If the design uses another font, use the closest fallback and say so in your report.
* Tokens: `--red:#e93519`, `--red-deep:#a92007`, bg `#000`. Take exact colours/gradients/shadows/radii from Figma (get_design_context), not from eyeballing.
* Figma's `text-box-trim` (cap/alphabetic) means the text box has no extra leading: reproduce positions by matching the *visual* placement (you may use `text-box: trim-both cap alphabetic` — Chrome supports it — but still set explicit line-height).
* Scope CSS under the section class `.s-<name>` (e.g. `.s-hero`); BEM-ish children `.s-hero__title`. No global selectors, no `!important` unless unavoidable.
* Section root: `<section class="s-<name>" id="<name>" data-section="NN-name">`.
* Animations (required, tasteful, GPU-only: opacity/transform): scroll reveal via `data-reveal` (+`data-delay`) from base; hover lifts/glows on buttons & cards; slider/accordion/video interactions as the design implies. Respect `prefers-reduced-motion`.
* Sliders: Swiper 11 is loaded globally (`Swiper` global). Init it in your `src/js/NN-name.js` inside DOMContentLoaded.
* Images: take originals via get_design_context asset URLs (curl -L into `images/NN-name/_raw/`), or `download_assets` (defaultScale 2 or 3) for flattened/masked composites. Then convert to **WebP** with `cwebp -q 88 in.png -o out.webp` (use `-lossless` for flat graphics/UI, `-q 90` for photos); SVG icons stay `.svg`. Delete `_raw` when done. Every asset must be a non-empty local file in the exact slot of the design. No figma.com URLs may remain in code. Export at **2x** the displayed size (or 3x for small icons) so it is crisp on Retina; never upscale a smaller source.
  Masked photo compositions (hero, collages): export the *image-only* group at 2x as one WebP, keep all text native on top. A slider slide that is just a screenshot may be one flat image.
* Add `width`/`height` (artboard px) + `alt` to `<img>`; `loading="lazy"` for everything below the first screen, `decoding="async"`.
* Accessibility: real headings (`h1` only in hero, `h2` for section titles), `aria-label`s on icon-only buttons, focus-visible rings, `aria-expanded` on accordions.

## Verification loop (mandatory before you report)
1. `node build.mjs` then screenshot your section's preview page at the exact artboard widths:
   `tools/shot.sh preview/NN-name.html 1440 <H> <scratch>/d.png` and `... 428 <H> <scratch>/m.png` (H = section height in the Figma frame; for pages taller than the window set H accordingly).
2. Get the Figma reference (`get_screenshot` of the section node at maxDimension >= 2000 -> curl the png) and run `python3 -I tools/diff.py figma.png mine.png out.png`; open `out.png` with Read and fix visible mismatches (positions, sizes, font weights, colours, spacing, radii, shadows, image crops). Iterate until visually indistinguishable. Also check an in-between width (e.g. 1100 and 600) for sane fluid scaling, and 1700 for the cap.
3. Verify every image file is non-empty, correctly placed, not stretched.

## Payment link (to be bound later)
Every CTA / price tag is `<a data-pay="v1" href="https://mmoschool.online/shop/item/13702">`. Set the checkout URL once in `src/js/00-main.js` (`ZBL.payUrl`) and run
`node build.mjs` — all `[data-pay]` elements get the `href`. While it is empty, clicks are ignored (no jump to `#`).

## Editing / QA
* Edit only `src/**`, then `node build.mjs` (outputs `index.html`, `css/style.css`, `js/app.js`, `preview/*.html`).
* Add `?static` to the page URL to disable animations/reveals and load all images eagerly (used for screenshots/diffs).
* Open via a local server (`python3 -m http.server`) rather than `file://` to see real JS error messages.

## Videos (`media/`)
`.js-video[data-video-src]` blocks swap the poster for a `<video controls>` on click. Wired sources:
* `media/testimonial-1.mp4` — from «сука 57» (`media/video-1.mp4`), poster 1 in `07-video-reviews`
* `media/testimonial-2.mp4` — from `library/zubalenok-shop/media/video-1.mp4`, poster 2
* `media/watch.mp4` — from `library/3-in-1/media/v-2.mp4` (3 s loop, 1920×1080), `09-watch-video`
* poster 3 ("nati.getsfit") — remote: `https://itden-cdn.b-cdn.net/vd/zubalenok_Feedback_3447622511559357698_709513859.mp4`
  (14 s, 720×1280, CORS `*`). To self-host, put the file into `media/` and change `data-video-src` on the third `.s-videos__poster` in `src/partials/07-video-reviews.html`.
