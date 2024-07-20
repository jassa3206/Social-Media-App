// userRoutes.js
const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUserProfile,
  followUser,
  searchUsers,
  getUserFollowing,
  getUserFollowers,
  unfollowUser,
  uploadProfilePicture,
} = require('../controllers/userController');
const auth = require('../middleware/auth');
const upload = require('../upload');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', auth, getUserProfile);
router.post('/profile/picture', auth, upload.single('file'), uploadProfilePicture);
router.get('/search', auth, searchUsers);
router.post('/follow/:id', auth, followUser); 
router.post('/unfollow/:id', auth, unfollowUser);
router.get('/:id/following', auth, getUserFollowing);
router.get('/:id/followers', auth, getUserFollowers);

module.exports = router;
