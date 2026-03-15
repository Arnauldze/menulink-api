const jwt = require('jsonwebtoken');

/**
 * Middleware that optionally decodes a JWT token if present.
 * Does NOT block the request if the token is missing or invalid.
 */
const optionalAuth = (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.replace('Bearer ', '');
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'super_secret_temporary_key_for_dev');
            req.user = decoded.user;
        }
    } catch (error) {
        // Token is present but invalid? We ignore it and stay in "guest" mode
        // Or we could log it for debugging
    }
    next();
};

module.exports = optionalAuth;
