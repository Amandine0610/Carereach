// appointmentRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');  // Import the database pool

router.post('/submit-appointment', async (req, res) => {
    const { name, email, phone, appointmentDate, appointmentTime, department } = req.body;

    // Using req.user.id from authentication middleware
    const userId = req.user.id;

    // Validate all required fields
    if (!name || !email || !phone || !appointmentDate || !appointmentTime || !department) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({ error: 'Invalid email format' });
        }

        // SQL query to insert a new appointment
        const result = await pool.query(
            `INSERT INTO Appointments (userId, name, email, phone, appointmentDate, appointmentTime, department)              
            VALUES ($1, $2, $3, $4, $5, $6, $7) 
            RETURNING *`,
            [userId, name, email, phone, appointmentDate, appointmentTime, department]
        );

        // Send the newly created appointment as a response
        res.status(201).json({
            message: 'Appointment created successfully!',
            appointment: result.rows[0],
        });

    } catch (error) {
        console.error('Error creating appointment:', error);
        
        if (error.code === '23505') {  // Unique constraint violation
            return res.status(409).json({ error: 'An appointment with these details already exists' });
        }

        res.status(500).json({ 
            error: 'Internal server error', 
            details: error.message 
        });
    }
});

module.exports = router;
