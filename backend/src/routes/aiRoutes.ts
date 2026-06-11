import express from 'express';
import { getAIRecommendations } from '../controllers/aiController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/recommend', getAIRecommendations); // Open to all, but can add protect middleware if needed

export default router;
