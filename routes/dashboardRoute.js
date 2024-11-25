const express = require('express');
const pool = require('../config/db');  // Your PostgreSQL connection pool
const { authenticateJWT } = require('../middleware/authMiddleware');
const router = express.Router();

// Dashboard route to get stats 
router.get('/dashboard', authenticateJWT, async (req, res) => {
    try {
        // Total number of patients
        const patientsQuery = await pool.query('SELECT COUNT(*) FROM patients');
        const totalPatients = patientsQuery.rows[0].count;

        // Total number of referrals
        const referralsQuery = await pool.query('SELECT COUNT(*) FROM referrals');
        const totalReferrals = referralsQuery.rows[0].count;

        // Recent activity (e.g., last 5 referrals)
        const recentActivityQuery = await pool.query('SELECT * FROM referrals ORDER BY created_at DESC LIMIT 5');
        const recentActivity = recentActivityQuery.rows;

        // Send the dashboard data
        res.json({
            success: true,
            data: {
                totalPatients,
                totalReferrals,
                recentActivity
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
