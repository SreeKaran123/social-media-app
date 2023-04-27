// routes/user.js

import { Router } from 'express';
import authMiddleware from '../middlewares/auth';
import { findById } from '../models/user';

// Exporting a function
export function function3() {
 


const router = Router();

// Get user profile
router.get('/', authMiddleware, async (req, res, next) => {
  try {
    // Find user by ID from authenticated token
    const user = await findById(req.userId);

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      name: user.name,
      followers: user.followers.length,
      followings: user.followings.length,
    });
  } catch (err) {
    next(err);
  }
});
}
export default Router;
