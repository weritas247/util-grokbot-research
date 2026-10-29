# Codex 작업 지시 #3 — 리뷰 2차 마무리 수정

포트 18791 기준 스크린샷 리뷰 결과. 아래만 고쳐(다른 부분은 유지).

1. **번호 버그**: "한눈에 요약" 카드 번호가 전부 "00"으로 나옴 → 01~07. 섹션 머리말 번호도 "00 · LATEST", "00 · SUMMARY"가 겹침 → 홈 블록(최근 소식·한눈에 요약)은 번호 없이 "LATEST", "SUMMARY"로, 나머지는 01 UPDATES, 02 USE CASES, 03 TIPS, 04 CAVEATS, 05 FOR MATTHEW, 06 SOURCES로 일관되게.
2. **caveats.json 제목**이 "주의할 점 5" 같은 일련번호 → 원문 문장의 핵심을 줄인 짧은 한국어 제목으로(예: "모든 봇이 컴퓨터 한 대를 공유", "Test도 실제 작업", "루틴 사용량 빨리 닳음", "루틴 실행 한도 300회/200회", "무인 작업 승인은 약 30분 뒤 만료", "모델 선택·표시 불가", "한국 사이트 클라우드 IP 차단", "연결 안 된 걸 장애로 오보고", "봇이 늘면 루틴이 겹침", "Teach a task 제한"). 본문은 원문 유지. 새 사실 금지.
3. updates.json의 "Shared Bots for sales" 헤드라인은 영어 → "영업 운영팀의 Shared Bots 소개". 다른 헤드라인 중 영어만 있는 것도 원문 한국어 표현으로.
4. **한국어 줄바꿈**: 전역 `word-break: keep-all; overflow-wrap: anywhere;` (한글이 '사/례'처럼 음절 중간에서 끊김). 히어로 제목은 1280에서 두 줄 이하로 균형 있게(text-wrap: balance).
5. 좁은 카드에서 "출처" 라벨이 "출/처"로 세로로 쪼개짐 → 라벨 `white-space: nowrap; flex-shrink:0`, 링크 텍스트만 줄바꿈.
6. **고정 헤더 위 12px 틈**: #sources 같은 해시로 열면 헤더가 화면 맨 위에서 12px 떨어져 보이고 그 위로 내용이 비침 → 헤더 top:0, 위쪽 요소/여백 제거. 해시 이동은 렌더+폰트 로드(document.fonts.ready) 후 수행해서 섹션 제목이 헤더 바로 아래에 오게.
7. 검색창: 네이티브 search input의 ×(webkit-search-cancel-button)와 닫기 버튼이 둘 다 보임 → 네이티브 × 숨김. 모바일 결과에서 섹션 배지가 가로 전체로 늘어남 → inline-flex, 내용 너비만.
8. scripts/screenshot.py: full-page 3장(desktop, mobile, desktop-dark) 외에 첫 화면 뷰포트 샷 desktop-top.png(1280x800), mobile-top.png(390x844 @2x), desktop-dark-top.png도 저장. 다크 샷은 color_scheme='dark'로 열고 localStorage 테마 덮어쓰기가 없도록 새 컨텍스트 사용. pageerror·console error·requestfailed를 모아 있으면 exit 1.
9. README 스크린샷은 docs/screenshots/desktop-top.png, mobile-top.png, desktop-dark-top.png를 쓰고, 전체 페이지 샷은 링크로.

마무리: `node scripts/validate.mjs` 통과, 커밋·배포 금지. 마지막 메시지에 번호별 처리 결과.
