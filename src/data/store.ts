import fs from 'fs';
import path from 'path';

const dataDir = __dirname;

function ensureDir(): void {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true });
}

export function load<T>(file: string): T[] {
  ensureDir();
  const p = path.join(dataDir, file);
  if (!fs.existsSync(p)) return [];
  try {
    return JSON.parse(fs.readFileSync(p, 'utf-8'));
  } catch {
    return [];
  }
}

export function save<T>(file: string, data: T[]): void {
  ensureDir();
  const p = path.join(dataDir, file);
  fs.writeFileSync(p, JSON.stringify(data, null, 2));
}

export const store = { load, save, dataDir };
