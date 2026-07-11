import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import session from 'express-session';
import * as express from 'express';
import { join } from 'path';
import { AppModule } from './app.module';
import { SeedService } from './seed/seed.service';
import { viewsDir, publicDir, uploadsDir } from './paths';

export async function createApp(): Promise<NestExpressApplication> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    bufferLogs: false,
  });

  app.setBaseViewsDir(viewsDir);
  app.setViewEngine('ejs');

  app.useStaticAssets(publicDir);
  app.use('/uploads', express.static(uploadsDir));
  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'express-realty-prime-secret',
      resave: false,
      saveUninitialized: false,
      cookie: { maxAge: 1000 * 60 * 60 * 24 },
    }),
  );

  await app.init();

  const seed = app.get(SeedService);
  await seed.run().catch((e) => console.error('Seed failed:', e));

  return app;
}
