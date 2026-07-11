import fs from 'fs';
import path from 'path';

function resolveDataDir(): string {
  const built = path.join(process.cwd(), 'dist', 'data');
  if (fs.existsSync(built)) return built;
  return __dirname;
}

const dataDir = resolveDataDir();

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
  try {
    ensureDir();
    const p = path.join(dataDir, file);
    fs.writeFileSync(p, JSON.stringify(data, null, 2));
  } catch (e) {
    console.warn(`[store] could not persist ${file}: ${(e as Error).message}`);
  }
}

export const store = { load, save, dataDir };
