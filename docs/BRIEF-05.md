# Codex 작업 지시 #5 — 포맷 전용 (동작 변경 금지)

대상: assets/js/data.js, assets/js/main.js, assets/js/search.js, assets/js/render/common.js, assets/js/render/home.js,
assets/js/render/sections.js, assets/js/render/updates.js, scripts/validate.mjs, index.html.

각 파일을 **한 번에 하나씩**, 파일 전체를 새로 써서(heredoc 또는 apply_patch로 전체 교체) 다음 스타일로 바꿔:
- 2칸 들여쓰기, 한 줄에 한 문장, 세미콜론 사용, 줄 길이 100자 이하(URL 문자열 제외).
- if/for 본문은 항상 중괄호 + 줄바꿈.
- 화살표 함수가 길면 일반 함수로 분리.
- HTML 템플릿 리터럴은 여러 줄로 들여쓰기.
- export 함수마다 한 줄 JSDoc(`/** 설명 */`).
- index.html의 nav 링크, 버튼 등은 요소당 한 줄.
로직·클래스명·DOM 구조·출력 HTML은 바꾸지 마.

각 파일을 바꾼 뒤 바로 `node --check <파일>` (index.html 제외) 실행. 전부 끝나면
`awk 'length>120' assets/js/*.js assets/js/render/*.js scripts/validate.mjs index.html | grep -v https | wc -l` 결과가 0인지 확인하고,
`node scripts/validate.mjs` 통과 확인. 커밋 금지. 마지막 메시지에 파일별 줄 수.
