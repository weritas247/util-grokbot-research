import fs from 'node:fs';

const files = [
  'summary',
  'updates',
  'usecases',
  'tips',
  'caveats',
  'recommendations',
  'sources',
];
let errors = [];
const ids = new Set();
const date = /^\d{4}-\d{2}-\d{2}$/;
const url = /^https:\/\//;
const forbiddenTags = new Set(['요약', '업데이트', '팁', '주의', '추천']);

/** 항목 형식과 필수 필드를 검사합니다. */
function check(item, path, allowNullDate = false) {
  for (const key of ['id', 'date', 'title', 'summary', 'tags', 'sources', 'added_at']) {
    if (!(key in item)) {
      errors.push(`${path}: ${key} 누락`);
    }
  }
  if (!(allowNullDate && item.date === null) && !date.test(item.date || '')) {
    errors.push(`${path}: date 형식 오류`);
  }
  if (!date.test(item.added_at || '')) {
    errors.push(`${path}: added_at 형식 오류`);
  }
  if (ids.has(item.id)) {
    errors.push(`${path}: id 중복 ${item.id}`);
  }
  ids.add(item.id);
  if (!Array.isArray(item.tags)) {
    errors.push(`${path}: tags 배열 아님`);
  } else {
    if (item.tags.length < 1 || item.tags.length > 3) {
      errors.push(`${path}: tags는 1~3개여야 함`);
    }
    for (const tag of item.tags) {
      if (forbiddenTags.has(tag)) {
        errors.push(`${path}: 섹션 이름 태그 금지 (${tag})`);
      }
    }
  }
  for (const source of item.sources || []) {
    if (!url.test(source.url || '')) {
      errors.push(`${path}: https URL 오류`);
    }
  }
}

const counts = {};
for (const file of files) {
  try {
    const json = JSON.parse(fs.readFileSync(`data/${file}.json`, 'utf8'));
    const items = file === 'recommendations' ? json.items : json;
    if (!Array.isArray(items)) {
      throw Error('배열 아님');
    }
    items.forEach((item, index) => {
      check(item, `${file}[${index}]`, file === 'sources');
      if (file === 'updates' && item.title === item.summary) {
        errors.push(`${file}[${index}]: title과 summary가 같음`);
      }
      if (
        file === 'updates' &&
        !['release-note', 'official-post', 'blog', 'plan'].includes(item.kind)
      ) {
        errors.push(`${file}[${index}]: kind 오류`);
      }
      if (
        file === 'caveats' &&
        !['high', 'medium', 'info'].includes(item.severity)
      ) {
        errors.push(`${file}[${index}]: severity 오류`);
      }
    });
    counts[file] = items.length;
  } catch (error) {
    errors.push(`${file}: ${error.message}`);
  }
}

for (const [file, key] of [
  ['usecases', 'actor'],
  ['usecases', 'category'],
  ['updates', 'kind'],
  ['tips', 'order'],
  ['caveats', 'severity'],
  ['sources', 'site'],
  ['sources', 'type'],
  ['sources', 'url'],
]) {
  const json = JSON.parse(fs.readFileSync(`data/${file}.json`));
  for (const item of file === 'recommendations' ? json.items : json) {
    if (!(key in item)) {
      errors.push(`${file}: ${key} 누락`);
    }
  }
}
const meta = JSON.parse(fs.readFileSync('data/meta.json'));
if (!date.test(meta.last_updated)) {
  errors.push('meta.last_updated 형식 오류');
}
if (!date.test(meta.baseline_added_at || '')) {
  errors.push('meta.baseline_added_at 형식 오류');
}
if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}
console.log(
  '검증 통과:',
  Object.entries(counts)
    .map(([key, value]) => `${key} ${value}개`)
    .join(', '),
);
