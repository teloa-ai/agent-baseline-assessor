# 贡献指南 / Contributing

[中文](#中文) · [English](#english)

## 中文

感谢你愿意改进这份基线。本项目接受三类贡献：要求本身、译文和自评工具。

### 提出问题或建议

先在 Issue 里讨论，再提交修改。请使用对应的 Issue 模板，并写明：

- 涉及的要求编号和版本，如「V4.2.1（v1.0）」；新增要求写明建议放在哪一节。
- 这条要求要防住什么：对应的威胁或攻击路径，最好能对应到正文第 5 章的威胁清单。
- 怎样判定满足：评估人员看什么证据、做什么测试能给出确定的结论。

### 修改要求

要求的写法遵循正文 6.4 节：

- 每条要求用「应」，只规定一个可验证的结果；「应能」「应支持」表示只要求平台具备该能力。
- 新增要求追加在小节末尾；删除的编号不复用，允许跳号。
- 等级按 6.2 节判定：缺失即可被单个攻击者或内部用户直接利用、或导致无法追责的，定为 L1；需要组合条件或主要降低影响的，定为 L2；成本较高、面向高风险场景的，定为 L3。
- 修改中文正文后，同步更新其他语言译本，或在 PR 中注明需要译者跟进。

### 修改译文

- 中文版为正本，译文与中文不一致时以中文为准。
- 术语遵循 [`03-tool/i18n/glossary.md`](03-tool/i18n/glossary.md)；需要新增或调整术语时，在同一个 PR 里修改术语表并说明理由。
- 要求编号、等级标记、表格结构和链接不得改动。
- 工具界面里的要求文字来自 `03-tool/i18n/<语言>.json`，必须与该语言正文保持一致。

### 修改工具

在 `03-tool/` 下：

```bash
npm install
npm test               # 评分、Excel 往返、各语言词典完整性
npm run build:i18n     # 修改词典后重新生成 data/i18n.*.js
npm run check:xlsx     # 用 LibreOffice 重算各语言 Excel 公式（需要本机装有 LibreOffice）
npm run build:readme   # 基线数据变化后更新 README 的覆盖范围表
```

页面必须能在 `file://` 下运行，并满足 `_headers` 与 `deploy/nginx.conf` 中的内容安全策略：只用外部脚本，不写内联事件和 `eval`，不发起网络请求。

### 提交与许可

- 一个 PR 只做一件事，说明改了什么、为什么改。
- 提交即表示你同意：对基线正文和文档的贡献按 [CC BY 4.0](LICENSE-DOCS) 授权，对代码的贡献按 [Apache License 2.0](LICENSE) 授权。
- 参与本项目请遵守[行为准则](CODE_OF_CONDUCT.md)。

## English

Thank you for helping improve this baseline. The project accepts three kinds of contribution: the requirements themselves, translations, and the self-assessment tool.

### Raising an issue

Discuss in an issue before sending changes. Use the matching issue template and include:

- The requirement ID and version, e.g. "V4.2.1 (v1.0)". For a new requirement, say which section it belongs in.
- What the requirement protects against: the threat or attack path, ideally mapped to the threat list in chapter 5 of the standard.
- How conformance is judged: what evidence an assessor checks, or what test gives a definite result.

### Changing requirements

Requirements follow section 6.4 of the standard:

- Each requirement uses "shall" and states one verifiable outcome. "Shall be able to" and "shall support" only require the platform to have the capability.
- New requirements are appended at the end of their section. Removed IDs are never reused, so gaps in numbering are expected.
- Levels follow section 6.2: if its absence can be exploited directly by a single attacker or internal user, or makes accountability impossible, it is L1; if exploitation needs combined conditions or the control mainly reduces impact, it is L2; costly controls for high-risk settings are L3.
- When the Chinese text changes, update the translations as well, or note in the pull request that translators need to follow up.

### Changing translations

- The Chinese version is authoritative. Where a translation differs, the Chinese text prevails.
- Use the terms in [`03-tool/i18n/glossary.md`](03-tool/i18n/glossary.md). To add or change a term, edit the glossary in the same pull request and explain why.
- Do not change requirement IDs, level marks, table structure or links.
- Requirement text shown in the tool comes from `03-tool/i18n/<lang>.json` and must match the standard in that language.

### Changing the tool

In `03-tool/`:

```bash
npm install
npm test               # scoring, Excel round-trip, dictionary completeness for every language
npm run build:i18n     # regenerate data/i18n.*.js after editing a dictionary
npm run check:xlsx     # recalculate Excel formulas in every language with LibreOffice (requires LibreOffice)
npm run build:readme   # refresh the coverage tables in the READMEs after the baseline data changes
```

The page must run from `file://` and comply with the content security policy in `_headers` and `deploy/nginx.conf`: external scripts only, no inline event handlers or `eval`, and no network requests.

### Commits and licensing

- Keep each pull request to one change, and explain what changed and why.
- By contributing, you agree that contributions to the standard and documentation are licensed under [CC BY 4.0](LICENSE-DOCS), and contributions to the code under the [Apache License 2.0](LICENSE).
- Please follow the [code of conduct](CODE_OF_CONDUCT.md).
