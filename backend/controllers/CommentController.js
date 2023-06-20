import Comment from '../models/Comment.js';
import User from '../models/User.js';


export const createComment = async (req, res) => {
  try {
    const { postId, text } = req.body;

    const userId = req.userId;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const comment = new Comment({
      post: postId,
      text,
      fullName: user.fullName, 
    });

    const savedComment = await comment.save();

    res.status(201).json(savedComment);
  } catch (error) {
    res.status(500).json({ error: 'Failed to save comment' });
  }
};


export const getCommentsByPostId = async (req, res) => {
  try {
    const postId = req.params.id;

    const comments = await Comment.find({ post: postId });

    // Преобразование комментариев, добавляя avatarUrl
    const transformedComments = await Promise.all(comments.map(async (comment) => {
      const { _id, post, text, fullName } = comment;

      // Получение пользователя по комментарию
      const user = await User.findOne({ fullName });

      // Если пользователь найден, добавляем avatarUrl
      const avatarUrl = user ? user.avatarUrl : null;

      return {
        _id,
        post,
        text,
        fullName,
        avatarUrl
      };
    }));

    res.json(transformedComments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};



