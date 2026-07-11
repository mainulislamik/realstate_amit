import { Module } from '@nestjs/common';
import { SiteController } from './site.controller';
import { PropertiesModule } from '../properties/properties.module';
import { AgentsModule } from '../agents/agents.module';
import { BlogModule } from '../blog/blog.module';

@Module({
  imports: [PropertiesModule, AgentsModule, BlogModule],
  controllers: [SiteController],
})
export class SiteModule {}
