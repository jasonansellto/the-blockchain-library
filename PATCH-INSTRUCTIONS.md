# The Blockchain Library v1.4.0 — Learning & Developer Enrichment

IMPORTANT: `/images/github-banner.png` is not included and will not be overwritten.

## Adds

- 10 tutorial objects
- 10 code-example objects
- 10 AI-prompt objects
- 10 quiz objects
- 40 native Mintlify resource pages
- 4 resource catalog pages
- Knowledge Engine learning-enrichment documentation
- Updated native Mintlify navigation

## Why

The existing repository had only 3 tutorial objects, 1 generic code example, 3 AI prompts, and 1 quiz. Several also referenced older topic IDs. This patch replaces those small starter sets with valid canonical topic mappings and useful resource coverage.

## Build

Extract into the repository root, then run:

```powershell
npm.cmd run build:platform
```

Then:

```powershell
git pull origin main --rebase
git add .
git commit -m "Add learning and developer enrichment v1.4.0"
git push origin main
```
