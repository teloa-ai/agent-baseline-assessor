# 安全策略 / Security Policy

[中文](#中文) · [English](#english)

## 中文

### 报告漏洞

如果你发现自评工具存在安全漏洞，例如跨站脚本、导入文件导致的代码执行、内容安全策略绕过、评估数据泄露，请通过 GitHub 的私密漏洞报告提交：在本仓库的 **Security** 页面点击 **Report a vulnerability**。请不要公开提 Issue。

报告中请写明受影响的版本或提交、复现步骤、影响范围，如有概念验证请一并附上。我们会在 7 天内确认收到，并在修复发布后致谢报告者（除非你希望匿名）。

### 范围

- 在范围内：`03-tool/` 下的页面、脚本、Excel 生成与解析、部署配置（`_headers`、`deploy/`、`.github/workflows/`）。
- 不在范围内：基线要求本身的缺漏或争议。这类意见请直接提 Issue，它们属于标准内容的讨论，不是漏洞。

### 支持的版本

只对最新版本提供安全修复。

## English

### Reporting a vulnerability

If you find a security vulnerability in the self-assessment tool, such as cross-site scripting, code execution through an imported file, a content security policy bypass, or leakage of assessment data, report it privately through GitHub: open this repository's **Security** tab and choose **Report a vulnerability**. Please do not open a public issue.

Include the affected version or commit, steps to reproduce, the impact, and a proof of concept if you have one. We will acknowledge the report within 7 days and credit the reporter once a fix is released, unless you prefer to remain anonymous.

### Scope

- In scope: the page, scripts, Excel generation and parsing, and deployment configuration under `03-tool/` (`_headers`, `deploy/`) and `.github/workflows/`.
- Out of scope: gaps in or disagreements with the requirements themselves. Please raise those as normal issues; they are discussions about the standard, not vulnerabilities.

### Supported versions

Security fixes are provided for the latest version only.
