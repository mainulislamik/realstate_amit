import { Router, Request, Response } from 'express';
import { requireAuth, requireGuest } from '../middleware/auth';
import { verify } from '../repositories/users';
import { getAllProperties } from '../repositories/properties';
import { getAllAgents } from '../repositories/agents';
import { getAllPosts } from '../repositories/blog';
import adminProperties from './admin/properties';
import adminAgents from './admin/agents';
import adminBlog from './admin/blog';

const router = Router();

router.use('/properties', requireAuth, adminProperties);
router.use('/agents', requireAuth, adminAgents);
router.use('/blog', requireAuth, adminBlog);

router.get('/login', requireGuest, (req: Request, res: Response) => {
  res.render('admin/login', { title: 'Admin Login', error: '' });
});

router.post('/login', requireGuest, (req: Request, res: Response) => {
  const { username, password } = req.body;
  const user = verify(username, password);
  if (!user) {
    return res.render('admin/login', { title: 'Admin Login', error: 'Invalid username or password' });
  }
  req.session.userId = user.id;
  req.session.username = user.username;
  res.redirect('/admin');
});

router.get('/logout', (req: Request, res: Response) => {
  req.session.destroy(() => res.redirect('/admin/login'));
});

router.get('/', requireAuth, (req: Request, res: Response) => {
  res.render('admin/dashboard', {
    title: 'Admin Dashboard',
    username: req.session.username,
    counts: {
      properties: getAllProperties().length,
      agents: getAllAgents().length,
      posts: getAllPosts().length,
    },
  });
});

export default router;
