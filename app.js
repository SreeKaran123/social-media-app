// app.js

import express from 'express';
import { json } from 'body-parser';
import cors from 'cors';
import authRouter from './routes/auth';
import userRouter from './routes/user';
import postRouter from './routes/post';
import commentRouter from './routes/comment';
import likeRouter from './routes/like';

// Exporting a function
export function function1() {
  

const app = express();

app.use(json());
app.use(cors());

// Routes
app.use('/api/authenticate', authRouter);
app.use('/api/user', userRouter);
app.use('/api/posts', postRouter);
app.use('/api/comments', commentRouter);
app.use('/api/likes', likeRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal Server Error' });
});
}
export default app;
