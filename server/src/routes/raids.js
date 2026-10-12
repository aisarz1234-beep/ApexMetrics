import express from 'express';
import { db } from '../database.js';

const router = express.Router();

// GET /api/raids
router.get('/', (req, res) => {
  res.json({ raids: db.raids });
});

export default router;
