import path from 'path';
import fs from 'fs';

function firstExisting(dirs: string[]): string {
  for (const d of dirs) if (fs.existsSync(d)) return d;
  return dirs[0];
}

const cwd = process.cwd();
const isVercel = !!process.env.VERCEL;

export const viewsDir = firstExisting([
  path.join(cwd, 'dist', 'views'),
  path.join(cwd, 'src', 'views'),
  path.join(__dirname, '..', 'views'),
]);

export const publicDir = firstExisting([
  path.join(cwd, 'dist', 'public'),
  path.join(cwd, 'src', 'public'),
  path.join(__dirname, '..', 'public'),
]);

export const uploadsDir = isVercel
  ? path.join('/tmp', 'uploads')
  : firstExisting([
      path.join(cwd, 'dist', 'public', 'uploads'),
      path.join(cwd, 'src', 'public', 'uploads'),
      path.join(__dirname, '..', 'public', 'uploads'),
    ]);
