# 03 工具说明

本文面向维护者，说明仓库结构、各脚本的作用、如何在基线修订后更新数据，以及依赖的第三方组件。使用方法见 [02 使用方法](../../02-使用方法/zh-CN/使用方法.md)。

## 1、目录结构

本文件所在的目录就是工具根目录，下列路径和命令都以 `03-工具/` 为起点。

```
index.html               页面入口
assets/
  app.js                 界面与交互
  i18n.js                多语言：语言检测、切换与取词（网页与 Node 共用）
  score.js               评分规则（网页与 Node 共用）
  charts.js              雷达图、差距图、分布图（纯 SVG）
  workbook.js            Excel 生成与读取（网页与 Node 共用）
  styles.css
data/
  baseline.json          基线数据：章、小节、要求、等级、落点组件、检查点
  baseline.js            同一份数据，供离线双击打开时使用
  i18n.<语言>.js          由 i18n/<语言>.json 生成的词典，供页面加载
i18n/
  <语言>.json             各语言词典：中文原文 → 译文
  glossary.md            七种语言的术语对照表
  source-baseline.json   基线数据中需要翻译的中文字符串清单
vendor/exceljs.min.js    ExcelJS 4.4.0（MIT），仅在导入导出 Excel 时加载
vendor/fonts/            IBM Plex 拉丁字符子集（OFL），本地加载，不连外网
offline/                 离线 Excel 评估表（中文）
tools/                   数据、词典与模板生成脚本，自检，Excel 公式交叉核对
deploy/                  nginx 配置与 Dockerfile
工具说明/                 本文档的各语言版本
_headers                 Cloudflare Pages 的安全响应头
```

## 2、常用命令

| 命令 | 作用 |
| --- | --- |
| `npm install` | 安装依赖（ExcelJS，仅用于生成和校验 Excel） |
| `npm run build:xlsx` | 重新生成 `offline/` 下的离线评估表 |
| `npm run build:i18n` | 由 `i18n/*.json` 重新生成 `data/i18n.*.js`，修改词典后运行 |
| `npm test` | 核对评分规则和 Excel 读写往返，并检查各语言词典是否覆盖全部界面文字和基线文字 |
| `npm run check:xlsx` | 用 LibreOffice 独立重算导出的 Excel 公式，与网页评分逐格比对（需要本机装有 LibreOffice） |

## 3、更新基线

基线文档修订后，按以下三步更新：

1. 从基线文档导出 Markdown，运行 `python3 tools/build_data.py <导出文件> --version 1.1 --date 2026-12-01`，重新生成 `data/baseline.json` 和 `data/baseline.js`。脚本会检查编号重复、编号顺序、未勾选等级、等级不累积和缺少落点组件等问题；按基线 6.4，删除的编号不复用，所以允许跳号。它还会把手写的组件信任假设和检查点与文档 4.2、4.3 比对，不一致时给出提示。
2. 如果新增或调整了要求，同步修改 `tools/component_map.py` 中各小节的落点组件（按小节内的先后顺序逐条对应）。
3. 运行 `npm install` 和 `npm run build:xlsx`，重新生成离线评估表；再运行 `npm test` 做自检。

已有的评估 JSON 会按编号匹配到新版本，基线中不存在的编号在导入时会被忽略并给出提示。

同时把仓库 `01-标准/` 下的正文换成新版本，并更新 README 中的版本号。

## 4、多语言

页面文字以中文原文作为键，各语言的译文放在 `i18n/<语言>.json` 里，缺少译文时显示中文。目前支持 zh-CN、en、ja、ko、de、fr、es。

- **修改译文**：编辑 `i18n/<语言>.json`，运行 `npm run build:i18n` 重新生成 `data/i18n.<语言>.js`，再运行 `npm test`。
- **界面文字或基线条文有变化时**：运行 `npm test`，它会列出每种语言缺少的中文字符串，补齐后重新生成词典。术语按 `i18n/glossary.md` 统一。基线修订后，`01-标准/` 下各语言的译本也要同步更新。
- **增加一种语言**：在 `assets/i18n.js` 的 `LOCALES` 中登记语言代码和名称，新建 `i18n/<语言>.json`，在 `index.html` 中加入 `data/i18n.<语言>.js`，再按上一条补齐译文。基线正文、使用方法和本文档的译本分别放在 `01-标准/<语言>/`、`02-使用方法/<语言>/` 和 `工具说明/<语言>.md`。

## 5、第三方组件

- [ExcelJS](https://github.com/exceljs/exceljs) 4.4.0，MIT 许可，许可文本见 `vendor/exceljs.LICENSE`。
- [IBM Plex Sans / Mono](https://github.com/IBM/plex) 拉丁字符子集，SIL Open Font License 1.1，许可文本见 `vendor/fonts/OFL.txt`。中文使用系统字体（苹方、微软雅黑或思源黑体）。
