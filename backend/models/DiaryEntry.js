const mongoose = require('mongoose');

const moodEnum = ['very-happy', 'happy', 'neutral', 'sad', 'very-sad'];

const diaryEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  content: {
    type: String,
    required: true
  },
  mood: {
    type: String,
    enum: moodEnum,
    required: true
  },
  date: {
    type: Date,
    required: true,
    default: Date.now
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

diaryEntrySchema.index({ user: 1, date: -1 });

module.exports = mongoose.model('DiaryEntry', diaryEntrySchema);

