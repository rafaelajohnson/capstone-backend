// server.js
import 'dotenv/config'; // still fine to keep for local dev
import tracer from 'dd-trace';
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import winston from 'winston';
import DatadogWinston from 'datadog-winston';

import authRouter from './routes/auth.js';
import storiesRouter from './routes/stories.js';
import pagesRouter from './routes/pages.js';
import optionsRouter from './routes/options.js';

// Initialize tracer FIRST, before anything else
tracer.init({
  env: process.env.DD_ENV || 'production',
  service: process.env.DD_SERVICE || 'storybook-builder-api',
  hostname: process.env.DD_AGENT_HOST, // optional
  logInjection: true,                  // lets Datadog link logs ↔ traces
  runtimeMetrics: true,
});
tracer.use('express');
tracer.use('pg');

// Now start Express
const app = express();

// Datadog logger setup
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

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/auth', authRouter);
app.use('/stories', storiesRouter);
app.use('/pages', pagesRouter);
app.use('/options', optionsRouter);

// Root health check
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Capstone backend is running' });
});

// Error handler
app.use((err, req, res, next) => {
  logger.error('❌ Server error:', err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  logger.info(`🚀 Server listening on port ${PORT}`);
});
