# The Blockchain Library

An open educational and developer resource for learning blockchain, cryptocurrency, Web3, digital assets, and decentralized infrastructure.

This repository is the public technical home for **The Blockchain Library**. It contains the project documentation, roadmap, contribution guidelines, SEO-ready educational pages, and the source for a lightweight GitHub Pages site.

## Project goals

- Make blockchain concepts easier to understand.
- Publish practical, vendor-neutral educational resources.
- Document The Blockchain Library ChatGPT app and MCP integration.
- Provide reusable examples for educators, developers, and researchers.
- Maintain a transparent public roadmap and changelog.

## Live project

- Website: https://theblockchainlibrary.com
- Documentation site: enable GitHub Pages from the `/docs` folder after pushing this repository.

## Repository structure

```text
.
├── docs/                 # GitHub Pages website and SEO pages
├── examples/             # Future code examples and integrations
├── .github/              # Issue and pull-request templates
├── CHANGELOG.md
├── CONTRIBUTING.md
├── ROADMAP.md
├── SECURITY.md
└── LICENSE
```

## Included pages

- Project overview
- Getting started
- Blockchain learning path
- Blockchain glossary
- ChatGPT app overview
- MCP server overview
- Developer resources
- Frequently asked questions
- Roadmap
- Changelog

## Run locally

The site is static HTML. Open `docs/index.html` in a browser, or run:

```bash
python -m http.server 8000 --directory docs
```

Then visit `http://localhost:8000`.

## Deploy with GitHub Pages

1. Push this repository to GitHub.
2. Open **Settings → Pages**.
3. Under **Build and deployment**, select **Deploy from a branch**.
4. Choose `main` and `/docs`.
5. Save.

## Contributing

Contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md) before opening a pull request.

## License

Code is released under the [MIT License](LICENSE). Educational content is provided for general information and should not be treated as financial, legal, or investment advice.
