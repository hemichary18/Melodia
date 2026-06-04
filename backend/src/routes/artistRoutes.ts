import express from 'express';
import { createArtistProfile, getAllArtists, getArtistById } from '../controllers/artistController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(protect, createArtistProfile)
  .get(getAllArtists);

router.route('/:id')
  .get(getArtistById);

export default router;
