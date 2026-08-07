# v1.0.0 Knowledge Platform Patch

This patch upgrades The Blockchain Library from a structured documentation project into a canonical multi-object knowledge platform.

IMPORTANT: `/images/github-banner.png` is not included and will not be overwritten. The README references that exact manually updated image path.

## Install

Extract into the repository root and replace matching text/config files.

Then run:

```powershell
npm.cmd run build:knowledge
```

Expected core counts:

- Topics: 9
- Glossary entries: 29
- Books: 9
- Research: 1
- Tutorials: 3
- Code examples: 1
- AI prompts: 3
- Quizzes: 1
- Learning paths: 2
- Explicit semantic relationships: 16

Then:

```powershell
git pull origin main --rebase
git add .
git commit -m "Launch Blockchain Library Knowledge Platform v1.0.0"
git push origin main
```

If OneDrive locks a directory during rebase, close apps using that directory before retrying.
