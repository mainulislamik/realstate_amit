import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from '../../entities/property.entity';
import { uniqueSlug } from '../../common/slug.util';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private readonly repo: Repository<Property>,
  ) {}

  findAll(): Promise<Property[]> {
    return this.repo.find();
  }

  findBySlug(slug: string): Promise<Property | null> {
    return this.repo.findOne({ where: { slug } });
  }

  findById(id: number): Promise<Property | null> {
    return this.repo.findOne({ where: { id } });
  }

  findFeatured(): Promise<Property[]> {
    return this.repo.find({ where: { featured: true } });
  }

  async create(data: Partial<Property>): Promise<Property> {
    const existing = await this.repo.find();
    const slug = uniqueSlug(data.title || 'property', existing);
    const prop = this.repo.create({
      title: '',
      type: 'Apartment',
      status: 'For Sale',
      price: 0,
      beds: 0,
      baths: 0,
      sqft: 0,
      image: '',
      description: '',
      location: '',
      state: '',
      label: '',
      featured: false,
      createdAt: new Date().toISOString(),
      slug,
      ...data,
    });
    return this.repo.save(prop);
  }

  async update(id: number, data: Partial<Property>): Promise<Property> {
    const prop = await this.findById(id);
    if (!prop) throw new NotFoundException();
    if (data.title) {
      const existing = (await this.repo.find()).filter((p) => p.id !== id);
      prop.slug = uniqueSlug(data.title, existing, prop.slug);
    }
    Object.assign(prop, data);
    return this.repo.save(prop);
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
