# Lovelace Technologies — design system

## Direction
A boutique consulting firm that is technically fluent and grounded in business. Calm porcelain paper, graphite ink, one ink-blue accent. The single signature element is the **punched card**: the Analytical Engine read instructions from punched cards, and Ada Lovelace saw it could do more than calculate. Everything else stays quiet.

## Tokens (`src/app/globals.css`)
The site is dark by default. Light blocks opt in with `.on-paper`, which flips
the same token names for its subtree (and sets `color-scheme`), so components
never hard-code a light or dark value.

| Role | Token | Dark (default) | `.on-paper` |
|---|---|---|---|
| Ground | `--paper` | `#0F1113` | `#EEF0EF` |
| Raised surface | `--vellum` | `#171A1D` | `#E3E6E5` |
| Text | `--ink` | `#E9ECEB` | `#16191D` |
| Muted text | `--slate` | `#9AA1A6` | `#5B6268` |
| Accent (links, buttons, focus) | `--accent` | `#93A9F0` | `#1F3A8A` |
| Card stock | `--card` | `#1B1F23` | `#DEE2E8` |
| Hairlines | `--rule` / `--rule-strong` | `#262A2F` / `#3B4248` | `#C9CECD` / `#AAB1B1` |
| Deepest block | `--night` / `--on-night` | `#08090A` / `#E9ECEB` | — |
| Text on colour blocks | `--on-color` | `#ECEFF3` | `#ECEFF3` |

### Colour
One blue, one bone, near-black. Nothing else. (The site briefly carried five
practice colours; it was too busy, and the reference we follow — OCI by
Buzzworthy — gets its force from restraint.)

| Role | Token | Value |
|---|---|---|
| Brand mark / accent on dark | `--brand` | `#8AA4F2` |
| Brand block | `--brand-block` | `#1B308C` |
| Stage blocks (Approach) | `--stage-1…4` | `#101B52` → `#2139A9` |
| Bone (light blocks) | `.on-paper --paper` | `#E9E7E1` |
| Accent on bone | `.on-paper --accent` | `#1B308C` |
| Text on colour | `--on-color` | `#ECEFF3` |

How colour is applied:
- `--mark` colours every punch-hole mark; `--tint` drives a `.band-tint` field; `--block` sets a full-bleed `.on-block` section.
- **Blocks**: the Approach section steps through four depths of the one blue as you scroll; the comparison section is a solid brand-blue block; the closing section is brand blue above the near-black footer; About is a bone `.on-paper` block.
- The header watches for `[data-header-theme="light"]` sections and swaps to dark text, a bone bar, and the dark logo while one is under it.
- Values live in `globals.css`; the stage colours are mirrored in `src/lib/css.ts` for the animated block. Keep the two in step.

Type: **Host Grotesk** throughout — display, statements, and UI (large, tracking -0.03 to -0.045em). One typeface only; the site previously paired a serif for the Ada statements and no longer does. To reintroduce one for long-form Insights, add the family in `layout.tsx` and a `--font-serif` token.

The brand's smallest unit is `.hole`, a rounded punch mark used for section titles, list bullets, button icons and progress.

## Entry and structure
Patterns adapted from the OCI reference, in Lovelace's own terms:
- **Entry curtain** (`SiteLoader.tsx`): a brand-blue block where the mark punches itself in over ~0.9s, then lifts. Once per session (`sessionStorage`, with a pre-hydration script so repeat loads never flash), skipped under reduced motion.
- **Mono labels**: Geist Mono, uppercase and letterspaced, for eyebrows, captions, breadcrumbs, chips, numbers and buttons.
- **Column rules**: four fixed hairlines behind the page; sections with a background paint over them.
- **Menu-only header**: brand, the contact trigger, and one Menu button at every width, opening a full-screen overlay.

## Hero video
`public/media/hero.mp4` (2.8MB, 5s loop) sits full-bleed behind the hero under
`.hero__mask`: a left-to-right dark scrim, a brand-blue wash, and a fade into
the page ground at the bottom. Measured against the brightest frame pixel behind
each text block, contrast is 8.6:1 (headline), 5.3:1 (sub) and 5.1:1 (caption),
all past AA. Phones and reduced-motion visitors get `hero-poster.jpg` instead of
the video.

## Motion (`src/lib/motion.ts`, `src/components/motion/`)
Timing was studied from the Armory reference: fast, critically damped springs, ease-out arrivals, ~0.08s stagger.
- **LineReveal**: headline lines rise from a mask (page load and on scroll).
- **ScrollInk**: long statements ink in word by word as they scroll through view.
- **Reveal**: one-time fade and lift for supporting content.
- **PunchCard**: canvas card; holes punch row by row, accent follows the pointer. The source grid is 100 × 100, stored as per-cell coverage (hex 0–f) so partly covered cells punch smaller and edges taper instead of stair-stepping. `npm run brand <n>` regenerates at another density; the component merges holes automatically on small cards so they never drop below ~2.2px.
- **Approach**: section pins while four stages advance (desktop); stacked list on mobile and with reduced motion.
- **Through**: comparison tracks draw with scroll.
- **SmoothScroll**: Lenis; disabled when the visitor prefers reduced motion.
- Header hides on scroll down, returns on scroll up, and flips to light text over dark sections (`data-header-theme="dark"`).

## Service graphics
The homepage services section is a 3 × 2 panel grid: an intro panel plus one panel
per practice, each on a 14px dotted field with hairline dividers.

Each panel carries an isometric line drawing built from `src/lib/iso.ts` (a 30°
projection with `box`, `cage`, `slot`, `quad` and `route` helpers) and assembled in
`src/components/ServiceGraphic.tsx`. The drawings share one vocabulary — card stock,
slots, plates, cabinets — and the only solid fill in any of them is the punched slot,
in that practice's ink:

| Practice | Drawing |
|---|---|
| AI Enablement | a deck of cards, the top one lifting clear with its slots cut |
| Software & Implementation | a configured system on its plate, next card feeding in |
| Technology Audits | the record cabinet, one drawer drawn open |
| Governance & Compliance | solid work inside a wireframe of rules |
| Technology Strategy | the route set out on a plan sheet, destination punched |

The moving part of each drawing carries `iso__float` and lifts on panel hover or
focus (disabled under reduced motion). Drawings are clipped to their box, so adding
a new one only needs a `shift` that keeps it roughly centred. The `/services` page
keeps the typographic row list; the panels are the homepage treatment.

## Information architecture
`/` · `/services` · `/services/[slug]` (5) · `/approach` · `/about` · `/insights` · `/contact` · `/work` (built, hidden from nav)

All copy and structure lives in `src/content/site.ts`:
- Add a service: append to `services`.
- Publish case studies: add to `caseStudies`, then set `site.showWorkInNav = true`.
- Publish articles: add to `insights` and create `src/app/insights/[slug]/page.tsx`.

## Before launch
- [ ] Real Calendly link in `site.ts` (email is set)
- [ ] Optional: a founders section (names, roles, headshots) — removed for now; the About block carries the credentials in prose
- [x] Contact form delivery — Netlify Forms; add the email notification in Netlify
- [ ] Production domain in `layout.tsx`, `sitemap.ts`, `robots.ts`
- [ ] Brand assets regenerate from `Media for Lovelace/LovelaceIconFinal.png` with `npm run brand`
