# 03 Notes sur l'outil

Ce document s'adresse aux mainteneurs. Il décrit la structure du dépôt, le rôle de chaque script, la manière de mettre à jour les données après une révision du référentiel, ainsi que les composants tiers utilisés. Pour le mode d'emploi, voir [02 Mode d'emploi](../../02-使用方法/fr/使用方法.md).

## 1. Structure du répertoire

Le répertoire qui contient le présent fichier est la racine de l'outil. Les chemins et commandes ci-dessous sont donnés à partir de `03-工具/`.

```
index.html               Point d'entrée de la page
assets/
  app.js                 Interface et interactions
  i18n.js                Multilingue : détection, changement de langue et traductions (page et Node)
  score.js               Règles de notation (page et Node)
  charts.js              Graphiques radar, d'écarts et de répartition (SVG pur)
  workbook.js            Génération et lecture des fichiers Excel (page et Node)
  styles.css
data/
  baseline.json          Données du référentiel : chapitres, sections, exigences, niveaux, composants d'application, points de contrôle
  baseline.js            Les mêmes données, utilisées à l'ouverture hors ligne par double-clic
  i18n.<langue>.js       Dictionnaires générés à partir de i18n/<langue>.json et chargés par la page
i18n/
  <langue>.json          Dictionnaire par langue : texte source chinois → traduction
  glossary.md            Table terminologique des sept langues
  source-baseline.json   Chaînes chinoises des données du référentiel à traduire
vendor/exceljs.min.js    ExcelJS 4.4.0 (MIT), chargé uniquement pour l'import et l'export Excel
vendor/fonts/            Sous-ensemble latin d'IBM Plex (OFL), chargé localement, sans connexion externe
offline/                 Grille d'évaluation Excel hors ligne (chinois)
tools/                   Scripts de génération (données, dictionnaires, grille), autotest, contrôle croisé des formules Excel
deploy/                  Configuration nginx et Dockerfile
工具说明/                 Ce guide dans chaque langue
_headers                 En-têtes de sécurité pour Cloudflare Pages
```

## 2. Commandes courantes

| Commande | Rôle |
| --- | --- |
| `npm install` | Installe les dépendances (ExcelJS, utilisé uniquement pour générer et vérifier les fichiers Excel) |
| `npm run build:xlsx` | Régénère le classeur d'évaluation hors ligne situé dans `offline/` |
| `npm run build:i18n` | Régénère `data/i18n.*.js` à partir de `i18n/*.json` ; à lancer après toute modification d'un dictionnaire |
| `npm test` | Vérifie les règles de notation et l'aller-retour Excel, ainsi que la couverture de tous les textes de l'interface et du référentiel par chaque dictionnaire |
| `npm run check:xlsx` | Recalcule de façon indépendante, avec LibreOffice, les formules du fichier Excel exporté, puis compare cellule par cellule ces résultats au calcul de la page web (LibreOffice doit être installé sur la machine) |

## 3. Mise à jour du référentiel

Après une révision du document de référentiel, procéder en trois étapes :

1. Exporter le document de référentiel au format Markdown, puis exécuter `python3 tools/build_data.py <fichier exporté> --version 1.1 --date 2026-12-01` pour régénérer `data/baseline.json` et `data/baseline.js`. Le script contrôle les numéros en double, l'ordre des numéros, les niveaux non cochés, l'absence de cumul entre niveaux et les composants d'application manquants. Selon la section 6.4 du référentiel, un numéro supprimé n'est pas réutilisé : les sauts de numérotation sont donc admis. Le script compare également les hypothèses de confiance des composants et les points de contrôle saisis à la main avec les sections 4.2 et 4.3 du document, et signale toute incohérence.
2. Si des exigences ont été ajoutées ou modifiées, mettre à jour en conséquence les composants d'application de chaque section dans `tools/component_map.py`, en faisant correspondre chaque exigence dans l'ordre où elle apparaît dans la section.
3. Exécuter `npm install` puis `npm run build:xlsx` pour régénérer le classeur hors ligne, puis lancer `npm test` pour l'autocontrôle.

Les fichiers JSON d'évaluation existants sont rattachés à la nouvelle version par numéro. Les numéros absents du référentiel en vigueur sont ignorés à l'import, avec un avertissement.

Remplacer également le texte du référentiel situé sous `01-标准/` du dépôt par la nouvelle version, et mettre à jour le numéro de version dans le README.

## 4. Multilingue

Les textes de l'interface utilisent le texte source chinois comme clé. Les traductions de chaque langue se trouvent dans `i18n/<langue>.json` ; en l'absence de traduction, le texte chinois s'affiche. Langues prises en charge : zh-CN, en, ja, ko, de, fr, es.

- **Modifier une traduction** : éditer `i18n/<langue>.json`, régénérer `data/i18n.<langue>.js` avec `npm run build:i18n`, puis lancer `npm test`.
- **Quand des textes de l'interface ou des exigences du référentiel changent** : lancer `npm test`, qui liste pour chaque langue les chaînes chinoises manquantes ; les compléter, puis régénérer les dictionnaires. La terminologie suit `i18n/glossary.md`. Après une révision du référentiel, mettre aussi à jour les traductions de `01-标准/`.
- **Ajouter une langue** : déclarer le code et le nom de la langue dans `LOCALES` (`assets/i18n.js`), créer `i18n/<langue>.json`, ajouter `data/i18n.<langue>.js` dans `index.html`, puis compléter les traductions comme ci-dessus. Les traductions du référentiel, du mode d'emploi et de ce guide se placent dans `01-标准/<langue>/`, `02-使用方法/<langue>/` et `工具说明/<langue>.md`.

## 5. Composants tiers

- [ExcelJS](https://github.com/exceljs/exceljs) 4.4.0, sous licence MIT. Le texte de la licence figure dans `vendor/exceljs.LICENSE`.
- Sous-ensemble latin de [IBM Plex Sans / Mono](https://github.com/IBM/plex), sous SIL Open Font License 1.1. Le texte de la licence figure dans `vendor/fonts/OFL.txt`. Le chinois s'affiche avec les polices système PingFang (苹方), Microsoft YaHei (微软雅黑) ou Source Han Sans (思源黑体).
