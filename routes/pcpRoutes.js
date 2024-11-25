const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Import the database connection

// Route to get appointments for the PCP (Primary Care Physician)
router.get('/appointments', async (req, res) => {
    try {
      // Example query fetching appointments
      const result = await db.query('SELECT * FROM appointments WHERE pcp_id = $1', [req.user.pcp_id]); // Modify the query to match your setup
      res.json(result.rows); // Send the fetched appointments as JSON
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).send('Error fetching appointments');
    }
  });

// Route: Get all referrals for a PCP
router.get('/referrals', async (req, res) => {
    try {
        const { pcpId } = req.query; // Assuming PCP ID is passed as a query parameter
        const result = await pool.query(
            'SELECT * FROM referrals WHERE pcp_id = $1 ORDER BY referral_date DESC',
            [pcpId]
        );
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching referrals:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route: Update the status of an appointment
router.put('/appointments/:id', async (req, res) => {
    try {
        const { id } = req.params; // Appointment ID
        const { status } = req.body; // New status (e.g., "completed", "canceled")
        const result = await pool.query(
            'UPDATE appointments SET status = $1 WHERE id = $2 RETURNING *',
            [status, id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        console.error('Error updating appointment status:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Route: Add a new referral
router.post('/referrals', async (req, res) => {
    try {
        const { patientId, pcpId, specialistId, reason, referralDate } = req.body;
        const result = await pool.query(
            'INSERT INTO referrals (patient_id, pcp_id, specialist_id, reason, referral_date) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [patientId, pcpId, specialistId, reason, referralDate]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error('Error creating referral:', error.message);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
