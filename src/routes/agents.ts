import { Router, Request, Response } from 'express';
import { getAllAgents, getAgentBySlug } from '../repositories/agents';
import { getPropertyById } from '../repositories/properties';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.render('agents', {
    title: 'Our Agents | Express Realty Prime',
    currentPage: 'agents',
    agents: getAllAgents(),
  });
});

router.get('/:slug', (req: Request, res: Response) => {
  const agent = getAgentBySlug(req.params.slug);
  if (!agent) return res.status(404).render('404', { title: 'Agent Not Found', currentPage: '' });
  const agentProperties = (agent.listings || []).map(id => getPropertyById(id)).filter(Boolean);
  res.render('agent-detail', {
    title: `${agent.name} | Express Realty Prime`,
    currentPage: 'agents',
    agent,
    properties: agentProperties,
  });
});

export default router;
