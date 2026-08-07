# Security Policy

## Reporting a vulnerability

Please avoid public disclosure of a security issue before maintainers have had a reasonable opportunity to investigate.

A useful report includes:

- affected component;
- impact;
- reproduction steps;
- expected behavior;
- actual behavior;
- relevant logs or screenshots with secrets removed.

## Security scope

Security-sensitive areas may include:

- documentation deployment;
- GitHub Actions;
- generation and validation scripts;
- future APIs;
- future authentication or user-account systems;
- external integrations;
- examples that could encourage unsafe behavior.

## Secrets policy

Never commit:

- private keys;
- seed phrases;
- passwords;
- API secrets;
- production credentials;
- unredacted tokens;
- private user information.

Use obvious placeholders in examples.

## Dependency safety

Keep build dependencies current and remove unused packages.

Security updates should be prioritized when they affect production-facing tooling.

## Code examples

Examples are educational and may intentionally omit production concerns.

Where relevant, documentation should state that production systems need additional validation, authentication, authorization, rate limiting, monitoring, and error handling.

## Coordinated disclosure

Maintainers should:

1. acknowledge credible reports;
2. assess impact;
3. prepare a fix;
4. update affected documentation;
5. disclose responsibly after mitigation when appropriate.

## Security content

Educational security material should help readers recognize and reduce risk.

It should not include live secrets or unsafe operational instructions.
