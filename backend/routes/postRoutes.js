const express = require('express');
const router = express.Router();
const { createPost, getPosts, likePost, savePost,getFollowingPosts, commentOnPost, getUserPosts, getSavedPosts, getLikedPosts } = require('../controllers/postController');
const auth = require('../middleware/auth');

router.post('/', auth, createPost);
router.get('/', auth, getPosts); // Route to get all posts
router.get('/following', auth, getFollowingPosts);
router.post('/:id/like', auth, likePost);
router.post('/:id/save', auth, savePost);
router.post('/:id/comment', auth, commentOnPost);
router.get('/user/:userId', auth, getUserPosts);
router.get('/saved', auth, getSavedPosts);
router.get('/liked',auth, getLikedPosts)

module.exports = router;
