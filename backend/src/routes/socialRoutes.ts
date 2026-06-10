import express from 'express';
import { getFeed, createPost, getCommunities, createCommunity } from '../controllers/socialController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/feed').get(protect, getFeed);
router.route('/post').post(protect, createPost);
router.route('/communities')
  .get(protect, getCommunities)
  .post(protect, createCommunity);

export default router;
