const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload');
const { uploadToGridFS } = require('../utils/gridfs');

const router = express.Router();

/* =========================
   JWT GENERATOR
========================= */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

/* =========================
   REGISTER
========================= */
router.post('/register', async (req, res) => {
  const { name, username, email, password } = req.body;

  try {
    const emailExists = await User.findOne({ email });
    const usernameExists = await User.findOne({ username });

    if (emailExists)
      return res.status(400).json({ message: 'Email already registered' });

    if (usernameExists)
      return res.status(400).json({ message: 'Username already taken' });

    const user = await User.create({
      name,
      username,
      email,
      password,
    });

    res.status(201).json({
      token: generateToken(user._id),
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   LOGIN
========================= */
router.post('/login', async (req, res) => {
  const { identifier, password } = req.body;

  try {
    const user = await User.findOne({
      $or: [
        { email: identifier.toLowerCase() },
        { username: identifier.toLowerCase() },
      ],
    });

    if (!user)
      return res.status(400).json({ message: 'Invalid credentials' });

    if (user.status === 'inactive')
      return res.status(403).json({ message: 'Account deactivated' });

    const match = await user.matchPassword(password);

    if (!match)
      return res.status(400).json({ message: 'Invalid credentials' });

    res.json({
      token: generateToken(user._id),
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/* =========================
   GET CURRENT USER
========================= */
router.get('/me', protect, async (req, res) => {
  res.json(req.user);
});

/* =========================
   UPDATE PROFILE (FINAL FIXED)
========================= */
router.put(
  '/profile',
  protect,
  upload.single('profilePic'),
  async (req, res) => {
    try {
      const { name, bio, username } = req.body;

      const updateData = {};

      /* =========================
         NAME UPDATE
      ========================= */
      if (name && name.trim() !== '') {
        updateData.name = name.trim();
      }

      /* =========================
         BIO UPDATE
      ========================= */
      if (bio !== undefined) {
        updateData.bio = bio;
      }

      /* =========================
         USERNAME UPDATE (FIXED)
      ========================= */
      if (username && username.trim() !== '') {
        const cleanUsername = username.toLowerCase().trim();

        // 🔥 Check if username already exists
        const existingUser = await User.findOne({ username: cleanUsername });

        if (
          existingUser &&
          existingUser._id.toString() !== req.user._id.toString()
        ) {
          return res.status(400).json({
            message: 'Username already taken',
          });
        }

        updateData.username = cleanUsername;
      }

      /* =========================
         PROFILE PIC UPDATE
      ========================= */
      if (req.file) {
        const result = await uploadToGridFS(req.file);
        updateData.profilePic = result._id.toString();
      }

      /* =========================
         UPDATE USER
      ========================= */
      const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { $set: updateData },
        {
          new: true,
          runValidators: true,
        }
      ).select('-password');

      if (!updatedUser) {
        return res.status(404).json({
          message: 'User not found',
        });
      }

      res.json(updatedUser);

    } catch (err) {
      console.error(err);
      res.status(500).json({
        message: 'Server error while updating profile',
      });
    }
  }
);

/* =========================
   CHANGE PASSWORD (SAFE)
========================= */
router.put('/change-password', protect, async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user._id);

    const match = await user.matchPassword(currentPassword);

    if (!match)
      return res.status(400).json({ message: 'Incorrect password' });

    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;