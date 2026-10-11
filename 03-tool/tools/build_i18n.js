#!/usr/bin/env node
/* 把 i18n/<代码>.json 生成浏览器用的 data/i18n.<代码>.js（classic script，file:// 可用）。
   没有对应 JSON 的语言跳过；zh-CN 是源语言，不需要词典。用法：npm run build:i18n */
'use strict';
const fs = require('fs');
const path = require('path');
const I18N = require('../assets/i18n.js');

const root = path.join(__dirname, '..');
const srcDir = path.join(root, 'i18n');
const outDir = path.join(root, 'data');

let written = 0;
for (const { code } of I18N.LOCALES) {
  if (code === I18N.SOURCE) continue;
  const src = path.join(srcDir, code + '.json');
  if (!fs.existsSync(src)) { console.log(`跳过 ${code}：没有 i18n/${code}.json`); continue; }
  const dict = JSON.parse(fs.readFileSync(src, 'utf8'));
  for (const [k, v] of Object.entries(dict)) {
    if (typeof v !== 'string') throw new Error(`i18n/${code}.json 中「${k}」的译文不是字符串`);
  }
  // U+2028 / U+2029 在旧式脚本里仍可能被当作换行，统一转义
  const LS = new RegExp(String.fromCharCode(0x2028), 'g'), PS = new RegExp(String.fromCharCode(0x2029), 'g');
  const body = JSON.stringify(dict, null, 1).replace(LS, '\\u2028').replace(PS, '\\u2029');
  const out = path.join(outDir, `i18n.${code}.js`);
  fs.writeFileSync(out, `/* 由 tools/build_i18n.js 从 i18n/${code}.json 生成，请勿手改 */\nI18N.register(${JSON.stringify(code)}, ${body});\n`);
  written++;
  console.log(`写入 ${path.relative(root, out)}（${Object.keys(dict).length} 条）`);
}
console.log(written ? `完成，共 ${written} 个语言` : '没有可用的译文 JSON，未生成文件');
