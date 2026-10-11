# Sicherheitsbaseline für Identität und Autorisierung von Unternehmensagenten

Autor: Max · 2026-10-07

Diese Baseline steht unter der Lizenz [CC BY 4.0](../../LICENSE-DOCS).

## Vorwort

Diese Baseline legt die Sicherheitsanforderungen fest, die Agenten in Unternehmensumgebungen hinsichtlich Identität und Autorisierung erfüllen sollen. Die Anforderungen sind nach dem Ablauf eines einzelnen Agentenvorgangs und danach nach den sitzungsübergreifenden Objekten in zehn Kapitel gegliedert. Jede Anforderung ist einzeln überprüfbar und ist in drei Stufen L1 bis L3 eingeteilt.

Den übergeordneten Grundsatz aller Anforderungen bildet die minimale Autonomie (least agency). Sie gewährt dem Agenten nur den minimalen Handlungsspielraum und Autonomiegrad, der zur Erfüllung der Geschäftsaufgabe nötig ist. Minimale Berechtigungen regeln, worauf der Agent zugreifen kann. Minimale Autonomie regelt zusätzlich, was er selbst entscheiden darf und wie lange er ohne Aufsicht arbeiten kann.

Diese Baseline lässt sich auf drei Arten verwenden.

- Plattformaufbau: Zielstufe festlegen, jede Anforderung umsetzen; die Anforderungen dienen zugleich als Entwurfsvorgabe und als Testfall.
- Lieferantenbewertung: Die Anforderungen werden als Fragebogen verwendet; der Lieferant erläutert zu jeder Anforderung die Umsetzung und legt Nachweise vor.
- Sicherheitsreview: Die auf den Anwendungsfall zutreffenden Anforderungen werden ausgewählt, einzeln geprüft, und das Ergebnis wird in der zugehörigen Bewertungstabelle festgehalten.

Die vorliegende Version ist v1.0. Das Gliederungsschema orientiert sich an OWASP ASVS 5.0; die Anforderungsnummern folgen dem Format „V Kapitel.Abschnitt.Anforderung“, etwa V4.2.1. Bei Verweisen ist die Versionsnummer anzugeben.

## 1. Geltungsbereich

Diese Baseline gilt für Agentenplattformen und Harnesses, die im Unternehmen betrieben oder beschafft werden. Sie regelt ausschließlich, in wessen Identität, unter welcher Autorisierung, über welchen Weg ein Agent zugreift und welche Ergebnisse er erzeugt. Isolierung der Ausführung, Ausleitungskontrolle und Ausgabekontrolle sind Mittel zur Durchsetzung der Autorisierung und sind in diese Baseline einbezogen.

Anwendbar auf:

- selbst entwickelte Agentenplattformen und Agentenanwendungen
- beschaffte SaaS-Agentenplattformen sowie in SaaS-Produkte eingebettete Agenten
- Agenten, die auf Mitarbeiter-Endgeräten laufen, etwa Coding-Agenten, Desktop-Assistenten und Browser-Erweiterungen
- On-Premises-Bereitstellung und SaaS-Bereitstellung

Nicht im Geltungsbereich:

- Datenverwaltung für Training und Feinabstimmung von Modellen, Robustheit von Modellen, adversariale Beispiele; siehe OWASP AISVS und CSA AICM
- Inhaltssicherheit und Genauigkeit der Ausgaben, etwa Halluzinationen, Verzerrungen, schädliche Inhalte
- Gestaltung der Zugriffskontrolle nachgelagerter Geschäftssysteme selbst; diese Baseline verlangt nur, dass sie die bei einem Zugriff im Auftrag eines Benutzers übermittelte Benutzeridentität entgegennehmen und prüfen können
- Härtung von Hosts, Netzwerkgrenzen, Schwachstellenmanagement und sonstige allgemeine Infrastruktursicherheit; diese richtet sich nach der bestehenden Baseline des Unternehmens

Die Anforderungen sind mit der Plattform als Subjekt formuliert. Bei einer Beschaffung prüft das nutzende Unternehmen den Lieferanten anhand der Anforderungen. In den Anforderungen bezeichnet „Unternehmen“ den Nutzer, „Plattform“ das System, das Agentenfunktionen bereitstellt, und „Anbieter“ den Entwickler oder Betreiber der Plattform.

## 2. Normative Verweise und Referenzdokumente

Dokumente, die in einer Anforderung ausdrücklich benannt sind und ohne „wie“ oder „oder gleichwertig“ angeführt werden, gelten als normative Verweise; bei der Umsetzung ist ihnen gemäß ihrer Vorgaben zu folgen. Alle übrigen Dokumente dienen nur der Zuordnung und als Hintergrundreferenz.

| Dokument | Herausgeber | Status | Art | Verwendung in dieser Baseline |
| --- | --- | --- | --- | --- |
| [RFC 6749 OAuth 2.0 Autorisierungsframework](https://www.rfc-editor.org/rfc/rfc6749) | IETF | formaler RFC | normativ | Benutzerautorisierung und Zugriffstoken (V4.3) |
| [OpenID Connect Core 1.0](https://openid.net/specs/openid-connect-core-1_0.html) | OpenID Foundation | finale Spezifikation | normativ | Anmeldung über den Unternehmens-IdP (V1.1.1) |
| SAML 2.0 | OASIS | formaler Standard | normativ | Anmeldung über den Unternehmens-IdP (V1.1.1) |
| [RFC 8693 OAuth 2.0 Token Exchange](https://www.rfc-editor.org/rfc/rfc8693) | IETF | formaler RFC | normativ | Zugriff im Auftrag des Benutzers, Delegationskette und act-Claim |
| [RFC 9449 OAuth 2.0 Demonstrating Proof of Possession (DPoP)](https://www.rfc-editor.org/rfc/rfc9449) | IETF | formaler RFC | normativ | Sender-Bindung von Token (V4.6.2) |
| [RFC 8705 OAuth 2.0 Mutual-TLS Client Authentication and Certificate-Bound Access Tokens](https://www.rfc-editor.org/rfc/rfc8705) | IETF | formaler RFC | normativ | Sender-Bindung von Token (V4.6.2) |
| [RFC 7489 DMARC](https://www.rfc-editor.org/rfc/rfc7489) | IETF | informativer RFC | normativ | Prüfung des Absenders im E-Mail-Kanal (V1.2.6) |
| [Model Context Protocol Spezifikation 2026-07-28](https://modelcontextprotocol.io/specification/versioning) | MCP-Projekt | aktuelle Version | normativ | MCP-Aufrufe und Autorisierung (V4.5) |
| [RFC 9470 OAuth 2.0 Step Up Authentication Challenge Protocol](https://www.rfc-editor.org/rfc/rfc9470) | IETF | formaler RFC | Referenz | Authentifizierungszeitpunkt und -stärke bei Step-up-Authentifizierung (V1.1.3, V3.5) |
| [RFC 8707 Resource Indicators for OAuth 2.0](https://www.rfc-editor.org/rfc/rfc8707) | IETF | formaler RFC | Referenz | Eingrenzung der Token-Audience (aud) (V4.5.5, V4.6.3) |
| [RFC 9700 OAuth 2.0 Security Best Current Practice](https://www.rfc-editor.org/rfc/rfc9700) | IETF | BCP | Referenz | Sicherheitsanforderungen an OAuth-Implementierungen |
| RFC 7643, RFC 7644 SCIM | IETF | formaler RFC | Referenz | Synchronisierung und Sperrung von Benutzern und Gruppen (V1.1.2) |
| [OpenID Shared Signals Framework 1.0](https://openid.net/wg/sharedsignals/) | OpenID Foundation | finale Spezifikation (September 2025) | Referenz | Übermittlung von Sicherheitsereignissen |
| [OpenID Continuous Access Evaluation Profile (CAEP) 1.0](https://openid.net/specs/openid-caep-1_0-final.html) | OpenID Foundation | finale Spezifikation (September 2025) | Referenz | Sitzungswiderruf und Risikosignale (V3.5.2, V10.4.4) |
| [RFC 9396 OAuth 2.0 Rich Authorization Requests](https://www.rfc-editor.org/rfc/rfc9396) | IETF | formaler RFC | Referenz | Beschreibung feingranularer Berechtigungen (V2.2.6) |
| [Identity Assertion JWT Authorization Grant (ID-JAG), Entwurf -04](https://www.ietf.org/archive/id/draft-ietf-oauth-identity-assertion-authz-grant-04.html) | IETF OAuth-Arbeitsgruppe | Arbeitsgruppenentwurf | Referenz | Austausch über den Unternehmens-IdP gegen nachgelagerte Token, also Cross-App Access (XAA) (V4.3.3, V4.5.4) |
| [RFC 7523 JWT Profile for OAuth 2.0 Client Authentication and Authorization Grants](https://www.rfc-editor.org/rfc/rfc7523) | IETF | formaler RFC | Referenz | Autorisierungsgrant für ID-JAG |
| [Identity Continuation Assertion, Entwurf -02](https://datatracker.ietf.org/doc/draft-mcguinness-oauth-id-continuation-assertion/) | IETF, persönlicher Entwurf | persönlicher Entwurf (September 2026) | Referenz | Fortführung der Delegationskette nach Abmeldung des Benutzers |
| [Transaction Tokens, Entwurf -11](https://datatracker.ietf.org/doc/draft-ietf-oauth-transaction-tokens/) | IETF OAuth-Arbeitsgruppe | Arbeitsgruppenentwurf | Referenz | Weitergabe des Autorisierungskontexts entlang der Aufrufkette innerhalb derselben Vertrauensdomäne (V2.4.7) |
| [OpenID AuthZEN Authorization API 1.0](https://openid.net/specs/authorization-api-1_0.html) | OpenID Foundation | finale Spezifikation (Januar 2026) | Referenz | Standardschnittstelle des Policy-Entscheidungspunkts (V3.2.5) |
| [SPIFFE](https://spiffe.io/) | CNCF | Spezifikation eines abgeschlossenen CNCF-Projekts | Referenz | Workload-Identität und Attestierung der Ausführungsinstanz (V1.4.5) |
| [WIMSE Architekturentwurf -08](https://datatracker.ietf.org/doc/draft-ietf-wimse-arch/) | IETF WIMSE-Arbeitsgruppe | Arbeitsgruppenentwurf | Referenz | Workload-Identität über Systemgrenzen hinweg (V1.4) |
| [MCP Enterprise-Managed Authorization Erweiterung](https://modelcontextprotocol.io/extensions/auth/enterprise-managed-authorization) | MCP-Projekt | offizielle Erweiterung | Referenz | Autorisierter Zugang zu MCP-Servern über den Unternehmens-IdP (V4.5.4) |
| [NIST SP 800-207 Zero Trust Architecture](https://csrc.nist.gov/pubs/sp/800/207/final) | NIST | offizielle Publikation | Referenz | Kontinuierliche Verifizierung und minimale Berechtigungen |
| [NIST SP 800-63-4 Digital Identity Guidelines](https://csrc.nist.gov/pubs/sp/800/63/4/final) | NIST | offizielle Publikation (Juli 2025) | Referenz | Authentifizierungsstärke und Re-Authentifizierung |
| [NIST IR 8587 Protecting Tokens and Assertions Against Forgery, Theft, and Misuse](https://csrc.nist.gov/pubs/ir/8587/final) | NIST | offizielle Publikation (September 2026) | Referenz | Token-Management |
| [NIST NCCoE Concept Paper zu Identität und Autorisierung von Software- und KI-Agenten](https://www.nccoe.nist.gov/sites/default/files/2026-02/accelerating-the-adoption-of-software-and-ai-agent-identity-and-authorization-concept-paper.pdf) | NIST | Konsultationsentwurf (Februar 2026) | Referenz | Problemrahmen: Kennzeichnung, Authentifizierung, Autorisierung, Delegation, Audit, Prompt Injection |
| [Back to the Future: Why Agentic AI Needs a Strong Identity Foundation](https://www.nist.gov/blogs/cybersecurity-insights/back-future-why-agentic-ai-needs-strong-identity-foundation) | NIST | Blogbeitrag vom 27. August 2026 | Referenz | Grundprinzipien der Identität und öffentliches Feedback zum Konzeptpapier |
| [OWASP Top 10 for Agentic Applications for 2026](https://genai.owasp.org/resource/owasp-top-10-for-agentic-applications-for-2026/) | OWASP | veröffentlicht Dezember 2025 | Referenz | Risikozuordnung, siehe Anhang A; Ursprung der minimalen Autonomie |
| [OWASP Top 10 for LLM Applications 2025](https://genai.owasp.org/llm-top-10/) | OWASP | veröffentlicht November 2024 | Referenz | Risikozuordnung, siehe Anhang A |
| [OWASP AISVS 1.0](https://owasp.org/www-project-artificial-intelligence-security-verification-standard-aisvs-docs/) | OWASP | veröffentlicht Juni 2026 | Referenz | Kontrollzuordnung, siehe Anhang B |
| [OWASP ASVS 5.0](https://owasp.org/www-project-application-security-verification-standard/) | OWASP | formal veröffentlicht | Referenz | Gliederungsschema dieser Baseline |
| [CSA AI Controls Matrix v1.1](https://cloudsecurityalliance.org/blog/2026/07/14/ai-controls-matrix-v1-1-strengthening-the-foundation-for-trustworthy-ai) | CSA | veröffentlicht Juli 2026 | Referenz | Kontrollzuordnung, siehe Anhang C |
| [Agent Frameworks, Runtimes, and Harnesses](https://www.langchain.com/blog/agent-frameworks-runtimes-and-harnesses-oh-my) | LangChain | Blogbeitrag vom Oktober 2025 | Referenz | Klassifizierung von Frameworks, Laufzeiten und Harnesses (4.1) |
| [The lethal trifecta for AI agents](https://simonwillison.net/2025/Jun/16/the-lethal-trifecta/) | Simon Willison | Artikel vom Juni 2025 | Referenz | Kombinierte Risiken aus nicht öffentlichen Daten, nicht vertrauenswürdigen Inhalten und Ausleitung (V6.2, V7.5) |
| [The Dual LLM pattern](https://simonwillison.net/2023/Apr/25/dual-llm-pattern/) | Simon Willison | Artikel vom April 2023 | Referenz | Verarbeitung nicht vertrauenswürdiger Inhalte durch ein isoliertes Modell (V6.2.4) |
| [CaMeL: Defeating Prompt Injections by Design](https://arxiv.org/abs/2503.18813) | Google DeepMind u. a. | Forschungsarbeit 2025 | Referenz | Trennung von Kontrollfluss und Datenfluss (V6.2.4) |

Entwürfe können geändert oder zurückgezogen werden. Bei der Anwendung gilt die jeweils neueste Version zum Zeitpunkt der Umsetzung.

## 3. Begriffe und Definitionen

Die folgenden Begriffe haben in dieser Baseline eine spezifische Bedeutung. Wo sie in den Anforderungen auftreten, sind sie entsprechend zu verstehen.

| Nr. | Begriff | Definition |
| --- | --- | --- |
| 3.1 | Agent (Agent) | KI-System, das ein Ziel versteht, Tools aufruft und mehrstufige Aufgaben selbstständig ausführt. In der Baseline als Agent abgekürzt |
| 3.2 | Harness | Softwareschicht, die das Modell umschließt und dem Agenten Wahrnehmung und Handeln ermöglicht. Sie besteht aus mehreren Teilsystemen: Agentenschleife, Kontextverwaltung (einschließlich Komprimierung), Tool-Schicht, Sicherheitskontrollen (Berechtigungen, Genehmigungen, Hooks), Orchestrierung (Planung, Sub-Agenten) und Erweiterungsschnittstellen (Skills, Plugins, MCP). Claude Code, Claude Agent SDK und DeepAgents gehören zu dieser Kategorie. Die Baseline verwendet den englischen Begriff Harness |
| 3.3 | Framework (Framework) | Bibliothek, die Entwicklungsabstraktionen wie Modellaufrufe und Tool-Definitionen bereitstellt, z. B. LangChain, OpenAI Agents SDK, Vercel AI SDK |
| 3.4 | Laufzeit (Runtime) | Infrastruktur, die dem Agenten persistente Ausführung, Zustandsspeicherung und Wiederherstellung nach Abstürzen bereitstellt, z. B. LangGraph, Temporal. Ein Harness kann auf einer Laufzeit aufsetzen |
| 3.5 | Ausführungsumgebung | Umgebung, in der der Harness Code, Befehle, Dateien und Browseroperationen ausführt, z. B. Container-Sandbox, virtuelle Maschine, Mitarbeiter-Endgerät |
| 3.6 | Plattform | Gesamtsystem, das die Erstellung, den Betrieb und die Verwaltung von Agenten bereitstellt; es umfasst Harness, Laufzeit, Ausführungsumgebung, Policy-Entscheidungspunkt, Egress-Gateway und Verwaltungsebene |
| 3.7 | Anbieter | Entwickler oder Betreiber der Plattform |
| 3.8 | Benutzer | Natürliche Person, die im Unternehmens-IdP eine Identität hat und Agenten verwendet |
| 3.9 | Autonomer Agent (autonomous agent) | Agent, der Operationen in eigener Identität ausführt und nicht im Auftrag eines bestimmten Benutzers handelt; er greift in der Regel mit einer Anwendungsidentität auf nachgelagerte Systeme zu, im Gegensatz zum Zugriff im Auftrag eines Benutzers. „Autonom“ bedeutet hier, dass der Agent in eigener Identität läuft (entspricht dem autonomous agent von Microsoft Entra Agent ID); es hat nichts mit dem in 3.29 beschriebenen Grad an Autonomie zu tun |
| 3.10 | Delegation | Eine Entität übergibt einen Teil ihrer Berechtigungen an eine andere Entität, damit diese sie in deren Namen ausübt |
| 3.11 | Zugriff im Auftrag des Benutzers (on-behalf-of, OBO) | Der Agent greift mit der Autorisierung des auslösenden Benutzers auf nachgelagerte Systeme zu; das nachgelagerte System entscheidet anhand der Berechtigungen dieses Benutzers. Bei Verwendung der Delegationssemantik kennzeichnet das Token gleichzeitig den Benutzer (als Subjekt) und den Agenten (als handelnde Partei im act-Claim) |
| 3.12 | Delegationskette | Geordnete Aufzeichnung der stufenweisen Delegationsbeziehungen vom auslösenden Benutzer oder von der Auslösequelle bis zum aktuellen Ausführenden; sie entspricht den verschachtelten act-Claims nach RFC 8693 |
| 3.13 | Autorisierungsumfang des Agenten | Obergrenze der verfügbaren Tools, Verbindungen und Daten, die ein Administrator für einen Agenten konfiguriert |
| 3.14 | Wirksame Berechtigungen | Die Berechtigungen, die bei einem Aufruf tatsächlich verfügbar sind. Bei einem Zugriff im Auftrag des Benutzers ist es die Schnittmenge aus den aktuellen Berechtigungen des auslösenden Benutzers, dem Autorisierungsumfang des Agenten und dem Aufgabenumfang (sofern deklariert). Ein autonomer Agent verwendet die Schnittmenge aus seiner eigenen Autorisierung und dem Autorisierungsumfang des Agenten. Sub-Agenten und nachgelagerte Agenten bilden zusätzlich die Schnittmenge mit dem Delegationsumfang der vorgelagerten Stufe |
| 3.15 | Offline-Delegationsaufgabe | Geplante oder langlaufende Aufgabe, die ein Benutzer anlegt und die in dessen Abwesenheit läuft, sowie Auslöseregeln, die in dessen Identität ausgeführt werden |
| 3.16 | Policy-Entscheidungspunkt (policy decision point, PDP) | Komponente, die anhand von Identität, Delegationskette, Operation und Kontext eine Autorisierungsentscheidung trifft |
| 3.17 | Egress-Gateway (egress gateway) | Einziger Ausgang des Agenten zu allen Systemen außerhalb der Ausführungsumgebung, einschließlich interner Unternehmenssysteme und externer Dienste. Er setzt die Autorisierungsentscheidung durch, injiziert Zugangsdaten und begrenzt die Rate; er ist der wichtigste Policy-Durchsetzungspunkt |
| 3.18 | Workload-Identität (workload identity) | Von der Plattform für die Ausführungsinstanz ausgestellte, überprüfbare Identität; sie besteht aus einer Workload-Kennung (z. B. SPIFFE-ID) und einem Identitätsnachweis (z. B. X.509-SVID, JWT-SVID). Diese Baseline verlangt, dass sie pro Sitzung ausgestellt und an die Ausführungsinstanz gebunden wird; Benutzer und Agent der Sitzung werden von der Plattform bei der Ausstellung registriert, und das Gateway ermittelt sie anhand dieser Identität |
| 3.19 | Verwahrung von Zugangsdaten | Die für den Zugriff auf nachgelagerte Systeme nötigen Token und Schlüssel werden von der Plattform verwahrt und nur am Egress-Gateway in die Anfrage eingesetzt; weder Agent noch Modell erhalten den Klartext |
| 3.20 | Platzhalter-Zugangsdaten (placeholder credential) | Ungültige Werte in der Ausführungsumgebung und im Kontext, die echte Zugangsdaten ersetzen. Das Gateway prüft am Ausgang das Ziel und ersetzt sie anschließend durch die echten Zugangsdaten; dieser Vorgang heißt Injektion von Zugangsdaten (credential injection) |
| 3.21 | Nicht vertrauenswürdige Inhalte | Inhalte, die weder von einer Plattformrichtlinie noch vom Benutzer selbst stammen, einschließlich Webseiten, E-Mails, Dateien, Tool-Rückgaben und Ausgaben anderer Agenten |
| 3.22 | Kanal (Interaktionskanal) | Eingangspunkt, über den der Benutzer mit dem Agenten interagiert, z. B. Web, Instant Messaging, E-Mail, IDE, API |
| 3.23 | Arbeitsergebnis | Vom Agenten erzeugter und gespeicherter oder geteilter Bericht, Dokument, Code o. Ä. |
| 3.24 | Gedächtnis | Inhalte, die über Sitzungen hinweg erhalten bleiben und später abgerufen werden können, einschließlich persönlichem Gedächtnis und gemeinsamem Wissen |
| 3.25 | Persistente Operation | Operation, die dem Agenten erlaubt, nach dem Ende der aktuellen Sitzung weiter zu handeln, z. B. Anlegen einer geplanten Aufgabe, einer Auslöseregel, einer Weiterleitungsregel oder eines Skills |
| 3.26 | Hochrisiko-Operation | Operation, die nach V3.1 eine Genehmigung oder eine Step-up-Authentifizierung erfordert |
| 3.27 | Arbeitsbereich | Verwaltungseinheit der Plattform, die Daten, Wissen, Zugangsdaten und Agenten isoliert, z. B. Mandant, Abteilung, Projekt. Abzugrenzen vom in der IDE geöffneten Workspace; diese Baseline nennt diesen Projektverzeichnis |
| 3.28 | Verantwortliche Person | Namentlich benannte natürliche Person, die für Konfiguration, Berechtigungen und Verhalten eines Agenten verantwortlich ist |
| 3.29 | Minimale Autonomie (least agency) | Dem Agenten wird nur der minimale Handlungsspielraum und Autonomiegrad gewährt, der zur Erfüllung der Geschäftsaufgabe nötig ist. Der Begriff stammt aus den OWASP Top 10 for Agentic Applications for 2026 |
| 3.30 | Nicht öffentliche Daten | Daten, die nach dem Datenklassifizierungsstandard des Unternehmens der Stufe „nicht öffentlich“ zugeordnet sind. Die genaue Stufe richtet sich nach dem Unternehmensstandard; sie entspricht den private data im lethal trifecta |
| 3.31 | Ausleitung | Übermittlung von Daten an einen Empfänger außerhalb des Kontrollbereichs des Unternehmens, d. h. an einen Empfänger, der nicht als nachgelagertes System des Unternehmens erfasst ist (siehe V4.2.5), z. B. externes E-Mail-Postfach, externe Website oder externer Speicher |
| 3.32 | Aufgabe | Arbeit, die ein Benutzer oder eine Auslösequelle dem Agenten übergibt, von Beginn bis Abschluss oder Abbruch; sie kann mehrere Modellaufrufe und Tool-Aufrufe umfassen |
| 3.33 | Policy-Durchsetzungspunkt (policy enforcement point, PEP) | Komponente, die eine Anfrage gemäß der Entscheidung des Policy-Entscheidungspunkts zulässt oder ablehnt; in dieser Baseline übernehmen die Vorabprüfung des Harness und das Egress-Gateway diese Funktion |
| 3.34 | Step-up-Authentifizierung (step-up authentication) | Nachdem der Benutzer angemeldet ist, erfolgt vor einer Hochrisiko-Operation eine erneute Authentifizierung mit höherer Authentifizierungsstärke oder jüngerem Authentifizierungszeitpunkt; siehe RFC 9470 |
| 3.35 | Externer Prinzipal | Kunde oder Partner, der über eine Identitätsföderation Zugang erhält und nicht im Unternehmens-IdP geführt wird |
| 3.36 | Schatten-Agent (shadow AI agent) | Agent, der nicht registriert und nicht verwaltet ist und den Mitarbeiter selbst mit Unternehmensressourcen verbunden haben |
| 3.37 | Notfallzugangskonto (break-glass account) | Vorbereitetes Konto zur Anmeldung an der Verwaltungsebene für den Fall, dass der Unternehmens-IdP nicht verfügbar ist |

## 4. Referenzarchitektur und Vertrauensgrenzen

Ein Agent besteht aus Modell und Harness. Die Plattform ergänzt den Harness um Identitätsschicht, Policy-Entscheidungspunkt, Egress-Gateway, Datenschicht, Verwaltungsebene und Audit. Jede Anforderung dieser Baseline bezieht sich auf eine dieser Komponenten.

### 4.1 Gliederung des Technologie-Stacks

&#91;eingebetteter Inhalt: Gliederung des Agenten-Technologie-Stacks · Modell, Harness, Framework, Laufzeit, Ausführungsumgebung\]

Ein Harness kann mit Hilfe eines Frameworks entwickelt werden oder direkt auf einer Laufzeit laufen. Nach der Klassifizierung von LangChain (siehe Kapitel 2) gehören Claude Code und Claude Agent SDK zu den Harnesses, LangGraph zu den Laufzeiten und LangChain zu den Frameworks. Die Sicherheitskontrollen des Harness sind der Ansatzpunkt für den größten Teil der Anforderungen in V3 und V5.

### 4.2 Referenzarchitektur der Plattform

&#91;eingebetteter Inhalt: Referenzarchitektur der Plattform · vertrauenswürdige Komponenten und nicht vertrauenswürdige Bereiche\]

Die Ausgabe des Modells ist lediglich eine Anfrage; die Ausführungsumgebung kann kompromittiert sein; Inhalte aus nachgelagerten Systemen werden als nicht vertrauenswürdig behandelt. Jeder Zugriff nach außen darf nur über das Egress-Gateway erfolgen, und echte Zugangsdaten werden ausschließlich am Gateway injiziert.

| Komponente | Aufgabe | Vertrauensannahme | Hauptkapitel |
| --- | --- | --- | --- |
| Identitätsschicht | Unternehmens-IdP, Verzeichnis, SCIM; stellt Identitäten für Benutzer, Agenten und Workloads aus | vertrauenswürdig | V1 |
| Interaktionskanal | Web, Instant Messaging, E-Mail, IDE, API und andere Eingänge; zuständig für die Zuordnung von Identitäten und die Sichtbarkeit der Ausgaben | vertrauenswürdig; über Kanäle eingehende Inhalte sind nicht vertrauenswürdig | V1.2, V7 |
| Harness | Agentenschleife, Kontextverwaltung, Tool-Schicht, Sicherheitskontrollen, Orchestrierung, Erweiterungsschnittstellen | auf der Plattform betrieben: vertrauenswürdig; auf Mitarbeiter-Endgeräten: nicht vertrauenswürdig, gemäß V5.4 | V3, V5, V6 |
| Modell | Erzeugt Text und Tool-Aufrufe | nicht vertrauenswürdig; die Ausgabe ist nur eine Anfrage | V3, V6 |
| Policy-Entscheidungspunkt | Berechnet wirksame Berechtigungen, bestimmt das Risikoniveau und entscheidet über Genehmigungspflicht | vertrauenswürdig | V2, V3 |
| Egress-Gateway | Einheitlicher Ausgang; injiziert Zugangsdaten, prüft Ziele, begrenzt Raten, sperrt | vertrauenswürdig | V4 |
| Nachgelagertes System | SaaS, interne API, MCP-Server, Datenbank, auf die zugegriffen wird | trifft eigene Autorisierungsentscheidungen; Rückgaben sind nicht vertrauenswürdig | V4 |
| Datenschicht | Wissensdatenbank, RAG, Gedächtnis, Arbeitsergebnisse | vertrauenswürdig; gespeicherte Inhalte können verunreinigt sein und sind als nicht vertrauenswürdige Inhalte zu behandeln | V8 |
| Ausführungsumgebung | Ausführung von Code, Befehlen, Dateien und Browseroperationen | nicht vertrauenswürdig; kann kompromittiert sein | V5 |
| Verwaltungsebene | Agentenregistrierung, Konnektoren, verwaltete Richtlinien, Lebenszyklus | vertrauenswürdig | V9 |
| Audit | Aufzeichnung, Einsicht, Export und Aufbewahrung sowie Erkennung und Reaktion | vertrauenswürdig | V10 |

Die Komponenten in der Tabelle sind in der Reihenfolge der Abbildung angeordnet. Die Identitätsschicht stellt den übrigen Komponenten die Identitäten bereit und steht daher an erster Stelle; danach folgen die Komponenten in der Reihenfolge, in der eine Anfrage sie durchläuft, bis zum nachgelagerten System; anschließend Datenschicht und Ausführungsumgebung, die der Harness aufruft; zuletzt die Verwaltungsebene und das Audit, die den gesamten Ablauf begleiten.

### 4.3 Prüfpunkte eines Tool-Aufrufs

| Schritt | Prüfpunkt | Was geschieht | Zuständige Komponente | Zugehörige Anforderungen |
| --- | --- | --- | --- | --- |
| 1 | Eingangsauthentifizierung | Das Kanalkonto wird einer Unternehmensidentität zugeordnet | Interaktionskanal, Identitätsschicht | V1.1, V1.2 |
| 2 | Sitzungsaufbau | Workload-Identität wird ausgestellt; Benutzer und Agent werden festgelegt | Harness, Identitätsschicht | V1.4 |
| 3 | Kontextaufbau | Tool-Liste, Gedächtnis und Abrufergebnisse werden nach den wirksamen Berechtigungen gefiltert | Harness, Datenschicht | V3.3, V8.1, V8.3 |
| 4 | Vorabprüfung | Richtlinienprüfung und Risikoklassifizierung vor der Ausführung | Harness, Policy-Entscheidungspunkt | V2.2, V3.1, V3.2 |
| 5 | Manuelle Prüfung | Genehmigung auf Basis der echten Parameter; bei Bedarf Step-up-Authentifizierung | Harness, Identitätsschicht | V3.4, V3.5 |
| 6 | Durchsetzung am Egress | Injektion von Zugangsdaten, Zielprüfung und Ratenbegrenzung über das Gateway | Egress-Gateway | V4.1, V4.2, V3.8 |
| 7 | Autorisierungsentscheidung des Zielsystems | Das nachgelagerte System entscheidet anhand der Benutzeridentität, die beim Zugriff im Auftrag des Benutzers übermittelt wurde | nachgelagertes System | V2.1, V4.3, V4.4 |
| 8 | Verarbeitung der Rückgabe | Rückgabe wird als nicht vertrauenswürdig behandelt; die Herkunft wird gekennzeichnet | Harness | V6.1, V6.2 |
| 9 | Ausgabeprüfung | Prüfung von Empfänger, sensiblen Daten und Darstellungsrisiken | Interaktionskanal, Egress-Gateway | V7.1, V7.4, V7.5 |
| 10 | Lückenlose Protokollierung | Jeder Schritt wird im Audit erfasst und lässt sich auf Personen, Agenten und Eingabequellen zurückführen | Audit | V10.1 |

## 5. Bedrohungsmodell

Diese Baseline geht davon aus, dass die Ausgabe des Modells nicht vertrauenswürdig ist, dass der Agent verleitet oder kompromittiert werden kann und dass der Unternehmens-IdP und das Egress-Gateway vertrauenswürdig sind. Alle Anforderungen dienen dem Zweck, unter diesen Annahmen 16 Bedrohungsklassen abzuwehren.

### 5.1 Voraussetzungen

- A1: Der Unternehmens-IdP, das Verzeichnis und die von ihnen ausgestellten Identitätsnachweise sind vertrauenswürdig.
- A2: Policy-Entscheidungspunkt, Egress-Gateway und Auditspeicher sind vertrauenswürdig; ihr eigener Betrieb unterliegt V9 und V10.
- A3: Die Ausgabe des Modells ist nicht vertrauenswürdig. Identität, Risikobewertung, Zusammenfassung und Tool-Parameter, die das Modell liefert, sind nur zu prüfende Anfragen.
- A4: Nicht vertrauenswürdige Inhalte, die in den Kontext gelangen, können schädliche Anweisungen enthalten.
- A5: Nachgelagerte Systeme treffen Autorisierungsentscheidungen korrekt anhand der empfangenen Identität; Systeme, die dazu nicht in der Lage sind, werden gemäß V4.4 behandelt.
- A6: Mitarbeiter-Endgeräte sind nicht unbedingt kontrolliert; ein auf dem Endgerät laufender Agent wird gemäß V5.4 behandelt.

### 5.2 Bedrohungsakteure

| Nr. | Akteur | Fähigkeit | Typisches Ziel |
| --- | --- | --- | --- |
| TA1 | Externer Angreifer | Kann Inhalte in Webseiten, E-Mails, Dokumenten, Tickets und Tool-Rückgaben platzieren, hat aber keinen direkten Zugang zur Plattform | Mithilfe der Berechtigungen des Agenten Daten nach außen schleusen oder Operationen ausführen |
| TA2 | Nicht berechtigter interner Benutzer | Besitzt ein legitimes Konto mit begrenzten Berechtigungen | Mithilfe des Agenten, geteilter Sitzungen, Gruppenchats oder des Gedächtnisses Daten erlangen, die über die eigenen Berechtigungen hinausgehen |
| TA3 | Außer Kontrolle geratener oder kompromittierter Agent | Ziel wurde durch Injektion umgeschrieben, oder die Ausführungsumgebung wurde kompromittiert | Identität vortäuschen, Berechtigungen erweitern, Persistenz schaffen, andere Agenten seitlich aufrufen |
| TA4 | Bösartige Lieferkettenkomponente | Gelangt als Drittanbieter-Skill, Plugin, MCP-Server oder Projektkonfiguration (etwa MCP-Definitionen und Hooks im Code-Repository) auf die Plattform | Ausführungsrechte erlangen, Zugangsdaten stehlen, langfristige Anweisungen einschleusen |
| TA5 | Interne Mitarbeiter der Plattform und des Anbieters | Administratoren, Betriebspersonal und Supportpersonal des Anbieters | Zugang zum Zugangsdatenspeicher, zu Konversationen und zum Audit; Zugriff auf Kundendaten über den Betriebskanal |
| TA6 | Kanal-Imitator | Externer Besucher oder Inhaber eines gestohlenen Instant-Messaging- oder E-Mail-Kontos | Agent unter der Identität eines Mitarbeiters aufrufen |

### 5.3 Bedrohungsliste

| Nr. | Bedrohung | Hauptakteure | Zugehörige Kapitel | OWASP |
| --- | --- | --- | --- | --- |
| T1 | Verwechselter Stellvertreter: Der Agent verwendet die privilegierten Zugangsdaten der Plattform, um für einen Benutzer mit niedrigeren Rechten zu handeln | TA1, TA2 | V2, V4 | ASI03, LLM06 |
| T2 | Identitätsvortäuschung: Fälschung der Identität eines Benutzers, Agenten oder Workloads, um Gateway und nachgelagerte Systeme aufzurufen | TA3, TA6 | V1, V4 | ASI03 |
| T3 | Delegationsverstärkung: Berechtigungen werden bei mehrstufiger Delegation, in Sub-Agenten oder Offline-Aufgaben erweitert oder verlieren ihre Gültigkeit | TA3 | V2 | ASI03, ASI07 |
| T4 | Zielumleitung: Nicht vertrauenswürdige Inhalte schreiben das Ziel des Agenten um, sodass er eine Operation ausführt, die der Benutzer zwar darf, aber nicht beabsichtigt hat | TA1 | V3, V6 | ASI01, LLM01 |
| T5 | Abfluss von Zugangsdaten: Token gelangen in den Kontext oder in die Sandbox und werden abgeflossen oder an eine Adresse des Angreifers gesendet | TA1, TA3 | V4, V5 | ASI03, LLM02 |
| T6 | Umgehung des Ausgangs: Das Gateway wird umgangen, und es wird direkt auf das interne Netz, Datenbanken oder das Internet zugegriffen | TA3, TA4 | V4, V5 | ASI02 |
| T7 | Ausbruch aus der Ausführung: Code, Befehle, Browser- oder Endgeräteoperationen überschreiten die vorgesehenen Grenzen | TA3, TA4 | V5 | ASI05 |
| T8 | Ausgabeleck: Ergebnisse werden Personen ohne Berechtigung sichtbar oder fließen durch Darstellung oder Ausleitung ab | TA1, TA2 | V7 | LLM02, LLM05 |
| T9 | Daten- und Gedächtnisverunreinigung: sitzungsübergreifender Abruf, Vergiftung des Gedächtnisses, Arbeitsergebnisse verlieren ihre Datenstufe | TA1, TA2 | V8 | ASI06, LLM04, LLM08 |
| T10 | Persistenz und Kontrollverlust: Der Agent legt eigene Automatisierungen mit Hintertür an oder läuft nach der Deaktivierung weiter | TA3 | V3, V10 | ASI10 |
| T11 | Genehmigungstäuschung und -ermüdung: Der Genehmigungsinhalt wird manipuliert, oder zu viele Genehmigungsanfragen führen zu unachtsamer Zustimmung | TA1, TA3 | V3 | ASI09 |
| T12 | Vergiftung der Lieferkette: Skills, Plugins, MCP und Projektkonfigurationen bringen schädliches Verhalten ein | TA4 | V5, V9 | ASI04, LLM03 |
| T13 | Kaskadenausfall: Fehler oder schädliche Ausgaben eines Agenten werden entlang der Kette verstärkt | TA3 | V6 | ASI08 |
| T14 | Missbrauch von Privilegien: Plattformadministratoren oder der Anbieter lesen Zugangsdaten, Konversationen oder Kundendaten | TA5 | V9, V10 | keine direkte Entsprechung |
| T15 | Ressourcenmissbrauch: Massenexport, Schleifenaufrufe, Ausschöpfung der Kosten | TA2, TA3 | V3 | LLM10 |
| T16 | Fehlende Rückverfolgbarkeit: Nach einem Vorfall lässt sich nicht rekonstruieren, wer welchen Agenten auf welcher Grundlage was tun ließ | alle | V10 | keine direkte Entsprechung |

## 6. Stufen und Anwendung

Die Anforderungen sind zunächst nach dem Ablauf eines Agentenvorgangs und danach nach den sitzungsübergreifenden Objekten gegliedert. Sie sind in drei Stufen L1 bis L3 eingeteilt; höhere Stufen enthalten alle Anforderungen der niedrigeren Stufen.

### 6.1 Hauptachse

Die Kapitel 7 bis 16 entsprechen V1 bis V10. Die ersten sieben Kapitel folgen dem Ablauf eines Vorgangs. Die letzten drei Kapitel sind nach den Objekten gegliedert, die über Sitzungen hinweg bestehen, nämlich Daten, Agenten und Audit, und gelten über den gesamten Lebenszyklus. Jede Anforderung gehört nur zu einem Kapitel: Anforderungen zu einem einzelnen Vorgang werden nach dem Schritt eingeordnet, in dem sie wirksam werden; Anforderungen zu diesen drei Objektarten selbst gehören zu den letzten drei Kapiteln.

| Phase | Kapitel | Beantwortete Frage |
| --- | --- | --- |
| Vor dem Vorgang | V1 Identität und Authentifizierung | Wer initiiert, welcher Agent führt aus |
| Vor dem Vorgang | V2 Delegation und wirksame Berechtigungen | Im Auftrag von wem, wie hoch ist die Obergrenze der Berechtigungen |
| Vor dem Vorgang | V3 Autorisierungsentscheidung | Darf dieser Vorgang ausgeführt werden, ist eine Bestätigung durch einen Menschen nötig |
| Während des Vorgangs | V4 Zugangsdaten und Durchsetzung am Egress | Wie verlässt die Anfrage das System, wie werden Zugangsdaten injiziert |
| Während des Vorgangs | V5 Isolierung der Ausführung | In welchen Grenzen laufen Code, Befehle, Browser und Erweiterungen |
| Während des Vorgangs | V6 Kontext und nicht vertrauenswürdige Eingaben | Dürfen eingelesene Inhalte die Entscheidung beeinflussen |
| Nach dem Vorgang | V7 Ausgabe und Sichtbarkeit | Wer sieht das Ergebnis, kann es abfließen |
| Gesamter Lebenszyklus | V8 Daten, Gedächtnis und Arbeitsergebnisse | Wie werden Daten abgerufen, gespeichert und aufbewahrt |
| Gesamter Lebenszyklus | V9 Lebenszyklus und Governance | Wer verwaltet den Agenten, von der Registrierung bis zur Außerbetriebnahme |
| Gesamter Lebenszyklus | V10 Audit, Erkennung und Reaktion | Wie wird protokolliert, erkannt und eingedämmt |

### 6.2 Stufen

| Stufe | Einordnung | Geeignete Plattformen |
| --- | --- | --- |
| L1 | Basisstufe. Fehlt die Anforderung, entstehen unmittelbar Überschreitungen von Berechtigungen, Offenlegung von Zugangsdaten oder fehlende Zurechenbarkeit | jede Agentenplattform, die im Unternehmen eingesetzt wird |
| L2 | Standard. Fähigkeiten, die in gängigen Sicherheitsreviews von Unternehmen verlangt werden | Plattformen, die interne Daten verarbeiten und mehrere Geschäftssysteme anbinden |
| L3 | Erweitert. Mehrschichtige Verteidigung und feingranulare Governance | Hochregulierte Branchen wie Finanzen, Gesundheitswesen, kritische Infrastruktur, oder Plattformen mit hoch sensiblen Daten |

Entscheidungsregel: Eine Anforderung wird L1 zugeordnet, wenn eine der folgenden Bedingungen zutrifft. Erstens: Fehlt sie, können externe Angreifer, nicht berechtigte interne Benutzer oder Akteure, die Kanalidentitäten missbräuchlich verwenden (TA1, TA2, TA6) ohne weitere Voraussetzungen Berechtigungen überschreiten oder Zugangsdaten erlangen. Zweitens: Fehlt sie, können außer Kontrolle geratene Agenten, bösartige Lieferkettenkomponenten oder interne Mitarbeiter der Plattform (TA3, TA4, TA5) unmittelbar Zugangsdaten im Klartext erlangen oder auf Daten anderer Benutzer oder Mandanten zugreifen. Drittens: Fehlt sie, lassen sich der auslösende Benutzer, der ausführende Agent, die Delegationskette oder der Genehmiger eines Vorgangs nicht bestimmen. Anforderungen, die nur zusammen mit anderen Bedingungen ausgenutzt werden können oder vor allem den Schadensumfang begrenzen, werden L2 zugeordnet. Anforderungen für bestimmte Hochrisikoszenarien oder mit erheblichem Aufwand werden L3 zugeordnet. L1-Anforderungen setzen die Umsetzung von L2- oder L3-Anforderungen nicht voraus.

Diese Version umfasst 240 Anforderungen in 62 Abschnitten: L1 90 Anforderungen; L2 kommt mit 137 weiteren hinzu, L3 mit 13 weiteren. L1 enthält nur Kontrollen, deren Fehlen unmittelbar ausgenutzt werden kann oder eine fehlende Zurechenbarkeit verursacht. Umsetzungsdetails, die sich mit anderen L1-Anforderungen überschneiden, sowie Alarmierung, Verteidigung in der Tiefe und Verwaltungsprozesse sind L2 zugeordnet.

### 6.3 Anwendbarkeit

Einige Abschnitte gelten nur, wenn die Plattform eine bestimmte Fähigkeit besitzt. Der Abschnittsbeginn nennt dies, etwa „Dieser Abschnitt gilt für Plattformen, die Offline-Delegationsaufgaben unterstützen“. Besitzt die Plattform diese Fähigkeit nicht, wird der gesamte Abschnitt als „nicht anwendbar“ markiert und nicht in die Erfüllungsquote einbezogen.

### 6.4 Normative Formulierungen und Nummerierung

- Anforderungen werden durchgängig normativ mit „muss“ bzw. „ist zu …“ formuliert, Verbote und Beschränkungen mit „darf nicht“ bzw. „darf nur“; ob sie zwingend zu erfüllen sind, entscheiden Stufe und Anwendbarkeit. „Sollte“ in erläuternden Texten begründet keine Anforderung.
- Die Nummerierung folgt dem Format „V Kapitel.Abschnitt.Anforderung“, etwa V4.1.3. Nach dem Entfernen einer Anforderung wird ihre Nummer nicht wiederverwendet; neue Anforderungen werden am Ende des Abschnitts angefügt.
- Jede Anforderung beschreibt ein überprüfbares Ergebnis. Enthält eine Anforderung mehrere Teilsätze, gilt sie nur dann als erfüllt, wenn alle Teile erfüllt sind.
- Anforderungen mit der Formulierung „muss … können“ oder „muss … unterstützen“ gelten als erfüllt, wenn die Plattform diese Fähigkeit besitzt und das Unternehmen sie aktivieren kann. Alle übrigen Anforderungen gelten als erfüllt, wenn sie in der bewerteten Bereitstellung aktiviert und wirksam sind. Die Lieferantenbewertung prüft nur die erstgenannte Art; das Sicherheitsreview prüft beide.
- Richten sich Anforderungen an Systeme außerhalb der Plattform (etwa nachgelagerte Systeme, interne Dienste oder Mitarbeiter-Endgeräte), setzt sie das nutzende Unternehmen um; die verantwortliche Stelle wird bei der Bewertung gesondert erfasst.
- Zeitvorgaben, Perioden und Schwellenwerte ohne Zahlenangabe in der Anforderung (etwa „kurze Gültigkeit“, „regelmäßig“, „vereinbarte Dauer“) gelten als erfüllt, wenn das Unternehmen oder die Plattform einen konkreten Wert schriftlich festgelegt und in der Konfiguration wirksam gemacht hat. Die folgende Tabelle enthält empfohlene Standardwerte; das Unternehmen kann sie je nach Risiko anpassen.

| Gegenstand | Zugehörige Anforderungen | Empfohlener Standardwert |
| --- | --- | --- |
| Gültigkeitsdauer des Zugriffstokens für nachgelagerte Systeme | V1.3.4, V4.6.1 | höchstens 1 Stunde |
| Frist, innerhalb der Aufrufe nach Sperrung oder Herabstufung eines Benutzers abgelehnt werden | V10.4.1 | höchstens 5 Minuten |
| Prüfzyklus für Verbindungen und Berechtigungen des Agenten | V9.4.2 | einmal pro Quartal |
| Zeitraum, nach dem ein Agent als dauerhaft ungenutzt gilt | V9.4.3 | 90 Tage ohne Aufruf in Folge |

## 7. V1 Identität und Authentifizierung

Bei jeder Anfrage müssen zwei Identitäten bestimmt werden: die der initiierenden Person und die des ausführenden Agenten. Beide leitet die Plattform aus vertrauenswürdigen Quellen ab; Selbstauskünfte in der Anfrage oder vom Modell werden nicht akzeptiert.

### V1.1 Benutzerauthentifizierung

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V1.1.1 | Die Plattform und alle ihre Kanäle dürfen nur eine Anmeldung über den Unternehmens-IdP (OIDC oder SAML) zulassen; eigene lokale Konten dürfen nicht bereitgestellt werden, ausgenommen die in V10.5 geregelten Notfallzugangskonten | ✓ | ✓ | ✓ |
| V1.1.2 | Benutzer und Gruppen müssen über SCIM oder einen gleichwertigen Mechanismus synchronisiert werden; im IdP gesperrte Benutzer werden auf der Plattform synchron gesperrt |  | ✓ | ✓ |
| V1.1.3 | Der vom IdP ausgestellte Authentifizierungszeitpunkt und die Authentifizierungsstärke müssen in der Benutzersitzung erhalten bleiben, damit die Step-up-Entscheidung nach V3.5 sie verwenden kann |  | ✓ | ✓ |
| V1.1.4 | Zugangsdaten, mit denen per API auf einen Agenten zugegriffen wird (etwa API-Schlüssel oder persönliche Zugriffstoken), müssen an einen bestimmten Benutzer oder eine nicht menschliche Identität im Unternehmens-IdP gebunden sein, ein Ablaufdatum und einen Berechtigungsumfang haben und bei Sperrung der Identität synchron ungültig werden | ✓ | ✓ | ✓ |

### V1.2 Zuordnung der Identität über Kanäle

Dieser Abschnitt gilt für Plattformen, die Instant Messaging, E-Mail, Browser-Erweiterungen und andere Drittkanäle unterstützen.

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V1.2.1 | Ein Kanalkonto muss sich zunächst über eine einmalige SSO-Anmeldung mit einer Unternehmensidentität verknüpfen, bevor es Agenten aufrufen darf | ✓ | ✓ | ✓ |
| V1.2.2 | Das Ergebnis der SSO-Verknüpfung muss die einzige Grundlage für die Identität eines Kanalkontos sein; eine Zuordnung über Spitznamen, Anzeigenamen oder E-Mail-Zeichenketten ist unzulässig; für den E-Mail-Kanal gilt V1.2.6 | ✓ | ✓ | ✓ |
| V1.2.3 | Wird ein Benutzer im IdP gesperrt, müssen alle seine Kanalverknüpfungen synchron ungültig werden |  | ✓ | ✓ |
| V1.2.4 | Konten externer Besucher und Konten in organisationsübergreifenden gemeinsamen Kanälen müssen erkannt und gesondert auf die zulässigen Agenten und Fähigkeiten beschränkt werden |  | ✓ | ✓ |
| V1.2.5 | Wird im Kanal eine Hochrisiko-Operation ausgelöst, muss der Benutzer eine Step-up-Authentifizierung über den Unternehmens-IdP durchführen |  | ✓ | ✓ |
| V1.2.6 | Der E-Mail-Kanal darf nur E-Mails annehmen, die die DMARC-Prüfung bestehen (SPF oder DKIM bestanden und auf die Absenderdomäne ausgerichtet (Alignment)); Absender aus externen Domänen dürfen keine Operation im Auftrag eines Benutzers auslösen können | ✓ | ✓ | ✓ |

### V1.3 Agent-Identität

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V1.3.1 | Jeder Agent muss eine eindeutige, von der Plattform ausgestellte Kennung besitzen; Selbstauskünfte des Agenten zur Identität dürfen nicht akzeptiert werden | ✓ | ✓ | ✓ |
| V1.3.2 | Für autonome Agenten muss im Unternehmensverzeichnis eine eigene nicht menschliche Identität angelegt werden; es dürfen keine persönlichen Konten von Mitarbeitern verwendet werden | ✓ | ✓ | ✓ |
| V1.3.3 | Greift ein autonomer Agent auf nachgelagerte Systeme zu, muss er die nach V1.3.2 angelegte Identität verwenden; im Protokoll des nachgelagerten Systems ist dann der Agent als Subjekt verzeichnet |  | ✓ | ✓ |
| V1.3.4 | Greift ein autonomer Agent auf nachgelagerte Systeme zu, muss er kurzlebige Token verwenden und darf keine langlebigen statischen Schlüssel nutzen |  | ✓ | ✓ |
| V1.3.5 | Für Schlüssel und Zertifikate autonomer Agenten müssen Prozesse für Ausstellung, Rotation und Widerruf bestehen; für die Rotationsperiode ist eine Obergrenze festzulegen |  | ✓ | ✓ |

### V1.4 Workload-Identität

Dieser Abschnitt gilt für Plattformen, die jeder Sitzung eine eigene Ausführungsinstanz zuweisen (etwa Container, Sandbox oder virtuelle Maschine).

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V1.4.1 | Die Plattform muss für die Ausführungsinstanz jeder Sitzung eine kurzlebige Workload-Identität ausstellen und an diese Instanz binden | ✓ | ✓ | ✓ |
| V1.4.2 | Die Zugangsdaten der Workload-Identität müssen dem Modell verborgen bleiben und dürfen weder in den Kontext noch in Tool-Rückgaben gelangen | ✓ | ✓ | ✓ |
| V1.4.3 | Das Egress-Gateway darf Benutzer und Agent ausschließlich anhand der Workload-Identität bestimmen und selbst angegebene Benutzer- oder Agentenkennungen in der Anfrage ignorieren | ✓ | ✓ | ✓ |
| V1.4.4 | Mit Ende der Sitzung oder Zerstörung der Ausführungsinstanz muss die zugehörige Workload-Identität sofort widerrufen werden |  | ✓ | ✓ |
| V1.4.5 | Vor der Ausstellung einer Workload-Identität muss die Plattform die Ausführungsinstanz einer Workload-Attestierung unterziehen (etwa Node- und Workload-Attestation in SPIFFE/SPIRE); schlägt die Attestierung fehl, wird nichts ausgestellt |  |  | ✓ |

### V1.5 Externe Prinzipale

Dieser Abschnitt gilt für Plattformen, die Kunden oder Partnern Zugang zu Agentenfunktionen bieten.

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V1.5.1 | Externe Prinzipale müssen über eine Identitätsföderation angebunden werden; für sie dürfen keine gemeinsamen Konten angelegt werden |  | ✓ | ✓ |
| V1.5.2 | Externe Prinzipale dürfen nur auf die Arbeitsbereiche und Schnittstellen zugreifen, die für sie freigegeben sind | ✓ | ✓ | ✓ |
| V1.5.3 | Aufrufe externer Prinzipale müssen gesondert im Audit protokolliert und nach externer Organisation filterbar sein |  | ✓ | ✓ |

## 8. V2 Delegation und wirksame Berechtigungen

Die Obergrenze der Berechtigungen eines Agenten ergibt sich aus den Berechtigungen der Person, die er vertritt, und nicht aus Zugangsdaten, die die Plattform selbst besitzt. Wirksame Berechtigungen werden nach 3.14 als Schnittmenge gebildet und können entlang der Delegationskette nur eingeengt werden.

### V2.1 Zugriff im Auftrag des Benutzers

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V2.1.1 | Ist der Benutzer anwesend, muss der Agent bei Zugriffen auf nachgelagerte Systeme die Identität der auslösenden Person übermitteln, sodass das nachgelagerte System anhand dieses Benutzers entscheidet; unterstützt ein nachgelagertes System keine benutzerbezogene Autorisierung, gilt V4.4 | ✓ | ✓ | ✓ |
| V2.1.2 | Gemeinsam genutzte Zugangsdaten mit höheren Rechten als der auslösende Benutzer dürfen nicht verwendet werden, um für den Benutzer auf nachgelagerte Systeme zuzugreifen; für nachgelagerte Systeme, die nur gemeinsame statische Zugangsdaten unterstützen, gelten die kompensierenden Maßnahmen nach V4.4 | ✓ | ✓ | ✓ |
| V2.1.3 | Das nachgelagerte Token muss sowohl die auslösende Person als auch den ausführenden Agenten kennzeichnen (etwa über den act-Claim nach RFC 8693) |  | ✓ | ✓ |

### V2.2 Wirksame Berechtigungen

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V2.2.1 | Die wirksamen Berechtigungen jedes Aufrufs müssen als Schnittmenge aus den Berechtigungen des Benutzers und dem Autorisierungsumfang des Agenten gebildet werden | ✓ | ✓ | ✓ |
| V2.2.2 | Die wirksamen Berechtigungen müssen vom Policy-Entscheidungspunkt berechnet werden und dürfen nicht von Systemprompt oder Modellurteil abhängen | ✓ | ✓ | ✓ |
| V2.2.3 | Zu Beginn einer Aufgabe müssen die benötigten Tools und Datenbereiche deklariert werden; während der Ausführung werden nur Berechtigungen im deklarierten Umfang erteilt. Die Deklaration erfolgt durch den Benutzer oder durch die Konfiguration des Agenten; schlägt das Modell einen Umfang vor, wird er erst nach Bestätigung durch den Benutzer wirksam |  | ✓ | ✓ |
| V2.2.4 | Aufrufe außerhalb des deklarierten Aufgabenumfangs müssen abgelehnt oder in eine Genehmigung überführt werden |  | ✓ | ✓ |
| V2.2.5 | Die wirksamen Berechtigungen müssen bei jedem Tool-Aufruf neu berechnet werden; das Ergebnis der Autorisierung vom Sitzungsbeginn wird nicht übernommen |  | ✓ | ✓ |
| V2.2.6 | Die Autorisierung von Hochrisiko-Operationen muss auf konkrete Ressourcen und Parameter zugeschnitten sein (etwa mit RAR nach RFC 9396 beschrieben); eine bloße grobe Rollenvergabe genügt nicht |  |  | ✓ |

### V2.3 Offline-Delegationsaufgaben

Dieser Abschnitt gilt für Plattformen, die geplante Aufgaben oder langlaufende Aufgaben unterstützen.

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V2.3.1 | Offline-Delegationsaufgaben müssen den anlegenden Benutzer als Wurzel haben; die Obergrenze der Berechtigungen wird bei der Anlage festgelegt und kann danach nur eingeengt werden | ✓ | ✓ | ✓ |
| V2.3.2 | Vor jeder Ausführung müssen Kontostatus und aktuelle Berechtigungen des anlegenden Benutzers erneut geprüft werden | ✓ | ✓ | ✓ |
| V2.3.3 | Der Scheduler darf nur die Aufgabenkennung speichern und keine Zugangsdaten des Benutzers oder unmittelbar verwendbare Token | ✓ | ✓ | ✓ |
| V2.3.4 | Wird der anlegende Benutzer gesperrt, müssen seine Offline-Delegationsaufgaben automatisch angehalten und die verantwortliche Person des Agenten benachrichtigt werden |  | ✓ | ✓ |
| V2.3.5 | Aufgaben, die nach dem Ausscheiden oder Wechsel des anlegenden Benutzers weiterlaufen müssen, sind vor der Sperrung seines Kontos in autonome Agenten umzuwandeln und die Autorisierung ist neu zu genehmigen |  | ✓ | ✓ |
| V2.3.6 | Die Autorisierung einer Offline-Delegationsaufgabe muss ein Ablaufdatum haben; nach Ablauf muss der anlegende Benutzer sie erneut bestätigen |  | ✓ | ✓ |

### V2.4 Delegation zwischen Agenten

Dieser Abschnitt gilt für Plattformen, die Zusammenarbeit mehrerer Agenten oder Sub-Agenten unterstützen.

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V2.4.1 | Die wirksamen Berechtigungen eines nachgelagerten Agenten dürfen nicht über die Berechtigungen des auslösenden Benutzers und den Delegationsumfang der vorgelagerten Stufe hinausgehen; der auslösende Benutzer darf über einen nachgelagerten Agenten keine Berechtigungen erlangen, die er selbst nicht besitzt | ✓ | ✓ | ✓ |
| V2.4.2 | Von einem Harness abgeleitete Sub-Agenten dürfen nur eine Teilmenge der Tools und Berechtigungen ihres übergeordneten Agenten besitzen |  | ✓ | ✓ |
| V2.4.3 | Die Delegationskette muss von der Plattform aufgebaut und protokolliert werden; Identitätsangaben, die nicht von der Plattform oder einem vertrauenswürdigen Autorisierungsserver signiert sind, dürfen nicht akzeptiert werden | ✓ | ✓ | ✓ |
| V2.4.4 | Es muss ausdrücklich konfiguriert sein, welche Agenten welche anderen Agenten aufrufen dürfen; nicht konfigurierte Aufrufe sind abzulehnen |  | ✓ | ✓ |
| V2.4.5 | Die Tiefe der Delegationskette muss begrenzt sein, und zyklische Aufrufe müssen erkannt und unterbunden werden |  | ✓ | ✓ |
| V2.4.6 | Bei mehrstufiger Delegation muss das nachgelagerte Token die vollständige Kette der Ausführenden enthalten (etwa verschachtelte act-Claims nach RFC 8693), damit das nachgelagerte System darauf basierend autorisieren kann |  | ✓ | ✓ |
| V2.4.7 | Bei Aufrufen zwischen Diensten innerhalb derselben Vertrauensdomäne muss ein Token, das Benutzer-, Agenten- und Aufgabenkontext trägt, entlang der Aufrufkette weitergegeben werden (etwa nach dem Entwurf Transaction Tokens); das nachgelagerte System autorisiert darauf basierend |  |  | ✓ |

### V2.5 Delegation zwischen Benutzern und zeitlich begrenzte Rechteerweiterung

Dieser Abschnitt gilt für Plattformen, die es Benutzern erlauben, ihren Agenten für andere zu verwenden, oder Agenten zeitweise erhöhte Rechte gewähren.

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V2.5.1 | Erlaubt ein Benutzer anderen, seinen Agenten in seinem Auftrag zu verwenden (etwa eine Assistenz für eine Führungskraft), muss die Delegationsbeziehung ausdrücklich registriert und in Umfang und Dauer begrenzt werden |  | ✓ | ✓ |
| V2.5.2 | Bei Operationen im Auftrag eines anderen muss das Audit sowohl die delegierende Person als auch die tatsächlich handelnde Person protokollieren |  | ✓ | ✓ |
| V2.5.3 | Benötigt ein Agent Berechtigungen über seinen Autorisierungsumfang hinaus, müssen diese auf Antrag und Genehmigung zeitlich begrenzt erteilt werden und nach Ablauf automatisch entzogen werden |  |  | ✓ |

### V2.6 Durch Ereignisse ausgelöste Autorisierung

Dieser Abschnitt gilt für Plattformen, in denen Webhooks, Alarme, Tickets und andere Ereignisse Agenten auslösen.

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V2.6.1 | Eingehende Ereignisse müssen auf Signatur und Herkunft geprüft werden; nicht bestandene Ereignisse sind abzulehnen | ✓ | ✓ | ✓ |
| V2.6.2 | Jede Auslöseregel muss an eine Ausführungsidentität gebunden sein, also an die Identität eines autonomen Agenten oder an die Identität der Person, die die Regel konfiguriert hat | ✓ | ✓ | ✓ |
| V2.6.3 | Anlage und Änderung von Auslöseregeln müssen im Audit protokolliert werden und den konfigurierenden Benutzer ausweisen |  | ✓ | ✓ |

## 9. V3 Autorisierungsentscheidung

Jeder Tool-Aufruf durchläuft vor der Ausführung die Richtlinienprüfung der Plattform. Ob eine Operation erlaubt ist und ob eine Bestätigung durch einen Menschen nötig ist, bestimmt die Plattform anhand von Tool und Parametern; Aussagen des Modells sind dafür nicht maßgeblich.

### V3.1 Risikoklassifizierung von Operationen

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V3.1.1 | Jedes Tool muss mit einer Operationskategorie (mindestens Lesen, Schreiben, Löschen, Ausleitung, Geldoperation und Produktionsänderung) und einer Risikostufe gekennzeichnet sein | ✓ | ✓ | ✓ |
| V3.1.2 | Die Risikostufe muss von der Plattform anhand von Tool und Parametern bestimmt werden; eine Risikobewertung des Modells darf nicht übernommen werden | ✓ | ✓ | ✓ |
| V3.1.3 | Jeder Risikostufe muss eine feste Behandlung zugeordnet sein, etwa automatische Ausführung, nachträgliche Benachrichtigung, vorherige Genehmigung, Step-up-Authentifizierung oder Ablehnung | ✓ | ✓ | ✓ |
| V3.1.4 | Dasselbe Tool muss bei unterschiedlich großem Wirkungsbereich der Parameter in unterschiedliche Stufen fallen können (etwa Löschen eines Eintrags im Vergleich zum Massenlöschen) |  | ✓ | ✓ |

### V3.2 Vorabprüfung von Tool-Aufrufen

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V3.2.1 | Vor der Ausführung jedes Tool-Aufrufs muss eine Richtlinienprüfung stattfinden, die in Komponenten durchgeführt wird, die der Agent nicht verändern kann (von der Plattform betriebener Harness, Policy-Entscheidungspunkt oder Egress-Gateway); die Autorisierungsentscheidung darf nicht auf der Ausgabe des Modells beruhen, dessen Aufrufe geprüft werden | ✓ | ✓ | ✓ |
| V3.2.2 | Sicherheitsvorgaben müssen vom Policy-Durchsetzungspunkt (Harness oder Egress-Gateway) gemäß der Entscheidung des Policy-Entscheidungspunkts erzwungen werden und dürfen nicht nur im Systemprompt stehen |  | ✓ | ✓ |
| V3.2.3 | Richtlinien und Hooks der Vorabprüfung müssen von der Plattform ausgerollt werden; der Agent selbst darf sie nicht ändern oder umgehen können |  | ✓ | ✓ |
| V3.2.4 | Bei einem Fehler oder einer Zeitüberschreitung der Richtlinienprüfung muss standardmäßig abgelehnt werden | ✓ | ✓ | ✓ |
| V3.2.5 | Der Policy-Entscheidungspunkt muss über eine standardisierte Autorisierungsschnittstelle (etwa OpenID AuthZEN) mit dem Policy-Durchsetzungspunkt kommunizieren, damit die Policy-Engine austauschbar ist |  |  | ✓ |

### V3.3 Tool-Exposition

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V3.3.1 | Die dem Modell übergebene Tool-Liste muss nach den aktuell wirksamen Berechtigungen gefiltert sein; das Modell sieht keine Tools, zu deren Nutzung es nicht berechtigt ist |  | ✓ | ✓ |
| V3.3.2 | Neben der Kürzung der Tool-Liste muss vor der Ausführung weiterhin nach V3.2 geprüft werden |  | ✓ | ✓ |

### V3.4 Manuelle Genehmigung

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V3.4.1 | Hochrisiko-Operationen müssen vor der Ausführung von einer zur Genehmigung der Operation berechtigten Person genehmigt werden; Operationen, die nicht dem Vier-Augen-Prinzip unterliegen, kann der auslösende Benutzer selbst genehmigen | ✓ | ✓ | ✓ |
| V3.4.2 | Der Genehmigungsinhalt muss von der Plattform aus den echten Aufrufparametern erzeugt werden; eine vom Modell verfasste Zusammenfassung darf nicht verwendet werden | ✓ | ✓ | ✓ |
| V3.4.3 | Bei der Ausführung müssen die tatsächlichen Parameter mit denen zum Zeitpunkt der Genehmigung übereinstimmen; bei Abweichung ist abzulehnen. Aufrufe, die nach einem im Voraus genehmigten Ausführungsplan nach V3.4.6 erfolgen, sind auf Einhaltung des Planumfangs zu prüfen | ✓ | ✓ | ✓ |
| V3.4.4 | Genehmigungen müssen eine Gültigkeitsdauer haben; eine nicht innerhalb dieser Frist erteilte Genehmigung gilt als Ablehnung |  | ✓ | ✓ |
| V3.4.5 | Die Häufigkeit der Genehmigungsanfragen muss begrenzt und gleichartige Anfragen müssen zusammengefasst werden, um Genehmigungsermüdung zu verhindern |  | ✓ | ✓ |
| V3.4.6 | Die Plattform muss im Voraus genehmigte Ausführungspläne unterstützen, die Tools, Ressourcenbereich und Obergrenzen festlegen; Operationen innerhalb des Plans werden nicht einzeln genehmigt, Operationen außerhalb des Plans werden abgebrochen und erneut zur Genehmigung vorgelegt |  | ✓ | ✓ |

### V3.5 Step-up-Authentifizierung und kontinuierliche Zugriffsbewertung

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V3.5.1 | Geldoperationen, Produktionsänderungen, Massenlöschungen und ähnliche Operationen müssen eine Step-up-Authentifizierung des Benutzers erfordern (etwa erneute MFA) |  | ✓ | ✓ |
| V3.5.2 | Die Plattform muss Risikosignale der Sitzung vom IdP empfangen (etwa CAEP); steigt das Risiko, muss sie die Stufe der Operationen senken, die der Agent ausführen darf, oder den Agenten anhalten |  |  | ✓ |

### V3.6 Funktionstrennung

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V3.6.1 | Einander ausschließende Aufgaben (etwa Einreichen und Genehmigen, Entwickeln und Freigeben in die Produktion) dürfen nicht demselben Agenten zugewiesen werden |  | ✓ | ✓ |
| V3.6.2 | Bei Operationen, für die eine Funktionstrennung ein Vier-Augen-Prinzip verlangt (etwa Zahlungen, Produktionsänderungen, Rechtevergabe), darf der Genehmiger weder der Antragsteller selbst sein noch ein Agent, der im Auftrag des Antragstellers handelt |  | ✓ | ✓ |

### V3.7 Persistente Operationen

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V3.7.1 | Legt ein Agent geplante Aufgaben, Auslöseregeln, Webhooks, Weiterleitungsregeln und Skills an oder ändert sie, darf dies erst nach Genehmigung durch den Benutzer wirksam werden | ✓ | ✓ | ✓ |
| V3.7.2 | Alle persistenten Objekte, die ein Agent angelegt hat, müssen in der Verwaltungsebene gesammelt aufgelistet werden können und ihre Anlagequelle ausweisen |  | ✓ | ✓ |

### V3.8 Menge, Rate und Kontingente

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V3.8.1 | Raten-, Massen- und Exportobergrenzen müssen nach Benutzer, Agent und Operationstyp festgelegt werden |  | ✓ | ✓ |
| V3.8.2 | Anfragen oberhalb der Obergrenze müssen abgefangen und alarmiert werden |  | ✓ | ✓ |
| V3.8.3 | Für Modellaufrufe muss ein Budget nach Abteilung, Benutzer oder Agent festgelegt werden; bei Überschreitung wird pausiert oder in eine Genehmigung überführt |  | ✓ | ✓ |
| V3.8.4 | Für jeden Agentenlauf müssen eine maximale Anzahl von Tool-Aufrufen, eine maximale Laufzeit und ein maximaler Modellaufwand festgelegt sein; die Plattform erzwingt diese Grenzen, und bei Erreichen wird abgebrochen und der Auslöser oder die verantwortliche Person benachrichtigt |  | ✓ | ✓ |

## 10. V4 Zugangsdaten und Durchsetzung am Egress

Das Egress-Gateway ist der einzige Kanal, über den der Agent auf nachgelagerte Systeme und das Internet zugreift; echte Zugangsdaten werden ausschließlich dort injiziert. Gibt es keinen Pfad, der das Gateway umgeht, und werden Zugangsdaten nur an die dafür freigegebenen Ziele gesendet, ist ihr Schutz gewährleistet.

### V4.1 Verwahrung und Injektion von Zugangsdaten

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V4.1.1 | Die für den Zugriff auf nachgelagerte Systeme nötigen Token und Schlüssel müssen von der Plattform verwahrt werden; in der von der Plattform verwalteten Ausführungsumgebung, im Kontext und im Modell erscheinen nur Platzhalter-Zugangsdaten, ausgenommen die Fälle nach V5.2.2 | ✓ | ✓ | ✓ |
| V4.1.2 | Jede verwahrte Zugangsdatenangabe muss an die zulässigen Zieldomänen und Pfade gebunden sein; das Gateway injiziert echte Zugangsdaten nur, wenn das Ziel übereinstimmt | ✓ | ✓ | ✓ |
| V4.1.3 | Das Gateway darf Zugangsdaten nicht in URLs oder Abfrageparameter injizieren; die Authentifizierung nicht-HTTP-basierter Protokolle muss durch das Gateway oder einen Proxy auf Plattformseite erfolgen, und die Zugangsdaten gelangen nicht in die Ausführungsumgebung |  | ✓ | ✓ |
| V4.1.4 | Eine Ersetzungsanfrage mit nicht passendem Ziel muss abgelehnt und alarmiert werden |  | ✓ | ✓ |
| V4.1.5 | Zugangsdaten, die in der Antwort eines nachgelagerten Systems zurückgespiegelt werden, müssen entfernt werden, bevor die Antwort an die Ausführungsumgebung zurückgegeben wird |  | ✓ | ✓ |
| V4.1.6 | Die Plattform muss einen verwalteten Autorisierungsprozess bereitstellen (etwa OAuth), damit der Benutzer seine persönlichen Zugangsdaten oder API-Schlüssel nicht direkt an den Agenten übergeben muss |  | ✓ | ✓ |
| V4.1.7 | In Konversationen und hochgeladenen Dateien vorkommende Zugangsdaten müssen erkannt werden, und ihr Schreiben in Gedächtnis, Arbeitsergebnisse oder Agentenkonfiguration muss verhindert werden |  | ✓ | ✓ |

### V4.2 Einheitlicher Ausgang

V4.2.2 und V4.2.3 gelten für die von der Plattform betriebene Ausführungsumgebung; auf Mitarbeiter-Endgeräten laufende Agenten werden gemäß V5.4 behandelt.

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V4.2.1 | Alle Zugriffe des Agenten auf Ziele außerhalb der Ausführungsumgebung dürfen nur über das Egress-Gateway erfolgen | ✓ | ✓ | ✓ |
| V4.2.2 | Die Netzwerkverbindung der Ausführungsumgebung muss ausgehend standardmäßig gesperrt sein; freigegeben wird nur das Egress-Gateway | ✓ | ✓ | ✓ |
| V4.2.3 | Interne Dienste und Datenbanken müssen direkte Verbindungen aus dem Netzsegment der Ausführungsumgebung, die das Gateway umgehen, ablehnen | ✓ | ✓ | ✓ |
| V4.2.4 | Die Ausführungsumgebung, die Agentenkonfiguration und die Images müssen regelmäßig auf fest codierte Zugangsdaten gescannt werden |  | ✓ | ✓ |
| V4.2.5 | Die Plattform muss eine Liste der registrierten nachgelagerten Systeme führen (Adresse, zugehöriges System und Datenstufe); das Egress-Gateway unterscheidet anhand dieser Liste zwischen Zugriffen innerhalb des Unternehmens und Ausleitung | ✓ | ✓ | ✓ |

### V4.3 Weitergabe der Identität an nachgelagerte Systeme

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V4.3.1 | Beim Zugriff auf SaaS-Drittanbieter muss eine benutzerbezogene Autorisierung vorliegen (entweder durch eigene OAuth-Autorisierung des Benutzers oder durch Austausch über den Unternehmens-IdP gegen ein benutzerbezogenes Token); anwendungsbezogene Zugangsdaten, die benutzerübergreifend geteilt werden, dürfen nicht verwendet werden | ✓ | ✓ | ✓ |
| V4.3.2 | Widerruft der Benutzer die Autorisierung, muss die Plattform die zugehörigen Zugangsdaten sofort nicht mehr verwenden |  | ✓ | ✓ |
| V4.3.3 | Unterstützt ein nachgelagertes System den Token-Austausch, muss über den Unternehmens-IdP nach RFC 8693 oder nach dem ID-JAG auf Basis von RFC 8693 und RFC 7523 ein kurzlebiges benutzerbezogenes Token eingetauscht werden |  | ✓ | ✓ |

### V4.4 Altsysteme mit statischen Zugangsdaten

Dieser Abschnitt gilt für Plattformen, die nachgelagerte Systeme einsetzen, die nur gemeinsam genutzte statische Zugangsdaten unterstützen.

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V4.4.1 | Gemeinsame Geheimnisse der Altsysteme müssen von der Plattform verwahrt und dürfen nicht in die Ausführungsumgebung ausgeliefert werden | ✓ | ✓ | ✓ |
| V4.4.2 | Das Gateway muss Autorisierungsentscheidungen auf Schnittstellen- und Operationsebene pro Benutzer treffen, um die fehlende benutzerbezogene Autorisierung des nachgelagerten Systems auszugleichen | ✓ | ✓ | ✓ |
| V4.4.3 | Das Gateway muss den nachgelagerten Systemen signierte Benutzeridentitätsangaben beifügen, damit diese sie prüfen und schrittweise umgestellt werden können |  | ✓ | ✓ |
| V4.4.4 | Nachgelagerte Systeme, für die das Gateway benutzerbezogene Autorisierungsentscheidungen stellvertretend trifft, müssen registriert und in die regelmäßige Überprüfung einbezogen werden |  | ✓ | ✓ |

### V4.5 MCP-Aufrufe

Dieser Abschnitt gilt für Plattformen, die MCP unterstützen.

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V4.5.1 | Anfragen an entfernte MCP-Server müssen über das Egress-Gateway geleitet werden und die Identität des Benutzers mitführen |  | ✓ | ✓ |
| V4.5.2 | Von der Plattform selbst entwickelte oder betriebene MCP-Server dürfen keine langlebigen Zugangsdaten besitzen, die alle Benutzer gemeinsam nutzen |  | ✓ | ✓ |
| V4.5.3 | Lokal ausgeführte MCP-Prozesse müssen ebenfalls nur Platzhalter-Zugangsdaten erhalten; ihr ausgehender Netzwerkverkehr unterliegt der Netzwerkrichtlinie der Ausführungsumgebung |  | ✓ | ✓ |
| V4.5.4 | MCP-Server, die die Enterprise-Managed-Authorization-Erweiterung unterstützen, müssen über den Unternehmens-IdP autorisiert angebunden werden |  |  | ✓ |
| V4.5.5 | Von der Plattform selbst entwickelte oder betriebene MCP-Server dürfen nur Token annehmen, die für sie selbst ausgestellt wurden (Aussteller und Audience (aud) werden geprüft, etwa mit dem Resource Indicator nach RFC 8707); empfangene Token dürfen nicht an nachgelagerte APIs weitergereicht werden | ✓ | ✓ | ✓ |
| V4.5.6 | Die Plattform muss einen Snapshot der Tool-Definitionen geprüfter MCP-Server speichern; ändern sich Tool-Namen, Beschreibungen oder Parameterstrukturen, werden sie bis zur erneuten Prüfung dem Modell nicht angeboten |  | ✓ | ✓ |

### V4.6 Lebenszyklus der Token

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V4.6.1 | Vom Gateway injizierte oder eingetauschte Token für nachgelagerte Systeme müssen eine kurze Gültigkeitsdauer haben |  | ✓ | ✓ |
| V4.6.2 | Bei unterstützten nachgelagerten Systemen müssen Token an den Absender gebunden sein (DPoP oder mTLS), damit gestohlene Token nicht wiederverwendet werden können |  | ✓ | ✓ |
| V4.6.3 | Token müssen auf eine Audience (aud) beschränkt sein und dürfen nur für das bei der Ausstellung angegebene nachgelagerte System verwendet werden | ✓ | ✓ | ✓ |

### V4.7 Schutz des Zugangsdatenspeichers

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V4.7.1 | Verwahrte Zugangsdaten müssen verschlüsselt gespeichert werden; in Datenbank und Backups darf kein Klartext vorkommen | ✓ | ✓ | ✓ |
| V4.7.2 | Administratoren und Betriebspersonal der Plattform dürfen Zugangsdaten nicht im Klartext lesen oder exportieren können | ✓ | ✓ | ✓ |
| V4.7.3 | Zugangsdaten dürfen bei einem Aufruf nur vom Egress-Gateway abgerufen werden können; jeder Abruf muss im Audit protokolliert werden | ✓ | ✓ | ✓ |
| V4.7.4 | Der Hauptschlüssel muss in einem vom Unternehmen kontrollierten KMS oder HSM verwaltet werden |  | ✓ | ✓ |
| V4.7.5 | Die Plattform muss die stapelweise Rotation und den Widerruf von Zugangsdaten pro Benutzer, pro Verbindung oder für den Gesamtbestand unterstützen |  | ✓ | ✓ |

## 11. V5 Isolierung der Ausführung

Wenn ein Agent Code, Befehle, Browser und Operationen auf dem Endgerät ausführt, muss er in kontrollierten Grenzen bleiben. Auch die Konfiguration des Harness muss vom Unternehmen zentral verwaltet werden und darf nicht von Mitarbeitern oder Code-Repositories beliebig geändert werden können.

### V5.1 Isolierung der Ausführungsumgebung

Dieser Abschnitt gilt für die von der Plattform betriebene Ausführungsumgebung; auf Mitarbeiter-Endgeräten laufende Agenten werden gemäß V5.4 behandelt.

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V5.1.1 | Jede Sitzung muss eine eigene Ausführungsumgebung verwenden; zwischen verschiedenen Benutzern und zwischen verschiedenen Sitzungen desselben Benutzers dürfen weder Dateien noch Prozesse geteilt werden | ✓ | ✓ | ✓ |
| V5.1.2 | Die Ausführungsumgebung muss mit nicht privilegierter Identität laufen und darf weder auf den Host noch auf andere Instanzen zugreifen können | ✓ | ✓ | ✓ |
| V5.1.3 | Nach Ende der Sitzung müssen die Ausführungsumgebung samt Dateien und temporären Zugangsdaten zerstört werden |  | ✓ | ✓ |
| V5.1.4 | Teilen sich mehrere Benutzer oder Mandanten einen Host für die Ausführungsumgebung, muss eine eigene Kernel- oder Userspace-Kernel-Isolierung eingesetzt werden, etwa gVisor, Kata Containers oder Firecracker-Mikro-VMs |  | ✓ | ✓ |

### V5.2 Ausführung von Code und Befehlen

Dieser Abschnitt gilt für Plattformen, die die Ausführung von Code oder Befehlen unterstützen.

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V5.2.1 | Code und Befehle dürfen nur in einer isolierten Ausführungsumgebung laufen und nicht unmittelbar auf dem Harness oder dem Host der Plattform | ✓ | ✓ | ✓ |
| V5.2.2 | Zugangsdaten, die das Egress-Gateway nicht injizieren kann (etwa clientseitig signierende Cloud-API-Zugangsdaten), müssen als kurzlebige Zugangsdaten mit eingeschränkten Rechten und Zielressourcen pro Benutzer und Aufgabe ausgestellt werden (etwa AWS STS); langlebige Schlüssel dürfen nicht hinterlegt werden | ✓ | ✓ | ✓ |
| V5.2.3 | Auf Mitarbeiter-Endgeräten oder in Ausführungsumgebungen mit persistenten Daten müssen Befehle zum Löschen persistenter Daten, zur Rechteerweiterung und zur Änderung der Netzwerkkonfiguration vor der Ausführung in eine Genehmigung überführt werden |  | ✓ | ✓ |
| V5.2.4 | Abhängigkeitspakete dürfen nur aus den vom Unternehmen freigegebenen Paketquellen installiert werden |  | ✓ | ✓ |

### V5.3 Browser- und Desktop-Operationen

Dieser Abschnitt gilt für Plattformen, die Browser- oder Desktop-Operationen unterstützen.

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V5.3.1 | Stellt die Plattform eine Browserumgebung bereit, muss der Agent ein eigenes Browserprofil verwenden und darf die persönlichen Sitzungen angemeldeter Benutzer nicht wiederverwenden | ✓ | ✓ | ✓ |
| V5.3.2 | Das Absenden von Formularen mit externer Wirkung (etwa Bestellung, Zahlung, Nachrichtenversand, Veröffentlichung von Inhalten, Änderung von Kontoeinstellungen) muss vorab eine Genehmigung erfordern | ✓ | ✓ | ✓ |
| V5.3.3 | Welche Websites der Agent aufrufen darf, muss pro Site autorisiert werden; nicht autorisierte Sites sind zu blockieren |  | ✓ | ✓ |
| V5.3.4 | Desktop-Operationen müssen auf die vom Benutzer freigegebenen Anwendungen beschränkt sein |  | ✓ | ✓ |
| V5.3.5 | Ein Agent, der in einem Browser läuft, in dem der Benutzer angemeldet ist (etwa eine Browser-Erweiterung), muss über eine Allowlist von Sites arbeiten; nicht aufgeführte Sites sind standardmäßig abzulehnen, und Operationen auf Sites für Authentifizierung, Zahlung und Administrationsoberflächen sind standardmäßig untersagt | ✓ | ✓ | ✓ |

### V5.4 Harness auf dem Endgerät

Dieser Abschnitt gilt für Agenten, die auf Mitarbeiter-Endgeräten laufen, etwa Coding-Agenten und Desktop-Assistenten.

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V5.4.1 | Die Ausführung auf dem Endgerät muss standardmäßig in einer Sandbox auf Systemebene erfolgen, etwa macOS Seatbelt oder Linux bubblewrap | ✓ | ✓ | ✓ |
| V5.4.2 | Der Dateizugriff muss pro Verzeichnis freigegeben werden; das Lesen von Schlüsselverzeichnissen (etwa `~/.ssh`, `~/.aws`) und von Speichern für Browser-Zugangsdaten ist standardmäßig nicht erlaubt | ✓ | ✓ | ✓ |
| V5.4.3 | Auf verwalteten Endgeräten muss das Unternehmen die Richtlinien für die Ausführung auf dem Endgerät über verwaltete Richtlinien einheitlich ausrollen können, und Mitarbeiter dürfen sie lokal nicht deaktivieren können; ein Agent auf einem nicht verwalteten Endgerät darf keine Zugangsdaten für Unternehmensressourcen erhalten | ✓ | ✓ | ✓ |
| V5.4.4 | Greift ein Agent auf dem Endgerät auf Unternehmensressourcen zu, muss dies über das Egress-Gateway geschehen und darf nicht unmittelbar auf lokal gespeicherte Unternehmenszugangsdaten zurückgreifen | ✓ | ✓ | ✓ |

### V5.5 Konfiguration des Harness und Berechtigungsmodi

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V5.5.1 | Das Unternehmen muss verwaltete Richtlinien ausrollen können, die durch lokale Konfigurationen nicht überschrieben werden können | ✓ | ✓ | ✓ |
| V5.5.2 | Verwaltete Richtlinien müssen automatische Genehmigung, das Überspringen von Bestätigungen und ähnliche Modi untersagen oder einschränken können | ✓ | ✓ | ✓ |
| V5.5.3 | Die Listen erlaubter und verbotener Tools müssen vom Unternehmen zentral konfiguriert werden | | ✓ | ✓ |
| V5.5.4 | Regeldateien, MCP-Definitionen und Hooks im Projektverzeichnis (Code-Repository oder in der IDE geöffneter Workspace) dürfen erst nach Bestätigung des Vertrauens durch den Benutzer geladen werden | ✓ | ✓ | ✓ |
| V5.5.5 | Nach einer Änderung der oben genannten Konfigurationen im Projektverzeichnis muss das Vertrauen erneut bestätigt werden, bevor sie geladen werden | ✓ | ✓ | ✓ |
| V5.5.6 | Das Unternehmen muss das Laden von MCP-Servern und Hooks auf Ebene des Projektverzeichnisses untersagen können |  | ✓ | ✓ |

### V5.6 Lieferkette für Skills, Plugins und MCP

Dieser Abschnitt gilt für Plattformen, die die Installation von Skills, Plugins oder Drittanbieter-MCP unterstützen.

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V5.6.1 | Skills, Plugins und MCP-Server dürfen erst nach Prüfung installiert werden | ✓ | ✓ | ✓ |
| V5.6.2 | Administratoren müssen eine Allowlist der zulässigen Installationen pflegen und Einträge sofort entfernen können |  | ✓ | ✓ |
| V5.6.3 | Herkunft und Signatur müssen geprüft und die Version fixiert werden; Aktualisierungen erfordern eine erneute Prüfung |  | ✓ | ✓ |
| V5.6.4 | Jeder Skill oder jedes Plugin muss die benötigten Berechtigungen deklarieren; Aufrufe, die über die Deklaration hinausgehen, sind bei der Ausführung abzulehnen |  | ✓ | ✓ |

## 12. V6 Kontext und nicht vertrauenswürdige Eingaben

Nicht vertrauenswürdige Inhalte, die in den Kontext gelangen, dürfen nur als Daten und nicht als Anweisungen behandelt werden. Hat eine Sitzung nicht vertrauenswürdige Inhalte eingelesen, werden die Handlungsmöglichkeiten des Agenten entsprechend eingeschränkt.

### V6.1 Kennzeichnung nicht vertrauenswürdiger Inhalte

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V6.1.1 | Die Plattform muss Tool-Rückgaben, Abrufergebnisse, Webseiten, E-Mails, Dateien und Ausgaben anderer Agenten als nicht vertrauenswürdige Inhalte kennzeichnen; diese Kennzeichnung ist Grundlage für die Einschränkungen nach V6.2 | ✓ | ✓ | ✓ |
| V6.1.2 | Inhalte, die in den Kontext gelangen, müssen ihre Herkunft kennzeichnen, damit die Richtlinienprüfung Benutzeranweisungen von nicht vertrauenswürdigen Inhalten unterscheiden kann |  | ✓ | ✓ |
| V6.1.3 | Richtlinien der Plattform und der Systemprompt müssen durch Nachrichtenrollen oder trennende Strukturen von nicht vertrauenswürdigen Inhalten getrennt werden und dürfen nicht im selben Textabschnitt verkettet werden |  | ✓ | ✓ |

### V6.2 Einschränkung nach Kontakt mit nicht vertrauenswürdigen Inhalten

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V6.2.1 | Hat eine Sitzung nicht vertrauenswürdige Inhalte berührt, ist jede Ausleitung standardmäßig untersagt und darf nur nach Genehmigung erfolgen | ✓ | ✓ | ✓ |
| V6.2.2 | Hat eine Sitzung nicht vertrauenswürdige Inhalte berührt, müssen Schreib- und Löschvorgänge in Systemen außerhalb der Ausführungsumgebung in eine Genehmigung überführt oder auf den nach V3.4.6 im Voraus genehmigten Plan beschränkt werden |  | ✓ | ✓ |
| V6.2.3 | Der Agent muss regelmäßig mit eingebetteten Injektionsanweisungen präparierten Webseiten, E-Mails, Dokumenten und Tool-Rückgaben einem Red-Teaming unterzogen werden |  | ✓ | ✓ |
| V6.2.4 | In Hochrisikoszenarien müssen nicht vertrauenswürdige Inhalte zunächst von einem isolierten Modell ohne Tool-Berechtigung verarbeitet werden; nur das strukturierte Ergebnis wird an den berechtigten Agenten übergeben (etwa das Dual-LLM-Muster oder CaMeL, das zusätzlich Kontrollfluss und Datenfluss trennt) |  |  | ✓ |

### V6.3 Systemprompt und Konfiguration

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V6.3.1 | Systemprompts, Agentenkonfigurationen und Skill-Dateien dürfen keine Zugangsdaten oder Schlüssel enthalten | ✓ | ✓ | ✓ |
| V6.3.2 | Es ist davon auszugehen, dass Systemprompts offengelegt werden können; sie dürfen keine personenbezogenen Daten und keine Daten enthalten, die über den gemeinsamen Sichtbarkeitsbereich aller Nutzer dieses Agenten hinausgehen | ✓ | ✓ | ✓ |
| V6.3.3 | Agentenkonfigurationen und Skill-Dateien müssen vor der Veröffentlichung einer Prüfung auf Zugangsdaten unterzogen werden |  | ✓ | ✓ |

### V6.4 Kaskadierung zwischen Agenten

Dieser Abschnitt gilt für Plattformen, die die Orchestrierung mehrerer Agenten unterstützen.

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V6.4.1 | Nachrichten zwischen Agenten müssen über die Plattform weitergeleitet werden und die Identität des Absenders mitführen; Agenten kommunizieren nicht direkt miteinander |  | ✓ | ✓ |
| V6.4.2 | An kritischen Knoten müssen Format und Wertebereich der Ausgabe der vorgelagerten Stufe geprüft werden; nicht konforme Ergebnisse werden nicht weiter nach unten gereicht |  | ✓ | ✓ |
| V6.4.3 | Überschreiten die Ausgaben einer Kette Anomalien oder die Fehlerrate einen Schwellenwert, muss die gesamte Kette unterbrochen (Circuit Breaker) und alarmiert werden |  | ✓ | ✓ |

## 13. V7 Ausgabe und Sichtbarkeit

Die Prüfung der Berechtigungen muss bis zum Moment der Ausgabe reichen. Wer das Ergebnis sieht und ob es abfließen kann, ist für jeden Empfänger erneut zu beurteilen.

### V7.1 Mehrpersonen-Kanäle

Dieser Abschnitt gilt für Plattformen, die Gruppenchats, Kanäle und Kommentare in gemeinsamen Dokumenten unterstützen.

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V7.1.1 | In Mehrpersonen-Kanälen dürfen Antworten nur Daten verwenden, auf die alle anwesenden Mitglieder zugreifen dürfen; andernfalls wird nach V7.1.2 verfahren | ✓ | ✓ | ✓ |
| V7.1.2 | Ergebnisse, die die Berechtigungen mindestens eines anwesenden Mitglieds überschreiten, dürfen nur dem auslösenden Benutzer als Direktnachricht zugestellt werden; im Kanal erscheint nur ein Hinweis | ✓ | ✓ | ✓ |
| V7.1.3 | Befinden sich externe Mitglieder im Kanal, muss die Stufe der anzeigbaren Inhalte weiter eingeschränkt werden |  | ✓ | ✓ |
| V7.1.4 | Bei der Beurteilung anzeigbarer Inhalte ist zu berücksichtigen, dass später hinzukommende Mitglieder den bisherigen Verlauf einsehen können |  | ✓ | ✓ |

### V7.2 Isolierung der Sitzungen bei gemeinsam genutztem Agenten

Dieser Abschnitt gilt für Plattformen, auf denen mehrere Personen denselben Agenten gemeinsam nutzen.

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V7.2.1 | Sitzungen eines gemeinsam genutzten Agenten müssen pro Benutzer isoliert sein | ✓ | ✓ | ✓ |
| V7.2.2 | Persönlicher Kontext und gemeinsam genutztes Teamwissen müssen getrennt gespeichert werden; beim Abruf wird die Autorisierung anhand des aktuellen Benutzers entschieden |  | ✓ | ✓ |

### V7.3 Übergabe einer Sitzung

Dieser Abschnitt gilt für Plattformen, die die Übergabe einer Sitzung oder die Übernahme durch einen Menschen unterstützen.

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V7.3.1 | Vor der Übergabe einer Sitzung ist der bestehende Kontext nach den Berechtigungen des Empfängers zu prüfen |  | ✓ | ✓ |
| V7.3.2 | Inhalte, die über die Berechtigungen des Empfängers hinausgehen, müssen vor der Übergabe maskiert oder entfernt werden |  | ✓ | ✓ |

### V7.4 Darstellung der Ausgabe

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V7.4.1 | In Antworten, die die Plattform an einen beliebigen Kanal sendet, müssen Bilder und Ressourcen, die auf Domänen außerhalb der Allowlist verweisen, vor dem Versand entfernt oder in einen Link umgewandelt werden, der nicht automatisch geladen wird | ✓ | ✓ | ✓ |
| V7.4.2 | HTML und Markdown in Antworten müssen vor dem Rendering bereinigt werden; Skripte und Ereignisattribute sind zu entfernen | ✓ | ✓ | ✓ |
| V7.4.3 | Links in Antworten müssen das tatsächliche Ziel anzeigen | | ✓ | ✓ |

### V7.5 Schutz vor Datenabfluss bei der Ausgabe

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V7.5.1 | Erscheinen Zugangsdaten oder Schlüssel in Antworten und in ausgeleiteten Inhalten, müssen sie blockiert werden |  | ✓ | ✓ |
| V7.5.2 | Antworten, Dateidownloads und ausgeleitete Inhalte müssen auf sensible Daten geprüft werden |  | ✓ | ✓ |
| V7.5.3 | Werden personenbezogene Daten oder andere sensible Daten erkannt, müssen sie nach Richtlinie maskiert oder in eine Genehmigung überführt werden |  | ✓ | ✓ |
| V7.5.4 | Hat eine Sitzung nicht öffentliche Daten gelesen, ist jede Ausleitung standardmäßig untersagt und darf nur nach Genehmigung erfolgen | ✓ | ✓ | ✓ |

### V7.6 Nachrichten im Auftrag des Benutzers

Dieser Abschnitt gilt für Plattformen, die E-Mails, Instant Messages oder Ankündigungen im Namen des Benutzers versenden können.

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V7.6.1 | Nachrichten an externe Empfänger des Unternehmens müssen genehmigt werden |  | ✓ | ✓ |
| V7.6.2 | Die Standardform des Versands im Auftrag des Benutzers muss ein Entwurf sein, der nach Bestätigung durch den Benutzer versendet wird |  | ✓ | ✓ |
| V7.6.3 | Von einem Agenten im Auftrag versendete Nachrichten müssen eine erkennbare Kennzeichnung des Versands im Auftrag tragen |  | ✓ | ✓ |

## 14. V8 Daten, Gedächtnis und Arbeitsergebnisse

Was ein Agent hinterlässt, wird später von anderen Personen abgerufen. Abruf, Gedächtnis und Arbeitsergebnisse müssen Herkunfts- und Berechtigungsmarkierungen tragen, und beim Lesen wird die Autorisierung anhand des aktuellen Benutzers neu entschieden.

### V8.1 Autorisierung beim Abruf

Dieser Abschnitt gilt für Plattformen, die RAG oder Abfrage einer Wissensdatenbank unterstützen.

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V8.1.1 | Abrufergebnisse müssen nach der Zugriffskontrolle des Quellsystems gefiltert werden; die Zugriffskontrollliste (ACL) kann auf jeden Textabschnitt (Chunk) synchronisiert oder beim Abruf beim Quellsystem erneut geprüft werden | ✓ | ✓ | ✓ |
| V8.1.2 | Die Ergebnisse müssen bereits in der Abrufphase nach dem aktuellen Benutzer gefiltert werden, nicht erst nach der Antwortgenerierung durch Löschen | ✓ | ✓ | ✓ |
| V8.1.3 | Wird im Quellsystem eine Berechtigung entzogen, muss dies innerhalb einer vereinbarten Frist in den Abrufergebnissen wirksam werden; die Synchronisationsverzögerung ist zu überwachen |  | ✓ | ✓ |

### V8.2 Datenbankabfragen

Dieser Abschnitt gilt für Plattformen, auf denen der Agent Geschäftsdatenbanken direkt abfragt.

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V8.2.1 | Fragt der Agent eine Datenbank ab, muss die Verbindung im Namen des Benutzers hergestellt werden, oder die Plattform muss die zeilen- und spaltenbezogenen Richtlinien dieses Benutzers einfügen | ✓ | ✓ | ✓ |
| V8.2.2 | Die vom Agenten verwendete Datenbankverbindung muss standardmäßig nur lesend sein | ✓ | ✓ | ✓ |
| V8.2.3 | Die Anzahl der Zeilen, die eine einzelne Abfrage zurückgibt, muss begrenzt sein |  | ✓ | ✓ |

### V8.3 Isolierung des Gedächtnisses

Dieser Abschnitt gilt für Plattformen, die langfristiges Gedächtnis oder Wissensaufbau unterstützen.

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V8.3.1 | Das Gedächtnis muss den Quellbenutzer und die Berechtigungsmarkierung erfassen |  | ✓ | ✓ |
| V8.3.2 | Beim Abruf von Gedächtnis muss nach dem aktuellen Benutzer gefiltert werden; das persönliche Gedächtnis eines Benutzers darf in den Sitzungen anderer Benutzer nicht erscheinen | ✓ | ✓ | ✓ |
| V8.3.3 | Persönliche Inhalte müssen vor ihrer Übernahme in geteiltes Teamwissen geprüft werden |  | ✓ | ✓ |

### V8.4 Vergiftung von Gedächtnis und Wissen

Dieser Abschnitt gilt für Plattformen, die langfristiges Gedächtnis oder Wissensaufbau unterstützen.

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V8.4.1 | In Gedächtnis und Wissensdatenbank geschriebene Inhalte müssen Herkunft und Vertrauenswürdigkeit kennzeichnen |  | ✓ | ✓ |
| V8.4.2 | Aufbau von Wissen aus nicht vertrauenswürdigen Inhalten muss vor dem Abruf manuell geprüft werden |  | ✓ | ✓ |
| V8.4.3 | Abgerufenes Gedächtnis muss dem Modell als Daten und nicht als Systemanweisung übergeben werden |  | ✓ | ✓ |
| V8.4.4 | Die Plattform muss die Rückverfolgung nach Herkunft sowie die Massenlöschung von Gedächtnis- und Wissenseinträgen unterstützen |  | ✓ | ✓ |

### V8.5 Arbeitsergebnisse

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V8.5.1 | Arbeitsergebnisse müssen die höchste Datenstufe ihrer Quellen übernehmen und die Quellen erfassen |  | ✓ | ✓ |
| V8.5.2 | Beim Teilen von Arbeitsergebnissen ist zu prüfen, ob der Empfänger die Berechtigung für die Quelldaten besitzt |  | ✓ | ✓ |
| V8.5.3 | Anfragen zur Aggregation und Auswertung sensibler Merkmale müssen in eine Genehmigung überführt werden |  |  | ✓ |

### V8.6 Caching und Aufbewahrung

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V8.6.1 | Zwischengespeicherte Abrufergebnisse und Antworten müssen eine Berechtigungsmarkierung tragen und bei Änderung der Berechtigungen ungültig werden |  | ✓ | ✓ |
| V8.6.2 | Historische Sitzungen müssen nach den aktuellen Berechtigungen angezeigt werden; Inhalte, für die die Berechtigung entzogen wurde, werden nicht mehr angezeigt |  | ✓ | ✓ |
| V8.6.3 | Für Sitzungen, Gedächtnis und Audit müssen jeweils eigene Aufbewahrungsfristen festgelegt sein |  | ✓ | ✓ |
| V8.6.4 | Nach dem Ausscheiden eines Benutzers müssen seine verwahrten Zugangsdaten innerhalb einer vereinbarten Frist gelöscht werden; persönliches Gedächtnis wird nach Richtlinie gelöscht oder übergeben |  | ✓ | ✓ |

### V8.7 Modellrouting

Dieser Abschnitt gilt für Plattformen, die mehrere Modelle anbinden. Die Verwendung von Konversationsdaten für Bewertung und Feinabstimmung fällt unter die Datenverwaltung für das Training von Modellen; siehe C1 und C3 des OWASP AISVS.

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V8.7.1 | Je Datenklassifizierung muss konfiguriert sein, an welche Modelle jede Datenklasse übermittelt werden darf; sensible Daten dürfen nur an lokale oder festgelegte Modelle gehen |  | ✓ | ✓ |
| V8.7.2 | Sensible Daten, die an ein nicht freigegebenes Modell übermittelt werden sollen, müssen blockiert werden |  | ✓ | ✓ |

## 15. V9 Lebenszyklus und Governance

Jeder Agent muss registriert sein, eine verantwortliche Person haben und regelmäßig überprüft werden; vom Anlegen bis zur Außerbetriebnahme muss alles steuerbar sein. Auch der Zugriff des Anbieters selbst unterliegt dieser Governance.

### V9.1 Registrierung und Veröffentlichung von Agenten

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V9.1.1 | Anlegen, Veröffentlichen und Außerbetriebnahme eines Agenten müssen jeweils gesondert autorisiert werden |  | ✓ | ✓ |
| V9.1.2 | Ein Agent muss vor der Veröffentlichung geprüft werden; ein Agent ohne benannte verantwortliche Person darf nicht veröffentlicht werden | ✓ | ✓ | ✓ |
| V9.1.3 | Die Plattform muss alle veröffentlichten Agenten sowie ihren jeweiligen Autorisierungsumfang, ihre Verbindungen und ihre verantwortliche Person auflisten können | ✓ | ✓ | ✓ |
| V9.1.4 | Die Registrierungsangaben eines Agenten müssen das verwendete Modell mit Version, die Harness-Version und die verbundenen Tools umfassen und bei Änderungen aktualisiert werden |  | ✓ | ✓ |

### V9.2 Konnektoren und Bindung von Zugangsdaten

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V9.2.1 | Die Bindung eines Konnektors an einen Agenten muss die entsprechende Berechtigung voraussetzen und darf den im Register des Agenten erfassten Autorisierungsumfang nicht überschreiten | ✓ | ✓ | ✓ |
| V9.2.2 | Nach der Bindung von Zugangsdaten darf die bindende Person deren Klartext nicht mehr einsehen oder exportieren können |  | ✓ | ✓ |
| V9.2.3 | Bindung und Änderung von Konnektoren müssen im Audit protokolliert werden |  | ✓ | ✓ |

### V9.3 Konfigurationsänderungen

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V9.3.1 | Änderungen am Systemprompt, an den Tools, am Autorisierungsumfang und an den Richtlinien eines Agenten müssen genehmigt werden |  | ✓ | ✓ |
| V9.3.2 | Nicht genehmigte Konfigurationsänderungen dürfen nicht wirksam werden |  | ✓ | ✓ |
| V9.3.3 | Konfigurationen müssen eine Versionshistorie führen, und ein Rollback auf jede frühere Version muss möglich sein |  | ✓ | ✓ |
| V9.3.4 | Der Wechsel des vom Agenten verwendeten Modells oder der Modellversion muss als Konfigurationsänderung genehmigt werden, und das Verhalten ist neu zu bewerten |  | ✓ | ✓ |
| V9.3.5 | Änderungen an globalen Richtlinien wie Risikoklassifizierung, Bindung von Zugangsdaten an Ziele, Egress-Freigabelisten und verwaltete Richtlinien dürfen nur durch dafür bestimmte Rollen erfolgen; Änderungen sind mit handelnder Person, Zeitpunkt sowie Inhalt vor und nach der Änderung zu protokollieren | ✓ | ✓ | ✓ |
| V9.3.6 | Die oben genannten globalen Richtlinienänderungen müssen vor ihrer Wirksamkeit von einer zweiten Person genehmigt werden |  | ✓ | ✓ |

### V9.4 Lebenszyklus und Überprüfung der Berechtigungen

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V9.4.1 | Scheidet die verantwortliche Person eines Agenten aus oder wechselt sie die Stelle, müssen ihre Agenten in den Status „Übergabe ausstehend“ überführt werden; werden sie nicht innerhalb der Frist übergeben, werden sie automatisch deaktiviert |  | ✓ | ✓ |
| V9.4.2 | Verbindungen und Berechtigungen der Agenten müssen regelmäßig überprüft werden; nicht bestätigte Berechtigungen werden automatisch entzogen |  | ✓ | ✓ |
| V9.4.3 | Dauerhaft ungenutzte Agenten müssen erkannt und außer Betrieb genommen werden |  | ✓ | ✓ |

### V9.5 Erkennung von Schatten-Agenten

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V9.5.1 | Über die OAuth-Autorisierungsprotokolle des IdP müssen Agenten erkannt werden, die Mitarbeiter selbst angebunden haben und die nicht registriert sind |  | ✓ | ✓ |
| V9.5.2 | Gefundene nicht registrierte Agenten müssen innerhalb einer vereinbarten Frist registriert und unter Verwaltung gestellt oder gesperrt werden |  | ✓ | ✓ |
| V9.5.3 | Durch Kombination mit Endgeräte- und Netzwerkerkennung müssen nicht registrierte Agenten auf Endgeräten und in Browsern erkannt werden |  |  | ✓ |

### V9.6 Isolierung der Arbeitsbereiche

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V9.6.1 | Daten, Wissensdatenbanken, Zugangsdaten und Agenten müssen nach Arbeitsbereich isoliert sein | ✓ | ✓ | ✓ |
| V9.6.2 | Zugriffe über Arbeitsbereiche hinweg müssen ausdrücklich autorisiert sein | ✓ | ✓ | ✓ |
| V9.6.3 | Bei Bereitstellung als SaaS müssen Daten, Zugangsdaten und Ausführungsumgebungen verschiedener Mandanten vollständig voneinander getrennt sein | ✓ | ✓ | ✓ |

### V9.7 Zugriff des Anbieterpersonals

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V9.7.1 | Der Zugriff des Anbieters auf die Umgebung und die Daten des Kunden muss standardmäßig deaktiviert sein; eine Aktivierung erfordert die Genehmigung des Kunden und ist zeitlich zu begrenzen | ✓ | ✓ | ✓ |
| V9.7.2 | Jeder Zugriff des Anbieters muss lückenlos protokolliert werden, und die Auditprotokolle müssen für den Kunden einsehbar sein | ✓ | ✓ | ✓ |
| V9.7.3 | Telemetriedaten dürfen nur Felder aus der öffentlichen Liste enthalten, und die Telemetrie muss für den Kunden abschaltbar sein |  | ✓ | ✓ |
| V9.7.4 | Anmeldung und Autorisierungsentscheidungen bei privater Bereitstellung dürfen nicht vom Online-Dienst des Anbieters abhängen |  | ✓ | ✓ |

## 16. V10 Audit, Erkennung und Reaktion

Tritt ein Vorfall ein, muss sich nachvollziehen lassen, wer welchen Agenten auf welcher Grundlage welche Aktion ausführen ließ, und der Schaden muss innerhalb von Minuten eingedämmt werden können. Dieses Kapitel umfasst Protokollierung, Erkennung, Widerruf, Notabschaltung und Wiederherstellung nach einem Vorfall.

### V10.1 Audit-Protokollierung

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V10.1.1 | Für jeden Tool-Aufruf müssen die auslösende Person, der ausführende Agent, die Delegationskette, die Auslösequelle, die Tool-Parameter und der Ergebnisstatus protokolliert werden | ✓ | ✓ | ✓ |
| V10.1.2 | Für genehmigte Operationen müssen der Genehmiger, der Genehmigungsinhalt und der Genehmigungszeitpunkt protokolliert werden | ✓ | ✓ | ✓ |
| V10.1.3 | Das Audit muss die Herkunft nicht vertrauenswürdiger Inhalte erfassen, die in den Kontext gelangt sind, damit sich im Nachhinein feststellen lässt, ob eine Operation durch Injektion ausgelöst wurde |  | ✓ | ✓ |
| V10.1.4 | Das Audit muss in das SIEM des Unternehmens exportiert werden können |  | ✓ | ✓ |
| V10.1.5 | Auditprotokolle müssen append-only in einen Speicher geschrieben werden, der vom Betrieb der Plattform getrennt ist, oder durch eine Hash-Kette oder vergleichbare Verfahren so gesichert sein, dass Manipulationen erkennbar sind |  | ✓ | ✓ |
| V10.1.6 | Audit-Datensätze müssen kryptografisch an die Identität des ausführenden Agenten sowie an den autorisierenden Benutzer oder die Genehmigung gebunden sein, sodass Nichtabstreitbarkeit gewährleistet ist |  |  | ✓ |

### V10.2 Schutz der Audit-Daten und Einsicht

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V10.2.1 | Das Einsehen von Audit-Protokollen oder Konversationen durch Administratoren muss selbst im Audit protokolliert werden | ✓ | ✓ | ✓ |
| V10.2.2 | Sensible Felder in Auditprotokollen müssen maskiert gespeichert oder nach Rolle sichtbar gemacht werden |  | ✓ | ✓ |
| V10.2.3 | Das Einsehen von Konversationen zwischen Benutzern und Agenten durch Administratoren muss genehmigt werden |  | ✓ | ✓ |
| V10.2.4 | Audit-Datensätze dürfen innerhalb der Aufbewahrungsfrist nicht löschbar sein |  | ✓ | ✓ |

### V10.3 Verhaltenserkennung

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V10.3.1 | Ereignisse wie Richtlinienablehnung, Ablehnung der Genehmigung oder nicht passendes Ziel der Zugangsdaten müssen in Echtzeit alarmiert werden |  | ✓ | ✓ |
| V10.3.2 | Alarme müssen nach Agent, Benutzer und Delegationskette abgerufen und zugeordnet werden können |  | ✓ | ✓ |
| V10.3.3 | Für jeden Agenten muss eine Verhaltensbasislinie (Aufrufhäufigkeit, Verteilung der Tools, Datenmenge) erstellt werden; bei Abweichung wird alarmiert |  |  | ✓ |

### V10.4 Entzug von Berechtigungen und Notabschaltung

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V10.4.1 | Nach Deaktivierung oder Herabstufung eines Benutzers im IdP müssen die zugehörigen Aufrufe innerhalb einer vereinbarten Frist (etwa 5 Minuten) vollständig abgelehnt werden | ✓ | ✓ | ✓ |
| V10.4.2 | Der Zwischenspeicher der Berechtigungen muss eine Höchstdauer haben |  | ✓ | ✓ |
| V10.4.3 | Ein einzelner Agent muss mit einer einzigen Operation deaktiviert werden können; bei der Deaktivierung stellt das Gateway die Injektion von Zugangsdaten für ihn ein, widerruft seine Refresh-Token, bricht laufende Aufgaben ab und beendet die Sitzungen | ✓ | ✓ | ✓ |
| V10.4.4 | Die Plattform muss Sitzungswiderrufsereignisse des IdP (etwa CAEP) empfangen und diese sofort wirksam machen | | ✓ | ✓ |
| V10.4.5 | Agenten müssen nach verantwortlicher Person, Arbeitsbereich oder Konnektor gesammelt deaktiviert werden können |  | ✓ | ✓ |

### V10.5 Notzugang

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V10.5.1 | Es müssen Notfallzugangskonten vorbereitet sein, mit denen auch bei Ausfall des IdP an der Verwaltungsebene angemeldet werden kann |  | ✓ | ✓ |
| V10.5.2 | Die Zugangsdaten der Notfallzugangskonten müssen aufgeteilt verwahrt und unter Zwei-Personen-Kontrolle gehalten werden; jede Nutzung löst einen Alarm aus und wird lückenlos protokolliert |  | ✓ | ✓ |

### V10.6 Reaktion auf Vorfälle und Wiederherstellung

| Nr. | Anforderung | L1 | L2 | L3 |
| --- | --- | --- | --- | --- |
| V10.6.1 | Es muss ein Reaktionsverfahren für den Fall festgelegt sein, dass ein Agent injiziert oder kompromittiert wurde; es umfasst Deaktivierung, Rotation der Zugangsdaten und Ermittlung des Schadensumfangs |  | ✓ | ✓ |
| V10.6.2 | Die Plattform muss alle Operationen eines Agenten in einem bestimmten Zeitraum nach Sitzung oder Delegationskette rekonstruieren können, um den Schadensumfang zu bestimmen |  | ✓ | ✓ |
| V10.6.3 | Schreibende Operationen müssen umkehrbar sein oder vor der Ausführung einen rückrollbaren Snapshot erhalten |  |  | ✓ |

## Anhang A OWASP-Risikoabdeckung

Für alle zehn Risiken der OWASP Top 10 for Agentic Applications 2026 gibt es entsprechende Anforderungen. Von den LLM Top 10 2025 betrifft nur LLM09 Misinformation die Richtigkeit von Inhalten; es liegt außerhalb des Geltungsbereichs dieser Baseline.

| Nr. | Risiko | Zugehörige Abschnitte |
| --- | --- | --- |
| ASI01 | Agent Goal Hijack | V3.4, V6.1, V6.2, V10.3 |
| ASI02 | Tool Misuse & Exploitation | V3.1, V3.2, V3.3, V4.2, V5.6 |
| ASI03 | Identity & Privilege Abuse | V1 vollständig, V2 vollständig, V4.1, V4.3, V4.6, V4.7 |
| ASI04 | Agentic Supply Chain Vulnerabilities | V5.5, V5.6, V9.7 |
| ASI05 | Unexpected Code Execution (RCE) | V5.1, V5.2, V5.3, V5.4 |
| ASI06 | Memory & Context Poisoning | V6.1, V8.3, V8.4 |
| ASI07 | Insecure Inter-Agent Communication | V2.4, V6.4 |
| ASI08 | Cascading Failures | V6.4, V10.4 |
| ASI09 | Human-Agent Trust Exploitation | V3.4, V7.6 |
| ASI10 | Rogue Agents | V3.7, V9.4, V9.5, V10.3, V10.4 |
| LLM01 | Prompt Injection | V6.1, V6.2 |
| LLM02 | Sensitive Information Disclosure | V7 vollständig, V8 vollständig |
| LLM03 | Supply Chain | V5.6, V9.7 |
| LLM04 | Data and Model Poisoning | V8.4 |
| LLM05 | Improper Output Handling | V7.4, V8.2 |
| LLM06 | Excessive Agency | V2.2, V3.1, V3.3 |
| LLM07 | System Prompt Leakage | V6.3 |
| LLM08 | Vector and Embedding Weaknesses | V8.1 |
| LLM09 | Misinformation | außerhalb des Geltungsbereichs |
| LLM10 | Unbounded Consumption | V2.4, V3.8 |

## Anhang B Zuordnung zu OWASP AISVS 1.0

Von den 62 Abschnitten dieser Baseline entsprechen 22 direkt einem Eintrag von AISVS 1.0, 27 entsprechen teilweise, und 13 sind neu in dieser Baseline; die Neuerungen betreffen vor allem Kanäle, Ausgaben mehrerer Personen, Altsysteme, Ausführung auf dem Endgerät und Zugriff des Anbieters. Die Nummern der AISVS-Einträge wurden am 7. Oktober 2026 gegen die Fassung 1.0/en im [OWASP/AISVS-Repository](https://github.com/OWASP/AISVS) geprüft.

„Entspricht“ bedeutet, dass Ziel und Art der Kontrolle im Wesentlichen übereinstimmen; „teilweise“ bedeutet, dass AISVS einen einschlägigen Eintrag hat, die Anforderung dieser Baseline aber detaillierter ist oder einen anderen Umfang abdeckt; „neu“ bedeutet, dass AISVS keinen entsprechenden Eintrag hat.

| Abschnitt dieser Baseline | AISVS-Eintrag | Beziehung |
| --- | --- | --- |
| V1.1 Benutzerauthentifizierung | 5.1.1 | teilweise |
| V1.2 Zuordnung der Identität über Kanäle | keiner | neu |
| V1.3 Agent-Identität | 5.1.2, 9.4.1, 9.4.3 | entspricht |
| V1.4 Workload-Identität | 4.1.3, 9.4.1 | teilweise |
| V1.5 Externe Prinzipale | 5.1.2 | teilweise |
| V2.1 Zugriff im Auftrag des Benutzers | 9.5.2 | entspricht |
| V2.2 Wirksame Berechtigungen | 5.2.5, 9.5.1, 9.5.3, 9.5.6 | entspricht |
| V2.3 Offline-Delegationsaufgaben | 9.5.6 | teilweise |
| V2.4 Delegation zwischen Agenten | 9.1.2, 9.4.2, 9.5.5 | entspricht |
| V2.5 Delegation zwischen Benutzern und zeitlich begrenzte Rechteerweiterung | 5.2.6 | teilweise |
| V2.6 Durch Ereignisse ausgelöste Autorisierung | keiner | neu |
| V3.1 Risikoklassifizierung von Operationen | 9.2.3, 9.2.4 | entspricht |
| V3.2 Vorabprüfung von Tool-Aufrufen | 9.2.5, 9.5.1, 9.5.3 | entspricht |
| V3.3 Tool-Exposition | 10.2.4 | teilweise |
| V3.4 Manuelle Genehmigung | 9.2.1, 9.2.2, 9.2.8, 9.6.2 | entspricht |
| V3.5 Step-up-Authentifizierung und kontinuierliche Zugriffsbewertung | 5.1.1, 9.5.6 | teilweise |
| V3.6 Funktionstrennung | keiner | neu |
| V3.7 Persistente Operationen | 9.2.5 | teilweise |
| V3.8 Menge, Rate und Kontingente | 9.1.1, 9.1.2, 12.2.5 | entspricht |
| V4.1 Verwahrung und Injektion von Zugangsdaten | 9.5.4 | teilweise |
| V4.2 Einheitlicher Ausgang | 7.3.3, 9.3.1 | teilweise |
| V4.3 Weitergabe der Identität an nachgelagerte Systeme | 9.5.2 | teilweise |
| V4.4 Altsysteme mit statischen Zugangsdaten | keiner | neu |
| V4.5 MCP-Aufrufe | 10.1.2, 10.1.3, 10.2.1 bis 10.2.7, 10.4.8 | entspricht |
| V4.6 Lebenszyklus der Token | 5.1.2, 10.2.2, 10.3.5 | entspricht |
| V4.7 Schutz des Zugangsdatenspeichers | keiner | neu |
| V5.1 Isolierung der Ausführungsumgebung | 4.1.1, 9.3.1 | entspricht |
| V5.2 Ausführung von Code und Befehlen | 9.1.1, 9.3.1 | teilweise |
| V5.3 Browser- und Desktop-Operationen | keiner | neu |
| V5.4 Harness auf dem Endgerät | keiner | neu |
| V5.5 Konfiguration des Harness und Berechtigungsmodi | 10.4.7, 10.4.8 | teilweise |
| V5.6 Skills, Plugins und MCP-Lieferkette | 9.3.3, 9.3.4, 9.3.7, 10.1.1, 10.1.2 | entspricht |
| V6.1 Kennzeichnung nicht vertrauenswürdiger Inhalte | 2.1.3, 2.1.6 | entspricht |
| V6.2 Einschränkung nach Kontakt mit nicht vertrauenswürdigen Inhalten | 9.3.5, 9.3.6, 10.4.2 | entspricht |
| V6.3 Systemprompt und Konfiguration | 7.3.2 | teilweise |
| V6.4 Kaskadierung zwischen Agenten | 9.2.10, 9.3.2 | teilweise |
| V7.1 Mehrpersonen-Kanäle | keiner | neu |
| V7.2 Isolierung der Sitzungen bei gemeinsam genutztem Agenten | 5.3.1, 8.1.3 | teilweise |
| V7.3 Übergabe einer Sitzung | keiner | neu |
| V7.4 Darstellung der Ausgabe | 7.3.3, 7.3.4 | entspricht |
| V7.5 Schutz vor Datenabfluss bei der Ausgabe | 5.2.4, 7.3.2 | teilweise |
| V7.6 Nachrichten im Auftrag des Benutzers | 9.2.1 | teilweise |
| V8.1 Autorisierung beim Abruf | 5.2.2, 8.1.3 | entspricht |
| V8.2 Datenbankabfragen | 5.2.1 | teilweise |
| V8.3 Isolierung des Gedächtnisses | 5.2.2, 8.1.1, 8.1.3 | entspricht |
| V8.4 Vergiftung von Gedächtnis und Wissen | 8.2.3, 8.2.4, 8.3.3, 12.5.4 | entspricht |
| V8.5 Arbeitsergebnisse | 5.2.7 | teilweise |
| V8.6 Caching und Aufbewahrung | 5.2.7, 8.3.1, 8.3.2 | teilweise |
| V8.7 Modellrouting | 8.2.1 | teilweise |
| V9.1 Registrierung und Veröffentlichung von Agenten | 3.1.1 | teilweise |
| V9.2 Konnektoren und Bindung von Zugangsdaten | keiner | neu |
| V9.3 Konfigurationsänderungen | 3.3.1, 3.3.2, 9.2.5 | teilweise |
| V9.4 Lebenszyklus und Überprüfung der Berechtigungen | 9.4.3 | teilweise |
| V9.5 Erkennung von Schatten-Agenten | keiner | neu |
| V9.6 Isolierung der Arbeitsbereiche | 5.3.1, 5.3.2, 8.1.1 | entspricht |
| V9.7 Zugriff des Anbieterpersonals | keiner | neu |
| V10.1 Audit-Protokollierung | 9.4.2, 12.1.1, 12.1.2, 12.4.2 | entspricht |
| V10.2 Schutz der Audit-Daten und Einsicht | 12.5.3 | teilweise |
| V10.3 Verhaltenserkennung | 12.2.1, 12.2.2, 12.4.1 | entspricht |
| V10.4 Entzug von Berechtigungen und Notabschaltung | 9.1.3, 9.6.1, 9.6.3, 12.4.3 | entspricht |
| V10.5 Notzugang | keiner | neu |
| V10.6 Reaktion auf Vorfälle und Wiederherstellung | 3.3.2, 9.2.3 | teilweise |

Die Bereiche des AISVS zu Trainingsdaten (C1), zum Modelllebenszyklus (C3, soweit es das Training und die Bewertung von Modellen betrifft), zu Hardware- und Edge-Bereitstellung (C4.2, C4.3), zur Modell-Lieferkette (C6), zu Halluzinationen und Inhaltssicherheit (C7.2, C7.3.1), zur adversarialen Robustheit (C11) und zur Modelldrift (C12.3) betreffen die Modellseite und liegen außerhalb des Geltungsbereichs dieser Baseline. Die Einträge aus C3 zur Versionsverwaltung und Änderungskontrolle sind V9.1, V9.3 und V10.6 zugeordnet.

## Anhang C Zuordnung zu CSA AICM

Dieser Anhang ordnet nach Kontrolldomänen zu. AICM richtet sich an alle KI-Systeme und ist gröber gegliedert als diese Baseline; ein Kapitel dieser Baseline fällt in der Regel in ein bis vier Domänen. Die Kontrollnummern sind anhand der offiziellen CSA-Arbeitsmappe AICM v1.1 zu ergänzen; in dieser Version sind sie nicht einzeln aufgeführt.

| Diese Baseline | AICM-Kontrolldomäne | Erläuterung |
| --- | --- | --- |
| V1 Identität und Authentifizierung | IAM Identitäts- und Zugriffsmanagement | vollständig |
| V2 Delegation und wirksame Berechtigungen | IAM Identitäts- und Zugriffsmanagement | vollständig; V2.5 zur zeitlich begrenzten Rechteerweiterung entspricht dem privilegierten Zugriffsmanagement |
| V3 Autorisierungsentscheidung | IAM Identitäts- und Zugriffsmanagement; AIS Anwendungs- und Schnittstellensicherheit | V3.6 Funktionstrennung gehört zu IAM; V3.2 und V3.3 gehören zu AIS |
| V4 Zugangsdaten und Durchsetzung am Egress | IAM Identitäts- und Zugriffsmanagement; CEK Kryptografie, Verschlüsselung und Schlüsselmanagement; I&S Infrastruktursicherheit | V4.7 Schutz des Zugangsdatenspeichers gehört zu CEK; V4.2 Einheitlicher Ausgang gehört zu I&S |
| V5 Isolierung der Ausführung | I&S Infrastruktursicherheit; UEM Unified Endpoint Management; CCC Change Control und Konfigurationsmanagement; STA Supply-Chain-Management, Transparenz und Verantwortlichkeit | V5.4 Endgerät gehört zu UEM; V5.5 verwaltete Richtlinien gehören zu CCC; V5.6 Lieferkette gehört zu STA |
| V6 Kontext und nicht vertrauenswürdige Eingaben | MDS Modellsicherheit; AIS Anwendungs- und Schnittstellensicherheit | vollständig |
| V7 Ausgabe und Sichtbarkeit | DSP Datensicherheit und Lebenszyklus des Datenschutzes; AIS Anwendungs- und Schnittstellensicherheit | V7.5 Schutz vor Datenabfluss gehört zu DSP |
| V8 Daten, Gedächtnis und Arbeitsergebnisse | DSP Datensicherheit und Lebenszyklus des Datenschutzes; MDS Modellsicherheit | V8.7 Modellrouting betrifft sowohl DSP als auch MDS |
| V9 Lebenszyklus und Governance | GRC Governance, Risiko und Compliance; CCC Change Control und Konfigurationsmanagement; STA Supply-Chain-Management, Transparenz und Verantwortlichkeit; IAM Identitäts- und Zugriffsmanagement | V9.3 Konfigurationsänderungen gehört zu CCC; V9.7 Zugriff des Anbieterpersonals gehört zu STA; V9.4 Überprüfung der Berechtigungen gehört zu IAM |
| V10 Audit, Erkennung und Reaktion | LOG Protokollierung und Überwachung; SEF Sicherheitsereignismanagement, elektronische Forensik und Cloud-Forensik; IAM Identitäts- und Zugriffsmanagement; BCR Business Continuity Management und operative Resilienz | V10.1 bis V10.3 gehören zu LOG; V10.4 und V10.6 gehören zu SEF; V10.5 Notzugang gehört zu IAM und BCR |
