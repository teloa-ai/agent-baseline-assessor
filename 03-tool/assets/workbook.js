/* 评估表 xlsx 的生成与读取。浏览器导出和 Node 生成离线模板共用这一份代码。
   依赖 ExcelJS（MIT）与 score.js，由调用方传入。
   多语言：调用方通过 opts.t 传入翻译函数（浏览器传 I18N.t，Node 传已加载词典的 I18N.t），
   不传则输出中文。公式与读取逻辑只依赖列的位置，不依赖语言。 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Workbook = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var FONT = 'Arial';
  var C = {
    head: 'FF2F3B33', headInput: 'FF8A6D1F', headTarget: 'FF4A5D52', input: 'FFFFF8DC', select: 'FFFFE699',
    border: 'FFD0D0D0', white: 'FFFFFFFF', note: 'FF666666', link: 'FF0563C1',
    L1: 'FFF4CCCC', L2: 'FFFCE5CD', L3: 'FFE7E6E6',
    met: 'FFD9EAD3', partial: 'FFFFF2CC', unmet: 'FFF4CCCC', na: 'FFEEEEEE',
    heat2: 'FF9EC5F4', heat1: 'FFCDE2FB', faint: 'FFBBBBBB'
  };
  /* 源文（中文）。导出时的工作表顺序：评估表、汇总、差距清单、架构视角、说明。解析时按表名和表头识别，顺序只作后备 */
  var SHEETS = { main: '评估表', sum: '汇总', gap: '差距清单', arch: '架构视角', note: '说明' };
  var SHEET_ORDER = ['main', 'sum', 'gap', 'arch', 'note'];
  var HEADS = ['编号', '章', '小节', '落点组件', '要求', '最低等级', 'L1', 'L2', 'L3', '适用条件', '状态', '证据与说明', '负责人', '计划完成', '等级序号'];
  var WIDTHS = [10, 18, 22, 11, 56, 8, 5, 5, 5, 26, 9, 30, 9, 11, 6];
  var INPUT = [11, 12, 13, 14];

  /* 没有传入翻译函数时输出中文，但仍替换 {name} 占位符 */
  function interp(s, vars) {
    if (!vars) return s;
    return String(s).replace(/\{(\w+)\}/g, function (m, k) {
      return Object.prototype.hasOwnProperty.call(vars, k) && vars[k] != null ? String(vars[k]) : m;
    });
  }
  var ident = function (s, vars) { return interp(s, vars); };
  var own = Object.prototype.hasOwnProperty;

  function dw(t) {
    var n = 0, s = String(t);
    for (var i = 0; i < s.length; i++) n += /[ᄀ-ᅟ⺀-꓏가-힣豈-﫿︰-﹏＀-｠￠-￦]/.test(s[i]) ? 2 : 1;
    return n;
  }
  function fitHeight(texts, lh, pad, mn) {
    var lines = 1;
    texts.forEach(function (p) {
      var v = p[0], w = p[1];
      if (typeof v !== 'string' || !v) return;
      var k = 0;
      v.split('\n').forEach(function (seg) { k += Math.max(1, Math.ceil(dw(seg) / Math.max(w - 1.5, 4))); });
      lines = Math.max(lines, k);
    });
    return Math.max(mn || 20, lines * (lh || 14) + (pad || 6));
  }
  var side = { style: 'thin', color: { argb: C.border } };
  var BORDER = { top: side, left: side, bottom: side, right: side };
  function font(o) { o = o || {}; return { name: FONT, size: o.size || 10, bold: !!o.bold, italic: !!o.italic, color: { argb: o.color || 'FF000000' }, underline: o.underline }; }
  function fill(argb) { return { type: 'pattern', pattern: 'solid', fgColor: { argb: argb } }; }
  function col(n) { var s = ''; while (n > 0) { var m = (n - 1) % 26; s = String.fromCharCode(65 + m) + s; n = Math.floor((n - 1) / 26); } return s; }
  function F(formula, result) { return { formula: formula, result: result }; }
  /* 工作表名：Excel 不允许 \ / ? * [ ] : 且最长 31 个字符 */
  function sheetName(s) { return String(s).replace(/[\\\/?*\[\]:]/g, ' ').slice(0, 31) || 'Sheet'; }
  /* 数据有效性的下拉列表用英文逗号分隔，标签里的逗号和引号要替换掉 */
  function listSafe(s) { return String(s).replace(/[",]/g, ' '); }

  function header(ws, r, labels, fills, c0) {
    c0 = c0 || 1;
    labels.forEach(function (h, i) {
      var c = ws.getCell(r, c0 + i);
      c.value = h;
      c.font = font({ bold: true, color: C.white });
      c.fill = fill((fills && fills[c0 + i]) || C.head);
      c.border = BORDER;
      c.alignment = { horizontal: 'center', vertical: 'middle', wrapText: true };
    });
    ws.getRow(r).height = 30;
  }
  function boxed(ws, r0, r1, ncol, boldLast) {
    for (var r = r0; r <= r1; r++) {
      for (var j = 1; j <= ncol; j++) {
        var c = ws.getCell(r, j);
        c.border = BORDER;
        c.font = font({ bold: boldLast && r === r1 });
        if (j > 1) c.alignment = { horizontal: 'center', vertical: 'middle' };
      }
    }
  }

  /* ---------- 生成 ---------- */
  function build(ExcelJS, B, A, Score, opts) {
    opts = opts || {};
    var tr = opts.t || ident;
    var docLink = String(B.docUrl || '').replace('{lang}', opts.locale || 'zh-CN');
    var items = (A && A.items) || {};
    var target = (A && A.target) || 2;
    var meta = (A && A.meta) || {};
    var REQ = B.requirements, N = REQ.length, last = N + 1;

    var NM = {};
    SHEET_ORDER.forEach(function (k) { NM[k] = sheetName(tr(SHEETS[k])); });
    var stLabel = function (code) { return tr(Score.LABEL[code || '']); };
    var lvName = function (n) { return n > 0 ? Score.levelName(n) : tr('未达 L1'); };
    var chName = function (id) { var c = B.chapters.filter(function (x) { return x.id === id; })[0]; return id + ' ' + tr(c.name); };
    var chapterLabel = function (c) { return c.id + ' ' + tr(c.name); };
    var sectionLabel = function (s) { return s.id + ' ' + tr(s.name); };

    var wb = new ExcelJS.Workbook();
    wb.creator = '';
    wb.calcProperties.fullCalcOnLoad = true;

    /* 评估表 */
    var ws = wb.addWorksheet(NM.main, { views: [{ state: 'frozen', xSplit: 1, ySplit: 1, topLeftCell: 'B2', activeCell: 'K2' }] });
    WIDTHS.forEach(function (w, i) { ws.getColumn(i + 1).width = w; });
    var hf = {}; INPUT.forEach(function (i) { hf[i] = C.headInput; });
    header(ws, 1, HEADS.map(tr), hf);
    ws.getRow(1).height = 24;
    var secApplies = {};
    B.sections.forEach(function (s) { secApplies[s.id] = s.applies ? tr(s.applies) : tr('所有平台'); });
    REQ.forEach(function (q, i) {
      var r = i + 2, it = items[q.id] || {};
      var sec = B.sections.filter(function (x) { return x.id === q.section; })[0];
      var vals = [q.id, chName(q.chapter), sectionLabel(sec), tr(q.component), tr(q.text), 'L' + q.level,
        q.level <= 1 ? '✓' : '', q.level <= 2 ? '✓' : '', '✓', secApplies[q.section],
        stLabel(it.status), it.evidence || '', it.owner || '', it.due || '', F('VALUE(RIGHT(F' + r + ',1))', q.level)];
      var row = ws.getRow(r);
      vals.forEach(function (v, j) {
        var c = row.getCell(j + 1);
        c.value = v;
        c.font = font();
        c.border = BORDER;
        c.alignment = [1, 4, 6, 7, 8, 9, 11, 15].indexOf(j + 1) >= 0 ? { horizontal: 'center', vertical: 'top', wrapText: true } : { vertical: 'top', wrapText: true };
        if (INPUT.indexOf(j + 1) >= 0) c.fill = fill(C.input);
      });
      row.height = fitHeight([[vals[1], 18], [vals[2], 22], [vals[4], 56], [vals[9], 26], [vals[11], 30]]);
    });
    ws.getColumn(15).hidden = true;
    ws.autoFilter = 'A1:N' + last;
    ws.addConditionalFormatting({ ref: 'F2:F' + last, rules: ['L1', 'L2', 'L3'].map(function (lv, k) {
      return { type: 'expression', priority: k + 1, formulae: ['$F2="' + lv + '"'], style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: C[lv] } } } };
    }) });
    ws.addConditionalFormatting({ ref: 'K2:K' + last, rules: [['met', C.met], ['partial', C.partial], ['unmet', C.unmet], ['na', C.na]].map(function (p, k) {
      return { type: 'expression', priority: 10 + k, formulae: ['$K2="' + stLabel(p[0]) + '"'], style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: p[1] } } } };
    }) });
    var statusList = Score.STATUSES.map(function (s) { return listSafe(stLabel(s.code)); }).join(',');
    ws.dataValidations.add('K2:K' + last, { type: 'list', allowBlank: true, formulae: ['"' + statusList + '"'], showErrorMessage: true, errorTitle: tr('状态'), error: tr('请从下拉列表中选择') });
    ws.pageSetup = { orientation: 'landscape', paperSize: 8, fitToPage: true, fitToWidth: 1, fitToHeight: 0 };
    ws.pageSetup.printTitlesRow = '1:1';

    /* 汇总 */
    var sm = wb.addWorksheet(NM.sum, { views: [{ state: 'frozen', ySplit: 3 }] });
    sm.getColumn(1).width = 26;
    for (var k = 2; k <= 13; k++) sm.getColumn(k).width = 10;
    sm.getCell('A1').value = tr('评估进度'); sm.getCell('A1').font = font({ size: 14, bold: true });
    sm.getCell('A2').value = tr('数字由公式从「{sheet}」实时计算。目标等级内的条目 = 该等级及以下全部条目；满足率 = 已满足 ÷（条目数 − 不适用）；未评估按未满足计。', { sheet: NM.main });
    sm.getCell('A2').font = font({ size: 9, italic: true, color: C.note });
    /* 表名里的单引号（如法语 Grille d'évaluation）在公式引用中要写成两个 */
    var RG = function (c) { return "'" + NM.main.replace(/'/g, "''") + "'!$" + c + '$2:$' + c + '$' + last; };
    var R_CH = RG('B'), R_CO = RG('D'), R_LV = RG('F'), R_ST = RG('K'), R_LN = RG('O');
    var CODE5 = ['met', 'partial', 'unmet', 'na', ''];
    var ST5 = CODE5.map(stLabel);
    var cnt = function (reqs, maxLv, code) {
      return reqs.filter(function (q) { return q.level <= maxLv && (code === undefined || Score.statusOf(items, q.id) === code); }).length;
    };

    header(sm, 4, [tr('目标等级'), tr('条目数'), stLabel('met'), stLabel('partial'), stLabel('unmet'), stLabel('na'), stLabel(''), tr('满足率'), tr('结论')]);
    [1, 2, 3].forEach(function (lv, k2) {
      var r = 5 + k2, tot = cnt(REQ, lv), met = cnt(REQ, lv, 'met'), na = cnt(REQ, lv, 'na');
      sm.getCell(r, 1).value = tr('达到 L{n}', { n: lv });
      sm.getCell(r, 2).value = F('COUNTIFS(' + R_LN + ',"<=' + lv + '")', tot);
      ST5.forEach(function (st, j) {
        // 未评估用减法求：空白、非法值都算未评估，五种状态之和恒等于条目数
        var f = j < 4 ? 'COUNTIFS(' + R_LN + ',"<=' + lv + '",' + R_ST + ',"' + st + '")' : 'B' + r + '-SUM(C' + r + ':F' + r + ')';
        sm.getCell(r, 3 + j).value = F(f, cnt(REQ, lv, CODE5[j]));
      });
      var cell = sm.getCell(r, 8);
      cell.value = F('IF(B' + r + '-F' + r + '=0,"—",C' + r + '/(B' + r + '-F' + r + '))', tot - na ? met / (tot - na) : '—');
      cell.numFmt = '0%';
      sm.getCell(r, 9).value = F('IF(C' + r + '=B' + r + '-F' + r + ',"' + tr('已达到') + '","' + tr('未达到') + '")', met === tot - na ? tr('已达到') : tr('未达到'));
    });
    boxed(sm, 5, 7, 9);

    sm.getCell('A10').value = tr('下面三张表按此目标等级统计 ▸');
    sm.getCell('A10').font = font({ bold: true });
    sm.getCell('A10').alignment = { horizontal: 'right', vertical: 'middle' };
    var b10 = sm.getCell('B10');
    b10.value = 'L' + target; b10.fill = fill(C.select); b10.font = font({ bold: true }); b10.border = BORDER; b10.alignment = { horizontal: 'center', vertical: 'middle' };
    sm.dataValidations.add('B10', { type: 'list', allowBlank: false, formulae: ['"L1,L2,L3"'] });
    sm.getCell('C10').value = tr('（下拉切换 L1 / L2 / L3）'); sm.getCell('C10').font = font({ size: 9, italic: true, color: C.note });
    var TGT = 'VALUE(RIGHT($B$10,1))';

    var DIST = ['L1', tr('L2 新增'), tr('L3 新增'), tr('合计')];
    var PROG = [tr('目标内条目'), stLabel('met'), stLabel('partial'), stLabel('unmet'), stLabel('na'), stLabel(''), tr('满足率'), tr('达成等级')];
    var tf = {}; for (var t = 6; t <= 13; t++) tf[t] = C.headTarget;

    function achievedF(keyRange, ref) {
      var g = function (L) {
        var crit = (keyRange ? keyRange + ',' + ref + ',' : '') + R_LN + ',"<=' + L + '",' + R_ST + ',"<>' + stLabel('met') + '",' + R_ST + ',"<>' + stLabel('na') + '"';
        return 'COUNTIFS(' + crit + ')>0';
      };
      return 'IF(' + g(1) + ',"' + tr('未达 L1') + '",IF(' + g(2) + ',"L1",IF(' + g(3) + ',"L2","L3")))';
    }

    /* keys：[{ key 原始值, label 显示文字 }]；pick(q) 返回要求所属的原始值 */
    function dimTable(r0, titleSrc, headSrc, keyRange, keys, pick) {
      sm.getCell(r0, 1).value = tr(titleSrc); sm.getCell(r0, 1).font = font({ size: 12, bold: true });
      header(sm, r0 + 1, [tr(headSrc)].concat(DIST, PROG), tf);
      keys.forEach(function (kv, k2) {
        var r = r0 + 2 + k2, reqs = REQ.filter(function (q) { return pick(q) === kv.key; });
        var st = Score.stats(reqs, items, target);
        sm.getCell(r, 1).value = kv.label;
        [1, 2, 3].forEach(function (lv, j) {
          sm.getCell(r, 2 + j).value = F('COUNTIFS(' + keyRange + ',$A' + r + ',' + R_LV + ',"L' + lv + '")', reqs.filter(function (q) { return q.level === lv; }).length);
        });
        sm.getCell(r, 5).value = F('SUM(B' + r + ':D' + r + ')', reqs.length);
        sm.getCell(r, 6).value = F('COUNTIFS(' + keyRange + ',$A' + r + ',' + R_LN + ',"<="&' + TGT + ')', st.inTarget);
        ST5.forEach(function (s5, j) {
          var f = j < 4 ? 'COUNTIFS(' + keyRange + ',$A' + r + ',' + R_LN + ',"<="&' + TGT + ',' + R_ST + ',"' + s5 + '")' : 'F' + r + '-SUM(G' + r + ':J' + r + ')';
          sm.getCell(r, 7 + j).value = F(f, [st.met, st.partial, st.unmet, st.na, st.none][j]);
        });
        var c12 = sm.getCell(r, 12);
        c12.value = F('IF(F' + r + '-J' + r + '=0,"—",G' + r + '/(F' + r + '-J' + r + '))', st.rate == null ? '—' : st.rate); c12.numFmt = '0%'; c12.alignment = { horizontal: 'right' };
        sm.getCell(r, 13).value = F(achievedF(keyRange, '$A' + r), lvName(st.achieved));
      });
      var tr2 = r0 + 2 + keys.length, all = Score.stats(REQ, items, target);
      sm.getCell(tr2, 1).value = tr('合计');
      for (var j = 2; j <= 11; j++) {
        var L = col(j), sum = 0;
        for (var rr = r0 + 2; rr < tr2; rr++) { var v = sm.getCell(rr, j).value; sum += (v && v.result) || 0; }
        sm.getCell(tr2, j).value = F('SUM(' + L + (r0 + 2) + ':' + L + (tr2 - 1) + ')', sum);
      }
      var ct = sm.getCell(tr2, 12);
      ct.value = F('IF(F' + tr2 + '-J' + tr2 + '=0,"—",G' + tr2 + '/(F' + tr2 + '-J' + tr2 + '))', all.rate == null ? '—' : all.rate); ct.numFmt = '0%'; ct.alignment = { horizontal: 'right' };
      sm.getCell(tr2, 13).value = F(achievedF(null), lvName(all.achieved));
      boxed(sm, r0 + 2, tr2, 13, true);
      return tr2;
    }

    var compKeys = B.components.map(function (c) { return { key: c.name, label: tr(c.name) }; });
    var chKeys = B.chapters.map(function (c) { return { key: c.id, label: chapterLabel(c) }; });
    var tComp = dimTable(12, '按架构组件', '架构组件', R_CO, compKeys, function (q) { return q.component; });
    var tCh = dimTable(tComp + 3, '按章', '章', R_CH, chKeys, function (q) { return q.chapter; });

    var r0 = tCh + 3;
    sm.getCell(r0, 1).value = tr('组件 × 章（全部等级的条目数）'); sm.getCell(r0, 1).font = font({ size: 12, bold: true });
    header(sm, r0 + 1, [tr('组件')].concat(B.chapters.map(function (c) { return c.id; }), [tr('合计')]));
    compKeys.forEach(function (kv, k2) {
      var r = r0 + 2 + k2;
      sm.getCell(r, 1).value = kv.label;
      B.chapters.forEach(function (ch, j) {
        var n = REQ.filter(function (q) { return q.component === kv.key && q.chapter === ch.id; }).length;
        sm.getCell(r, 2 + j).value = F('COUNTIFS(' + R_CO + ',$A' + r + ',' + R_CH + ',"' + chKeys[j].label + '")', n);
      });
      var lc = col(B.chapters.length + 1);
      sm.getCell(r, B.chapters.length + 2).value = F('SUM(B' + r + ':' + lc + r + ')', REQ.filter(function (q) { return q.component === kv.key; }).length);
    });
    var tx = r0 + 2 + compKeys.length;
    sm.getCell(tx, 1).value = tr('合计');
    for (var j2 = 2; j2 <= B.chapters.length + 2; j2++) {
      var L2 = col(j2), s2 = 0;
      for (var r2 = r0 + 2; r2 < tx; r2++) s2 += sm.getCell(r2, j2).value.result || 0;
      sm.getCell(tx, j2).value = F('SUM(' + L2 + (r0 + 2) + ':' + L2 + (tx - 1) + ')', s2);
    }
    boxed(sm, r0 + 2, tx, B.chapters.length + 2, true);
    var xr = 'B' + (r0 + 2) + ':' + col(B.chapters.length + 1) + (tx - 1), tl = 'B' + (r0 + 2);
    sm.addConditionalFormatting({ ref: xr, rules: [
      { type: 'expression', priority: 1, formulae: [tl + '>=8'], style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: C.heat2 } } } },
      { type: 'expression', priority: 2, formulae: ['AND(' + tl + '>=3,' + tl + '<8)'], style: { fill: { type: 'pattern', pattern: 'solid', bgColor: { argb: C.heat1 } } } },
      { type: 'expression', priority: 3, formulae: [tl + '=0'], style: { font: { color: { argb: C.faint } } } }
    ] });
    sm.getCell(tx + 1, 1).value = tr('颜色越深，该章越依赖这个组件落地。');
    sm.getCell(tx + 1, 1).font = font({ size: 9, italic: true, color: C.note });

    /* 差距清单（导出时生成的静态清单） */
    var gs = wb.addWorksheet(NM.gap, { views: [{ state: 'frozen', ySplit: 3 }] });
    [10, 18, 11, 56, 8, 9, 9, 11, 30].forEach(function (w, i) { gs.getColumn(i + 1).width = w; });
    gs.getCell('A1').value = tr('差距清单（目标等级 L{n}）', { n: target }); gs.getCell('A1').font = font({ size: 14, bold: true });
    gs.getCell('A2').value = tr('导出时按目标等级内、状态不是「已满足」或「不适用」的要求生成，按等级和编号排序。在评估表里改状态后，这一页不会自动更新，请重新导出。');
    gs.getCell('A2').font = font({ size: 9, italic: true, color: C.note });
    header(gs, 3, [tr('编号'), tr('章'), tr('落点组件'), tr('要求'), tr('最低等级'), tr('状态'), tr('负责人'), tr('计划完成'), tr('证据与说明')]);
    var gaps = REQ.filter(function (q) { var s = Score.statusOf(items, q.id); return q.level <= target && s !== 'met' && s !== 'na'; })
      .sort(function (a, b) { return a.level - b.level || REQ.indexOf(a) - REQ.indexOf(b); });
    gaps.forEach(function (q, i) {
      var it = items[q.id] || {}, r = 4 + i;
      var vals = [q.id, chName(q.chapter), tr(q.component), tr(q.text), 'L' + q.level, stLabel(it.status), it.owner || '', it.due || '', it.evidence || ''];
      vals.forEach(function (v, j) {
        var c = gs.getCell(r, j + 1);
        c.value = v; c.font = font(); c.border = BORDER;
        c.alignment = [1, 3, 5, 6].indexOf(j + 1) >= 0 ? { horizontal: 'center', vertical: 'top', wrapText: true } : { vertical: 'top', wrapText: true };
      });
      gs.getRow(r).height = fitHeight([[vals[1], 18], [vals[3], 56], [vals[8], 30]]);
    });
    if (!gaps.length) gs.getCell('A4').value = tr('目标等级内没有差距条目。');
    else gs.autoFilter = 'A3:I' + (3 + gaps.length);

    /* 架构视角 */
    var av = wb.addWorksheet(NM.arch);
    [12, 14, 40, 30, 10, 10, 10].forEach(function (w, i) { av.getColumn(i + 1).width = w; });
    av.getCell('A1').value = tr('架构视角'); av.getCell('A1').font = font({ size: 14, bold: true });
    av.getCell('A2').value = tr('对应基线第 4 章。落点组件指主要负责实现或强制执行该要求的组件，多个组件配合时取最主要的一个。');
    av.getCell('A2').font = font({ size: 9, italic: true, color: C.note });
    av.getCell('A4').value = tr('组件'); av.getCell('A4').font = font({ size: 12, bold: true });
    header(av, 5, [tr('组件'), '', tr('职责'), tr('信任假设'), 'L1', tr('L2 新增'), tr('L3 新增')]);
    av.mergeCells('A5:B5');
    B.components.forEach(function (cpt, k2) {
      var r = 6 + k2;
      av.getCell(r, 1).value = tr(cpt.name); av.mergeCells(r, 1, r, 2);
      av.getCell(r, 3).value = tr(cpt.duty); av.getCell(r, 4).value = tr(cpt.trust);
      [1, 2, 3].forEach(function (lv, j) {
        av.getCell(r, 5 + j).value = F('COUNTIFS(' + R_CO + ',$A' + r + ',' + R_LV + ',"L' + lv + '")', REQ.filter(function (q) { return q.component === cpt.name && q.level === lv; }).length);
      });
      for (var j = 1; j <= 7; j++) {
        var c = av.getCell(r, j); c.border = BORDER; c.font = font();
        c.alignment = j >= 5 ? { horizontal: 'center', vertical: 'middle' } : { vertical: 'top', wrapText: true };
      }
      av.getRow(r).height = fitHeight([[tr(cpt.duty), 40], [tr(cpt.trust), 30]]);
    });
    var ar = 6 + B.components.length + 1;
    av.getCell(ar, 1).value = tr('模型不承担任何控制：它的输出只是请求，相关要求落在 Harness 上。');
    av.getCell(ar, 1).font = font({ size: 9, italic: true, color: C.note });
    ar += 2;
    av.getCell(ar, 1).value = tr('一次工具调用的检查点'); av.getCell(ar, 1).font = font({ size: 12, bold: true });
    header(av, ar + 1, [tr('步骤'), tr('检查点'), tr('发生了什么'), tr('负责组件'), tr('相关要求'), '', '']);
    av.mergeCells(ar + 1, 5, ar + 1, 7);
    B.checkpoints.forEach(function (cp, k2) {
      var r = ar + 2 + k2, vals = [cp.step, tr(cp.name), tr(cp.what), tr(cp.components), cp.refs];
      vals.forEach(function (v, j) {
        var c = av.getCell(r, j + 1); c.value = v; c.border = BORDER; c.font = font();
        c.alignment = j === 0 ? { horizontal: 'center', vertical: 'middle' } : { vertical: 'top', wrapText: true };
      });
      av.mergeCells(r, 5, r, 7);
      av.getRow(r).height = fitHeight([[vals[2], 40], [vals[3], 30]]);
    });

    /* 说明 */
    var nt = wb.addWorksheet(NM.note);
    nt.getColumn(1).width = 16; nt.getColumn(2).width = 96;
    var c3 = B.counts;
    var statusNames = Score.STATUSES.map(function (s) { return stLabel(s.code); }).join(tr('、'));
    // k：标签（源文，用于判断是否是输入行）；v：内容；input：是否为评估者填写的黄色行
    // 每行：[标签, 内容, 样式, 是否为黄色填写格]，行号与原先一致
    var rows = [
      [tr(B.title) + ' ' + tr('评估表'), null, { size: 14, bold: true }],
      [tr('对应文档'), tr('{title} v{version}（{date}）。要求的完整上下文、术语、架构图、威胁模型和映射附录都在文档中。', { title: tr(B.title), version: B.version, date: B.date })],
      [tr('文档链接'), { text: docLink, hyperlink: docLink }],
      [tr('内容'), tr('共 {total} 条要求，分布在 {sections} 个小节：L1 {l1} 条，L2 在此基础上增加 {l2} 条，L3 再增加 {l3} 条。', { total: c3.total, sections: c3.sections, l1: c3.L1, l2: c3.L2, l3: c3.L3 })],
      ['', null],
      [tr('评估信息'), null, { bold: true }],
      [tr('评估对象'), meta.org || '', null, true],
      [tr('评估范围'), meta.scope || '', null, true],
      [tr('评估人'), meta.assessor || '', null, true],
      [tr('评估日期'), meta.date || '', null, true],
      [tr('目标等级'), 'L' + target],
      ['', null],
      [tr('怎么填'), null, { bold: true }],
      [tr('只填黄色列'), tr('状态、证据与说明、负责人、计划完成四列由评估者填写，其余列与基线保持一致，不在这里改。')],
      [tr('状态'), tr('下拉选择：{list}。整节因适用条件不成立而不适用时，该节每条都选「不适用」。', { list: statusNames })],
      [tr('等级'), tr('L1 底线，L2 标准，L3 增强；高等级包含低等级的全部要求。达到某级 = 该级及以下的适用要求全部满足。')],
      [tr('回到网页'), tr('这份表可以在自评网页的「数据」页导入，状态、证据、负责人和计划完成会按编号回填。')],
      ['', null],
      [tr('两个视角'), null, { bold: true }],
      [tr('章'), tr('回答「要求什么」。V1 至 V7 沿一次 Agent 行为的发生顺序排列，V8 至 V10 按跨会话持续存在的数据、Agent 和审计组织。')],
      [tr('落点组件'), tr('回答「在哪里实现」，顺序同基线 4.2 组件表。可按组件筛选后分派给对应团队。组件定义和检查点见「架构视角」页。')]
    ];
    rows.forEach(function (p, i) {
      var r = i + 1, a = nt.getCell(r, 1);
      a.value = p[0]; a.font = font(p[2] || {}); a.alignment = { vertical: 'top', wrapText: true };
      if (p[1] !== null && p[1] !== undefined) {
        var b = nt.getCell(r, 2);
        b.value = p[1]; b.alignment = { vertical: 'top', wrapText: true };
        b.font = (p[1] && p[1].hyperlink) ? font({ color: C.link, underline: true }) : font();
        if (p[3]) { b.fill = fill(C.input); b.border = BORDER; }
      }
      nt.getRow(r).height = fitHeight([[typeof p[1] === 'string' ? p[1] : '', 96]]);
    });
    nt.getRow(1).height = 26;

    [sm, gs, av, nt].forEach(function (s) { s.pageSetup = { orientation: 'landscape', fitToPage: true, fitToWidth: 1, fitToHeight: 0 }; });
    return wb;
  }

  /* ---------- 读取 ---------- */
  function text(v) {
    if (v == null) return '';
    if (v instanceof Date) return v.toISOString().slice(0, 10);
    if (typeof v === 'object') {
      if (v.richText) return v.richText.map(function (x) { return x.text; }).join('');
      if (v.text !== undefined) return String(v.text);
      if (v.result !== undefined) return text(v.result);
      if (v.formula !== undefined) return '';
      return '';
    }
    return String(v).trim();
  }

  /* 返回 { items, meta, target, matched, unknown, badStatus }
     opts.t：当前语言的翻译函数（用于报错信息）；opts.dicts：所有已注册词典（识别其他语言写出的状态与标签） */
  function parse(wb, B, Score, opts) {
    opts = opts || {};
    var tr = opts.t || ident, dicts = opts.dicts || [];
    /* 同一个中文词的所有写法：源文、当前语言、其他语言，以及它们的下拉列表安全写法 */
    var variants = function (src) {
      var out = [src, tr(src), listSafe(src), listSafe(tr(src))];
      dicts.forEach(function (d) { if (own.call(d, src) && typeof d[src] === 'string') out.push(d[src], listSafe(d[src])); });
      return out.filter(function (s, i, a) { return s && a.indexOf(s) === i; });
    };
    var codeOf = Object.create(null);
    Score.STATUSES.forEach(function (s) {
      variants(s.label).forEach(function (v) { if (!own.call(codeOf, v)) codeOf[v] = s.code; });
    });

    if (!wb.worksheets.length) throw new Error(tr('文件里没有工作表'));
    /* 按表头找列：用户在 Excel 里插入、删除或调整列之后仍能读对；表头认任何已知语言的写法 */
    var FIELD = { id: '编号', status: '状态', evidence: '证据与说明', owner: '负责人', due: '计划完成' };
    var colsOf = function (sheet) {
      var head = sheet.getRow(1), found = {};
      Object.keys(FIELD).forEach(function (f) {
        var vs = variants(FIELD[f]);
        for (var c = 1; c <= Math.max(head.cellCount, 20); c++) {
          if (vs.indexOf(text(head.getCell(c).value)) >= 0) { found[f] = c; break; }
        }
      });
      return found;
    };
    /* 评估表：第一张同时有「编号」和「状态」表头的工作表，不依赖表的顺序 */
    var ws = null, cols = null;
    for (var i = 0; i < wb.worksheets.length && !ws; i++) {
      var cc = colsOf(wb.worksheets[i]);
      if (cc.id && cc.status) { ws = wb.worksheets[i]; cols = cc; }
    }
    if (!ws) throw new Error(tr('找不到「编号」和「状态」两列，这不是本基线的评估表'));
    var known = Object.create(null); B.requirements.forEach(function (q) { known[q.id] = true; });
    var out = { items: Object.create(null), meta: {}, target: null, matched: 0, unknown: [], badStatus: [], missingCols: [] };
    /* 证据、负责人、计划完成三列找不到表头时不读取，避免把别的列读进来 */
    ['evidence', 'owner', 'due'].forEach(function (f) { if (!cols[f]) out.missingCols.push(tr(FIELD[f])); });
    var cell = function (row, f) { return cols[f] ? text(row.getCell(cols[f]).value) : ''; };
    ws.eachRow(function (row, r) {
      if (r === 1) return;
      var id = cell(row, 'id');
      if (!id) return;
      if (!known[id]) { out.unknown.push(id); return; }
      var label = cell(row, 'status');
      var code = own.call(codeOf, label) ? codeOf[label] : undefined;
      if (code === undefined) { if (label) out.badStatus.push(id); code = ''; }
      var it = { status: code };
      var ev = cell(row, 'evidence'), ow = cell(row, 'owner'), du = cell(row, 'due');
      if (ev) it.evidence = ev;
      if (ow) it.owner = ow;
      if (du) it.due = du;
      if (it.status || ev || ow || du) out.items[id] = it;
      out.matched++;
    });

    /* 其他工作表按表名找（任何已知语言的写法都认），找不到再按导出时的顺序取 */
    var byName = function (key) {
      var names = variants(SHEETS[key]).map(sheetName);
      for (var j = 0; j < wb.worksheets.length; j++) if (names.indexOf(wb.worksheets[j].name) >= 0) return wb.worksheets[j];
      var fb = wb.worksheets[SHEET_ORDER.indexOf(key)];
      return fb && fb !== ws ? fb : null;
    };
    /* 说明页：按标签匹配，取值在第 2 列 */
    var nt = byName('note');
    if (nt) {
      var keys = { org: '评估对象', scope: '评估范围', assessor: '评估人', date: '评估日期', target: '目标等级' };
      nt.eachRow(function (row) {
        var k = text(row.getCell(1).value), val = text(row.getCell(2).value);
        Object.keys(keys).forEach(function (f) {
          if (variants(keys[f]).indexOf(k) < 0) return;
          if (f === 'target') { var m = /L([123])/.exec(val); if (m) out.target = +m[1]; }
          else out.meta[f] = val;
        });
      });
    }
    /* 汇总页 B10：下拉选择的目标等级 */
    var sm = byName('sum');
    if (sm) { var m2 = /^L([123])$/.exec(text(sm.getCell('B10').value)); if (m2) out.target = +m2[1]; }
    return out;
  }

  return { build: build, parse: parse, SHEETS: SHEETS, SHEET_ORDER: SHEET_ORDER, HEADS: HEADS };
});
