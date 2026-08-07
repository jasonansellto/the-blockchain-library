# Data Model

## The Blockchain Library Knowledge Engine

## Purpose

The Knowledge Engine uses canonical structured objects so that documentation, search, graph traversal, learning tools, AI interfaces, and future APIs can share one source of truth.

## Global conventions

### Stable IDs

`id` is the stable object identifier within an object type.

Example:

```json
{ "id": "smart-contracts" }
```

### Namespaced UIDs

`uid` is globally unique across object types.

```json
{ "uid": "topic:smart-contracts" }
```

Namespacing prevents collisions between a topic called `blockchain` and a glossary term called `blockchain`.

### Publication state

Recommended states:

```text
draft
review
published
deprecated
```

Editorial workflow may add review metadata without changing the stable object ID.

### Canonical URLs

When an object has a human-readable page, `canonicalUrl` should point to the preferred internal route.

### Topic relationships

Resources should reference canonical `topicIds` rather than copied titles.

## Topic

Purpose: represent a canonical subject in the knowledge graph.

Recommended fields:

```json
{
  "id": "smart-contracts",
  "uid": "topic:smart-contracts",
  "type": "topic",
  "title": "Smart Contracts",
  "category": "Smart Contracts & Web3",
  "summary": "Programs deployed to blockchain-compatible execution environments.",
  "level": "intermediate",
  "canonicalUrl": "/generated/topics/smart-contracts",
  "relatedTopics": ["evm", "dapps"],
  "tags": ["smart-contracts"],
  "status": "published"
}
```

Required: `id`, `uid`, `type`, `title`, `summary`, `status`.

## Glossary entry

Purpose: provide a concise canonical definition.

```json
{
  "id": "validator",
  "uid": "glossary:validator",
  "type": "glossary",
  "term": "Validator",
  "definition": "A network participant responsible for helping validate or finalize blockchain state.",
  "canonicalUrl": "/generated/glossary/validator",
  "status": "published"
}
```

Glossary definitions should be compact and should not duplicate full topic pages.

## Book

Purpose: represent long-form educational publications.

```json
{
  "id": "understanding-blockchain",
  "uid": "book:understanding-blockchain",
  "type": "book",
  "title": "Understanding Blockchain",
  "author": "Jason Ansell",
  "summary": "A beginner-focused introduction to blockchain technology.",
  "topicIds": ["blockchain", "transactions", "consensus"],
  "canonicalUrl": "/generated/books/understanding-blockchain",
  "status": "published"
}
```

Optional bibliographic fields may include ISBN, ASIN, edition, format, and publication date when verified.

## Research

Purpose: represent academic or technical research.

```json
{
  "id": "deterministic-execution-fixed-cost-l1",
  "uid": "research:deterministic-execution-fixed-cost-l1",
  "type": "research",
  "title": "Deterministic Execution and Fixed-Cost Transaction Models in Layer-1 Blockchain Infrastructure",
  "author": "Jason Ansell",
  "topicIds": ["blockchain", "deterministic-execution"],
  "identifiers": {
    "doi": "10.5281/zenodo.20209305",
    "ssrn": "6772498"
  },
  "status": "published"
}
```

Research identifiers should only be added when verified.

## Tutorial

Purpose: represent task-oriented educational content.

```json
{
  "id": "secure-a-self-custody-wallet",
  "uid": "tutorial:secure-a-self-custody-wallet",
  "type": "tutorial",
  "title": "Secure a Self-Custody Wallet",
  "summary": "Build a practical wallet-security routine.",
  "difficulty": "beginner",
  "topicIds": ["wallets"],
  "canonicalUrl": "/generated/tutorials/secure-a-self-custody-wallet",
  "status": "published"
}
```

## Code example

Purpose: represent minimal developer-oriented examples tied to canonical concepts.

```json
{
  "id": "rpc-failover-pattern",
  "uid": "code-example:rpc-failover-pattern",
  "type": "code-example",
  "title": "RPC Failover Pattern",
  "language": "javascript",
  "topicIds": ["rpc-infrastructure"],
  "canonicalUrl": "/generated/code-examples/rpc-failover-pattern",
  "status": "published"
}
```

Examples are educational and should not be presented as complete production implementations.

## AI prompt

Purpose: store reusable prompt patterns associated with canonical topics.

```json
{
  "id": "rpc-reliability-review",
  "uid": "ai-prompt:rpc-reliability-review",
  "type": "ai-prompt",
  "title": "RPC Reliability Review",
  "purpose": "development",
  "topicIds": ["rpc-infrastructure"],
  "status": "published"
}
```

Prompt objects should specify intended purpose and avoid unsafe or misleading instructions.

## Quiz

Purpose: represent knowledge checks.

```json
{
  "id": "wallet-security-check",
  "uid": "quiz:wallet-security-check",
  "type": "quiz",
  "title": "Wallet Security Check",
  "topicIds": ["wallets"],
  "questions": [
    {
      "id": "q1",
      "question": "What does a wallet control?",
      "answerType": "short-answer"
    }
  ],
  "status": "published"
}
```

## Learning path

Purpose: represent ordered educational sequences.

```json
{
  "id": "blockchain-foundations",
  "uid": "learning-path:blockchain-foundations",
  "type": "learning-path",
  "title": "Blockchain Foundations",
  "audience": "Beginner",
  "steps": [
    {
      "order": 1,
      "topicId": "blockchain",
      "page": "/learn/foundations/blockchain-basics"
    }
  ],
  "status": "published"
}
```

## Relationship model

Relationships should be explicit where useful.

Supported or planned relation types may include:

- `related-to`;
- `depends-on`;
- `prerequisite-for`;
- `part-of`;
- `used-by`;
- `secured-by`;
- `implemented-by`;
- `defined-by`;
- `has-resource`;
- `appears-in`.

Relationships should use UIDs when they cross object types.

## Lifecycle

Recommended editorial lifecycle:

```text
draft
  ↓
review
  ↓
published
  ↓
needs-update
  ↓
published or deprecated
```

`needs-update` can be represented as review metadata even if the core schema keeps the publication state list smaller.

## Validation rules

At minimum, validators should check:

- required fields;
- unique IDs and UIDs;
- valid `topicIds`;
- valid related-topic references;
- supported status values;
- internal route formatting;
- relationship endpoints;
- duplicate graph edges.

## Evolution

Schemas may expand over time, but stable IDs should not be renamed merely to improve wording.

Prefer additive changes.

When a concept is genuinely replaced, retain enough metadata to redirect or mark it deprecated rather than silently reusing its identifier for a different meaning.
