import { esc, names } from './data.js';

const $ = selector => document.querySelector(selector);

/** 검색 기능과 키보드 조작을 설정합니다. */
export function setupSearch(data) {
  const sections = [
    ['요약', 'summary'],
    ['업데이트', 'updates'],
    ['사례', 'usecases'],
    ['팁', 'tips'],
    ['주의', 'caveats'],
    ['추천', 'recommendations'],
    ['출처', 'sources'],
  ];
  let active = -1;

  function run() {
    const query = $('#query').value.trim();
    if (!query) {
      $('#results').innerHTML = '';
      return;
    }
    const terms = query.toLowerCase().split(/\s+/);
    const matches = [];
    for (const [label, key] of sections) {
      const items = key === 'recommendations' ? data[key].items : data[key];
      for (const item of items) {
        const text = `${item.title} ${item.summary} ${(item.tags || []).join(' ')} ${item.actor || ''}`.toLowerCase();
        if (terms.every(term => text.includes(term))) {
          matches.push({ item, label, text });
        }
      }
    }
    $('#result-count').textContent = `${matches.length}개`;
    $('#results').innerHTML = matches.length
      ? matches
          .map(({ item, label }) => {
            const raw = item.summary.slice(0, 135);
            const highlighted = esc(raw).replace(
              new RegExp(
                `(${terms.map(term => term.replace(/[.*+?^${}()|[\\]\\]/g, '\\$&')).join('|')})`,
                'ig',
              ),
              '<mark>$1</mark>',
            );
            return `<a class="result" href="#${esc(item.id)}"><span class="badge">${label}</span><strong>${esc(item.title)}</strong><small>${highlighted}${item.summary.length > 135 ? '…' : ''}</small></a>`;
          })
          .join('')
      : '<p class="empty-results">검색 결과가 없습니다.</p>';
    active = -1;
  }

  $('#query').addEventListener('input', run);
  $('#results').addEventListener('click', event => {
    const link = event.target.closest('a.result');
    if (!link) {
      return;
    }
    $('#search').hidden = true;
    setTimeout(() => {
      document.getElementById(link.hash.slice(1))?.classList.add('highlight');
      setTimeout(
        () => document.querySelector('.highlight')?.classList.remove('highlight'),
        1600,
      );
    }, 100);
  });
  document.addEventListener('keydown', event => {
    if ($('#search').hidden) {
      return;
    }
    const rows = [...$('#results').querySelectorAll('a.result')];
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      active =
        (active + (event.key === 'ArrowDown' ? 1 : -1) + rows.length) %
        rows.length;
      rows.forEach((row, index) =>
        row.classList.toggle('keyboard-active', index === active),
      );
    } else if (event.key === 'Enter' && active >= 0) {
      rows[active]?.click();
    }
  });
  $('#search-open').onclick = () => {
    $('#search').hidden = false;
    $('#query').focus();
  };
  $('#search-close').onclick = () => {
    $('#search').hidden = true;
    $('#query').value = '';
    $('#results').innerHTML = '';
    $('#result-count').textContent = '';
  };
  document.addEventListener('keydown', event => {
    if (
      event.key === '/' &&
      !['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName)
    ) {
      event.preventDefault();
      $('#search').hidden = false;
      $('#query').focus();
    }
    if (event.key === 'Escape') {
      $('#search-close').click();
    }
  });
}
