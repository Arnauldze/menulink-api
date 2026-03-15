const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authMiddleware = async (req, res, next) => {
    try {
        // 1. Get token from header
        const authHeader = req.header('Authorization');
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                error: { message: 'No token, authorization denied' }
            });
        }

        const token = authHeader.replace('Bearer ', '');

        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_temporary_key_for_dev');

        // 3. Attach user (and most importantly, their restaurant_id) to the request
        req.user = decoded.user;

        next();
    } catch (error) {
        res.status(401).json({
            success: false,
            error: { message: 'Token is not valid' }
        });
    }
};

module.exports = authMiddleware;
