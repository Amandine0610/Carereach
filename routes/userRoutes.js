// userRoutes.js
const express = require('express');
const pool = require('../config/db');
const { authenticateJWT } = require('../middleware/authMiddleware');
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/adminController'); // Adjust the path if needed
const router = express.Router();
const bcrypt = require('bcrypt');

// User Registration
router.post('/register', async (req, res) => { 
    try {
        const { email, name, password, role } = req.body;

        // Validation
        if (!email || !name || !password) {
            return res.status(400).json({ success: false, error: 'All fields are required' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);  // Using bcrypt for hashing

        const result = await pool.query(
            'INSERT INTO users (email, name, password, role) VALUES ($1, $2, $3, $4) RETURNING *',
            [email, name, hashedPassword, role]
        );
        res.status(201).json({ success: true, user: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: 'Error creating user' });
    } 
});

// User Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Generate JWT token
        const token = generateJWTToken(user); // Assuming you have a utility function for JWT
        res.json({ success: true, token });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get User Profile
router.get('/profile', authenticateJWT, async (req, res) => {    
    try {
        const result = await pool.query('SELECT id, email, name, role FROM users WHERE id = $1', [req.user.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Update User Profile
router.put('/update', authenticateJWT, async (req, res) => { 
    try {
        const { name, email } = req.body;

        // Validation
        if (!name || !email) {
            return res.status(400).json({ success: false, error: 'Name and email are required' });
        }

        const result = await pool.query(
            'UPDATE users SET name = $1, email = $2 WHERE id = $3 RETURNING *',
            [name, email, req.user.id]
        );

        res.json({ success: true, data: result.rows[0] });
    } catch (error) {
        res.status(500).json({ error: 'Error updating profile' });
    } 
});

// Get User Role
router.get('/role', authenticateJWT, async (req, res) => { 
    try {
        const result = await pool.query('SELECT role FROM users WHERE id = $1', [req.user.id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ success: true, role: result.rows[0].role });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get All Users (Admin only)
router.get('/users', authenticateJWT, async (req, res) => { 
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const result = await pool.query('SELECT id, email, name, role FROM users');
        res.json({ success: true, data: result.rows });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    } 
});

// Delete User (Admin only)
router.delete('/delete/:id', authenticateJWT, async (req, res) => { 
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied' });
        }

        const result = await pool.query('DELETE FROM users WHERE id = $1 RETURNING *', [req.params.id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ success: true, message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Get all users
router.get('/users', getUsers);

// Create a new user
router.post('/users', createUser);

// Update a user
router.put('/users/:id', updateUser);

// Delete a user
router.delete('/users/:id', deleteUser);
module.exports = router;
