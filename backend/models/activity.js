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

  // ⭐ NEW: Ratings array
  ratings: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      value: { type: Number, required: true, min: 1, max: 5 }
    }
  ],
});

// ⭐ Helper — calculate average rating
activitySchema.methods.getAverageRating = function () {
  if (this.ratings.length === 0) return 0;
  const sum = this.ratings.reduce((total, r) => total + r.value, 0);
  return (sum / this.ratings.length).toFixed(1);
};

module.exports = mongoose.model('Activity', activitySchema);