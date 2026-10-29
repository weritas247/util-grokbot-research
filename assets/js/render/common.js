import { esc, isNew, sourceLinks, tagChips } from '../data.js';

/** 카드 HTML을 만듭니다. */
export function card(item, meta, { number = false, actor = false } = {}) {
  return `<article class="card" id="${esc(item.id)}">${actor ? `<span class="actor">${esc(item.actor || '')}</span>` : ''}${number ? `<span class="number">${String(item.order || 0).padStart(2, '0')}</span>` : ''}<h3>${esc(item.title)} ${isNew(item, meta) ? '<span class="new">NEW</span>' : ''}</h3><p>${esc(item.summary)}</p>${item.metrics?.length ? `<div class="metrics">${item.metrics.map(metric => `<span>${esc(metric)}</span>`).join('')}</div>` : ''}${tagChips(item)}<div class="meta">${sourceLinks(item)}</div></article>`;
}

/** 섹션 HTML을 만듭니다. */
export function section(id, title, body, intro = '', index = '', label = '', count = '') {
  return `<section class="section" id="${id}"><header class="section-head"><div>${label ? `<span class="kicker">${index ? `${index} ` : ''}${label}</span>` : ''}<h2>${title} <small class="item-count">${count}</small></h2>${intro ? `<p class="section-intro">${intro}</p>` : ''}</div></header>${body}</section>`;
}

/** 필터 버튼 HTML을 만듭니다. */
export function filters(items, id, { category = false } = {}) {
  const values = [
    ...new Set(
      items
        .map(item => (category ? item.category : undefined))
        .filter(Boolean)
        .concat(items.flatMap(item => item.tags || [])),
    ),
  ];
  return `<div class="filters" data-filter="${id}"><button class="chip selected" data-value="*">전체</button>${values.map(value => `<button class="chip" data-value="${esc(value)}">${esc(value)}</button>`).join('')}</div>`;
}
