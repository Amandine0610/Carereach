// Import dependencies
const express = require('express');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoute');
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
app.use('/dashboard', dashboardRoutes); // Dashboard routes
app.use('/admin', authenticateJWT, userRoutes); // Protected user management routes
app.use('/appointments', appointmentRoutes);// Appointment routes
app.use('/api', authenticateJWT, adminRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/pcp', pcpRoutes);
app.use('/api/referral', referralRoutes);

// Handle appointment submission
app.post('/appointments/submit-appointment', (req, res) => {
    const { name, email, phone, appointment_date, appointment_time, department } = req.body;
    
    // Basic validation
    if (!name || !email || !phone || !appointment_date || !appointment_time || !department) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    // Store appointment (replace with DB in production)
    const newAppointment = {
        id: appointments.length + 1,
        name,
        email,
        phone,
        appointment_date,
        appointment_time,
        department,
    };

    appointments.push(newAppointment);
    return res.status(200).json({ message: 'Appointment successfully submitted!' });
});


// Delete an appointment
app.delete('/appointments/:id', async (req, res) => {
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
