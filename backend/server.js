// backend/server.js

require('dotenv').config(); // Load .env variables FIRST

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { getFileStream } = require('./utils/gridfs');

// Import routes
const authRoutes = require('./routes/auth.routes');
const postRoutes = require('./routes/post.routes');
const commentRoutes = require('./routes/comment.routes');
const adminRoutes = require('./routes/admin.routes');
const messageRoutes = require('./routes/message.routes');

const app = express();

// Connect to MongoDB
connectDB();

// ── Middleware ───────────────────────────────────────────────
// Allow React (port 3000) to call this server
app.use(cors({ origin: ['http://localhost:3000', 'https://thefolio-project-claire.vercel.app'], credentials: true }));

// Parse incoming JSON request bodies
app.use(express.json());

// ── Serve images stored in MongoDB Atlas GridFS ──
app.get('/uploads/:fileId', async (req, res) => {
  try {
    const { fileId } = req.params;
    const fileStream = getFileStream(fileId);

    fileStream.on('file', (file) => {
      if (file.contentType) res.set('Content-Type', file.contentType);
      res.set('Content-Disposition', `inline; filename="${file.filename}"`);
    });

    fileStream.on('error', () => {
      res.status(404).json({ message: 'Image not found' });
    });

    fileStream.pipe(res);
  } catch (err) {
    res.status(404).json({ message: 'Image not found' });
  }
});

// ── Routes ───────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/messages', messageRoutes);

// ── Start Server ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});