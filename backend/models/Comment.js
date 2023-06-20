import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  post: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  fullName: {
    type: String,
    required: true,
  },
});

const Comment = mongoose.model('Comment', commentSchema);

export default Comment;
