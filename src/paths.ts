import path from 'path';
import fs from 'fs';

function firstExisting(dirs: string[]): string {
  for (const d of dirs) if (fs.existsSync(d)) return d;
  return dirs[dirs.length - 1];
}

const cwd = process.cwd();
const isVercel = !!process.env.VERCEL;

export const viewsDir = firstExisting([
  path.join(cwd, 'dist', 'views'),
  path.join(__dirname, 'views'),
  path.join(cwd, 'src', 'views'),
]);

export const publicDir = firstExisting([
  path.join(cwd, 'dist', 'public'),
  path.join(__dirname, 'public'),
  path.join(cwd, 'src', 'public'),
]);

export const uploadsDir = isVercel
  ? path.join('/tmp', 'uploads')
  : firstExisting([
      path.join(cwd, 'dist', 'public', 'uploads'),
      path.join(__dirname, 'public', 'uploads'),
      path.join(cwd, 'src', 'public', 'uploads'),
    ]);
