# 企业智能体身份与授权安全基线 · 自评工具

对照《企业智能体身份与授权安全基线》v1.0 做自评的工具。它是一个纯静态页面，不需要后端，评估数据只保存在使用者自己的浏览器里。同一份文件可以放到 GitHub Pages 上在线使用，也可以下载后离线打开，或者部署到企业内网。

基线共 240 条要求，分 10 章、62 个小节，按 L1（底线）、L2（标准）、L3（增强）三级累积：L1 90 条，L2 在此基础上增加 137 条，L3 再增加 13 条。完整条文、术语、参考架构和威胁模型见[基线文档](https://claude.ai/code/artifact/a89875c9-b306-4067-b517-e3a093231b20)。

## 1、三种用法

### 1.1 在线

可以发布到 GitHub Pages 或 Cloudflare Pages，两者都有免费方案，步骤见第 7、8 节。Cloudflare Pages 会读取仓库根目录的 `_headers`，带上与 nginx 配置相同的安全响应头；GitHub Pages 不支持自定义响应头。

### 1.2 离线

有两种方式。

- **离线网页**：下载仓库 zip 并解压，双击 `index.html` 就能使用，功能和在线版完全一样。
- **离线 Excel**：直接填写 `offline/企业智能体身份与授权安全基线_评估表.xlsx`。表里带下拉选项、汇总公式和差距统计，填完可以导回网页继续评估。

### 1.3 私有化部署

页面是纯静态文件，任何静态文件服务器都能托管。仓库自带一份以非 root 身份运行的 nginx 镜像配置，内容安全策略禁止页面连接任何外部地址：

```bash
docker build -f deploy/Dockerfile -t agent-baseline-assessor .
docker run -d -p 8080:8080 --read-only --tmpfs /tmp agent-baseline-assessor
```

如果不用 Docker，把 `index.html`、`assets/`、`data/`、`vendor/`、`offline/` 复制到 Web 根目录即可。建议同时套用 `deploy/nginx.conf` 中的安全响应头；MIME 类型沿用 nginx 自带的 `mime.types`，不要在 server 块里另写 `types {}`，否则会覆盖整张表，页面会被当作文件下载。

## 2、功能

| 页面 | 能做什么 |
| --- | --- |
| 覆盖矩阵 | 顶部是当前达成等级和 L1、L2、L3 三级的达成情况。按章查看时每行一章、每格一个小节，格子底部的分段色条逐条显示状态；切到「组件 × 章」是一张热力表，看每个落点组件在每章的满足率。点开格子即可逐条评估 |
| 逐条评估 | 按章、组件、等级、状态和关键词筛选，标记状态，填写证据、负责人和计划完成时间。不适用的小节可以整节标记 |
| 评估报告 | 先给结论：成熟度阶梯、到下一级还差几条、目标内满足率、差距条目和评估进度，再列出优先处理的要求。图表包括满足率雷达（按章或按组件）、章节成熟度、差距分布，均可下载 PNG 或 SVG；另附按组件统计表和完整差距清单 |
| 数据 | 填写评估信息；导出 JSON 或 Excel；导入 JSON 或离线 Excel；载入上一次的结果做对比；清空当前评估 |

导出的 Excel 和离线模板结构相同，包含评估表、汇总（公式随状态实时计算，目标等级可下拉切换）、差距清单、架构视角和说明五页。

## 3、评分规则

- **满足率** = 已满足 ÷ 适用要求，只统计目标等级内的要求。部分满足和未评估都按未满足计。
- **达到某一级**：该级及以下的全部适用要求都已满足才算达到，少一条就停在下一级。
- **差距条目**：目标等级内、适用、但尚未满足的要求。
- **不适用**：平台不具备某项能力时（例如不支持 MCP），对应小节整节标为不适用，不计入满足率。

网页和 Excel 使用同一套规则。`npm test` 核对数据和 Excel 的读写往返；`npm run check:xlsx` 会用 LibreOffice 独立重算导出的 Excel 公式，再与网页的评分逐格比对（需要本机装有 LibreOffice）。在 Excel 里把状态清空或填了下拉以外的值，都按未评估计。

## 4、数据与隐私

- 评估数据保存在浏览器的本地存储（localStorage）里。页面不发起任何网络请求，也不包含统计或遥测代码。
- 本地存储按「源」隔离。GitHub Pages 的项目页共用 `<账号>.github.io` 这个源，同一账号下的其他页面能读到这份数据；Chrome 中通过 file:// 打开的本地网页也共用同一份存储。评估内容敏感时，请使用独立域名或私有化部署。
- 换电脑、清理浏览器或交给他人复核之前，请先在「数据」页导出 JSON。
- 导入文件时，只接受基线中存在的编号和已知的状态值，其他内容一律忽略。所有显示的文本都会先转义再渲染。

## 5、目录结构

```
index.html               页面入口
assets/
  app.js                 界面与交互
  score.js               评分规则（网页与 Node 共用）
  charts.js              雷达图、差距图、分布图（纯 SVG）
  workbook.js            Excel 生成与读取（网页与 Node 共用）
  styles.css
data/
  baseline.json          基线数据：章、小节、要求、等级、落点组件、检查点
  baseline.js            同一份数据，供离线双击打开时使用
vendor/exceljs.min.js    ExcelJS 4.4.0（MIT），仅在导入导出 Excel 时加载
vendor/fonts/            IBM Plex 拉丁字符子集（OFL），本地加载，不连外网
offline/                 离线 Excel 评估表
tools/                   数据与模板生成脚本、自检、Excel 公式交叉核对
deploy/                  nginx 配置与 Dockerfile
.github/workflows/       GitHub Pages 自动发布
```

## 6、更新基线

基线文档修订后，按以下三步更新：

1. 从基线文档导出 Markdown，运行 `python3 tools/build_data.py <导出文件> --version 1.1 --date 2026-12-01`，重新生成 `data/baseline.json` 和 `data/baseline.js`。脚本会检查编号重复、编号顺序、未勾选等级、等级不累积和缺少落点组件等问题；按 6.4，删除的编号不复用，所以允许跳号。它还会把手写的组件信任假设和检查点与文档 4.2、4.3 比对，不一致时给出提示。
2. 如果新增或调整了要求，同步修改 `tools/component_map.py` 中各小节的落点组件（按小节内的先后顺序逐条对应）。
3. 运行 `npm install` 和 `npm run build:xlsx`，重新生成离线评估表；再运行 `npm test` 做自检。

已有的评估 JSON 会按编号匹配到新版本，基线中不存在的编号在导入时会被忽略并给出提示。

## 7、发布到 GitHub Pages

1. 新建仓库，把本目录全部内容推送到 `main` 分支。
2. 在仓库 Settings → Pages → Build and deployment 中，将 Source 选为 **GitHub Actions**。
3. 之后每次推送到 `main`，`.github/workflows/pages.yml` 都会重新生成离线评估表、运行自检，再只发布页面所需的文件。构建作业只有读权限，安装依赖时不执行安装脚本；发布作业不运行任何第三方代码。

GitHub 免费账户只能为公开仓库开启 Pages。如果基线暂不公开，可以使用私有化部署，或者使用支持私有 Pages 的 GitHub 企业版。

## 8、发布到 Cloudflare Pages

任选一种方式。

- **连接 GitHub 仓库**：Cloudflare 控制台 → Workers & Pages → 创建 → Pages → 连接 Git，选中本仓库。构建命令填 `mkdir -p _site && cp -r index.html _headers assets data vendor offline _site/`，输出目录填 `_site`。之后每次推送都会自动发布。
- **命令行直接上传**，不需要连 Git：先运行上面的构建命令，再运行 `npx wrangler pages deploy _site --project-name agent-baseline-assessor`。

发布后的地址是 `https://<项目名>.pages.dev`，也可以绑定自己的域名。只想让公司内部访问时，可以再套一层 Cloudflare Access，要求先用企业邮箱或 IdP 登录。

## 9、第三方组件

- [ExcelJS](https://github.com/exceljs/exceljs) 4.4.0，MIT 许可，许可文本见 `vendor/exceljs.LICENSE`。
- [IBM Plex Sans / Mono](https://github.com/IBM/plex) 拉丁字符子集，SIL Open Font License 1.1，许可文本见 `vendor/fonts/OFL.txt`。中文使用系统字体（苹方、微软雅黑或思源黑体）。

本仓库的许可证请在公开发布前确定。
