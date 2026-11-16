import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import User from '../models/User.js';
import mongoose from 'mongoose';
import { getLocalUsers } from '../controllers/authController.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'velvi-dev-secret-key-2026');

    // If MongoDB is connected
    if (mongoose.connection.readyState === 1) {
      const user = await User.findById(decoded.id);
      if (!user) {
        res.status(401);
        throw new Error('Not authorized, user not found');
      }
      if (!user.isActive) {
        res.status(401);
        throw new Error('Account has been deactivated');
      }
      req.user = user;
      return next();
    }

    // Fallback offline user check
    const localUsers = getLocalUsers();
    const user = localUsers.find((u) => u._id === decoded.id);
    if (!user) {
      res.status(401);
      throw new Error('Not authorized, user not found');
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
});

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  res.status(403);
  throw new Error('Admin privileges required');
};
