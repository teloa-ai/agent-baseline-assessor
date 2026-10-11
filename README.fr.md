# Référentiel de sécurité de l'identité et de l'autorisation des agents d'entreprise

[简体中文](README.md) · [English](README.en.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Deutsch](README.de.md) · **Français** · [Español](README.es.md)

![Version v1.0](https://img.shields.io/badge/version-v1.0-2a78d6) ![240 exigences](https://img.shields.io/badge/requirements-240-2a78d6) ![7 langues](https://img.shields.io/badge/languages-7-2a78d6) ![Licence du référentiel CC BY 4.0](https://img.shields.io/badge/standard-CC%20BY%204.0-555) ![Licence du code Apache-2.0](https://img.shields.io/badge/code-Apache--2.0-555)

Le Référentiel de sécurité de l'identité et de l'autorisation des agents d'entreprise définit les exigences de sécurité en matière d'identité et d'autorisation que doivent respecter les agents d'IA dans un environnement d'entreprise. Il répond aux questions fondamentales que pose toute action d'un agent : qui l'a initiée, pour le compte de qui elle s'exécute, ce que l'agent peut faire, d'où proviennent ses identifiants, qui voit le résultat et comment imputer les actes en cas d'incident.

Ce dépôt contient le référentiel et un outil d'auto-évaluation associé. Le référentiel peut servir directement de donnée d'entrée pour la conception d'une plateforme, de questionnaire pour l'évaluation des fournisseurs ou de liste de contrôle pour les revues de sécurité. L'outil est une page web statique qui enregistre les résultats exigence par exigence et produit un rapport de maturité ainsi qu'un classeur Excel. Les données d'évaluation restent dans le navigateur de l'utilisateur.

Auteur : Max ([GitHub @cybermaxluo](https://github.com/cybermaxluo))

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
- **Évaluer en ligne** : ouvrir le site GitHub Pages publié à partir de ce dépôt ; la langue se change en haut à droite.
- **Évaluer hors ligne** : télécharger le dépôt et ouvrir `03-tool/index.html`. Les fonctionnalités sont identiques à celles de la version en ligne et aucune connexion réseau n'est nécessaire.
- **Utiliser Excel** : remplir [`03-tool/offline/baseline-assessment.xlsx`](03-tool/offline/baseline-assessment.xlsx) (en chinois), ou télécharger une grille vierge en français depuis la page **Données** de l'outil, avec le bouton « Télécharger la grille d'évaluation vierge ». Le classeur comporte des formules de synthèse et une liste des écarts, et peut être réimporté dans l'outil.
- **Déploiement privé** : l'outil se compose uniquement de fichiers statiques et est fourni avec une configuration nginx durcie et un Dockerfile. Voir le [mode d'emploi](02-usage/fr/usage.md).

## Structure du dépôt

```
01-standard/<langue>/baseline-v1.0.md   Référentiel
02-usage/<langue>/usage.md              Mode d'emploi : étapes d'évaluation, notation, déploiement, stockage des données
03-tool/                                Outil d'auto-évaluation : page, données, modèle Excel, scripts, configuration de déploiement
03-tool/docs/<langue>.md                Notes de maintenance de l'outil
.github/                                Workflow GitHub Pages, modèles d'issues et de pull requests
```

## Documentation

| Document | Contenu |
| --- | --- |
| [Référentiel](01-standard/fr/baseline-v1.0.md) | Périmètre, termes, architecture de référence, modèle de menace, règles des niveaux, les 240 exigences et les annexes de correspondance |
| [Mode d'emploi](02-usage/fr/usage.md) | Utilisation en ligne, hors ligne et en déploiement privé ; règles de notation ; publication sur GitHub Pages ou Cloudflare Pages |
| [Notes sur l'outil](03-tool/docs/fr.md) | Structure, commandes, mise à jour de l'outil après une révision du référentiel, maintenance des traductions |
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

> Max. Référentiel de sécurité de l'identité et de l'autorisation des agents d'entreprise (Enterprise Agent Identity and Authorization Security Baseline), v1.0, 2026.

Pour citer une exigence précise, indiquer son identifiant et la version, par exemple « V4.2.1 (v1.0) ». Les métadonnées de citation lisibles par machine se trouvent dans [CITATION.cff](CITATION.cff).

## Licence

- Le référentiel, le mode d'emploi et les autres documents : [CC BY 4.0](LICENSE-DOCS). Ils peuvent être copiés, adaptés et utilisés à des fins commerciales, à condition d'en citer l'auteur et d'indiquer les modifications éventuelles.
- Le code de l'outil d'auto-évaluation : [Apache License 2.0](LICENSE).
- Composants tiers : ExcelJS 4.4.0 (MIT) et polices IBM Plex (SIL OFL 1.1) ; les textes de licence sont fournis dans `03-tool/vendor/`.
