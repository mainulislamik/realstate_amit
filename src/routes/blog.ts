import { Router, Request, Response } from 'express';
import { getAllPosts, getPostBySlug } from '../repositories/blog';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.render('blog', {
    title: 'Blog | Express Realty Prime',
    currentPage: 'blog',
    posts: getAllPosts(),
  });
});

router.get('/:slug', (req: Request, res: Response) => {
  const post = getPostBySlug(req.params.slug);
  if (!post) return res.status(404).render('404', { title: 'Post Not Found', currentPage: '' });
  res.render('blog-detail', {
    title: `${post.title} | Express Realty Prime`,
    currentPage: 'blog',
    post,
  });
});

export default router;
