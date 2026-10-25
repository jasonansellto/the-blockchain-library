# Project Status

## Synchronization (October 2026)

- Base44 → GitHub sync is automated: the **Sync from Base44** workflow pulls published platform content daily (or on demand), compiles the canonical release and commits it.
- Builds are reproducible: unchanged content produces an identical release, so CI freshness checks pass and the sync only commits real changes.
- The platform export no longer drops or duplicates records (pagination now orders by record ID). Earlier "duplicate export rows" were largely caused by this.
- Curated v1 knowledge outputs moved to `public/knowledge/curated/` so they can no longer overwrite the canonical release files.

## Current release line

**v2.3.0 — Coverage Intelligence**

The Blockchain Library is operating as a synchronized platform across Base44, GitHub, Mintlify and the public Knowledge Explorer.

## Production knowledge inventory

| Area | Exported | Canonical / Status |
| --- | ---: | --- |
| Total content records | 3,858 | 3,545 canonical objects |
| Glossary | 597 | Canonicalized and deduplicated |
| Articles / Topics | 701 | Canonicalized and deduplicated |
| Books | 98 | Compiled |
| Research | 294 | Compiled |
| Learning Paths | 12 | Compiled |
| Developer Resources | 134 | Compiled |
| Code Examples | 46 | Canonicalized and deduplicated |
| RPC Endpoints | 160 | Compiled |
| Categories | 86 | Canonicalized |
| News | 1,720 | Canonicalized and deduplicated |
| Newsletters | 9 | Compiled |
| Knowledge Graph Edges | — | 7,415 usable edges |

## Platform layers

- **Base44:** authored content, public website, Explorer, Coverage Intelligence and editorial workflow.
- **GitHub:** canonical objects, compiler, releases, graph, search, schemas and governance.
- **Mintlify:** documentation and developer reference.

## Reconciliation status

- 298 exact duplicate export rows removed;
- 15 canonical collision groups merged;
- duplicate canonical UIDs reduced to zero;
- 1,595 unresolved relationship references remain;
- 299 unique missing concept candidates remain;
- 21 self-referencing edges excluded.

## Current issue under correction

The first v2.3.0 coverage pass undercounts some research, tutorials, code examples, references, categories and priority gaps. This is a coverage-resolution issue, not a loss of canonical knowledge.

## Current work

**v2.3.1 — Coverage Resolution & Diagnostics**

In progress: bidirectional graph resolution, resource-type normalization, category-name resolution, reference extraction, diagnostics, health checks and scoring-schema versioning.

## Next milestone

**v2.4.0 — Read-only Knowledge API** after the corrected v2.3.1 baseline is validated.
