# Knowledge Distribution Pipeline

Version 2.1.0 closes the synchronization loop between the three public surfaces of The Blockchain Library.

```text
Base44 / theblockchainlibrary.com
        │ authored content
        ▼
Base44 Content Export
        │
        ▼
Knowledge Compiler
        │
        ▼
GitHub canonical release
        │
        ├──► Mintlify generated documentation
        │       docs.theblockchainlibrary.com
        │
        └──► Safe canonical metadata sync
                theblockchainlibrary.com
```

## Ownership

| Layer | Responsibility |
| --- | --- |
| Base44 | Authored content and public application |
| GitHub | Canonical compiled knowledge, releases, graph, search, reconciliation |
| Mintlify | Documentation presentation and technical reference |

## Distribution commands

Run the compiler first:

```powershell
npm.cmd run build:v2
```

Then distribute:

```powershell
npm.cmd run distribute:v2
```

Or run the complete local pipeline:

```powershell
npm.cmd run release:knowledge
```

## Outputs

`generated/v2/` contains Mintlify-native MDX generated from canonical compiled objects.

`public/knowledge/` contains versioned public structured artifacts.

`knowledge-release.json` is the release contract consumed by external surfaces such as Base44.

## Mintlify

The generated documentation includes canonical pages for glossary, topics/articles, books, research, learning paths, developer resources, code examples, and RPC/infrastructure records.

News, newsletters, authors, and category administration remain on the main website and in structured data rather than being duplicated into Mintlify as thousands of documentation pages.

## Main website

The main site does not import compiled prose back from GitHub.

It receives only safe derived fields such as canonical UIDs, compiled relationships, quality metadata, search metadata, and build IDs.

This prevents a circular content-authoring conflict.
