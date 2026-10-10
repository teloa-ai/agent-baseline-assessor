# Référentiel de sécurité de l'identité et de l'autorisation des agents d'entreprise · Outil d'auto-évaluation

[简体中文](README.md) · [English](README.en.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · [Deutsch](README.de.md) · **Français** · [Español](README.es.md)

Ce projet comprend deux volets : un référentiel de sécurité relatif à l'identité et à l'autorisation des agents d'entreprise, et un outil statique d'auto-évaluation permettant de le confronter à une mise en œuvre. L'outil ne nécessite aucun serveur back-end. Les données d'évaluation ne sont conservées que dans le navigateur de l'utilisateur.

## Structure

```
01-标准/        Texte du référentiel (Markdown)
02-使用方法/    Démarche d'auto-évaluation, déploiement, règles de notation
03-工具/        Page d'auto-évaluation statique, données, modèle Excel, scripts et configuration de déploiement
.github/       Workflow de publication automatique sur GitHub Pages
```

## Ordre de lecture

1. **[01 Référentiel](01-标准/fr/企业智能体身份与授权安全基线_v1.0.md)** : référentiel de sécurité de l'identité et de l'autorisation des agents d'entreprise, version 1.0. Il comprend 240 exigences réparties en 10 chapitres et 62 sections, cumulées sur trois niveaux : L1 (socle), L2 (standard) et L3 (renforcé). Le niveau L1 compte 90 exigences ; le niveau L2 en ajoute 137 et le niveau L3 en ajoute 13. Les termes, l'architecture de référence, le modèle de menace et les correspondances des annexes figurent tous dans ce document. La version chinoise du référentiel fait foi ; les autres versions linguistiques sont des traductions.
2. **[02 Mode d'emploi](02-使用方法/fr/使用方法.md)** : comment réaliser une auto-évaluation, les trois modes d'utilisation (en ligne, hors ligne et privé), les règles de notation, la publication sur GitHub Pages ou Cloudflare Pages, et le mode de conservation des données.
3. **[03 Outil](03-工具/工具说明/fr.md)** : structure du répertoire de l'outil, commandes courantes, mise à jour de l'outil après une révision du référentiel, et composants tiers.

## Démarrage rapide

- Pour réaliser directement une auto-évaluation : ouvrir l'adresse en ligne, ou décompresser l'archive zip puis ouvrir `03-工具/index.html` par double-clic.
- Pour renseigner le tableau dans Excel : utiliser `03-工具/offline/企业智能体身份与授权安全基线_评估表.xlsx`.
- Pour un déploiement autonome : voir le chapitre sur la publication de [02 Mode d'emploi](02-使用方法/fr/使用方法.md).

## Licence

La licence du présent dépôt sera définie avant sa publication publique.
