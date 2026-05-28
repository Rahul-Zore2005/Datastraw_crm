// 1. Import express, cors, dotenv
const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Create an Express application
const app = express();

// 2. Use cors() middleware so the React frontend (on a different port) can talk to it
app.use(cors());

// 3. Use express.json() to parse JSON request bodies
app.use(express.json());

// 4. Import and mount ticket routes from ./routes/tickets.js at the path /api/tickets
const ticketsRouter = require('./routes/tickets');
app.use('/api/tickets', ticketsRouter);

// 5. Start the server on port 5000 (or process.env.PORT if set)
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    // 6. Log "Server running on port [PORT]" when it starts
    console.log(`Server running on port ${PORT}`);
});
