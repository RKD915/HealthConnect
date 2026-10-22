const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');
const activityController = require('../controllers/activityController');
const socialController = require('../controllers/socialController');

// Auth routes
router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', auth, authController.getMe);

// User & Dashboard
router.get('/dashboard', auth, userController.getDashboard);
router.get('/leaderboard', auth, userController.getLeaderboard);

// Activity (Meals & Workouts)
router.post('/meals', auth, activityController.addMeal);
router.get('/meals', auth, activityController.getMeals);
router.post('/workouts', auth, activityController.addWorkout);
router.get('/workouts', auth, activityController.getWorkouts);

// Social (Posts, Comments, Follows)
router.post('/posts', auth, socialController.createPost);
router.get('/posts', auth, socialController.getAllPosts); // All posts for simplicity in demo
router.get('/feed', auth, socialController.getFeed);
router.put('/posts/:id/like', auth, socialController.likePost);
router.post('/posts/:id/comments', auth, socialController.addComment);
router.get('/posts/:id/comments', auth, socialController.getComments);
router.post('/users/:id/follow', auth, socialController.followUser);
router.get('/users/suggestions', auth, socialController.getUsersToFollow);

module.exports = router;
