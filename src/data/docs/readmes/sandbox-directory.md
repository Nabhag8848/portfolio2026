# sandbox.directory

[![sandbox.directory](https://img.shields.io/badge/visit-sandbox.directory-111110?style=for-the-badge&labelColor=2e2e2a)](https://sandbox.directory)
[![GitHub stars](https://img.shields.io/github/stars/sandbox-kit/directory?style=flat&logo=github&label=Star)](https://github.com/sandbox-kit/directory)
[![GitHub issues](https://img.shields.io/github/issues/sandbox-kit/directory?style=flat&logo=github)](https://github.com/sandbox-kit/directory/issues)

**[sandbox.directory](https://sandbox.directory)** is a searchable list of agent sandbox providers—hosted runtimes, browsers, VMs, and self-hosted options for AI agents. No account required: open the site, search, and click through to each vendor.

This repository is the open-source app and data behind that site.

If the list saves you time, **⭐ [star the repo on GitHub](https://github.com/sandbox-kit/directory)** so more people find it. Stars help discovery and signal that the inventory is worth keeping up to date.

## Use the directory

1. Go to **[sandbox.directory](https://sandbox.directory)**.
2. Search by product name, domain, or keywords (categories are searchable in the data but not shown as labels in the list).
3. Open a row to visit the provider’s site in a new tab.

The list is curated from public indexes (agentsandboxes.org, LangChain integrations, package registries, GitHub, and similar sources). Entries are checked periodically; broken or off-topic links are removed when found.

## Missing a provider?

If a sandbox product should be on the list, **[open an issue](https://github.com/sandbox-kit/directory/issues/new)** with the product name and homepage URL. Include a short note on what it offers (code execution, browser, microVM, etc.) if that’s not obvious from the site.

## Data and license

Provider records live in [`public/agent-sandbox-providers.json`](public/agent-sandbox-providers.json).

## For developers

To run the app locally, refresh the inventory, or configure scheduled sync, see **[setup.md](./setup.md)**.
