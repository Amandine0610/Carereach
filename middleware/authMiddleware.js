const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {  // or some other authentication check logic
        return next();
    } else {
        return res.status(401).json({ error: 'Unauthorized' });
    }
};

module.exports = { isAuthenticated };
