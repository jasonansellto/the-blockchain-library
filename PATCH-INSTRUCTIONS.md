# The Blockchain Library v1.2.0 — Dynamic Knowledge Patch

This release focuses on maintainability and user experience rather than simply adding more pages.

IMPORTANT: `/images/github-banner.png` is not included and will not be overwritten.

## What changes

- Replaces the enormous 250-term sidebar with curated human navigation.
- Generated topic/glossary pages stay in the repository and remain directly accessible.
- Adds dynamic catalogs for topics, glossary, books, research, tutorials, and quizzes.
- Upgrades the Knowledge Explorer with related-resource sections.
- Fixes the data-generation architecture so books/research/tutorials/etc. are merged with v1.1 topics and glossary rather than being overwritten.
- Adds `/knowledge/related.json`.
- Adds `/knowledge/search-index.json`.
- Adds unified Knowledge Platform validation and CI.

## Build

After extracting into the repository root:

```powershell
npm.cmd run build:platform
```

Then push:

```powershell
git pull origin main --rebase
git add .
git commit -m "Launch dynamic knowledge catalogs and related-resource engine v1.2.0"
git push origin main
```

## Important

Do not delete the existing `generated/topics/` or `generated/glossary/` folders. They remain useful as indexable canonical pages even though they are no longer individually listed in Mintlify's sidebar.
