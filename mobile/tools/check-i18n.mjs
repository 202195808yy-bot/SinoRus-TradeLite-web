/**
 * 自检脚本：核对三语文案表的完整性。
 *
 * 做三件事：
 *   1. 扫出源码里所有 t('...') 用到的键；
 *   2. 检查 ru / zh / en 三张表是否都覆盖这些键（漏译即报错）；
 *   3. 反向列出表里有、但代码没用的键（死键，提示清理）。
 *
 * 用法： node tools/check-i18n.mjs
 */

import fs from 'node:fs';
import path from 'node:path';

const ROOT = path.resolve(import.meta.dirname, '..');
const SRC = path.join(ROOT, 'src');

function walk(dir, acc = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, acc);
    else if (/\.tsx?$/.test(entry.name)) acc.push(full);
  }
  return acc;
}

// --- 1. 收集代码里用到的键 -------------------------------------------------
const used = new Set();
for (const file of walk(SRC)) {
  const source = fs.readFileSync(file, 'utf8');
  // 静态用法：t('key')
  for (const m of source.matchAll(/\bt\(\s*'([A-Za-z0-9_]+)'/g)) used.add(m[1]);
}

// 动态用法：状态映射表（utils/format.ts 里的 * _KEY 表）间接引用
const formatSrc = fs.readFileSync(path.join(SRC, 'utils', 'format.ts'), 'utf8');
for (const m of formatSrc.matchAll(/_KEY[^=]*=\s*\{([\s\S]*?)\};/g)) {
  for (const k of m[1].matchAll(/:\s*'([A-Za-z0-9_]+)'/g)) used.add(k[1]);
}

// --- 2. 解析三张表 ---------------------------------------------------------
const stringsSrc = fs.readFileSync(path.join(SRC, 'i18n', 'strings.ts'), 'utf8');
const tables = {};
for (const lang of ['ru', 'zh', 'en']) {
  const start = stringsSrc.indexOf(`const ${lang}: Record<string, string> = {`);
  if (start < 0) throw new Error(`не найдена таблица языка: ${lang}`);
  const end = stringsSrc.indexOf('\n};', start);
  const body = stringsSrc.slice(start, end);
  tables[lang] = new Set([...body.matchAll(/^ {2}([A-Za-z0-9_]+):/gm)].map((m) => m[1]));
}

// --- 3. 比对 ---------------------------------------------------------------
let failed = false;
console.log(`Используется ключей в коде: ${used.size}\n`);

for (const lang of ['ru', 'zh', 'en']) {
  const missing = [...used].filter((k) => !tables[lang].has(k));
  const status = missing.length === 0 ? 'OK' : 'ПРОПУЩЕНО';
  console.log(`${lang}: ${tables[lang].size} ключей — ${status}`);
  if (missing.length) {
    failed = true;
    console.log(`   нет перевода: ${missing.join(', ')}`);
  }
}

const unused = [...tables.ru].filter((k) => !used.has(k));
if (unused.length) console.log(`\nНе используется (${unused.length}): ${unused.join(', ')}`);

process.exit(failed ? 1 : 0);
