const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'CareReach',
    password: 'Amandine20',
    port: 5432,
});

async function connect() {
    try {
        console.log('Attempting to connect to the database...');
        
        // Add a timeout to check connection
        const connectWithTimeout = () => {
            return new Promise((resolve, reject) => {
                const timeoutId = setTimeout(() => {
                    reject(new Error('Database connection timeout'));
                }, 5000);

                pool.connect((err, client, release) => {
                    clearTimeout(timeoutId);
                    if (err) {
                        reject(err);
                    } else {
                        release();
                        resolve(true);
                    }
                });
            });
        };

        const result = await connectWithTimeout();
        console.log('Successfully connected to the database');
        return result;
    } catch (err) {
        console.error('Detailed Database Connection Error:', {
            message: err.message,
            stack: err.stack,
            name: err.name
        });
        throw err;
    }
}

module.exports = { pool, connect };