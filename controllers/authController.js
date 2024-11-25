const { Pool } = require('pg'); // PostgreSQL client
const bcrypt = require('bcrypt'); // For password hashing

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'CareReach',
    password: 'Amandine20',
    port: 5432,
});

// Function to render login page (you can adjust this to your needs)
const getLoginPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/login.html')); // Adjust the path to your login HTML
};

// Function to handle login (implement your logic)
const login = (req, res) => {
    // Login logic to be implemented
    res.send('Login logic to be implemented');
};

// Function to render signup page (you can adjust this to your needs)
const getSignupPage = (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/signup.html')); // Adjust the path to your signup HTML
};

// Signup function (as defined previously)
const signup = async (req, res) => {
    const { name, email, password, role } = req.body; // Ensure 'name' and 'role' are included

    // Check if all fields are provided
    if (!name || !email || !password || !role) {
        return res.status(400).send('All fields are required');
    }

    try {
        // Check if the user already exists
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length > 0) {
            return res.status(400).send('User already exists with this email');
        }

        // Hash the password and save the user to the database
        const hashedPassword = await bcrypt.hash(password, 10);
        await pool.query('INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)', [name, email, hashedPassword, role]);

        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).send('Server error');
    }
};

// Exporting functions
module.exports = {
    getLoginPage,
    login,
    getSignupPage,
    signup,
};
