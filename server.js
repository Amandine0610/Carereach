// server.js
const app = require('./app'); // Import configured app from app.js
const { connect } = require('./config/db'); // Import database connection

// Optional: Establish database connection before starting the server
connect()
    .then(() => {
        const port = process.env.PORT || 3000;
        app.listen(port, () => {
            console.log(`Server is running on http://localhost:${port}`);
        });
    })
    .catch(err => {
        console.error('Failed to connect to the database:', err);
        process.exit(1); // Exit the process if database connection fails
    });