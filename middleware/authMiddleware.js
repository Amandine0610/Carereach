// middleware/authMiddleware.js
const jwt = require('jsonwebtoken');

// Existing authentication functions
const authenticate = (req, res, next) => {
    // Your existing authentication logic
};

const authorize = (roles) => {
    // Your existing authorization logic
};

// New JWT authentication middleware
const authenticateJWT = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                return res.sendStatus(403); // Forbidden
            }

            req.user = user;
            next();
        });
    } else {
        res.sendStatus(401); // Unauthorized
    }
};

module.exports = { 
    authenticate, 
    authorize, 
    authenticateJWT 
};