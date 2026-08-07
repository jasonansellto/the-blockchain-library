# v2.1.0 Knowledge Distribution Pipeline — Install

Copy this patch over the repository root.

Run:

```powershell
npm.cmd run distribute:v2
```

This does NOT require a new Base44 export because it distributes the already-compiled `data/compiled/` release.

Inspect:

```text
generated/v2/index.mdx
generated/v2/mintlify-index.json
knowledge-release.json
public/knowledge/knowledge-release.json
```

Then update `docs.json` as described below.

## docs.json navigation additions

Add this page near the top of the **Explore Knowledge** group:

```json
"generated/v2/index"
```

Replace the older catalog entries with:

```json
"generated/v2/catalogs/topics",
"generated/v2/catalogs/glossary",
"generated/v2/catalogs/books",
"generated/v2/catalogs/research"
```

In Learn, use:

```json
"generated/v2/catalogs/learning-paths"
```

In Developer Resources, add:

```json
"generated/v2/catalogs/resources",
"generated/v2/catalogs/code-examples",
"generated/v2/catalogs/rpc"
```

The individual generated pages do NOT need to be placed in the sidebar. They are linked from catalogs and remain searchable.

## Commit

```powershell
git add package.json scripts generated/v2 public/knowledge knowledge-release.json KNOWLEDGE-DISTRIBUTION.md .github/workflows
git commit -m "Launch Knowledge Distribution Pipeline v2.1.0"
git push origin main
```

Then apply `BASE44-GITHUB-SYNC-PROMPT.md` to the existing Base44 app to close the safe return-sync loop.
