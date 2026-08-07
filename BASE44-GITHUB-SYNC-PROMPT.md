# Base44 Prompt — GitHub Canonical Sync Adapter

Update the existing The Blockchain Library admin Knowledge Engine area to add a new administrator-only tab:

**Repository Sync**

This is a SAFE RETURN SYNC from the compiled GitHub Knowledge Engine into Base44.

IMPORTANT OWNERSHIP RULE:

- Base44 owns authored content.
- GitHub owns compiled/canonical knowledge metadata.
- Mintlify owns documentation presentation.

The Repository Sync MUST NOT overwrite article bodies, glossary definitions, book descriptions, research abstracts, images, manually authored SEO copy, or other editorial content.

## GitHub release source

Fetch the latest canonical release metadata from the public repository using the raw GitHub version of:

`knowledge-release.json`

Repository:

`https://github.com/jasonansellto/the-blockchain-library`

Then fetch the compiled public artifacts referenced by that release, especially:

- `public/knowledge/catalog.json`
- `public/knowledge/graph.json`
- `public/knowledge/related.json`
- `public/knowledge/search-index.json`
- `public/knowledge/knowledge-release.json`

Use GitHub raw-content URLs or the GitHub Contents API for these PUBLIC files.

## Repository Sync dashboard

Display:

- Current GitHub release version
- Compiler version
- Build ID
- Base44 last export build/date
- Base44 last repository sync date
- Canonical object count
- Graph edge count
- Reconciliation warnings
- Sync status

Use status values:

- In Sync
- Update Available
- Never Synced
- Conflict Review Required
- Failed

## Mapping

Match Base44 records to canonical GitHub records in this order:

1. existing `canonical_uid`
2. source ID from `source-map.json` if available
3. exact slug + compatible object type
4. normalized slug + compatible object type

Never merge records solely because titles are similar.

## Fields Base44 may accept from GitHub

Add fields to applicable Base44 content entities if they do not already exist:

- canonical_uid
- canonical_status
- compiled_build_id
- normalized_slug
- compiled_relationships
- knowledge_quality
- canonical_search_metadata
- repository_sync_date

Do not replace the existing public slug automatically when `normalized_slug` differs.

Flag it for review instead.

## Relationship sync

Use `related.json` and `graph.json` to populate `compiled_relationships`.

Compiled relationships are a DERIVED field.

Do not destroy manually curated Base44 relation fields.

The UI may display both:

- Editorial Relationships
- Compiled Knowledge Relationships

## Quality data

Where reconciliation/quality data exists, store or display:

- missing SEO
- missing tags
- uncategorized status
- unresolved relationships
- duplicate/merge history
- knowledge quality score

This information is advisory.

Do not automatically rewrite content to improve the score.

## Dry run

Repository Sync MUST have:

1. Preview Sync
2. Apply Safe Metadata Sync

Preview Sync produces counts:

- matched
- unmatched
- safe updates
- slug conflicts
- missing Base44 records
- missing GitHub records
- relationship updates
- conflicts requiring review

No database writes occur during Preview Sync.

## Apply Safe Metadata Sync

Only update approved derived/canonical fields.

Before applying, show a confirmation screen with exact counts.

Write a sync log containing:

- releaseVersion
- buildId
- startedAt
- completedAt
- matchedCount
- updatedCount
- skippedCount
- conflictCount
- errorCount

## Do not build a destructive two-way sync

The lifecycle is:

Base44 authored content
→ Base44 export
→ Knowledge Compiler in GitHub
→ canonical release
→ Mintlify documentation
→ safe canonical metadata returned to Base44

This closes the knowledge distribution loop without creating competing content masters.
