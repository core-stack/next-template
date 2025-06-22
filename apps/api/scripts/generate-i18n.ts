import { globSync } from 'fast-glob';
import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import path from 'path';

const ROOT = path.resolve(__dirname, '../../../');

const LOCALES_DIR = path.join(ROOT, 'locales');
const LANGUAGES = ['en', 'pt'];

function extractI18nStringsFromFile(filePath: string): string[] {
  const content = readFileSync(filePath, 'utf-8');
  const regex = /\/\*i18n\*\/\((?:"|')(.+?)(?:"|')\)/g;
  const matches: string[] = [];
  let match;
  while ((match = regex.exec(content)) !== null) {
    matches.push(match[1]);
  }
  return matches;
}

function generateLocales() {
  const files = globSync('**/*.ts?(x)', {
    cwd: ROOT,
    absolute: true,
    ignore: ['**/node_modules/**', '**/dist/**', '**/.git/**'],
  });

  const strings = new Set<string>();
  for (const file of files) {
    try {
      extractI18nStringsFromFile(file).forEach(str => strings.add(str));
    } catch {
      // Ignora arquivos com erro de leitura
    }
  }

  mkdirSync(LOCALES_DIR, { recursive: true });

  for (const lang of LANGUAGES) {
    const filePath = path.join(LOCALES_DIR, `${lang}.json`);
    let data: Record<string, string> = {};

    if (existsSync(filePath)) {
      try {
        data = JSON.parse(readFileSync(filePath, 'utf-8'));
      } catch {
        console.warn(`⚠️  Fail to parse ${filePath}, skipping.`);
      }
    }

    for (const key of strings) {
      if (!(key in data)) {
        data[key] = lang === 'en' ? key : '';
      }
    }

    writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`✅ ${lang}.json updated with ${Object.keys(data).length} keys.`);
  }
}

generateLocales();
