# The Blockchain Library v1.3.0 — Resource Enrichment

IMPORTANT: `/images/github-banner.png` is not included and will not be overwritten.

## What this release adds

- Corrected and enriched topic mappings for all 9 current book objects
- Canonical URLs and summaries for books
- Enriched research object with DOI and SSRN links
- Generated canonical book pages
- Generated canonical research page
- Knowledge coverage generator
- Interactive coverage report
- Updated Knowledge Engine documentation
- Updated Mintlify navigation
- v1.3 platform build command

## Build

Extract into the repository root.

Then:

```powershell
npm.cmd run build:platform
```

The build now also runs:

```text
generate:coverage
```

and writes:

```text
public/knowledge/coverage.json
```

Then push:

```powershell
git pull origin main --rebase
git add .
git commit -m "Add resource enrichment and knowledge coverage engine v1.3.0"
git push origin main
```

After deployment, open:

```text
/reports/coverage/
```

Use the lowest-scoring topics to choose the next tutorials, code examples, quizzes, research objects, and AI prompts.
