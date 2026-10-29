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

/** 상세 설명을 안전한 마크업으로 렌더링합니다. */
export function detailsMarkup(item) {
  if (!Array.isArray(item.details) || !item.details.length) return '';
  const inline = value => esc(value).replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  const sections = item.details.map(part => `<section class="detail-section"><h4>${inline(part.heading)}</h4>${part.body ? `<p>${inline(part.body)}</p>` : ''}${part.bullets?.length ? `<ul>${part.bullets.map(text => `<li>${inline(text)}</li>`).join('')}</ul>` : ''}</section>`).join('');
  return `<details class="item-details"><summary data-section-count="${item.details.length}">자세히 보기 · ${item.details.length}개 섹션</summary><div class="details-content">${item.details_note ? `<aside class="details-note"><strong>참고</strong><span>${inline(item.details_note)}</span></aside>` : ''}${sections}<div class="details-actions"><button type="button" class="collapse-details">접기</button><button type="button" class="copy-item-link" data-copy-id="${esc(item.id)}">이 항목 링크 복사</button></div></div></details>`;
}
