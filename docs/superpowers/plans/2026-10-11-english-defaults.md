# English Defaults Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan inline. Steps use checkbox syntax for tracking.

**Goal:** Publish an English-first project, assessment tool, architecture gallery, and public security homepage.

**Architecture:** Separate the English presentation default from the Chinese source strings. Retain explicit language links, saved preferences, all seven editions, and existing assessment data.

**Tech Stack:** Static HTML/CSS, JavaScript, Node.js, ExcelJS, GitHub Pages.

**Spec:** The user's current instructions in this conversation: the project defaults to English; brief attribution is Teloa AI Security; Max Luo appears in detailed authorship and the standard.

## Global Constraints

- Default locale: `en`; source locale: `zh-CN`; supported locales: `zh-CN`, `en`, `ja`, `ko`, `de`, `fr`, `es`.
- Preserve all 240 requirements, scoring, assessment storage, and security controls.
- Keep the project under `https://security.teloa.ai/agent-baseline-assessor/` and enforce HTTPS.
- Preserve previous English README links using a small compatibility page.

## Review Focus

- Fresh visitors with a Chinese browser locale still receive English.
- Explicit Chinese links and saved language preferences remain effective.
- Blocked storage and unknown language parameters default to English.
- README regeneration writes English to `README.md` and Chinese to `README.zh-CN.md`.
- Default offline workbooks are English; Chinese remains available explicitly.

### Task 1: Default locale and workbook

**Files:** `03-tool/assets/i18n.js`, `03-tool/assets/app.js`, `03-tool/tools/selftest.js`, `03-tool/tools/i18n_node.js`, `03-tool/tools/build_xlsx.js`, `03-tool/index.html`, `03-tool/architecture.html`, `01-standard/diagrams/index.html`, `03-tool/offline/`, `.github/workflows/pages.yml`.

**Interfaces:** `I18N.DEFAULT` is `en`; `I18N.SOURCE` remains `zh-CN`; language selection uses query, saved preference, then default.

- [x] Change default-locale assertions in `selftest.js`; run `npm test` and observe the English-default assertion fail.
- [x] Add the distinct default locale, preserve language precedence, and set English static shell/gallery content.
- [x] Build English and Chinese offline workbooks, then run `npm test`; expect all seven-language round trips to pass.

### Task 2: Public documentation and homepage

**Files:** `README*.md`, `02-usage/*/usage.md`, `03-tool/tools/build_readme.js`, `CHANGELOG.md`, and `/Users/max/project/teloa-ai.github.io/{index.html,README.md}`.

**Interfaces:** English canonical README is `README.md`; Chinese is `README.zh-CN.md`; each localized document links to its corresponding UI locale.

- [x] Promote the English README, preserve Chinese, update language bars and the README generator, and document English defaults/workbooks in all usage editions.
- [x] Translate the public security homepage and its README to English; use English project links and organization-only brief attribution.
- [x] Run `npm run build:readme`, document-link verification, and desktop/mobile browser checks; expect valid links and no overflow.

### Task 3: Review and publication

- [x] Obtain independent review; run the complete browser acceptance checks for defaults, seven languages, imports/exports, score persistence, and gallery assets.
- [ ] Publish the reviewed changes, confirm both Pages workflows succeed, verify HTTPS/HTTP redirects, and open the live English project in Chrome.
