import type { Request, Response, NextFunction } from 'express';
import { type IUser, UserRole } from '../models/User.js';
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}
export declare const protect: (req: Request, res: Response, next: NextFunction) => Promise<void>;
export declare const authorizeRoles: (...roles: UserRole[]) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=authMiddleware.d.ts.map