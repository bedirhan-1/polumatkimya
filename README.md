# Polumat Kimya Website

Three-locale corporate site (Turkish, English, Arabic) built with Next.js App Router and Sanity Studio embedded at `/admin`.

## Repository layout

```text
/
├── app/
│   ├── (site)/[locale]/   # Public site (tr/en/ar)
│   └── (studio)/admin/    # Embedded Sanity Studio → /admin
├── studio/                # Schema source (+ optional standalone CLI)
├── sanity/                # Frontend Sanity client helpers
├── migration/             # Extract → transform → import pipeline
├── dictionaries/          # Server-only UI copy (tr/en/ar)
├── lib/                   # i18n, redirects, shared helpers
└── docs/
```

Schemas live in `studio/schemaTypes`. The authoring UI is mounted inside Next.js at **`/admin`**.

## Local development

```bash
cp .env.example .env.local
npm install
npm run dev
```

- Site: http://localhost:3000 → redirects to `/tr`
- **Studio: http://localhost:3000/admin**

## Scripts

| Script | Purpose |
|---|---|
| `npm run dev` | Next.js (site + `/admin`) |
| `npm run build` | Production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | TypeScript |
| `npm run schema:extract` | Extract Sanity schema JSON |
| `npm run typegen` | Generate `sanity.types.ts` |
| `npm run migrate:extract` | Snapshot live site content |
| `npm run migrate:transform` | Build Sanity-shaped JSON |
| `npm run migrate:validate` | Count + redirect checks |
| `npm run migrate:import` | Dry-run import (add `-- --write` to mutate) |

See [migration/README.md](migration/README.md) for the full cutover checklist.

## Localization

- Public URLs always include a locale prefix (`/tr`, `/en`, `/ar`).
- `/admin` is excluded from locale redirects.
- Arabic uses `dir="rtl"`.
