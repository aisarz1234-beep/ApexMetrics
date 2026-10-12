import express from 'express';
import { db } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/bounties
router.get('/', (req, res) => {
  res.json({ bounties: db.bounties });
});

// POST /api/bounties/:id/claim
router.post('/:id/claim', authenticateToken, (req, res) => {
  const bounty = db.bounties.find(b => b.id === req.params.id);
  if (!bounty) {
    return res.status(404).json({ error: 'Bounty not found' });
  }

  if (bounty.claimedBy.includes(req.user.id)) {
    return res.status(400).json({ error: 'Bounty reward already claimed for this cycle.' });
  }

  bounty.claimedBy.push(req.user.id);
  
  // Award bonus points to user
  const user = db.getUserById(req.user.id);
  user.totalPoints += bounty.rewardPoints;
  user.weeklyPoints += bounty.rewardPoints;
  user.dailyPoints += bounty.rewardPoints;

  db.leaderboardZSets.allTime.zadd(user.id, user.totalPoints);
  db.leaderboardZSets.weekly.zadd(user.id, user.weeklyPoints);
  db.leaderboardZSets.daily.zadd(user.id, user.dailyPoints);

  const { passwordHash: _, ...safeUser } = user;
  res.json({
    success: true,
    claimedBounty: bounty,
    rewardPoints: bounty.rewardPoints,
    user: safeUser
  });
});

export default router;
