# 变更记录 / Changelog

本文件记录各版本的重要变更，格式参照 [Keep a Changelog](https://keepachangelog.com/zh-CN/1.1.0/)。基线版本号与正文一致；自评工具随基线一起发布。

All notable changes are recorded here, following [Keep a Changelog](https://keepachangelog.com/en/1.1.0/). The baseline version matches the standard; the self-assessment tool is released together with it.

## [Unreleased]

### 文档 / Documentation

- 架构图集源码归入 01-standard/diagrams/index.html，支持七语言直达链接；旧在线地址保留跳转。
  Place the gallery source in 01-standard/diagrams/index.html with direct links for seven languages, retaining a redirect from the previous online URL.

- 项目默认使用英文：主 README、工具、架构图集、公共首页和默认离线评估表；保留七语言版本和中文离线表。
  Default to English in the primary README, tool, architecture gallery, public homepage, and offline workbook, retaining all seven language editions and the Chinese workbook.

- 演示站、公共安全站与七语言 README 复用 Teloa 已定稿的小松鼠头像、安全岗位形象及表情素材；提示文案随语言切换，品牌素材权利单独说明。
  Reuse approved Teloa squirrel avatars, security-role artwork, and expressions in the demo, public security site, and seven README editions, with localized captions and separate brand-asset rights.

- 项目简介与页面署名统一使用 Teloa AI Security，Max Luo 作者信息保留在详细介绍与标准正文中；工具说明加入研究与开源计划介绍，首次访问默认英文并记忆手动语言选择。
  Use Teloa AI Security in project summaries and page attribution, retain Max Luo's authorship in detailed introductions and the standard, introduce the initiative in About, and default first visits to English while remembering manual language choices.
- 在线入口迁至公共安全站点的 `/agent-baseline-assessor/` 子目录，首页由独立组织站点维护。
  Move the online entry to `/agent-baseline-assessor/` under the public security site, whose homepage is maintained independently.

- 明确项目源于 Teloa 开发与安全设计，由 Max Luo 编写、Teloa AI Security 发起维护；区分安全目标、产品实现与自评结论。
  Clarify the project's origin in Teloa development and security design, Max Luo's authorship, Teloa AI Security's maintenance, and the distinction between goals, implementation, and assessment conclusions.
- 新增中英文设计思考，按提供的 HTML 布局补齐七种语言的技术栈与平台信任边界架构图；提供 PNG、可编辑 SVG、Mermaid 逻辑结构和可切换语言的 HTML 图集。
  Add Chinese and English design rationale and restore technology-stack and platform trust-boundary diagrams in all seven languages using the supplied HTML layout, with PNGs, editable SVGs, Mermaid logical structures, and a multilingual HTML gallery.
- 添加模拟评估数据及中英文成熟度报告、覆盖矩阵截图，用于文档中的评估示例。
  Add simulated assessment data and Chinese and English report and coverage-matrix screenshots for documentation examples.
- GitHub Pages 同时提供在线自评、七语言架构图集和模拟评估 JSON；文档入口指向可交互的在线图集。
  GitHub Pages serves the assessment tool, multilingual architecture gallery, and simulated assessment JSON; documentation links open the interactive gallery.
- 本次更新发布说明、配套文档与静态发布配置，v1.0 的 240 条要求、编号、等级和评分规则不变。
  These documentation and deployment updates do not change the 240 v1.0 requirements, their identifiers, levels, or scoring rules.

## [1.0] - 2026-10-07

### 基线 / Standard

- 首个正式版本：240 条要求，10 章 62 个小节，L1 90 条、L2 新增 137 条、L3 新增 13 条。
  First release: 240 requirements in 10 chapters and 62 sections; L1 90, L2 adds 137, L3 adds 13.
- 附录映射 OWASP Top 10 for Agentic Applications 2026、OWASP AISVS 1.0 和 CSA AICM v1.1。
  Annexes map to the OWASP Top 10 for Agentic Applications 2026, OWASP AISVS 1.0 and CSA AICM v1.1.
- 提供英语、日语、韩语、德语、法语、西班牙语译本，中文版为正本。
  Translations in English, Japanese, Korean, German, French and Spanish; the Chinese version is authoritative.

### 自评工具 / Self-assessment tool

- 覆盖矩阵、逐条评估、评估报告与图表，支持与上一次评估对比。
  Coverage matrix, requirement-by-requirement assessment, report and charts, with comparison against a previous assessment.
- 导入导出 JSON 与 Excel；离线 Excel 评估表带汇总公式和差距清单。
  JSON and Excel import and export; the offline workbook includes summary formulas and a gap list.
- 界面、报告和 Excel 支持七种语言。
  Interface, report and Excel output in seven languages.
- 纯静态页面，可在线、离线或私有化部署，附带内容安全策略和 nginx 配置。
  Static pages for online, offline or self-hosted use, with a content security policy and nginx configuration.
