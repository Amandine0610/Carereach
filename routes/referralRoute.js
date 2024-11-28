const express = require('express');
const router = express.Router();
const db = require('../config/db'); // Adjust this path based on your setup

// Create a new referral
router.post('/create', async (req, res) => {
    const { patientId, specialistId, reason } = req.body;

    if (!patientId || !specialistId || !reason) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        const result = await db.query(
            'INSERT INTO referrals (patient_id, specialist_id, reason) VALUES ($1, $2, $3) RETURNING *',
            [patientId, specialistId, reason]
        );
        res.status(201).json({ message: "Referral created successfully!", referral: result.rows[0] });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error." });
    }
});
// Fetch referrals for a specialist
router.get('/:specialistId', async (req, res) => {
    const specialistId = req.params.specialistId;

    try {
        // Use the correct column name `specialist_id`
        const referrals = await db.query("SELECT * FROM referrals WHERE specialist_id = $1", [specialistId]);

        if (referrals.rowCount === 0) {
            return res.status(404).json({ message: "No referrals found for this specialist." });
        }

        res.json(referrals.rows); // Return the referrals as an array
    } catch (error) {
        console.error("Error fetching referrals:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
});
module.exports = router;
