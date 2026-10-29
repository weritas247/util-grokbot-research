import fs from 'node:fs';
import path from 'node:path';

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
const dirIndex = process.argv.indexOf('--dir');
const dataDir = path.resolve(dirIndex >= 0 ? process.argv[dirIndex + 1] || 'data' : 'data');

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
    const json = JSON.parse(fs.readFileSync(path.join(dataDir, `${file}.json`), 'utf8'));
    const items = file === 'recommendations' ? json.items : json;
    if (!Array.isArray(items)) {
      throw Error('배열 아님');
    }
    items.forEach((item, index) => {
      check(item, `${file}[${index}]`, file === 'sources');
      if (['updates', 'usecases', 'tips', 'caveats', 'recommendations'].includes(file)) {
        const label = `${file}[${index}]`;
        if (!Array.isArray(item.details) || !item.details.length) errors.push(`${label}: details 누락 또는 빈 배열`);
        else {
          let length = 0;
          item.details.forEach((part, partIndex) => {
            const at = `${label}.details[${partIndex}]`;
            if (!part || typeof part !== 'object' || Array.isArray(part)) { errors.push(`${at}: 객체 아님`); return; }
            for (const key of Object.keys(part)) if (!['heading', 'body', 'bullets'].includes(key)) errors.push(`${at}: 허용되지 않은 키 ${key}`);
            if (typeof part.heading !== 'string' || !part.heading.trim()) errors.push(`${at}: heading 누락`);
            const hasBody = typeof part.body === 'string' && part.body.trim();
            const hasBullets = Array.isArray(part.bullets) && part.bullets.length > 0 && part.bullets.every(value => typeof value === 'string' && value.trim());
            if (part.body !== undefined && typeof part.body !== 'string') errors.push(`${at}: body는 문자열이어야 함`);
            if (part.bullets !== undefined && (!Array.isArray(part.bullets) || part.bullets.some(value => typeof value !== 'string' || !value.trim()))) errors.push(`${at}: bullets는 비지 않은 문자열 배열이어야 함`);
            if (!hasBody && !hasBullets) errors.push(`${at}: body 또는 bullets 필요`);
            length += (part.heading || '').length + (typeof part.body === 'string' ? part.body.length : 0) + (Array.isArray(part.bullets) ? part.bullets.reduce((sum, value) => sum + (typeof value === 'string' ? value.length : 0), 0) : 0);
          });
          if (length < 200) errors.push(`${label}: details가 너무 짧음`);
        }
        if (item.details_note !== undefined && typeof item.details_note !== 'string') errors.push(`${label}: details_note는 문자열이어야 함`);
      }
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
  const json = JSON.parse(fs.readFileSync(path.join(dataDir, `${file}.json`)));
  for (const item of file === 'recommendations' ? json.items : json) {
    if (!(key in item)) {
      errors.push(`${file}: ${key} 누락`);
    }
  }
}
const meta = JSON.parse(fs.readFileSync(path.join(dataDir, 'meta.json')));
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
