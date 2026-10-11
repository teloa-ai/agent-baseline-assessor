# Sicherheitsbaseline für Identität und Autorisierung von Unternehmensagenten · Selbstbewertungswerkzeug

[简体中文](README.md) · [English](README.en.md) · [日本語](README.ja.md) · [한국어](README.ko.md) · **Deutsch** · [Français](README.fr.md) · [Español](README.es.md)

Dieses Projekt umfasst zwei Teile: einen Sicherheitsstandard für Identität und Autorisierung von Unternehmensagenten sowie ein statisches Werkzeug zur Selbstbewertung gegen diesen Standard. Das Werkzeug benötigt kein Backend. Die Bewertungsdaten werden ausschließlich im Browser der bewertenden Person gespeichert.

## Verzeichnis

```
01-standard/   Baseltext (Markdown)
02-usage/      Schritte der Selbstbewertung, Bereitstellung, Bewertungsregeln
03-tool/       Statische Bewertungsseite, Daten, Excel-Vorlage, Skripte und Bereitstellungskonfiguration
.github/       Workflow für die automatische Veröffentlichung auf GitHub Pages
```

## Lesereihenfolge

1. **[01 Standard](01-standard/de/baseline-v1.0.md)**: „Sicherheitsbaseline für Identität und Autorisierung von Unternehmensagenten“ v1.0. 240 Anforderungen, gegliedert in 10 Kapitel und 62 Abschnitte, kumulativ in drei Stufen: L1 (Basisstufe) mit 90 Anforderungen; L2 (Standard) ergänzt 137 Anforderungen; L3 (Erweitert) ergänzt weitere 13. Begriffe, Referenzarchitektur, Bedrohungsmodell und die Zuordnung im Anhang sind in diesem Dokument enthalten. Maßgeblich ist die chinesische Fassung der Baseline; die übrigen Sprachfassungen sind Übersetzungen.
2. **[02 Verwendung](02-usage/de/usage.md)**: Durchführung der Selbstbewertung, Online-, Offline- und private Bereitstellung, Bewertungsregeln, Veröffentlichung auf GitHub Pages oder Cloudflare Pages sowie Art der Datenspeicherung.
3. **[03 Werkzeugbeschreibung](03-tool/docs/de.md)**: Verzeichnisstruktur des Werkzeugs, häufig verwendete Befehle, Aktualisierung des Werkzeugs nach einer Überarbeitung der Baseline sowie Drittanbieter-Komponenten.

## Schnellstart

- Direkte Selbstbewertung: Die Online-Adresse öffnen oder das ZIP-Archiv entpacken und `03-tool/index.html` per Doppelklick starten.
- Bewertung in Excel: Die Datei `03-tool/offline/baseline-assessment.xlsx` verwenden.
- Eigene Bereitstellung: siehe Veröffentlichungsabschnitt in [02 Verwendung](02-usage/de/usage.md).

## Lizenz

Die Lizenz des Repositorys wird vor der öffentlichen Veröffentlichung festgelegt.
