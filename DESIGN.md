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

### The ink family
Five inks of equal depth, one per practice, used as blocks rather than sprinkled accents.

Marks are pitched light for the dark ground and swap to the deep originals
inside `.on-paper`; the block colours are the same in both.

| Ink | Token | Dark mark | `.on-paper` mark | Block | Practice · stage |
|---|---|---|---|---|---|
| Blue | `--c-blue` | `#8AA4F2` | `#1F3A8A` | `#1B3480` | AI Enablement · Assess |
| Teal | `--c-teal` | `#5FBFAD` | `#17564E` | `#14544B` | Software & Implementation · Implement |
| Brass | `--c-brass` | `#D4A24F` | `#7A4E0F` | `#6E4711` | Technology Audits · Enable |
| Oxblood | `--c-oxblood` | `#E08E96` | `#6E1F2A` | `#6A1F29` | Governance & Compliance |
| Plum | `--c-plum` | `#B990DC` | `#4B2A63` | `#46275E` | Technology Strategy · Prioritize |

How colour is applied:
- `--mark` sets the colour of every punch-hole mark in a section; `--service` colours a service row's chip, hover tint and arrow; `--tint` drives a pale `.band-tint` field (9% ink over paper).
- **Blocks**: the pinned Approach section is half dark, half a solid stage colour that changes as you scroll; the closing section is an ink-blue block above the near-black footer; the About band is a porcelain `.on-paper` block (warm brass tint) that gives the dark page one bright moment; service pages tint their "When to call us" band with the practice's ink.
- The header watches for `[data-header-theme="light"]` sections and swaps to dark text, a porcelain bar, and the dark logo while one is under it.
- Values live in `globals.css`; the JS-side copies (for animating the Approach block) are in `src/lib/css.ts`. Keep the two in step.

Type: **Host Grotesk** throughout — display, statements, and UI (large, tracking -0.03 to -0.045em). One typeface only; the site previously paired a serif for the Ada statements and no longer does. To reintroduce one for long-form Insights, add the family in `layout.tsx` and a `--font-serif` token.

The brand's smallest unit is `.hole`, a rounded punch mark used for section titles, list bullets, button icons and progress.

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
- [ ] Real Calendly link and email in `site.ts`
- [ ] Optional: a founders section (names, roles, headshots) — removed for now; the About block carries the credentials in prose
- [ ] `CONTACT_WEBHOOK_URL` env var (Formspree, HubSpot, Zapier, Slack…) for the contact form
- [ ] Production domain in `layout.tsx`, `sitemap.ts`, `robots.ts`
- [ ] Brand assets regenerate from `Media for Lovelace/LovelaceIconFinal.png` with `npm run brand`
