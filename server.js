require('dotenv').config();
const express = require('express');
const path = require('path');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const bcrypt = require('bcryptjs');
const { body, validationResult } = require('express-validator');

const app = express();
const PORT = process.env.PORT || 3000;

// Security middleware
app.use(helmet());
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,                 // 100 requests per IP
    standardHeaders: true,
    legacyHeaders: false,
  })
);
app.use(express.json({ limit: '10kb' }));
app.use(express.static(path.join(__dirname, 'public')));

// Temporary in-memory user store (no database yet)
const users = [];

app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Register: validated input + hashed password
app.post(
  '/register',
  body('email').isEmail().withMessage('Valid email required').normalizeEmail(),
  body('password')
    .isLength({ min: 8 })
    .withMessage('Password must be at least 8 characters'),
  async (req, res, next) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      if (users.find((u) => u.email === email)) {
        return res.status(409).json({ message: 'User already exists' });
      }

      const hash = await bcrypt.hash(password, 12);
      users.push({ email, password: hash });

      res.status(201).json({ message: 'User registered' });
    } catch (err) {
      next(err);
    }
  }
);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: 'Not found' });
});

// Central error handler: logs details, hides them from the client
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: 'Something went wrong' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});