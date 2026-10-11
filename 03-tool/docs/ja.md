# 03 ツール説明

本書は保守担当者を対象とし、リポジトリの構成、各スクリプトの役割、ベースライン改訂後のデータ更新方法、および依存するサードパーティ製コンポーネントについて説明する。利用方法は [02 利用方法](../../02-usage/ja/usage.md) を参照。

## 1、ディレクトリ構成

ツールのルートディレクトリは `03-tool/` であり、以下のパスとコマンドはすべてここを起点とする。

```
index.html               ページの入口
assets/
  app.js                 画面と操作
  i18n.js                多言語対応：言語の判定、切替、訳語の取得（ページと Node で共用）
  score.js               評価ルール（ページと Node で共用）
  charts.js              レーダーチャート、ギャップ図、分布図（純粋な SVG）
  workbook.js            Excel の生成と読み込み（ページと Node で共用）
  styles.css
data/
  baseline.json          ベースラインデータ：章、節、要件、レベル、実装コンポーネント、チェックポイント
  baseline.js            同じデータ。オフラインでダブルクリックして開く場合に使用
  i18n.<言語>.js          i18n/<言語>.json から生成した辞書。ページが読み込む
i18n/
  <言語>.json             言語ごとの辞書：中国語の原文 → 訳文
  glossary.md            7 言語の用語対照表
  source-baseline.json   ベースラインデータ中の翻訳対象の中国語文字列一覧
vendor/exceljs.min.js    ExcelJS 4.4.0（MIT）。Excel のインポート・エクスポート時のみ読み込む
vendor/fonts/            IBM Plex のラテン文字サブセット（OFL）。ローカルで読み込み、外部に接続しない
offline/                 オフライン Excel 評価表（中国語版）
tools/                   データ、辞書、評価表の生成スクリプト、セルフテスト、Excel 数式のクロスチェック
deploy/                  nginx 設定と Dockerfile
docs/                 本ドキュメントの各言語版
_headers                 Cloudflare Pages 用のセキュリティレスポンスヘッダー
```

## 2、主要コマンド

| コマンド | 役割 |
| --- | --- |
| `npm install` | 依存関係をインストールする（ExcelJS。Excel の生成と検証にのみ使用） |
| `npm run build:xlsx` | `offline/` 配下のオフライン評価表を再生成する |
| `npm run build:i18n` | `i18n/*.json` から `data/i18n.*.js` を再生成する。辞書を編集した後に実行する |
| `npm test` | 評価ルールと Excel の読み書きの往復一致を検証し、各言語の辞書が画面とベースラインの文字列をすべて網羅しているかを確認する |
| `npm run check:xlsx` | LibreOffice でエクスポートされた Excel の数式を独立に再計算し、Web ページの評価結果とセル単位で比較する（ローカルに LibreOffice のインストールが必要） |

## 3、ベースラインの更新

ベースライン文書が改訂された場合は、以下の3ステップで更新する。

1. ベースライン文書から Markdown をエクスポートし、`python3 tools/build_data.py <エクスポートファイル> --version 1.1 --date 2026-12-01` を実行して、`data/baseline.json` と `data/baseline.js` を再生成する。スクリプトは、番号の重複、番号順序、レベルの未選択、レベルの非累積、実装コンポーネントの欠落などの問題を検査する。ベースライン 6.4 に従い、削除された番号は再利用しないため、番号の欠番は許容される。また、手作業で記述されたコンポーネントの信頼前提およびチェックポイントを文書 4.2、4.3 と照合し、不一致があれば通知する。
2. 要件を追加または調整した場合は、`tools/component_map.py` 内の各節の実装コンポーネントも同時に修正する（節内の並び順に従い、1件ずつ対応させる）。
3. `npm install` および `npm run build:xlsx` を実行してオフライン評価表を再生成し、続けて `npm test` で自己チェックを行う。

既存の評価 JSON は番号により新バージョンと照合される。ベースラインに存在しない番号は、インポート時に無視され、その旨が通知される。

あわせて、リポジトリ `01-standard/` 配下の本文を新バージョンに差し替え、README のバージョン番号を更新する。

## 4、多言語対応

画面の文字列は中国語の原文をキーとし、各言語の訳文は `i18n/<言語>.json` に置く。訳文がない場合は中国語を表示する。現在の対応言語は zh-CN、en、ja、ko、de、fr、es である。

- **訳文の修正**：`i18n/<言語>.json` を編集し、`npm run build:i18n` で `data/i18n.<言語>.js` を再生成してから `npm test` を実行する。
- **画面の文字列やベースラインの条文が変わった場合**：`npm test` を実行すると、言語ごとに不足している中国語文字列が一覧表示される。補ったうえで辞書を再生成する。用語は `i18n/glossary.md` に従う。ベースラインを改訂した場合は、`01-standard/` 配下の各言語の訳本も併せて更新する。
- **言語の追加**：`assets/i18n.js` の `LOCALES` に言語コードと名称を登録し、`i18n/<言語>.json` を作成して、`index.html` に `data/i18n.<言語>.js` を追加する。そのうえで前項に従って訳文を補う。ベースライン本文、利用方法、本ドキュメントの訳本は、それぞれ `01-standard/<言語>/`、`02-usage/<言語>/`、`docs/<言語>.md` に置く。

## 5、サードパーティ製コンポーネント

- [ExcelJS](https://github.com/exceljs/exceljs) 4.4.0、MIT ライセンス。ライセンス全文は `vendor/exceljs.LICENSE` を参照。
- [IBM Plex Sans / Mono](https://github.com/IBM/plex) ラテン文字サブセット、SIL Open Font License 1.1。ライセンス全文は `vendor/fonts/OFL.txt` を参照。日本語の表示にはシステムフォント（ヒラギノ角ゴシック、Yu Gothic、Noto Sans CJK JP など）を使用する。
