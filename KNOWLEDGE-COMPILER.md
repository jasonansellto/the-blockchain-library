# The Blockchain Library Knowledge Compiler v2.0

The Knowledge Compiler reconciles the Base44 production content database with the open GitHub Knowledge Engine.

## Architecture

Base44 remains the authoring/CMS layer. A read-only export is placed in `imports/base44/`. The compiler validates the export, strips operational Base44 metadata, normalizes content into canonical public objects, resolves relationships, and generates reusable artifacts in `data/compiled/`.

Generated artifacts:

- `catalog.json` — normalized canonical object catalog
- `graph.json` — knowledge graph nodes and edges
- `related.json` — related-resource index by canonical UID
- `search-index.json` — text/semantic-search ready documents
- `reconciliation.json` — unresolved links, duplicates, and quality metrics
- `manifest.json` — compiler version, source version, counts, build ID, and output map

## Local workflow

1. Export the Base44 Content Export Center bundle.
2. Place the JSON files in `imports/base44/`.
3. Ensure the export manifest is named `manifest.json`.
4. Run `npm.cmd run build:v2` on Windows PowerShell, or `npm run build:v2` elsewhere.

## Source-of-truth policy

Base44 is the source of authored production content. GitHub is the source of versioned, compiled knowledge artifacts. Do not hand-edit `data/compiled/*.json`; update Base44, export again, and rebuild.

## Repository hygiene

Raw Base44 exports are intentionally ignored by Git because they contain operational database metadata. The compiler strips fields such as Base44 object IDs, creator-service IDs, counters, and source timestamps from the public canonical payload.

## Canonical IDs

Objects receive stable UIDs such as:

- `glossary:hd-wallet`
- `topic:ai-agents-can-work-but-how-will-they-get-paid`
- `book:the-ai-money-revolution`
- `resource:vector-smart-chain`
- `infrastructure:vsc-official`

These UIDs are shared by graph, search, MCP, future API, and AI retrieval layers.

## Relationship reconciliation

Targets are resolved in this order: Base44 source object ID, exact slug, normalized slug, then case-insensitive title/label. Unresolved relationships are never guessed; they are written to `data/compiled/reconciliation.json`. Self-referencing edges are skipped and counted.

## v2.1 targets

Stronger duplicate reconciliation, per-object JSON Schema validation, category aliases, confidence scoring, generated learning maps, embedding adapters, incremental builds, and automated GitHub release workflows.
