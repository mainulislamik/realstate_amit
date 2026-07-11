import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './modules/users/users.module';
import { PropertiesModule } from './modules/properties/properties.module';
import { AgentsModule } from './modules/agents/agents.module';
import { BlogModule } from './modules/blog/blog.module';
import { SiteModule } from './modules/site/site.module';
import { AdminModule } from './modules/admin/admin.module';
import { SeedModule } from './seed/seed.module';
import { FallbackModule } from './modules/fallback/fallback.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      autoLoadEntities: true,
      synchronize: true,
      ssl: process.env.DATABASE_URL && process.env.DATABASE_URL.includes('sslmode=require')
        ? { rejectUnauthorized: false }
        : false,
    }),
    UsersModule,
    PropertiesModule,
    AgentsModule,
    BlogModule,
    SiteModule,
    AdminModule,
    SeedModule,
    FallbackModule,
  ],
})
export class AppModule {}
