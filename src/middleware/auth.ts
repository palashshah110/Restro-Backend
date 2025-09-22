import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env';
import { User } from '../models/User';
import { AppError } from '../utils/AppError';

interface AuthRequest extends Request {
  user?: any;
}

export const authenticate = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    let token: string | undefined;

    // Get token from header
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('No token provided, authorization denied', 401));
    }

    // Verify token
    const decoded = jwt.verify(token, config.JWT_SECRET) as any;
    
    // Check if user still exists
    const user = await User.findById(decoded.id);
    if (!user) {
      return next(new AppError('User not found', 401));
    }

    req.user = user;
    next();
  } catch (error) {
    return next(new AppError('Invalid token', 401));
  }
};

// Dummy authentication for testing
export const dummyAuth = (req: AuthRequest, res: Response, next: NextFunction) => {
  req.user = { id: 'admin', email: 'admin@example.com', role: 'admin' };
  next();
};
