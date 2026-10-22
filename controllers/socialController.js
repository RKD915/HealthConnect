const Post = require('../models/Post');
const Comment = require('../models/Comment');
const Follower = require('../models/Follower');

exports.createPost = async (req, res) => {
  try {
    const newPost = new Post({ user: req.user.id, content: req.body.content });
    await newPost.save();
    res.json(newPost);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.getFeed = async (req, res) => {
  try {
    // Get following
    const following = await Follower.find({ follower: req.user.id }).select('following');
    const followingIds = following.map(f => f.following);
    followingIds.push(req.user.id); // Also see own posts

    const posts = await Post.find({ user: { $in: followingIds } })
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name')
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (post.likes.includes(req.user.id)) {
      post.likes = post.likes.filter(id => id.toString() !== req.user.id.toString());
    } else {
      post.likes.push(req.user.id);
    }
    await post.save();
    res.json(post.likes);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.addComment = async (req, res) => {
  try {
    const newComment = new Comment({ post: req.params.id, user: req.user.id, text: req.body.text });
    await newComment.save();
    res.json(newComment);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.getComments = async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.id }).populate('user', 'name');
    res.json(comments);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.followUser = async (req, res) => {
  try {
    const existingFollow = await Follower.findOne({ follower: req.user.id, following: req.params.id });
    if (existingFollow) {
      await Follower.findByIdAndDelete(existingFollow._id);
      return res.json({ msg: 'Unfollowed' });
    }
    const newFollow = new Follower({ follower: req.user.id, following: req.params.id });
    await newFollow.save();
    res.json({ msg: 'Followed' });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

exports.getUsersToFollow = async (req, res) => {
  try {
    const User = require('../models/User'); // inline require
    const following = await Follower.find({ follower: req.user.id });
    const followingIds = following.map(f => f.following);
    followingIds.push(req.user.id);

    const suggestions = await User.find({ _id: { $nin: followingIds } }).limit(10).select('name');
    res.json(suggestions);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};
