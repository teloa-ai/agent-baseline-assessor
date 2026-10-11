/* 界面多语言核心。浏览器里挂在 window.I18N，Node 里用 require 引入（与 score.js 相同的 UMD 写法）。
   源语言是 zh-CN：源字符串本身就是中文译文，所以 zh-CN 不需要词典。
   词典是「中文源字符串 → 译文」的扁平对象；缺词条时回退到中文。 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.I18N = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  var SOURCE = 'zh-CN';
  var DEFAULT = 'en';
  var LOCALES = [
    { code: 'en', name: 'English' },
    { code: 'zh-CN', name: '简体中文' },
    { code: 'ja', name: '日本語' },
    { code: 'ko', name: '한국어' },
    { code: 'de', name: 'Deutsch' },
    { code: 'fr', name: 'Français' },
    { code: 'es', name: 'Español' }
  ];
  var PREFIX = { zh: 'zh-CN', en: 'en', ja: 'ja', ko: 'ko', de: 'de', fr: 'fr', es: 'es' };
  var KEY = 'assessor.lang';
  var DICTS = Object.create(null);
  var current = DEFAULT;
  var has = function (o, k) { return Object.prototype.hasOwnProperty.call(o, k); };

  function known(code) {
    return LOCALES.some(function (l) { return l.code === code; });
  }
  /* 任意语言标签归到支持的语言：zh-TW → zh-CN，en-US → en；认不出返回 null */
  function match(tag) {
    if (typeof tag !== 'string' || !tag) return null;
    var s = tag.trim().replace('_', '-').toLowerCase();
    for (var i = 0; i < LOCALES.length; i++) if (LOCALES[i].code.toLowerCase() === s) return LOCALES[i].code;
    return PREFIX[s.split('-')[0]] || null;
  }
  function readStored() {
    try { return localStorage.getItem(KEY); } catch (e) { return null; }
  }
  function writeStored(code) {
    try { localStorage.setItem(KEY, code); } catch (e) { /* 隐私模式或禁用存储时忽略 */ }
  }
  /* 顺序：?lang= 参数 → localStorage → en。首次访问默认英文。
     参数里是不认识的语言时，继续按后面的顺序判断 */
  function detect() {
    if (typeof window === 'undefined' || typeof document === 'undefined') return DEFAULT;
    var m = /[?&]lang=([^&#]*)/.exec(location.search || '');
    if (m) {
      var q = m[1];
      try { q = decodeURIComponent(q); } catch (e) { /* 保留原值 */ }
      var hit = match(q);
      if (hit) return hit;
    }
    var saved = readStored();
    if (saved && known(saved)) return saved;
    return DEFAULT;
  }

  /* 译文：src 是中文源字符串；{name} 用 vars.name 替换 */
  function t(src, vars) {
    if (typeof src !== 'string') return src;
    var s = src;
    if (current !== SOURCE) {
      var d = DICTS[current];
      var v = d && has(d, src) ? d[src] : null;
      if (typeof v === 'string' && v) s = v;
    }
    if (vars) {
      s = s.replace(/\{(\w+)\}/g, function (m, k) {
        return has(vars, k) && vars[k] != null ? String(vars[k]) : m;
      });
    }
    return s;
  }
  function register(code, dict) {
    DICTS[code] = dict && typeof dict === 'object' ? dict : {};
  }
  function setLocale(code) {
    current = known(code) ? code : DEFAULT;
    writeStored(current);
    return current;
  }
  function getLocale() { return current; }
  /* 所有已注册的词典（不含源语言），供导入 Excel 时识别其他语言的状态与标签 */
  function dictionaries() {
    return Object.keys(DICTS).map(function (k) { return DICTS[k]; });
  }

  current = detect();

  return {
    LOCALES: LOCALES,
    SOURCE: SOURCE,
    DEFAULT: DEFAULT,
    t: t,
    register: register,
    setLocale: setLocale,
    getLocale: getLocale,
    dictionaries: dictionaries,
    detect: detect,
    match: match
  };
});
