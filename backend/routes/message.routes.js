const express = require('express');
const Message = require('../models/Message');

const router = express.Router();

/* SEND MESSAGE (USER) */
router.post('/', async (req, res) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: "All fields required" });
    }

    const newMessage = await Message.create({
      name,
      email,
      message
    });

    res.status(201).json(newMessage);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;