import { Request, Response, NextFunction } from 'express';
import { findById } from '../repositories/users';

declare module 'express-session' {
  interface SessionData {
    userId?: number;
    username?: string;
  }
}

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  if (req.session && req.session.userId) {
    const user = findById(req.session.userId);
    if (user) return next();
  }
  res.redirect('/admin/login');
}

export function requireGuest(req: Request, res: Response, next: NextFunction): void {
  if (req.session && req.session.userId) return res.redirect('/admin');
  next();
}
