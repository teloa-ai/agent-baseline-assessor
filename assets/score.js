/* 评分规则。浏览器里挂在 window.Score，Node 里用 require 引入。 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.Score = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var STATUSES = [
    { code: '', label: '未评估' },
    { code: 'met', label: '已满足' },
    { code: 'partial', label: '部分满足' },
    { code: 'unmet', label: '未满足' },
    { code: 'na', label: '不适用' }
  ];
  var LABEL = Object.create(null), CODE = Object.create(null);
  STATUSES.forEach(function (s) { LABEL[s.code] = s.label; CODE[s.label] = s.code; });

  function statusOf(items, id) {
    var it = items && items[id];
    return (it && it.status) || '';
  }

  /* 达成等级：所有「最低等级 ≤ L」且适用的要求都已满足，才算达到 L。返回 0..3 */
  function achievedLevel(reqs, items) {
    var a = 0;
    for (var L = 1; L <= 3; L++) {
      var ok = true;
      for (var i = 0; i < reqs.length; i++) {
        var q = reqs[i];
        if (q.level > L) continue;
        var s = statusOf(items, q.id);
        if (s !== 'met' && s !== 'na') { ok = false; break; }
      }
      if (!ok) break;
      a = L;
    }
    return a;
  }

  /* 一组要求在目标等级下的统计。满足率 = 已满足 ÷ 适用条目；未评估按未满足计 */
  function stats(reqs, items, target) {
    var r = { total: reqs.length, inTarget: 0, applicable: 0, met: 0, partial: 0, unmet: 0, na: 0, none: 0, gap: 0, assessed: 0, rate: null, achieved: 0 };
    for (var i = 0; i < reqs.length; i++) {
      var q = reqs[i], s = statusOf(items, q.id);
      if (s) r.assessed++;
      if (q.level > target) continue;
      r.inTarget++;
      if (s === 'na') { r.na++; continue; }
      r.applicable++;
      if (s === 'met') r.met++;
      else {
        r.gap++;
        if (s === 'partial') r.partial++;
        else if (s === 'unmet') r.unmet++;
        else r.none++;
      }
    }
    r.rate = r.applicable ? r.met / r.applicable : null;
    r.achieved = achievedLevel(reqs, items);
    return r;
  }

  function levelName(n) { return n > 0 ? 'L' + n : '未达 L1'; }

  function groupBy(reqs, key) {
    var m = {};
    reqs.forEach(function (q) { (m[q[key]] = m[q[key]] || []).push(q); });
    return m;
  }

  return { STATUSES: STATUSES, LABEL: LABEL, CODE: CODE, statusOf: statusOf, achievedLevel: achievedLevel, stats: stats, levelName: levelName, groupBy: groupBy };
});
