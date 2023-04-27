// routes/auth.js

import { Router } from 'express';
import { sign } from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { findOne } from '../models/user';

// Exporting a function
export function function2() {
  


const router = Router();

// Authenticate user and return JWT token
router.post('/', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Dummy authentication logic
    if (email === 'example@gmail.com' && password === 'password') {
      // Find user by email
      const user = await findOne({ email });

      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      // Generate JWT token
      const token = sign({ id: user._id }, JWT_SECRET, { expiresIn: '1h' });

      res.json({ token });
    } else {
      res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (err) {
    next(err);
  }
});
}

export default Router;
