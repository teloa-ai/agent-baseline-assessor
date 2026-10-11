/* Node 端的多语言：把 i18n/<代码>.json 注册进 assets/i18n.js。
   JSON 不存在时该语言回退到中文源文，不报错。 */
'use strict';
const fs = require('fs');
const path = require('path');
const I18N = require('../assets/i18n.js');

const DIR = path.join(__dirname, '..', 'i18n');

/* 加载所有存在的词典，并切换到 locale（默认 en）。返回 I18N 本身，便于链式调用 */
function init(locale) {
  for (const { code } of I18N.LOCALES) {
    const f = path.join(DIR, code + '.json');
    if (code !== I18N.SOURCE && fs.existsSync(f)) I18N.register(code, JSON.parse(fs.readFileSync(f, 'utf8')));
  }
  I18N.setLocale(locale || I18N.DEFAULT);
  return I18N;
}

/* 命令行与环境变量统一用 ASSESSOR_LANG 指定语言，例如 ASSESSOR_LANG=ja */
function localeFromEnv() {
  return process.env.ASSESSOR_LANG || I18N.DEFAULT;
}

module.exports = { init, localeFromEnv };
