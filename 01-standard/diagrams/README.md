# Architecture figures / 架构图

[Online gallery](https://security.teloa.ai/agent-baseline-assessor/01-standard/diagrams/) · [HTML source](index.html)

The gallery defaults to English and supports seven languages. Open index.html in a local browser or use the online links below. Both figures retain the supplied layout and visual semantics.

| Language | Gallery |
| --- | --- |
| English | [Open](https://security.teloa.ai/agent-baseline-assessor/01-standard/diagrams/?lang=en) |
| 简体中文 | [打开](https://security.teloa.ai/agent-baseline-assessor/01-standard/diagrams/?lang=zh-CN) |
| 日本語 | [開く](https://security.teloa.ai/agent-baseline-assessor/01-standard/diagrams/?lang=ja) |
| 한국어 | [열기](https://security.teloa.ai/agent-baseline-assessor/01-standard/diagrams/?lang=ko) |
| Deutsch | [Öffnen](https://security.teloa.ai/agent-baseline-assessor/01-standard/diagrams/?lang=de) |
| Français | [Ouvrir](https://security.teloa.ai/agent-baseline-assessor/01-standard/diagrams/?lang=fr) |
| Español | [Abrir](https://security.teloa.ai/agent-baseline-assessor/01-standard/diagrams/?lang=es) |

- **agent-stack**: Agent = model + Harness, showing the six Harness subsystems, optional framework, runtime, and execution environment.
- **reference-architecture**: user → interaction channel → Harness → policy decision point → egress gateway → downstream systems, together with the model, data, execution environment, identity, management, and audit.

Each language directory contains matching files:

- **PNG**: a 1600-pixel-wide illustration with fixed fonts and layout for documentation and offline use.
- **SVG**: editable text, shapes, and connections; fonts may vary slightly by device.
- **Mermaid (.mmd)**: the logical component structure. Its automatic layout differs from the fixed PNG/SVG layout.

Keep components, connections, trust boundaries, and chapter markers consistent across languages. Update PNG exports alongside vector sources and check text wrapping, boundaries, and arrows. The figures illustrate the architecture without changing the standard's requirements. The Chinese standard is authoritative.

图集源码与七种语言的 PNG、SVG、Mermaid 文件统一保存在本目录，默认英文。可以在网页切换语言，也可以使用上表的直达链接。更新时同步检查各语言的组件、连线、信任边界、章节标记和长文本排版。
