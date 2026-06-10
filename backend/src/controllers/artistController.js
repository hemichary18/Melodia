import Artist from '../models/Artist.js';
import User, { UserRole } from '../models/User.js';
// @desc    Create artist profile
// @route   POST /api/artists
// @access  Private
export const createArtistProfile = async (req, res, next) => {
    try {
        const { bio } = req.body;
        const userId = req.user?._id;
        if (!userId) {
            res.status(401);
            throw new Error('Not authorized');
        }
        // Check if artist profile already exists
        const existingArtist = await Artist.findOne({ user: userId });
        if (existingArtist) {
            res.status(400);
            throw new Error('Artist profile already exists for this user');
        }
        const artist = await Artist.create({
            user: userId,
            bio
        });
        // Optionally update user role to ARTIST
        if (req.user?.role !== UserRole.ARTIST) {
            await User.findByIdAndUpdate(userId, { role: UserRole.ARTIST });
        }
        res.status(201).json(artist);
    }
    catch (error) {
        next(error);
    }
};
// @desc    Get all artists
// @route   GET /api/artists
// @access  Public
export const getAllArtists = async (req, res, next) => {
    try {
        const artists = await Artist.find().populate('user', 'username profilePictureUrl');
        res.json(artists);
    }
    catch (error) {
        next(error);
    }
};
// @desc    Get artist by ID
// @route   GET /api/artists/:id
// @access  Public
export const getArtistById = async (req, res, next) => {
    try {
        const artist = await Artist.findById(req.params.id).populate('user', 'username profilePictureUrl');
        if (!artist) {
            res.status(404);
            throw new Error('Artist not found');
        }
        res.json(artist);
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=artistController.js.map