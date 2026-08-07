# Contributing

Thank you for contributing to The Blockchain Library.

The project welcomes improvements to documentation, structured knowledge, developer resources, research metadata, validation, generation, and learning material.

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

On Windows PowerShell:

```powershell
npm.cmd run build:platform
```

On other supported shells:

```bash
npm run build:platform
```

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

By contributing, you agree that your contribution may be distributed under the repository's applicable license terms.
