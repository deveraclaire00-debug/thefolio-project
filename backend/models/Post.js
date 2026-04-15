// backend/models/Post.js

const mongoose = require('mongoose');

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    body: { type: String, required: true },
    image: { type: String, default: '' }, // GridFS file ID or legacy image URL/path
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['published', 'removed'], default: 'published' },
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Post', postSchema);