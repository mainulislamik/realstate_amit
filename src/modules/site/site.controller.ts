import { Controller, Get, Post, Res, Body } from '@nestjs/common';
import { Response } from 'express';
import { PropertiesService } from '../properties/properties.service';
import { AgentsService } from '../agents/agents.service';
import { BlogService } from '../blog/blog.service';

@Controller()
export class SiteController {
  constructor(
    private readonly properties: PropertiesService,
    private readonly agents: AgentsService,
    private readonly blog: BlogService,
  ) {}

  @Get()
  async home(@Res() res: Response) {
    const all = await this.properties.findAll();
    const propertyTypes = [...new Set(all.map((p) => p.type))].map((name) => ({
      name,
      count: all.filter((p) => p.type === name).length,
    }));
    const stats = { years: 12, sold: 850, partners: 120, profits: 95 };
    res.render('index', {
      title: 'Express Realty Prime - Your Local Experts in Real Estate Excellence',
      currentPage: 'home',
      featured: await this.properties.findFeatured(),
      propertyTypes,
      agents: await this.agents.findAll(),
      blog: (await this.blog.findAll()).slice(0, 3),
      stats,
    });
  }

  @Get('contact')
  contact(@Res() res: Response) {
    res.render('contact', {
      title: 'Contact Us | Express Realty Prime',
      currentPage: 'contact',
      message: '',
    });
  }

  @Post('contact')
  contactPost(@Body() body: { name?: string; email?: string; phone?: string; message?: string }, @Res() res: Response) {
    console.log('Contact form submission:', {
      name: body.name,
      email: body.email,
      phone: body.phone,
      message: body.message,
    });
    res.render('contact', {
      title: 'Contact Us | Express Realty Prime',
      currentPage: 'contact',
      message: 'Thank you for your message! We will get back to you soon.',
    });
  }
}
