// Import dependencies
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');
const session = require('express-session');
const dotenv = require('dotenv');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken'); // Import jwt library for signing tokens
// Load environment variables
dotenv.config();

// Set up PostgreSQL connection pool
const pool = new Pool({
    connectionString: process.env.DATABASE_URL, // Add your PostgreSQL connection string here
});

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const adminRoutes = require('./routes/adminRoutes');
const referralRoute = require('./routes/referralRoute');
const pcpRoutes = require('./routes/pcpRoutes');

// Import middleware
const { authenticateJWT, authorize } = require('./middleware/authMiddleware');

// Initialize the app
const app = express();

// Middleware setup
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'frontend')));

// Session setup
app.use(session({
    secret: process.env.SESSION_SECRET || 'fallback-secret',
    resave: false,
    saveUninitialized: true,
    cookie: { 
        secure: process.env.NODE_ENV === 'production',
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Route setup with middleware
app.use('/api/auth', authRoutes);                     // Authentication routes
app.use('/admin', authenticateJWT, adminRoutes);      // Protected admin routes
app.use('/api/appointments', authenticateJWT, appointmentRoutes); // Protected appointment routes
app.use('/users', authenticateJWT, userRoutes);       // Protected user routes
app.use('/api/referrals', referralRoute);
app.use('/api/pcp',pcpRoutes)
// Route for submitting appointments
app.post('/appointments/create', authenticateJWT, async (req, res) => {
    const {  name, email, phone, appointmentDate, appointmentTime, department, userId } = req.body;

    console.log("Request body:", req.body); // Log incoming data to check if it's correct

    // Check if all required fields are provided
    if (!name || !email || !phone || !appointmentDate || !appointmentTime || !department || !userId) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Insert appointment logic (assuming you have a 'appointments' table in PostgreSQL)
        const query = `
            INSERT INTO Appointments (userId, name, email, phone, appointmentDate, appointmentTime, department) 
            VALUES ($1, $2, $3, $4, $5, $6);
        `;
        const result = await pool.query(query, [userId, name, email, phone, appointmentDate, appointmentTime, department]);

        console.log('Appointment added:', result.rows[0]); // Log the inserted appointment
        return res.status(200).json({ message: 'Appointment submitted successfully' });
    } catch (error) {
        console.error('Error saving appointment:', error); // Log the error message
        return res.status(500).json({ message: 'Failed to submit appointment', error: error.message });
    }
});

// Route for user login
app.post('/auth/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        // Query the database to find the user by email
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        const user = result.rows[0];

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Invalid email or password' });
        }

        // Generate a JWT token
        const token = jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: '1h' // Set token expiration time (optional)
        });

        // Send the token in the response
        res.json({
            token,
            role: user.role,
            message: 'Login successful',
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Route to fetch appointments (Protected)
app.get('/admin/appointments', authenticateJWT, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM appointments');
        res.json(result.rows); // Send appointments data
    } catch (err) {
        console.error('Error fetching appointments:', err);
        res.status(500).json({ message: 'Failed to fetch appointments' });
    }
});

// Route to fetch users (Protected)
app.get('/admin/users', authenticateJWT, async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM users');
        res.json(result.rows); // Send users data
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: 'Failed to fetch users' });
    }
});

// Route to add a new user (Protected)
app.post('/admin/users', authenticateJWT, async (req, res) => {
    const { name, email, role, password } = req.body;

    // Validate inputs
    if (!name || !email || !role || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        // Hash the password before saving it
        const hashedPassword = await bcrypt.hash(password, 10);
        
        const query = 'INSERT INTO users (name, email, role, password) VALUES ($1, $2, $3, $4) RETURNING *';
        const result = await pool.query(query, [name, email, role, hashedPassword]);

        res.status(201).json({ message: 'User created successfully', user: result.rows[0] });
    } catch (err) {
        console.error('Error creating user:', err);
        res.status(500).json({ message: 'Failed to create user' });
    }
});

// 404 handler
app.use((req, res, next) => {
    res.status(404).json({
        message: 'Route not found'
    });
});

// Export the app for server configuration
module.exports = app;
