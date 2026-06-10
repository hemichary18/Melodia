import Song from '../models/Song.js';
import Artist from '../models/Artist.js';
// @desc    Upload a new song
// @route   POST /api/songs
// @access  Private (Artist or Admin)
export const uploadSong = async (req, res, next) => {
    try {
        const { title, duration, audioUrl, coverImage, coverArtUrl, genre, lyrics, album, artistName } = req.body;
        const userId = req.user?._id;
        if (!userId) {
            res.status(401);
            throw new Error('Not authorized');
        }
        let artistId;
        if (req.user?.role === 'ADMIN' && artistName) {
            // Find or create artist by name
            let artist = await Artist.findOne({ name: artistName });
            if (!artist) {
                artist = await Artist.create({
                    name: artistName,
                    bio: 'Auto-generated bio',
                    image: coverImage || coverArtUrl,
                    verified: false,
                    followers: 0
                });
            }
            artistId = artist._id;
        }
        else {
            // Regular artist flow
            const artist = await Artist.findOne({ user: userId });
            if (!artist) {
                res.status(403);
                throw new Error('Only registered artists can upload songs');
            }
            artistId = artist._id;
        }
        const song = await Song.create({
            title,
            artist: artistId,
            album,
            duration: duration || 180,
            audioUrl,
            coverImage: coverImage || coverArtUrl,
            genre,
            lyrics,
            tags: genre ? [genre.toLowerCase()] : []
        });
        res.status(201).json(song);
    }
    catch (error) {
        next(error);
    }
};
// @desc    Search songs
// @route   GET /api/songs/search
// @access  Public
export const searchSongs = async (req, res, next) => {
    try {
        const q = req.query.q;
        if (!q) {
            res.json([]);
            return;
        }
        // Search by title or genre
        const songs = await Song.find({
            $or: [
                { title: { $regex: q, $options: 'i' } },
                { genre: { $regex: q, $options: 'i' } },
                { tags: { $in: [new RegExp(q, 'i')] } }
            ]
        }).populate('artist', 'name image').limit(20);
        res.json(songs);
    }
    catch (error) {
        next(error);
    }
};
// @desc    Get all songs
// @route   GET /api/songs
// @access  Public
export const getAllSongs = async (req, res, next) => {
    try {
        const pageSize = 20;
        const page = Number(req.query.pageNumber) || 1;
        const count = await Song.countDocuments();
        const songs = await Song.find()
            .populate('artist', 'name bio image verified')
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ createdAt: -1 });
        res.json({ songs, page, pages: Math.ceil(count / pageSize) });
    }
    catch (error) {
        next(error);
    }
};
// @desc    Get song by ID
// @route   GET /api/songs/:id
// @access  Public
export const getSongById = async (req, res, next) => {
    try {
        const song = await Song.findById(req.params.id)
            .populate('artist', 'bio verified')
            .populate('album', 'title coverArtUrl');
        if (!song) {
            res.status(404);
            throw new Error('Song not found');
        }
        res.json(song);
    }
    catch (error) {
        next(error);
    }
};
// @desc    Get all songs by a specific artist
// @route   GET /api/songs/artist/:artistId
// @access  Public
export const getSongsByArtist = async (req, res, next) => {
    try {
        const artistId = req.params.artistId;
        const songs = await Song.find({ artist: artistId }).populate('album', 'title');
        res.json(songs);
    }
    catch (error) {
        next(error);
    }
};
//# sourceMappingURL=songController.js.map