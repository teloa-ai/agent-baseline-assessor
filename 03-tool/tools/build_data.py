#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""从基线文档的 Markdown 导出生成 data/baseline.json 与 data/baseline.js。

用法：python3 tools/build_data.py <导出文件> [--version 1.0] [--date 2026-10-07]
导出文件可以是 Markdown，也可以是 Claude 文档导出接口返回的 JSON（含 bytes_b64）。
"""
import argparse, base64, json, re, sys, os
from collections import Counter, OrderedDict

sys.path.insert(0, os.path.dirname(__file__))
from component_map import COMPONENTS, CHECKPOINTS, component_of, check

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOC_URL = "https://github.com/teloa-ai/agent-baseline-assessor/blob/main/01-standard/{lang}/baseline-v1.0.md"


def load_markdown(path):
    raw = open(path, encoding="utf-8").read()
    if raw.lstrip().startswith("{"):
        j = json.loads(raw)
        def find(o):
            if isinstance(o, dict):
                if "bytes_b64" in o:
                    return o["bytes_b64"]
                for v in o.values():
                    r = find(v)
                    if r:
                        return r
            elif isinstance(o, list):
                for v in o:
                    r = find(v)
                    if r:
                        return r
        return base64.b64decode(find(j)).decode("utf-8")
    return raw


def clean(s):
    return re.sub(r"\s+", " ", s.replace("`", "").replace("\\", "")).strip()


BAD_ROWS = []


def parse(md):
    lines = md.splitlines()
    title = next((l[2:].strip() for l in lines if l.startswith("# ")), "")
    row = re.compile(r'^\|\s*(V\d+\.\d+\.\d+)\s*\|\s*(.+?)\s*\|\s*([✓√✔]?)\s*\|\s*([✓√✔]?)\s*\|\s*([✓√✔]?)\s*\|\s*$')
    loose = re.compile(r'^\|\s*(V\d+\.\d+\.\d+)\s*\|')
    chh = re.compile(r'^##\s+\d+、(V\d+)\s+(.+)$')
    sech = re.compile(r'^###\s+(V\d+\.\d+)\s+(.+)$')
    axis = re.compile(r'^\|\s*(行为之前|行为之中|行为之后|全周期)\s*\|\s*(V\d+)\s+[^|]+\|\s*(.+?)\s*\|\s*$')
    chapters, sections, reqs = OrderedDict(), OrderedDict(), []
    stage = {}
    ch = sec = None
    want_lead = False
    for l in lines:
        s = l.strip()
        m = axis.match(s)
        if m:
            stage[m.group(2)] = {"stage": m.group(1), "question": clean(m.group(3))}
            continue
        m = chh.match(s)
        if m:
            ch = m.group(1)
            chapters[ch] = {"id": ch, "name": clean(m.group(2)), "lead": ""}
            sec = None
            want_lead = True
            continue
        if s.startswith("## "):
            ch = sec = None
            want_lead = False
            continue
        m = sech.match(s)
        if m and ch:
            sec = m.group(1)
            sections[sec] = {"id": sec, "chapter": ch, "name": clean(m.group(2)), "applies": None}
            want_lead = False
            continue
        if want_lead and s and not s.startswith("|") and not s.startswith("#"):
            chapters[ch]["lead"] = clean(s)
            want_lead = False
            continue
        if sec and s.startswith("本节适用于"):
            sections[sec]["applies"] = clean(s.replace("本节适用于", "").rstrip("。"))
            continue
        m = row.match(s)
        if m and sec:
            l3 = [bool(m.group(i)) for i in (3, 4, 5)]
            level = 1 if l3[0] else (2 if l3[1] else (3 if l3[2] else None))
            pos = sum(1 for r in reqs if r["section"] == sec) + 1
            reqs.append({"id": m.group(1), "text": clean(m.group(2)), "level": level,
                         "section": sec, "chapter": ch, "component": component_of(sec, pos),
                         "_cum": l3})
            continue
        m = loose.match(s)
        if m and sec:
            BAD_ROWS.append(m.group(1))
    for c in chapters.values():
        c.update(stage.get(c["id"], {"stage": "", "question": ""}))
    return title, chapters, sections, reqs


def validate(chapters, sections, reqs):
    errs = []
    ids = [r["id"] for r in reqs]
    for i, n in Counter(ids).items():
        if n > 1:
            errs.append(f"重复编号 {i}")
    errs += [f"表格行无法解析（列数或勾选符号不对） {i}" for i in BAD_ROWS]
    for r in reqs:
        a, b, c = r.pop("_cum")
        if r["level"] is None:
            errs.append(f"没有勾选任何等级 {r['id']}")
        elif (a and not (b and c)) or (b and not c):
            errs.append(f"等级不累积 {r['id']}")
        if r["component"] is None:
            errs.append(f"缺少落点组件映射 {r['id']}（在 tools/component_map.py 的 BY_SECTION 中补上）")
        if not r["id"].startswith(r["section"] + "."):
            errs.append(f"编号与小节不符 {r['id']}")
    by = {}
    for r in reqs:
        by.setdefault(r["section"], []).append(int(r["id"].split(".")[-1]))
    for s, v in by.items():
        # 6.4：条目删除后编号不复用，所以允许跳号，但必须递增且不重复
        if v != sorted(set(v)):
            errs.append(f"编号顺序不对 {s}: {v}")
    for s in sections:
        if s not in by:
            errs.append(f"小节没有要求 {s}")
    cm_errs, extra = check([{"sec": [r["section"]]} for r in reqs])
    errs += [f"组件映射条数不符 {e}" for e in cm_errs] + [f"组件映射多余小节 {e}" for e in extra]
    return errs


def drift(md):
    """把 component_map.py 中手写的组件表、检查点和文档 4.2、4.3 的表格对一遍，不一致只提示、不报错"""
    warns, part = [], None
    doc_comp, doc_cp = {}, {}
    for l in md.splitlines():
        s = l.strip()
        if s.startswith("### "):
            part = "4.2" if s.startswith("### 4.2") else ("4.3" if s.startswith("### 4.3") else None)
            continue
        if not s.startswith("|") or s.startswith("| ---"):
            continue
        cells = [clean(c) for c in s.strip("|").split("|")]
        if part == "4.2" and len(cells) == 4:
            doc_comp[cells[0]] = cells[2]
        if part == "4.3" and len(cells) == 5 and cells[0].isdigit():
            doc_cp[int(cells[0])] = cells[1:]
    for name, duty, trust in COMPONENTS:
        if name in doc_comp and doc_comp[name] != trust:
            warns.append(f"组件「{name}」的信任假设与文档 4.2 不一致：{trust} ≠ {doc_comp[name]}")
    for step, name, what, comps, refs in CHECKPOINTS:
        d = doc_cp.get(step)
        if d and d != [name, what, comps, refs]:
            warns.append(f"检查点 {step} 与文档 4.3 不一致：{[name, what, comps, refs]} ≠ {d}")
    return warns


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("source")
    ap.add_argument("--version", default="1.0")
    ap.add_argument("--date", default="2026-10-07")
    a = ap.parse_args()
    md = load_markdown(a.source)
    title, chapters, sections, reqs = parse(md)
    errs = validate(chapters, sections, reqs)
    for w in drift(md):
        print("提示：" + w)
    if errs:
        print("\n".join(errs))
        sys.exit(1)
    counts = Counter(r["level"] for r in reqs)
    data = {
        "schema": "baseline/1",
        "title": title,
        "titleEn": "Enterprise Agent Identity and Authorization Security Baseline",
        "version": a.version,
        "date": a.date,
        "docUrl": DOC_URL,
        "levels": [
            {"id": 1, "name": "L1", "label": "底线", "desc": "缺失会直接造成越权、凭证泄露或无法追责"},
            {"id": 2, "name": "L2", "label": "标准", "desc": "主流企业安全评审会要求的能力"},
            {"id": 3, "name": "L3", "label": "增强", "desc": "纵深防御和精细治理"},
        ],
        "chapters": list(chapters.values()),
        "sections": list(sections.values()),
        "components": [{"name": n, "duty": d, "trust": t} for n, d, t in COMPONENTS],
        "checkpoints": [{"step": s, "name": n, "what": w, "components": c, "refs": r} for s, n, w, c, r in CHECKPOINTS],
        "requirements": reqs,
        "counts": {"total": len(reqs), "sections": len(sections), "L1": counts[1], "L2": counts[2], "L3": counts[3]},
    }
    os.makedirs(os.path.join(ROOT, "data"), exist_ok=True)
    js = json.dumps(data, ensure_ascii=False, indent=1)
    open(os.path.join(ROOT, "data", "baseline.json"), "w", encoding="utf-8").write(js + "\n")
    open(os.path.join(ROOT, "data", "baseline.js"), "w", encoding="utf-8").write(
        "/* 由 tools/build_data.py 生成，请勿手改 */\nwindow.BASELINE = " + js + ";\n")
    print(f"{title} v{a.version}: {len(chapters)} 章 {len(sections)} 小节 {len(reqs)} 条 "
          f"(L1 {counts[1]} / L2 {counts[2]} / L3 {counts[3]})")


if __name__ == "__main__":
    main()
