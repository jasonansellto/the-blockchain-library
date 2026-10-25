# The Blockchain Library

[![The Blockchain Library — Learn, Build, Explore](images/github-banner.png)](https://theblockchainlibrary.com)

**Learn blockchain. Build the future.**

The Blockchain Library is an open-source knowledge platform for blockchain education, developer resources, research, structured learning, and AI-ready knowledge.

[Documentation](https://docs.theblockchainlibrary.com/) · [Website](https://theblockchainlibrary.com) · [Roadmap](ROADMAP.md) · [Contributing](CONTRIBUTING.md)

## Platform

```text
Knowledge Platform
        │
        ├── Documentation
        ├── Learning
        ├── Developer Resources
        ├── Books & Research
        ├── Search
        ├── Knowledge Graph
        └── AI Interfaces
                │
                ▼
          Knowledge Engine
                │
                ▼
       Canonical Knowledge Objects
```

## Current foundation

The repository includes:

- 100 canonical topic objects;
- 250 structured glossary entries;
- books and research objects;
- tutorials;
- code examples;
- AI prompt patterns;
- quizzes;
- learning paths;
- graph and search data;
- coverage analysis;
- validation and generation workflows.

## Repository guide

- `VISION.md` — why the project exists
- `ARCHITECTURE.md` — how the platform is structured
- `ROADMAP.md` — strategic direction
- `DATA-MODEL.md` — canonical object model
- `EDITORIAL-STANDARDS.md` — publishing and review standards
- `CONTRIBUTING.md` — contributor workflow
- `GOVERNANCE.md` — decision-making and stewardship
- `SECURITY.md` — vulnerability and secrets policy
- `PROJECT_STATUS.md` — current maturity
- `CHANGELOG.md` — release history

## Repositories

| Repository | What it holds |
| --- | --- |
| **the-blockchain-library** (this repo) | Knowledge engine: compiler, canonical release, docs |
| [the-blockchain-library-app](https://github.com/jasonansellto/the-blockchain-library-app) | Website source: pages, components, backend functions |

## How the platform stays in sync

```text
theblockchainlibrary.com (Base44)        authored content
        │  daily "Sync from Base44" workflow
        ▼
Knowledge Compiler (this repo)           canonical release → public/knowledge/
        │
        ├──▶ Mintlify docs               docs.theblockchainlibrary.com
        └──▶ Website Explorer            reads public/knowledge/ from GitHub
```

Content published on the website is compiled here automatically every day, and can be triggered on demand from the **Actions** tab. The current release is described in [`knowledge-release.json`](knowledge-release.json).

## Validate and build

Requires Node.js 20+. No dependencies to install.

```bash
npm run check
```

On Windows PowerShell use `npm.cmd run check`.

## Contributing

Contributions are welcome across documentation, structured knowledge, development, research, and editorial review.

Read `CONTRIBUTING.md`, `DATA-MODEL.md`, and `EDITORIAL-STANDARDS.md` before making large changes.

## Security

Do not commit private keys, seed phrases, passwords, API secrets, or production credentials.

See `SECURITY.md`.

## License

[MIT](LICENSE) © 2026 Jason Ansell. This covers the code, the structured knowledge data and the documentation in this repository. Third-party material referenced by the knowledge base (books, papers, external sites) remains under its own terms.
