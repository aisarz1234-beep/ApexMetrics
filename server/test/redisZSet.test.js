import test from 'node:test';
import assert from 'node:assert/strict';
import { RedisZSet } from '../src/database.js';

test('RedisZSet: Sorted Set Operations for Real-Time Leaderboards', () => {
  const zset = new RedisZSet();

  zset.zadd('athlete-A', 500);
  zset.zadd('athlete-B', 850);
  zset.zadd('athlete-C', 620);
  zset.zadd('athlete-D', 910);

  // Score retrieval
  assert.equal(zset.zscore('athlete-B'), 850);
  assert.equal(zset.zscore('athlete-unknown'), 0);

  // Reverse range ranking: Highest score first
  const topAthletes = zset.zrevrange(0, -1);
  assert.deepEqual(topAthletes, ['athlete-D', 'athlete-B', 'athlete-C', 'athlete-A']);

  // Top 2 with scores
  const top2WithScores = zset.zrevrange(0, 1, true);
  assert.equal(top2WithScores[0][0], 'athlete-D');
  assert.equal(top2WithScores[0][1], 910);
  assert.equal(top2WithScores[1][0], 'athlete-B');
  assert.equal(top2WithScores[1][1], 850);

  // Reverse rank (0-indexed)
  assert.equal(zset.zrevrank('athlete-D'), 0); // Rank 1 (#1)
  assert.equal(zset.zrevrank('athlete-B'), 1); // Rank 2 (#2)
  assert.equal(zset.zrevrank('athlete-A'), 3); // Rank 4 (#4)

  // Updating score moves athlete up
  zset.zadd('athlete-A', 1200);
  assert.equal(zset.zrevrank('athlete-A'), 0); // Now #1
});
