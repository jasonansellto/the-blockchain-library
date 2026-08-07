# v2.1.1 Documentation Integrity Patch

This patch fixes the final synchronization issues found during the docs audit.

## Fixes

1. `docs.json` now exposes the v2 synchronized catalogs in navigation and footer.
2. Related knowledge links use Mintlify v2 routes when the target has a generated docs page.
3. Extremely long physical MDX filenames are shortened deterministically with an 8-character SHA-1 suffix.
4. A documentation integrity validator checks generated v2 links and required navigation.
5. GitHub Actions runs the docs integrity check on relevant changes.

## Install

Extract over the repository root.

Run:

```powershell
npm.cmd run generate:mintlify
npm.cmd run validate:docs
```

If both pass:

```powershell
git add -A
git commit -m "Fix documentation integrity v2.1.1"
git push origin main
```

Mintlify should redeploy automatically or can be manually updated.

## Expected result

The docs site should expose the synchronized v2 Knowledge Release and catalogs while maintaining curated documentation sections for tutorials, quizzes, AI prompts, and project documentation.
