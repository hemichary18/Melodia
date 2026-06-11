import jwt from 'jsonwebtoken';
import type { Response } from 'express';
import mongoose from 'mongoose';

export const generateToken = (res: Response, userId: mongoose.Types.ObjectId) => {
  const secret = process.env.JWT_SECRET || 'fallback_secret';
  
  const token = jwt.sign({ userId }, secret, {
    expiresIn: '30d' // 30 days
  });

  // Set JWT as HTTP-Only cookie
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: true, // Always true for SameSite 'none'
    sameSite: 'none', // Always 'none' to allow cross-origin requests from Vercel to Render
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });

  return token;
};
