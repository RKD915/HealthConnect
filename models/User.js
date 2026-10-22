const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  age: { type: Number },
  weight: { type: Number }, // in kg
  targetWeight: { type: Number }, 
  fitnessGoal: { 
    type: String, 
    enum: ['weight loss', 'muscle gain', 'maintain weight', 'improve endurance'],
    default: 'maintain weight'
  },
  dailyCalorieGoal: { type: Number, default: 2000 },
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
