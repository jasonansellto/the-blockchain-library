# Architecture

## The Blockchain Library Knowledge Platform

## Overview

The Blockchain Library is designed as a knowledge platform rather than a traditional documentation repository. Markdown and Mintlify are presentation layers. The canonical source of truth is structured knowledge stored in the Knowledge Engine.

```text
Users
  │
  ▼
Documentation / Search / Learning / AI
  │
  ▼
Knowledge Platform
  │
  ▼
Knowledge Engine
  │
  ▼
Canonical Knowledge Objects
  │
  ├── Topics
  ├── Glossary
  ├── Books
  ├── Research
  ├── Tutorials
  ├── Code Examples
  ├── AI Prompts
  ├── Quizzes
  └── Learning Paths
```

## Architectural goals

The architecture is intended to provide:

- one canonical representation for each knowledge concept;
- stable identifiers across presentation layers;
- explicit relationships between objects;
- machine-readable exports for search, AI, and APIs;
- independently generated human-readable documentation;
- validation before publication;
- a clear path from repository data to future applications.

## Knowledge Engine

The Knowledge Engine is the structured data layer under `data/knowledge/`.

It stores canonical objects using stable IDs and namespaced UIDs. These objects are validated and compiled into public data surfaces used by documentation, search, graph traversal, coverage analysis, and future APIs.

The Knowledge Engine is intentionally presentation-independent.

## Canonical object model

Current first-class object types are:

- topic;
- glossary entry;
- book;
- research;
- tutorial;
- code example;
- AI prompt;
- quiz;
- learning path.

Every object should have a stable identity and publication status. Object-specific fields add summaries, relationships, URLs, identifiers, questions, steps, or other metadata.

## Data flow

```text
data/knowledge/
      │
      ▼
Validation
      │
      ▼
Generation
      │
      ├── catalog.json
      ├── graph.json
      ├── related.json
      ├── search-index.json
      └── coverage.json
      │
      ▼
Presentation & Product Layers
```

## Validation

Validation is responsible for protecting the integrity of the knowledge graph.

Checks include:

- duplicate identifiers;
- missing required fields;
- unknown topic references;
- invalid relationships;
- malformed internal routes;
- unsupported publication states;
- broken cross-object references.

Validation runs locally through npm scripts and in GitHub Actions.

## Generation pipeline

Generation scripts transform canonical objects into reusable outputs.

The platform currently generates structured JSON for:

- unified catalogs;
- graph nodes and edges;
- related-resource indexes;
- search indexes;
- coverage reports.

Generated MDX can provide canonical, indexable human-readable views without replacing the underlying object.

## Documentation layer

Mintlify provides the primary documentation experience.

The documentation sidebar should remain curated for humans. It should not enumerate every machine-scale object merely because that object exists.

Large collections should be exposed through native catalog pages and search rather than hundreds of navigation entries.

## Knowledge graph

Relationships are stored explicitly whenever possible.

Examples include:

```text
Topic ──defined-by────► Glossary
Topic ──has-resource──► Tutorial
Topic ──has-resource──► Book
Topic ──has-resource──► Research
Topic ──related-to────► Topic
Wallet ──secured-by───► Private Key
DeFi ───depends-on────► Smart Contract
```

The graph allows the same relationship data to power navigation, AI context assembly, related-content recommendations, coverage analysis, and future graph APIs.

## Search layer

The structured search index normalizes object fields into a common record with title, description, type, category, tags, canonical URL, and searchable text.

Mintlify search remains useful for documentation pages. The Knowledge Engine search layer is intended for structured object retrieval and future products.

## Coverage engine

Coverage measures the maturity of each topic across resource types such as glossary, books, research, tutorials, code examples, prompts, quizzes, and learning paths.

Coverage should guide editorial priorities.

A low score is not a quality judgment. It identifies missing resource types.

## AI interfaces

AI systems should retrieve structured objects and relationships rather than treat all Markdown as an undifferentiated corpus.

A future AI tutor can assemble context from:

```text
Topic
 ├── definition
 ├── related topics
 ├── tutorial
 ├── code
 ├── research
 ├── books
 ├── quiz
 └── learning path
```

This reduces duplication and improves consistency.

## API direction

A future read-only versioned API may expose resources such as:

```text
GET /v1/topics
GET /v1/topics/:id
GET /v1/glossary
GET /v1/glossary/:id
GET /v1/books
GET /v1/research
GET /v1/tutorials
GET /v1/search
GET /v1/graph
GET /v1/coverage
```

The repository should not claim dynamic endpoints are live until a production API service exists.

## Repository layout

```text
/
├── data/knowledge/          Canonical structured objects
├── generated/               Generated human-readable resources
├── knowledge-engine/        Knowledge Engine documentation
├── knowledge-graph/         Graph documentation
├── learn/                   Curated learning material
├── developers/              Developer documentation
├── research/                Research documentation
├── api/                     API reference and planning
├── scripts/                 Validators and generators
├── .github/workflows/       CI validation
└── docs.json                Mintlify configuration
```

## Build process

Primary build commands include validation and generation steps.

On Windows PowerShell:

```powershell
npm.cmd run build:platform
```

On shells where npm script wrappers are available:

```bash
npm run build:platform
```

## Deployment

Mintlify deploys the documentation site from the repository.

The repository must therefore distinguish between:

- MDX routes that Mintlify serves directly;
- generated JSON intended for future products or external deployment;
- arbitrary static applications that may require a separate hosting layer.

Navigation should only link to routes known to be deployed.

## Scaling strategy

Scaling the platform should prioritize knowledge density over repository complexity.

Preferred sequence:

1. expand canonical objects;
2. improve relationships;
3. improve validation;
4. improve search and coverage;
5. add product interfaces over the same data.

Avoid creating parallel stores for the same knowledge unless a technical requirement makes duplication unavoidable.

## Architectural principle

Presentation layers are replaceable.

Canonical knowledge is not.
