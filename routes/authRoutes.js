const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db'); 
const router = express.Router();
const rateLimit = require('express-rate-limit');

// Signup rate limiter
const signupLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // limit each IP to 5 signup attempts
    message: 'Too many signup attempts, please try again later',
    standardHeaders: true, // Return rate limit info in RateLimit-* headers
    legacyHeaders: false, // Disable X-RateLimit-* headers
});

// Generate refresh token
const generateRefreshToken = (userId) => {
    return jwt.sign(
        { userId, type: 'refresh' },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    );
};

// Signup route
router.post('/signup', signupLimiter, async (req, res) => {
    const { name, email, password, role } = req.body;

    // Validation
    if (!name || !email || !password || !role) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    // Password strength validation
    if (password.length < 8) {
        return res.status(400).json({ error: 'Password must be at least 8 characters long' });
    }

    // Allowed roles
    const validRoles = ['patient', 'specialist', 'admin', 'pcp'];
    if (!validRoles.includes(role)) {
        return res.status(400).json({ error: 'Invalid role selected' });
    }

    try {
        // Check if email already exists
        const existingUserResult = await pool.query(
            'SELECT * FROM users WHERE email = $1', 
            [email]
        );

        if (existingUserResult.rows.length > 0) {
            return res.status(409).json({ error: 'Email already in use' });
        }

        // Hash password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert new user
        const insertResult = await pool.query(
            'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id', 
            [name, email, hashedPassword, role]
        );

        // Log successful signup
        console.log(`New user signup: ${email} (Role: ${role})`);

        res.status(201).json({ 
            message: 'Signup successful', 
            userId: insertResult.rows[0].id 
        });

    } catch (error) {
        // Log server errors
        console.error('Signup error:', error);

        res.status(500).json({ 
            error: 'Server error', 
            details: process.env.NODE_ENV === 'development' ? error.message : null 
        });
    }
});
// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    // Input validation
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Find user by email
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = userResult.rows[0];

        // Check if user exists
        if (!user) {
            // Use consistent error message to prevent email enumeration
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Compare passwords
        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        
        if (isPasswordCorrect) {
            // Generate JWT token
            const token = jwt.sign(
                { 
                    userId: user.id, 
                    email: user.email, 
                    role: user.role 
                },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            // Log successful login (optional but recommended for security tracking)
            console.log(`Successful login for user: ${email}`);

            // Return token and user role
            res.json({ 
                token, 
                role: user.role,
                message: 'Login successful' 
            });
        } else {
            // Log failed login attempt (optional)
            console.log(`Failed login attempt for email: ${email}`);
            
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        // Log server errors
        console.error('Login error:', error);
        
        res.status(500).json({ 
            error: 'Server error', 
            details: process.env.NODE_ENV === 'development' ? error.message : null 
        });
    }
});
router.post('/logout', (req, res) => {
    // Optionally implement token blacklisting
    res.json({ message: 'Logged out successfully' });
  });
  
  router.post('/refresh-token', async (req, res) => {
    const { refreshToken } = req.body;
    // Implement token validation and refresh logic
  });
module.exports = router;
