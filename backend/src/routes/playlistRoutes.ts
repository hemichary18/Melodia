import express from 'express';
import { createPlaylist, getUserPlaylists, addSongToPlaylist, deletePlaylist, getPlaylistById } from '../controllers/playlistController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createPlaylist)
  .get(protect, getUserPlaylists);

router.post('/add-song', protect, addSongToPlaylist);
router.route('/:id')
  .get(protect, getPlaylistById)
  .delete(protect, deletePlaylist);

export default router;
