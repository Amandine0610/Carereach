const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db'); 
const router = express.Router();

// Signup route
router.post('/signup', async (req, res) => {
    const { email, password, name = '', role = 'user' } = req.body;
    try {
        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'User already exists' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query(
            'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4)',
            [email, hashedPassword, name, role]
        );
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Login route
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = userResult.rows[0];
        if (user && await bcrypt.compare(password, user.password)) {
        const token = jwt.sign(
                { userId: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET, 
            { expiresIn: '1h' }
        );
            res.json({ token, role: user.role });
        } else {
            res.status(401).json({ error: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});
module.exports = router;
