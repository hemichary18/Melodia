import type { Request, Response } from 'express';
import Playlist from '../models/Playlist.js';

export const createPlaylist = async (req: Request, res: Response) => {
  try {
    const { title, description, songs } = req.body;
    const playlist = new Playlist({
      title,
      description,
      creator: req.user._id,
      songs: songs || []
    });
    
    const savedPlaylist = await playlist.save();
    res.status(201).json(savedPlaylist);
  } catch (error) {
    res.status(500).json({ message: 'Error creating playlist', error });
  }
};

export const getUserPlaylists = async (req: Request, res: Response) => {
  try {
    const playlists = await Playlist.find({ creator: req.user._id })
      .populate('songs', 'title artist coverArtUrl');
    res.json(playlists);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching playlists', error });
  }
};

export const addSongToPlaylist = async (req: Request, res: Response) => {
  try {
    const { playlistId, songId } = req.body;
    const playlist = await Playlist.findOne({ _id: playlistId, creator: req.user._id });
    
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found or unauthorized' });
    }
    
    if (!playlist.songs.includes(songId)) {
      playlist.songs.push(songId);
      await playlist.save();
    }
    
    res.json(playlist);
  } catch (error) {
    res.status(500).json({ message: 'Error adding song', error });
  }
};

export const deletePlaylist = async (req: Request, res: Response) => {
  try {
    const playlist = await Playlist.findOne({ _id: req.params.id, creator: req.user._id });
    
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found or unauthorized' });
    }
    
    await playlist.deleteOne();
    res.json({ message: 'Playlist deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting playlist', error });
  }
};
