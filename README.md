# 企业智能体身份与授权安全基线

源于 Teloa 开发实践的开放安全基线与自评工具

**简体中文** · [English](README.en.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Deutsch](README.de.md) · [Français](README.fr.md) · [Español](README.es.md)

![版本 v1.0](https://img.shields.io/badge/version-v1.0-2a78d6) ![要求 240 条](https://img.shields.io/badge/requirements-240-2a78d6) ![语言 7 种](https://img.shields.io/badge/languages-7-2a78d6) ![标准许可 CC BY 4.0](https://img.shields.io/badge/standard-CC%20BY%204.0-555) ![代码许可 Apache-2.0](https://img.shields.io/badge/code-Apache--2.0-555)

《企业智能体身份与授权安全基线》规定企业环境中的 AI 智能体在身份与授权上应满足的安全要求。它回答一次智能体行为背后的几个基本问题：谁在发起，代表谁，能做什么，凭证从哪里来，结果给谁看，出了问题怎么追责。

本仓库包含基线正文和配套的自评工具。正文可以直接用作平台建设的设计输入、供应商评估的问卷或安全评审的核对清单。自评工具是一个纯静态页面，逐条记录评估结果，生成成熟度报告和 Excel 评估表，数据只保存在使用者自己的浏览器里。

作者：Max（[GitHub @cybermaxluo](https://github.com/cybermaxluo)）

发起与维护：[Teloa](https://github.com/teloa-ai)

## 项目缘起与定位

本项目由 Max 在 [Teloa](https://github.com/teloa-ai/teloa) 开发与安全设计过程中整理。它从 AI 同事的工具授权、人工审批、凭据管理、执行隔离与协作数据可见性等问题出发，结合公开规范，归纳面向企业智能体平台的可验证要求。基线面向各类平台开放使用与评审，不依赖 Teloa 的具体实现。

本基线描述安全设计与评估的目标；各产品是否满足要求，应按具体版本、部署范围和证据逐条判定。自评结果不构成独立认证，引用和映射 OWASP、NIST、CSA 等资料不代表这些组织的背书。

[设计思考](04-design/zh-CN/design-rationale.md)记录代表性问题、设计取舍、对应要求和核验方法，与规定要求的基线正文分开维护。

## 概览

| 项目 | 内容 |
| --- | --- |
| 版本 | v1.0（2026-10-07） |
| 要求 | 240 条，10 章 62 个小节，每条可单独验证 |
| 等级 | L1 底线 90 条；L2 标准在此基础上增加 137 条；L3 增强再增加 13 条 |
| 体例 | 参照 OWASP ASVS 5.0，编号格式为「V章.节.条」，如 V4.2.1 |
| 映射 | OWASP Top 10 for Agentic Applications 2026、OWASP AISVS 1.0、CSA AICM v1.1 |
| 语言 | 简体中文（正本）、English、日本語、한국어、Deutsch、Français、Español |
| 许可 | 正文与文档 CC BY 4.0，代码 Apache-2.0 |

## 评估示例

下面是工具使用模拟数据生成的报告，不对应 Teloa 或任何真实平台。示例当前达到 L1、目标为 L2：227 条适用要求中满足 180 条，满足率约 79%，距 L2 还差 47 条，其中 10 条未评估。

![模拟评估报告：成熟度阶梯、满足率、差距与章节图表](02-usage/assets/maturity-report.zh-CN.png)

查看[覆盖矩阵与示例操作](02-usage/zh-CN/usage.md#评估示例)，或下载[示例评估 JSON](02-usage/examples/demo-assessment.json)后在工具的「数据」页导入。

## 覆盖范围

V1 至 V7 按一次智能体行为的发生顺序排列，V8 至 V10 覆盖跨会话持续存在的数据、Agent 和审计。

<!-- coverage:start -->
| 章 | 名称 | 回答的问题 | L1 | L2 新增 | L3 新增 | 合计 |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| V1 | 身份与认证 | 谁在发起，哪个 Agent 在执行 | 11 | 11 | 1 | 23 |
| V2 | 委托与有效权限 | 代表谁，权限上限是多少 | 11 | 14 | 3 | 28 |
| V3 | 授权决策 | 这一次操作能不能做，要不要人确认 | 9 | 16 | 2 | 27 |
| V4 | 凭证与出口执行 | 请求怎么出去，凭证怎么注入 | 14 | 18 | 1 | 33 |
| V5 | 执行隔离 | 代码、命令、浏览器和扩展在什么边界内运行 | 16 | 11 | 0 | 27 |
| V6 | 上下文与不可信输入 | 读进来的内容能不能影响决策 | 4 | 8 | 1 | 13 |
| V7 | 输出与可见性 | 结果给谁看，会不会外泄 | 6 | 12 | 0 | 18 |
| V8 | 数据、记忆与产出物 | 数据怎么检索、沉淀和留存 | 5 | 16 | 1 | 22 |
| V9 | 生命周期与治理 | 谁管 Agent，从登记到下线 | 9 | 16 | 1 | 26 |
| V10 | 审计、检测与响应 | 怎么记录、发现和止损 | 5 | 15 | 3 | 23 |
| | **合计** | | **90** | **137** | **13** | **240** |
<!-- coverage:end -->

## 等级

等级逐级累积，达到某一级要求该级及以下的全部适用要求都已满足。

- **L1 底线**：缺失会直接造成越权、凭证泄露或无法追责。任何在企业内使用的智能体平台都应满足。
- **L2 标准**：主流企业安全评审会要求的能力，适用于处理内部数据、接入多个业务系统的平台。
- **L3 增强**：纵深防御和精细治理，适用于金融、医疗、关键基础设施等高监管行业，或处理高敏感数据的平台。

平台不具备某项能力时（例如不支持 MCP），对应小节整节标为不适用，不计入满足率。判定规则见正文第 6 章。

## 快速开始

- **阅读基线**：[01-standard/zh-CN/baseline-v1.0.md](01-standard/zh-CN/baseline-v1.0.md)
- **在线自评**：打开本仓库发布的 [GitHub Pages](https://teloa-ai.github.io/agent-baseline-assessor/) 页面，右上角可切换语言。
- **离线自评**：下载仓库后双击 `03-tool/index.html`，功能与在线版相同，不需要联网。
- **用 Excel 填写**：使用 [`03-tool/offline/baseline-assessment.xlsx`](03-tool/offline/baseline-assessment.xlsx)，表内带汇总公式和差距清单，填完可导回网页。
- **私有化部署**：工具是纯静态文件，附带 nginx 安全配置和 Dockerfile，步骤见[使用方法](02-usage/zh-CN/usage.md)。

## 仓库结构

```
01-standard/<语言>/baseline-v1.0.md   基线正文
01-standard/diagrams/                 七种语言的架构图：PNG、SVG 和 Mermaid
02-usage/<语言>/usage.md              使用方法：自评步骤、评分规则、部署与数据保存
02-usage/examples/, assets/           模拟评估数据与报告截图
03-tool/                              自评工具：页面、数据、Excel 模板、脚本和部署配置
03-tool/docs/<语言>.md                工具维护说明
04-design/zh-CN/, en/                 中英文设计思考
智能体安全基线架构图.html             智能体安全基线架构图
.github/                              GitHub Pages 发布工作流、Issue 与 PR 模板
```

## 文档

| 文档 | 内容 |
| --- | --- |
| [基线正文](01-standard/zh-CN/baseline-v1.0.md) | 范围、术语、参考架构、威胁模型、等级规则、240 条要求和映射附录 |
| [使用方法](02-usage/zh-CN/usage.md) | 在线、离线、私有化三种用法，评分规则，发布到 GitHub Pages 或 Cloudflare Pages |
| [工具说明](03-tool/docs/zh-CN.md) | 目录结构、常用命令、基线修订后的更新流程、多语言维护 |
| [设计思考](04-design/zh-CN/design-rationale.md) | Teloa 开发中的代表性安全问题、设计取舍、要求映射与核验方法 |
| [智能体安全基线架构图](https://teloa-ai.github.io/agent-baseline-assessor/architecture.html?lang=zh-CN) | 技术栈分层 · 平台参考架构 · PNG / SVG / Mermaid |
| [术语表](03-tool/i18n/glossary.md) | 七种语言的术语对照 |
| [变更记录](CHANGELOG.md) | 各版本的变更 |

基线正文以中文版为准，其他语言版本为译本。译文尚未经过各语言母语专家的完整审校，发现问题欢迎反馈。

## 参与贡献

欢迎对要求本身、译文和工具提出意见。提交前请先阅读[贡献指南](CONTRIBUTING.md)：修改要求需要说明对应的威胁和可验证的判定方式，修改译文遵循术语表，修改工具需要通过自检。

参与本项目即表示同意遵守[行为准则](CODE_OF_CONDUCT.md)。

## 安全问题

自评工具的安全漏洞请按[安全策略](SECURITY.md)私下报告，不要公开提 Issue。对基线要求本身的意见可以直接提 Issue。

## 引用

引用时请注明版本号，例如：

> Max. 企业智能体身份与授权安全基线（Enterprise Agent Identity and Authorization Security Baseline）v1.0, 2026.

引用具体要求时写出编号和版本，如「V4.2.1（v1.0）」。机器可读的引用信息见 [CITATION.cff](CITATION.cff)。

## 许可证

- 基线正文、使用方法和其他文档：[CC BY 4.0](LICENSE-DOCS)。可以复制、改编和商用，需署名并注明是否修改。
- 自评工具代码：[Apache License 2.0](LICENSE)。
- 第三方组件：ExcelJS 4.4.0（MIT），IBM Plex 字体（SIL OFL 1.1），许可文本随附于 `03-tool/vendor/`。
