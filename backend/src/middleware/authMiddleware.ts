import jwt from 'jsonwebtoken';
import type { Request, Response, NextFunction } from 'express';
import User, { type IUser, UserRole } from '../models/User.js';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;

  token = req.cookies.jwt;

  if (token) {
    try {
      const secret = process.env.JWT_SECRET || 'fallback_secret';
      const decoded = jwt.verify(token, secret) as { userId: string };

      const user = await User.findById(decoded.userId).select('-passwordHash');
      if (!user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }

      req.user = user;
      next();
    } catch (error) {
      console.error(error);
      res.status(401);
      next(new Error('Not authorized, token failed'));
    }
  } else {
    res.status(401);
    next(new Error('Not authorized, no token'));
  }
};

// RBAC Middleware
export const authorizeRoles = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      res.status(403);
      return next(new Error(`User role ${req.user?.role} is not authorized to access this route`));
    }
    next();
  };
};
