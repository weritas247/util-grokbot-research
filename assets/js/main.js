import { loadData, esc } from './data.js';
import { renderHome } from './render/home.js';
import { renderUpdates } from './render/updates.js';
import {
  renderUsecases,
  renderTips,
  renderCaveats,
  renderRecommendations,
  renderSources,
} from './render/sections.js';
import { setupSearch } from './search.js';

const $ = selector => document.querySelector(selector);

function render(data) {
  $('#content').innerHTML =
    renderHome(data) +
    renderUpdates(data) +
    renderUsecases(data) +
    renderTips(data) +
    renderCaveats(data) +
    renderRecommendations(data) +
    renderSources(data);
  $('#footer').innerHTML = `데이터 갱신일 ${esc(data.meta.last_updated)} · ${data.updates.length + data.usecases.length + data.tips.length + data.caveats.length + data.summary.length + data.recommendations.items.length + data.sources.length}개 항목 · <a href="README.md">새 조사 추가 방법은 README 참고</a> · <a href="${esc(data.meta.source_page_url)}" target="_blank" rel="noopener">원본 리서치 Page</a>`;
  bind(data);
  setupSearch(data);
  if (location.hash) {
    document.fonts.ready.then(() =>
      requestAnimationFrame(() =>
        document
          .getElementById(decodeURIComponent(location.hash.slice(1)))
          ?.scrollIntoView({ block: 'start', behavior: 'instant' }),
      ),
    );
  }
}

function bind(data) {
  let timelineExpanded = false;
  document.querySelectorAll('[data-filter]').forEach(box =>
    box.addEventListener('click', event => {
      const button = event.target.closest('.chip');
      if (!button) {
        return;
      }
      const field = box.dataset.filter;
      if (field === 'month') {
        box.querySelectorAll('.chip').forEach(chip =>
          chip.classList.toggle('selected', chip === button),
        );
        applyTimeline();
        return;
      }
      if (field === 'kind') {
        button.classList.toggle('selected');
        applyTimeline();
        return;
      }
      if (button.dataset.value === '*') {
        box.querySelectorAll('.chip').forEach(chip =>
          chip.classList.remove('selected'),
        );
        button.classList.add('selected');
      } else {
        box.querySelector('[data-value="*"]').classList.remove('selected');
        button.classList.toggle('selected');
        if (!box.querySelector('.selected')) {
          box.querySelector('[data-value="*"]').classList.add('selected');
        }
      }
      const chosen = [...box.querySelectorAll('.selected')].map(
        chip => chip.dataset.value,
      );
      const gridId = field === 'usecases' ? 'usecase-grid' : 'tips-grid';
      const cards = [...document.querySelectorAll(`#${gridId} .card`)];
      cards.forEach(card => {
        const item =
          field === 'usecases'
            ? data.usecases.find(entry => entry.id === card.id)
            : data.tips.find(entry => entry.id === card.id);
        const match =
          chosen.includes('*') ||
          chosen.includes(item.category) ||
          (item.tags || []).some(tag => chosen.includes(tag));
        card.classList.toggle('hidden', !match);
      });
      updateCount(field, cards);
    }),
  );

  function applyTimeline() {
    const month =
      document.querySelector('[data-filter="month"] .selected')?.dataset.month ||
      '*';
    const kinds = [...document.querySelectorAll('[data-filter="kind"] .selected')].map(
      chip => chip.dataset.kind,
    );
    const filtered = month !== '*' || kinds.length > 0;
    const entries = [...document.querySelectorAll('.timeline-item')];
    entries.forEach(entry => {
      const show =
        (month === '*' || entry.dataset.month === month) &&
        (kinds.length === 0 || kinds.includes(entry.dataset.kind));
      entry.classList.toggle('filter-hidden', !show);
    });
    entries.forEach((entry, index) => {
      const matches = !entry.classList.contains('filter-hidden');
      entry.classList.toggle(
        'collapsed',
        matches && !filtered && !timelineExpanded && index >= 8,
      );
    });
    const visible = entries.filter(
      entry =>
        !entry.classList.contains('filter-hidden') &&
        !entry.classList.contains('collapsed'),
    ).length;
    document.querySelector('#updates .item-count').textContent =
      visible === entries.length
        ? `${entries.length}개`
        : `${entries.length}개 중 ${visible}개 표시`;
    $('#more-updates').hidden = filtered || timelineExpanded || entries.length <= 8;
    $('#more-updates').textContent = `이전 업데이트 ${Math.max(entries.length - 8, 0)}개 더 보기`;
  }

  applyTimeline();
  $('#more-updates').onclick = () => {
    timelineExpanded = true;
    document.querySelectorAll('.timeline-item.collapsed').forEach(entry =>
      entry.classList.remove('collapsed'),
    );
    $('#more-updates').hidden = true;
    const entries = [...document.querySelectorAll('.timeline-item')];
    document.querySelector('#updates .item-count').textContent =
      `${entries.length}개`;
  };

  function updateCount(id, cards) {
    const section = document.getElementById(id);
    const all = cards.length;
    const shown = cards.filter(card => !card.classList.contains('hidden')).length;
    section.querySelector('.item-count').textContent =
      shown === all ? `${all}개` : `${all}개 중 ${shown}개`;
  }

  const navLinks = [...document.querySelectorAll('nav a')];
  const sections = navLinks
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  const observer = new IntersectionObserver(
    entries => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          navLinks.forEach(link => {
            const on = link.hash === `#${entry.target.id}`;
            link.classList.toggle('active', on);
            if (on && innerWidth <= 720) {
              link.scrollIntoView({
                inline: 'center',
                block: 'nearest',
                behavior: 'smooth',
              });
            }
          });
        }
      }
    },
    { rootMargin: '-25% 0px -65% 0px' },
  );
  sections.forEach(section => observer.observe(section));
}

const saved = localStorage.getItem('theme');
if (
  saved === 'dark' ||
  (!saved && matchMedia('(prefers-color-scheme: dark)').matches)
) {
  document.documentElement.classList.add('dark');
}
$('#theme').onclick = () => {
  document.documentElement.classList.toggle('dark');
  localStorage.setItem(
    'theme',
    document.documentElement.classList.contains('dark') ? 'dark' : 'light',
  );
};

try {
  render(await loadData());
} catch (error) {
  $('#error').hidden = false;
  $('#error').textContent = `데이터를 불러오지 못했습니다. 로컬 서버로 다시 열어 주세요. (${error.message})`;
  console.error(error);
}
