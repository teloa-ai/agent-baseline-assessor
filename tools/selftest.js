#!/usr/bin/env node
/* 自检：评分规则、xlsx 生成与回读是否一致。用法：npm test */
const assert = require('assert');
const ExcelJS = require('exceljs');
const B = require('../data/baseline.json');
const Score = require('../assets/score.js');
const Workbook = require('../assets/workbook.js');

const codes = ['met', 'partial', 'unmet', 'na', ''];
let seed = 7;
const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
const items = {};
B.requirements.forEach((q, i) => {
  const s = q.level === 1 && i % 9 ? 'met' : codes[Math.floor(rnd() * 5)];
  if (s || i % 3 === 0) items[q.id] = { status: s, evidence: i % 4 ? '' : `证据 ${q.id}\n第二行`, owner: i % 5 ? '' : '张三', due: i % 7 ? '' : '2026-12' };
});
const A = { target: 2, meta: { org: '示例公司 · Agent 平台', scope: '生产环境', assessor: '安全团队', date: '2026-10-07' }, items };

(async () => {
  // 1. 评分规则的基本性质
  const all = Score.stats(B.requirements, items, 2);
  assert.strictEqual(all.inTarget, B.counts.L1 + B.counts.L2);
  assert.strictEqual(all.applicable, all.inTarget - all.na);
  assert.strictEqual(all.gap, all.partial + all.unmet + all.none);
  const allMet = Object.fromEntries(B.requirements.map(q => [q.id, { status: 'met' }]));
  assert.strictEqual(Score.achievedLevel(B.requirements, allMet), 3);
  assert.strictEqual(Score.achievedLevel(B.requirements, {}), 0);

  // 2. 生成 → 写出 → 读回
  const wb = Workbook.build(ExcelJS, B, A, Score);
  const buf = await wb.xlsx.writeBuffer();
  const wb2 = new ExcelJS.Workbook();
  await wb2.xlsx.load(buf);
  const p = Workbook.parse(wb2, B, Score);
  assert.strictEqual(p.matched, B.requirements.length);
  assert.deepStrictEqual(p.unknown, []);
  assert.strictEqual(p.target, 2);
  assert.deepStrictEqual(p.meta, A.meta);
  for (const q of B.requirements) {
    const a = items[q.id] || {}, b = p.items[q.id] || {};
    assert.strictEqual(b.status || '', a.status || '', q.id + ' 状态');
    assert.strictEqual(b.evidence || '', a.evidence || '', q.id + ' 证据');
    assert.strictEqual(b.owner || '', a.owner || '', q.id + ' 负责人');
    assert.strictEqual(b.due || '', a.due || '', q.id + ' 计划完成');
  }
  if (process.argv[2]) { require('fs').writeFileSync(process.argv[2], Buffer.from(buf)); }
  console.log(`ok：${B.requirements.length} 条往返一致；目标 L2 满足率 ${Math.round(all.rate * 100)}%，达成 ${Score.levelName(all.achieved)}，差距 ${all.gap} 条`);
})().catch(e => { console.error(e); process.exit(1); });
