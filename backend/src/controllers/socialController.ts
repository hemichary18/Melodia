import type { Request, Response, NextFunction } from 'express';
import SocialPost from '../models/SocialPost.js';
import Community from '../models/Community.js';

// @desc    Get social feed
// @route   GET /api/social/feed
// @access  Private
export const getFeed = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await SocialPost.find()
      .populate('userId', 'username profilePictureUrl')
      .populate('attachedSongId', 'title coverImage')
      .sort({ createdAt: -1 })
      .limit(50);
      
    res.status(200).json(posts);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a post
// @route   POST /api/social/post
// @access  Private
export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { content, attachedSongId, communityId, imageUrl } = req.body;
    // req.user would be populated by auth middleware
    const userId = (req as any).user._id;

    const post = await SocialPost.create({
      userId,
      content,
      attachedSongId,
      communityId,
      imageUrl
    });

    res.status(201).json(post);
  } catch (error) {
    next(error);
  }
};

// @desc    Get communities
// @route   GET /api/social/communities
// @access  Private
export const getCommunities = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const communities = await Community.find()
      .populate('adminId', 'username')
      .sort({ createdAt: -1 });
      
    res.status(200).json(communities);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a community
// @route   POST /api/social/communities
// @access  Private
export const createCommunity = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, description, genre, coverImageUrl } = req.body;
    const adminId = (req as any).user._id;

    const community = await Community.create({
      name,
      description,
      genre,
      coverImageUrl,
      adminId,
      members: [adminId]
    });

    const populatedCommunity = await Community.findById(community._id).populate('adminId', 'username');

    res.status(201).json(populatedCommunity);
  } catch (error) {
    next(error);
  }
};
