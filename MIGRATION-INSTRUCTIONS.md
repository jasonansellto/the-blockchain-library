# Version 2 migration instructions

This package converts the repository from the original GitHub Pages prototype to a native Mintlify documentation project.

## Recommended migration

1. Back up or commit your current repository.
2. Delete the old `docs/` folder if it only contains the GitHub Pages prototype.
3. Copy all Version 2 files into the repository root.
4. Keep any current branding assets you still need.
5. Commit and push to `main`.
6. Return to Mintlify onboarding and select:
   - Local development
   - Use existing
   - `jasonansellto/the-blockchain-library`
7. Mintlify should now detect `docs.json` on the default branch.
8. Install the Mintlify GitHub App when prompted so deployments can follow repository updates.

## Local check

```bash
npm i -g mint
mint dev
```

The documentation configuration follows the current `docs.json` format.
