# Coverage Intelligence

Coverage Intelligence is the editorial analysis layer for The Blockchain Library Knowledge Engine. It evaluates the current canonical GitHub build and identifies where the graph is strong, incomplete, weakly connected, or missing supporting resources.

## Current v2.3.0 implementation

- 3,545 canonical knowledge objects
- 7,415 usable graph relationships
- 299 unique missing-concept candidates
- 1,595 unresolved relationship references

Coverage is cached by Knowledge Engine build ID. Historical snapshots support release comparison.

## Coverage dimensions

- content completeness
- relationships
- metadata
- SEO
- references
- learning resources
- developer resources
- research

Coverage is context-aware. Different canonical object types use different requirement profiles.

## Coverage score

Coverage Score is a structured completeness metric. It is not an accuracy, truth, trust, or safety score.

## Improvement priority

Improvement Priority is separate from Coverage Score and may consider inverse coverage, graph centrality, inbound and outbound connections, missing resources, learning relevance, developer relevance, research relevance, missing concepts, and unresolved relationships.

## Editorial workflow

Recommendations can become Base44 editorial tasks: Open → In Progress → Review → Complete. Workflow state is operational Base44 data and is not canonical GitHub knowledge.

## Export contract

Coverage Intelligence can export structured JSON or CSV. The future GitHub-compatible JSON format is documented in `schemas/coverage-intelligence.schema.json`.

## Known limitation in v2.3.0

The first production scoring pass exposed mapping issues in category resolution, reference detection, bidirectional relationship resolution, and supporting-resource detection. These are being addressed in v2.3.1 — Coverage Resolution & Diagnostics. The first corrected v2.3.1 snapshot should be treated as a scoring baseline reset.
