require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/database');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Define Routes
app.use('/api/performance', require('./routes/api/performance'));
app.use('/api/memory', require('./routes/api/memory'));
app.use('/api/network', require('./routes/api/network')); // Mount the new network route

// Basic Route (for testing server status)
app.get('/', (req, res) => {
  res.send('WebPerf Analyzer Server is running!');
});

// Error handling middleware (optional, but good practice)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
