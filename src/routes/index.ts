import { Router, Request, Response } from 'express';
import { getFeatured, getAllProperties } from '../repositories/properties';
import { getAllAgents } from '../repositories/agents';
import { getAllPosts } from '../repositories/blog';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  const featured = getFeatured();
  const all = getAllProperties();
  const propertyTypes = [...new Set(all.map(p => p.type))]
    .map(type => ({ name: type, count: all.filter(p => p.type === type).length }));
  const stats = { years: 12, sold: 850, partners: 120, profits: 95 };
  res.render('index', {
    title: 'Express Realty Prime - Your Local Experts in Real Estate Excellence',
    currentPage: 'home',
    featured,
    propertyTypes,
    agents: getAllAgents(),
    blog: getAllPosts().slice(0, 3),
    stats,
  });
});

export default router;
