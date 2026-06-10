import jwt from 'jsonwebtoken';
import User, { UserRole } from '../models/User.js';
export const protect = async (req, res, next) => {
    let token;
    token = req.cookies.jwt;
    if (token) {
        try {
            const secret = process.env.JWT_SECRET || 'fallback_secret';
            const decoded = jwt.verify(token, secret);
            const user = await User.findById(decoded.userId).select('-passwordHash');
            if (!user) {
                res.status(401);
                throw new Error('Not authorized, user not found');
            }
            req.user = user;
            next();
        }
        catch (error) {
            console.error(error);
            res.status(401);
            next(new Error('Not authorized, token failed'));
        }
    }
    else {
        res.status(401);
        next(new Error('Not authorized, no token'));
    }
};
// RBAC Middleware
export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403);
            return next(new Error(`User role ${req.user?.role} is not authorized to access this route`));
        }
        next();
    };
};
//# sourceMappingURL=authMiddleware.js.map