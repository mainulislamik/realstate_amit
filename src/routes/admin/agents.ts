import { Router, Request, Response } from 'express';
import { upload } from '../../middleware/upload';
import {
  getAllAgents, getAgentById, createAgent, updateAgent, deleteAgent,
} from '../../repositories/agents';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.render('admin/agents', { title: 'Manage Agents', agents: getAllAgents() });
});

router.get('/new', (req: Request, res: Response) => {
  res.render('admin/agent-form', { title: 'New Agent', agent: null });
});

router.post('/', upload.single('imageFile'), (req: Request, res: Response) => {
  const b = req.body;
  createAgent({
    name: b.name,
    title: b.title,
    phone: b.phone,
    phone2: b.phone2,
    whatsapp: b.whatsapp,
    email: b.email,
    bio: b.bio,
    image: req.file ? `/uploads/${req.file.filename}` : (b.image || ''),
    verified: b.verified === 'on',
    listings: b.listings ? String(b.listings).split(',').map(Number).filter(n => !isNaN(n)) : [],
  });
  res.redirect('/admin/agents');
});

router.get('/:id/edit', (req: Request, res: Response) => {
  const agent = getAgentById(Number(req.params.id));
  if (!agent) return res.redirect('/admin/agents');
  res.render('admin/agent-form', { title: 'Edit Agent', agent });
});

router.post('/:id', upload.single('imageFile'), (req: Request, res: Response) => {
  const b = req.body;
  const data: any = {
    name: b.name,
    title: b.title,
    phone: b.phone,
    phone2: b.phone2,
    whatsapp: b.whatsapp,
    email: b.email,
    bio: b.bio,
    verified: b.verified === 'on',
    listings: b.listings ? String(b.listings).split(',').map(Number).filter(n => !isNaN(n)) : [],
  };
  if (req.file) data.image = `/uploads/${req.file.filename}`;
  else if (b.image) data.image = b.image;
  updateAgent(Number(req.params.id), data);
  res.redirect('/admin/agents');
});

router.post('/:id/delete', (req: Request, res: Response) => {
  deleteAgent(Number(req.params.id));
  res.redirect('/admin/agents');
});

export default router;
