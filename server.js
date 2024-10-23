const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 3000;

// Configure CORS
app.use(cors({
    origin: '*', // Allow all origins
    methods: ['GET', 'POST'], // Specify allowed methods if needed
    credentials: true // Enable credentials if needed
}));

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve index.html for any route
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});