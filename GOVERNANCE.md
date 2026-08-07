# Governance

## Purpose

Governance exists to preserve technical accuracy, editorial consistency, openness, and long-term maintainability as The Blockchain Library grows.

## Guiding principles

Decisions should prioritize:

- educational value;
- technical accuracy;
- neutrality;
- maintainability;
- interoperability of structured data;
- contributor clarity;
- long-term stewardship.

## Roles

### Maintainers

Maintainers may:

- review and merge contributions;
- approve releases;
- evolve schemas and architecture;
- resolve conflicts;
- enforce editorial and security standards;
- deprecate stale or unsafe material.

### Contributors

Contributors may propose changes to content, data, code, architecture, and project process.

Contribution does not automatically grant maintainer authority.

### Reviewers

As the community grows, maintainers may recognize subject-matter reviewers for areas such as wallets, DeFi, infrastructure, AI, security, or research.

## Decision classes

### Routine changes

Examples:

- typo fixes;
- clarification;
- valid metadata additions;
- non-breaking content updates.

These may be approved through normal review.

### Significant changes

Examples:

- new object types;
- schema changes;
- breaking ID changes;
- generator architecture changes;
- API contract changes;
- major navigation restructuring.

These should include explicit rationale and migration impact.

## Consensus

The project should prefer reasoned consensus over voting when practical.

Technical evidence and maintainability take priority over popularity.

## Editorial authority

Marketing claims are not authoritative sources for neutral technical descriptions.

Maintainers may reject technically weak or promotional material even if it is widely repeated elsewhere.

## Releases

The project uses semantic-style versioning for repository milestones.

- patch releases: fixes and non-breaking corrections;
- minor releases: new capabilities or substantial content expansions;
- major releases: significant platform or contract changes.

Release notes should summarize architecture, knowledge, documentation, migration concerns, and future work.

## Breaking changes

Stable IDs should not be changed casually.

When a breaking change is necessary:

1. document the reason;
2. provide migration guidance where practical;
3. preserve aliases or redirects when possible;
4. note the change in `CHANGELOG.md`.

## Disputes

Disagreements should focus on evidence, architecture, and project principles.

Maintainers may make a final decision when consensus cannot be reached.

## Amendments

This governance model may evolve as contributor volume and project complexity increase.

Changes to governance should be explicit and documented.
