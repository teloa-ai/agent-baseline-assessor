/* 自评工具主程序。纯前端：评估数据只保存在本浏览器，不向任何服务器发送。 */
(function () {
  'use strict';

  var B = window.BASELINE, S = window.Score, CH = window.Charts, WB = window.Workbook;
  var REQ = B.requirements;
  var BYID = Object.create(null), SEC = Object.create(null), CHAP = Object.create(null);
  REQ.forEach(function (q) { BYID[q.id] = q; });
  B.sections.forEach(function (s) { SEC[s.id] = s; });
  B.chapters.forEach(function (c) { CHAP[c.id] = c; });
  var SECREQ = S.groupBy(REQ, 'section'), CHREQ = S.groupBy(REQ, 'chapter'), COMPREQ = S.groupBy(REQ, 'component');
  var KEY = { a: 'aiab.assessment.v1', c: 'aiab.compare.v1', u: 'aiab.ui.v1' };
  var SCHEMA = 'agent-identity-baseline-assessment/1';
  var LEVEL_LABEL = { 1: '底线', 2: '标准', 3: '增强' };
  var BTNS = [
    { code: 'met', label: '已满足', cls: 'met' },
    { code: 'partial', label: '部分满足', cls: 'partial' },
    { code: 'unmet', label: '未满足', cls: 'unmet' },
    { code: 'na', label: '不适用', cls: 'na' }
  ];
  var DOTCLS = { met: 'met', partial: 'partial', unmet: 'unmet', na: 'na', '': 'none' };
  var ICON = {
    cond: '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M1.5 2h9L7 6.2V10L5 9V6.2z" fill="none" stroke="currentColor" stroke-width="1.2" stroke-linejoin="round"/></svg>',
    check: '<svg viewBox="0 0 12 12" aria-hidden="true"><path d="M2.5 6.3l2.2 2.2 4.8-5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>',
    down: '<svg viewBox="0 0 14 14" aria-hidden="true"><path d="M7 2v7m0 0L4 6m3 3l3-3M2.5 11.5h9" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round"/></svg>'
  };

  /* ---------- 工具 ---------- */
  function $(s, el) { return (el || document).querySelector(s); }
  function $$(s, el) { return Array.prototype.slice.call((el || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; });
  }
  function pct(v) { return v == null ? '—' : Math.round(v * 100) + '%'; }
  function today() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
  }
  var store = {
    get: function (k) { try { var v = localStorage.getItem(k); return v ? JSON.parse(v) : null; } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, JSON.stringify(v)); return true; } catch (e) { return false; } },
    del: function (k) { try { localStorage.removeItem(k); } catch (e) { /* 忽略 */ } }
  };

  function blank() {
    return { schema: SCHEMA, baseline: { title: B.title, version: B.version }, meta: { org: '', scope: '', assessor: '', date: today() }, target: 2, items: {}, updatedAt: new Date().toISOString() };
  }
  function str(v, max) { return typeof v === 'string' ? v.trim().slice(0, max) : ''; }
  /* 清洗外部数据：只认基线里存在的编号和已知状态 */
  function cleanItems(raw) {
    var out = Object.create(null), unknown = [], bad = [];
    if (!raw || typeof raw !== 'object') return { items: out, unknown: unknown, bad: bad };
    Object.keys(raw).forEach(function (id) {
      var v = raw[id];
      if (!BYID[id]) { unknown.push(id); return; }
      if (!v || typeof v !== 'object') return;
      var st = typeof v.status === 'string' ? v.status : '';
      if (Object.prototype.hasOwnProperty.call(S.CODE, st)) st = S.CODE[st];
      if (!Object.prototype.hasOwnProperty.call(S.LABEL, st)) { if (st) bad.push(id); st = ''; }
      var it = { status: st };
      var ev = str(v.evidence, 4000), ow = str(v.owner, 80), du = str(v.due, 20);
      if (ev) it.evidence = ev;
      if (ow) it.owner = ow;
      if (du) it.due = du;
      if (st || ev || ow || du) out[id] = it;
    });
    return { items: out, unknown: unknown, bad: bad };
  }
  function cleanMeta(m) {
    m = m && typeof m === 'object' ? m : {};
    return { org: str(m.org, 120), scope: str(m.scope, 300), assessor: str(m.assessor, 80), date: str(m.date, 20) };
  }
  function fromObject(o) {
    if (!o || typeof o !== 'object' || !o.items) throw new Error('文件里没有评估数据');
    var c = cleanItems(o.items);
    var t = [1, 2, 3].indexOf(+o.target) >= 0 ? +o.target : null;
    return { items: c.items, meta: cleanMeta(o.meta), target: t, unknown: c.unknown, bad: c.bad, version: o.baseline && o.baseline.version };
  }

  var DROPPED = 0;   // 基线修订后，本地保存的评估里已不存在的编号
  var A = (function () {
    var s = store.get(KEY.a);
    if (!s) return blank();
    try { var f = fromObject(s); DROPPED = f.unknown.length; var a = blank(); a.items = f.items; a.meta = Object.assign(a.meta, f.meta); a.target = f.target || 2; a.updatedAt = s.updatedAt || a.updatedAt; return a; } catch (e) { return blank(); }
  })();
  var CMP = (function () {
    var c = store.get(KEY.c);
    if (!c || !c.items) return null;
    return { label: str(c.label, 80) || '对比', items: cleanItems(c.items).items, meta: cleanMeta(c.meta), at: c.at };
  })();
  var UI = Object.assign({ view: 'chapter', radar: 'ch', inTargetOnly: false, q: '', fch: '', fcomp: '', flv: '', fst: '', inTarget: true }, store.get(KEY.u) || {});
  var saveTimer = null;
  function save(now) {
    A.updatedAt = new Date().toISOString();
    clearTimeout(saveTimer);
    var go = function () { saveTimer = null; if (!store.set(KEY.a, A)) toast('浏览器不允许本地保存，请定期导出 JSON 备份'); };
    if (now) go(); else saveTimer = setTimeout(go, 300);
  }
  function saveUI() { store.set(KEY.u, UI); }

  /* ---------- 下载：在 claude.ai 里走 downloads 能力，其他环境直接下载 ---------- */
  var dlPromise = (window.claude && typeof window.claude.use === 'function') ? window.claude.use('downloads').catch(function () { return null; }) : Promise.resolve(null);
  function saveFile(name, data, mime) {
    var blob = data instanceof Blob ? data : new Blob([data], { type: mime || 'application/octet-stream' });
    return dlPromise.then(function (dl) {
      if (dl) {
        return dl.save({ filename: name, data: blob }).then(function () { toast('已保存 ' + name); }, function (e) {
          if (e && e.code === 'declined') toast('已取消保存');
          else toast('这里无法保存文件（' + ((e && e.code) || '未知原因') + '）');
        });
      }
      var url = URL.createObjectURL(blob), a = document.createElement('a');
      a.href = url; a.download = name; a.rel = 'noopener';
      document.body.appendChild(a); a.click(); a.remove();
      setTimeout(function () { URL.revokeObjectURL(url); }, 4000);
      toast('已下载 ' + name);
    });
  }
  function fileBase() {
    var org = (A.meta.org || '').replace(/[\\/:*?"<>|\s]+/g, '_').slice(0, 40);
    return (org ? org + '_' : '') + '智能体安全基线自评_' + (A.meta.date || today());
  }

  var excelPromise = null;
  function loadExcel() {
    if (window.ExcelJS) return Promise.resolve(window.ExcelJS);
    if (!excelPromise) {
      excelPromise = new Promise(function (resolve, reject) {
        var s = document.createElement('script');
        s.src = 'vendor/exceljs.min.js';
        s.onload = function () { window.ExcelJS ? resolve(window.ExcelJS) : reject(new Error('ExcelJS 未就绪')); };
        s.onerror = function () { excelPromise = null; reject(new Error('Excel 组件加载失败')); };
        document.head.appendChild(s);
      });
    }
    return excelPromise;
  }

  /* ---------- 提示与轻提示 ---------- */
  var toastTimer = null;
  function toast(msg, actLabel, act) {
    var t = $('#toast');
    t.innerHTML = '<span>' + esc(msg) + '</span>' + (actLabel ? '<button type="button" id="toast-act">' + esc(actLabel) + '</button>' : '');
    t.hidden = false;
    if (actLabel) $('#toast-act').onclick = function () { t.hidden = true; act(); };
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { t.hidden = true; }, actLabel ? 8000 : 3200);
  }
  function showTip(el, x, y) {
    var tip = $('#tip');
    tip.textContent = el.getAttribute('data-tip');
    tip.hidden = false;
    var r = el.getBoundingClientRect();
    var px = x != null ? x : r.left + r.width / 2, py = y != null ? y : r.top;
    var w = tip.offsetWidth, h = tip.offsetHeight;
    tip.style.left = Math.max(8, Math.min(window.innerWidth - w - 8, px - w / 2)) + 'px';
    tip.style.top = (py - h - 12 < 8 ? py + 18 : py - h - 12) + 'px';
  }
  document.addEventListener('pointerover', function (e) { var el = e.target.closest && e.target.closest('[data-tip]'); if (el) showTip(el, e.clientX, e.clientY); });
  document.addEventListener('pointermove', function (e) { var el = e.target.closest && e.target.closest('[data-tip]'); if (el) showTip(el, e.clientX, e.clientY); });
  document.addEventListener('pointerout', function (e) { if (e.target.closest && e.target.closest('[data-tip]')) $('#tip').hidden = true; });
  document.addEventListener('focusin', function (e) { var el = e.target.closest && e.target.closest('[data-tip]'); if (el) showTip(el); });
  document.addEventListener('focusout', function () { $('#tip').hidden = true; });

  /* ---------- 共用的小部件 ---------- */
  function levelChip(n) { return '<span class="chip lvl' + (n >= A.target ? ' ok' : '') + '">' + esc(S.levelName(n)) + '</span>'; }
  function stackBar(st) {
    var parts = [['met', st.met], ['partial', st.partial], ['unmet', st.unmet], ['none', st.none], ['na', st.na]].filter(function (p) { return p[1] > 0; });
    return '<div class="stack" role="img" aria-label="已满足 ' + st.met + '，部分满足 ' + st.partial + '，未满足 ' + st.unmet + '，未评估 ' + st.none + '，不适用 ' + st.na + '">' +
      parts.map(function (p) { return '<i class="' + p[0] + '" style="flex:' + p[1] + '"></i>'; }).join('') + '</div>';
  }
  function legendStatus(withOut) {
    return '<div class="legend" aria-label="图例"><span><i class="sw met"></i>已满足</span><span><i class="sw partial"></i>部分满足</span><span><i class="sw unmet"></i>未满足</span><span><i class="sw none"></i>未评估</span><span><i class="sw na"></i>不适用</span>' +
      (withOut ? '<span><i class="sw out"></i>高于目标等级</span><span class="cond-key">' + ICON.cond + '按条件适用</span>' : '') + '</div>';
  }
  function levelStats() { return [1, 2, 3].map(function (L) { return { L: L, st: S.stats(REQ, A.items, L) }; }); }

  /* ---------- 顶栏 ---------- */
  function renderTop() {
    $('#who').textContent = A.meta.org || '';
    $('#who').title = A.meta.org || '';
    $$('#targetSeg button').forEach(function (b) { b.setAttribute('aria-pressed', String(+b.dataset.t === A.target)); });
  }

  /* ---------- 概览条（矩阵页顶部） ---------- */
  function overview() {
    var t = A.target, all = S.stats(REQ, A.items, t);
    var done = REQ.filter(function (q) { return S.statusOf(A.items, q.id); }).length;
    var html = '<div class="overview">';
    html += '<div class="ov"><div class="h"><b>当前达成</b>' + (all.achieved >= t ? '<span class="chip ok">已达目标</span>' : '<span class="chip">目标 L' + t + '</span>') + '</div>' +
      '<div class="big">' + esc(S.levelName(all.achieved)) + '</div>' +
      '<div class="s">目标内满足率 ' + pct(all.rate) + '，还差 ' + all.gap + ' 条 · 已评估 ' + done + '/' + REQ.length + '</div></div>';
    levelStats().forEach(function (x) {
      var st = x.st, ok = st.gap === 0;
      html += '<div class="ov"><div class="h"><b>L' + x.L + ' <span class="muted" style="font-weight:400">' + LEVEL_LABEL[x.L] + '</span></b>' +
        (ok ? '<span class="chip ok">' + ICON.check.replace('viewBox', 'width="11" height="11" viewBox') + '已达到</span>' : '<span class="chip">差 ' + st.gap + ' 条</span>') + '</div>' +
        '<div class="row"><span>已满足 <b class="num">' + st.met + '</b> / ' + st.applicable + ' 条适用</span><span class="num">' + pct(st.rate) + '</span></div>' +
        stackBar(st) +
        '<div class="s">部分满足 ' + st.partial + ' · 未满足 ' + st.unmet + ' · 未评估 ' + st.none + ' · 不适用 ' + st.na + '</div></div>';
    });
    return html + '</div>';
  }

  /* ---------- 覆盖矩阵 ---------- */
  function segs(reqs) {
    return '<span class="segs" aria-hidden="true">' + reqs.map(function (q) {
      var s = S.statusOf(A.items, q.id);
      return '<i class="' + (q.level > A.target ? 'out' : DOTCLS[s]) + '"></i>';
    }).join('') + '</span>';
  }
  function renderMatrix() {
    var t = A.target;
    var head = '<div class="page-head"><div class="t"><h2>覆盖矩阵</h2><div class="sub">' + esc(B.title) + ' v' + esc(B.version) + ' · 目标等级 L' + t + ' ' + LEVEL_LABEL[t] + '，范围内 ' + S.stats(REQ, A.items, t).inTarget + ' 条要求</div></div>' +
      '<div class="tools"><div class="seg" role="group" aria-label="视图"><button type="button" data-view="chapter" aria-pressed="' + (UI.view === 'chapter') + '">按章</button><button type="button" data-view="heat" aria-pressed="' + (UI.view === 'heat') + '">组件 × 章</button></div>' +
      '<label class="check"><input type="checkbox" id="inTargetOnly"' + (UI.inTargetOnly ? ' checked' : '') + '>只看目标等级内</label></div></div>';
    var body = UI.view === 'heat' ? heatTable() : chapterMatrix();
    $('#p-matrix').innerHTML = head + overview() +
      '<div class="toolbar">' + (UI.view === 'heat'
        ? '<div class="ramp"><span>满足率</span><span class="bar"><i style="background:var(--heat-1)"></i><i style="background:var(--heat-2)"></i><i style="background:var(--heat-3)"></i><i style="background:var(--heat-4)"></i><i style="background:var(--heat-5)"></i><i style="background:var(--heat-6)"></i></span><span>0% → 100%</span></div><span class="note">斜纹表示全部不适用或高于目标等级，横线表示该组件在这一章没有要求。点格子查看对应要求。</span>'
        : legendStatus(true) + '<span class="note spacer">每格一个小节，底部色条一段代表一条要求。点格子逐条评估。</span>') + '</div>' + body;
  }
  function chapterMatrix() {
    var t = A.target, rows = '';
    B.chapters.forEach(function (c) {
      var st = S.stats(CHREQ[c.id], A.items, t), cells = '';
      B.sections.filter(function (s) { return s.chapter === c.id; }).forEach(function (sec) {
        var rs = SECREQ[sec.id], ss = S.stats(rs, A.items, t);
        if (UI.inTargetOnly && !ss.inTarget) return;
        var out = !ss.inTarget, done = ss.applicable > 0 && ss.gap === 0;
        var frac = out ? '高于目标' : (ss.applicable ? ss.met + '/' + ss.applicable : '不适用');
        cells += '<button type="button" class="cell' + (out ? ' out' : '') + (done ? ' done' : '') + '" data-sec="' + sec.id + '" aria-label="' + esc(sec.id + ' ' + sec.name + '，' + frac) + '">' +
          '<span class="ch"><span class="code">' + sec.id + '</span>' + (sec.applies ? '<span data-tip="本节适用于' + esc(sec.applies) + '">' + ICON.cond + '</span>' : '') +
          '<span class="frac">' + (done ? ICON.check.replace('<svg', '<svg style="vertical-align:-1px;margin-right:3px"') : '') + frac + '</span></span>' +
          '<span class="nm">' + esc(sec.name) + '</span>' + segs(rs) + '</button>';
      });
      rows += '<div class="mx-row"><div class="mx-ch"><div class="l1"><span class="code">' + c.id + '</span><span class="stage">' + esc(c.stage) + '</span></div>' +
        '<h3>' + esc(c.name) + '</h3><div class="q">' + esc(c.question) + '</div>' +
        '<div class="m"><div class="meter"><i style="width:' + ((st.rate || 0) * 100).toFixed(1) + '%"></i></div><span class="pct">' + pct(st.rate) + '</span>' +
        '<span>满足 ' + st.met + '/' + st.applicable + '</span>' + levelChip(st.achieved) + '</div></div>' +
        '<div class="mx-cells">' + cells + '</div></div>';
    });
    return '<div class="mx">' + rows + '</div>';
  }
  function heatClass(rate) { return rate >= 1 ? 'h6' : rate >= 0.8 ? 'h5' : rate >= 0.6 ? 'h4' : rate >= 0.4 ? 'h3' : rate >= 0.2 ? 'h2' : ''; }
  function heatTable() {
    var t = A.target;
    var html = '<div class="heat-wrap"><table class="heat"><colgroup><col class="c-name">' + B.chapters.map(function () { return '<col>'; }).join('') + '<col class="c-tot"></colgroup><thead><tr><th scope="col">落点组件</th>' +
      B.chapters.map(function (c) { return '<th scope="col"><span class="code">' + c.id + '</span>' + esc(c.name) + '</th>'; }).join('') +
      '<th scope="col" style="text-align:right;padding-right:16px">合计</th></tr></thead><tbody>';
    B.components.forEach(function (cp) {
      var all = COMPREQ[cp.name] || [], tot = S.stats(all, A.items, t);
      html += '<tr><th scope="row">' + esc(cp.name) + '<small title="' + esc(cp.trust) + '">' + esc(cp.trust.split(/[，；]/)[0]) + '</small></th>';
      B.chapters.forEach(function (c) {
        var rs = all.filter(function (q) { return q.chapter === c.id; });
        if (UI.inTargetOnly) rs = rs.filter(function (q) { return q.level <= t; });
        if (!rs.length) { html += '<td><span class="hc void" aria-hidden="true">—</span></td>'; return; }
        var st = S.stats(rs, A.items, t), label = esc(cp.name + ' × ' + c.id + ' ' + c.name);
        if (!st.applicable) {
          html += '<td><button type="button" class="hc na" data-cc="' + esc(cp.name) + '|' + c.id + '" aria-label="' + label + '，' + (st.inTarget ? '全部不适用' : '高于目标等级') + '"><small>' + (st.inTarget ? '不适用' : '高于目标') + '</small></button></td>';
          return;
        }
        html += '<td><button type="button" class="hc ' + heatClass(st.rate) + '" data-cc="' + esc(cp.name) + '|' + c.id + '" data-tip="' + label + '：满足 ' + st.met + '/' + st.applicable + '，差 ' + st.gap + ' 条" aria-label="' + label + '，满足 ' + st.met + '/' + st.applicable + '"><b>' + st.met + '/' + st.applicable + '</b><small>' + pct(st.rate) + '</small></button></td>';
      });
      html += '<td class="tot"><b>' + pct(tot.rate) + '</b><small>差 ' + tot.gap + ' 条</small></td></tr>';
    });
    return html + '</tbody></table></div>';
  }

  /* ---------- 要求条目 ---------- */
  function reqRow(q, ctx) {
    var it = A.items[q.id] || {}, s = it.status || '', above = q.level > A.target;
    var has = !!(it.evidence || it.owner || it.due), pid = ctx + '-' + q.id.replace(/\./g, '_');
    return '<article class="req' + (above ? ' dim' : '') + '" data-id="' + q.id + '">' +
      '<div class="req-head"><span class="rid">' + q.id + '</span><span class="lv" title="最低等级">L' + q.level + '</span><span class="tag" title="落点组件">' + esc(q.component) + '</span>' +
      (above ? '<span class="tag">高于目标等级</span>' : '') + '</div>' +
      '<p class="req-text">' + esc(q.text) + '</p>' +
      '<div class="status" role="radiogroup" aria-label="' + q.id + ' 的状态">' +
      BTNS.map(function (b) {
        return '<button type="button" role="radio" aria-checked="' + (s === b.code) + '" data-set="' + b.code + '"><i class="dot ' + b.cls + '"></i>' + b.label + '</button>';
      }).join('') + '</div>' +
      '<details class="req-more"' + (has ? ' open' : '') + '><summary class="' + (has ? 'has-note' : '') + '">' + (has ? '证据与跟踪（已填写）' : '证据与跟踪') + '</summary>' +
      '<div class="grid"><label class="full" for="' + pid + '-ev">证据与说明<textarea id="' + pid + '-ev" data-f="evidence" rows="3" maxlength="4000" placeholder="例如：网关已按目标域名绑定凭证，配置见 …">' + esc(it.evidence || '') + '</textarea></label>' +
      '<label for="' + pid + '-ow">负责人<input type="text" id="' + pid + '-ow" data-f="owner" maxlength="80" value="' + esc(it.owner || '') + '"></label>' +
      '<label for="' + pid + '-du">计划完成<input type="text" id="' + pid + '-du" data-f="due" maxlength="20" placeholder="如 2026-12" value="' + esc(it.due || '') + '"></label></div></details>' +
      '</article>';
  }
  function setStatus(id, code) {
    var it = A.items[id] || {};
    it.status = it.status === code ? '' : code;
    if (it.status || it.evidence || it.owner || it.due) A.items[id] = it; else delete A.items[id];
    save();
    refreshRows([id]);
  }
  function setField(id, f, v) {
    var it = A.items[id] || { status: '' };
    v = v.slice(0, f === 'evidence' ? 4000 : (f === 'owner' ? 80 : 20));
    if (v.trim()) it[f] = v; else delete it[f];
    if (it.status || it.evidence || it.owner || it.due) A.items[id] = it; else delete A.items[id];
    save();
  }
  function refreshRows(ids) {
    ids.forEach(function (id) {
      $$('.req[data-id="' + id + '"]').forEach(function (el) {
        var ctx = el.closest('.drawer') ? 'd' : 'l';
        var open = $('details', el).open;
        var ae = document.activeElement;
        var refocus = ae && el.contains(ae) && ae.hasAttribute('data-set') ? ae.getAttribute('data-set') : null;
        var tmp = document.createElement('div');
        tmp.innerHTML = reqRow(BYID[id], ctx);
        var n = tmp.firstChild;
        if (open) $('details', n).open = true;
        el.replaceWith(n);
        if (refocus !== null) { var b = $('[data-set="' + refocus + '"]', n); if (b) b.focus({ preventScroll: true }); }
      });
    });
    renderTop();
    if (current === 'matrix') renderMatrix();
    if (current === 'items') updateItemsCount();
    if (drawer) renderDrawerHead();
  }

  /* ---------- 抽屉：一个小节，或一个组件在一章里的要求 ---------- */
  var drawer = null, lastFocus = null;
  function drawerReqs() {
    if (drawer.sec) return SECREQ[drawer.sec];
    return (COMPREQ[drawer.comp] || []).filter(function (q) { return q.chapter === drawer.ch && (!UI.inTargetOnly || q.level <= A.target); });
  }
  function openDrawer(spec, focusReq) {
    drawer = spec;
    lastFocus = document.activeElement;
    var root = $('#drawer-root');
    $$('header.app-bar, main').forEach(function (x) { x.inert = true; });
    root.innerHTML = '<div class="scrim" data-close></div><aside class="drawer" role="dialog" aria-modal="true" aria-labelledby="dr-title"><header id="dr-head"></header><div class="body" id="dr-body"></div></aside>';
    renderDrawerHead();
    $('#dr-body').innerHTML = drawerReqs().map(function (q) { return reqRow(q, 'd'); }).join('');
    var target = focusReq ? $('.req[data-id="' + focusReq + '"]', root) : null;
    if (target) { target.scrollIntoView({ block: 'center' }); $('[data-set]', target).focus({ preventScroll: true }); }
    else $('#dr-close').focus();
  }
  function renderDrawerHead() {
    var reqs = drawerReqs(), ss = S.stats(reqs, A.items, A.target), title, sub, extra = '';
    if (drawer.sec) {
      var sec = SEC[drawer.sec], c = CHAP[sec.chapter];
      title = sec.id + ' ' + esc(sec.name);
      sub = c.id + ' ' + esc(c.name);
      if (sec.applies) extra += '<div class="cond">本节适用于' + esc(sec.applies) + '。不具备该能力时整节记为不适用。</div>';
      extra += '<div class="actions"><button type="button" class="btn sm" data-secset="na">整节标为不适用</button><button type="button" class="btn sm ghost" data-secset="">清空本节状态</button></div>';
    } else {
      var ch = CHAP[drawer.ch];
      title = esc(drawer.comp) + ' · ' + ch.id + ' ' + esc(ch.name);
      sub = '落点为' + esc(drawer.comp) + '、属于 ' + ch.id + ' 的要求';
    }
    $('#dr-head').innerHTML = '<div class="row"><h2 id="dr-title">' + title + '</h2><button type="button" class="btn sm" id="dr-close" data-close aria-label="关闭">关闭</button></div>' +
      '<div class="note">' + sub + ' · 目标内满足 ' + ss.met + '/' + ss.applicable + ' · 达成 ' + esc(S.levelName(ss.achieved)) + '</div>' + stackBar(ss) + extra;
  }
  function closeDrawer() {
    drawer = null;
    $('#drawer-root').innerHTML = '';
    $$('header.app-bar, main').forEach(function (x) { x.inert = false; });
    if (current === 'items') renderItemsList();
    if (current === 'results') renderResults();
    var lf = lastFocus;
    if (lf && !lf.isConnected && lf.getAttribute) {
      ['data-sec', 'data-open-sec', 'data-open-req', 'data-cc'].some(function (k) {
        var v = lastFocus.getAttribute(k);
        if (v == null) return false;
        var m = document.querySelector('[' + k + '="' + (window.CSS && CSS.escape ? CSS.escape(v) : v) + '"]');
        if (m) lf = m;
        return !!m;
      });
    }
    if (lf && lf.isConnected) lf.focus({ preventScroll: true });
  }
  function setSection(secId, code) {
    var ids = SECREQ[secId].map(function (q) { return q.id; });
    ids.forEach(function (id) {
      var it = A.items[id] || {};
      it.status = code;
      if (it.status || it.evidence || it.owner || it.due) A.items[id] = it; else delete A.items[id];
    });
    save();
    refreshRows(ids);
  }

  /* ---------- 逐条评估 ---------- */
  function renderItems() {
    var opts = function (list, val) { return list.map(function (o) { return '<option value="' + esc(o[0]) + '"' + (o[0] === val ? ' selected' : '') + '>' + esc(o[1]) + '</option>'; }).join(''); };
    $('#p-items').innerHTML =
      '<div class="page-head"><div class="t"><h2>逐条评估</h2><div class="sub">标记状态，填写证据、负责人和计划完成时间。修改会自动保存在本浏览器。</div></div></div>' +
      '<div class="toolbar">' +
      '<label for="f-q" class="sr">搜索</label><input type="search" id="f-q" placeholder="搜索编号或要求内容" value="' + esc(UI.q) + '" style="min-width:240px">' +
      '<label for="f-ch" class="sr">章</label><select id="f-ch">' + opts([['', '全部章']].concat(B.chapters.map(function (c) { return [c.id, c.id + ' ' + c.name]; })), UI.fch) + '</select>' +
      '<label for="f-comp" class="sr">落点组件</label><select id="f-comp">' + opts([['', '全部组件']].concat(B.components.map(function (c) { return [c.name, c.name]; })), UI.fcomp) + '</select>' +
      '<label for="f-lv" class="sr">最低等级</label><select id="f-lv">' + opts([['', '全部等级'], ['1', 'L1'], ['2', 'L2'], ['3', 'L3']], UI.flv) + '</select>' +
      '<label for="f-st" class="sr">状态</label><select id="f-st">' + opts([['', '全部状态'], ['none', '未评估'], ['met', '已满足'], ['partial', '部分满足'], ['unmet', '未满足'], ['na', '不适用'], ['gap', '差距（目标内未满足）']], UI.fst) + '</select>' +
      '<label class="check"><input type="checkbox" id="f-in"' + (UI.inTarget ? ' checked' : '') + '>只看目标等级内</label>' +
      '<span class="count spacer" id="itemsCount"></span></div><div class="list" id="itemsList"></div>';
    renderItemsList();
  }
  function filtered() {
    var q = UI.q.trim().toLowerCase();
    return REQ.filter(function (r) {
      var s = S.statusOf(A.items, r.id);
      if (UI.inTarget && r.level > A.target) return false;
      if (UI.fch && r.chapter !== UI.fch) return false;
      if (UI.fcomp && r.component !== UI.fcomp) return false;
      if (UI.flv && r.level !== +UI.flv) return false;
      if (UI.fst) {
        if (UI.fst === 'none' && s) return false;
        if (UI.fst === 'gap' && (r.level > A.target || s === 'met' || s === 'na')) return false;
        if (['met', 'partial', 'unmet', 'na'].indexOf(UI.fst) >= 0 && s !== UI.fst) return false;
      }
      if (q && (r.id.toLowerCase().indexOf(q) < 0 && r.text.toLowerCase().indexOf(q) < 0)) return false;
      return true;
    });
  }
  function renderItemsList() {
    var list = filtered(), html = '', lastSec = null;
    list.forEach(function (q) {
      if (q.section !== lastSec) {
        lastSec = q.section;
        var sec = SEC[q.section];
        html += '<div class="sec-head"><h3>' + sec.id + ' ' + esc(sec.name) + '</h3>' + (sec.applies ? '<span class="cond">本节适用于' + esc(sec.applies) + '</span>' : '') +
          '<button type="button" class="btn sm ghost" data-open-sec="' + sec.id + '" style="margin-left:auto">在侧栏打开本节</button></div>';
      }
      html += reqRow(q, 'l');
    });
    $('#itemsList').innerHTML = html || '<div class="empty">没有符合筛选条件的要求。</div>';
    updateItemsCount(list.length);
  }
  function updateItemsCount(n) {
    var el = $('#itemsCount');
    if (!el) return;
    if (n == null) n = $$('#itemsList .req').length;
    var all = S.stats(REQ, A.items, A.target);
    el.textContent = '显示 ' + n + ' 条 · 目标内差距 ' + all.gap + ' 条';
  }

  /* ---------- 评估报告 ---------- */
  function palette() {
    var cs = getComputedStyle(document.documentElement), g = function (k) { return cs.getPropertyValue('--c-' + k).trim(); };
    return { surface: g('surface'), ink: g('ink'), ink2: g('ink2'), muted: g('muted'), grid: g('grid'), axis: g('axis'), s1: g('s1'), s1light: g('s1light'), s1dark: g('s1dark'), compare: g('compare'), good: g('good'), warning: g('warning'), critical: g('critical'), neutral: g('neutral') };
  }
  function chartSpecs() {
    var t = A.target, cmp = !!CMP, cl = CMP ? '对比：' + CMP.label : '';
    var chAxes = B.chapters.map(function (c) {
      var st = S.stats(CHREQ[c.id], A.items, t), cs = CMP ? S.stats(CHREQ[c.id], CMP.items, t) : null;
      return { code: c.id, label: c.name, value: st.rate, compare: cs ? cs.rate : null, st: st, cs: cs,
        tip: c.id + ' ' + c.name + '：满足率 ' + pct(st.rate) + '（' + st.met + '/' + st.applicable + '），达成 ' + S.levelName(st.achieved) + (cs ? '；对比 ' + pct(cs.rate) : '') };
    });
    var cpAxes = B.components.map(function (cp) {
      var rs = COMPREQ[cp.name] || [], st = S.stats(rs, A.items, t), cs = CMP ? S.stats(rs, CMP.items, t) : null;
      return { label: cp.name, value: st.rate, compare: cs ? cs.rate : null, st: st, cs: cs,
        tip: cp.name + '：满足率 ' + pct(st.rate) + '（' + st.met + '/' + st.applicable + '），达成 ' + S.levelName(st.achieved) + (cs ? '；对比 ' + pct(cs.rate) : '') };
    });
    var mRows = chAxes.map(function (a) {
      return { code: a.code, name: a.label, achieved: a.st.achieved, gap: a.st.gap, rate: a.st.rate, compare: a.cs ? a.cs.rate : null, compareAchieved: a.cs ? a.cs.achieved : null, tip: a.tip };
    });
    var gRows = cpAxes.map(function (a) { return { label: a.label, unmet: a.st.unmet, partial: a.st.partial, none: a.st.none, total: a.st.gap }; })
      .sort(function (x, y) { return y.total - x.total; });
    return {
      'radar': UI.radar === 'comp'
        ? { title: '满足率雷达 · 按落点组件', build: function (P) { return CH.radar({ axes: cpAxes, compare: cmp, compareLabel: cl }, P); } }
        : { title: '满足率雷达 · 按章', build: function (P) { return CH.radar({ axes: chAxes, compare: cmp, compareLabel: cl }, P); } },
      'maturity': { title: '章节成熟度', build: function (P) { return CH.maturity({ rows: mRows, target: t, compare: cmp }, P); } },
      'gapdist': { title: '差距分布', build: function (P) { return CH.gapBars({ rows: gRows }, P); } },
      _ch: chAxes, _cp: cpAxes
    };
  }
  var GAP_PREVIEW = 14, UI_GAPALL = false;
  function ladder(achieved, t) {
    var steps = [['未达 L1', '起点'], ['L1', '底线'], ['L2', '标准'], ['L3', '增强']];
    var html = '<div class="ladder" role="img" aria-label="当前' + esc(S.levelName(achieved)) + '，目标 L' + t + '">';
    if (achieved > 0) html += '<span class="fill" style="left:12.5%;width:' + (achieved * 25) + '%"></span>';
    if (achieved < t) html += '<span class="gapline" style="left:' + (12.5 + achieved * 25) + '%;width:' + ((t - achieved) * 25) + '%"></span>';
    steps.forEach(function (s, i) {
      var cls = 'step' + (i <= achieved ? ' reached' : '') + (i === achieved ? ' current' : '') + (i === t ? ' target' : '');
      var flag = i === achieved && i === t ? '当前 · 已达标' : i === achieved ? '当前' : i === t ? '目标' : '';
      var sub = s[1] + (i > achieved ? ' · 差 ' + S.stats(REQ, A.items, i).gap + ' 条' : '');
      html += '<div class="' + cls + '">' + (flag ? '<span class="flag">' + flag + '</span>' : '') + '<span class="node"></span><span class="lbl">' + s[0] + '<small>' + sub + '</small></span></div>';
    });
    return html + '</div>';
  }
  function renderResults() {
    var t = A.target, all = S.stats(REQ, A.items, t), P = palette(), specs = chartSpecs();
    var done = REQ.filter(function (q) { return S.statusOf(A.items, q.id); }).length;
    var cmpAll = CMP ? S.stats(REQ, CMP.items, t) : null;
    var m = A.meta;
    var meta = [m.org || '未填写评估对象', m.date ? '评估日期 ' + m.date : '', m.assessor ? '评估人 ' + m.assessor : '', '目标 L' + t + ' ' + LEVEL_LABEL[t]].filter(Boolean).map(esc).join(' · ');
    var html = '<div class="page-head"><div class="t"><h2>评估报告</h2><div class="sub">' + meta + '</div></div><div class="tools no-print">' +
      (CMP ? '<span class="chip">对比：' + esc(CMP.label) + '</span>' : '') +
      '<button type="button" class="btn" id="exXlsx2">' + ICON.down + '导出 Excel</button>' +
      (window.top === window.self ? '<button type="button" class="btn" id="printBtn">打印或存为 PDF</button>' : '') + '</div></div>';

    // 结论：成熟度阶梯 + 等级达成
    var insight;
    if (all.achieved < t) {
      var next = all.achieved + 1, ng = S.stats(REQ, A.items, next).gap;
      insight = '再满足 <b>' + ng + '</b> 条要求即可达到 <b>L' + next + '</b>' + (next < t ? '；距目标 L' + t + ' 共差 <b>' + all.gap + '</b> 条' : '') + (all.none ? '。目标内还有 ' + all.none + ' 条未评估，评估完成前结论可能变化。' : '。');
    } else {
      insight = '已达到目标等级 <b>L' + t + '</b>' + (all.achieved > t ? '，当前达成 <b>' + S.levelName(all.achieved) + '</b>。' : '。') + (all.achieved < 3 ? '继续满足 ' + S.stats(REQ, A.items, all.achieved + 1).gap + ' 条要求可达到 L' + (all.achieved + 1) + '。' : '');
    }
    // 第一行：四项指标
    var delta = cmpAll && all.rate != null && cmpAll.rate != null ? Math.round((all.rate - cmpAll.rate) * 100) : null;
    var lvSegs = [1, 2, 3].map(function (L) { return '<i class="' + (L <= all.achieved ? 'on' : 'off') + (L === t ? ' tgt' : '') + '" title="L' + L + ' ' + LEVEL_LABEL[L] + '"></i>'; }).join('');
    html += '<div class="kpis kpis4">' +
      '<div class="kpi lvl-kpi"><span class="l">成熟度<span class="chip">目标 L' + t + '</span></span>' +
      '<span class="v">' + esc(S.levelName(all.achieved)) + '</span><div class="lvbar" role="img" aria-label="已达到 ' + esc(S.levelName(all.achieved)) + '，目标 L' + t + '">' + lvSegs + '</div>' +
      '<span class="s">当前达成 · 目标 L' + t + ' ' + LEVEL_LABEL[t] + '</span>' +
      (cmpAll ? '<span class="s muted">对比时 ' + esc(S.levelName(cmpAll.achieved)) + '</span>' : '<span class="s muted">该级及以下的适用要求全部满足才算达到</span>') + '</div>' +
      '<div class="kpi"><span class="l">目标内满足率</span>' +
      '<span class="v num">' + (all.rate == null ? '—' : Math.round(all.rate * 100) + '<small>%</small>') + '</span><div class="meter"><i style="width:' + ((all.rate || 0) * 100).toFixed(1) + '%"></i></div>' +
      '<span class="s">' + all.met + ' / ' + all.applicable + ' 条适用要求已满足</span>' + (delta != null ? '<span class="s ' + (delta >= 0 ? 'up' : 'down') + '">较对比' + (delta >= 0 ? '提升 ' : '下降 ') + Math.abs(delta) + ' 个百分点</span>' : '') + '</div>' +
      '<div class="kpi"><span class="l">差距条目</span><span class="v num">' + all.gap + '<small>条</small></span>' +
      stackBar({ met: 0, partial: all.partial, unmet: all.unmet, none: all.none, na: 0 }) +
      '<span class="s">未满足 ' + all.unmet + ' · 部分满足 ' + all.partial + ' · 未评估 ' + all.none + '</span>' +
      (cmpAll ? '<span class="s muted">较对比' + (all.gap <= cmpAll.gap ? '减少 ' : '增加 ') + Math.abs(all.gap - cmpAll.gap) + ' 条</span>' : '') + '</div>' +
      '<div class="kpi"><span class="l">评估进度</span><span class="v num">' + Math.round(done / REQ.length * 100) + '<small>%</small></span><div class="meter"><i style="width:' + (done / REQ.length * 100).toFixed(1) + '%"></i></div>' +
      '<span class="s">' + done + ' / ' + REQ.length + ' 条已评估</span><span class="s muted">目标内未评估 ' + all.none + ' 条</span></div></div>';

    // 第二行：等级达成 + 优先处理
    html += '<div class="rep-top"><section class="card hero"><div class="card-head"><div class="t"><h3>等级达成</h3><p>L1、L2、L3 逐级累积，阶梯上标出当前位置和目标</p></div></div>' +
      ladder(all.achieved, t) + '<p class="insight">' + insight + '</p><div class="lvl-rows">' +
      levelStats().map(function (x) {
        var st = x.st;
        return '<div class="lvl-row"><span class="n">L' + x.L + '<small>' + LEVEL_LABEL[x.L] + '</small></span>' + stackBar(st) +
          '<span class="v' + (st.gap === 0 ? ' ok' : '') + '">' + (st.gap === 0 ? '已达到' : st.met + ' / ' + st.applicable) + '</span></div>';
      }).join('') + '</div>' + legendStatus(false) + '</section>';
    var sev = { unmet: 0, partial: 1, '': 2 };
    var gaps = REQ.filter(function (q) { var s = S.statusOf(A.items, q.id); return q.level <= t && s !== 'met' && s !== 'na'; })
      .sort(function (a, b) { return a.level - b.level || sev[S.statusOf(A.items, a.id)] - sev[S.statusOf(A.items, b.id)] || REQ.indexOf(a) - REQ.indexOf(b); });
    html += '<section class="card"><div class="card-head"><div class="t"><h3>优先处理</h3><p>目标等级内尚未满足的要求，L1 与未满足排在前面</p></div>' + (gaps.length ? '<button type="button" class="linkish more no-print" data-jump="gaplist">完整差距清单 →</button>' : '') + '</div>' +
      (gaps.length ? '<div class="prio">' + gaps.slice(0, 6).map(function (q) {
        var it = A.items[q.id] || {};
        return '<button type="button" data-open-req="' + q.id + '"><span class="rid">' + q.id + '</span><span class="tx">' + esc(q.text) + '</span>' +
          '<span class="meta"><span class="lv">L' + q.level + '</span><span class="st"><i class="dot ' + DOTCLS[it.status || ''] + '"></i>' + S.LABEL[it.status || ''] + '</span>' + (it.owner ? '<span>' + esc(it.owner) + '</span>' : '') + '</span></button>';
      }).join('') + '</div><div class="prio-foot">共 ' + gaps.length + ' 条，按等级、状态排序后的前 ' + Math.min(6, gaps.length) + ' 条。</div>' : '<div class="empty">目标等级内没有差距。</div>') + '</section></div>';

    // 图表
    var acts = function (k) { return '<button type="button" class="btn sm" data-dl="' + k + ':png">PNG</button><button type="button" class="btn sm" data-dl="' + k + ':svg">SVG</button>'; };
    html += '<div class="grid2">' +
      '<section class="card"><div class="card-head"><div class="t"><h3>满足率雷达</h3><p>目标等级 L' + t + ' 内，各维度已满足的适用要求占比</p></div><div class="acts no-print">' +
      '<div class="seg" role="group" aria-label="雷达维度"><button type="button" data-radar="ch" aria-pressed="' + (UI.radar !== 'comp') + '">按章</button><button type="button" data-radar="comp" aria-pressed="' + (UI.radar === 'comp') + '">按组件</button></div>' + acts('radar') + '</div></div>' +
      '<div class="chart" id="ch-radar">' + CH.svg(specs.radar.build(P), specs.radar.title) + '</div></section>' +
      '<section class="card"><div class="card-head"><div class="t"><h3>章节成熟度</h3><p>每章当前达成的等级、满足率和差距条目</p></div><div class="acts no-print">' + acts('maturity') + '</div></div>' +
      '<div class="chart" id="ch-maturity">' + CH.svg(specs.maturity.build(P), specs.maturity.title) + '</div></section></div>';
    var row = function (name, a) {
      var st = a.st;
      return '<tr><td>' + esc(name) + '</td><td class="n">' + st.met + ' / ' + st.applicable + '</td><td class="n">' + st.partial + '</td><td class="n">' + st.unmet + '</td><td class="n">' + st.none + '</td><td class="n">' + st.na + '</td><td class="n"><b>' + pct(st.rate) + '</b></td><td>' + levelChip(st.achieved) + '</td>' + (CMP ? '<td class="n">' + pct(a.cs.rate) + '</td>' : '') + '</tr>';
    };
    html += '<div class="grid2">' +
      '<section class="card"><div class="card-head"><div class="t"><h3>差距分布</h3><p>目标等级内尚未满足的要求，按落点组件和状态拆分</p></div><div class="acts no-print">' + acts('gapdist') + '</div></div>' +
      '<div class="chart" id="ch-gapdist">' + CH.svg(specs.gapdist.build(P), specs.gapdist.title) + '</div></section>' +
      '<section class="card"><div class="card-head"><div class="t"><h3>按落点组件统计</h3><p>与雷达图同一口径，便于把差距分派给对应团队</p></div></div>' +
      '<div class="tablewrap"><table class="data"><thead><tr><th>落点组件</th><th class="n">已满足</th><th class="n">部分满足</th><th class="n">未满足</th><th class="n">未评估</th><th class="n">不适用</th><th class="n">满足率</th><th>达成</th>' + (CMP ? '<th class="n">对比</th>' : '') + '</tr></thead><tbody>' +
      specs._cp.map(function (a) { return row(a.label, a); }).join('') + '</tbody></table></div></section></div>';

    html += '<section class="card" id="gaplist"><div class="card-head"><div class="t"><h3>差距清单</h3><p>目标等级内尚未满足的 ' + gaps.length + ' 条要求，按等级和状态排序。点编号打开评估。</p></div></div>' +
      (gaps.length ? '<div class="tablewrap"><table class="data' + (gaps.length > GAP_PREVIEW && !UI_GAPALL ? ' collapsed' : '') + '"><thead><tr><th>编号</th><th>要求</th><th>等级</th><th>落点组件</th><th>状态</th><th>负责人</th><th>计划完成</th></tr></thead><tbody>' +
        gaps.map(function (q, i) {
          var it = A.items[q.id] || {};
          return '<tr' + (i >= GAP_PREVIEW ? ' class="extra"' : '') + '><td><button type="button" class="linkish" data-open-req="' + q.id + '">' + q.id + '</button></td><td>' + esc(q.text) + '</td><td><span class="lv">L' + q.level + '</span></td><td>' + esc(q.component) + '</td><td><span class="st"><i class="dot ' + DOTCLS[it.status || ''] + '"></i>' + S.LABEL[it.status || ''] + '</span></td><td>' + esc(it.owner || '') + '</td><td>' + esc(it.due || '') + '</td></tr>';
        }).join('') + '</tbody></table></div>' + (gaps.length > GAP_PREVIEW ? '<div class="more-row no-print"><button type="button" class="btn" data-gapall="1">' + (UI_GAPALL ? '收起，只看前 ' + GAP_PREVIEW + ' 条' : '显示全部 ' + gaps.length + ' 条') + '</button></div>' : '') : '<div class="empty">目标等级内没有差距，已经达到 L' + t + '。</div>') + '</section>';
    $('#p-results').innerHTML = html;
  }
  function downloadChart(key, fmt) {
    var sp = chartSpecs()[key];
    var head = {
      eyebrow: B.title + ' v' + B.version,
      title: sp.title,
      subtitle: (A.meta.org || '未填写评估对象') + ' · 目标等级 L' + A.target + ' · 评估日期 ' + (A.meta.date || today()) + (CMP ? ' · 对比 ' + CMP.label : ''),
      footer: '共 ' + B.counts.total + ' 条要求 · 满足率 = 已满足 ÷ 适用要求，未评估按未满足计 · 导出于 ' + today()
    };
    var svg = CH.exportSvg(sp.build(CH.LIGHT), head);
    var name = fileBase() + '_' + sp.title.replace(/\s*·\s*/g, '_');
    if (fmt === 'svg') return saveFile(name + '.svg', svg, 'image/svg+xml');
    return CH.toPng(svg, 2).then(function (blob) { return saveFile(name + '.png', blob); }, function () { toast('图片生成失败，请改用 SVG'); });
  }

  /* ---------- 数据 ---------- */
  function renderData() {
    var m = A.meta;
    $('#p-data').innerHTML = '<div class="page-head"><div class="t"><h2>数据</h2><div class="sub">评估数据只保存在这个浏览器里，不会上传。需要留档或交给别人复核时，请导出文件。</div></div></div><div class="cols">' +
      '<section class="card"><div class="card-head"><div class="t"><h3>评估信息</h3><p>会写进导出的 Excel、报告页和图片页眉</p></div></div><div class="form">' +
      '<label for="m-org">评估对象<input type="text" id="m-org" data-meta="org" maxlength="120" placeholder="组织、平台或系统名称" value="' + esc(m.org) + '"></label>' +
      '<label for="m-scope">评估范围<textarea id="m-scope" data-meta="scope" maxlength="300" rows="2" placeholder="例如：生产环境的员工助手与运维 Agent">' + esc(m.scope) + '</textarea></label>' +
      '<label for="m-assessor">评估人<input type="text" id="m-assessor" data-meta="assessor" maxlength="80" value="' + esc(m.assessor) + '"></label>' +
      '<label for="m-date">评估日期<input type="date" id="m-date" data-meta="date" value="' + esc(m.date) + '"></label></div></section>' +

      '<section class="card"><div class="card-head"><div class="t"><h3>导出</h3><p>JSON 是完整记录，可以随时导回；Excel 是离线评估表，含汇总公式和差距清单</p></div></div>' +
      '<div class="actions"><button type="button" class="btn primary" id="exJson">导出 JSON</button><button type="button" class="btn" id="exXlsx">导出 Excel</button><button type="button" class="btn ghost" id="exTpl">下载空白评估表</button></div>' +
      '<p class="note">换电脑或清理浏览器前，请先导出 JSON。</p></section>' +

      '<section class="card"><div class="card-head"><div class="t"><h3>导入</h3><p>支持本工具导出的 JSON，以及离线填写的 Excel 评估表</p></div></div>' +
      '<div class="drop" id="dropMain"><span>把 .json 或 .xlsx 拖到这里</span><label class="btn" for="fileMain">选择文件</label><input type="file" id="fileMain" accept=".json,.xlsx" class="sr"></div>' +
      '<p class="note">导入会替换当前评估，导入后 8 秒内可以撤销。</p></section>' +

      '<section class="card"><div class="card-head"><div class="t"><h3>对比</h3><p>载入上一次的评估结果，在报告页叠加显示</p></div></div>' +
      (CMP ? '<p class="note">当前对比：<b>' + esc(CMP.label) + '</b>' + (CMP.meta.date ? '（评估日期 ' + esc(CMP.meta.date) + '）' : '') + '</p>' : '') +
      '<div class="actions"><label class="btn" for="fileCmp">' + (CMP ? '更换对比文件' : '载入对比文件') + '</label><input type="file" id="fileCmp" accept=".json,.xlsx" class="sr">' +
      (CMP ? '<button type="button" class="btn ghost" id="cmpClear">取消对比</button>' : '') + '</div></section>' +

      '<section class="card"><div class="card-head"><div class="t"><h3>重新开始</h3><p>清空当前浏览器里的评估状态、证据和评估信息</p></div></div>' +
      '<div class="actions" id="resetBox"><button type="button" class="btn danger" id="resetBtn">清空当前评估</button></div></section>' +
      '</div>';
  }
  function importFile(file, asCompare) {
    if (!file) return;
    if (file.size > 20 * 1024 * 1024) { toast('文件超过 20 MB，不像是评估文件'); return; }
    var name = file.name.toLowerCase(), p;
    if (/\.json$/.test(name)) {
      p = file.text().then(function (t) { return fromObject(JSON.parse(t)); });
    } else if (/\.xlsx$/.test(name)) {
      p = Promise.all([loadExcel(), file.arrayBuffer()]).then(function (r) {
        var wb = new r[0].Workbook();
        return wb.xlsx.load(r[1]).then(function () {
          var x = WB.parse(wb, B, S), c = cleanItems(x.items);
          return { items: c.items, meta: cleanMeta(x.meta), target: x.target, unknown: x.unknown, bad: x.badStatus };
        });
      });
    } else { toast('只支持 .json 和 .xlsx 文件'); return; }
    p.then(function (res) {
      var n = Object.keys(res.items).length;
      var warn = (res.unknown.length ? '，忽略未知编号 ' + res.unknown.length + ' 个' : '') + (res.bad.length ? '，' + res.bad.length + ' 条状态无法识别' : '');
      if (asCompare) {
        CMP = { label: file.name.replace(/\.(json|xlsx)$/i, '').slice(0, 80), items: res.items, meta: res.meta, at: new Date().toISOString() };
        store.set(KEY.c, CMP);
        toast('已载入对比：' + n + ' 条有记录' + warn);
      } else {
        var prev = JSON.parse(JSON.stringify(A));
        var a = blank();
        a.items = res.items;
        a.meta = Object.assign(a.meta, res.meta);
        a.target = res.target || A.target;
        A = a;
        save(true);
        toast('已导入 ' + n + ' 条记录' + warn, '撤销', function () { A = prev; save(true); rerender(); toast('已撤销导入'); });
      }
      rerender();
    }, function (e) { toast('导入失败：' + ((e && e.message) || '文件无法读取')); });
  }
  function exportXlsx(empty) {
    toast('正在生成 Excel…');
    return loadExcel().then(function (XL) {
      var src = empty ? { target: 2, items: {}, meta: {} } : A;
      return WB.build(XL, B, src, S).xlsx.writeBuffer();
    }).then(function (buf) {
      var name = empty ? B.title + '_评估表.xlsx' : fileBase() + '.xlsx';
      return saveFile(name, new Blob([buf], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }));
    }, function (e) { toast('Excel 生成失败：' + ((e && e.message) || '未知错误')); });
  }

  /* ---------- 说明 ---------- */
  function renderAbout() {
    var c = B.counts;
    $('#p-about').innerHTML = '<div class="page-head"><div class="t"><h2>说明</h2><div class="sub">' + esc(B.title) + ' v' + esc(B.version) + '（' + esc(B.date) + '）</div></div></div><div class="card prose">' +
      '<p>本工具用于对照《' + esc(B.title) + '》做自评。基线共 ' + c.total + ' 条要求，分布在 ' + B.chapters.length + ' 章 ' + c.sections + ' 个小节：L1 ' + c.L1 + ' 条，L2 在此基础上增加 ' + c.L2 + ' 条，L3 再增加 ' + c.L3 + ' 条。完整条文、术语、架构和威胁模型见 <a href="' + esc(B.docUrl) + '" target="_blank" rel="noopener">基线文档</a>。</p>' +
      '<h3>怎么评</h3><ul>' +
      '<li>先在应用栏选目标等级。L1 是底线，L2 是主流企业安全评审的标准，L3 面向高监管行业和高敏感数据。</li>' +
      '<li>在覆盖矩阵点开小节，或在逐条评估页筛选后逐条标记状态，并填写证据、负责人和计划完成时间。</li>' +
      '<li>平台不具备某项能力时（例如不支持 MCP），对应小节整节标为不适用，不计入满足率。</li></ul>' +
      '<h3>怎么算</h3><ul>' +
      '<li>满足率 = 已满足 ÷ 适用要求，只统计目标等级内的要求。部分满足和未评估都按未满足计。</li>' +
      '<li>达到某一级，要求该级及以下的全部适用要求都已满足。差一条，就停在下一级。</li>' +
      '<li>差距条目 = 目标等级内、适用、但还没有满足的要求。</li></ul>' +
      '<h3>数据放在哪</h3><ul>' +
      '<li>评估数据只保存在当前浏览器的本地存储里，页面不向任何服务器发送数据。</li>' +
      '<li>需要留档、换电脑或交给别人复核时，在数据页导出 JSON 或 Excel。两种文件都能再导回。</li>' +
      '<li>离线填写的 Excel 评估表可以导回本工具，状态、证据、负责人和计划完成会按编号回填。</li></ul>' +
      '<h3>两个视角</h3><p>章回答「要求什么」：V1 至 V7 沿一次 Agent 行为的发生顺序排列，V8 至 V10 按跨会话持续存在的数据、Agent 和审计组织。落点组件回答「在哪里实现」，评估时可以按组件把差距分派给对应团队。</p>' +
      '<h3>第三方组件</h3><p>Excel 读写使用 ExcelJS（MIT 许可），字体使用 IBM Plex（SIL Open Font License）。</p></div>';
  }

  /* ---------- 路由与整体刷新 ---------- */
  var TABS = ['matrix', 'items', 'results', 'data', 'about'];
  var current = 'matrix';
  function route() {
    var h = (location.hash || '').replace('#', '');
    current = TABS.indexOf(h) >= 0 ? h : 'matrix';
    TABS.forEach(function (t) { $('#p-' + t).hidden = t !== current; });
    $$('.tabs a').forEach(function (a) { a.setAttribute('aria-current', a.getAttribute('href') === '#' + current ? 'page' : 'false'); });
    renderTab();
  }
  function renderTab() {
    ({ matrix: renderMatrix, items: renderItems, results: renderResults, data: renderData, about: renderAbout })[current]();
  }
  function rerender() { renderTop(); renderTab(); if (drawer) openDrawer(drawer); }

  /* ---------- 事件 ---------- */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('button, [data-close]');
    if (!el) return;
    var reqEl = el.closest('.req');
    if (el.hasAttribute('data-set') && reqEl) { setStatus(reqEl.dataset.id, el.dataset.set); return; }
    if (el.hasAttribute('data-close')) { closeDrawer(); return; }
    if (el.dataset.sec) { openDrawer({ sec: el.dataset.sec }); return; }
    if (el.dataset.cc) { var p2 = el.dataset.cc.split('|'); openDrawer({ comp: p2[0], ch: p2[1] }); return; }
    if (el.dataset.openSec) { openDrawer({ sec: el.dataset.openSec }); return; }
    if (el.dataset.openReq) { openDrawer({ sec: BYID[el.dataset.openReq].section }, el.dataset.openReq); return; }
    if (el.hasAttribute('data-secset') && drawer && drawer.sec) { setSection(drawer.sec, el.getAttribute('data-secset')); return; }
    if (el.dataset.view) { UI.view = el.dataset.view; saveUI(); renderMatrix(); return; }
    if (el.dataset.jump) { var tg = document.getElementById(el.dataset.jump); if (tg) { tg.scrollIntoView({ behavior: 'smooth', block: 'start' }); var fb = tg.querySelector('h3'); if (fb) { fb.setAttribute('tabindex', '-1'); fb.focus({ preventScroll: true }); } } return; }
    if (el.dataset.gapall) { UI_GAPALL = !UI_GAPALL; renderResults(); if (!UI_GAPALL) { var gl = document.getElementById('gaplist'); if (gl) gl.scrollIntoView({ block: 'start' }); } return; }
    if (el.dataset.radar) { UI.radar = el.dataset.radar; saveUI(); renderResults(); return; }
    if (el.dataset.t) { A.target = +el.dataset.t; save(); rerender(); return; }
    if (el.dataset.dl) { var p = el.dataset.dl.split(':'); downloadChart(p[0], p[1]); return; }
    switch (el.id) {
      case 'exJson': saveFile(fileBase() + '.json', JSON.stringify(A, null, 2), 'application/json'); break;
      case 'exXlsx': case 'exXlsx2': exportXlsx(false); break;
      case 'exTpl': exportXlsx(true); break;
      case 'cmpClear': CMP = null; store.del(KEY.c); toast('已取消对比'); renderData(); break;
      case 'printBtn': window.print(); break;
      case 'resetBtn':
        $('#resetBox').innerHTML = '<span class="confirm">确定清空？这一步不能撤销。<button type="button" class="btn danger" id="resetYes">清空</button><button type="button" class="btn" id="resetNo">取消</button></span>';
        $('#resetNo').focus();
        break;
      case 'resetNo': renderData(); break;
      case 'resetYes': A = blank(); save(true); rerender(); toast('已清空当前评估'); break;
    }
  });
  document.addEventListener('input', function (e) {
    var el = e.target;
    if (el.dataset.f) { var r = el.closest('.req'); if (r) setField(r.dataset.id, el.dataset.f, el.value); return; }
    if (el.dataset.meta) { A.meta[el.dataset.meta] = el.value.slice(0, +el.getAttribute('maxlength') || 120); save(); renderTop(); return; }
    if (el.id === 'f-q') { UI.q = el.value; saveUI(); renderItemsList(); }
  });
  document.addEventListener('change', function (e) {
    var el = e.target;
    if (el.id === 'inTargetOnly') { UI.inTargetOnly = el.checked; saveUI(); renderMatrix(); return; }
    var map = { 'f-ch': 'fch', 'f-comp': 'fcomp', 'f-lv': 'flv', 'f-st': 'fst' };
    if (map[el.id]) { UI[map[el.id]] = el.value; saveUI(); renderItemsList(); return; }
    if (el.id === 'f-in') { UI.inTarget = el.checked; saveUI(); renderItemsList(); return; }
    if (el.id === 'fileMain') { importFile(el.files[0], false); el.value = ''; return; }
    if (el.id === 'fileCmp') { importFile(el.files[0], true); el.value = ''; return; }
    if (el.dataset.f) {
      var r = el.closest('.req');
      if (r) { var s = $('summary', r), it = A.items[r.dataset.id] || {}, has = !!(it.evidence || it.owner || it.due); s.className = has ? 'has-note' : ''; s.textContent = has ? '证据与跟踪（已填写）' : '证据与跟踪'; }
    }
  });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && drawer) { closeDrawer(); }
    if (e.key === 'Tab' && drawer) {
      var f = $$('.drawer button, .drawer textarea, .drawer input, .drawer summary').filter(function (x) { return x.getClientRects().length && !x.closest('details:not([open]) > :not(summary)'); });
      if (!f.length) return;
      if (e.shiftKey && document.activeElement === f[0]) { e.preventDefault(); f[f.length - 1].focus(); }
      else if (!e.shiftKey && document.activeElement === f[f.length - 1]) { e.preventDefault(); f[0].focus(); }
    }
  });
  ['dragover', 'dragleave', 'drop'].forEach(function (type) {
    document.addEventListener(type, function (e) {
      var d = e.target.closest && e.target.closest('#dropMain');
      if (!d) return;
      e.preventDefault();
      d.classList.toggle('over', type === 'dragover');
      if (type === 'drop' && e.dataTransfer.files[0]) importFile(e.dataTransfer.files[0], false);
    });
  });
  window.addEventListener('hashchange', route);
  window.addEventListener('storage', function (e) { if (e.key === KEY.a && e.newValue) { try { var f = fromObject(JSON.parse(e.newValue)); A.items = f.items; A.meta = Object.assign(A.meta, f.meta); A.target = f.target || A.target; rerender(); } catch (x) { /* 忽略 */ } } });
  var mq = window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)') : null;
  var reTheme = function () { if (current === 'results') renderResults(); };
  if (mq && mq.addEventListener) mq.addEventListener('change', reTheme);
  new MutationObserver(reTheme).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  // 打印和存为 PDF 时一律用浅色，图表随 data-theme 重绘；结束后恢复原设置
  var printTheme = null;
  window.addEventListener('beforeprint', function () {
    printTheme = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', 'light');
  });
  window.addEventListener('afterprint', function () {
    if (printTheme == null) document.documentElement.removeAttribute('data-theme');
    else document.documentElement.setAttribute('data-theme', printTheme);
  });
  // 关闭或切走页面时立即写入，避免 300ms 防抖丢掉最后的输入
  window.addEventListener('pagehide', function () { if (saveTimer) save(true); });
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden' && saveTimer) save(true); });

  /* ---------- 启动 ---------- */
  $('#ver').textContent = 'v' + B.version;
  $('#targetSeg').innerHTML = [1, 2, 3].map(function (n) { return '<button type="button" data-t="' + n + '" aria-pressed="false">L' + n + '<small>' + LEVEL_LABEL[n] + '</small></button>'; }).join('');
  renderTop();
  route();
  if (DROPPED) { save(true); toast('基线已修订，已移除 ' + DROPPED + ' 条当前版本 v' + B.version + ' 中不存在的编号'); }
  window.__app = { get A() { return A; }, get CMP() { return CMP; }, importFile: importFile, exportXlsx: exportXlsx, downloadChart: downloadChart, chartSpecs: chartSpecs };
})();
