const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const HttpError = require('../models/http-error');

const generateToken = (userId, email) => {
    return jwt.sign(
        { userId, email},
        process.env.JWT_KEY,
        { expiresIn: '1h'}
    );
};

// POST /api/auth/register
// Signup user
const registerUser = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return next(new HttpError('Email already in use', 409));
        }

        const passwordHash = await bcrypt.hash(password, 10);
        const user = await User.create({ name, email, passwordHash });

        const token = generateToken(user.id, user.email);

        res.status(201).json({
            success: true,
            user: { id: user.id, name: user.name, email: user.email },
            token,
        });
    }catch (err) {
        return next(new HttpError('Registration failed, please try again later.', 500));
    }
};

// POST /api/auth/login
// Login a user
const loginUser = async(req, res, next) => {
    try {
        const { email, password } = req.body;

        const existingUser = await User.findOne({ email });
        if(!existingUser) {
            return next(new HttpError('Invalid credentials, could not log you in.', 403));
        }

        const isValidPassword = await bcrypt.compare(password, existingUser.passwordHash);

        if(!isValidPassword) {
            return next(new HttpError('Invalid credentials, could not log you in.', 403));
        }

        const token = generateToken(existingUser.id, existingUser.email);

        res.json({
            userId: existingUser.id,
            email: existingUser.email,
            token,
        })
    }catch (err) {
        return next(new HttpError('Logging in failed, please try again later.', 500));
    }

};

module.exports = { registerUser, loginUser };