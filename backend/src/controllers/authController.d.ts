import type { Request, Response, NextFunction } from 'express';
export declare const registerUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const loginUser: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const logoutUser: (req: Request, res: Response) => void;
//# sourceMappingURL=authController.d.ts.map