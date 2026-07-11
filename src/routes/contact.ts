import { Router, Request, Response } from 'express';

const router = Router();

router.get('/', (req: Request, res: Response) => {
  res.render('contact', {
    title: 'Contact Us | Express Realty Prime',
    currentPage: 'contact',
    message: '',
  });
});

router.post('/', (req: Request, res: Response) => {
  const { name, email, phone, message: msg } = req.body;
  console.log('Contact form submission:', { name, email, phone, msg });
  res.render('contact', {
    title: 'Contact Us | Express Realty Prime',
    currentPage: 'contact',
    message: 'Thank you for your message! We will get back to you soon.',
  });
});

export default router;
