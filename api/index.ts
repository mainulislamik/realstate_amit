import 'reflect-metadata';
import { createApp } from '../src/app.factory';
import { NestExpressApplication } from '@nestjs/platform-express';

let cached: NestExpressApplication | null = null;

export default async function handler(req: any, res: any) {
  if (!cached) {
    cached = await createApp();
  }
  return cached.getHttpAdapter().getInstance()(req, res);
}
