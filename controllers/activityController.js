const Meal = require('../models/Meal');
const Workout = require('../models/Workout');

exports.addMeal = async (req, res) => {
  try {
    const { name, calories, type } = req.body;
    const newMeal = new Meal({ user: req.user.id, name, calories, type });
    await newMeal.save();
    res.json(newMeal);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.getMeals = async (req, res) => {
  try {
    const meals = await Meal.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(meals);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.addWorkout = async (req, res) => {
  try {
    const { type, caloriesBurned, duration } = req.body;
    const newWorkout = new Workout({ user: req.user.id, type, caloriesBurned, duration });
    await newWorkout.save();
    res.json(newWorkout);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.getWorkouts = async (req, res) => {
  try {
    const workouts = await Workout.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(workouts);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};
