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
- **Publish case studies** — add to `caseStudies`; the homepage section and `/case-studies` switch from the empty state to a list.

## Deployment

Hosted on Netlify, which builds from the `main` branch on every push.

The contact form uses **Netlify Forms**. The form Netlify indexes lives in
`public/__forms.html`; the real form is `src/components/ContactForm.tsx` and posts
to that path. Submissions appear under **Site configuration → Forms**, and email
notifications are configured there.

The form posts as multipart, so the optional attachment (8MB ceiling, Netlify's
limit) is stored with the submission. Field names must match between the two
files. Posting only works on a deployed
Netlify site, so submitting from `localhost` shows the form's error state.

## Before launch

See the checklist at the end of [DESIGN.md](DESIGN.md): real scheduling link and
the production domain in the metadata.
