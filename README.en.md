# Enterprise Agent Identity and Authorization Security Baseline · Self-Assessment Tool

[简体中文](README.md) · **English** · [日本語](README.ja.md) · [한국어](README.ko.md) · [Deutsch](README.de.md) · [Français](README.fr.md) · [Español](README.es.md)

This project has two parts: a security standard for enterprise agent identity and authorization, and a static tool for assessing yourself against that standard. The tool needs no backend. Assessment data is stored only in the user's own browser.

Author: Max ([GitHub @cybermaxluo](https://github.com/cybermaxluo))

## Contents

```
01-standard/   Baseline text (Markdown)
02-usage/      Assessment steps, deployment options, scoring rules
03-tool/       Static assessment page, data, Excel template, scripts, and deployment configuration
.github/       GitHub Pages automatic publishing workflow
```

## Reading Order

1. **[01 Standard](01-standard/en/baseline-v1.0.md)**: The Enterprise Agent Identity and Authorization Security Baseline, v1.0. It contains 240 requirements in 10 chapters and 62 sections, grouped into three cumulative levels. L1 (Baseline) has 90 requirements, L2 (Standard) adds 137 on top of those, and L3 (Enhanced) adds 13 more. Terms, the reference architecture, the threat model, and the appendix mappings are all in this file. The Chinese version of the standard is authoritative; the other language versions are translations.
2. **[02 Usage Guide](02-usage/en/usage.md)**: How to run a self-assessment, the online, offline, and self-hosted modes, scoring rules, publishing to GitHub Pages or Cloudflare Pages, and how data is stored.
3. **[03 Tool Guide](03-tool/docs/en.md)**: The tool's directory structure, common commands, how to update the tool after the baseline is revised, and third-party components.

## Quick Start

- To assess yourself directly, open the online address, or extract the zip file and double-click `03-tool/index.html`.
- To fill in Excel, use `03-tool/offline/baseline-assessment.xlsx`.
- To deploy it yourself, see the publishing section of the [02 Usage Guide](02-usage/en/usage.md).

## License

The license for this repository will be decided before it is published.
