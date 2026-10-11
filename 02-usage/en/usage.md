# 02 Usage Guide

This guide explains how to assess yourself against the baseline with the self-assessment tool. It covers the online, offline, and self-hosted modes, the scoring rules, and how data is stored. For the tool's directory structure and maintenance, see [03 Tool Guide](../../03-tool/docs/en.md).

## Assessment example

These screenshots come from the self-assessment tool using the simulated data included in this repository. They demonstrate scoring and reporting; they do not assess Teloa or any real platform.

![Simulated report: L1 achieved, target L2, about 79% met, 47 gaps](../assets/maturity-report.en.png)

All 90 L1 requirements are met. Of the 137 additional L2 requirements, 90 are met, 20 partially met, 17 unmet, and 10 unassessed. The target total is 180 of 227, shown as 79%; 47 gaps remain before L2. The 13 L3 requirements are unassessed and excluded from the L2 satisfaction rate.

![Excerpt of the simulated coverage matrix showing statuses by chapter and section](../assets/coverage-matrix.en.png)

### Reproduce the screenshots

1. Download the [example assessment JSON](../examples/demo-assessment.json).
2. Open the tool's Data page and import the file. Import replaces the current assessment; export existing data as JSON first.
3. Open Assessment Report to inspect the maturity levels and charts, then Coverage Matrix to locate gaps.

## 1. Three Ways to Use the Tool

### 1.1 Online

You can publish the tool to GitHub Pages or Cloudflare Pages. Both offer free plans. The steps are in Section 4. Cloudflare Pages reads the `_headers` file under `03-tool/` and sends the same security response headers as the nginx configuration. GitHub Pages does not support custom response headers.

### 1.2 Offline

There are two options.

- **Offline web page:** Download the repository zip file, extract it, and double-click `03-tool/index.html` to use the tool. It works exactly like the online version.
- **Offline Excel:** Fill in `03-tool/offline/baseline-assessment.xlsx` directly. The workbook includes drop-down lists, summary formulas, and gap statistics. When you finish, you can import it back into the web page to continue the assessment.

### 1.3 Self-Hosted Deployment

The page is made of static files, so any static file server can host it. The repository includes an nginx image configuration that runs as a non-root user. Its Content Security Policy prevents the page from connecting to any external address.

```bash
cd 03-tool && docker build -f deploy/Dockerfile -t agent-baseline-assessor .
docker run -d -p 8080:8080 --read-only --tmpfs /tmp agent-baseline-assessor
```

If you do not use Docker, copy `index.html`, `assets/`, `data/`, `vendor/`, and `offline/` from `03-tool/` to your web root. We recommend also applying the security response headers in `deploy/nginx.conf`. MIME types come from nginx's built-in `mime.types`. Do not write a separate `types {}` block in the server block. It would override the whole table, and the page would be downloaded as a file instead of rendered.

## 2. Features

| Page | What you can do |
| --- | --- |
| Coverage matrix | The top shows the current achieved level and the status of L1, L2, and L3. In chapter view, each row is one chapter and each cell is one section. A segmented color bar at the bottom of each cell shows the status of each requirement. Switch to "Component × Chapter" to see a heat map of the conformance rate for each enforcement component in each chapter. Click a cell to assess its requirements one by one |
| Requirement assessment | Filter by chapter, component, level, status, and keyword. Set the status, and record evidence, owner, and target completion date. Entire sections can be marked not applicable |
| Assessment report | Starts with the conclusions: maturity ladder, number of requirements still needed to reach the next level, conformance rate within the target level, gap items, and assessment progress. It then lists the priority requirements. Charts include a conformance radar (by chapter or by component), section maturity, and gap distribution. Each chart can be downloaded as PNG or SVG. The report also includes a per-component statistics table and the full gap list |
| Data | Enter assessment information. Export to JSON or Excel. Import JSON or offline Excel. Load a previous result for comparison. Clear the current assessment |

The exported Excel file and the offline template have the same structure. They contain five sheets: Assessment, Summary (formulas recalculate in real time as statuses change, and the target level can be switched from a drop-down list), Gap List, Architecture View, and Notes.

## 3. Scoring Rules

- **Conformance rate** = requirements met ÷ applicable requirements. Only requirements within the target level are counted. Partially met and not assessed requirements both count as not met.
- **Reaching a level:** All applicable requirements at that level and below must be met. If even one is missing, you do not reach that level.
- **Gap items:** Applicable requirements within the target level that are not yet met.
- **Not applicable:** When the platform lacks a capability (for example, it does not support MCP), mark the whole section as not applicable. It is excluded from the conformance rate.

The web page and the Excel file use the same rules. In Excel, if you clear a status or enter a value outside the drop-down list, it is treated as not assessed.

## 4. Publishing

### 4.1 Publish to GitHub Pages

1. Create a new repository and push the entire project to the `main` branch. The workflow builds the site automatically from `03-tool/`.
2. In the repository, go to Settings → Pages → Build and deployment, and set Source to **GitHub Actions**.
3. After that, each push to `main` runs `.github/workflows/pages.yml`. The workflow regenerates the offline assessment workbook, runs the self-check, and then publishes only the files the page needs. The build job has read-only permissions and does not run install scripts when it installs dependencies. The publish job does not run any third-party code.

A free GitHub account can enable Pages only for public repositories. If the baseline is not yet public, use self-hosted deployment, or use GitHub Enterprise, which supports private Pages.

### 4.2 Publish to Cloudflare Pages

Choose one of the following methods.

- **Connect a GitHub repository:** In the Cloudflare dashboard, go to Workers & Pages → Create → Pages → Connect to Git, and select this repository. Set Root directory to `03-tool`, Build command to `mkdir -p _site && cp -r index.html _headers assets data vendor offline _site/`, and Output directory to `_site`. Every later push publishes automatically.
- **Upload from the command line** without connecting Git: In the `03-tool/` directory, run the build command above, then run `npx wrangler pages deploy _site --project-name agent-baseline-assessor`.

The published address is `https://<project-name>.pages.dev`. You can also bind your own domain. If you want access limited to internal staff, add Cloudflare Access on top. It requires users to sign in with a corporate email address or an identity provider (IdP) first.

## 5. Data and Privacy

- Assessment data is stored in the browser's local storage (localStorage). The page makes no network requests and contains no analytics or telemetry code.
- Local storage is isolated by origin. GitHub Pages project pages share the `<account>.github.io` origin, so other pages under the same account can read this data. In Chrome, local pages opened through file:// also share one storage area. If the assessment content is sensitive, use a separate domain or a self-hosted deployment.
- Before you switch computers, clear your browser data, or hand the assessment to someone else for review, export JSON from the Data page first.
- When you import a file, the tool accepts only identifiers that exist in the baseline and known status values. Everything else is ignored. All displayed text is escaped before it is rendered.

## 6. Languages

The page is available in 简体中文, English, 日本語, 한국어, Deutsch, Français and Español. Switch languages in the top-right corner; switching does not affect assessment data already entered. The first visit defaults to Simplified Chinese; a manually selected language is remembered, and appending `?lang=en` (or `zh-CN`, `ja`, `ko`, `de`, `fr`, `es`) to the address opens a specific language. Exported Excel files use the current language, and files exported in any language can be imported. The offline workbook under `offline/` is in Chinese; for other languages, use **Download blank assessment form** on the **Data** page.
