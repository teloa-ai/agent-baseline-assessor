# 02 Verwendung

Dieser Text beschreibt, wie das Selbstbewertungswerkzeug zur Bewertung gegen die Baseline eingesetzt wird. Behandelt werden die drei Betriebsarten Online, Offline und private Bereitstellung sowie die Bewertungsregeln und die Art der Datenspeicherung. Verzeichnisstruktur und Pflege des Werkzeugs selbst sind in der [Werkzeugbeschreibung](../../03-tool/docs/de.md) beschrieben.

## 1 Drei Verwendungsarten

### 1.1 Online

Die Anwendung kann auf GitHub Pages oder Cloudflare Pages veröffentlicht werden; beide bieten einen kostenlosen Tarif. Die Schritte sind in Abschnitt 4 beschrieben. Cloudflare Pages liest die Datei `_headers` unter `03-tool/` und setzt damit dieselben Sicherheits-Antwortheader wie die nginx-Konfiguration. GitHub Pages unterstützt keine eigenen Antwortheader.

### 1.2 Offline

Dafür gibt es zwei Möglichkeiten.

- **Offline-Webseite**: Das ZIP-Archiv des Repositorys herunterladen, entpacken und `03-tool/index.html` per Doppelklick öffnen. Der Funktionsumfang entspricht der Online-Version vollständig.
- **Offline-Excel**: Die Datei `03-tool/offline/baseline-assessment.xlsx` direkt ausfüllen. Die Tabelle enthält Auswahllisten, Summenformeln und Lückenstatistiken. Die ausgefüllte Datei kann zur Fortsetzung der Bewertung wieder in die Webseite importiert werden.

### 1.3 Private Bereitstellung

Die Seite besteht aus reinen statischen Dateien und kann von jedem beliebigen statischen Dateiserver gehostet werden. Das Repository enthält eine nginx-Image-Konfiguration für den Betrieb als Nicht-root-Benutzer. Die Content-Security-Policy untersagt der Seite jede Verbindung zu externen Adressen.

```bash
cd 03-tool && docker build -f deploy/Dockerfile -t agent-baseline-assessor .
docker run -d -p 8080:8080 --read-only --tmpfs /tmp agent-baseline-assessor
```

Ohne Docker genügt es, die Dateien `index.html`, `assets/`, `data/`, `vendor/` und `offline/` aus `03-tool/` in das Web-Root-Verzeichnis zu kopieren. Empfohlen wird außerdem, die Sicherheits-Antwortheader aus `deploy/nginx.conf` zu übernehmen. Die MIME-Typen werden aus der mitgelieferten Datei `mime.types` von nginx übernommen. Im server-Block sollte kein eigenes `types {}` angelegt werden, da dies die gesamte Tabelle überschreiben würde und die Seite dann als Datei zum Herunterladen behandelt würde.

## 2 Funktionen

| Seite | Funktionen |
| --- | --- |
| Abdeckungsmatrix | Oben werden die aktuell erreichte Stufe sowie der Erfüllungsstand der drei Stufen L1, L2 und L3 angezeigt. In der Ansicht nach Kapiteln entspricht jede Zeile einem Kapitel und jede Zelle einem Abschnitt; die segmentierte Farbleiste am unteren Zellenrand zeigt den Status jeder einzelnen Anforderung. Mit der Umschaltung auf „Komponente × Kapitel“ erscheint eine Heatmap, die für jede Durchsetzungskomponente und jedes Kapitel die Erfüllungsquote zeigt. Ein Klick auf eine Zelle öffnet die Einzelbewertung |
| Einzelbewertung | Filterung nach Kapitel, Komponente, Stufe, Status und Stichwort; Festlegung des Status sowie Erfassung von Nachweisen, verantwortlicher Person und geplantem Abschlusstermin. Nicht anwendbare Abschnitte können vollständig markiert werden |
| Bewertungsbericht | Zuerst das Ergebnis: Reifegradstufen, Anzahl der fehlenden Anforderungen bis zur nächsten Stufe, Erfüllungsquote innerhalb des Zielniveaus, Lückeneinträge und Bewertungsfortschritt; danach die vorrangig zu bearbeitenden Anforderungen. Zu den Diagrammen gehören das Radar der Erfüllungsquote (nach Kapitel oder Komponente), die Reifegrade der Kapitel und die Verteilung der Lücken; alle können als PNG oder SVG heruntergeladen werden. Ergänzend stehen eine Statistiktabelle je Komponente und die vollständige Lückenliste zur Verfügung |
| Daten | Erfassen der Bewertungsangaben; Export als JSON oder Excel; Import von JSON oder Offline-Excel; Laden eines früheren Ergebnisses zum Vergleich; Zurücksetzen der aktuellen Bewertung |

Die exportierte Excel-Datei hat denselben Aufbau wie die Offline-Vorlage und umfasst fünf Blätter: Bewertungstabelle, Zusammenfassung (Formeln werden bei jeder Statusänderung sofort neu berechnet; die Zielstufe lässt sich per Auswahlliste umschalten), Lückenliste, Architektursicht und Erläuterung.

## 3 Bewertungsregeln

- **Erfüllungsquote** = erfüllte ÷ anwendbare Anforderungen. Gezählt werden nur Anforderungen innerhalb der Zielstufe. Teilweise erfüllte und nicht bewertete Anforderungen zählen als nicht erfüllt.
- **Erreichen einer Stufe**: Eine Stufe gilt als erreicht, wenn alle anwendbaren Anforderungen dieser Stufe und der darunterliegenden Stufen erfüllt sind. Fehlt auch nur eine davon, bleibt das Ergebnis bei der niedrigeren Stufe.
- **Lückeneintrag**: Anwendbare Anforderung innerhalb der Zielstufe, die noch nicht erfüllt ist.
- **Nicht anwendbar**: Verfügt die Plattform über eine Fähigkeit nicht (etwa keine Unterstützung von MCP), wird der betreffende Abschnitt insgesamt als nicht anwendbar markiert. Er fließt dann nicht in die Erfüllungsquote ein.

Webseite und Excel verwenden dieselben Regeln. In Excel gilt ein geleerter Status oder ein Wert außerhalb der Auswahlliste als nicht bewertet.

## 4 Veröffentlichung

### 4.1 Veröffentlichung auf GitHub Pages

1. Ein neues Repository anlegen und das gesamte Projekt in den Branch `main` pushen. Der Workflow erstellt die Anwendung automatisch aus `03-tool/`.
2. Unter Settings → Pages → Build and deployment ist als Source **GitHub Actions** auszuwählen.
3. Bei jedem weiteren Push auf `main` erzeugt `.github/workflows/pages.yml` die Offline-Bewertungstabelle neu, führt die Selbstprüfung aus und veröffentlicht danach nur die für die Seite benötigten Dateien. Der Build-Job hat nur Leserechte; bei der Installation von Abhängigkeiten werden keine Installationsskripte ausgeführt. Der Veröffentlichungs-Job führt keinen Code von Drittanbietern aus.

Kostenlose GitHub-Konten können Pages nur für öffentliche Repositories aktivieren. Ist die Baseline noch nicht öffentlich, kommen eine private Bereitstellung oder GitHub Enterprise in Frage, das private Pages unterstützt.

### 4.2 Veröffentlichung auf Cloudflare Pages

Eine der beiden folgenden Möglichkeiten wählen.

- **GitHub-Repository verbinden**: In der Cloudflare-Konsole Workers & Pages → Erstellen → Pages → Mit Git verbinden aufrufen und dieses Repository auswählen. Als Root directory (Stammverzeichnis) ist `03-tool` anzugeben, als Build-Befehl `mkdir -p _site && cp -r index.html _headers assets data vendor offline _site/`, als Ausgabeverzeichnis `_site`. Danach wird bei jedem Push automatisch veröffentlicht.
- **Direkter Upload über die Kommandozeile**, ohne Git-Anbindung: Im Verzeichnis `03-tool/` den oben genannten Build-Befehl ausführen und anschließend `npx wrangler pages deploy _site --project-name agent-baseline-assessor` starten.

Die Adresse nach der Veröffentlichung lautet `https://<Projektname>.pages.dev`; alternativ kann eine eigene Domain eingebunden werden. Soll der Zugriff auf das Unternehmensnetz beschränkt bleiben, empfiehlt sich zusätzlich Cloudflare Access, das eine Anmeldung über die Unternehmens-E-Mail oder einen IdP verlangt.

## 5 Daten und Datenschutz

- Die Bewertungsdaten werden im lokalen Speicher des Browsers (localStorage) abgelegt. Die Seite stellt keine Netzwerkanfragen und enthält keinen Code für Statistik oder Telemetrie.
- Der lokale Speicher ist nach Ursprung (Origin) getrennt. Die Projektseiten von GitHub Pages teilen sich den Ursprung `<Konto>.github.io`; andere Seiten desselben Kontos können diese Daten daher lesen. Auch lokale Webseiten, die in Chrome über file:// geöffnet werden, verwenden denselben Speicher. Bei sensiblen Bewertungsinhalten sollten eine eigene Domain oder eine private Bereitstellung verwendet werden.
- Vor einem Gerätewechsel, einer Bereinigung des Browsers oder der Weitergabe zur Prüfung an Dritte sollte auf der Seite „Daten“ eine JSON-Datei exportiert werden.
- Beim Import werden nur Nummern und Statuswerte akzeptiert, die in der Baseline vorhanden sind. Alle übrigen Inhalte werden ignoriert. Sämtlicher angezeigter Text wird vor der Darstellung maskiert.

## 6 Sprachen

Die Seite ist auf 简体中文, English, 日本語, 한국어, Deutsch, Français und Español verfügbar. Die Sprache wird oben rechts umgeschaltet; bereits erfasste Bewertungen bleiben dabei erhalten. Beim ersten Aufruf richtet sich die Sprache nach der Browsereinstellung; mit `?lang=de` (oder `zh-CN`, `en`, `ja`, `ko`, `fr`, `es`) am Ende der Adresse wird eine bestimmte Sprache geöffnet. Exportierte Excel-Dateien verwenden die aktuelle Sprache, und Dateien aus jeder Sprache lassen sich importieren. Die Offline-Bewertungstabelle unter `offline/` ist chinesisch; für andere Sprachen steht auf der Seite **Daten** die Schaltfläche **Leere Bewertungstabelle herunterladen** zur Verfügung.
