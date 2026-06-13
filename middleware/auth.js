const jwt = require('jsonwebtoken');
const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return next(new HttpError('Authentication required!', 401));
        }

        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);
        req.userData = { userId: decodedToken.userId };
        next();
    }catch (err) {
        return next(new HttpError('Authentication failed!', 401));
    }
}