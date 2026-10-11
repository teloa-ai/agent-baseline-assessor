# 架构图 / Architecture figures

两张图沿用提供的 HTML 设计的固定布局与视觉语义。[在线多语言图集](https://security.teloa.ai/agent-baseline-assessor/architecture.html)可切换语言并下载图片；[HTML 源码](../../%E6%99%BA%E8%83%BD%E4%BD%93%E5%AE%89%E5%85%A8%E5%9F%BA%E7%BA%BF%E6%9E%B6%E6%9E%84%E5%9B%BE.html)位于项目根目录，可在本地浏览器打开。

- `agent-stack`：Agent = 模型 + Harness，包含 Harness 六个子系统、可选框架、运行时和执行环境。
- `reference-architecture`：用户 → 交互渠道 → Harness → 策略决策点 → 出口网关 → 下游系统，以及模型、数据、执行环境、身份、管理与审计。

每种语言（`zh-CN`、`en`、`ja`、`ko`、`de`、`fr`、`es`）包含同名文件：

- `.png`：1600 像素宽的文档插图，固定字体与排版，可离线显示。
- `.svg`：可编辑矢量版本，文字、形状与连接线均保留；显示字体可能随本机字体略有差异。
- `.mmd`：Mermaid 逻辑结构，便于审阅组件关系。Mermaid 自动布局与 PNG/SVG 的固定布局不同。

更新时保持七种语言的组件、连线、信任边界和章节标记一致，并同步导出 PNG；逐一检查长文本换行、边界与箭头。图片属于说明性架构，不改变正文要求；中文版为正本，其他语言为译本。

Both figures use the supplied HTML design. Every language contains a PNG for documentation, an editable SVG, and a Mermaid logical structure. Mermaid uses automatic layout rather than reproducing the fixed PNG/SVG layout. Keep components, connections, trust boundaries, and chapter markers consistent across languages; update PNG exports with the vector sources and check text wrapping. Chinese is authoritative.
