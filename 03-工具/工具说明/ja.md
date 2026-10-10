# 03 ツール説明

本書は保守担当者を対象とし、リポジトリの構成、各スクリプトの役割、ベースライン改訂後のデータ更新方法、および依存するサードパーティ製コンポーネントについて説明する。利用方法は [02 利用方法](../../02-使用方法/ja/使用方法.md) を参照。

## 1、ディレクトリ構成

本ファイルが置かれているディレクトリがツールのルートディレクトリであり、以下のパスとコマンドはすべて `03-工具/` を起点とする。

```
index.html               ページのエントリポイント
assets/
  app.js                 UI とインタラクション
  score.js               評価ルール（Web ページと Node で共用）
  charts.js              レーダーチャート、ギャップ図、分布図（純粋な SVG）
  workbook.js            Excel の生成と読み込み（Web ページと Node で共用）
  styles.css
data/
  baseline.json          ベースラインデータ：章、節、要件、レベル、実装コンポーネント、チェックポイント
  baseline.js            同一データ。オフラインでダブルクリックして開く際に使用
vendor/exceljs.min.js    ExcelJS 4.4.0（MIT）。Excel のインポート・エクスポート時にのみ読み込む
vendor/fonts/            IBM Plex ラテン文字サブセット（OFL）。ローカルから読み込み、外部ネットワークには接続しない
offline/                 オフライン Excel 評価表
tools/                   データおよびテンプレート生成スクリプト、自己チェック、Excel 数式の相互検証
deploy/                  nginx 設定と Dockerfile
_headers                 Cloudflare Pages 用セキュリティレスポンスヘッダ
.github/workflows/       GitHub Pages への自動公開
```

## 2、主要コマンド

| コマンド | 役割 |
| --- | --- |
| `npm install` | 依存関係をインストールする（ExcelJS。Excel の生成と検証にのみ使用） |
| `npm run build:xlsx` | `offline/` 配下のオフライン評価表を再生成する |
| `npm test` | データと Excel の読み書きの往復一致を検証する |
| `npm run check:xlsx` | LibreOffice でエクスポートされた Excel の数式を独立に再計算し、Web ページの評価結果とセル単位で比較する（ローカルに LibreOffice のインストールが必要） |

## 3、ベースラインの更新

ベースライン文書が改訂された場合は、以下の3ステップで更新する。

1. ベースライン文書から Markdown をエクスポートし、`python3 tools/build_data.py <エクスポートファイル> --version 1.1 --date 2026-12-01` を実行して、`data/baseline.json` と `data/baseline.js` を再生成する。スクリプトは、番号の重複、番号順序、レベルの未選択、レベルの非累積、実装コンポーネントの欠落などの問題を検査する。ベースライン 6.4 に従い、削除された番号は再利用しないため、番号の欠番は許容される。また、手作業で記述されたコンポーネントの信頼前提およびチェックポイントを文書 4.2、4.3 と照合し、不一致があれば通知する。
2. 要件を追加または調整した場合は、`tools/component_map.py` 内の各節の実装コンポーネントも同時に修正する（節内の並び順に従い、1件ずつ対応させる）。
3. `npm install` および `npm run build:xlsx` を実行してオフライン評価表を再生成し、続けて `npm test` で自己チェックを行う。

既存の評価 JSON は番号により新バージョンと照合される。ベースラインに存在しない番号は、インポート時に無視され、その旨が通知される。

あわせて、リポジトリ `01-标准/` 配下の本文を新バージョンに差し替え、README のバージョン番号を更新する。

## 4、サードパーティ製コンポーネント

- [ExcelJS](https://github.com/exceljs/exceljs) 4.4.0、MIT ライセンス。ライセンス全文は `vendor/exceljs.LICENSE` を参照。
- [IBM Plex Sans / Mono](https://github.com/IBM/plex) ラテン文字サブセット、SIL Open Font License 1.1。ライセンス全文は `vendor/fonts/OFL.txt` を参照。日本語の表示にはシステムフォント（ヒラギノ角ゴシック、Yu Gothic、Noto Sans CJK JP など）を使用する。
