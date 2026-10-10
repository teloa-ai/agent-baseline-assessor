# 03 Notes sur l'outil

Ce document s'adresse aux mainteneurs. Il décrit la structure du dépôt, le rôle de chaque script, la manière de mettre à jour les données après une révision du référentiel, ainsi que les composants tiers utilisés. Pour le mode d'emploi, voir [02 Mode d'emploi](../../02-使用方法/fr/使用方法.md).

## 1. Structure du répertoire

Le répertoire qui contient le présent fichier est la racine de l'outil. Les chemins et commandes ci-dessous sont donnés à partir de `03-工具/`.

```
index.html               页面入口
assets/
  app.js                 界面与交互
  score.js               评分规则（网页与 Node 共用）
  charts.js              雷达图、差距图、分布图（纯 SVG）
  workbook.js            Excel 生成与读取（网页与 Node 共用）
  styles.css
data/
  baseline.json          基线数据：章、小节、要求、等级、落点组件、检查点
  baseline.js            同一份数据，供离线双击打开时使用
vendor/exceljs.min.js    ExcelJS 4.4.0（MIT），仅在导入导出 Excel 时加载
vendor/fonts/            IBM Plex 拉丁字符子集（OFL），本地加载，不连外网
offline/                 离线 Excel 评估表
tools/                   数据与模板生成脚本、自检、Excel 公式交叉核对
deploy/                  nginx 配置与 Dockerfile
_headers                 Cloudflare Pages 的安全响应头
.github/workflows/       GitHub Pages 自动发布
```

## 2. Commandes courantes

| Commande | Rôle |
| --- | --- |
| `npm install` | Installe les dépendances (ExcelJS, utilisé uniquement pour générer et vérifier les fichiers Excel) |
| `npm run build:xlsx` | Régénère le classeur d'évaluation hors ligne situé dans `offline/` |
| `npm test` | Vérifie l'aller-retour de lecture et d'écriture entre les données et le fichier Excel |
| `npm run check:xlsx` | Recalcule de façon indépendante, avec LibreOffice, les formules du fichier Excel exporté, puis compare cellule par cellule ces résultats au calcul de la page web (LibreOffice doit être installé sur la machine) |

## 3. Mise à jour du référentiel

Après une révision du document de référentiel, procéder en trois étapes :

1. Exporter le document de référentiel au format Markdown, puis exécuter `python3 tools/build_data.py <fichier exporté> --version 1.1 --date 2026-12-01` pour régénérer `data/baseline.json` et `data/baseline.js`. Le script contrôle les numéros en double, l'ordre des numéros, les niveaux non cochés, l'absence de cumul entre niveaux et les composants d'application manquants. Selon la section 6.4 du référentiel, un numéro supprimé n'est pas réutilisé : les sauts de numérotation sont donc admis. Le script compare également les hypothèses de confiance des composants et les points de contrôle saisis à la main avec les sections 4.2 et 4.3 du document, et signale toute incohérence.
2. Si des exigences ont été ajoutées ou modifiées, mettre à jour en conséquence les composants d'application de chaque section dans `tools/component_map.py`, en faisant correspondre chaque exigence dans l'ordre où elle apparaît dans la section.
3. Exécuter `npm install` puis `npm run build:xlsx` pour régénérer le classeur hors ligne, puis lancer `npm test` pour l'autocontrôle.

Les fichiers JSON d'évaluation existants sont rattachés à la nouvelle version par numéro. Les numéros absents du référentiel en vigueur sont ignorés à l'import, avec un avertissement.

Remplacer également le texte du référentiel situé sous `01-标准/` du dépôt par la nouvelle version, et mettre à jour le numéro de version dans le README.

## 4. Composants tiers

- [ExcelJS](https://github.com/exceljs/exceljs) 4.4.0, sous licence MIT. Le texte de la licence figure dans `vendor/exceljs.LICENSE`.
- Sous-ensemble latin de [IBM Plex Sans / Mono](https://github.com/IBM/plex), sous SIL Open Font License 1.1. Le texte de la licence figure dans `vendor/fonts/OFL.txt`. Le chinois s'affiche avec les polices système PingFang (苹方), Microsoft YaHei (微软雅黑) ou Source Han Sans (思源黑体).
