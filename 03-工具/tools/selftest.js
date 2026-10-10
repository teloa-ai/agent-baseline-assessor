#!/usr/bin/env node
/* 自检：评分规则、xlsx 生成与回读、多语言词典与往返是否一致。用法：npm test */
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');
const B = require('../data/baseline.json');
const Score = require('../assets/score.js');
const Workbook = require('../assets/workbook.js');
const I18N = require('../assets/i18n.js');
const L10N = require('./i18n_node.js');

const DIR = path.join(__dirname, '..', 'i18n');
const CJK = /[぀-ヿ㐀-鿿가-힯豈-﫿]/; // 汉字、假名、谚文

const codes = ['met', 'partial', 'unmet', 'na', ''];
let seed = 7;
const rnd = () => (seed = (seed * 9301 + 49297) % 233280) / 233280;
const items = {};
B.requirements.forEach((q, i) => {
  const s = q.level === 1 && i % 9 ? 'met' : codes[Math.floor(rnd() * 5)];
  if (s || i % 3 === 0) items[q.id] = { status: s, evidence: i % 4 ? '' : `证据 ${q.id}\n第二行`, owner: i % 5 ? '' : '张三', due: i % 7 ? '' : '2026-12' };
});
const A = { target: 2, meta: { org: '示例公司 · Agent 平台', scope: '生产环境', assessor: '安全团队', date: '2026-10-07' }, items };

/* 把一个 xlsx 对象写到内存再读回，模拟用户下载后重新导入 */
async function roundTrip(wb) {
  const buf = await wb.xlsx.writeBuffer();
  const wb2 = new ExcelJS.Workbook();
  await wb2.xlsx.load(buf);
  return { buf, wb2 };
}
function strings(o, acc) {
  if (typeof o === 'string') acc.push(o);
  else if (Array.isArray(o)) o.forEach((x) => strings(x, acc));
  else if (o && typeof o === 'object') Object.values(o).forEach((x) => strings(x, acc));
  return acc;
}

(async () => {
  // 1. 评分规则的基本性质
  const all = Score.stats(B.requirements, items, 2);
  assert.strictEqual(all.inTarget, B.counts.L1 + B.counts.L2);
  assert.strictEqual(all.applicable, all.inTarget - all.na);
  assert.strictEqual(all.gap, all.partial + all.unmet + all.none);
  const allMet = Object.fromEntries(B.requirements.map(q => [q.id, { status: 'met' }]));
  assert.strictEqual(Score.achievedLevel(B.requirements, allMet), 3);
  assert.strictEqual(Score.achievedLevel(B.requirements, {}), 0);

  // 2. 多语言核心：zh-CN 原样返回，缺词条回退，{name} 占位符
  const L = L10N.init('zh-CN');
  assert.strictEqual(L.getLocale(), 'zh-CN');
  assert.strictEqual(L.t('底线'), '底线');
  assert.strictEqual(L.t('共 {n} 条，{m}', { n: 3, m: 'x' }), '共 3 条，x');
  assert.strictEqual(L.t('共 {n} 条'), '共 {n} 条');
  L.setLocale('en');
  assert.strictEqual(L.t('一个没有译文的词'), '一个没有译文的词', '缺词条应回退到中文');
  assert.strictEqual(L.t('底线'), 'Baseline', 'en 词典应生效');
  L.setLocale('zh-CN');
  assert.strictEqual(L.setLocale('xx'), 'zh-CN', '未知语言回退到 zh-CN');

  // 3. 生成 → 写出 → 读回（中文）
  const wb = Workbook.build(ExcelJS, B, A, Score);
  const { buf, wb2 } = await roundTrip(wb);
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

  // 4. 词典覆盖：每个存在的语言都要有非空译文，并覆盖基线与源文清单里的中文字符串
  const need = new Set(strings(B, []).filter((s) => CJK.test(s)));
  const srcFile = path.join(DIR, 'source-baseline.json');
  if (fs.existsSync(srcFile)) {
    const list = JSON.parse(fs.readFileSync(srcFile, 'utf8'));
    (Array.isArray(list) ? list : Object.keys(list)).filter((s) => CJK.test(s)).forEach((s) => need.add(s));
  }
  // 代码里的界面文字：I18N.t('…')、data-i18n 和 data-i18n-attr 指向的属性值，以及热力表里截取的信任标签
  const ROOT = path.join(__dirname, '..');
  const unq = (s) => s.replace(/\\'/g, "'").replace(/\\"/g, '"').replace(/\\\\/g, '\\');
  for (const f of ['assets/app.js', 'assets/charts.js', 'assets/workbook.js']) {
    const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
    for (const m of src.matchAll(/I18N\.t\(\s*'((?:[^'\\]|\\.)*)'/g)) if (CJK.test(m[1])) need.add(unq(m[1]));
  }
  const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
  for (const m of html.matchAll(/data-i18n="([^"]*)"/g)) if (CJK.test(m[1])) need.add(m[1]);
  for (const m of html.matchAll(/<[^>]*data-i18n-attr="([^"]+)"[^>]*>/g)) {
    for (const a of m[1].split('|')) {
      const v = m[0].match(new RegExp('\\s' + a.trim() + '="([^"]*)"'));
      if (v && CJK.test(v[1])) need.add(v[1]);
    }
  }
  B.components.forEach((c) => need.add(c.trust.split(/[，；]/)[0]));
  const present = I18N.LOCALES.filter((l) => l.code !== I18N.SOURCE && fs.existsSync(path.join(DIR, l.code + '.json')));
  for (const { code } of present) {
    const dict = JSON.parse(fs.readFileSync(path.join(DIR, code + '.json'), 'utf8'));
    for (const [k, v] of Object.entries(dict)) assert.ok(typeof v === 'string' && v.trim() !== '', `${code}：「${k}」的译文为空`);
    const missing = [...need].filter((s) => !Object.prototype.hasOwnProperty.call(dict, s));
    assert.deepStrictEqual(missing, [], `${code}.json 缺少 ${missing.length} 条中文字符串：${missing.join('；')}`);
  }

  // 5. 其他语言导出的 Excel 能导回同样的评分结果
  for (const { code } of present) {
    L10N.init(code);
    const wbL = Workbook.build(ExcelJS, B, A, Score, { t: I18N.t });
    const { wb2: wbBack } = await roundTrip(wbL);
    const pl = Workbook.parse(wbBack, B, Score, { t: I18N.t, dicts: I18N.dictionaries() });
    assert.strictEqual(pl.matched, B.requirements.length, code + ' 条数');
    assert.deepStrictEqual(pl.unknown, [], code + ' 未知编号');
    assert.deepStrictEqual(pl.badStatus, [], code + ' 状态无法识别');
    assert.strictEqual(pl.target, 2, code + ' 目标等级');
    assert.deepStrictEqual(pl.meta, A.meta, code + ' 评估信息');
    for (const q of B.requirements) {
      const a = items[q.id] || {}, b = pl.items[q.id] || {};
      assert.strictEqual(b.status || '', a.status || '', `${code} ${q.id} 状态`);
      assert.strictEqual(b.evidence || '', a.evidence || '', `${code} ${q.id} 证据`);
      assert.strictEqual(b.owner || '', a.owner || '', `${code} ${q.id} 负责人`);
      assert.strictEqual(b.due || '', a.due || '', `${code} ${q.id} 计划完成`);
    }
  }
  L10N.init('zh-CN');

  if (process.argv[2]) { fs.writeFileSync(process.argv[2], Buffer.from(buf)); }
  console.log(`ok：${B.requirements.length} 条往返一致（中文与 ${present.length} 种其他语言）；目标 L2 满足率 ${Math.round(all.rate * 100)}%，达成 ${Score.levelName(all.achieved)}，差距 ${all.gap} 条`);
})().catch((e) => { console.error(e.message || e); process.exit(1); });
