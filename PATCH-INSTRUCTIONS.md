# The Blockchain Library v0.4.0 — Knowledge Engine

This patch introduces the first structured Knowledge Engine.

IMPORTANT: Your manually updated banner at `/images/github-banner.png` is NOT included in this ZIP and will not be overwritten. The updated README references that PNG path.

## Adds

- `data/knowledge/topics.json`
- `data/knowledge/glossary.json`
- `data/knowledge/relationships.json`
- `data/knowledge/learning-paths.json`
- `data/knowledge/resources.json`
- JSON schemas for topics, glossary entries, and relationships
- `scripts/validate-knowledge.mjs`
- `package.json` validation command
- GitHub Actions validation workflow
- Seven Mintlify Knowledge Engine documentation pages
- Updated Mintlify navigation
- Updated README using `images/github-banner.png`

## Install

Extract the ZIP into the repository root and replace matching text/config files.

Do NOT replace or delete your existing `/images/github-banner.png`.

Then run:

```bash
npm run validate:knowledge
git add .
git commit -m "Launch Blockchain Library Knowledge Engine v0.4.0"
git push origin main
```

Mintlify should redeploy automatically after the push.

## Expected validation output

```text
Knowledge validation passed.
Topics: 9
Glossary entries: 28
Relationships: 16
Learning paths: 2
Resources: 5
```
