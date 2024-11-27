// adminController.js
const pool = require('../config/db'); // Database connection

// Appointment-related functions
const getAppointments = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Appointments');
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).json({ error: 'Failed to fetch appointments' });
    }
};

const createAppointment = async (req, res) => {
    const { name, email, phone, appointmentDate, appointmentTime, department, userId } = req.body;
    try {
        await pool.query(
            'INSERT INTO Appointments (userId, name, email, phone, "appointmentDate", "appointmentTime", department) VALUES ($1, $2, $3, $4, $5, $6)' 
            [userId, name, email, phone, appointmentDate, appointmentTime, department]
        );
        res.status(201).json({ message: 'Appointment created successfully' });
    } catch (error) {
        console.error('Error creating appointment:', error);
        res.status(500).json({ error: 'Failed to create appointment' });
    }
};

const updateAppointment = async (req, res) => {
    const { id } = req.params;
    const { name, email, phone, appointmentDate, appointmentTime, department } = req.body;
    try {
        const result = await pool.query(
            'UPDATE Appointments SET name = $1, email = $2, phone = $3, appointmentDate = $4, appointmentTime = $5, department = $6 WHERE appointment_id = $7',
            [name, email, phone, appointmentDate, appointmentTime, department, id]
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

// User-related functions
const getUsers = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ error: 'Error retrieving users' });
    }
};

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

const deleteUser = async (req, res) => {
    const { id } = req.params;
    try {
        await pool.query('DELETE FROM users WHERE id = $1', [id]);
        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error deleting user' });
    }
};

// Single module.exports combining both appointment and user functions
module.exports = {
    // Appointment-related exports
    getAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    
    // User-related exports
    getUsers,
    createUser,
    updateUser,
    deleteUser
};