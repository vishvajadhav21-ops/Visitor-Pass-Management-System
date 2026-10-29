const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');

const env = require('./config/env');
const connectDB = require('./config/db');
const errorHandler = require('./middlewares/errorHandler');

// Connect to database
connectDB();

const app = express();

// ---- Core middleware ----
app.use(helmet());
app.use(cors({
  origin: env.NODE_ENV === 'production' ? process.env.CLIENT_URL : '*',
  credentials: true,
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded visitor photos statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ---- Health check ----
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Visitor Pass API is running' });
});

// ---- Routes ----
// Only uncomment a line once that route file actually exists.
app.use('/api/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/visitors', require('./routes/visitor.routes'));
app.use('/api/appointments', require('./routes/appointment.routes'));
app.use('/api/passes', require('./routes/pass.routes'));
app.use('/api/checklogs', require('./routes/checklog.routes'));
app.use('/api/reports', require('./routes/report.routes'));

// ---- 404 handler ----
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// ---- Centralized error handler (must be last) ----
app.use(errorHandler);

const PORT = env.PORT;
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${env.NODE_ENV} mode on port ${PORT}`);
});