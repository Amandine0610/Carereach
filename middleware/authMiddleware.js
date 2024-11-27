const jwt = require('jsonwebtoken');
const jwtSecret = process.env.JWT_SECRET;

function authenticateJWT(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1]; // Extract token from Authorization header

    if (!token) {
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Invalid or expired token.' });
        }
        req.user = user; // Attach user info to the request object
        next();
    });
    }
function authorize(roles = []) {
    // roles should be an array of roles that are allowed to access the route
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Forbidden: You do not have the required permissions.' });
        }
        next();
    };
}

module.exports = { authenticateJWT, authorize };


