const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cloudinary = require('../config/cloudinaryConfig');
const fs = require('fs');


exports.searchUsers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ msg: 'No search query provided' });
    }

    const users = await User.find({ username: { $regex: query, $options: 'i' } }).select('username name email bio profilePicture');
    res.json(users);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
exports.registerUser = async (req, res) => {
  const { username, email, password, name, bio } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    user = new User({ username, email, password, name, bio });

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = { user: { id: user._id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user });
    });
  } catch (err) {
    console.error('Register user error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    let user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = { user: { id: user._id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) throw err;
      res.json({ token, user });
    });
  } catch (err) {
    console.error('Login user error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    console.log('getUserProfile called');
    console.log('Request user:', req.user);
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Get user profile error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.updateUserProfile = async (req, res) => {
  const { name, bio } = req.body;
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    user.name = name || user.name;
    user.bio = bio || user.bio;

    await user.save();

    res.json(user);
  } catch (err) {
    console.error('Update user profile error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};
// exports.uploadProfilePicture = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);
//     if (!user) {
//       return res.status(404).json({ msg: 'User not found' });
//     }

//     if (!req.file) {
//       return res.status(400).json({ msg: 'No file uploaded' });
//     }

//     // Convert the image buffer to a Base64 encoded string
//     const base64Image = req.file.buffer.toString('base64');
//     const mimeType = req.file.mimetype;

//     // Store the Base64 encoded string along with the MIME type
//     user.profilePicture = `data:${mimeType};base64,${base64Image}`;
//     await user.save();

//     res.json(user);
//   } catch (err) {
//     console.error('Upload profile picture error:', err.message);
//     res.status(500).json({ msg: 'Server error' });
//   }
// };

exports.uploadProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (!req.file) {
      return res.status(400).json({ msg: 'No file uploaded' });
    }

    // Upload the image to Cloudinary
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'profile_pictures', // Optional: Organize uploads into folders
      allowed_formats: ['jpg', 'png', 'jpeg'], // Optional: Limit formats
    });

    // Store the Cloudinary URL in the user document
    user.profilePicture = result.secure_url;
    await user.save();

    // Delete the file from local storage after uploading to Cloudinary
    fs.unlinkSync(req.file.path);

    res.json(user);
  } catch (err) {
    console.error('Upload profile picture error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Get user profile error:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.followUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const userToFollow = await User.findById(req.params.id);

    if (!userToFollow) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (user.following.includes(req.params.id)) {
      return res.status(400).json({ msg: 'You are already following this user' });
    }

    user.following.push(req.params.id);
    userToFollow.followers.push(req.user.id);

    await user.save();
    await userToFollow.save();

    res.json({ msg: 'User followed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.unfollowUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const userToUnfollow = await User.findById(req.params.id);

    if (!userToUnfollow) {
      return res.status(404).json({ msg: 'User not found' });
    }

    if (!user.following.includes(req.params.id)) {
      return res.status(400).json({ msg: 'You are not following this user' });
    }

    user.following = user.following.filter(following => following.toString() !== req.params.id);
    userToUnfollow.followers = userToUnfollow.followers.filter(follower => follower.toString() !== req.user.id);

    await user.save();
    await userToUnfollow.save();

    res.json({ msg: 'User unfollowed successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
exports.getUserFollowing = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('following', 'username name profilePicture');
    res.json(user.following);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getUserFollowers = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).populate('followers', 'username name profilePicture');
    res.json(user.followers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


