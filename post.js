import { Router } from 'express';
import authMiddleware from '../middlewares/auth';
import Post, { findOneAndDelete, findById } from '../models/post';

// Exporting a function
export function function4() {
  


const router = Router();

// Add a new post
router.post('/', authMiddleware, async (req, res, next) => {
  try {
    const { title, description } = req.body;

    // Create a new post
    const post = new Post({ title, description, createdBy: req.userId });
    await post.save();

    res.json({
      id: post._id,
      title: post.title,
      description: post.description,
      created_at: post.createdAt,
    });
  } catch (err) {
    next(err);
  }
});

// Delete a post
router.delete('/:id', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await findOneAndDelete({ _id: id, createdBy: req.userId });

    if (!post) {
      return res.status(404).json({ message: 'Post not found or unauthorized to delete' });
    }

    res.json({ message: 'Post deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// Like a post
router.post('/:id/like', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.likes.includes(req.userId)) {
      return res.status(400).json({ message: 'Post already liked' });
    }

    post.likes.push(req.userId);
    await post.save();

    res.json({ message: 'Post liked successfully' });
  } catch (err) {
    next(err);
  }
});

// Unlike a post
router.post('/:id/unlike', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const post = await findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (!post.likes.includes(req.userId)) {
      return res.status(400).json({ message: 'Post not liked yet' });
    }

    post.likes.pull(req.userId);
    await post.save();

    res.json({ message: 'Post unliked successfully' });
  } catch (err) {
    next(err);
  }
});

// Comment on a post
router.post('/:id/comment', authMiddleware, async (req, res, next) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const post = await findById(id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({ text, createdBy: req.userId });
    await post.save();

    res.json({ message: 'Comment added successfully' });
  } catch (err) {
    next(err);
  }
});
}
export default Router;
