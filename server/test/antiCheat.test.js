import test from 'node:test';
import assert from 'node:assert/strict';
import { AntiCheatEngine } from '../src/antiCheatEngine.js';

test('AntiCheatEngine: Heuristic Validation', () => {
  // 1. Normal reasonable running log
  const validRun = AntiCheatEngine.validateHeuristics({
    activityCategory: 'cardio',
    activityType: 'running',
    metrics: { distanceKm: 5.0, durationMinutes: 25 } // 5:00 min/km pace
  });
  assert.equal(validRun.isValid, true);
  assert.equal(validRun.verificationStatus, 'self_reported');
  assert.equal(validRun.flags.length, 0);

  // 2. Superhuman pace (< 2.2 min/km) -> Flagged
  const impossibleRun = AntiCheatEngine.validateHeuristics({
    activityCategory: 'cardio',
    activityType: 'running',
    metrics: { distanceKm: 10.0, durationMinutes: 15 } // 1.5 min/km (impossible)
  });
  assert.equal(impossibleRun.isValid, false);
  assert.equal(impossibleRun.verificationStatus, 'flagged_review');
  assert.ok(impossibleRun.flags.some(f => f.type === 'SUPERHUMAN_PACE'));

  // 3. Excessive pull-ups (> 150 reps in continuous session) -> Flagged
  const extremePullUps = AntiCheatEngine.validateHeuristics({
    activityCategory: 'calisthenics',
    activityType: 'pull_up',
    metrics: { reps: 300 }
  });
  assert.equal(extremePullUps.isValid, false);
  assert.ok(extremePullUps.flags.some(f => f.type === 'EXCESSIVE_REPS'));

  // 4. Powerlifting world-record ceiling breach (> 505 kg single rep) -> Flagged
  const extremeBench = AntiCheatEngine.validateHeuristics({
    activityCategory: 'strength',
    activityType: 'Bench Press',
    metrics: { weightKg: 650, reps: 5, sets: 1 }
  });
  assert.equal(extremeBench.isValid, false);
  assert.ok(extremeBench.flags.some(f => f.type === 'WORLD_RECORD_WEIGHT'));
});

test('AntiCheatEngine: GPX Track Parsing and Haversine Verification', () => {
  // Coordinates spanning ~4.45 km in 20 minutes (~4.5 min/km pace - realistic verified run)
  const sampleGpx = `<?xml version="1.0"?>
  <gpx version="1.1">
    <trk><trkseg>
      <trkpt lat="37.7700" lon="-122.4100"><time>2026-10-12T06:00:00Z</time><hr>140</hr></trkpt>
      <trkpt lat="37.7800" lon="-122.4100"><time>2026-10-12T06:05:00Z</time><hr>148</hr></trkpt>
      <trkpt lat="37.7900" lon="-122.4100"><time>2026-10-12T06:10:00Z</time><hr>152</hr></trkpt>
      <trkpt lat="37.8000" lon="-122.4100"><time>2026-10-12T06:15:00Z</time><hr>155</hr></trkpt>
      <trkpt lat="37.8100" lon="-122.4100"><time>2026-10-12T06:20:00Z</time><hr>158</hr></trkpt>
    </trkseg></trk>
  </gpx>`;

  const gpxResult = AntiCheatEngine.parseAndVerifyGpx(sampleGpx);
  assert.equal(gpxResult.verified, true);
  assert.ok(gpxResult.distanceKm > 4.0);
  assert.equal(gpxResult.verificationBadge, 'Verified GPS (Smartwatch)');
  assert.equal(gpxResult.trustScore, 99);
  assert.ok(gpxResult.avgHeartRate > 100);
});
