import type { Request, Response, NextFunction } from 'express';
import User from '../models/User.js';

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user?._id);

    if (user) {
      user.username = req.body.username || user.username;
      
      const updatedUser = await user.save();

      res.status(200).json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        role: updatedUser.role,
        profilePictureUrl: updatedUser.profilePictureUrl,
      });
    } else {
      res.status(404);
      throw new Error('User not found');
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle like on a song
// @route   POST /api/users/like-song/:songId
// @access  Private
export const toggleLikeSong = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user?._id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    const { songId } = req.params;
    const isLiked = user.likedSongs.includes(songId as any);

    if (isLiked) {
      user.likedSongs = user.likedSongs.filter(id => id.toString() !== songId);
    } else {
      user.likedSongs.push(songId as any);
    }

    await user.save();
    res.json({ liked: !isLiked });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user library (liked songs)
// @route   GET /api/users/library
// @access  Private
export const getLikedSongs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user?._id).populate({
      path: 'likedSongs',
      populate: {
        path: 'artist',
        select: 'name image'
      }
    });
    
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }

    res.json(user.likedSongs);
  } catch (error) {
    next(error);
  }
};
