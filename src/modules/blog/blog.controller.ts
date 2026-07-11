import { Controller, Get, Res, Param } from '@nestjs/common';
import { Response } from 'express';
import { BlogService } from './blog.service';

@Controller('blog')
export class BlogController {
  constructor(private readonly service: BlogService) {}

  @Get()
  async list(@Res() res: Response) {
    res.render('blog', {
      title: 'Blog | Express Realty Prime',
      currentPage: 'blog',
      posts: await this.service.findAll(),
    });
  }

  @Get(':slug')
  async detail(@Param('slug') slug: string, @Res() res: Response) {
    const post = await this.service.findBySlug(slug);
    if (!post) {
      return res.status(404).render('404', { title: 'Post Not Found', currentPage: '' });
    }
    res.render('blog-detail', {
      title: `${post.title} | Express Realty Prime`,
      currentPage: 'blog',
      post,
    });
  }
}
