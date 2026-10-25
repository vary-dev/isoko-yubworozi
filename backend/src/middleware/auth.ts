import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: { id: string; role: string };
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Not authorized, no token provided' });
    }

    if (!process.env.JWT_SECRET) return res.status(500).json({ message: 'Authentication is not configured' });
    const token = authHeader.split(' ')[1]!;
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as { id: string; role: string };

    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (error) {
    return res.status(401).json({ message: 'Not authorized, invalid token' });
  }
};

/** Attach a valid session when present, while keeping public resources public. */
export const optionalProtect = (req: AuthRequest, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ') || !process.env.JWT_SECRET) return next();
  try {
    const decoded = jwt.verify(authHeader.split(' ')[1]!, process.env.JWT_SECRET) as { id: string; role: string };
    req.user = { id: decoded.id, role: decoded.role };
  } catch {
    // An invalid optional token must not hide free books. Premium access still
    // fails safely because getBookAccess requires req.user.
  }
  next();
};

export const adminOnly = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ message: 'Access denied. Admin only.' });
  }
  next();
};
