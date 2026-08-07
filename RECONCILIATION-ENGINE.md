# Knowledge Reconciliation Engine v2.0.1

Version 2.0.1 turns the first Base44 import into a canonical reconciliation workflow.

## What changed

The compiler now separates **raw exported records** from **canonical knowledge objects**.

### Exact duplicate removal

If the same Base44 source record appears more than once in an export, only one canonical record is retained. The duplicate is recorded in `duplicate-merges.json`.

### Canonical collision merging

Records that normalize to the same canonical UID are merged into one object. The compiler:

- selects the richest record as the base;
- preserves every source ID;
- unions tags and array metadata;
- preserves alternate titles as aliases;
- keeps the strongest available SEO, summary, category, and difficulty metadata;
- writes a full merge audit trail.

No source record is silently discarded.

### Source ID map

`source-map.json` maps each Base44 source record ID to its canonical Knowledge Engine UID. This allows relationship exports to continue resolving after duplicates are merged.

### Missing concept queue

Unresolved relationship targets are grouped into `missing-concepts.json` and ranked by frequency. These are not automatically invented or force-mapped. They become an editorial queue for missing canonical terms and topic aliases.

### Search aliases

Merged titles and aliases are included in `search-index.json`, improving retrieval without creating duplicate public objects.

## New outputs

```text
data/compiled/
├── catalog.json
├── graph.json
├── related.json
├── search-index.json
├── reconciliation.json
├── missing-concepts.json
├── duplicate-merges.json
├── source-map.json
└── manifest.json
```

## Editorial rule

The compiler may merge records that normalize to the same canonical UID, but it does **not** fabricate a missing concept to repair a relationship.

Missing concepts must be reviewed and either:

1. added to Base44 as canonical content;
2. mapped through a future approved alias table; or
3. removed from the source relationship if invalid.

This keeps the graph auditable.
