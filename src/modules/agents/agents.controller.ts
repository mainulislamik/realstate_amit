import { Controller, Get, Res, Param } from '@nestjs/common';
import { Response } from 'express';
import { AgentsService } from './agents.service';

@Controller('agents')
export class AgentsController {
  constructor(private readonly service: AgentsService) {}

  @Get()
  async list(@Res() res: Response) {
    res.render('agents', {
      title: 'Our Agents | Express Realty Prime',
      currentPage: 'agents',
      agents: await this.service.findAll(),
    });
  }

  @Get(':slug')
  async detail(@Param('slug') slug: string, @Res() res: Response) {
    const agent = await this.service.findBySlug(slug);
    if (!agent) {
      return res.status(404).render('404', { title: 'Agent Not Found', currentPage: '' });
    }
    const properties = await this.service.getProperties(agent);
    res.render('agent-detail', {
      title: `${agent.name} | Express Realty Prime`,
      currentPage: 'agents',
      agent,
      properties,
    });
  }
}
