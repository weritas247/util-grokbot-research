import { esc, sourceLinks, tagChips, detailsMarkup } from '../data.js';
import { card, filters, section } from './common.js';

/** 사용 사례 영역을 렌더링합니다. */
export function renderUsecases(data) {
  const cards = data.usecases
    .map(
      item =>
        `<article class="card usecase-card" id="${esc(item.id)}" data-category="${esc(item.category)}" data-tags="${esc(item.tags.join('|'))}"><span class="actor">${esc(item.actor)}</span><h3>${esc(item.title)}</h3><p>${esc(item.summary)}</p>${detailsMarkup(item)}${item.metrics?.length ? `<div class="metrics">${item.metrics.map(metric => `<span>${esc(metric)}</span>`).join('')}</div>` : ''}${tagChips(item)}<div class="meta">${sourceLinks(item)}</div></article>`,
    )
    .join('');
  const body = `${filters(data.usecases, 'usecases', { category: true })}<div class="grid" id="usecase-grid">${cards}</div>`;
  return section(
    'usecases',
    '사용 사례',
    body,
    '본인이 직접 밝힌 사례가 대부분이고, 수치는 원문에 있는 것만 옮겼어요.',
    '02',
    'USE CASES',
    `${data.usecases.length}개`,
  );
}

/** 실전 팁 영역을 렌더링합니다. */
export function renderTips(data) {
  const cards = data.tips.map(item => card(item, data.meta, { number: true })).join('');
  const body = `${filters(data.tips, 'tips')}<div class="grid two" id="tips-grid">${cards}</div>`;
  return section('tips', '실전 팁', body, '', '03', 'TIPS', `${data.tips.length}개`);
}

/** 주의 사항 영역을 렌더링합니다. */
export function renderCaveats(data) {
  const counts = ['high', 'medium', 'info'].map(level => [
    level,
    data.caveats.filter(item => item.severity === level).length,
  ]);
  const labels = { high: '높음', medium: '보통', info: '참고' };
  const severitySummary = counts
    .map(
      ([level, count]) =>
        `<span class="severity-${level}">${labels[level]} ${count}개</span>`,
    )
    .join('');
  const cards = data.caveats
    .map(
      item =>
        `<article class="card severity-${item.severity}" id="${esc(item.id)}"><span class="severity-label"><svg aria-hidden="true" viewBox="0 0 20 20"><path d="M10 2 18 17H2zM10 7v5m0 2v.1"/></svg>${labels[item.severity]}</span><h3>${esc(item.title)}</h3><p>${esc(item.summary)}</p>${detailsMarkup(item)}${tagChips(item)}<div class="meta">${sourceLinks(item)}</div></article>`,
    )
    .join('');
  const note = esc(data.meta.notes[0]
    .replace(/^출처 수준:\s*/, '')
    .replace(/^출처 수준\s*/, '')
    .replace(/^[:：]\s*/, ''));
  const body =
    `<div class="severity-summary">${severitySummary}</div><div class="grid two">${cards}</div>` +
    `<aside class="callout"><b>출처 수준</b><p>${note}</p></aside>`;
  return section('caveats', '주의할 점', body, '', '04', 'CAVEATS', `${data.caveats.length}개`);
}

/** 맞춤 추천 영역을 렌더링합니다. */
export function renderRecommendations(data) {
  const recommendation = data.recommendations;
  const steps = recommendation.items
    .map(
      (item, index) =>
        `<article class="step" id="${esc(item.id)}"><span class="step-number">${String(index + 1).padStart(2, '0')}</span><div><h3>${esc(item.title)}</h3><p>${esc(item.summary)}</p>${detailsMarkup(item)}${tagChips(item)}<div class="meta">${sourceLinks(item)}</div></div></article>`,
    )
    .join('');
  const body =
    `<aside class="callout recommendation-context">${esc(recommendation.context)}</aside>` +
    `<div class="steps">${steps}</div>` +
    `<blockquote class="quote"><p>“${esc(recommendation.quote.text)}”</p><cite>${esc(recommendation.quote.cite)}</cite></blockquote>`;
  return section(
    'recommendations',
    '맞춤 추천',
    body,
    '',
    '05',
    'FOR MATTHEW',
    `${recommendation.items.length}개`,
  );
}

const typeTitles = {
  'official-changelog': '공식 변경 기록',
  'official-news': '공식 뉴스',
  'official-docs': '공식 문서',
  'official-x': '공식 X',
  community: '커뮤니티',
  blog: '블로그',
  review: '리뷰',
};

/** 출처 영역을 렌더링합니다. */
export function renderSources(data) {
  const groups = {};
  data.sources.forEach(source => (groups[source.type] ??= []).push(source));
  const counts = {};
  for (const file of [
    'summary',
    'updates',
    'usecases',
    'tips',
    'caveats',
    'recommendations',
  ]) {
    const items = file === 'recommendations' ? data[file].items : data[file];
    for (const item of items) {
      for (const source of item.sources || []) {
        counts[source.url] = (counts[source.url] || 0) + 1;
      }
    }
  }
  const sourceGroups = Object.entries(groups)
    .map(
      ([type, items]) =>
        `<div class="source-group"><h3>${typeTitles[type] || esc(type)}</h3><div class="sources">${items
          .map(
            source =>
              `<article class="source-card" id="${esc(source.id)}"><h3><a href="${esc(source.url)}" target="_blank" rel="noopener">${esc(source.title)}</a></h3>${source.date || source.date_label ? `<p>${source.date ? esc(source.date) : ''}${source.date && source.date_label ? ' · ' : ''}${source.date_label ? esc(source.date_label) : ''}</p>` : ''}<small>이 출처를 쓰는 항목 ${counts[source.url] || 0}개</small></article>`,
          )
          .join('')}</div></div>`,
    )
    .join('');
  return section(
    'sources',
    '출처',
    sourceGroups,
    '',
    '06',
    'SOURCES',
    `${data.sources.length}개`,
  );
}
