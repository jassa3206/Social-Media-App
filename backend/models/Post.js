const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  content: { type: String, required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  likes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  saves: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [
    {
      user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
      content: { type: String, required: true },
      createdAt: { type: Date, default: Date.now },
    },
  ],
  hashtags: [{ type: String, maxLength: 50 }], 
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Post', PostSchema);
