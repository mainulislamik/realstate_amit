import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Agent } from '../../entities/agent.entity';
import { uniqueSlug } from '../../common/slug.util';
import { PropertiesService } from '../properties/properties.service';
import { Property } from '../../entities/property.entity';

@Injectable()
export class AgentsService {
  constructor(
    @InjectRepository(Agent)
    private readonly repo: Repository<Agent>,
    private readonly propertiesService: PropertiesService,
  ) {}

  findAll(): Promise<Agent[]> {
    return this.repo.find();
  }

  findBySlug(slug: string): Promise<Agent | null> {
    return this.repo.findOne({ where: { slug } });
  }

  findById(id: number): Promise<Agent | null> {
    return this.repo.findOne({ where: { id } });
  }

  async getProperties(agent: Agent): Promise<Property[]> {
    const ids = (agent.listings || []).map((id) => Number(id));
    const all = await this.propertiesService.findAll();
    return all.filter((p) => ids.includes(p.id));
  }

  async create(data: Partial<Agent>): Promise<Agent> {
    const existing = await this.repo.find();
    const slug = uniqueSlug(data.name || 'agent', existing);
    const agent = this.repo.create({
      name: '',
      slug,
      phone: '',
      phone2: '',
      whatsapp: '',
      email: '',
      image: '',
      title: '',
      bio: '',
      verified: false,
      listings: [],
      ...data,
    });
    return this.repo.save(agent);
  }

  async update(id: number, data: Partial<Agent>): Promise<Agent> {
    const agent = await this.findById(id);
    if (!agent) throw new NotFoundException();
    if (data.name) {
      const existing = (await this.repo.find()).filter((a) => a.id !== id);
      agent.slug = uniqueSlug(data.name, existing, agent.slug);
    }
    Object.assign(agent, data);
    return this.repo.save(agent);
  }

  async remove(id: number): Promise<void> {
    await this.repo.delete(id);
  }
}
