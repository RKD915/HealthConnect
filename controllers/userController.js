const User = require('../models/User');
const Meal = require('../models/Meal');
const Workout = require('../models/Workout');
const Follower = require('../models/Follower');

exports.getDashboard = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    // Get today's start and end date
    const start = new Date();
    start.setHours(0,0,0,0);
    const end = new Date();
    end.setHours(23,59,59,999);

    const meals = await Meal.find({ user: req.user.id, createdAt: { $gte: start, $lte: end } });
    const workouts = await Workout.find({ user: req.user.id, createdAt: { $gte: start, $lte: end } });

    const caloriesConsumed = meals.reduce((acc, curr) => acc + curr.calories, 0);
    const caloriesBurned = workouts.reduce((acc, curr) => acc + curr.caloriesBurned, 0);
    const netCalories = Math.max(0, caloriesConsumed - caloriesBurned);
    const remainingCalories = user.dailyCalorieGoal - netCalories;

    // AI Mock Tip
    let tip = "Keep up the great work!";
    if (netCalories > user.dailyCalorieGoal) {
      if(user.fitnessGoal === 'weight loss') tip = "You've exceeded your daily net calorie goal. Try a light evening walk!";
      else tip = "Good job fueling up for muscle gain!";
    } else if (netCalories < user.dailyCalorieGoal * 0.8) {
      tip = "You might need to eat a bit more to reach your daily net calorie targets and keep your energy up.";
    }

    res.json({
      user,
      summary: { caloriesConsumed, caloriesBurned, netCalories, remainingCalories },
      tip
    });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.getLeaderboard = async (req, res) => {
  try {
    // Rank users by points (calories burned for simplicity)
    const workouts = await Workout.aggregate([
      { $group: { _id: "$user", totalBurned: { $sum: "$caloriesBurned" } } },
      { $sort: { totalBurned: -1 } },
      { $limit: 10 }
    ]);
    
    const populated = await User.populate(workouts, { path: '_id', select: 'name email' });
    res.json(populated.map(p => ({ user: p._id, totalBurned: p.totalBurned })));
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
