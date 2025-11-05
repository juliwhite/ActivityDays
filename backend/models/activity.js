const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  date: { type: Date, required: true },
  location: { type: String, required: true },
  organizer: { type: String, required: true },
  description: { type: String, required: true },
  category: {
    type: String,
    enum: ['spiritual goal', 'social goals', 'physical goal', 'intellectual goal'],
    required: true,
  },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Activity', activitySchema);