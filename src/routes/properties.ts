import { Router, Request, Response } from 'express';
import { getAllProperties, getPropertyBySlug } from '../repositories/properties';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  let filtered = [...getAllProperties()];
  const { type, status, location, minPrice, maxPrice, search } = req.query as Record<string, string>;

  if (type && type !== 'any') filtered = filtered.filter(p => p.type.toLowerCase() === type.toLowerCase());
  if (status && status !== 'any') filtered = filtered.filter(p => p.status.toLowerCase() === status.toLowerCase());
  if (location && location !== 'any') filtered = filtered.filter(p => p.location.toLowerCase() === location.toLowerCase());
  if (minPrice) filtered = filtered.filter(p => p.price >= Number(minPrice));
  if (maxPrice) filtered = filtered.filter(p => p.price <= Number(maxPrice));
  if (search) filtered = filtered.filter(p => p.title.toLowerCase().includes(search.toLowerCase()));

  const types = [...new Set(getAllProperties().map(p => p.type))];
  const locations = [...new Set(getAllProperties().map(p => p.location))];
  const statuses = [...new Set(getAllProperties().map(p => p.status))];

  res.render('properties', {
    title: 'Property Listings | Express Realty Prime',
    currentPage: 'properties',
    properties: filtered,
    types,
    locations,
    statuses,
    query: req.query,
  });
});

router.get('/:slug', (req: Request, res: Response) => {
  const property = getPropertyBySlug(req.params.slug);
  if (!property) return res.status(404).render('404', { title: 'Property Not Found', currentPage: '' });
  res.render('property-detail', {
    title: `${property.title} | Express Realty Prime`,
    currentPage: 'properties',
    property,
  });
});

export default router;
