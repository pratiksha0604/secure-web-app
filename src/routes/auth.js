const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const auth = require('../middleware/auth');

const users = []; // demo storage; a real app uses a DB with parameterized queries

const rules = [
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 8 }).withMessage('Password must be at least 8 characters'),
];

router.post('/register', rules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { email, password } = req.body;
  if (users.find(u => u.email === email))
    return res.status(409).json({ error: 'User already exists' });

  users.push({ email, password: await bcrypt.hash(password, 12) });
  res.status(201).json({ message: 'Registered successfully' });
});

router.post('/login', rules, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const user = users.find(u => u.email === req.body.email);
  if (!user || !(await bcrypt.compare(req.body.password, user.password)))
    return res.status(401).json({ error: 'Invalid credentials' });

  const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});

router.get('/profile', auth, (req, res) => res.json({ email: req.user.email }));

module.exports = router;