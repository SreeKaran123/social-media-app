// Import required modules
const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const pg = require('pg');

// Create Express app
const app = express();

// Middleware for parsing JSON
app.use(express.json());

// Connect to PostgreSQL database
const pool = new pg.Pool({
  user: 'your_db_user',
  password: 'your_db_password',
  host: 'localhost',
  port: 5432,
  database: 'your_db_name'
});

// User registration
app.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user into database
    await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);

    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// User login
app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if user exists in database
    const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ userId: user.id }, 'your_jwt_secret', { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Protected route with JWT authentication
app.get('/profile', async (req, res) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, 'your_jwt_secret');

    // Fetch user profile from database
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [decoded.userId]);
    const user = result.rows[0];

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Post creation
app.post('/posts', async (req, res) => {
  try {
    const { title, content } = req.body;

    // Insert post into database
    await pool.query('INSERT INTO posts (title, content) VALUES ($1, $2)', [title, content]);

    res.status(201).json({ message: 'Post created successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Post retrieval
app.get('/posts', async (req, res) => {
    try {
      // Fetch all posts from database
      const result = await db.query(`
        SELECT 
          posts.id,
          posts.title,
          posts.description,
          posts.created_at,
          COUNT(likes.id) AS like_count,
          ARRAY_AGG(comments) AS comments
        FROM 
          posts
          LEFT JOIN likes ON posts.id = likes.post_id
          LEFT JOIN (
            SELECT 
              post_id,
              json_build_object(
                'id', comments.id,
                'text', comments.text,
                'created_at', comments.created_at,
                'user', json_build_object(
                  'id', users.id,
                  'name', users.name
                )
              ) AS comments
            FROM 
              comments
              JOIN users ON comments.user_id = users.id
          ) AS comments ON posts.id = comments.post_id
        GROUP BY 
          posts.id
        ORDER BY 
          created_at DESC
      `);
  
      // Send posts as response
      res.json(result.rows);
    } catch (err) {
      // Log error and send 500 status code
      console.error(err);
      res.sendStatus(500);
    }
  });
  