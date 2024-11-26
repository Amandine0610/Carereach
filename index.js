// index.js
const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Default route to test server
app.get('/', (req, res) => {
    res.send('CareReach is running');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
