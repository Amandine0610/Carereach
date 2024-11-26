const express = require('express');
const {
    getAppointments,
    createAppointment,
    updateAppointment,
    deleteAppointment,
} = require('../controllers/adminController'); // Adjust the path if needed
const { getUsers, createUser, updateUser, deleteUser } = require('../controllers/adminController'); // Adjust the path if needed
const router = express.Router();

// GET all appointments
router.get('/appointments', getAppointments);

// POST a new appointment
router.post('/appointments', createAppointment);

// PUT to update an appointment
router.put('/appointments/:id', updateAppointment);

// DELETE an appointment
router.delete('/appointments/:id', deleteAppointment);

// Get all users
router.get('/users', getUsers);

// Create a new user
router.post('/users', createUser);

// Update a user
router.put('/users/:id', updateUser);

// Delete a user
router.delete('/users/:id', deleteUser);


module.exports = router;

