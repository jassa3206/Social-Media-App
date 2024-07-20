const Post = require('../models/Post');
const User = require('../models/User');

exports.createPost = async (req, res) => {
  try {
    const { content, hashtags } = req.body;
    console.log('Received hashtags:', hashtags); // Debugging line

    if (hashtags.length > 10) {
      return res.status(400).json({ msg: 'You can only add up to 10 hashtags.' });
    }
    
    const post = new Post({
      content,
      user: req.user.id,
      hashtags,
    });

    await post.save();
    res.json(post);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', ['username', 'name', 'profilePicture'])
      .populate('comments.user', ['username', 'name', 'profilePicture'])
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};


exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    if (post.likes.includes(req.user.id)) {
      post.likes = post.likes.filter(like => like.toString() !== req.user.id);
    } else {
      post.likes.unshift(req.user.id);
    }
    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.savePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    if (post.saves.includes(req.user.id)) {
      post.saves = post.saves.filter(save => save.toString() !== req.user.id);
    } else {
      post.saves.unshift(req.user.id);
    }
    await post.save();
    res.json(post.saves);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.commentOnPost = async (req, res) => {
  try {
    const { content } = req.body;
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });

    const newComment = {
      user: req.user.id,
      content,
    };

    post.comments.unshift(newComment);
    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getUserPosts = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const pageNumber = parseInt(page);
  const limitNumber = parseInt(limit);

  try {
    const posts = await Post.find({ user: req.params.userId })
      .populate('user', ['username', 'name', 'profilePicture'])
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * limitNumber)
      .limit(limitNumber);

    const totalPosts = await Post.countDocuments({ user: req.params.userId });

    res.json({
      posts,
      hasMore: (pageNumber * limitNumber) < totalPosts,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};

exports.getFollowingPosts = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate('following', 'id');
    const followingIds = user.following.map(following => following.id);
    const posts = await Post.find({ user: { $in: followingIds } }).populate('user', ['username', 'name', 'profilePicture']).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
exports.getSavedPosts = async (req, res) => {
  try {
    const posts = await Post.find({ saves: req.user.id }).populate('user', 'username profilePicture');
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
exports.getLikedPosts = async (req, res) => {
  try {
    const posts = await Post.find({ likes: req.user.id }).populate('user', 'username profilePicture');
    res.json(posts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
}