const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Import database connection

// Route to get all patients
router.get('/patients', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM patients');
        res.status(200).json(result.rows);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching patients', error });
    }
});

// Route to get a single patient by ID
router.get('/patients/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('SELECT * FROM patients WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Patient not found' });
        }
        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching patient', error });
    }
});

// Route to create a new patient
router.post('/patients', async (req, res) => {
    const { name, age, gender, contact, medicalHistory } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO patients (name, age, gender, contact, medicalHistory) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [name, age, gender, contact, medicalHistory]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error creating patient', error });
    }
});

// Route to update a patient by ID
router.put('/patients/:id', async (req, res) => {
    const { id } = req.params;
    const { name, age, gender, contact, medicalHistory } = req.body;

    try {
        const result = await pool.query(
            'UPDATE patients SET name = $1, age = $2, gender = $3, contact = $4, medicalHistory = $5 WHERE id = $6 RETURNING *',
            [name, age, gender, contact, medicalHistory, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        res.status(200).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Error updating patient', error });
    }
});

// Route to delete a patient by ID
router.delete('/patients/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const result = await pool.query('DELETE FROM patients WHERE id = $1 RETURNING *', [id]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Patient not found' });
        }

        res.status(200).json({ message: 'Patient deleted successfully', patient: result.rows[0] });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting patient', error });
    }
});

module.exports = router;
