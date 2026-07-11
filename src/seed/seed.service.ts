import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Property } from '../entities/property.entity';
import { Agent } from '../entities/agent.entity';
import { Post } from '../entities/post.entity';
import { User } from '../entities/user.entity';
import { UsersService } from '../modules/users/users.service';
import { propertiesSeed, agentsSeed, postsSeed } from './data';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Property) private readonly propertyRepo: Repository<Property>,
    @InjectRepository(Agent) private readonly agentRepo: Repository<Agent>,
    @InjectRepository(Post) private readonly postRepo: Repository<Post>,
    @InjectRepository(User) private readonly userRepo: Repository<User>,
    private readonly usersService: UsersService,
    private readonly dataSource: DataSource,
  ) {}

  async run(): Promise<void> {
    await this.usersService.ensureAdmin();

    if ((await this.propertyRepo.count()) === 0) {
      await this.propertyRepo.save(propertiesSeed as Property[]);
      await this.syncSequence('property');
      this.logger.log(`Seeded ${propertiesSeed.length} properties`);
    }

    if ((await this.agentRepo.count()) === 0) {
      await this.agentRepo.save(agentsSeed as Agent[]);
      await this.syncSequence('agent');
      this.logger.log(`Seeded ${agentsSeed.length} agents`);
    }

    if ((await this.postRepo.count()) === 0) {
      await this.postRepo.save(postsSeed as Post[]);
      await this.syncSequence('post');
      this.logger.log(`Seeded ${postsSeed.length} posts`);
    }
  }

  private async syncSequence(table: string): Promise<void> {
    try {
      await this.dataSource.query(
        `SELECT setval(pg_get_serial_sequence($1, 'id'), COALESCE((SELECT MAX(id) FROM ${table}), 1))`,
        [table],
      );
    } catch (e) {
      this.logger.warn(`Could not sync sequence for ${table}: ${(e as Error).message}`);
    }
  }
}
