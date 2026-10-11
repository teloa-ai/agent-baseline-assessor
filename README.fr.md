<p align="center">
  <a href="https://security.teloa.ai/agent-baseline-assessor/?lang=fr"><img src="03-tool/assets/brand/readme-hero.fr.png" width="100%" alt="Teloa AI Security · Référentiel de sécurité de l'identité et de l'autorisation des agents d'entreprise"></a>
</p>

# Référentiel de sécurité de l'identité et de l'autorisation des agents d'entreprise

Un référentiel de sécurité ouvert et un outil d'auto-évaluation issus du développement de Teloa

[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Deutsch](README.de.md) · **Français** · [Español](README.es.md)

[Site officiel](https://www.teloa.ai/en/) · [Documentation](https://docs.teloa.ai/en/) · [Marketplace](https://market.teloa.ai/en/) · [Sécurité IA](https://security.teloa.ai/?lang=en) · [Blog](https://www.teloa.ai/en/blog/) · [Signalement de sécurité](https://security.teloa.ai/report/?lang=en)

![Version v1.0](https://img.shields.io/badge/version-v1.0-2a78d6) ![240 exigences](https://img.shields.io/badge/requirements-240-2a78d6) ![7 langues](https://img.shields.io/badge/languages-7-2a78d6) ![Licence du référentiel CC BY 4.0](https://img.shields.io/badge/standard-CC%20BY%204.0-555) ![Licence du code Apache-2.0](https://img.shields.io/badge/code-Apache--2.0-555)

Le Référentiel de sécurité de l'identité et de l'autorisation des agents d'entreprise définit les exigences de sécurité en matière d'identité et d'autorisation que doivent respecter les agents d'IA dans un environnement d'entreprise. Il répond aux questions fondamentales que pose toute action d'un agent : qui l'a initiée, pour le compte de qui elle s'exécute, ce que l'agent peut faire, d'où proviennent ses identifiants, qui voit le résultat et comment imputer les actes en cas d'incident.

Ce dépôt contient le référentiel et un outil d'auto-évaluation associé. Le référentiel peut servir directement de donnée d'entrée pour la conception d'une plateforme, de questionnaire pour l'évaluation des fournisseurs ou de liste de contrôle pour les revues de sécurité. L'outil est une page web statique qui enregistre les résultats exigence par exigence et produit un rapport de maturité ainsi qu'un classeur Excel. Les données d'évaluation restent dans le navigateur de l'utilisateur.

Projet initié et maintenu par [Teloa AI Security](https://github.com/teloa-ai)

Teloa AI Security est une initiative de recherche en sécurité de l’IA et d’open source issue du développement de Teloa. Elle étudie l’identité des agents, l’autorisation, les frontières d’exécution et la gouvernance de la sécurité, et transforme l’expérience de conception en référentiel ouvert, architectures de référence et outils d’évaluation.

**Teloa, l’écureuil de l’équipe sécurité**

| Vérifier d’abord l’identité | Limiter les permissions | Conserver les preuves |
| :---: | :---: | :---: |
| <img src="03-tool/assets/brand/teloa-security.webp" width="100" alt="Teloa"> | <img src="03-tool/assets/brand/teloa-focused.png" width="100" alt="Teloa"> | <img src="03-tool/assets/brand/teloa-nailed-it.png" width="100" alt="Teloa"> |

## Origine et objectif

Auteur : Max Luo ([GitHub @cybermaxluo](https://github.com/cybermaxluo))

Max Luo a élaboré ce projet pendant le développement et la conception de la sécurité de [Teloa](https://github.com/teloa-ai/teloa). Les questions d'accès aux outils, d'approbation humaine, d'identifiants, d'isolation et de visibilité des données en collaboration sont rapprochées de spécifications publiques pour produire des exigences vérifiables. Le référentiel est ouvert à l'utilisation et à la revue pour différentes plateformes, sans dépendre de l'implémentation de Teloa.

Ce référentiel décrit des objectifs de conception et d'évaluation de la sécurité. Leur respect doit être vérifié exigence par exigence selon une version, un périmètre de déploiement et des preuves précises. L'auto-évaluation n'est pas une certification indépendante. Les références et correspondances avec OWASP, NIST, CSA ou d'autres sources ne constituent pas une approbation de ces organismes.

Les [choix de conception (en anglais)](04-design/en/design-rationale.md) présentent les problèmes représentatifs, les compromis, les exigences associées et les méthodes de vérification séparément du référentiel.

## Vue d'ensemble

| Élément | Détails |
| --- | --- |
| Version | v1.0 (2026-10-07) |
| Exigences | 240 exigences réparties en 10 chapitres et 62 sections, chacune vérifiable séparément |
| Niveaux | L1 Socle : 90 ; L2 Standard en ajoute 137 ; L3 Renforcé en ajoute 13 |
| Format | Inspiré de l'OWASP ASVS 5.0 ; les identifiants des exigences suivent le format V&lt;chapitre&gt;.&lt;section&gt;.&lt;point&gt;, par exemple V4.2.1 |
| Correspondances | OWASP Top 10 for Agentic Applications 2026, OWASP AISVS 1.0, CSA AICM v1.1 |
| Langues | Chinois simplifié (version de référence), anglais, japonais, coréen, allemand, français, espagnol |
| Licence | Référentiel et documentation CC BY 4.0 ; code Apache-2.0 |

## Exemple d'évaluation

Le rapport ci-dessous est généré avec des données simulées ; il n'évalue ni Teloa ni une plateforme réelle. L'exemple atteint L1 et vise L2 : 180 exigences sur 227 applicables sont satisfaites, soit environ 79 %. Il reste 47 écarts, dont 10 exigences non évaluées.

![Rapport simulé (en anglais) : maturité, taux de conformité, écarts et graphiques par chapitre](02-usage/assets/maturity-report.en.png)

Consultez le [parcours d'exemple (en anglais)](02-usage/en/usage.md#assessment-example), ou téléchargez le [JSON d'exemple](02-usage/examples/demo-assessment.json) et importez-le dans la page Données de l'outil.

## Couverture

Les chapitres V1 à V7 suivent l'ordre dans lequel se déroule une action d'un agent. Les chapitres V8 à V10 portent sur les données, les agents et les enregistrements d'audit qui persistent d'une session à l'autre.

<!-- coverage:start -->
| Chapitre | Nom | Question traitée | L1 | Ajouts L2 | Ajouts L3 | Total |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| V1 | Identité et authentification | Qui initie la demande, et quel Agent l'exécute ? | 11 | 11 | 1 | 23 |
| V2 | Délégation et permissions effectives | Au nom de qui agit-on, et quel est le plafond des permissions ? | 11 | 14 | 3 | 28 |
| V3 | Décisions d'autorisation | Cette opération peut-elle être réalisée, et faut-il une confirmation humaine ? | 9 | 16 | 2 | 27 |
| V4 | Identifiants et exécution en sortie | Comment la requête sort-elle, et comment les identifiants sont-ils injectés ? | 14 | 18 | 1 | 33 |
| V5 | Isolation de l'exécution | Dans quelles limites le code, les commandes, le navigateur et les extensions s'exécutent-ils ? | 16 | 11 | 0 | 27 |
| V6 | Contexte et entrées non fiables | Un contenu lu peut-il influencer la décision ? | 4 | 8 | 1 | 13 |
| V7 | Sorties et visibilité | À qui le résultat est-il montré, et risque-t-il d'être divulgué ? | 6 | 12 | 0 | 18 |
| V8 | Données, mémoire et livrables | Comment les données sont-elles recherchées, consolidées et conservées ? | 5 | 16 | 1 | 22 |
| V9 | Cycle de vie et gouvernance | Qui gère l'Agent, de son enregistrement à sa mise hors service ? | 9 | 16 | 1 | 26 |
| V10 | Audit, détection et réponse | Comment consigner, détecter et contenir un incident ? | 5 | 15 | 3 | 23 |
| | **Total** | | **90** | **137** | **13** | **240** |
<!-- coverage:end -->

## Niveaux

Les niveaux sont cumulatifs. Un niveau n'est atteint que lorsque toutes les exigences applicables de ce niveau et des niveaux inférieurs sont satisfaites.

- **L1 Socle** : leur absence entraîne directement un dépassement de permissions, une fuite d'identifiants ou l'impossibilité d'imputer les actes. Toute plateforme d'agents utilisée en entreprise devrait atteindre ce niveau.
- **L2 Standard** : capacités exigées par les revues de sécurité d'entreprise courantes, pour les plateformes qui traitent des données internes ou se connectent à plusieurs systèmes métier.
- **L3 Renforcé** : défense en profondeur et gouvernance fine, pour les secteurs fortement réglementés tels que la finance, la santé ou les infrastructures critiques, ou pour les plateformes qui traitent des données très sensibles.

Lorsqu'une plateforme ne dispose pas d'une capacité (par exemple, si elle ne prend pas en charge MCP), la section correspondante est marquée non applicable dans son ensemble et exclue du taux de conformité. Les règles d'appréciation figurent au chapitre 6 du référentiel.

## Démarrage rapide

- **Lire le référentiel** : [01-standard/fr/baseline-v1.0.md](01-standard/fr/baseline-v1.0.md)
- **Évaluer en ligne** : ouvrir le site [GitHub Pages](https://security.teloa.ai/agent-baseline-assessor/?lang=fr) publié à partir de ce dépôt ; la langue se change en haut à droite.
- **Évaluer hors ligne** : télécharger le dépôt et ouvrir `03-tool/index.html`. Les fonctionnalités sont identiques à celles de la version en ligne et aucune connexion réseau n'est nécessaire.
- **Utiliser Excel** : remplir [`03-tool/offline/baseline-assessment.xlsx`](03-tool/offline/baseline-assessment.xlsx) (en anglais), ou télécharger une grille vierge en français depuis la page **Données** de l'outil, avec le bouton « Télécharger la grille d'évaluation vierge ». Le classeur comporte des formules de synthèse et une liste des écarts, et peut être réimporté dans l'outil.
- **Déploiement privé** : l'outil se compose uniquement de fichiers statiques et est fourni avec une configuration nginx durcie et un Dockerfile. Voir le [mode d'emploi](02-usage/fr/usage.md).

## Structure du dépôt

```
01-standard/<langue>/baseline-v1.0.md   Référentiel
01-standard/diagrams/                 Schémas en sept langues : PNG, SVG, Mermaid
02-usage/<langue>/usage.md              Mode d'emploi : étapes d'évaluation, notation, déploiement, stockage des données
02-usage/examples/, assets/           Données simulées et captures des rapports
03-tool/                                Outil d'auto-évaluation : page, données, modèle Excel, scripts, configuration de déploiement
03-tool/docs/<langue>.md                Notes de maintenance de l'outil
04-design/zh-CN/, en/                 Réflexions de conception en chinois et anglais
01-standard/diagrams/index.html      Architecture de la baseline de sécurité des agents
.github/                                Workflow GitHub Pages, modèles d'issues et de pull requests
```

## Documentation

| Document | Contenu |
| --- | --- |
| [Référentiel](01-standard/fr/baseline-v1.0.md) | Périmètre, termes, architecture de référence, modèle de menace, règles des niveaux, les 240 exigences et les annexes de correspondance |
| [Mode d'emploi](02-usage/fr/usage.md) | Utilisation en ligne, hors ligne et en déploiement privé ; règles de notation ; publication sur GitHub Pages ou Cloudflare Pages |
| [Notes sur l'outil](03-tool/docs/fr.md) | Structure, commandes, mise à jour de l'outil après une révision du référentiel, maintenance des traductions |
| [Choix de conception (en anglais)](04-design/en/design-rationale.md) | Questions de sécurité issues de Teloa, compromis, correspondances et vérification |
| [Architecture de la baseline de sécurité des agents](https://security.teloa.ai/agent-baseline-assessor/01-standard/diagrams/?lang=fr) | Pile technologique · Architecture de référence · PNG / SVG / Mermaid |
| [Glossaire](03-tool/i18n/glossary.md) | Terminologie dans les sept langues |
| [Journal des modifications](CHANGELOG.md) | Modifications par version (en chinois et en anglais) |

La version chinoise du référentiel fait foi ; les autres versions linguistiques sont des traductions. Elles n'ont pas encore fait l'objet d'une relecture complète par des experts du domaine de langue maternelle ; les corrections sont les bienvenues.

## Contribuer

Les retours sur les exigences, les traductions et l'outil sont les bienvenus. Il convient de lire d'abord le [guide de contribution](CONTRIBUTING.md) (en chinois et en anglais) : toute proposition de modification d'une exigence doit indiquer la menace visée et la manière de la vérifier, les modifications de traduction suivent le glossaire, et les modifications de l'outil doivent passer les autotests.

Toute participation vaut acceptation du [code de conduite](CODE_OF_CONDUCT.md).

## Sécurité

Les vulnérabilités de l'outil sont à signaler de manière confidentielle, selon la [politique de sécurité](SECURITY.md) (en chinois et en anglais), et non par une issue publique. Les retours sur les exigences elles-mêmes peuvent faire l'objet d'une issue ordinaire.

## Citation

Merci d'indiquer la version, par exemple :

> Max Luo. Référentiel de sécurité de l'identité et de l'autorisation des agents d'entreprise (Enterprise Agent Identity and Authorization Security Baseline), v1.0, 2026.

Pour citer une exigence précise, indiquer son identifiant et la version, par exemple « V4.2.1 (v1.0) ». Les métadonnées de citation lisibles par machine se trouvent dans [CITATION.cff](CITATION.cff).

## Licence

- Le référentiel, le mode d'emploi et les autres documents : [CC BY 4.0](LICENSE-DOCS). Ils peuvent être copiés, adaptés et utilisés à des fins commerciales, à condition d'en citer l'auteur et d'indiquer les modifications éventuelles.
- Le code de l'outil d'auto-évaluation : [Apache License 2.0](LICENSE).
- Composants tiers : ExcelJS 4.4.0 (MIT) et polices IBM Plex (SIL OFL 1.1) ; les textes de licence sont fournis dans `03-tool/vendor/`.
- Marque Teloa et illustrations de l’écureuil : voir les [éléments de marque](03-tool/assets/brand/README.md) ; les droits d’utilisation de la marque sont réservés séparément.
