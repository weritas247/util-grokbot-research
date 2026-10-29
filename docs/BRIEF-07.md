# Codex 작업 지시 #7 — 항목별 "자세히 보기" (details)

사용자 피드백: 카드가 한 줄 요약뿐이라 원문(블로그/변경 기록/X 게시물)을 직접 열어야 함. 각 항목에 원문을 자세히 정리한 `details`를 넣고, 화면에서 펼쳐 읽게 한다. 데이터(JSON 내용)는 리서처가 채운다. 너는 코드만 맡는다. 데이터 파일 내용은 바꾸지 마(테스트용 임시 데이터는 커밋 전 원복하거나 별도 fixture 파일로).

## 1. 데이터 스키마 (updates/usecases/tips/caveats/recommendations.items 공통)

```json
"details": [
  { "heading": "무엇이 바뀌었나", "body": "문단 텍스트(선택)", "bullets": ["항목", "항목"] },
  { "heading": "왜 중요한가", "body": "..." }
],
"details_note": "선택. 예: '원문 X 게시물을 열 수 없어 요약만 확인됨'"
```
- 섹션마다 `heading` 필수, `body`(string)와 `bullets`(string[]) 중 하나 이상 필수. 둘 다 있으면 body 다음 bullets.
- 문자열 안 `**굵게**` 만 지원(그 외 마크다운 없음). HTML은 항상 이스케이프한 뒤 `**..**`만 <strong>으로 변환.
- bullets 항목이 `"라벨: 설명"` 형태면 라벨 부분을 굵게 표시해도 좋다(선택).

## 2. 화면
- 모든 카드(타임라인 카드, 사례 카드, 팁, 주의, 추천 단계)에 요약 아래 "자세히 보기" 토글 버튼. `<details>/<summary>` 또는 aria-expanded 버튼 — 접근성 지켜. 버튼에 섹션 수/분량 힌트(예: "자세히 보기 · 4개 섹션")가 있으면 좋다.
- 펼치면 카드 안에서 본문이 펼쳐지되, 그리드 카드가 옆 카드와 높이 어긋나 읽기 불편하면 디자인 판단으로 해결(예: 펼친 카드는 grid-column: 1 / -1 로 전체 폭 사용). 타임라인은 카드 안에서 펼침.
- 타이포: 소제목(h4) 굵게·약간 큰 크기·위 여백, 본문 16px/1.75, 최대 폭 ~70ch, 불릿 간격 넉넉히, 섹션 사이 구분(여백 또는 얇은 선). 라이트/다크 모두 대비 AA. 390px 모바일에서 가로 넘침 없음.
- `details_note`가 있으면 펼친 영역 맨 위에 작은 안내 박스(참고 톤).
- 딥 링크: 각 항목 id 해시(`#update-01`)로 접속하거나 링크를 열면 해당 항목으로 스크롤 + 자동 펼침 + 잠깐 하이라이트. 펼친 영역에 "이 항목 링크 복사" 버튼(clipboard API, 실패 시 조용히 무시). 기존 해시 라우팅/섹션 하이라이트와 충돌하지 않게.
- 업데이트 타임라인의 "최신 8개만 표시" 상태에서 숨겨진 항목으로 딥 링크/검색 결과 이동 시 그 항목이 보이게(필요하면 전체 펼침).
- 필터로 숨겨진 항목으로 이동할 때도 보이게 처리(필터 초기화 등 합리적 방식).
- 검색: title/summary/tags/actor + details(heading, body, bullets) 텍스트도 대상. details에서만 맞으면 결과 스니펫은 일치한 details 문장 주변을 보여주고 하이라이트. 결과 클릭 시 해당 항목 펼침.
- 상단/홈의 "최근 소식" 같은 요약 목록은 기존대로 두고, 클릭 시 해당 항목 펼침이면 충분.

## 3. 검증 스크립트 scripts/validate.mjs
- updates, usecases, tips, caveats, recommendations.items 의 모든 항목에 `details` 필수: 비어 있지 않은 배열, 각 섹션 heading(비지 않은 string) + body(비지 않은 string) 또는 bullets(비지 않은 string 배열) 중 하나 이상. 다른 키 금지(heading/body/bullets만).
- details 전체 글자 수 합계가 200자 미만이면 오류("details가 너무 짧음").
- `details_note`는 있으면 string.
- summary.json·sources.json은 details 불필요.
- 지금 데이터에는 details가 아직 없어 검증이 실패하는 게 정상이다. 너는 fixture(예: /tmp 사본에 details 넣은 데이터)로 검증 로직과 렌더링을 테스트해. validate.mjs가 `--dir <path>` 옵션으로 다른 data 폴더를 검사할 수 있게 해주면 좋다.

## 4. 스크린샷 스크립트 scripts/screenshot.py
- 기존 시나리오 유지 + 추가: `desktop-expanded`(1280×800, light): `#update-01`로 접속해 펼친 상태 뷰포트 캡처, `mobile-expanded`(390×844, scale 2, light): 같은 방식. `desktop-expanded-dark`도. 콘솔 오류/요청 실패 시 exit 1 (기존 동작 유지).
- `--item <id>` 옵션으로 펼칠 항목 바꿀 수 있게.

## 5. 문서
- README "새 조사 추가 방법": 모든 새 항목은 `details` 필수, 스키마 예시(JSON), 쓰는 원칙(원문 사실만, 원문을 안 열어도 되게 자세히: 무엇이 바뀌었나/무엇인가 → 왜 중요한가 → 어떻게 쓰나 → 제한·주의, 릴리스 노트는 해당 버전 모든 항목, 원문을 못 읽었으면 details_note에 명시). 스크린샷 섹션에 펼친 화면(desktop-expanded-top 등) 추가.
- docs/ARCHITECTURE.md 데이터 모델·추가 흐름에 같은 내용 반영. 검색 대상에 details 포함 명시.

## 규칙
- 기존 코드 스타일(ES modules, 외부 의존성 없음, 함수 JSDoc 한 줄) 유지. `node --check`로 모든 js 확인.
- 커밋 금지. 마지막 메시지에 변경 파일 목록과 테스트 방법.
