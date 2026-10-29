import { esc, isNew, kindLabels, sourceLinks, detailsMarkup } from '../data.js';
import { section } from './common.js';

/** 업데이트 타임라인을 렌더링합니다. */
export function renderUpdates(data) {
  const months = [...new Set(data.updates.map(item => item.date.slice(0, 7)))]
    .sort()
    .reverse();
  const monthName = month => `${parseInt(month.slice(5), 10)}월`;
  const items = [...data.updates].sort((a, b) => b.date.localeCompare(a.date));
  const cards = items
    .map(
      item =>
        `<article class="timeline-item" id="${esc(item.id)}" data-kind="${item.kind}" data-month="${item.date.slice(0, 7)}"><div class="timeline-date"><time>${item.date.replaceAll('-', '.')}</time>${item.date_label ? `<small>${esc(item.date_label)}</small>` : ''}${item.time_kst && !/KST/.test(item.date_label || '') ? `<small>${esc(item.time_kst)} KST</small>` : ''}</div><div class="timeline-card"><div class="badges">${item.version ? `<span class="badge">${esc(item.version)}</span>` : ''}<span class="badge">${kindLabels[item.kind]}</span></div><h3>${esc(item.title)} ${isNew(item, data.meta) ? '<span class="new">NEW</span>' : ''}</h3><p>${esc(item.summary)}</p>${detailsMarkup(item)}<div class="meta">${sourceLinks(item)}</div></div></article>`,
    )
    .join('');
  const monthFilters = months
    .map(month => `<button class="chip" data-month="${month}">${monthName(month)}</button>`)
    .join('');
  const kindFilters = Object.entries(kindLabels)
    .map(([kind, label]) => `<button class="chip " data-kind="${kind}">${label}</button>`)
    .join('');
  const body =
    `<div class="filters timeline-filters"><div class="filters" data-filter="month"><button class="chip selected" data-month="*">전체</button>${monthFilters}</div>` +
    `<div class="filters" data-filter="kind">${kindFilters}</div></div>` +
    `<div class="timeline" data-total="${items.length}">${cards}</div>` +
    '<button class="more-button" id="more-updates">이전 업데이트 더 보기</button>';
  return section(
    'updates',
    '업데이트 타임라인',
    body,
    '최신순 · @bot 게시물은 원문에 적힌 KST 시각을 표시합니다.',
    '01',
    'UPDATES',
    `${items.length}개`,
  );
}
