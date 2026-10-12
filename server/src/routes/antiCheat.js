import express from 'express';
import { db } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

// GET /api/anticheat/feed - flagged logs awaiting peer audit
router.get('/feed', (req, res) => {
  const flagged = db.workouts.filter(w => w.verificationStatus === 'flagged_review');
  res.json({ flaggedWorkouts: flagged });
});

// POST /api/anticheat/vote - community peer review vote
router.post('/vote', authenticateToken, (req, res) => {
  const { workoutId, vote } = req.body; // vote: 'verify' or 'reject'
  const workout = db.workouts.find(w => w.id === workoutId);

  if (!workout) {
    return res.status(404).json({ error: 'Workout not found' });
  }

  if (!workout.peerVotes) {
    workout.peerVotes = { verify: 0, reject: 0, voters: [] };
  }

  if (workout.peerVotes.voters.includes(req.user.id)) {
    return res.status(400).json({ error: 'You have already voted on this log.' });
  }

  workout.peerVotes.voters.push(req.user.id);
  if (vote === 'verify') {
    workout.peerVotes.verify += 1;
    if (workout.peerVotes.verify >= 3) {
      workout.verificationStatus = 'valid';
      workout.verificationBadge = 'Community Verified';
      workout.trustScore = 80;
    }
  } else {
    workout.peerVotes.reject += 1;
  }

  res.json({ success: true, workout });
});

export default router;
