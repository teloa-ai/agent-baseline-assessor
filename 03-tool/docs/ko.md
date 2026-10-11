# 03 도구 설명

이 문서는 유지보수 담당자를 대상으로 하며, 저장소 구조, 각 스크립트의 역할, 기준선 개정 후 데이터를 갱신하는 방법, 의존하는 제3자 구성 요소를 설명합니다. 사용 방법은 [02 사용 방법](../../02-usage/ko/usage.md)을 참고하십시오.

## 1. 디렉터리 구조

도구의 루트 디렉터리는 `03-tool/`이며, 아래의 경로와 명령은 모두 이 디렉터리를 기준으로 합니다.

```
index.html               페이지 진입점
assets/
  app.js                 화면과 상호작용
  i18n.js                다국어: 언어 감지, 전환, 번역 조회(페이지와 Node 공용)
  score.js               채점 규칙(페이지와 Node 공용)
  charts.js              레이더 차트, 격차 차트, 분포 차트(순수 SVG)
  workbook.js            Excel 생성과 읽기(페이지와 Node 공용)
  styles.css
data/
  baseline.json          기준선 데이터: 장, 절, 요구사항, 등급, 적용 컴포넌트, 체크포인트
  baseline.js            같은 데이터. 오프라인에서 더블클릭으로 열 때 사용
  i18n.<언어>.js          i18n/<언어>.json에서 생성한 사전. 페이지가 불러옴
i18n/
  <언어>.json             언어별 사전: 중국어 원문 → 번역문
  glossary.md            7개 언어 용어 대조표
  source-baseline.json   기준선 데이터에서 번역이 필요한 중국어 문자열 목록
vendor/exceljs.min.js    ExcelJS 4.4.0(MIT). Excel 가져오기·내보내기 때만 불러옴
vendor/fonts/            IBM Plex 라틴 문자 서브셋(OFL). 로컬에서 불러오며 외부에 연결하지 않음
offline/                 오프라인 Excel 평가표(중국어판)
tools/                   데이터·사전·평가표 생성 스크립트, 자체 점검, Excel 수식 교차 검증
deploy/                  nginx 설정과 Dockerfile
docs/                 이 문서의 언어별 버전
_headers                 Cloudflare Pages용 보안 응답 헤더
```

## 2. 자주 쓰는 명령

| 명령 | 역할 |
| --- | --- |
| `npm install` | 의존성 설치(ExcelJS, Excel 생성과 검증에만 사용) |
| `npm run build:xlsx` | `offline/` 아래 오프라인 평가표를 다시 생성 |
| `npm run build:i18n` | `i18n/*.json`에서 `data/i18n.*.js`를 다시 생성. 사전을 수정한 뒤 실행 |
| `npm test` | 채점 규칙과 Excel 읽기/쓰기 왕복 일치를 확인하고, 언어별 사전이 화면과 기준선 문자열을 모두 포함하는지 점검 |
| `npm run check:xlsx` | 로컬에 설치된 LibreOffice로 내보낸 Excel의 수식을 독립적으로 재계산하고, 웹 채점 결과와 셀 단위로 비교(LibreOffice 필요) |

## 3. 기준선 업데이트

기준선 문서가 개정되면 다음 세 단계로 업데이트합니다.

1. 기준선 문서에서 Markdown을 내보낸 뒤 `python3 tools/build_data.py <내보낸 파일> --version 1.1 --date 2026-12-01`을 실행하여 `data/baseline.json`과 `data/baseline.js`를 다시 생성합니다. 스크립트는 번호 중복, 번호 순서, 선택되지 않은 등급, 등급 누적 위반, 적용 컴포넌트 누락 등을 검사합니다. 기준선 6.4에 따라 삭제된 번호는 재사용하지 않으므로 번호 건너뛰기는 허용됩니다. 또한 수작업으로 작성한 컴포넌트 신뢰 가정과 체크포인트를 문서 4.2, 4.3과 대조하여 불일치가 있으면 알려 줍니다.
2. 요구사항을 추가하거나 조정했다면 `tools/component_map.py`에서 각 절의 적용 컴포넌트도 함께 수정합니다(절 내 순서대로 하나씩 대응).
3. `npm install`과 `npm run build:xlsx`를 실행하여 오프라인 평가표를 다시 생성한 뒤, `npm test`로 자체 점검을 수행합니다.

기존 평가 JSON은 번호에 따라 새 버전에 매칭됩니다. 기준선에 없는 번호는 가져올 때 무시되며 안내 메시지가 표시됩니다.

또한 저장소의 `01-standard/` 아래 본문을 새 버전으로 교체하고, README의 버전 번호도 갱신하십시오.

## 4. 다국어

화면 문자열은 중국어 원문을 키로 사용하며, 언어별 번역은 `i18n/<언어>.json`에 둡니다. 번역이 없으면 중국어가 표시됩니다. 현재 지원 언어는 zh-CN, en, ja, ko, de, fr, es입니다.

- **번역 수정**: `i18n/<언어>.json`을 편집하고 `npm run build:i18n`으로 `data/i18n.<언어>.js`를 다시 생성한 뒤 `npm test`를 실행합니다.
- **화면 문자열이나 기준선 조항이 바뀐 경우**: `npm test`를 실행하면 언어별로 누락된 중국어 문자열 목록이 표시됩니다. 보완한 뒤 사전을 다시 생성합니다. 용어는 `i18n/glossary.md`를 따릅니다. 기준선을 개정하면 `01-standard/` 아래 언어별 번역본도 함께 갱신합니다.
- **언어 추가**: `assets/i18n.js`의 `LOCALES`에 언어 코드와 이름을 등록하고, `i18n/<언어>.json`을 만든 뒤 `index.html`에 `data/i18n.<언어>.js`를 추가합니다. 그다음 위 항목에 따라 번역을 보완합니다. 기준선 본문, 사용 방법, 이 문서의 번역본은 각각 `01-standard/<언어>/`, `02-usage/<언어>/`, `docs/<언어>.md`에 둡니다.

## 5. 제3자 구성 요소

- [ExcelJS](https://github.com/exceljs/exceljs) 4.4.0, MIT 라이선스. 라이선스 전문은 `vendor/exceljs.LICENSE`에 있습니다.
- [IBM Plex Sans / Mono](https://github.com/IBM/plex) 라틴 문자 서브셋, SIL Open Font License 1.1. 라이선스 전문은 `vendor/fonts/OFL.txt`에 있습니다. 중국어 텍스트는 시스템 글꼴(PingFang, Microsoft YaHei 또는 Noto Sans CJK)을 사용합니다.
