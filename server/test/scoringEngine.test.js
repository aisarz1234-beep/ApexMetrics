import test from 'node:test';
import assert from 'node:assert/strict';
import { ScoringEngine } from '../src/scoringEngine.js';

test('ScoringEngine: Cardio Point Normalization', () => {
  // Swimming: 30 pts/km (with default Vanguard 5% bonus = 30 * 1.05 = 31.5)
  const swim = ScoringEngine.calculatePoints({
    activityCategory: 'cardio',
    activityType: 'swimming',
    metrics: { distanceKm: 2.0, durationMinutes: 40 }
  }, 'Vanguard');
  assert.equal(swim.rawPoints, 60.0);
  assert.equal(swim.finalPoints, 63.0);

  // Swimming with Aquanaut (+15% class affinity bonus = 60 * 1.15 = 69.0)
  const swimAquanaut = ScoringEngine.calculatePoints({
    activityCategory: 'cardio',
    activityType: 'swimming',
    metrics: { distanceKm: 2.0, durationMinutes: 40 }
  }, 'Aquanaut');
  assert.equal(swimAquanaut.finalPoints, 69.0);

  // Running: 10 pts/km with Strider (+10% bonus = 50 * 1.10 = 55.0)
  const run = ScoringEngine.calculatePoints({
    activityCategory: 'cardio',
    activityType: 'running',
    metrics: { distanceKm: 5.0, durationMinutes: 25 }
  }, 'Apex Strider');
  assert.equal(run.rawPoints, 50.0);
  assert.equal(run.finalPoints, 55.0);

  // Cycling: 3 pts/km (20km * 3 = 60 pts)
  const cycle = ScoringEngine.calculatePoints({
    activityCategory: 'cardio',
    activityType: 'cycling',
    metrics: { distanceKm: 20.0, durationMinutes: 45 }
  }, 'None');
  assert.equal(cycle.rawPoints, 60.0);
  assert.equal(cycle.finalPoints, 60.0);
});

test('ScoringEngine: Rep-Based Calisthenics Normalization', () => {
  // Pull-up: 3.0 pts/rep (25 reps * 3.0 = 75 pts)
  const pullUps = ScoringEngine.calculatePoints({
    activityCategory: 'calisthenics',
    activityType: 'pull_up',
    metrics: { reps: 25 }
  }, 'None');
  assert.equal(pullUps.rawPoints, 75.0);
  assert.equal(pullUps.finalPoints, 75.0);

  // Push-up: 0.8 pts/rep (50 reps * 0.8 = 40 pts)
  const pushUps = ScoringEngine.calculatePoints({
    activityCategory: 'calisthenics',
    activityType: 'push_up',
    metrics: { reps: 50 }
  }, 'None');
  assert.equal(pushUps.rawPoints, 40.0);
  assert.equal(pushUps.finalPoints, 40.0);

  // Squats: 0.5 pts/rep (60 reps * 0.5 = 30 pts)
  const squats = ScoringEngine.calculatePoints({
    activityCategory: 'calisthenics',
    activityType: 'squat',
    metrics: { reps: 60 }
  }, 'None');
  assert.equal(squats.rawPoints, 30.0);
  assert.equal(squats.finalPoints, 30.0);

  // Plank: 0.2 pts/second (90 seconds * 0.2 = 18 pts)
  const plank = ScoringEngine.calculatePoints({
    activityCategory: 'calisthenics',
    activityType: 'plank',
    metrics: { durationSeconds: 90 }
  }, 'None');
  assert.equal(plank.rawPoints, 18.0);
  assert.equal(plank.finalPoints, 18.0);
});

test('ScoringEngine: Volume-Based Strength Training Normalization', () => {
  // Compound Lifts: (Weight * Reps * Sets) * 0.05
  // Bench press: 100 kg * (5 reps * 5 sets = 25 reps) = 2500 kg volume * 0.05 = 125 pts
  const bench = ScoringEngine.calculatePoints({
    activityCategory: 'strength',
    activityType: 'compound',
    metrics: { weightKg: 100, reps: 5, sets: 5, liftType: 'compound' }
  }, 'None');
  assert.equal(bench.rawPoints, 125.0);
  assert.equal(bench.finalPoints, 125.0);

  // Juggernaut Class Affinity Bonus (+10% on compound strength = 125 * 1.10 = 137.5)
  const benchJuggernaut = ScoringEngine.calculatePoints({
    activityCategory: 'strength',
    activityType: 'compound',
    metrics: { weightKg: 100, reps: 5, sets: 5, liftType: 'compound' }
  }, 'Juggernaut');
  assert.equal(benchJuggernaut.finalPoints, 137.5);

  // Isolation Lifts: (Weight * Reps) * 0.02
  // Bicep curls: 20 kg * (10 reps * 3 sets = 30 reps) = 600 kg volume * 0.02 = 12 pts
  const curls = ScoringEngine.calculatePoints({
    activityCategory: 'strength',
    activityType: 'isolation',
    metrics: { weightKg: 20, reps: 10, sets: 3, liftType: 'isolation' }
  }, 'None');
  assert.equal(curls.rawPoints, 12.0);
  assert.equal(curls.finalPoints, 12.0);
});

test('ScoringEngine: Time-Based Sports & HIIT Normalization', () => {
  // High-intensity (HIIT, sparring): 2.0 pts/min (30 mins * 2 = 60 pts)
  const hiit = ScoringEngine.calculatePoints({
    activityCategory: 'sports',
    activityType: 'high_intensity',
    metrics: { durationMinutes: 30, intensity: 'high_intensity' }
  }, 'None');
  assert.equal(hiit.rawPoints, 60.0);
  assert.equal(hiit.finalPoints, 60.0);

  // Moderate-intensity (yoga, stretching): 1.0 pt/min (45 mins * 1 = 45 pts)
  const yoga = ScoringEngine.calculatePoints({
    activityCategory: 'sports',
    activityType: 'moderate_intensity',
    metrics: { durationMinutes: 45, intensity: 'moderate_intensity' }
  }, 'None');
  assert.equal(yoga.rawPoints, 45.0);
  assert.equal(yoga.finalPoints, 45.0);
});

test('ScoringEngine: Level Progression Math', () => {
  // Level 1 at 0 points
  const lvl1 = ScoringEngine.getLevelProgress(0);
  assert.equal(lvl1.level, 1);
  assert.equal(lvl1.pointsForCurrentLevel, 0);
  assert.equal(lvl1.pointsForNextLevel, 25);

  // Level 2 at 25 points
  const lvl2 = ScoringEngine.getLevelProgress(25);
  assert.equal(lvl2.level, 2);

  // Level 10 at 2025 points
  const lvl10 = ScoringEngine.getLevelProgress(2025);
  assert.equal(lvl10.level, 10);
});
