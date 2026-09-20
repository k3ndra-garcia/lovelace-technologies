# Lovelace Technologies

Marketing site for Lovelace Technologies — technology consulting for what comes next.

Built with Next.js (App Router), Motion for animation, and Lenis for smooth
scrolling. Design system and rationale are documented in [DESIGN.md](DESIGN.md).

## Running locally

```bash
npm install
npm run dev
```

Then open http://localhost:3000.

```bash
npm run build     # production build
npm run brand     # regenerate brand assets from the source logo
```

## Editing content

Copy and structure live in [`src/content/site.ts`](src/content/site.ts):

- **Add a service** — append to `services`; the page, nav entry and homepage panel follow.
- **Publish case studies** — add to `caseStudies`, then set `site.showWorkInNav = true`.
- **Publish articles** — add to `insights` and create `src/app/insights/[slug]/page.tsx`.

## Deployment

Hosted on Netlify, which builds from the `main` branch on every push.

Set `CONTACT_WEBHOOK_URL` as an environment variable to deliver contact form
submissions to Formspree, HubSpot, Zapier, Slack, or similar. Without it,
submissions are accepted and logged only.

## Before launch

See the checklist at the end of [DESIGN.md](DESIGN.md): real scheduling link and
inbox, contact form endpoint, and the production domain in the metadata.
