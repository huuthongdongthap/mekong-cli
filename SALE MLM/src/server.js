require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./api/auth');
const habitRoutes = require('./api/habits');
const memberRoutes = require('./api/members');
const kpiRoutes = require('./api/kpi');
const alertRoutes = require('./api/alerts');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/kpi', kpiRoutes);
app.use('/api/alerts', alertRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'Hive Warfare OS',
    version: '1.0.0',
    uptime: process.uptime()
  });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🐝 Hive Warfare OS running on port ${PORT}`);
  });
} else {
  module.exports = app;
}
