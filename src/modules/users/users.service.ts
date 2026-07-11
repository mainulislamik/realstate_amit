import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly repo: Repository<User>,
  ) {}

  findAll(): Promise<User[]> {
    return this.repo.find();
  }

  findByUsername(username: string): Promise<User | null> {
    return this.repo.findOne({ where: { username } });
  }

  findById(id: number): Promise<User | null> {
    return this.repo.findOne({ where: { id } });
  }

  async ensureAdmin(): Promise<void> {
    const count = await this.repo.count();
    if (count === 0) {
      const username = process.env.ADMIN_USERNAME || 'admin';
      const password = process.env.ADMIN_PASSWORD || 'admin123';
      const hash = bcrypt.hashSync(password, 10);
      await this.repo.save(this.repo.create({ id: 1, username, password: hash, role: 'admin' }));
      console.log(`\n========================================`);
      console.log(`  Admin user created`);
      console.log(`  Username: ${username}`);
      console.log(`  Password: ${password}`);
      console.log(`  Login at: /admin/login`);
      console.log(`========================================\n`);
    }
  }

  verify(username: string, password: string): Promise<User | null> {
    return this.findByUsername(username).then((user) => {
      if (!user) return null;
      if (!bcrypt.compareSync(password, user.password)) return null;
      return user;
    });
  }
}
