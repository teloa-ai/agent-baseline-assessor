# 企业智能体身份与授权安全基线 · 自评工具

**简体中文** · [English](README.en.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Deutsch](README.de.md) · [Français](README.fr.md) · [Español](README.es.md)

本项目包含两部分：一份企业智能体身份与授权的安全标准，以及一个对照该标准做自评的静态工具。工具不需要后端，评估数据只保存在使用者自己的浏览器里。

## 目录

```
01-standard/   基线正文（Markdown）
02-usage/      自评步骤、部署方式、评分规则
03-tool/       静态自评页面、数据、Excel 模板、脚本和部署配置
.github/       GitHub Pages 自动发布工作流
```

## 阅读顺序

1. **[01 标准](01-standard/zh-CN/baseline-v1.0.md)**：《企业智能体身份与授权安全基线》v1.0。240 条要求，分 10 章、62 个小节，按 L1（底线）、L2（标准）、L3（增强）三级累积：L1 90 条，L2 在此基础上增加 137 条，L3 再增加 13 条。术语、参考架构、威胁模型和附录映射都在这份文件里。基线正文以中文版为准，其他语言版本为译本。
2. **[02 使用方法](02-usage/zh-CN/usage.md)**：怎样做自评，在线、离线、私有化三种用法，评分规则，发布到 GitHub Pages 或 Cloudflare Pages，以及数据保存方式。
3. **[03 工具](03-tool/docs/zh-CN.md)**：工具目录结构、常用命令，基线修订后如何更新工具，以及第三方组件。

## 快速开始

- 想直接自评：打开在线地址，或者解压 zip 后双击 `03-tool/index.html`。
- 想在 Excel 里填写：使用 `03-tool/offline/baseline-assessment.xlsx`。
- 想自己部署：见 [02 使用方法](02-usage/zh-CN/usage.md) 的发布章节。

## 许可

本仓库的许可证请在公开发布前确定。
