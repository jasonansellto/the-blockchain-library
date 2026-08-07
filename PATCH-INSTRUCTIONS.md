# v1.1.0 Knowledge Expansion Patch

This is the first content-scale release.

IMPORTANT: `/images/github-banner.png` is not included and will not be overwritten.

## Adds

- 100 canonical topic objects
- 250 glossary definitions
- 100 generated topic pages
- 250 generated glossary pages
- Topic and glossary catalog pages
- Interactive Knowledge Graph Explorer
- Expanded validation and generation
- GitHub Actions CI
- Updated Mintlify navigation

## Install

Extract into the repository root, then run:

```powershell
npm.cmd run build:expanded
```

Expected:

```text
Expanded knowledge validation passed.
Topics: 100
Glossary entries: 250
```

Then:

```powershell
git pull origin main --rebase
git add .
git commit -m "Expand Blockchain Library knowledge graph v1.1.0"
git push origin main
```

The next content release can expand the glossary from 250 to 500 and add generated book and research catalogs.
