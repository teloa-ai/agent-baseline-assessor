/* 用 LibreOffice 独立重算导出的 Excel，再和网页的评分结果逐格比对。
   npm test 只核对字段往返；这个脚本核对公式本身，需要本机装有 LibreOffice（soffice）。
   用法：node tools/xlsx_crosscheck.js [样例 JSON]；默认核对所有语言，ASSESSOR_LANG=fr 只核对一种 */
'use strict';
const fs = require('fs');
const os = require('os');
const path = require('path');
const { execFileSync } = require('child_process');
const ExcelJS = require('exceljs');
const B = require('../data/baseline.json');
const Score = require('../assets/score.js');
const WB = require('../assets/workbook.js');
const L10N = require('./i18n_node.js');

/* 没有指定 ASSESSOR_LANG 时，逐个语言各跑一遍（表名、标签和公式里的文字随语言变化，都要核对） */
if (!process.env.ASSESSOR_LANG) {
  const { spawnSync } = require('child_process');
  const codes = require('../assets/i18n.js').LOCALES.map((l) => l.code);
  let worst = 0;
  for (const code of codes) {
    console.log(`── ${code}`);
    const r = spawnSync(process.execPath, [__filename].concat(process.argv.slice(2)), { stdio: 'inherit', env: Object.assign({}, process.env, { ASSESSOR_LANG: code }) });
    worst = Math.max(worst, r.status == null ? 2 : r.status);
  }
  process.exit(worst);
}
const I18N = L10N.init(L10N.localeFromEnv());
const lvName = (n) => (n ? Score.levelName(n) : I18N.t('未达 L1'));

const R = B.requirements;
const sampleFile = process.argv[2];
const sample = sampleFile ? JSON.parse(fs.readFileSync(sampleFile, 'utf8')).items : Object.fromEntries(R.map((q, i) => [q.id, { status: ['met', 'partial', 'unmet', 'na', ''][i % 5] }]));
const all = (st) => Object.fromEntries(R.map((q) => [q.id, { status: st }]));
const cases = {
  sample_l1: { target: 1, items: sample },
  sample_l2: { target: 2, items: sample },
  sample_l3: { target: 3, items: sample },
  all_na: { target: 2, items: all('na') },
  all_met: { target: 3, items: all('met') },
  empty: { target: 2, items: {} },
};

const work = fs.mkdtempSync(path.join(os.tmpdir(), 'xlsx-check-'));
const profile = path.join(work, 'profile');
fs.mkdirSync(path.join(profile, 'user'), { recursive: true });
// 强制 LibreOffice 打开 xlsx 时重算全部公式，不使用文件里缓存的结果
fs.writeFileSync(path.join(profile, 'user', 'registrymodifications.xcu'),
  '<?xml version="1.0" encoding="UTF-8"?><oor:items xmlns:oor="http://openoffice.org/2001/registry" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">' +
  '<item oor:path="/org.openoffice.Office.Calc/Formula/Load"><prop oor:name="OOXMLRecalcMode" oor:op="fuse"><value>0</value></prop></item></oor:items>');

const val = (c) => { let x = c.value; if (x && x.richText) x = x.richText.map((t) => t.text).join(''); if (x && typeof x === 'object' && 'formula' in x) return x.result === undefined ? 0 : x.result; return x; }; // ExcelJS 读不到值为 0 的缓存结果
const same = (a, b) => a === b || (typeof a === 'number' && typeof b === 'number' && Math.abs(a - b) < 1e-9);

(async () => {
  const files = [];
  for (const [name, A] of Object.entries(cases)) {
    const wb = WB.build(ExcelJS, B, Object.assign({ meta: {} }, A), Score, { t: I18N.t });
    const f = path.join(work, name + '.xlsx');
    await wb.xlsx.writeFile(f);
    files.push(f);
  }
  const out = path.join(work, 'recalc');
  execFileSync('soffice', ['-env:UserInstallation=file://' + profile, '--headless', '--calc', '--convert-to', 'xlsx', '--outdir', out].concat(files), { stdio: 'ignore', timeout: 300000 });

  let failed = 0;
  for (const [name, A] of Object.entries(cases)) {
    const wb = new ExcelJS.Workbook();
    await wb.xlsx.readFile(path.join(out, name + '.xlsx'));
    const sm = wb.worksheets[1];
    const bad = [];
    [1, 2, 3].forEach((L, i) => {
      const s = Score.stats(R, A.items, L);
      const want = [s.inTarget, s.met, s.partial, s.unmet, s.na, s.none, s.rate == null ? '—' : s.rate, s.gap === 0 ? I18N.t('已达到') : I18N.t('未达到')];
      [2, 3, 4, 5, 6, 7, 8, 9].forEach((j, k) => { const g = val(sm.getCell(5 + i, j)); if (!same(g, want[k])) bad.push(`L${L} 第 ${j} 列：Excel ${g}，网页 ${want[k]}`); });
    });
    const rows = {};
    sm.eachRow((row, r) => { const a = val(row.getCell(1)); if (typeof a === 'string') (rows[a] = rows[a] || []).push(r); });
    const dims = B.components.map((c) => [I18N.t(c.name), R.filter((q) => q.component === c.name)])
      .concat(B.chapters.map((c) => [c.id + ' ' + I18N.t(c.name), R.filter((q) => q.chapter === c.id)]));
    dims.forEach(([label, reqs]) => {
      const s = Score.stats(reqs, A.items, A.target);
      const want = [s.inTarget, s.met, s.partial, s.unmet, s.na, s.none, s.rate == null ? '—' : s.rate, lvName(s.achieved)];
      const r = (rows[label] || [])[0];
      if (!r) { bad.push(`找不到「${label}」行`); return; }
      [6, 7, 8, 9, 10, 11, 12, 13].forEach((j, k) => { const g = val(sm.getCell(r, j)); if (!same(g, want[k])) bad.push(`${label} 第 ${j} 列：Excel ${g}，网页 ${want[k]}`); });
    });
    failed += bad.length;
    console.log(name.padEnd(10), bad.length ? '不一致\n  ' + bad.slice(0, 10).join('\n  ') : '一致');
  }
  fs.rmSync(work, { recursive: true, force: true });
  process.exit(failed ? 1 : 0);
})().catch((e) => { console.error(e.message); process.exit(2); });
