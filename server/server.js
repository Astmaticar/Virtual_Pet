require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'Virtual pet API is running' });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/pet', require('./routes/petRoutes'));
app.use('/api/weather', require('./routes/weatherRoutes'));

// 404 handler for unknown routes - returns consistent JSON format
app.use((req, res, next) => {
  res.status(404).json({ success: false, message: 'Ruta nije pronađena' });
});

// Centralized error handler - catches unhandled errors and returns consistent JSON
// Note: controller-level error responses are preserved; this handles errors
// that bubble up or are passed to next(err).
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({ success: false, message: err.message || 'Server error' });
});

const startServer = async () => {
  try {
    await connectDB();

    const server = app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });

    server.on('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} je zauzet, ugasi drugi proces ili promijeni port u server.js`);
        process.exit(1);
      } else {
        console.error('Failed to start server:', error);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
