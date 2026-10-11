# 03 Werkzeugbeschreibung

Dieser Text richtet sich an Betreuende. Er beschreibt die Repository-Struktur, die Aufgabe der einzelnen Skripte, die Aktualisierung der Daten nach einer Überarbeitung der Baseline sowie die verwendeten Drittanbieter-Komponenten. Zur Verwendung siehe [02 Verwendung](../../02-usage/de/usage.md).

## 1 Verzeichnisstruktur

Das Stammverzeichnis des Werkzeugs ist `03-tool/`; alle folgenden Pfade und Befehle beziehen sich darauf.

```
index.html               Einstiegsseite
assets/
  app.js                 Oberfläche und Interaktion
  i18n.js                Mehrsprachigkeit: Spracherkennung, Umschaltung, Übersetzungen (Seite und Node)
  score.js               Bewertungsregeln (Seite und Node)
  charts.js              Radar-, Lücken- und Verteilungsdiagramme (reines SVG)
  workbook.js            Erzeugen und Einlesen von Excel (Seite und Node)
  styles.css
data/
  baseline.json          Baseline-Daten: Kapitel, Abschnitte, Anforderungen, Stufen, Durchsetzungskomponenten, Prüfpunkte
  baseline.js            Dieselben Daten für das Öffnen per Doppelklick ohne Server
  i18n.<Sprache>.js      Aus i18n/<Sprache>.json erzeugte Wörterbücher, von der Seite geladen
i18n/
  <Sprache>.json         Wörterbuch je Sprache: chinesischer Originaltext → Übersetzung
  glossary.md            Terminologietabelle für die sieben Sprachen
  source-baseline.json   Zu übersetzende chinesische Zeichenketten aus den Baseline-Daten
vendor/exceljs.min.js    ExcelJS 4.4.0 (MIT), nur beim Import und Export von Excel geladen
vendor/fonts/            IBM-Plex-Teilmenge für lateinische Zeichen (OFL), lokal geladen, ohne externe Verbindungen
offline/                 Offline-Excel-Bewertungstabelle (Chinesisch)
tools/                   Skripte für Daten, Wörterbücher und Vorlage, Selbsttest, Abgleich der Excel-Formeln
deploy/                  nginx-Konfiguration und Dockerfile
docs/                 Diese Anleitung in allen Sprachen
_headers                 Sicherheits-Header für Cloudflare Pages
```

## 2 Häufig verwendete Befehle

| Befehl | Funktion |
| --- | --- |
| `npm install` | Installiert die Abhängigkeiten (ExcelJS, nur zur Erzeugung und Prüfung der Excel-Dateien) |
| `npm run build:xlsx` | Erzeugt die Offline-Bewertungstabelle unter `offline/` neu |
| `npm run build:i18n` | Erzeugt `data/i18n.*.js` aus `i18n/*.json` neu; nach Änderungen an einem Wörterbuch ausführen |
| `npm run build:readme` | Aktualisiert nach Änderungen der Baseline-Daten die Abdeckungstabellen in den README-Dateien |
| `npm test` | Prüft die Bewertungsregeln und den Excel-Round-Trip sowie, ob jedes Wörterbuch alle Oberflächen- und Baseline-Texte abdeckt |
| `npm run check:xlsx` | Berechnet die exportierten Excel-Formeln mit LibreOffice unabhängig neu und vergleicht sie zellweise mit der Bewertung der Webseite (setzt eine lokale Installation von LibreOffice voraus) |

## 3 Aktualisierung der Baseline

Nach einer Überarbeitung des Baseline-Dokuments wird in drei Schritten aktualisiert:

1. Das Baseline-Dokument als Markdown exportieren und `python3 tools/build_data.py <Exportdatei> --version 1.1 --date 2026-12-01` ausführen. Dadurch werden `data/baseline.json` und `data/baseline.js` neu erzeugt. Das Skript prüft doppelte Nummern, die Reihenfolge der Nummern, nicht gesetzte Stufen, fehlende Kumulation der Stufen und fehlende Durchsetzungskomponenten. Gemäß Abschnitt 6.4 der Baseline werden gelöschte Nummern nicht wiederverwendet, Nummernsprünge sind daher zulässig. Außerdem vergleicht das Skript die handgepflegten Vertrauensannahmen der Komponenten und die Prüfpunkte mit den Abschnitten 4.2 und 4.3 des Dokuments und weist auf Abweichungen hin.
2. Wurden Anforderungen hinzugefügt oder geändert, sind die Durchsetzungskomponenten der Abschnitte in `tools/component_map.py` entsprechend anzupassen. Die Zuordnung erfolgt zeilenweise in der Reihenfolge innerhalb des jeweiligen Abschnitts.
3. `npm install` und `npm run build:xlsx` ausführen, um die Offline-Bewertungstabelle neu zu erzeugen. Anschließend `npm test` zur Selbstprüfung ausführen.

Vorhandene Bewertungs-JSON-Dateien werden anhand der Nummern dem neuen Stand zugeordnet. Nummern, die in der Baseline nicht mehr vorkommen, werden beim Import ignoriert und mit einem Hinweis gemeldet.

Außerdem ist der Text unter `01-standard/` im Repository durch die neue Fassung zu ersetzen und die Versionsnummer in der README zu aktualisieren.

## 4 Mehrsprachigkeit

Oberflächentexte verwenden den chinesischen Originaltext als Schlüssel. Die Übersetzungen je Sprache liegen in `i18n/<Sprache>.json`; fehlt eine Übersetzung, wird der chinesische Text angezeigt. Unterstützt werden zh-CN, en, ja, ko, de, fr und es.

- **Übersetzung ändern**: `i18n/<Sprache>.json` bearbeiten, mit `npm run build:i18n` die Datei `data/i18n.<Sprache>.js` neu erzeugen und anschließend `npm test` ausführen.
- **Bei geänderten Oberflächentexten oder Baseline-Anforderungen**: `npm test` ausführen; der Test listet je Sprache die fehlenden chinesischen Zeichenketten auf. Diese ergänzen und die Wörterbücher neu erzeugen. Die Terminologie richtet sich nach `i18n/glossary.md`. Nach einer Revision der Baseline sind auch die Übersetzungen unter `01-standard/` nachzuziehen.
- **Sprache hinzufügen**: Sprachcode und Namen in `LOCALES` in `assets/i18n.js` eintragen, `i18n/<Sprache>.json` anlegen, `data/i18n.<Sprache>.js` in `index.html` einbinden und danach die Übersetzungen wie oben ergänzen. Übersetzungen der Baseline, der Anleitung zur Verwendung und dieser Anleitung liegen in `01-standard/<Sprache>/`, `02-usage/<Sprache>/` und `docs/<Sprache>.md`.

## 5 Drittanbieter-Komponenten

- [ExcelJS](https://github.com/exceljs/exceljs) 4.4.0, MIT-Lizenz. Der Lizenztext befindet sich in `vendor/exceljs.LICENSE`.
- [IBM Plex Sans / Mono](https://github.com/IBM/plex) lateinische Teilmenge, SIL Open Font License 1.1. Der Lizenztext befindet sich in `vendor/fonts/OFL.txt`. Für chinesische Zeichen werden Systemschriften verwendet (PingFang, Microsoft YaHei oder Source Han Sans).
