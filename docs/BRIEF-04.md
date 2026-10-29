# Codex 작업 지시 #4 — 코드 가독성 + 작은 데이터 수정

1. assets/js/*.js, assets/js/render/*.js, index.html이 아직 200자 넘는 줄이 30개(한 줄에 함수 여러 개). **동작은 바꾸지 말고** 사람이 읽기 좋게 다시 포맷: 2칸 들여쓰기, 문장마다 줄바꿈, 함수마다 짧은 JSDoc 한 줄, 템플릿 리터럴은 여러 줄 HTML로. 모든 줄 120자 이하(긴 URL 문자열 제외). 원본 리서치 Page URL 같은 상수는 meta.json(`source_page_url`)으로 옮겨 data에서 읽기.
2. sources.json에서 원문에 날짜가 없는 출처(SpaceXSI News, Grok Bot FAQ, Work with Grok Bot, Routines 도움말, Plans and billing 등 원문 LinkCards에 date가 없는 것)는 date를 지어내지 말고 `"date": null`로 두고 화면에서도 날짜를 표시하지 마. validate.mjs는 sources에 한해 date null 허용. 원문 date가 "2026-10-28 KST"/"2026-08" 같은 경우 date는 YYYY-MM-DD(월만 있으면 date_label "2026-08"로 원문 유지, date는 null)로.
3. 해시 딥링크: 로드 시에는 smooth가 아닌 즉시 스크롤(behavior:'instant')로.
4. 끝나면 `node scripts/validate.mjs` 와 `node --check`로 모든 js 문법 검사. 커밋·배포 금지. 마지막 메시지에 결과.
