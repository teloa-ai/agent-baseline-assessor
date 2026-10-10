#!/usr/bin/env node
/* 生成离线评估表模板。默认输出中文：offline/企业智能体身份与授权安全基线_评估表.xlsx
   用法：[ASSESSOR_LANG=ja] node tools/build_xlsx.js [assessment.json] [输出路径]
   ASSESSOR_LANG 指定表格语言（zh-CN、en、ja、ko、de、fr、es），默认 zh-CN。 */
const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');
const B = require('../data/baseline.json');
const Score = require('../assets/score.js');
const Workbook = require('../assets/workbook.js');
const L10N = require('./i18n_node.js');

const I18N = L10N.init(L10N.localeFromEnv());
const src = process.argv[2];
const A = src ? JSON.parse(fs.readFileSync(src, 'utf8')) : { target: 2, items: {}, meta: {} };
const out = process.argv[3] || path.join(__dirname, '..', 'offline', `${I18N.t(B.title)}_${I18N.t('评估表')}.xlsx`);
fs.mkdirSync(path.dirname(out), { recursive: true });
Workbook.build(ExcelJS, B, A, Score, { t: I18N.t }).xlsx.writeFile(out).then(() => console.log('saved', out));
