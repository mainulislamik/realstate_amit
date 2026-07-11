import { Router, Request, Response } from 'express';
import { upload } from '../../middleware/upload';
import {
  getAllPosts, getPostById, createPost, updatePost, deletePost,
} from '../../repositories/blog';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.render('admin/blog', { title: 'Manage Blog', posts: getAllPosts() });
});

router.get('/new', (req: Request, res: Response) => {
  res.render('admin/blog-form', { title: 'New Post', post: null });
});

router.post('/', upload.single('imageFile'), (req: Request, res: Response) => {
  const b = req.body;
  createPost({
    title: b.title,
    category: b.category,
    excerpt: b.excerpt,
    content: b.content,
    image: req.file ? `/uploads/${req.file.filename}` : (b.image || ''),
  });
  res.redirect('/admin/blog');
});

router.get('/:id/edit', (req: Request, res: Response) => {
  const post = getPostById(Number(req.params.id));
  if (!post) return res.redirect('/admin/blog');
  res.render('admin/blog-form', { title: 'Edit Post', post });
});

router.post('/:id', upload.single('imageFile'), (req: Request, res: Response) => {
  const b = req.body;
  const data: any = {
    title: b.title,
    category: b.category,
    excerpt: b.excerpt,
    content: b.content,
  };
  if (req.file) data.image = `/uploads/${req.file.filename}`;
  else if (b.image) data.image = b.image;
  updatePost(Number(req.params.id), data);
  res.redirect('/admin/blog');
});

router.post('/:id/delete', (req: Request, res: Response) => {
  deletePost(Number(req.params.id));
  res.redirect('/admin/blog');
});

export default router;
