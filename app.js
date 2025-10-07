// app.js
import express from 'express';
import cors from 'cors';

import authRoutes from './routes/auth.js';
import storiesRoutes from './routes/stories.js';
import pagesRoutes from './routes/pages.js';
import optionsRoutes from './routes/options.js';

import { attachUser } from './middleware/attachUser.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use(attachUser);

app.use('/auth', authRoutes);
app.use('/stories', storiesRoutes);
app.use('/pages', pagesRoutes);
app.use('/options', optionsRoutes);

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

export default app;
