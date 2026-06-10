import type { Request, Response, NextFunction } from 'express';
export declare const uploadSong: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const searchSongs: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getAllSongs: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getSongById: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const getSongsByArtist: (req: Request, res: Response, next: NextFunction) => Promise<void>;
//# sourceMappingURL=songController.d.ts.map