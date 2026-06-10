import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/generateToken.js';
// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
    try {
        const { username, email, password } = req.body;
        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);
        const user = await User.create({
            username,
            email,
            passwordHash,
        });
        if (user) {
            generateToken(res, user._id);
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            });
        }
        else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    }
    catch (error) {
        next(error);
    }
};
// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
    try {
        const { email, username, password } = req.body;
        // Support login by either email or username
        const user = await User.findOne({
            $or: [
                { email: email || username },
                { username: username || email }
            ]
        });
        if (user && (await bcrypt.compare(password, user.passwordHash || ''))) {
            generateToken(res, user._id);
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
            });
        }
        else {
            res.status(401);
            throw new Error('Invalid username/email or password');
        }
    }
    catch (error) {
        next(error);
    }
};
// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Public
export const logoutUser = (req, res) => {
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
};
//# sourceMappingURL=authController.js.map