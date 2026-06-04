import express from 'express';
import { uploadSong, getAllSongs, getSongById, getSongsByArtist, searchSongs } from '../controllers/songController.js';
import { protect, authorizeRoles } from '../middleware/authMiddleware.js';
import { UserRole } from '../models/User.js';

const router = express.Router();

router.route('/search').get(searchSongs);

router.route('/')
  .post(protect, authorizeRoles(UserRole.ARTIST, UserRole.ADMIN), uploadSong)
  .get(getAllSongs);

router.route('/:id')
  .get(getSongById);

router.route('/artist/:artistId')
  .get(getSongsByArtist);

export default router;
