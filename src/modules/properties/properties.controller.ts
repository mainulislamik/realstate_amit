import { Controller, Get, Res, Param, Query } from '@nestjs/common';
import { Response } from 'express';
import { PropertiesService } from './properties.service';

@Controller('properties')
export class PropertiesController {
  constructor(private readonly service: PropertiesService) {}

  @Get()
  async list(@Query() query: Record<string, string>, @Res() res: Response) {
    const all = await this.service.findAll();
    let filtered = [...all];
    const { type, status, location, minPrice, maxPrice, search } = query;

    if (type && type !== 'any') filtered = filtered.filter((p) => p.type.toLowerCase() === type.toLowerCase());
    if (status && status !== 'any') filtered = filtered.filter((p) => p.status.toLowerCase() === status.toLowerCase());
    if (location && location !== 'any') filtered = filtered.filter((p) => p.location.toLowerCase() === location.toLowerCase());
    if (minPrice) filtered = filtered.filter((p) => p.price >= Number(minPrice));
    if (maxPrice) filtered = filtered.filter((p) => p.price <= Number(maxPrice));
    if (search) filtered = filtered.filter((p) => p.title.toLowerCase().includes(search.toLowerCase()));

    const types = [...new Set(all.map((p) => p.type))];
    const locations = [...new Set(all.map((p) => p.location))];
    const statuses = [...new Set(all.map((p) => p.status))];

    res.render('properties', {
      title: 'Property Listings | Express Realty Prime',
      currentPage: 'properties',
      properties: filtered,
      types,
      locations,
      statuses,
      query,
    });
  }

  @Get(':slug')
  async detail(@Param('slug') slug: string, @Res() res: Response) {
    const property = await this.service.findBySlug(slug);
    if (!property) {
      return res.status(404).render('404', { title: 'Property Not Found', currentPage: '' });
    }
    res.render('property-detail', {
      title: `${property.title} | Express Realty Prime`,
      currentPage: 'properties',
      property,
    });
  }
}
