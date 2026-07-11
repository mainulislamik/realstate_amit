import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SeedService } from './seed.service';
import { Property } from '../entities/property.entity';
import { Agent } from '../entities/agent.entity';
import { Post } from '../entities/post.entity';
import { User } from '../entities/user.entity';
import { UsersModule } from '../modules/users/users.module';

@Module({
  imports: [TypeOrmModule.forFeature([Property, Agent, Post, User]), UsersModule],
  providers: [SeedService],
  exports: [SeedService],
})
export class SeedModule {}
