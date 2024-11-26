// Import dependencies
const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const { connect } = require('./config/db');

connect()
    .then(() => console.log('Database connection successful'))
    .catch(err => console.error('Connection error', err.stack));


// Load environment variables
const dotenv = require('dotenv');
dotenv.config();


const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes'); // User management routes
const appointmentRoutes = require('./routes/appointmentRoutes'); // Appointment routes
const adminRoutes = require('./routes/adminRoutes');
const patientRoutes = require('./routes/patientsRoute'); // Import patient routes
const pcpRoutes = require('./routes/pcpRoutes');
const referralRoutes = require('./routes/referralRoute');
const { authenticateJWT } = require('./middleware/authMiddleware');
// Initialize the app
const app = express();

// Enable CORS
app.use(cors());

// Middleware for parsing JSON and serving static files
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // For URL-encoded form data
app.use(express.static(path.join(__dirname, 'frontend')));

// Session setup (if required by any non-JWT logic)
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: process.env.NODE_ENV === 'production' } // Use secure cookies in production
}));

// Route setup
app.use('/auth', authRoutes); // Authentication routes
app.use('/admin', authenticateJWT, userRoutes); // Protected user management routes
app.use('/appointments', appointmentRoutes);// Appointment routes
app.use('/api', authenticateJWT, adminRoutes);
// Temporary in-app appointment creation logic
app.post('/appointments/submit-appointment', (req, res) => {
    const { name, email, phone, appointment_date, appointment_time, department } = req.body;
    
    // Simulate database logic
    console.log(req.body);

    res.status(201).json({
        message: 'Appointment created successfully!',
        appointment: {
        name,
        email,
        phone,
        appointment_date,
        appointment_time,
        department,
        },
    });
});
// Fetch all appointments
app.get('/api/appointments', async (req, res) => {
    try {
        // Make sure db.query returns a promise
        const result = await db.query('SELECT * FROM appointments'); // Adjust query as per your database
        res.json(result.rows); 
    } catch (error) {
        console.error('Error fetching appointments:', error);
        res.status(500).send('Error retrieving appointments');
    }
});

// Update an appointment (e.g., mark as completed)
app.put('/api/appointments/:id', async (req, res) => {
    try {
        const appointment = await Appointment.findByPk(req.params.id);
        if (!appointment) {
            return res.status(404).send('Appointment not found');
        }

        const updatedAppointment = await appointment.update(req.body);
        res.json(updatedAppointment);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error updating appointment');
    }
});

// Delete an appointment
app.delete('/api/appointments/:id', async (req, res) => {
    try {
        const appointment = await Appointment.findByPk(req.params.id);
        if (!appointment) {
            return res.status(404).send('Appointment not found');
        }

        await appointment.destroy();
        res.send('Appointment deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting appointment');
    }
});
// Export the app for server configuration
module.exports = app;
