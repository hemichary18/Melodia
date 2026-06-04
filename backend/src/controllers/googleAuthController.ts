import type { Request, Response, NextFunction } from 'express';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// @desc    Auth user via Google & get token
// @route   POST /api/auth/google
// @access  Public
export const googleLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      res.status(400);
      throw new Error('No credential provided');
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID as string,
    });

    const payload = ticket.getPayload();
    
    if (!payload) {
      res.status(400);
      throw new Error('Invalid Google token');
    }

    const { sub: googleId, email, name, picture } = payload;

    if (!email) {
      res.status(400);
      throw new Error('Google token did not provide an email');
    }

    // Check if user already exists
    let user = await User.findOne({ email: email as string });

    if (user) {
      // User exists, but might have signed up with local provider initially
      if (user.authProvider === 'local' && !user.googleId) {
        // Link google account to existing local account
        user.googleId = googleId;
        user.authProvider = 'google';
        if (picture && !user.profilePictureUrl) {
           user.profilePictureUrl = picture;
        }
        await user.save();
      }
    } else {
      // Create new user
      user = await User.create({
        email: email as string,
        username: (name || 'user').replace(/\s+/g, '').toLowerCase() + Math.floor(Math.random() * 1000),
        googleId,
        authProvider: 'google',
        profilePictureUrl: picture || '',
      }) as any;
    }

    if (!user) {
      throw new Error('Failed to create or retrieve user');
    }

    generateToken(res, user._id as any);
    
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      role: user.role,
      profilePictureUrl: user.profilePictureUrl,
    });

  } catch (error) {
    console.error('Google Auth Error:', error);
    next(error);
  }
};
