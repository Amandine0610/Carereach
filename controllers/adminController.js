// adminController.js
const pool = require('../config/db'); // Database connection

// Get all appointments
const getAppointments = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM appointments');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
};

// Create a new appointment
const createAppointment = async (req, res) => {
    const { name, email, phone, appointment_date, appointment_time, department } = req.body;
    try {
        await pool.query(
            'INSERT INTO appointments (name, email, phone, appointment_date, appointment_time, department) VALUES ($1, $2, $3, $4, $5, $6)',
            [name, email, phone, appointment_date, appointment_time, department]
        );
        res.status(201).json({ message: 'Appointment created successfully' });
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ error: 'Failed to create appointment' });
    }
};

// Update an existing appointment
const updateAppointment = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, appointment_date, appointment_time, department } = req.body;
    try {
        const result = await pool.query(
            'UPDATE appointments SET name = $1, email = $2, phone = $3, appointment_date = $4, appointment_time = $5, department = $6 WHERE appointment_id = $7',
            [name, email, phone, appointment_date, appointment_time, department, id]
        );
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        res.status(200).json({ message: 'Appointment updated successfully' });
    } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({ error: 'Failed to update appointment' });
    }
};

// Delete an appointment
const deleteAppointment = async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM appointments WHERE appointment_id = $1', [id]);
        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Appointment not found' });
        }
        res.status(200).json({ message: 'Appointment deleted successfully' });
    } catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).json({ error: 'Failed to delete appointment' });
    }
};

// Get all users
const getUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving users' });
    }
};

// Create a new user
const createUser = async (req, res) => {
    const { email, password, name, role } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO users (email, password, name, role) VALUES ($1, $2, $3, $4) RETURNING *',
            [email, password, name, role]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error creating user' });
    }
};

// Update an existing user
const updateUser = async (req, res) => {
    const { id } = req.params;
    const { email, password, name, role } = req.body;
    try {
        const result = await pool.query(
            'UPDATE users SET email = $1, password = $2, name = $3, role = $4 WHERE id = $5 RETURNING *',
            [email, password, name, role, id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ error: 'Error updating user' });
    }
};

// Delete a user
const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM users WHERE id = $1', [id]);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting user' });
    }
};

module.exports = {
    getAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    getUsers,
    createUser,
    updateUser,
    deleteUser,
};
