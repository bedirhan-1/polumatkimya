# Content migration

Repeatable extract → transform → dry-run → import pipeline for the live Polumat site into Sanity.

## Scope

| Source | Count | Sanity type |
|---|---:|---|
| Products | 19 | `product` (field-level i18n) |
| Categories | 2 | `productCategory` |
| Blog posts | 4 TR + 8 EN/AR stubs | `post` (document-level i18n) |
| Corporate pages | 8 TR + 16 EN/AR stubs | `page` |
| Contact shell | 1 | `siteSettings` patch |

Rules (from project plan):

- No deterministic `_id` on normal documents — idempotency uses `legacyId` / slug+language lookup
- Store `legacyId`, `legacyUrls`, `previousSlugs`
- Missing EN/AR document translations stay `translationStatus: "draft"` (excluded from production queries)
- Production writes require an explicit `--write` flag after dry-run review

## Prerequisites

```bash
# .env.local
NEXT_PUBLIC_SANITY_PROJECT_ID=...
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_WRITE_TOKEN=...   # Editor token with write access — only needed for --write
```

## Commands

Important: with npm, extra flags must come after `--` or npm swallows them.

```bash
npm run migrate:extract
npm run migrate:transform
npm run migrate:validate

# Dry-run (default) — does NOT write
npm run migrate:import

# Real write (needs SANITY_API_WRITE_TOKEN in .env.local)
npm run migrate:import -- --write

# Real write + download/upload first product image each
npm run migrate:import -- --write --with-assets
```

Wrong (npm ignores `--write`, stays dry-run):

```bash
npm run migrate:import --write
```

## Layout

```text
migration/
├── extracted/live-snapshot.json   # committed snapshot for offline transforms
├── transformed/                   # generated (gitignored)
├── reports/                       # dry-run / validate output (gitignored)
├── scripts/
│   ├── extract.ts
│   ├── transform.ts
│   ├── import.ts
│   ├── validate.ts
│   └── lib.ts
└── README.md
```

## Content QA checklist

- [ ] 19 products visible under `/tr/products` after import
- [ ] Category filters: industrial-sprays / construction-chemicals
- [ ] Legacy `/urunler/detay/{old}` → `/tr/products/{en}`
- [ ] Legacy `/blog/{old}` → `/tr/blog/{en}`
- [ ] EN/AR blog & page stubs exist in Studio as draft, not on public routes
- [ ] Product EN titles are placeholders — confirm official English catalog names
- [ ] SDS/TDS PDF assets still need manual upload (not on public HTML extract)
- [ ] Application video external URLs still need editor input

## Known Studio notes

- **Same slug on EN/AR pages/posts is intentional** for document-level localization (one English slug shared by language versions). Production only serves `translationStatus == "complete"`.
- Field-level content (products/categories) must use internationalized-array **v5** shape: `language` field + random `_key`.
- Legacy site HTML includes CSS/nav chrome; extract filters that out before import.

1. Run extract → transform → validate → import dry-run
2. Import into a staging dataset first when possible
3. Review Studio content and translation metadata
4. Only then `--write` against production
5. Re-run import is safe: patches by `legacyId` / locale slug
