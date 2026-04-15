// backend/routes/post.routes.js

const express = require('express');
const Post = require('../models/Post');
const { protect } = require('../middleware/auth.middleware');
const { memberOrAdmin } = require('../middleware/role.middleware');
const upload = require('../middleware/upload');
const { uploadToGridFS } = require('../utils/gridfs');

const router = express.Router();


// ── GET /api/posts ─────────────────────────────
// Public: all published posts (newest first)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({ status: 'published' })
      .populate('author', 'name profilePic')
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ── GET /api/posts/:id ─────────────────────────
// Public: get single post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'name profilePic');

    if (!post || post.status === 'removed') {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ── POST /api/posts ─────────────────────────
// Member/Admin: create new post
// upload.single('image') handles optional image file
router.post('/', protect, memberOrAdmin, upload.single('image'), async (req, res) => {
  try {
    const { title, body } = req.body;
    let image = '';

    if (req.file) {
      const result = await uploadToGridFS(req.file);
      image = result._id.toString();
    }

    const post = await Post.create({
      title,
      body,
      image,
      author: req.user._id
    });

    await post.populate('author', 'name profilePic');

    res.status(201).json(post);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ── PUT /api/posts/:id/like ─────────────────────────
// Member/Admin: like or unlike post
router.put('/:id/like', protect, memberOrAdmin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const userId = req.user._id;

    // ✅ TOGGLE LIKE
    const alreadyLiked = post.likes.includes(userId);

    if (alreadyLiked) {
      post.likes.pull(userId); // unlike
    } else {
      post.likes.push(userId); // like
    }

    await post.save();

    // optional: populate author again
    await post.populate('author', 'name profilePic');

    res.json(post);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ── PUT /api/posts/:id ─────────────────────────
// Edit post: only owner or admin
router.put('/:id', protect, memberOrAdmin, upload.single('image'), async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const isOwner = post.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    if (req.body.title) post.title = req.body.title;
    if (req.body.body) post.body = req.body.body;
    if (req.file) {
      const result = await uploadToGridFS(req.file);
      post.image = result._id.toString();
    }

    await post.save();

    res.json(post);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ── DELETE /api/posts/:id ─────────────────────────
// Delete post: only owner or admin
router.delete('/:id', protect, memberOrAdmin, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const isOwner = post.author.toString() === req.user._id.toString();
    const isAdmin = req.user.role === 'admin';

    if (!isOwner && !isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await post.deleteOne();

    res.json({ message: 'Post deleted successfully' });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;