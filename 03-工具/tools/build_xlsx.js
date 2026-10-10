#!/usr/bin/env node
/* 生成离线评估表模板：offline/企业智能体身份与授权安全基线_评估表.xlsx
   用法：node tools/build_xlsx.js [assessment.json] [输出路径] */
const path = require('path');
const fs = require('fs');
const ExcelJS = require('exceljs');
const B = require('../data/baseline.json');
const Score = require('../assets/score.js');
const Workbook = require('../assets/workbook.js');

const src = process.argv[2];
const A = src ? JSON.parse(fs.readFileSync(src, 'utf8')) : { target: 2, items: {}, meta: {} };
const out = process.argv[3] || path.join(__dirname, '..', 'offline', `${B.title}_评估表.xlsx`);
fs.mkdirSync(path.dirname(out), { recursive: true });
Workbook.build(ExcelJS, B, A, Score).xlsx.writeFile(out).then(() => console.log('saved', out));
