# Contributing

Thank you for contributing to The Blockchain Library.

The project welcomes improvements to documentation, structured knowledge, developer resources, research metadata, validation, generation, and learning material.

## Where things live

The Blockchain Library has three layers. Edit the source, never the output.

| You want to change | Edit here | Notes |
| --- | --- | --- |
| Curated topics, glossary, books, tutorials, quizzes, learning paths | `data/knowledge/` | Pull request to this repo |
| Validators, compiler, generators, CI | `scripts/`, `.github/` | Pull request to this repo |
| Hand-written docs | `*.mdx` outside `generated/` | Pull request to this repo |
| Website articles, glossary pages, news, research and other published site content | theblockchainlibrary.com | Open a **content request** issue; maintainers apply it on the platform |
| Website code (pages, components, backend functions) | [the-blockchain-library-app](https://github.com/jasonansellto/the-blockchain-library-app) | Pull request there; merged changes sync into the live app |

These paths are **generated** and are overwritten by the daily *Sync from Base44* workflow — pull requests that edit them by hand will be asked to move the change to its source:

- `data/compiled/`
- `public/knowledge/` (except `public/knowledge/curated/`, which is generated from `data/knowledge/`)
- `generated/v2/`
- `knowledge-release.json`

## Before contributing

Read:

- `VISION.md`
- `ARCHITECTURE.md`
- `DATA-MODEL.md`
- `EDITORIAL-STANDARDS.md`
- `CODE_OF_CONDUCT.md`

## Contribution tracks

### Documentation

Improve learning pages, tutorials, developer guides, FAQs, and explanatory content.

### Knowledge objects

Add or improve topics, glossary entries, books, research, tutorials, code examples, prompts, quizzes, and learning paths.

### Development

Improve validators, generators, search indexes, graph outputs, build tooling, and future APIs.

### Research

Add verified references, identifiers, technical papers, and research relationships.

### Editorial review

Improve clarity, neutrality, terminology, accessibility, and technical accuracy.

## Workflow

1. Fork or branch from the current default branch.
2. Keep changes focused.
3. Validate locally.
4. Update related metadata or documentation when needed.
5. Open a pull request with a clear explanation.

## Local validation

Requires Node.js 20 or newer. No install step is needed.

```bash
npm run check
```

On Windows PowerShell use `npm.cmd run check`.

`check` validates and regenerates everything. If it changes any committed file, commit those changes with your pull request — CI fails when generated output is out of date.

Maintainers with the sync token can pull fresh platform content and compile a release locally with `KNOWLEDGE_SYNC_TOKEN=… npm run sync:base44`.

## Knowledge-object rules

New or edited objects should:

- use stable IDs;
- use globally unique UIDs;
- reference valid `topicIds`;
- avoid duplicate concepts;
- include a publication state;
- include a canonical URL when a public page exists;
- use verified identifiers for research or publications.

## Pull request expectations

A pull request should explain:

- what changed;
- why it changed;
- which knowledge objects are affected;
- whether documentation changed;
- what validation was run;
- whether there are migration or compatibility concerns.

## Scope

Prefer one coherent change over unrelated edits bundled together.

Large architectural changes should be discussed before implementation.

## Security

Never commit credentials, seed phrases, private keys, production secrets, or private user data.

See `SECURITY.md`.

## Editorial quality

Follow `EDITORIAL-STANDARDS.md`.

AI assistance is permitted, but contributors remain responsible for verification.

## Review

Maintainers may request changes for:

- technical correctness;
- data-model consistency;
- source quality;
- security;
- route integrity;
- readability;
- duplication;
- maintainability.

## Licensing

This project is licensed under the [MIT License](LICENSE). By submitting a pull request you agree that your contribution is licensed under the MIT License as well, and that you have the right to license it.
