import express from 'express';
import { db } from '../database.js';

const router = express.Router();

// GET /api/leaderboards?timeframe=daily|weekly|allTime&campus=...&team=...
router.get('/', (req, res) => {
  const { timeframe = 'weekly', campus = 'all', team = 'all' } = req.query;
  const leaderboard = db.getLeaderboard(timeframe, campus, team);

  res.json({
    timeframe,
    campus,
    team,
    totalAthletes: leaderboard.length,
    leaderboard
  });
});

export default router;
