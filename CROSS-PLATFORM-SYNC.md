# Cross-Platform Synchronization Patch — v2.3.0

This patch addresses two synchronization issues found during the audit.

## Platform vs. knowledge release version

`knowledge-release.json` previously exposed only a fixed `releaseVersion: 2.1.0`.

The release contract now distinguishes:

- platformVersion
- knowledgeReleaseVersion
- compilerVersion
- schemaVersion
- buildId

This allows the application platform to advance without pretending the canonical knowledge build changed.

## Mintlify Explore link

The public interactive Explorer lives at:

https://theblockchainlibrary.com/explore

Mintlify's top-level Explore action and footer now point to the public Explorer.

The internal `/knowledge-engine/explorer` docs page remains in the documentation navigation.

## Ownership

- Base44: authored content, public website, Knowledge Explorer, Coverage Intelligence
- GitHub: canonical compiled knowledge, release contract, graph, schemas
- Mintlify: documentation and developer reference
