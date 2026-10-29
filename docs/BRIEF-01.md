# Codex 작업 지시 #1 — 사이트 전체 구현

작업 폴더: /workspace/util-grokbot-research (git 저장소). 먼저 `docs/ARCHITECTURE.md`를 읽고 그대로 구현해.

## A. 데이터 파일 생성 (data/*.json)
- 원본: `docs/source-research-2026-10-29.tsx`. 여기 있는 내용 **전부**를 ARCHITECTURE.md의 데이터 모델로 옮겨. 빠뜨리지 말 것:
  - 한눈에 요약 7개 → summary.json
  - 타임라인 20행 → updates.json (version은 "v0.78.1"처럼 원문에 있을 때만, 없으면 null. "10/27 (노트)"는 kind=release-note. "x.com/bot/status/..." 출처면 official-post, KST 시각은 time_kst에. "10/12~10/18"은 date="2026-10-12", date_label 유지. "8/11 (미국)"은 date_label "8/11 (미국)". 연도는 모두 2026)
  - 사용 사례 8개 → usecases.json (metrics는 원문 수치만: 예 "GitHub 이슈 8개", "머지까지 약 19시간", "티켓 204건 약 10분", "10만 달러 이상 절감")
  - 실전 팁 8개 → tips.json
  - 주의할 점 10개 → caveats.json (+ "출처 수준" Callout은 meta.json notes에)
  - Matthew님 추천 7단계 + caption(context) + Arda 인용구 → recommendations.json
  - 출처 24개 → sources.json
- 한국어 문장은 원문 그대로 사용. 사실·수치·URL을 새로 만들지 마. 출처 URL은 원문 출처 목록의 전체 URL을 매칭해서 쓰고, 목록에 없는 축약 출처(예 "x.com/bot/status/2115130760009273501")는 https:// 붙여서 사용.
- 팁/주의/추천 항목의 출처: 본문에 언급된 출처(공식 문서, @Michael_Fenech_, @XFreeze, Routines 도움말, Arda, FAQ, changelog 등)를 sources.json의 URL과 연결. 명시된 출처가 없으면 가장 관련된 원문 출처를 추측하지 말고 changelog/문서 중 본문이 직접 가리키는 것만 쓰고, 정말 없으면 원본 리서치 Page(https://cursor.com/canvas/store-b9ca17ff-740e-44e5-9405-df8c8856d507/8b3edaec-0a7c-4dcd-a8a8-bac78cf54d7b, title "원본 리서치 Page")로 연결.
- date는 해당 사건/게시 날짜, added_at은 모두 "2026-10-29". meta.json last_updated "2026-10-29".
- 태그는 일관된 한국어 짧은 단어로(예: Pages, 영상, Vault, 보안, 루틴, 요금제, GitHub, 커넥터, 모바일, 음성, 이메일, 쇼핑, 사용량, 게임 개발, 영업, 지원, 개발자, 크리에이터, 모니터링, 국내).

## B. 사이트 코드
- index.html, assets/styles.css, assets/app.js(ES module, 필요하면 assets/ 아래 모듈 분리). 의존성 없음, Pretendard CDN(https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css).
- ARCHITECTURE.md 3장(화면 원칙) 전부 구현: 고정 내비 + 현재 섹션 하이라이트, 전역 검색(섹션별 결과 묶음, 클릭 시 항목 스크롤+하이라이트, Esc/× 로 닫기, "/" 단축키), 섹션별 태그 필터 칩(다중 선택), 타임라인 월 필터 + 종류 필터, 다크/라이트(시스템 기본 + 토글 저장), NEW 배지, 모든 항목 출처 링크.
- 디자인: 깔끔하고 현대적인 편집형 레이아웃. 중립 배경 + 강조색 하나(예: 인디고/바이올렛 계열). 카드 여백 넉넉히, 둥근 모서리 12~16px, 미묘한 테두리. 홈 상단 히어로: 제목, 한 줄 설명(meta에서), 통계 숫자 5개, 마지막 갱신일. 요약 카드 7개는 번호 붙은 그리드.
- 타임라인: 왼쪽 날짜 컬럼(모바일에선 위로), 버전 배지, 종류 배지, 세로 선.
- 주의할 점: severity 색 구분(high=빨강톤, medium=주황톤, info=파랑톤) — 색만으로 구분하지 말고 텍스트 배지도.
- 출처: type별 그룹, 카드에 사이트·날짜.
- 접근성: 시맨틱 태그, 포커스 표시, 버튼 aria-label, prefers-reduced-motion 존중.
- 데이터 로드 실패 시 화면에 오류 메시지 표시(콘솔 에러만 나고 빈 화면 되지 않게).
- 콘솔 에러/경고 0개 목표. favicon(인라인 SVG data URI)도 넣어 404 방지.

## C. 스크립트
- scripts/validate.mjs: ARCHITECTURE.md 2장 규칙 검사(필수 필드, YYYY-MM-DD, https URL, id 중복, tags 배열). 통과 시 항목 개수 출력. 실패 시 exit 1.
- scripts/screenshot.py: Playwright(python, 이미 설치됨)로 http://localhost:8765 를 1280x800(full page)과 390x844(full page, device_scale_factor 2) 촬영 → docs/screenshots/desktop.png, mobile.png, 추가로 desktop-dark.png. 콘솔 에러를 수집해 출력.

## D. README.md (한국어)
- 프로젝트 소개, 스크린샷(docs/screenshots/desktop.png, mobile.png 이미지 링크), 실행법(`python3 -m http.server 8765`), 폴더 구조, **새 조사 추가 방법**(파일별 예시 JSON 1개씩, added_at 규칙, validate 실행), 데이터 원칙(지어내지 않기, 출처 필수).

## 제약
- git commit 하지 마(감독자가 리뷰 후 커밋). GitHub 저장소 만들거나 배포하지 마.
- 끝나면 `node scripts/validate.mjs` 실행해서 통과 확인하고, 만든 파일 목록과 각 json 항목 수를 마지막 메시지에 적어.
