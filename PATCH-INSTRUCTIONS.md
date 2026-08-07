# v1.3.1 Mintlify Route Hotfix

This patch fixes 404 links caused by linking Mintlify navigation to arbitrary files under `/public/`.

## Fixes

- `/catalogs/` → native `/knowledge-engine/dynamic-catalogs`
- `/explorer/` → native `/knowledge-engine/explorer`
- `/reports/coverage/` → native `/knowledge-engine/coverage`
- `/catalogs/books/` → native `/generated/catalogs/books`
- `/catalogs/research/` → native `/generated/catalogs/research`
- Topics and glossary catalogs use existing Mintlify MDX routes.

The static `public/` files may remain in the repository for future standalone deployment, but Mintlify navigation no longer depends on them.

## Push

```powershell
git add .
git commit -m "Fix Mintlify 404 routes v1.3.1"
git push origin main
```
