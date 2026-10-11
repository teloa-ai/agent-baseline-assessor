<p align="center">
  <a href="https://security.teloa.ai/agent-baseline-assessor/?lang=ko"><img src="03-tool/assets/brand/readme-hero.ko.png" width="100%" alt="Teloa AI Security · 엔터프라이즈 에이전트 신원 및 인가 보안 기준선"></a>
</p>

# 엔터프라이즈 에이전트 신원 및 인가 보안 기준선

Teloa 개발에서 도출한 개방형 보안 기준선과 자가 평가 도구

[English](README.md) · [简体中文](README.zh-CN.md) · [日本語](README.ja.md) · **한국어** · [Deutsch](README.de.md) · [Français](README.fr.md) · [Español](README.es.md)

[공식 사이트](https://www.teloa.ai/en/) · [문서](https://docs.teloa.ai/en/) · [마켓플레이스](https://market.teloa.ai/en/) · [AI 보안](https://security.teloa.ai/?lang=en) · [블로그](https://www.teloa.ai/en/blog/) · [취약점 신고](https://security.teloa.ai/report/?lang=en)

![버전 v1.0](https://img.shields.io/badge/version-v1.0-2a78d6) ![요구사항 240개](https://img.shields.io/badge/requirements-240-2a78d6) ![언어 7개](https://img.shields.io/badge/languages-7-2a78d6) ![표준 라이선스 CC BY 4.0](https://img.shields.io/badge/standard-CC%20BY%204.0-555) ![코드 라이선스 Apache-2.0](https://img.shields.io/badge/code-Apache--2.0-555)

엔터프라이즈 에이전트 신원 및 인가 보안 기준선은 기업 환경의 AI 에이전트가 신원과 인가 측면에서 충족해야 하는 보안 요구사항을 규정합니다. 에이전트의 행위 하나하나에 깔린 기본 질문, 즉 누가 시작했는지, 누구를 대신해 실행되는지, 무엇을 할 수 있는지, 자격 증명은 어디에서 오는지, 결과를 누가 보는지, 문제가 생겼을 때 책임을 어떻게 추적하는지에 답합니다.

이 저장소에는 기준선 본문과 함께 사용하는 자가 평가 도구가 들어 있습니다. 본문은 플랫폼 구축의 설계 입력, 공급업체 평가 질문지, 보안 검토 체크리스트로 바로 사용할 수 있습니다. 자가 평가 도구는 정적 웹페이지로, 요구사항별로 평가 결과를 기록하고 성숙도 보고서와 Excel 평가표를 생성합니다. 평가 데이터는 사용자 자신의 브라우저에만 저장됩니다.

발의 및 유지보수: [Teloa AI Security](https://github.com/teloa-ai)

Teloa AI Security는 Teloa 개발 경험에서 출발한 AI 보안 연구 및 오픈 소스 프로젝트입니다. 에이전트 신원, 인가, 실행 경계와 보안 거버넌스에 집중하며, 설계 경험을 개방형 보안 기준선, 참조 아키텍처와 평가 도구로 정리합니다.

**다람쥐 Teloa가 보안 팀에 합류합니다**

| 먼저 신원을 확인하세요 | 권한은 최소한으로 | 증거를 남기세요 |
| :---: | :---: | :---: |
| <img src="03-tool/assets/brand/teloa-security.webp" width="100" alt="Teloa"> | <img src="03-tool/assets/brand/teloa-focused.png" width="100" alt="Teloa"> | <img src="03-tool/assets/brand/teloa-nailed-it.png" width="100" alt="Teloa"> |

## 배경과 목적

저자: Max Luo ([GitHub @cybermaxluo](https://github.com/cybermaxluo))

Max Luo는 [Teloa](https://github.com/teloa-ai/teloa)의 개발과 보안 설계 과정에서 이 프로젝트를 정리했습니다. AI 직원의 도구 인가, 사람의 승인, 자격 증명, 실행 격리, 협업 시 데이터 가시성 문제를 공개 명세와 결합해 기업용 에이전트 플랫폼의 검증 가능한 요구사항으로 만들었습니다. 다양한 플랫폼의 사용과 검토에 개방되어 있으며 Teloa의 특정 구현에 의존하지 않습니다.

이 기준선은 보안 설계와 평가의 목표를 설명합니다. 충족 여부는 구체적인 제품 버전, 배포 범위, 증거를 바탕으로 항목별로 판단해야 합니다. 자가 평가는 독립 인증이 아니며, OWASP, NIST, CSA 등의 자료를 인용하거나 매핑했다고 해서 해당 조직의 보증을 의미하지는 않습니다.

[설계 근거(영어)](04-design/en/design-rationale.md)는 대표적인 문제, 설계의 절충, 관련 요구사항, 검증 방법을 기준선 본문과 별도로 설명합니다.

## 개요

| 항목 | 내용 |
| --- | --- |
| 버전 | v1.0 (2026-10-07) |
| 요구사항 | 10개 장, 62개 절에 걸친 240개 요구사항이며, 각 요구사항은 개별적으로 검증할 수 있습니다 |
| 등급 | L1 기본 90개, L2 표준은 여기에 137개 추가, L3 강화는 다시 13개 추가 |
| 체계 | OWASP ASVS 5.0을 참고했으며, 요구사항 번호는 V&lt;장&gt;.&lt;절&gt;.&lt;항목&gt; 형식입니다(예: V4.2.1) |
| 매핑 | OWASP Top 10 for Agentic Applications 2026, OWASP AISVS 1.0, CSA AICM v1.1 |
| 언어 | 중국어 간체(정본), 영어, 일본어, 한국어, 독일어, 프랑스어, 스페인어 |
| 라이선스 | 본문과 문서는 CC BY 4.0, 코드는 Apache-2.0 |

## 평가 예시

아래 보고서는 도구에서 모의 데이터로 생성했으며 Teloa나 실제 플랫폼의 평가가 아닙니다. 현재 L1을 달성하고 L2를 목표로 합니다. 적용 요구사항 227개 중 180개를 충족해 약 79%이며, 미평가 10개를 포함한 47개 항목이 남아 있습니다.

![모의 평가 보고서(영어): 성숙도, 충족률, 차이, 장별 차트](02-usage/assets/maturity-report.en.png)

[예시 사용 방법(영어)](02-usage/en/usage.md#assessment-example)을 참조하거나 [예시 JSON](02-usage/examples/demo-assessment.json)을 내려받아 도구의 데이터 페이지에서 가져오십시오.

## 적용 범위

V1부터 V7까지는 에이전트의 행위 하나가 진행되는 순서를 따릅니다. V8부터 V10까지는 세션을 넘어 지속되는 데이터, 에이전트, 감사 기록을 다룹니다.

<!-- coverage:start -->
| 장 | 이름 | 답하는 질문 | L1 | L2 추가 | L3 추가 | 합계 |
| --- | --- | --- | ---: | ---: | ---: | ---: |
| V1 | 신원과 인증 | 누가 요청하는가, 어느 에이전트가 실행하는가 | 11 | 11 | 1 | 23 |
| V2 | 위임과 유효 권한 | 누구를 대리하는가, 권한 상한은 얼마인가 | 11 | 14 | 3 | 28 |
| V3 | 인가 결정 | 이번 작업을 해도 되는가, 사람의 확인이 필요한가 | 9 | 16 | 2 | 27 |
| V4 | 자격 증명과 출구 실행 | 요청은 어떻게 나가고, 자격 증명은 어떻게 주입되는가 | 14 | 18 | 1 | 33 |
| V5 | 실행 격리 | 코드, 명령, 브라우저, 확장 기능은 어떤 경계 안에서 실행되는가 | 16 | 11 | 0 | 27 |
| V6 | 컨텍스트와 신뢰할 수 없는 입력 | 읽어 들인 콘텐츠가 판단에 영향을 줄 수 있는가 | 4 | 8 | 1 | 13 |
| V7 | 출력과 가시성 | 결과를 누구에게 보여 주며, 유출될 수 있는가 | 6 | 12 | 0 | 18 |
| V8 | 데이터, 메모리 및 산출물 | 데이터를 어떻게 검색하고, 축적하고, 보존하는가 | 5 | 16 | 1 | 22 |
| V9 | 수명주기와 거버넌스 | 누가 에이전트를 관리하며, 등록에서 폐기까지 어떻게 하는가 | 9 | 16 | 1 | 26 |
| V10 | 감사, 탐지 및 대응 | 어떻게 기록하고, 발견하고, 피해를 차단하는가 | 5 | 15 | 3 | 23 |
| | **합계** | | **90** | **137** | **13** | **240** |
<!-- coverage:end -->

## 등급

등급은 누적됩니다. 어떤 등급을 달성하려면 해당 등급과 그 아래 등급의 적용 가능한 요구사항을 모두 충족해야 합니다.

- **L1 기본**: 결여될 경우 곧바로 권한 초과 접근, 자격 증명 유출 또는 책임 추적 불능이 발생합니다. 기업 내에서 사용하는 모든 에이전트 플랫폼이 충족해야 합니다.
- **L2 표준**: 주류 기업 보안 검토에서 요구하는 역량으로, 내부 데이터를 처리하고 여러 업무 시스템에 연결하는 플랫폼에 적용됩니다.
- **L3 강화**: 심층 방어와 정교한 거버넌스로, 금융, 의료, 중요 인프라 등 고규제 산업 또는 고민감 데이터를 처리하는 플랫폼에 적용됩니다.

플랫폼에 어떤 기능이 없는 경우(예: MCP를 지원하지 않는 경우) 해당 절 전체를 적용 제외로 표시하고 적합률 계산에서 제외합니다. 판정 규칙은 본문 6장에 있습니다.

## 빠른 시작

- **기준선 읽기**: [01-standard/ko/baseline-v1.0.md](01-standard/ko/baseline-v1.0.md)
- **온라인 평가**: 이 저장소에서 게시한 [GitHub Pages](https://security.teloa.ai/agent-baseline-assessor/?lang=ko) 사이트를 엽니다. 오른쪽 위에서 언어를 바꿀 수 있습니다.
- **오프라인 평가**: 저장소를 내려받아 `03-tool/index.html`을 엽니다. 온라인 버전과 기능이 같으며 네트워크 연결이 필요하지 않습니다.
- **Excel 사용**: [`03-tool/offline/baseline-assessment.xlsx`](03-tool/offline/baseline-assessment.xlsx)(영어)를 작성하거나, 도구의 **데이터** 페이지에서 '빈 평가표 다운로드'를 눌러 한국어 빈 평가표를 내려받습니다. 평가표에는 요약 수식과 격차 목록이 포함되어 있으며, 작성 후 도구로 다시 가져올 수 있습니다.
- **사내(프라이빗) 배포**: 도구는 정적 파일로만 구성되며, 보안을 강화한 nginx 설정과 Dockerfile이 함께 제공됩니다. 자세한 내용은 [사용 방법](02-usage/ko/usage.md)을 참고하십시오.

## 저장소 구조

```
01-standard/<언어>/baseline-v1.0.md   기준선 본문
01-standard/diagrams/                 7개 언어의 아키텍처 그림: PNG, SVG, Mermaid
02-usage/<언어>/usage.md              사용 방법: 평가 절차, 채점 규칙, 배포, 데이터 저장
02-usage/examples/, assets/           모의 평가 데이터 및 보고서 이미지
03-tool/                              자가 평가 도구: 페이지, 데이터, Excel 템플릿, 스크립트, 배포 설정
03-tool/docs/<언어>.md                도구 유지보수 안내
04-design/zh-CN/, en/                 중국어 및 영어 설계 근거
01-standard/diagrams/index.html      에이전트 보안 기준 아키텍처
.github/                              GitHub Pages 워크플로, 이슈 및 풀 리퀘스트 템플릿
```

## 문서

| 문서 | 내용 |
| --- | --- |
| [기준선 본문](01-standard/ko/baseline-v1.0.md) | 범위, 용어, 참조 아키텍처, 위협 모델, 등급 규칙, 240개 요구사항, 매핑 부록 |
| [사용 방법](02-usage/ko/usage.md) | 온라인, 오프라인, 사내 배포의 세 가지 사용 방식, 채점 규칙, GitHub Pages 또는 Cloudflare Pages 게시 |
| [도구 설명](03-tool/docs/ko.md) | 디렉터리 구조, 주요 명령, 기준선 개정 후 도구 업데이트 절차, 번역 유지보수 |
| [설계 근거(영어)](04-design/en/design-rationale.md) | Teloa 개발의 보안 문제, 설계 절충, 요구사항 매핑과 검증 방법 |
| [에이전트 보안 기준 아키텍처](https://security.teloa.ai/agent-baseline-assessor/01-standard/diagrams/?lang=ko) | 기술 스택 · 플랫폼 참조 아키텍처 · PNG / SVG / Mermaid |
| [용어집](03-tool/i18n/glossary.md) | 7개 언어의 용어 대조 |
| [변경 이력](CHANGELOG.md) | 버전별 변경 사항(중국어·영어) |

기준선 본문은 중국어판을 정본으로 하며, 다른 언어판은 번역본입니다. 아직 각 언어 원어민 분야 전문가의 전체 검토를 거치지 않았으므로, 오류를 발견하면 알려 주십시오.

## 기여하기

요구사항, 번역, 도구에 대한 의견을 환영합니다. 먼저 [기여 가이드](CONTRIBUTING.md)(중국어·영어)를 읽어 주십시오. 요구사항 변경을 제안할 때는 대응하는 위협과 검증 방법을 밝혀야 하고, 번역 변경은 용어집을 따르며, 도구 변경은 자체 테스트를 통과해야 합니다.

프로젝트에 참여하면 [행동 강령](CODE_OF_CONDUCT.md)을 준수하는 데 동의하는 것으로 간주합니다.

## 보안

도구의 보안 취약점은 [보안 정책](SECURITY.md)(중국어·영어)에 따라 비공개로 보고하십시오. 공개 이슈로 등록하지 마십시오. 요구사항 자체에 대한 의견은 일반 이슈로 등록할 수 있습니다.

## 인용

인용할 때는 버전을 밝혀 주십시오. 예:

> Max Luo. 엔터프라이즈 에이전트 신원 및 인가 보안 기준선 (Enterprise Agent Identity and Authorization Security Baseline), v1.0, 2026.

특정 요구사항을 인용할 때는 번호와 버전을 함께 적습니다(예: "V4.2.1 (v1.0)"). 기계 판독 가능한 인용 메타데이터는 [CITATION.cff](CITATION.cff)에 있습니다.

## 라이선스

- 기준선 본문, 사용 방법 및 기타 문서: [CC BY 4.0](LICENSE-DOCS). 출처를 표시하고 변경 여부를 밝히면 복제, 개작, 상업적 이용이 가능합니다.
- 자가 평가 도구 코드: [Apache License 2.0](LICENSE).
- 서드파티 구성 요소: ExcelJS 4.4.0(MIT), IBM Plex 글꼴(SIL OFL 1.1). 라이선스 전문은 `03-tool/vendor/`에 포함되어 있습니다.
- Teloa 브랜드와 다람쥐 소재: [브랜드 소재 안내](03-tool/assets/brand/README.md)를 참조하세요. 브랜드 사용권은 별도로 유보됩니다.
