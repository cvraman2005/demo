require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const morgan = require('morgan');

const authRoutes = require('./routes/auth');
const patientRoutes = require('./routes/patient');
const providerRoutes = require('./routes/provider');
const publicRoutes = require('./routes/public');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✓ MongoDB connected successfully');
  })
  .catch(err => {
    console.error('✗ MongoDB connection error:', err.message);
    process.exit(1);
  });

mongoose.connection.on('error', (err) => {
  console.error('✗ Mongoose connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠ Mongoose disconnected from MongoDB');
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/patients', patientRoutes);
app.use('/api/providers', providerRoutes);
app.use('/api/public', publicRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Healthcare Portal API is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

// Start server
app.listen(PORT, () => {
  console.log('\n🚀 Healthcare Portal Backend Started');
  console.log(`   Port: ${PORT}`);
  console.log(`   Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`   API: http://localhost:${PORT}/api`);
  console.log('');
});
