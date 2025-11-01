const express = require('express');
const DiaryEntry = require('../models/DiaryEntry');
const auth = require('../middleware/auth');
const router = express.Router();

// Get all entries for authenticated user
router.get('/', auth, async (req, res) => {
  try {
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    const query = DiaryEntry.find({ user: req.user._id })
      .sort({ date: -1 })
      .select('-user');
    
    if (limit) {
      query.limit(limit);
    }
    
    const entries = await query;
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single entry
router.get('/:id', auth, async (req, res) => {
  try {
    const entry = await DiaryEntry.findOne({
      _id: req.params.id,
      user: req.user._id
    }).select('-user');

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create entry
router.post('/', auth, async (req, res) => {
  try {
    const { title, content, mood, date, tags } = req.body;

    if (!title || !content || !mood) {
      return res.status(400).json({ message: 'Please provide title, content, and mood' });
    }

    const entry = new DiaryEntry({
      user: req.user._id,
      title,
      content,
      mood,
      date: date || new Date(),
      tags: tags || []
    });

    await entry.save();
    res.status(201).json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update entry
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, content, mood, date, tags } = req.body;

    const entry = await DiaryEntry.findOne({
      _id: req.params.id,
      user: req.user._id
    });

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    if (title) entry.title = title;
    if (content) entry.content = content;
    if (mood) entry.mood = mood;
    if (date) entry.date = date;
    if (tags) entry.tags = tags;

    await entry.save();
    res.json(entry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete entry
router.delete('/:id', auth, async (req, res) => {
  try {
    const entry = await DiaryEntry.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id
    });

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

