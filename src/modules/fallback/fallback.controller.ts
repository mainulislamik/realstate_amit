import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller()
export class FallbackController {
  @Get('*')
  notFound(@Res() res: Response) {
    res.status(404).render('404', { title: 'Page Not Found', currentPage: '' });
  }
}
