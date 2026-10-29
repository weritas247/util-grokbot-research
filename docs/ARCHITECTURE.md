# util-grokbot-research — 정보 구조(IA) 설계

그록봇(Grok Bot) 리서치 결과를 읽기 좋게 보여주는 정적 웹사이트. 모든 내용은 `data/*.json`에 있고,
화면은 JSON을 읽어 자동으로 그린다. 새 조사는 JSON에 항목을 **추가만** 하면 사이트에 반영된다.

원본 리서치: `docs/source-research-2026-10-29.tsx` (Grok Bot Page 원문). 사실·수치·링크는 여기 있는 것만 쓴다. 지어내지 않는다.

## 1. 사이트 맵 (한 페이지, 섹션 앵커 + 해시 라우팅)

| # | 섹션 (id) | 목적 | 데이터 |
|---|---|---|---|
| 0 | 상단 고정 내비 | 로고 "그록봇 리서치", 섹션 링크, 전체 검색창, 다크/라이트 토글 | — |
| 1 | 홈 `#home` | 한눈에 요약(핵심 포인트 카드), 최근 소식(최신 업데이트 3~5개), 통계(업데이트/사례/팁/주의/출처 개수), 마지막 갱신일 | `meta.json`, `summary.json`, `updates.json` |
| 2 | 업데이트 타임라인 `#updates` | 최신순 세로 타임라인. 월 필터, 종류 필터(릴리스 노트/공식 X 게시물/블로그/요금제), 버전 배지(v0.78.1 등) | `updates.json` |
| 3 | 사용 사례 `#usecases` | 카드 그리드. 카테고리 태그 필터(공식, 게임 개발, 영업, 지원, 개발자, 크리에이터, 모니터링, 국내 리뷰 등) | `usecases.json` |
| 4 | 실전 팁 `#tips` | 번호 붙은 팁 카드(제목 + 설명 + 출처) | `tips.json` |
| 5 | 주의할 점 `#caveats` | 경고 톤 리스트. 심각도(높음/보통/참고) 배지, 출처 수준 안내 박스 | `caveats.json` |
| 6 | 맞춤 추천 `#recommendations` | Matthew님 환경 기준 추천 단계 + 인용구 | `recommendations.json` |
| 7 | 출처 `#sources` | 사이트·종류별 링크 카드 목록(제목, 사이트, 날짜) | `sources.json` |
| 8 | 푸터 | 데이터 갱신일, 항목 추가 방법 안내(README 링크) | `meta.json` |

## 2. 데이터 모델

공통 필드 (모든 항목):

```json
{
  "id": "kebab-case-고유값",
  "date": "YYYY-MM-DD",            // 사건/게시 날짜 (정확도 낮으면 date_label 추가)
  "date_label": "10/12~10/18",     // 선택. 원문 표기 그대로 보여줄 때
  "title": "제목",
  "summary": "본문 1~3문장 (원문 사실만)",
  "tags": ["태그"],
  "sources": [{ "title": "표시 이름", "url": "https://..." }],
  "added_at": "YYYY-MM-DD"         // 이 항목을 데이터에 넣은 날
}
```

파일별 추가 필드:

- `updates.json`: `version`(예 "v0.78.1", 없으면 null), `kind`("release-note" | "official-post" | "blog" | "plan"), `time_kst`(선택, "02:17").
- `usecases.json`: `actor`(예 "1인 게임 스튜디오"), `category`(대표 카테고리 1개), `metrics`(선택, 원문 수치 문자열 배열).
- `tips.json`: `order`(정렬 번호).
- `caveats.json`: `severity`("high" | "medium" | "info").
- `recommendations.json`: `order`; 최상위는 `{ "context": "...", "items": [...], "quote": { "text", "cite" } }`.
- `sources.json`: `site`, `url`, `type`("official-changelog" | "official-news" | "official-docs" | "official-x" | "community" | "blog" | "review"). (title/date/added_at 공통)
- `summary.json`: 한눈에 요약 항목 배열(공통 필드).
- `meta.json`: `{ "title", "research_date", "last_updated", "notes": [...], "files": [...] }` — `files`는 앱이 불러올 데이터 파일 목록.

URL 규칙: 원문 출처가 `x.ai/changelog/bot` 처럼 축약돼 있으면 `https://` 를 붙인 전체 URL로 쓴다. 원문 출처 목록에 있는 전체 URL을 우선한다.

## 3. 화면 원칙 (가독성)

- 한국어 UI, Pretendard(CDN) 기본, 본문 16~17px, 줄간격 1.7, 본문 최대 폭 ~72ch.
- 계층: 섹션 제목(H2) > 카드 제목 > 본문 > 메타(날짜·태그·출처)를 크기·굵기·색으로 명확히 구분.
- 다크/라이트: `prefers-color-scheme` 따르고 토글로 덮어쓰기(localStorage 저장). 대비 WCAG AA.
- 반응형: 390px 모바일에서 내비는 가로 스크롤 칩, 카드 1열. 데스크톱 1280px에서 카드 2~3열.
- 고정 상단 내비 + 현재 섹션 하이라이트.
- 검색: 모든 데이터 파일의 title/summary/tags/actor를 대상으로 하는 실시간 검색. 결과는 섹션별로 묶어 보여주고 클릭하면 해당 항목으로 스크롤·하이라이트.
- 태그 필터: 섹션별 칩. 여러 개 선택 가능, "전체"로 초기화.
- 모든 항목에 출처 링크(새 탭, `rel="noopener"`) 표시.
- `added_at`이 `baseline_added_at`보다 이후이고 `meta.last_updated` 기준 7일 이내인 항목에만 "NEW" 배지를 표시한다.

## 4. 기술

- 순수 HTML/CSS/JS(ES modules), 외부 의존성 없음(폰트 CDN만). 빌드 단계 없음.
- `fetch('data/*.json')` 로 로드 → 정적 서버 필요(`python3 -m http.server`).
- `scripts/validate.mjs`(Node, 의존성 없음): 모든 JSON 필수 필드·날짜 형식·URL 형식·id 중복 검사.
- `scripts/screenshot.py`(선택, Playwright): 1280/390 스크린샷 생성 → `docs/screenshots/`.

## 5. 새 조사 추가 흐름

1. 해당 `data/*.json` 배열에 항목을 추가(`added_at` = 오늘).
2. 새 출처면 `sources.json`에도 추가.
3. `meta.json`의 `last_updated` 갱신.
4. `node scripts/validate.mjs` 통과 확인 → 커밋.
