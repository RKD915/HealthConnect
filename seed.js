const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
require('dotenv').config();

const User = require('./models/User');
const Meal = require('./models/Meal');
const Workout = require('./models/Workout');
const Post = require('./models/Post');
const Comment = require('./models/Comment');
const Follower = require('./models/Follower');

const connectDB = require('./config/db');

// Connect to MongoDB
connectDB();

const seedDatabase = async () => {
  try {
    console.log('Clearing old data...');
    await User.deleteMany();
    await Meal.deleteMany();
    await Workout.deleteMany();
    await Post.deleteMany();
    await Comment.deleteMany();
    await Follower.deleteMany();

    console.log('Generating base data arrays...');
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash('password123', salt);

    // 1. Create Users (30 Users)
    const usersData = [];
    const mainUser = {
      name: 'Rohan Sharma',
      email: 'rohan.sharma@example.com',
      password: passwordHash,
      age: 26,
      weight: 75,
      targetWeight: 70,
      fitnessGoal: 'weight loss',
      dailyCalorieGoal: 2200
    };
    usersData.push(mainUser);

    const firstNames = ['Liam', 'Olivia', 'Noah', 'Emma', 'Oliver', 'Charlotte', 'Elijah', 'Amelia', 'James', 'Ava', 'William', 'Sophia', 'Benjamin', 'Isabella', 'Lucas', 'Mia', 'Henry', 'Evelyn', 'Alexander', 'Harper', 'Michael', 'Luna', 'Ethan', 'Camila', 'Daniel', 'Gianna', 'Matthew', 'Elizabeth', 'Aiden'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin', 'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis'];
    for (let i = 0; i < 29; i++) {
      const name = `${firstNames[i]} ${lastNames[i]}`;
      const email = `${firstNames[i].toLowerCase()}.${lastNames[i].toLowerCase()}@example.com`;
      usersData.push({
        name: name,
        email: email,
        password: passwordHash,
        age: Math.floor(Math.random() * 23) + 18,
        weight: Math.floor(Math.random() * 50) + 50,
        targetWeight: Math.floor(Math.random() * 50) + 50,
        fitnessGoal: ['weight loss', 'muscle gain', 'maintain weight', 'improve endurance'][Math.floor(Math.random() * 4)],
        dailyCalorieGoal: Math.floor(Math.random() * 1000) + 1500
      });
    }

    const createdUsers = await User.insertMany(usersData);
    console.log(`Created ${createdUsers.length} Users.`);

    // 2. Create Meals (150 Meals)
    const mealsData = [];
    const mealNames = ['Oats', 'Chicken Rice', 'Protein Shake', 'Salmon Salad', 'Greek Yogurt', 'Protein Bar', 'Pasta', 'Steak', 'Egg Whites', 'Banana'];
    const mealTypes = ['Breakfast', 'Lunch', 'Dinner', 'Snack'];

    for (let i = 0; i < 150; i++) {
        const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
        let calories = Math.floor(Math.random() * 500) + 100;
        const mealName = mealNames[Math.floor(Math.random() * mealNames.length)];
        if(mealName === 'Oats' || mealName === 'Banana') calories = Math.floor(Math.random() * 100) + 100;
        if(mealName === 'Chicken Rice' || mealName === 'Steak') calories = Math.floor(Math.random() * 300) + 400;

        mealsData.push({
            user: randomUser._id,
            name: mealName,
            calories: calories,
            type: mealTypes[Math.floor(Math.random() * mealTypes.length)],
        });
    }
    await Meal.insertMany(mealsData);
    console.log(`Created ${mealsData.length} Meals.`);

    // 3. Create Workouts (150 Workouts)
    const workoutsData = [];
    const workoutTypes = ['Running', 'Gym', 'Cycling', 'Swimming', 'Yoga', 'HIIT', 'Walking'];
    
    for (let i = 0; i < 150; i++) {
        const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
        const wType = workoutTypes[Math.floor(Math.random() * workoutTypes.length)];
        let caloriesBurned = Math.floor(Math.random() * 600) + 150;
        if(wType === 'Running') caloriesBurned = Math.floor(Math.random() * 200) + 300;
        if(wType === 'Gym') caloriesBurned = Math.floor(Math.random() * 200) + 200;
        if(wType === 'Yoga') caloriesBurned = Math.floor(Math.random() * 100) + 100;

        workoutsData.push({
            user: randomUser._id,
            type: wType,
            caloriesBurned: caloriesBurned,
            duration: Math.floor(Math.random() * 60) + 30 
        });
    }
    await Workout.insertMany(workoutsData);
    console.log(`Created ${workoutsData.length} Workouts.`);

    // 4. Create Posts (60 Posts)
    const postsData = [];
    for (let i = 0; i < 60; i++) {
        const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
        
        // Random 3-6 likes
        const numLikes = Math.floor(Math.random() * 4) + 3; 
        const likes = [];
        for(let j = 0; j < numLikes; j++) {
            const randomLiker = createdUsers[Math.floor(Math.random() * createdUsers.length)];
            if(!likes.includes(randomLiker._id)) likes.push(randomLiker._id);
        }

        const postContents = [
            `Just finished an amazing ${workoutTypes[Math.floor(Math.random() * workoutTypes.length)]} session! Feeling great! 💪🔥`,
            `Pushing my limits today at the gym! Results are coming! 🚀`,
            `Healthy eating day! Had a huge salad for lunch 🥗`,
            `Rest day today. Recovery is just as important as the workout! 🧘‍♀️`,
            `Hit a new personal record today! Hard work pays off! 🏅`,
            `Early morning workout done! Ready to conquer the day! ☀️`
        ];

        postsData.push({
            user: randomUser._id,
            content: postContents[Math.floor(Math.random() * postContents.length)],
            likes: likes
        });
    }
    const createdPosts = await Post.insertMany(postsData);
    console.log(`Created ${createdPosts.length} Posts (with likes).`);

    // 5. Create Comments (1-3 per post)
    let commentCount = 0;
    for (const post of createdPosts) {
      const numComments = Math.floor(Math.random() * 3) + 1;
      for (let i = 0; i < numComments; i++) {
        const randomUser = createdUsers[Math.floor(Math.random() * createdUsers.length)];
        await Comment.create({
            post: post._id,
            user: randomUser._id,
            text: ['Awesome job!', 'Keep it up!', 'Insane work 🔥', 'Inspiring!'][Math.floor(Math.random() * 4)]
        });
        commentCount++;
      }
    }
    console.log(`Created ${commentCount} Comments.`);

    // 6. Create Followers
    const followersData = [];
    const followSet = new Set();
    for (let i = 0; i < 200; i++) {
        const follower = createdUsers[Math.floor(Math.random() * createdUsers.length)]._id;
        const following = createdUsers[Math.floor(Math.random() * createdUsers.length)]._id;
        
        const pairString = `${follower}_${following}`;
        
        if (follower.toString() !== following.toString() && !followSet.has(pairString)) {
            followersData.push({ follower, following });
            followSet.add(pairString);
        }
    }
    await Follower.insertMany(followersData);
    console.log(`Created ${followersData.length} Followers connections.`);

    console.log('Database successfully seeded!');
    console.log('----------');
    console.log('Test Account Info:');
    console.log('Email: rohan.sharma@example.com');
    console.log('Password: password123');
    console.log('----------');
    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seedDatabase();
