# v1.5.0 Bundle 3 — GitHub Professionalization

Adds:
- issue templates
- pull request template
- release notes
- final README
- package.json version bump to 1.5.0

Copy into the repository root, preserving the `.github` directory structure.

Then:

```powershell
npm.cmd run build:platform
git add .
git commit -m "Finalize repository professionalization v1.5.0"
git push origin main
```

After pushing, create a GitHub release/tag `v1.5.0` using `RELEASE-NOTES-v1.5.0.md`.
