import { esc, kindLabels } from '../data.js';
import { card, section } from './common.js';

/** 홈페이지 영역을 렌더링합니다. */
export function renderHome(data) {
  const stats = [
    ['업데이트', 'updates'],
    ['사례', 'usecases'],
    ['팁', 'tips'],
    ['주의', 'caveats'],
    ['맞춤 추천', 'recommendations'],
    ['출처', 'sources'],
  ];
  const hero = `<div class="hero" id="home"><span class="eyebrow">RESEARCH · ${esc(data.meta.research_date)}</span><h1>${esc(data.meta.title)}</h1><p>${esc(data.meta.summary)}</p><div class="stats">${stats.map(([label, key]) => `<a class="stat" href="#${key}"><b>${key === 'recommendations' ? data.recommendations.items.length : data[key].length}</b><span>${label}</span></a>`).join('')}</div><p class="meta">마지막 갱신 ${esc(data.meta.last_updated)}</p></div>`;
  const summary = section(
    'summary',
    '한눈에 요약',
    `<div class="grid">${data.summary
      .map((item, index) => card({ ...item, order: index + 1 }, data.meta, { number: true }))
      .join('')}</div>`,
    '',
    '',
    'SUMMARY',
    `${data.summary.length}개`,
  );
  const latest = [...data.updates]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 5);
  const news = section(
    'news',
    '최근 소식',
    `<div class="recent-list">${latest
      .map(
        item =>
          `<a class="recent-item" href="#${item.id}"><time>${item.date.replaceAll('-', '.')}</time><span class="badge">${kindLabels[item.kind] || item.kind}</span><strong>${esc(item.title)}</strong></a>`,
      )
      .join('')}</div><a class="text-link" href="#updates">타임라인 전체 보기 →</a>`,
    '',
    '',
    'LATEST',
    `최근 ${latest.length}개`,
  );
  return hero + news + summary;
}
