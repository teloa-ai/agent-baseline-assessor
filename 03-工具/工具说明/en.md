# 03 Tool Guide

This guide is for maintainers. It describes the repository structure, what each script does, how to update the data after the baseline is revised, and the third-party components the tool depends on. For usage, see [02 Usage Guide](../../02-使用方法/en/使用方法.md).

## 1. Directory Structure

The directory that contains this file is the tool root. All paths and commands below start from `03-工具/`.

```
index.html               Page entry point
assets/
  app.js                 UI and interaction
  score.js               Scoring rules (shared by the web page and Node)
  charts.js              Radar, gap, and distribution charts (pure SVG)
  workbook.js            Excel generation and parsing (shared by the web page and Node)
  styles.css
data/
  baseline.json          Baseline data: chapters, sections, requirements, levels, enforcement components, checkpoints
  baseline.js            The same data, used when the page is opened offline by double-clicking
vendor/exceljs.min.js    ExcelJS 4.4.0 (MIT), loaded only when importing or exporting Excel
vendor/fonts/            IBM Plex Latin subset (OFL), loaded locally with no external network requests
offline/                 Offline Excel assessment workbook
tools/                   Data and template generation scripts, self-checks, and Excel formula cross-checks
deploy/                  nginx configuration and Dockerfile
_headers                 Security response headers for Cloudflare Pages
.github/workflows/       GitHub Pages automatic publishing
```

## 2. Common Commands

| Command | Purpose |
| --- | --- |
| `npm install` | Install dependencies (ExcelJS, used only to generate and verify Excel files) |
| `npm run build:xlsx` | Regenerate the offline assessment workbook under `offline/` |
| `npm test` | Verify that the data round-trips correctly through Excel reading and writing |
| `npm run check:xlsx` | Use LibreOffice to independently recalculate the formulas in the exported Excel file, and compare each cell with the web page scoring (requires LibreOffice installed locally) |

## 3. Updating the Baseline

After the baseline document is revised, update the tool in three steps.

1. Export the baseline document to Markdown, then run `python3 tools/build_data.py <export-file> --version 1.1 --date 2026-12-01` to regenerate `data/baseline.json` and `data/baseline.js`. The script checks for duplicate identifiers, identifier order, unchecked levels, levels that are not cumulative, and missing enforcement components. Under Section 6.4 of the baseline, deleted identifiers are not reused, so gaps in the numbering are allowed. The script also compares the hand-written component trust assumptions and checkpoints with Sections 4.2 and 4.3 of the document, and it warns if they do not match.
2. If requirements were added or changed, update the enforcement components for each section in `tools/component_map.py` to match. Map them in the order they appear within each section.
3. Run `npm install` and `npm run build:xlsx` to regenerate the offline assessment workbook. Then run `npm test` for a self-check.

Existing assessment JSON files are matched to the new version by identifier. Identifiers that do not exist in the new baseline are ignored during import, and the tool shows a notice.

Also replace the body text under `01-标准/` in the repository with the new version, and update the version number in the README.

## 4. Third-Party Components

- [ExcelJS](https://github.com/exceljs/exceljs) 4.4.0, MIT License. The license text is in `vendor/exceljs.LICENSE`.
- [IBM Plex Sans / Mono](https://github.com/IBM/plex) Latin subset, SIL Open Font License 1.1. The license text is in `vendor/fonts/OFL.txt`. Chinese text uses system fonts (PingFang, Microsoft YaHei, or Source Han Sans).
