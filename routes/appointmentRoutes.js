// appointmentRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');  // Import the database pool

// POST route to create an appointment
router.post('/submit-appointment', async (req, res) => {
    const { name, email, phone, appointment_date, appointment_time, department } = req.body;

    try {
        // SQL query to insert a new appointment
        const result = await pool.query(
            'INSERT INTO appointments (name, email, phone, appointment_date, appointment_time, department) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [name, email, phone, appointment_date, appointment_time, department]
        );

        // Send the newly created appointment as a response
        res.status(201).json({
            message: 'Appointment created successfully!',
            appointment: result.rows[0],  // The first row (the created appointment)
        });
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ error: 'Error creating appointment' });
    }
});

module.exports = router;
