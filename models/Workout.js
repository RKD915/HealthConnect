const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, required: true }, // e.g. "Running", "Gym"
  caloriesBurned: { type: Number, required: true },
  duration: { type: Number, required: true } // in minutes
}, { timestamps: true });

module.exports = mongoose.model('Workout', workoutSchema);
