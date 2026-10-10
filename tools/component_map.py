# -*- coding: utf-8 -*-
# 每条要求的落点组件（与基线文档 4.2 平台参考架构一致，顺序同 4.2 组件表）
# 落点组件 = 主要负责实现或强制执行该要求的组件；需要多个组件配合时取最主要的一个

COMPONENTS = [
    ("身份层", "企业 IdP、目录、SCIM，签发用户、Agent 和工作负载身份", "可信"),
    ("交互渠道", "Web、IM、邮件、IDE、API 等入口，负责身份映射和输出的可见范围", "可信；经渠道进入的内容不可信"),
    ("Harness", "Agent 循环、上下文管理、工具层、安全控制、编排、扩展接口", "平台托管时可信；在员工终端运行时不可信，按 V5.4"),
    ("策略决策点", "计算有效权限、判定风险等级、决定是否审批", "可信"),
    ("出口网关", "统一出口，注入凭证、校验目标、限流、吊销；凭证库归属于此", "可信"),
    ("下游系统", "被访问的 SaaS、内部 API、MCP Server、数据库", "自行作出授权判定；返回内容不可信"),
    ("数据层", "知识库、RAG、记忆、产出物", "可信；存储的内容可能被污染，按不可信内容处理"),
    ("执行环境", "执行代码、命令、文件和浏览器操作", "不可信，可能被攻陷"),
    ("管理面", "Agent 登记、连接器、托管策略、生命周期", "可信"),
    ("审计", "记录、调阅、导出与留存，以及检测与响应", "可信"),
]

AB = {"ID": "身份层", "CH": "交互渠道", "HN": "Harness", "PDP": "策略决策点", "GW": "出口网关",
      "EE": "执行环境", "DL": "数据层", "MP": "管理面", "AU": "审计", "DS": "下游系统"}

BY_SECTION = {
    "V1.1": "ID ID ID ID",
    "V1.2": "CH CH CH CH CH CH",
    "V1.3": "ID ID DS ID ID",
    "V1.4": "ID HN GW ID ID",
    "V1.5": "ID PDP AU",
    "V2.1": "GW GW ID",
    "V2.2": "PDP PDP PDP PDP PDP PDP",
    "V2.3": "PDP PDP HN MP MP PDP",
    "V2.4": "PDP HN PDP PDP PDP ID ID",
    "V2.5": "PDP AU PDP",
    "V2.6": "CH MP AU",
    "V3.1": "PDP PDP PDP PDP",
    "V3.2": "HN HN HN HN PDP",
    "V3.3": "HN HN",
    "V3.4": "HN HN HN HN HN PDP",
    "V3.5": "ID PDP",
    "V3.6": "MP PDP",
    "V3.7": "HN MP",
    "V3.8": "GW GW HN HN",
    "V4.1": "GW GW GW GW GW GW HN",
    "V4.2": "GW EE DS EE MP",
    "V4.3": "GW GW ID",
    "V4.4": "GW GW GW MP",
    "V4.5": "GW DS EE ID DS HN",
    "V4.6": "ID GW ID",
    "V4.7": "GW GW GW GW GW",
    "V5.1": "EE EE EE EE",
    "V5.2": "EE ID HN EE",
    "V5.3": "EE HN GW EE HN",
    "V5.4": "EE EE HN GW",
    "V5.5": "HN HN HN HN HN HN",
    "V5.6": "MP MP MP HN",
    "V6.1": "HN HN HN",
    "V6.2": "HN HN HN HN",
    "V6.3": "MP MP MP",
    "V6.4": "HN HN HN",
    "V7.1": "CH CH CH CH",
    "V7.2": "HN DL",
    "V7.3": "HN HN",
    "V7.4": "CH CH CH",
    "V7.5": "CH CH CH GW",
    "V7.6": "GW HN GW",
    "V8.1": "DL DL DL",
    "V8.2": "GW GW GW",
    "V8.3": "DL DL DL",
    "V8.4": "DL DL HN DL",
    "V8.5": "DL DL PDP",
    "V8.6": "DL CH DL MP",
    "V8.7": "HN HN",
    "V9.1": "MP MP MP MP",
    "V9.2": "MP MP AU",
    "V9.3": "MP MP MP MP MP MP",
    "V9.4": "MP MP MP",
    "V9.5": "ID MP MP",
    "V9.6": "MP PDP MP",
    "V9.7": "MP AU MP MP",
    "V10.1": "AU AU AU AU AU AU",
    "V10.2": "AU AU AU AU",
    "V10.3": "AU AU AU",
    "V10.4": "PDP PDP MP PDP MP",
    "V10.5": "MP MP",
    "V10.6": "AU AU HN",
}

# 4.3 一次工具调用的检查点（与文档一致）
CHECKPOINTS = [
    (1, "入口认证", "渠道账号映射到企业身份", "交互渠道、身份层", "V1.1、V1.2"),
    (2, "建立会话", "签发工作负载身份，确定用户和 Agent", "Harness、身份层", "V1.4"),
    (3, "组装上下文", "按有效权限过滤工具清单、记忆和检索结果", "Harness、数据层", "V3.3、V8.1、V8.3"),
    (4, "前置校验", "执行前做策略检查和风险分级", "Harness、策略决策点", "V2.2、V3.1、V3.2"),
    (5, "人工确认", "按真实参数生成审批，必要时二次认证", "Harness、身份层", "V3.4、V3.5"),
    (6, "出口执行", "经网关注入凭证、校验目标、限流", "出口网关", "V4.1、V4.2、V3.8"),
    (7, "下游授权判定", "下游按代表用户访问时传递的用户身份作出授权判定", "下游系统", "V2.1、V4.3、V4.4"),
    (8, "处理返回", "返回内容按不可信处理并标记来源", "Harness", "V6.1、V6.2"),
    (9, "输出检查", "检查接收方、敏感数据和渲染风险", "交互渠道、出口网关", "V7.1、V7.4、V7.5"),
    (10, "全程记录", "每一步写入审计，可追溯到人、Agent 和输入来源", "审计", "V10.1"),
]


def component_of(sec, pos):
    """小节内第 pos 条（按表格中的先后顺序，从 1 开始）的落点组件；没有映射时返回 None"""
    codes = BY_SECTION.get(sec, "").split()
    return AB[codes[pos - 1]] if 0 < pos <= len(codes) else None


def check(reqs):
    from collections import Counter
    secs = Counter(r["sec"][0] for r in reqs)
    errs = [(s, c, len(BY_SECTION.get(s, "").split())) for s, c in secs.items() if len(BY_SECTION.get(s, "").split()) != c]
    extra = set(BY_SECTION) - set(secs)
    return errs, extra
