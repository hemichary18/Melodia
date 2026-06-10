import express from 'express';
import { updateUserProfile, toggleLikeSong, getLikedSongs } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';
const router = express.Router();
router.put('/profile', protect, updateUserProfile);
router.post('/like-song/:songId', protect, toggleLikeSong);
router.get('/library', protect, getLikedSongs);
export default router;
//# sourceMappingURL=userRoutes.js.map