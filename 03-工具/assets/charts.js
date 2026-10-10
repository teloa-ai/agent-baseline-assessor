/* 图表：雷达图、章节成熟度、差距分布。输出纯 SVG 字符串，屏幕与导出共用一套绘制。 */
(function (root) {
  'use strict';

  var FONT = "'IBM Plex Sans', -apple-system, 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Noto Sans SC', system-ui, sans-serif";
  var MONO = "'IBM Plex Mono', ui-monospace, Menlo, Consolas, monospace";

  /* 导出图片固定用浅色，方便放进报告 */
  var LIGHT = {
    surface: '#ffffff', ink: '#101828', ink2: '#475467', muted: '#667085', grid: '#e8ebf0', axis: '#d0d5dd',
    s1: '#2a78d6', s1light: '#b7d3f6', s1dark: '#1c5cab', compare: '#98a2b3',
    good: '#1e9e5a', warning: '#e5a50a', critical: '#d64545', neutral: '#d0d5dd'
  };

  function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
  function pct(v) { return v == null ? '—' : Math.round(v * 100) + '%'; }
  function n1(x) { return Math.round(x * 10) / 10; }
  function T(t, x, y, o) {
    o = o || {};
    return '<text x="' + n1(x) + '" y="' + n1(y) + '"' + (o.anchor ? ' text-anchor="' + o.anchor + '"' : '') +
      ' font-size="' + (o.size || 12) + '"' + (o.weight ? ' font-weight="' + o.weight + '"' : '') +
      (o.mono ? ' font-family="' + MONO + '"' : '') + ' fill="' + o.fill + '">' + esc(t) + '</text>';
  }
  function tipAttr(tip) { return ' data-tip="' + esc(tip) + '" tabindex="0" role="img" aria-label="' + esc(tip) + '"'; }

  /* ---------- 雷达图 ---------- */
  function radar(opt, P) {
    var axes = opt.axes, n = axes.length;
    var W = 600, H = 492, cx = W / 2, cy = 232, R = 150;
    var ang = function (i) { return -Math.PI / 2 + i * 2 * Math.PI / n; };
    var pt = function (i, v) { var a = ang(i); return [cx + Math.cos(a) * R * v, cy + Math.sin(a) * R * v]; };
    var poly = function (vals) { return vals.map(function (v, i) { return pt(i, v == null ? 0 : v).map(n1).join(','); }).join(' '); };
    var s = '';
    [0.25, 0.5, 0.75].forEach(function (k) {
      s += '<polygon points="' + poly(axes.map(function () { return k; })) + '" fill="none" stroke="' + P.grid + '" stroke-width="1"/>';
    });
    s += '<polygon points="' + poly(axes.map(function () { return 1; })) + '" fill="none" stroke="' + P.axis + '" stroke-width="1"/>';
    axes.forEach(function (_, i) { var p = pt(i, 1); s += '<line x1="' + cx + '" y1="' + cy + '" x2="' + n1(p[0]) + '" y2="' + n1(p[1]) + '" stroke="' + P.grid + '" stroke-width="1"/>'; });
    [0.5, 1].forEach(function (k) { s += T(Math.round(k * 100) + '%', cx + 4, cy - R * k - 4, { size: 10, fill: P.muted }); });
    if (opt.compare) {
      s += '<polygon points="' + poly(axes.map(function (a) { return a.compare; })) + '" fill="none" stroke="' + P.compare + '" stroke-width="1.5" stroke-linejoin="round"/>';
    }
    s += '<polygon points="' + poly(axes.map(function (a) { return a.value; })) + '" fill="' + P.s1 + '" fill-opacity="0.12" stroke="' + P.s1 + '" stroke-width="2" stroke-linejoin="round"/>';
    axes.forEach(function (a, i) {
      var p = pt(i, a.value == null ? 0 : a.value);
      s += '<circle cx="' + n1(p[0]) + '" cy="' + n1(p[1]) + '" r="4" fill="' + (a.value == null ? P.surface : P.s1) + '" stroke="' + (a.value == null ? P.muted : P.surface) + '" stroke-width="2"' + tipAttr(a.tip) + '/>';
    });
    axes.forEach(function (a, i) {
      var c = Math.cos(ang(i)), sn = Math.sin(ang(i));
      var x = cx + c * (R + 16), y = cy + sn * (R + 16);
      var anchor = c > 0.25 ? 'start' : (c < -0.25 ? 'end' : 'middle');
      var dy = sn < -0.6 ? -18 : (sn > 0.6 ? 10 : -2);
      var code = a.code ? a.code + ' ' : '';
      s += '<g' + tipAttr(a.tip) + '>' +
        '<text x="' + n1(x) + '" y="' + n1(y + dy) + '" text-anchor="' + anchor + '" font-size="12" fill="' + P.ink + '">' +
        (code ? '<tspan font-family="' + MONO + '" font-size="11" fill="' + P.muted + '">' + esc(code) + '</tspan>' : '') + esc(a.label) + '</text>' +
        T(pct(a.value) + (opt.compare ? '  对比 ' + pct(a.compare) : ''), x, y + dy + 15, { anchor: anchor, size: 11.5, weight: 600, fill: P.ink2 }) + '</g>';
    });
    var ly = H - 12, lx = 0;
    s += '<line x1="' + lx + '" y1="' + (ly - 4) + '" x2="' + (lx + 16) + '" y2="' + (ly - 4) + '" stroke="' + P.s1 + '" stroke-width="2"/>' + T(opt.currentLabel || '本次评估', lx + 22, ly, { size: 11.5, fill: P.ink2 });
    if (opt.compare) {
      lx += 22 + 12 * (opt.currentLabel || '本次评估').length + 20;
      s += '<line x1="' + lx + '" y1="' + (ly - 4) + '" x2="' + (lx + 16) + '" y2="' + (ly - 4) + '" stroke="' + P.compare + '" stroke-width="1.5"/>' + T(opt.compareLabel || '对比', lx + 22, ly, { size: 11.5, fill: P.ink2 });
    }
    s += T('外圈 = 目标等级内的适用要求全部满足', W, ly, { anchor: 'end', size: 11.5, fill: P.muted });
    return { w: W, h: H, body: s };
  }

  /* ---------- 章节成熟度（表格式图） ---------- */
  function maturity(opt, P) {
    var rows = opt.rows, t = opt.target, W = 640, top = 58, step = 38;
    var H = top + rows.length * step + 30;
    var lx = [236, 276, 316, 356], bx = 400, bw = 150, gx = W;
    var s = '';
    s += T('章', 0, 16, { size: 11.5, fill: P.muted }) + T('达成等级', 296, 16, { anchor: 'middle', size: 11.5, fill: P.muted }) +
      T('满足率', bx, 16, { size: 11.5, fill: P.muted }) + T('差距', gx, 16, { anchor: 'end', size: 11.5, fill: P.muted });
    ['未达', 'L1', 'L2', 'L3'].forEach(function (k, i) {
      s += T(k, lx[i], 34, { anchor: 'middle', size: 10.5, weight: i === t ? 600 : 400, fill: i === t ? P.ink : P.muted, mono: i > 0 });
    });
    s += '<line x1="0" y1="42" x2="' + W + '" y2="42" stroke="' + P.axis + '" stroke-width="1"/>';
    rows.forEach(function (r, i) {
      var y = top + i * step + 4;
      if (i > 0) s += '<line x1="0" y1="' + (y - step / 2 - 2) + '" x2="' + W + '" y2="' + (y - step / 2 - 2) + '" stroke="' + P.grid + '" stroke-width="1"/>';
      s += '<g' + tipAttr(r.tip) + '>' + T(r.code, 0, y + 4, { size: 11.5, fill: P.muted, mono: true }) + T(r.name, 34, y + 4, { size: 13, fill: P.ink }) + '</g>';
      s += '<line x1="' + lx[0] + '" y1="' + y + '" x2="' + lx[3] + '" y2="' + y + '" stroke="' + P.grid + '" stroke-width="2" stroke-linecap="round"/>';
      lx.forEach(function (x) { s += '<circle cx="' + x + '" cy="' + y + '" r="2.5" fill="' + P.axis + '"/>'; });
      if (r.achieved < t) s += '<line x1="' + lx[r.achieved] + '" y1="' + y + '" x2="' + lx[t] + '" y2="' + y + '" stroke="' + P.s1light + '" stroke-width="4" stroke-linecap="round"/>';
      s += '<circle cx="' + lx[t] + '" cy="' + y + '" r="6.5" fill="' + P.surface + '" stroke="' + P.s1dark + '" stroke-width="2"/>';
      s += '<circle cx="' + lx[r.achieved] + '" cy="' + y + '" r="5" fill="' + P.s1 + '" stroke="' + P.surface + '" stroke-width="2"' + tipAttr(r.name + '：当前达成 ' + (r.achieved ? 'L' + r.achieved : '未达 L1') + '，目标 L' + t) + '/>';
      var rate = r.rate == null ? 0 : r.rate;
      s += '<rect x="' + bx + '" y="' + (y - 3) + '" width="' + bw + '" height="6" rx="3" fill="' + P.grid + '"/>';
      if (rate > 0) s += '<rect x="' + bx + '" y="' + (y - 3) + '" width="' + n1(Math.max(6, bw * rate)) + '" height="6" rx="3" fill="' + P.s1 + '"' + tipAttr(r.name + '：满足率 ' + pct(r.rate)) + '/>';
      if (opt.compare && r.compare != null) s += '<line x1="' + n1(bx + bw * r.compare) + '" y1="' + (y - 7) + '" x2="' + n1(bx + bw * r.compare) + '" y2="' + (y + 7) + '" stroke="' + P.ink2 + '" stroke-width="1.5"/>';
      s += T(pct(r.rate), bx + bw + 10, y + 4, { size: 12.5, weight: 600, fill: P.ink });
      s += T(r.gap ? String(r.gap) : '达标', gx, y + 4, { anchor: 'end', size: 12.5, weight: r.gap ? 600 : 400, fill: r.gap ? P.ink : P.ink2 });
    });
    var ly = H - 8, x = 0;
    s += '<circle cx="' + (x + 5) + '" cy="' + (ly - 4) + '" r="4.5" fill="' + P.s1 + '"/>' + T('当前', x + 14, ly, { size: 11.5, fill: P.ink2 });
    x += 54;
    s += '<circle cx="' + (x + 5) + '" cy="' + (ly - 4) + '" r="5" fill="' + P.surface + '" stroke="' + P.s1dark + '" stroke-width="2"/>' + T('目标', x + 15, ly, { size: 11.5, fill: P.ink2 });
    x += 56;
    if (opt.compare) { s += '<line x1="' + (x + 5) + '" y1="' + (ly - 10) + '" x2="' + (x + 5) + '" y2="' + (ly + 2) + '" stroke="' + P.ink2 + '" stroke-width="1.5"/>' + T('对比时的满足率', x + 14, ly, { size: 11.5, fill: P.ink2 }); }
    s += T('达到某级 = 该级及以下的适用要求全部满足', W, ly, { anchor: 'end', size: 11.5, fill: P.muted });
    return { w: W, h: H, body: s };
  }

  /* ---------- 差距分布（水平堆叠条） ---------- */
  function gapBars(opt, P) {
    var rows = opt.rows.filter(function (r) { return r.total > 0; });
    var W = 600, top = 6, step = 32, x0 = 104, x1 = 548, bar = 12;
    var H = top + Math.max(rows.length, 1) * step + 40;
    var max = Math.max.apply(null, rows.map(function (r) { return r.total; }).concat([1]));
    var k = (x1 - x0) / max;
    var parts = [
      { key: 'unmet', label: '未满足', color: P.critical },
      { key: 'partial', label: '部分满足', color: P.warning },
      { key: 'none', label: '未评估', color: P.neutral }
    ];
    var s = '';
    if (!rows.length) s += T('目标等级内没有差距条目', W / 2, top + 30, { anchor: 'middle', size: 13, fill: P.ink2 });
    rows.forEach(function (r, i) {
      var y = top + i * step + 4, x = x0, segs = parts.filter(function (p) { return r[p.key] > 0; });
      s += T(r.label, x0 - 12, y + bar / 2 + 4, { anchor: 'end', size: 12.5, fill: P.ink });
      s += '<rect x="' + x0 + '" y="' + y + '" width="' + (x1 - x0) + '" height="' + bar + '" rx="3" fill="' + P.grid + '" fill-opacity="0.55"/>';
      segs.forEach(function (p, j) {
        var lastSeg = j === segs.length - 1, w = Math.max(r[p.key] * k - (lastSeg ? 0 : 2), 2);
        var tip = r.label + '：' + p.label + ' ' + r[p.key] + ' 条';
        var rl = j === 0 ? 3 : 0, rr = lastSeg ? 3 : 0;
        s += '<path d="' + roundRect(x, y, w, bar, rl, rr) + '" fill="' + p.color + '"' + tipAttr(tip) + '/>';
        x += w + (lastSeg ? 0 : 2);
      });
      s += T(String(r.total), x + 8, y + bar / 2 + 4, { size: 12.5, weight: 600, fill: P.ink });
    });
    var ly = H - 8, lx = 0;
    parts.forEach(function (p) {
      s += '<rect x="' + lx + '" y="' + (ly - 9) + '" width="10" height="10" rx="2" fill="' + p.color + '"/>' + T(p.label, lx + 16, ly, { size: 11.5, fill: P.ink2 });
      lx += 16 + p.label.length * 12 + 18;
    });
    s += T('单位：条，只计目标等级内的适用要求', W, ly, { anchor: 'end', size: 11.5, fill: P.muted });
    return { w: W, h: H, body: s };
  }
  function roundRect(x, y, w, h, rl, rr) {
    rl = Math.min(rl, w / 2); rr = Math.min(rr, w / 2);
    return 'M' + n1(x + rl) + ' ' + y + 'H' + n1(x + w - rr) + (rr ? 'Q' + n1(x + w) + ' ' + y + ' ' + n1(x + w) + ' ' + (y + rr) : '') +
      'V' + (y + h - rr) + (rr ? 'Q' + n1(x + w) + ' ' + (y + h) + ' ' + n1(x + w - rr) + ' ' + (y + h) : '') +
      'H' + n1(x + rl) + (rl ? 'Q' + n1(x) + ' ' + (y + h) + ' ' + n1(x) + ' ' + (y + h - rl) : '') +
      'V' + (y + rl) + (rl ? 'Q' + n1(x) + ' ' + y + ' ' + n1(x + rl) + ' ' + y : '') + 'Z';
  }

  function svg(chart, label) {
    return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ' + chart.w + ' ' + chart.h + '" font-family="' + FONT + '" role="group" aria-label="' + esc(label || '') + '" style="overflow:visible">' + chart.body + '</svg>';
  }

  /* 导出：标题、副标题、页脚和白底 */
  function exportSvg(chart, head) {
    var P = LIGHT, pad = 40, hh = head.subtitle ? 92 : 68, fh = 44;
    var W = chart.w + pad * 2, H = chart.h + hh + fh;
    return '<svg xmlns="http://www.w3.org/2000/svg" width="' + W + '" height="' + H + '" viewBox="0 0 ' + W + ' ' + H + '" font-family="' + FONT + '">' +
      '<rect width="' + W + '" height="' + H + '" fill="#ffffff"/>' +
      T(head.eyebrow || '', pad, 30, { size: 11.5, fill: P.muted }) +
      T(head.title, pad, 54, { size: 19, weight: 600, fill: P.ink }) +
      (head.subtitle ? T(head.subtitle, pad, 76, { size: 12.5, fill: P.ink2 }) : '') +
      '<g transform="translate(' + pad + ',' + hh + ')">' + chart.body + '</g>' +
      '<line x1="' + pad + '" y1="' + (H - fh + 8) + '" x2="' + (W - pad) + '" y2="' + (H - fh + 8) + '" stroke="' + P.grid + '"/>' +
      T(head.footer || '', pad, H - 16, { size: 11, fill: P.muted }) + '</svg>';
  }

  function toPng(svgText, scale) {
    return new Promise(function (resolve, reject) {
      var m = /width="(\d+)" height="(\d+)"/.exec(svgText);
      var w = +m[1], h = +m[2], k = scale || 2;
      var img = new Image();
      img.onload = function () {
        var c = document.createElement('canvas');
        c.width = w * k; c.height = h * k;
        var g = c.getContext('2d');
        g.scale(k, k);
        g.drawImage(img, 0, 0, w, h);
        c.toBlob(function (b) { b ? resolve(b) : reject(new Error('toBlob failed')); }, 'image/png');
      };
      img.onerror = function () { reject(new Error('svg render failed')); };
      img.src = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svgText);
    });
  }

  root.Charts = { LIGHT: LIGHT, radar: radar, maturity: maturity, gapBars: gapBars, svg: svg, exportSvg: exportSvg, toPng: toPng, pct: pct };
})(typeof self !== 'undefined' ? self : this);
