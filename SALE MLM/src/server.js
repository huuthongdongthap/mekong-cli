require('dotenv').config();
const express = require('express');
const cors = require('cors');

const authRoutes = require('./api/auth');
const habitRoutes = require('./api/habits');
const memberRoutes = require('./api/members');
const kpiRoutes = require('./api/kpi');
const alertRoutes = require('./api/alerts');
const { initRules, evaluateAll, getRules, getAlertLog, getAlertSummary, acknowledgeAlert } = require('./analytics/alertEngine');
const { startOnboarding, getSession, advanceDay, generateNudge, getProgress, getActiveSessions } = require('./agents/onboardingBot');
const { assignCurriculum, getRecord, updateProgress, getProgress: getTrainingProgress, getActiveTrainees, getTraineesNeedingAttention, getTraineesByPSN } = require('./agents/trainingOps');
const { errorMiddleware, notFoundMiddleware, getHealthStatus, monitoring } = require('./utils/monitoring');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Initialize alert rules
initRules();

// Routes
app.use('/auth', authRoutes);
app.use('/api/habits', habitRoutes);
app.use('/api/members', memberRoutes);
app.use('/api/kpi', kpiRoutes);
app.use('/api/alerts', alertRoutes);

// Analytics routes
app.post('/api/analytics/psn-health', (req, res) => {
  const { classifyPSNHealth } = require('./analytics/psnHealth');
  const result = classifyPSNHealth(req.body);
  res.json(result);
});

app.post('/api/alerts/evaluate', (req, res) => {
  const { metrics, psnId } = req.body;
  if (!metrics) return res.status(400).json({ error: 'metrics required' });
  const fired = evaluateAll(metrics, psnId);
  res.json({ fired, count: fired.length });
});

app.get('/api/alerts/rules', (req, res) => {
  res.json({ rules: getRules() });
});

app.get('/api/alerts/log', (req, res) => {
  res.json({ alerts: getAlertLog(req.query) });
});

app.get('/api/alerts/summary', (req, res) => {
  res.json(getAlertSummary());
});

app.post('/api/alerts/:id/acknowledge', (req, res) => {
  const alert = acknowledgeAlert(req.params.id, req.body.userId);
  if (!alert) return res.status(404).json({ error: 'Alert not found' });
  res.json(alert);
});

// Onboarding routes
app.post('/api/onboarding/start', (req, res) => {
  const { memberId, ...memberData } = req.body;
  if (!memberId) return res.status(400).json({ error: 'memberId required' });
  const session = startOnboarding(memberId, memberData);
  res.json(session);
});

app.get('/api/onboarding/:memberId', (req, res) => {
  const session = getSession(req.params.memberId);
  if (!session) return res.status(404).json({ error: 'Session not found' });
  res.json(session);
});

app.post('/api/onboarding/:memberId/advance', (req, res) => {
  const result = advanceDay(req.params.memberId);
  if (result.error) return res.status(404).json(result);
  res.json(result);
});

app.post('/api/onboarding/:memberId/nudge', (req, res) => {
  const nudge = generateNudge(req.params.memberId);
  if (nudge.error) return res.status(404).json(nudge);
  res.json(nudge);
});

app.post('/api/onboarding/:memberId/habit', (req, res) => {
  const { score } = req.body;
  if (score === undefined) return res.status(400).json({ error: 'score required' });
  const result = require('./agents/onboardingBot').recordHabitScore(req.params.memberId, score);
  if (result.error) return res.status(404).json(result);
  res.json(result);
});

app.post('/api/onboarding/:memberId/order', (req, res) => {
  const result = require('./agents/onboardingBot').recordOrder(req.params.memberId);
  if (result.error) return res.status(404).json(result);
  res.json(result);
});

app.get('/api/onboarding/:memberId/progress', (req, res) => {
  const progress = getProgress(req.params.memberId);
  if (progress.error) return res.status(404).json(progress);
  res.json(progress);
});

app.get('/api/onboarding/active', (req, res) => {
  res.json({ sessions: getActiveSessions() });
});

// Training Ops routes
app.post('/api/training/assign', (req, res) => {
  const { memberId, ...memberData } = req.body;
  if (!memberId) return res.status(400).json({ error: 'memberId required' });
  const record = assignCurriculum(memberId, memberData);
  if (record.error) return res.status(400).json(record);
  res.json(record);
});

app.post('/api/training/progress', (req, res) => {
  const { memberId, type, value } = req.body;
  if (!memberId || !type) return res.status(400).json({ error: 'memberId and type required' });
  const result = updateProgress(memberId, { type, value });
  if (result.error) return res.status(404).json(result);
  res.json(result);
});

app.get('/api/training/:memberId', (req, res) => {
  const record = getRecord(req.params.memberId);
  if (!record) return res.status(404).json({ error: 'Record not found' });
  res.json(record);
});

app.get('/api/training/:memberId/progress', (req, res) => {
  const progress = getTrainingProgress(req.params.memberId);
  if (progress.error) return res.status(404).json(progress);
  res.json(progress);
});

app.get('/api/training/active', (req, res) => {
  res.json({ trainees: getActiveTrainees() });
});

app.get('/api/training/attention', (req, res) => {
  res.json({ needing_attention: getTraineesNeedingAttention() });
});

app.get('/api/training/psn/:psnId', (req, res) => {
  res.json({ trainees: getTraineesByPSN(req.params.psnId) });
});

// Health check
app.get('/health', (req, res) => {
  res.json(getHealthStatus());
});

// Monitoring routes
app.get('/api/monitoring/errors', (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  res.json({ errors: monitoring.getErrorLog(limit) });
});

app.get('/api/monitoring/summary', (req, res) => {
  res.json(monitoring.getErrorSummary());
});

// 404 handler
app.use(notFoundMiddleware);

// Error middleware (must be last)
app.use(errorMiddleware);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🐝 Hive Warfare OS running on port ${PORT}`);
  });
} else {
  module.exports = app;
}
