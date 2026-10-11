#!/usr/bin/env node
/* 用基线数据和各语言词典生成 README 里的「覆盖范围」表，保证 README、工具和正文的章名一致。
   只改写 <!-- coverage:start --> 与 <!-- coverage:end --> 之间的内容。用法：npm run build:readme */
'use strict';
const fs = require('fs');
const path = require('path');
const B = require('../data/baseline.json');

const ROOT = path.join(__dirname, '..', '..');
const DIR = path.join(__dirname, '..', 'i18n');
const HEAD = {
  'zh-CN': ['章', '名称', '回答的问题', 'L1', 'L2 新增', 'L3 新增', '合计', '合计'],
  en: ['Chapter', 'Name', 'Question it answers', 'L1', 'L2 adds', 'L3 adds', 'Total', 'Total'],
  ja: ['章', '名称', '答える問い', 'L1', 'L2 追加', 'L3 追加', '計', '合計'],
  ko: ['장', '이름', '답하는 질문', 'L1', 'L2 추가', 'L3 추가', '합계', '합계'],
  de: ['Kapitel', 'Name', 'Beantwortete Frage', 'L1', 'L2 zusätzlich', 'L3 zusätzlich', 'Summe', 'Summe'],
  fr: ['Chapitre', 'Nom', 'Question traitée', 'L1', 'Ajouts L2', 'Ajouts L3', 'Total', 'Total'],
  es: ['Capítulo', 'Nombre', 'Pregunta que responde', 'L1', 'Añade L2', 'Añade L3', 'Total', 'Total']
};
const FILE = (code) => path.join(ROOT, code === 'en' ? 'README.md' : `README.${code}.md`);

for (const code of Object.keys(HEAD)) {
  const f = FILE(code);
  if (!fs.existsSync(f)) continue;
  const dictFile = path.join(DIR, code + '.json');
  const d = code !== 'zh-CN' && fs.existsSync(dictFile) ? JSON.parse(fs.readFileSync(dictFile, 'utf8')) : {};
  const t = (s) => (Object.prototype.hasOwnProperty.call(d, s) ? d[s] : s);
  const h = HEAD[code];
  const rows = [`| ${h.slice(0, 3).join(' | ')} | ${h.slice(3, 7).join(' | ')} |`, '| --- | --- | --- | ---: | ---: | ---: | ---: |'];
  const sum = [0, 0, 0];
  for (const c of B.chapters) {
    const rs = B.requirements.filter((q) => q.chapter === c.id);
    const n = [1, 2, 3].map((lv) => rs.filter((q) => q.level === lv).length);
    n.forEach((v, i) => { sum[i] += v; });
    rows.push(`| ${c.id} | ${t(c.name)} | ${t(c.question)} | ${n.join(' | ')} | ${rs.length} |`);
  }
  rows.push(`| | **${h[7]}** | | **${sum[0]}** | **${sum[1]}** | **${sum[2]}** | **${sum[0] + sum[1] + sum[2]}** |`);
  const src = fs.readFileSync(f, 'utf8');
  const re = /(<!-- coverage:start -->)[\s\S]*?(<!-- coverage:end -->)/;
  if (!re.test(src)) { console.log(`跳过 ${path.basename(f)}：没有 coverage 标记`); continue; }
  fs.writeFileSync(f, src.replace(re, `$1\n${rows.join('\n')}\n$2`));
  console.log(`写入 ${path.basename(f)}`);
}
