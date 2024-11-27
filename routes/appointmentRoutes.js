// appointmentRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');  // Import the database pool

// POST route to create an appointment
router.post('/submit-appointment', async (req, res) => {
    const { name, email, phone, appointmentDate, appointmentTime, department} = req.body;  
   
    if (!name || !email || !phone || !appointmentDate || !appointmentTime || !department || !userId) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        // SQL query to insert a new appointment
        const result = await pool.query(
            `INSERT INTO Appointments (userId, name, email, phone, appointmentDate, appointmentTime, department) 
            VALUES ($1, $2, $3, $4, $5, $6) *`,
            [userId, name, email, phone, appointmentDate, appointmentTime, department]
        );

        // Send the newly created appointment as a response
        res.status(201).json({
            message: 'Appointment created successfully!',
            appointment: result.rows[0],  // The first row (the created appointment)
        });
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ error: `Error creating appointment: ${error.message}` });  // More detailed error message
    }
});

module.exports = router;
