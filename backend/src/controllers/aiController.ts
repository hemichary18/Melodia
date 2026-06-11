import type { Request, Response, NextFunction } from 'express';
import { GoogleGenAI } from '@google/genai';
import Song from '../models/Song.js';

let ai: GoogleGenAI | null = null;
try {
  if (process.env.GEMINI_API_KEY) {
    ai = new GoogleGenAI({});
  }
} catch (e) {
  console.log("Could not initialize Gemini API");
}

// @desc    Get AI recommendations based on mood
// @route   POST /api/ai/recommend
// @access  Public (or Private depending on your setup, assuming Public for now)
export const getAIRecommendations = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { mood } = req.body;

    if (!mood) {
      res.status(400);
      throw new Error('Please provide a mood');
    }

    // 1. Fetch lightweight representations of all songs
    const allSongs = await Song.find().select('_id title artist genre tags').populate('artist', 'name');

    if (!allSongs || allSongs.length === 0) {
      res.status(404);
      throw new Error('No songs available in the database');
    }

    // 2. Map songs to a JSON-friendly format for the prompt
    const songCatalog = allSongs.map(song => ({
      id: song._id,
      title: song.title,
      artist: (song.artist as any)?.name || 'Unknown',
      genre: song.genre || 'Unknown',
      tags: song.tags || []
    }));

    let recommendedIds: string[] = [];

    if (ai && process.env.GEMINI_API_KEY) {
      // 3. Construct the prompt
      const prompt = `You are an expert AI DJ. 
The user is feeling: "${mood}". 
Based on the following catalog of songs, select up to 5 songs that best fit the user's mood.
Return ONLY a raw JSON array of the matching song IDs (strings). Do NOT return any markdown formatting, backticks, or extra text.

Catalog:
${JSON.stringify(songCatalog, null, 2)}`;

      try {
        // 4. Call Gemini
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: prompt,
        });

        let textResponse = response.text || '[]';
        
        // Clean up potential markdown formatting if Gemini still returns it
        if (textResponse.startsWith('```json')) {
          textResponse = textResponse.replace(/```json/g, '').replace(/```/g, '').trim();
        } else if (textResponse.startsWith('```')) {
          textResponse = textResponse.replace(/```/g, '').trim();
        }

        recommendedIds = JSON.parse(textResponse);
      } catch (e) {
        console.error('Failed to parse Gemini response or API error:', e);
      }
    }

    if (!Array.isArray(recommendedIds) || recommendedIds.length === 0) {
       console.log('Using local mock AI heuristic matching...');
       const keywords = mood.toLowerCase().split(/\W+/);
       
       const scoredSongs = allSongs.map(song => {
         let score = 0;
         const searchableText = `${song.title} ${song.genre} ${(song.tags || []).join(' ')}`.toLowerCase();
         keywords.forEach((kw: string) => {
           if (kw.length > 2 && searchableText.includes(kw)) score += 2;
         });
         score += Math.random(); // slight random jitter
         return { song, score };
       });

       scoredSongs.sort((a, b) => b.score - a.score);
       recommendedIds = scoredSongs.slice(0, 5).map(s => s.song._id.toString());
    }

    // 5. Fetch the fully populated recommended songs
    // Prevent Mongoose CastError if Gemini hallucinates invalid IDs
    const validIds = recommendedIds.filter(id => {
      try {
        return /^[0-9a-fA-F]{24}$/.test(id);
      } catch (err) {
        return false;
      }
    });

    const recommendedSongs = await Song.find({ _id: { $in: validIds } })
      .populate('artist', 'name bio image verified')
      .populate('album', 'title coverArtUrl');

    // If Gemini hallucinated all invalid IDs, fallback to heuristic
    if (recommendedSongs.length === 0 && mood) {
       console.log('Gemini returned invalid IDs, falling back to local mock AI heuristic matching...');
       const keywords = mood.toLowerCase().split(/\W+/);
       
       const scoredSongs = allSongs.map(song => {
         let score = 0;
         const searchableText = `${song.title} ${song.genre} ${(song.tags || []).join(' ')}`.toLowerCase();
         keywords.forEach((kw: string) => {
           if (kw.length > 2 && searchableText.includes(kw)) score += 2;
         });
         score += Math.random(); // slight random jitter
         return { song, score };
       });

       scoredSongs.sort((a, b) => b.score - a.score);
       const fallbackIds = scoredSongs.slice(0, 5).map(s => s.song._id);
       
       const fallbackSongs = await Song.find({ _id: { $in: fallbackIds } })
         .populate('artist', 'name bio image verified')
         .populate('album', 'title coverArtUrl');
         
       return res.json(fallbackSongs);
    }

    res.json(recommendedSongs);
  } catch (error) {
    next(error);
  }
};
