import express from 'express';
import multer from 'multer';
import { db } from '../database.js';
import { authenticateToken } from '../middleware/auth.js';
import { ScoringEngine } from '../scoringEngine.js';
import { AntiCheatEngine } from '../antiCheatEngine.js';

const router = express.Router();
const upload = multer({ limits: { fileSize: 5 * 1024 * 1024 } }); // 5MB limit

// Get all workouts (Feed)
router.get('/', (req, res) => {
  const { category, verifiedOnly, campus } = req.query;
  let results = [...db.workouts];

  if (category && category !== 'all') {
    results = results.filter(w => w.activityCategory === category);
  }
  if (verifiedOnly === 'true') {
    results = results.filter(w => w.verificationStatus === 'verified');
  }
  if (campus && campus !== 'all') {
    results = results.filter(w => {
      const user = db.getUserById(w.userId);
      return user && user.campus === campus;
    });
  }

  res.json({ workouts: results });
});

// Calculate live points preview (without persisting)
router.post('/preview-score', (req, res) => {
  const { workout, userClass, options } = req.body;
  if (!workout) {
    return res.status(400).json({ error: 'Workout data required' });
  }

  const scoreData = ScoringEngine.calculatePoints(workout, userClass || 'Vanguard', options || {});
  const antiCheatCheck = AntiCheatEngine.validateHeuristics(workout);

  res.json({
    ...scoreData,
    antiCheatCheck
  });
});

// Upload and verify GPX/FIT file
router.post('/upload-gpx', authenticateToken, upload.single('gpxFile'), (req, res) => {
  try {
    let fileContent = '';
    if (req.file) {
      fileContent = req.file.buffer.toString('utf-8');
    } else if (req.body.gpxText) {
      fileContent = req.body.gpxText;
    } else {
      return res.status(400).json({ error: 'No GPX or FIT data provided' });
    }

    const verificationResult = AntiCheatEngine.parseAndVerifyGpx(fileContent);
    res.json(verificationResult);
  } catch (err) {
    res.status(500).json({ error: 'Failed to process GPX file: ' + err.message });
  }
});

// Log a new workout
router.post('/', authenticateToken, (req, res) => {
  const {
    activityCategory,
    activityType,
    metrics,
    exerciseName,
    sportName,
    zone,
    isGpxVerified,
    gpxVerificationData
  } = req.body;

  if (!activityCategory || !activityType || !metrics) {
    return res.status(400).json({ error: 'Activity category, type, and metrics are required.' });
  }

  const user = req.user;

  // 1. Run Anti-Cheat & Verification
  const heuristicCheck = AntiCheatEngine.validateHeuristics({
    activityCategory,
    activityType,
    metrics
  });

  let verificationStatus = heuristicCheck.verificationStatus;
  let verificationBadge = 'Self-Reported';
  let trustScore = heuristicCheck.trustScore;

  if (isGpxVerified && gpxVerificationData?.verified) {
    verificationStatus = 'verified';
    verificationBadge = 'Verified GPS (Smartwatch)';
    trustScore = gpxVerificationData.trustScore || 98;
  } else if (user.stravaLinked && activityCategory === 'cardio') {
    verificationStatus = 'verified';
    verificationBadge = 'Verified via Strava OAuth';
    trustScore = 99;
  }

  // 2. Calculate Unified Normalized Points
  const scoreResult = ScoringEngine.calculatePoints(
    { activityCategory, activityType, metrics, exerciseName, sportName },
    user.characterClass,
    { streakMultiplier: user.streakDays >= 7 ? 1.1 : 1.0 }
  );

  // 3. Save Workout
  const newWorkout = db.addWorkout({
    userId: user.id,
    userName: user.name,
    userAvatar: user.avatar,
    userClass: user.characterClass,
    team: user.team,
    activityCategory,
    activityType,
    exerciseName,
    sportName,
    metrics,
    points: scoreResult.finalPoints,
    breakdown: scoreResult.breakdown,
    statGains: scoreResult.statGains,
    verificationStatus,
    verificationBadge,
    trustScore,
    flags: heuristicCheck.flags,
    zone: zone || 'Campus Green'
  });

  const updatedUser = db.getUserById(user.id);
  const { passwordHash: _, ...safeUser } = updatedUser;

  // 4. WebSocket Real-Time Broadcast
  const io = req.app.get('io');
  if (io) {
    io.emit('workout:new', {
      workout: newWorkout,
      user: safeUser,
      bossRaid: db.raids[0],
      territories: db.territories
    });
    io.emit('leaderboard:update', {
      leaderboard: db.getLeaderboard('weekly')
    });
  }

  res.status(201).json({
    workout: newWorkout,
    user: safeUser,
    levelProgress: ScoringEngine.getLevelProgress(updatedUser.totalPoints)
  });
});

// Give / toggle kudos on a workout
router.post('/:id/kudos', authenticateToken, (req, res) => {
  const updatedWorkout = db.toggleKudos(req.params.id, req.user.id);
  if (!updatedWorkout) {
    return res.status(404).json({ error: 'Workout not found.' });
  }

  const io = req.app.get('io');
  if (io) {
    io.emit('workout:kudos', {
      workoutId: updatedWorkout.id,
      kudos: updatedWorkout.kudos,
      userId: req.user.id
    });
  }

  res.json({ workout: updatedWorkout });
});

// Add comment to a workout
router.post('/:id/comments', authenticateToken, (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Comment text cannot be empty.' });
  }

  const updatedWorkout = db.addComment(req.params.id, {
    userId: req.user.id,
    userName: req.user.name,
    text: text.trim()
  });

  if (!updatedWorkout) {
    return res.status(404).json({ error: 'Workout not found.' });
  }

  const io = req.app.get('io');
  if (io) {
    io.emit('workout:comment', {
      workoutId: updatedWorkout.id,
      comments: updatedWorkout.comments
    });
  }

  res.json({ workout: updatedWorkout });
});

export default router;
