export const names = [
  'summary',
  'updates',
  'usecases',
  'tips',
  'caveats',
  'recommendations',
  'sources',
];

/** JSON 데이터 파일을 불러옵니다. */
export async function loadData() {
  const files = await Promise.all(
    ['meta', ...names].map(async function (name) {
      const response = await fetch(`data/${name}.json`);
      if (!response.ok) {
        throw new Error(`${name}.json 로드 실패 (${response.status})`);
      }
      return response.json();
    }),
  );
  return Object.fromEntries(
    ['meta', ...names].map((name, index) => [name, files[index]]),
  );
}

export const esc = value =>
  String(value ?? '').replace(/[&<>"']/g, char =>
    ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;',
    })[char],
  );

export const kindLabels = {
  'release-note': '릴리스 노트',
  'official-post': '공식 X 게시물',
  blog: '블로그',
  plan: '요금제',
};

/** 항목이 최근 7일 이내 추가되었는지 확인합니다. */
export function isNew(item, meta) {
  return (
    item.added_at > meta.baseline_added_at &&
    item.added_at <= meta.last_updated &&
    (Date.parse(meta.last_updated) - Date.parse(item.added_at)) / 86400000 <= 7
  );
}

/** 항목의 출처 링크 HTML을 반환합니다. */
export function sourceLinks(item) {
  return (item.sources || [])
    .map(
      source =>
        `<a class="source-link" href="${esc(source.url)}" target="_blank" rel="noopener"><span>출처</span> ${esc(source.title)} <svg aria-hidden="true" viewBox="0 0 16 16"><path d="M6 3H3v10h10v-3M8 2h6v6M14 2 7 9"/></svg></a>`,
    )
    .join(' ');
}

/** 항목의 태그 칩 HTML을 반환합니다. */
export function tagChips(item) {
  return `<div class="tags">${(item.tags || [])
    .map(tag => `<span class="tag">${esc(tag)}</span>`)
    .join('')}</div>`;
}
