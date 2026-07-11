import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from '../../entities/post.entity';
import { uniqueSlug } from '../../common/slug.util';

@Injectable()
export class BlogService {
  constructor(
    @InjectRepository(Post)
    private readonly repo: Repository<Post>,
  ) {}

  findAll(): Promise<Post[]> {
    return this.repo.find();
  }

  findBySlug(slug: string): Promise<Post | null> {
    return this.repo.findOne({ where: { slug } });
  }

  findById(id: number): Promise<Post | null> {
    return this.repo.findOne({ where: { id } });
  }

  async create(data: Partial<Post>): Promise<Post> {
    const existing = await this.repo.find();
    const slug = uniqueSlug(data.title || 'post', existing);
    const post = this.repo.create({
      title: '',
      slug,
      category: 'General',
      date: new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      image: '',
      excerpt: '',
      content: '',
      ...data,
    });
    return this.repo.save(post);
  }

  async update(id: number, data: Partial<Post>): Promise<Post> {
    const post = await this.findById(id);
    if (!post) throw new NotFoundException();
    if (data.title) {
      const existing = (await this.repo.find()).filter((p) => p.id !== id);
      post.slug = uniqueSlug(data.title, existing, post.slug);
    }
    Object.assign(post, data);
    return this.repo.save(post);
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
