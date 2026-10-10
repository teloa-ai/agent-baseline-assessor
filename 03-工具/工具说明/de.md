# 03 Werkzeugbeschreibung

Dieser Text richtet sich an Betreuende. Er beschreibt die Repository-Struktur, die Aufgabe der einzelnen Skripte, die Aktualisierung der Daten nach einer Überarbeitung der Baseline sowie die verwendeten Drittanbieter-Komponenten. Zur Verwendung siehe [02 Verwendung](../../02-使用方法/de/使用方法.md).

## 1 Verzeichnisstruktur

Das Verzeichnis, in dem sich diese Datei befindet, ist das Werkzeug-Stammverzeichnis. Alle folgenden Pfade und Befehle beziehen sich auf `03-工具/` als Ausgangspunkt.

```
index.html               Einstiegsseite
assets/
  app.js                 Oberfläche und Interaktion
  score.js               Bewertungsregeln (von Webseite und Node gemeinsam genutzt)
  charts.js              Radar-, Lücken- und Verteilungsdiagramme (reines SVG)
  workbook.js            Erzeugung und Einlesen von Excel (von Webseite und Node gemeinsam genutzt)
  styles.css
data/
  baseline.json          Baseline-Daten: Kapitel, Abschnitte, Anforderungen, Stufen, Durchsetzungskomponenten, Prüfpunkte
  baseline.js            Dieselben Daten für das Öffnen per Doppelklick im Offline-Modus
vendor/exceljs.min.js    ExcelJS 4.4.0 (MIT), wird nur beim Import und Export von Excel geladen
vendor/fonts/            IBM-Plex-Teilmenge für lateinische Zeichen (OFL), wird lokal geladen, keine externen Verbindungen
offline/                 Offline-Excel-Bewertungstabelle
tools/                   Skripte zur Erzeugung von Daten und Vorlagen, Selbstprüfung, Kreuzprüfung der Excel-Formeln
deploy/                  nginx-Konfiguration und Dockerfile
_headers                 Sicherheits-Antwortheader für Cloudflare Pages
.github/workflows/       Automatische Veröffentlichung auf GitHub Pages
```

## 2 Häufig verwendete Befehle

| Befehl | Funktion |
| --- | --- |
| `npm install` | Installiert die Abhängigkeiten (ExcelJS, nur zur Erzeugung und Prüfung der Excel-Dateien) |
| `npm run build:xlsx` | Erzeugt die Offline-Bewertungstabelle unter `offline/` neu |
| `npm test` | Prüft den Round-Trip zwischen Daten und Excel-Lesen bzw. -Schreiben |
| `npm run check:xlsx` | Berechnet die exportierten Excel-Formeln mit LibreOffice unabhängig neu und vergleicht sie zellweise mit der Bewertung der Webseite (setzt eine lokale Installation von LibreOffice voraus) |

## 3 Aktualisierung der Baseline

Nach einer Überarbeitung des Baseline-Dokuments wird in drei Schritten aktualisiert:

1. Das Baseline-Dokument als Markdown exportieren und `python3 tools/build_data.py <Exportdatei> --version 1.1 --date 2026-12-01` ausführen. Dadurch werden `data/baseline.json` und `data/baseline.js` neu erzeugt. Das Skript prüft doppelte Nummern, die Reihenfolge der Nummern, nicht gesetzte Stufen, fehlende Kumulation der Stufen und fehlende Durchsetzungskomponenten. Gemäß Abschnitt 6.4 der Baseline werden gelöschte Nummern nicht wiederverwendet, Nummernsprünge sind daher zulässig. Außerdem vergleicht das Skript die handgepflegten Vertrauensannahmen der Komponenten und die Prüfpunkte mit den Abschnitten 4.2 und 4.3 des Dokuments und weist auf Abweichungen hin.
2. Wurden Anforderungen hinzugefügt oder geändert, sind die Durchsetzungskomponenten der Abschnitte in `tools/component_map.py` entsprechend anzupassen. Die Zuordnung erfolgt zeilenweise in der Reihenfolge innerhalb des jeweiligen Abschnitts.
3. `npm install` und `npm run build:xlsx` ausführen, um die Offline-Bewertungstabelle neu zu erzeugen. Anschließend `npm test` zur Selbstprüfung ausführen.

Vorhandene Bewertungs-JSON-Dateien werden anhand der Nummern dem neuen Stand zugeordnet. Nummern, die in der Baseline nicht mehr vorkommen, werden beim Import ignoriert und mit einem Hinweis gemeldet.

Außerdem ist der Text unter `01-标准/` im Repository durch die neue Fassung zu ersetzen und die Versionsnummer in der README zu aktualisieren.

## 4 Drittanbieter-Komponenten

- [ExcelJS](https://github.com/exceljs/exceljs) 4.4.0, MIT-Lizenz. Der Lizenztext befindet sich in `vendor/exceljs.LICENSE`.
- [IBM Plex Sans / Mono](https://github.com/IBM/plex) lateinische Teilmenge, SIL Open Font License 1.1. Der Lizenztext befindet sich in `vendor/fonts/OFL.txt`. Für chinesische Zeichen werden Systemschriften verwendet (PingFang, Microsoft YaHei oder Source Han Sans).
