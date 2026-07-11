import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { PropertiesModule } from '../properties/properties.module';
import { AgentsModule } from '../agents/agents.module';
import { BlogModule } from '../blog/blog.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [PropertiesModule, AgentsModule, BlogModule, UsersModule],
  controllers: [AdminController],
})
export class AdminModule {}
