const express = require('express');
const DiaryEntry = require('../models/DiaryEntry');
const auth = require('../middleware/auth');
const router = express.Router();

// Get mood trends over time
router.get('/mood-trends', auth, async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - parseInt(days));

    const entries = await DiaryEntry.find({
      user: req.user._id,
      date: { $gte: startDate }
    }).select('mood date');

    // Group by date and count moods
    const moodTrends = {};
    entries.forEach(entry => {
      const dateKey = entry.date.toISOString().split('T')[0];
      if (!moodTrends[dateKey]) {
        moodTrends[dateKey] = {};
      }
      moodTrends[dateKey][entry.mood] = (moodTrends[dateKey][entry.mood] || 0) + 1;
    });

    res.json(moodTrends);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get mood distribution
router.get('/mood-distribution', auth, async (req, res) => {
  try {
    const entries = await DiaryEntry.find({ user: req.user._id });
    
    const distribution = {
      'very-happy': 0,
      'happy': 0,
      'neutral': 0,
      'sad': 0,
      'very-sad': 0
    };

    entries.forEach(entry => {
      distribution[entry.mood] = (distribution[entry.mood] || 0) + 1;
    });

    res.json(distribution);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get entry statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const totalEntries = await DiaryEntry.countDocuments({ user: req.user._id });
    
    const firstEntry = await DiaryEntry.findOne({ user: req.user._id })
      .sort({ date: 1 })
      .select('date');
    
    const lastEntry = await DiaryEntry.findOne({ user: req.user._id })
      .sort({ date: -1 })
      .select('date');

    const entriesThisMonth = await DiaryEntry.countDocuments({
      user: req.user._id,
      date: {
        $gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      }
    });

    const avgMood = await DiaryEntry.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$mood',
          count: { $sum: 1 }
        }
      },
      { $sort: { count: -1 } }
    ]);

    const mostCommonMood = avgMood.length > 0 ? avgMood[0]._id : null;

    res.json({
      totalEntries,
      firstEntryDate: firstEntry?.date || null,
      lastEntryDate: lastEntry?.date || null,
      entriesThisMonth,
      mostCommonMood
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;

