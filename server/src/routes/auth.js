import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { CONFIG } from '../config.js';
import { db } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

// Register new user
router.post('/register', authLimiter, (req, res) => {
  const { username, name, email, password, characterClass, campus, team } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Username, email, and password are required.' });
  }

  const existing = db.getUserByEmail(email);
  if (existing) {
    return res.status(409).json({ error: 'An account with this email already exists.' });
  }

  const salt = bcrypt.genSaltSync(10);
  const passwordHash = bcrypt.hashSync(password, salt);

  const newUser = db.createUser({
    username: username.trim(),
    name: name ? name.trim() : username.trim(),
    email: email.trim().toLowerCase(),
    passwordHash,
    characterClass: characterClass || 'Vanguard',
    campus: campus || 'Main Gym',
    team: team || 'Crimson Lions',
    avatar: characterClass === 'Juggernaut' ? '🏋️‍♂️' :
            characterClass === 'Apex Strider' ? '🏃‍♂️' :
            characterClass === 'Aquanaut' ? '🏊‍♀️' :
            characterClass === 'Shinobi' ? '🤸‍♂️' : '⚡'
  });

  const token = jwt.sign({ id: newUser.id, username: newUser.username }, CONFIG.JWT_SECRET, {
    expiresIn: '7d'
  });

  const { passwordHash: _, ...safeUser } = newUser;
  res.status(201).json({ user: safeUser, token });
});

// Login user
router.post('/login', authLimiter, (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required.' });
  }

  const user = db.getUserByEmail(email);
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const isMatch = bcrypt.compareSync(password, user.passwordHash);
  if (!isMatch) {
    return res.status(401).json({ error: 'Invalid email or password.' });
  }

  const token = jwt.sign({ id: user.id, username: user.username }, CONFIG.JWT_SECRET, {
    expiresIn: '7d'
  });

  const { passwordHash: _, ...safeUser } = user;
  res.json({ user: safeUser, token });
});

// Get current user profile
router.get('/me', authenticateToken, (req, res) => {
  const { passwordHash: _, ...safeUser } = req.user;
  res.json({ user: safeUser });
});

// Update profile / switch character class
router.patch('/profile', authenticateToken, (req, res) => {
  const { characterClass, team, campus, avatar } = req.body;
  const updates = {};

  if (characterClass) updates.characterClass = characterClass;
  if (team) updates.team = team;
  if (campus) updates.campus = campus;
  if (avatar) updates.avatar = avatar;

  const updatedUser = db.updateUser(req.user.id, updates);
  const { passwordHash: _, ...safeUser } = updatedUser;
  res.json({ user: safeUser });
});

// Mock Strava OAuth 2.0 Integration & Sync
router.post('/strava/connect', authenticateToken, (req, res) => {
  const updatedUser = db.updateUser(req.user.id, { stravaLinked: true });
  res.json({
    success: true,
    message: 'Strava OAuth 2.0 account successfully connected. Future GPS activities will be automatically certified.',
    stravaLinked: true
  });
});

export default router;
