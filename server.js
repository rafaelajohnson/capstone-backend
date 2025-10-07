// server.js
import 'dotenv/config';
import tracer from 'dd-trace';
import winston from 'winston';
import DatadogWinston from 'datadog-winston';
import morgan from 'morgan';
import app from './app.js'; // 👈 import your main app

// --- Initialize Datadog tracer FIRST ---
tracer.init({
  env: process.env.DD_ENV || 'production',
  service: process.env.DD_SERVICE || 'storybook-builder-api',
  hostname: process.env.DD_AGENT_HOST,
  logInjection: true,
  runtimeMetrics: true,
});
tracer.use('express');
tracer.use('pg');

// --- Datadog logger setup ---
const logger = winston.createLogger({
  transports: [
    new DatadogWinston({
      apiKey: process.env.DD_API_KEY,
      hostname: 'render',
      service: process.env.DD_SERVICE || 'storybook-builder-api',
      ddsource: 'nodejs',
      ddtags: `env:${process.env.DD_ENV || 'production'},project:storybook-builder`,
    }),
  ],
});

// --- Middleware logging ---
app.use(morgan('dev'));

// --- Health check ---
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Capstone backend is running' });
});

// --- Error handler ---
app.use((err, req, res, next) => {
  logger.error('❌ Server error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// --- Start server ---
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`🚀 Server listening on port ${PORT}`);
});
