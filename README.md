# The Blockchain Library

[![The Blockchain Library — Learn, Build, Explore](images/github-banner.png)](https://theblockchainlibrary.com)

**Learn blockchain. Build the future.**

The Blockchain Library is an open-source knowledge platform for blockchain education, AI-assisted learning, developer resources, technical documentation, research, and structured reference content.

## Knowledge Platform v1.0

Version 1.0 introduces a canonical multi-object content model designed to power documentation, search, learning paths, AI interfaces, quizzes, public data exports, and future applications from the same source of truth.

### Object types

Topics · Glossary · Books · Research · Tutorials · Code Examples · AI Prompts · Quizzes · Learning Paths

### Build the knowledge layer

```powershell
npm.cmd run build:knowledge
```

Generated outputs:

```text
public/knowledge/
├── index.json
├── catalog.json
├── graph.json
└── knowledge-graph.jsonld
```

## Architecture

```text
Canonical Knowledge Objects
        │
        ├── Mintlify Documentation
        ├── Search
        ├── Knowledge Graph
        ├── Learning Paths
        ├── Quizzes
        ├── AI / MCP
        └── Public JSON Exports
                 │
                 └── Future Knowledge API / Apps
```

## Contributing

Contributions that improve accuracy, clarity, structured metadata, relationships, examples, or learning resources are welcome.

## License

Code in this repository is licensed under the MIT License unless otherwise noted. Educational and publishing content may have separate rights where explicitly identified.
