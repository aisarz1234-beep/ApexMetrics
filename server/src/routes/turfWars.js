import express from 'express';
import { db } from '../database.js';

const router = express.Router();

// GET /api/turf-wars
router.get('/', (req, res) => {
  res.json({ territories: db.territories });
});

export default router;
