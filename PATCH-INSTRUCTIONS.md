# Update Patch Instructions

Copy the contents of this patch into the root of your existing `the-blockchain-library` repository and allow the folders to merge.

The patch updates or adds:

- `README.md`
- `ROADMAP.md`
- `docs/index.html`
- `docs/assets/style.css`
- `docs/assets/github-banner.svg`
- `.github/ISSUE_TEMPLATE/config.yml`
- `.github/ISSUE_TEMPLATE/feature_request.md`
- `.github/ISSUE_TEMPLATE/question.md`

Then commit and push:

```bash
git add .
git commit -m "Upgrade project branding, README, documentation homepage, and community templates"
git push origin main
```

After pushing, consider completing these repository settings manually:

1. Enable **GitHub Discussions** under **Settings → General → Features**.
2. Add repository topics such as `blockchain`, `education`, `web3`, `cryptocurrency`, `ai`, `chatgpt`, `mcp`, `developer-tools`, and `open-source`.
3. Upload a social preview image under **Settings → General → Social preview**.
4. Confirm GitHub Pages is deploying from `main` and `/docs`.
