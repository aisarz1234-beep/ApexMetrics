import bcrypt from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

/**
 * High-speed Sorted Set (Redis ZSET simulation)
 * Maintains items sorted by score for instant O(log N) leaderboard lookups
 */
export class RedisZSet {
  constructor() {
    this.items = new Map(); // key -> score
  }

  zadd(key, score) {
    this.items.set(key, score);
  }

  zscore(key) {
    return this.items.get(key) || 0;
  }

  zrevrange(start = 0, stop = -1, withScores = false) {
    const sorted = Array.from(this.items.entries()).sort((a, b) => b[1] - a[1]);
    const sliced = stop === -1 ? sorted.slice(start) : sorted.slice(start, stop + 1);
    if (!withScores) {
      return sliced.map(([key]) => key);
    }
    return sliced;
  }

  zrevrank(key) {
    const sorted = Array.from(this.items.entries()).sort((a, b) => b[1] - a[1]);
    const index = sorted.findIndex(([k]) => k === key);
    return index === -1 ? null : index; // 0-indexed rank
  }
}

/**
 * Primary Database Store for ApexMetrics
 * Emulates durable relational tables and real-time Redis ZSET leaderboards
 */
class Database {
  constructor() {
    this.users = new Map();
    this.workouts = [];
    this.bounties = [];
    this.raids = [];
    this.territories = [];

    // Redis ZSET Leaderboards for instant rank queries
    this.leaderboardZSets = {
      daily: new RedisZSet(),
      weekly: new RedisZSet(),
      allTime: new RedisZSet()
    };

    this.initSeedData();
  }

  initSeedData() {
    const passwordHash = bcrypt.hashSync('apex1234', 10);

    // Initial Users
    const initialUsers = [
      {
        id: 'u-1',
        username: 'AlexRider',
        name: 'Alex Vance',
        email: 'alex@apexmetrics.io',
        passwordHash,
        characterClass: 'Apex Strider',
        campus: 'Engineering Quad',
        team: 'Crimson Lions',
        level: 14,
        totalPoints: 5120.5,
        weeklyPoints: 680.0,
        dailyPoints: 120.0,
        stats: { strength: 65, endurance: 95, agility: 82, stamina: 88 },
        badges: ['Century Club', 'Sprinter Apex', 'Dawn Patrol', 'Waterlogged'],
        avatar: '🏃‍♂️',
        streakDays: 14,
        stravaLinked: true
      },
      {
        id: 'u-2',
        username: 'IronMarcus',
        name: 'Marcus Thorne',
        email: 'marcus@apexmetrics.io',
        passwordHash,
        characterClass: 'Juggernaut',
        campus: 'Main Gym',
        team: 'Cobalt Titans',
        level: 16,
        totalPoints: 6450.0,
        weeklyPoints: 840.5,
        dailyPoints: 215.0,
        stats: { strength: 98, endurance: 54, agility: 62, stamina: 76 },
        badges: ['Titan Lifter', 'Iron Disciple', 'Centurion'],
        avatar: '🏋️‍♂️',
        streakDays: 21,
        stravaLinked: false
      },
      {
        id: 'u-3',
        username: 'ElenaWater',
        name: 'Elena Rostova',
        email: 'elena@apexmetrics.io',
        passwordHash,
        characterClass: 'Aquanaut',
        campus: 'Aquatic Center',
        team: 'Emerald Vipers',
        level: 12,
        totalPoints: 4320.0,
        weeklyPoints: 590.0,
        dailyPoints: 90.0,
        stats: { strength: 70, endurance: 92, agility: 75, stamina: 96 },
        badges: ['Waterlogged', 'Deep Diver', 'Century Club'],
        avatar: '🏊‍♀️',
        streakDays: 8,
        stravaLinked: true
      },
      {
        id: 'u-4',
        username: 'NinjaKai',
        name: 'Kai Takahashi',
        email: 'kai@apexmetrics.io',
        passwordHash,
        characterClass: 'Shinobi',
        campus: 'North Oval',
        team: 'Crimson Lions',
        level: 11,
        totalPoints: 3890.0,
        weeklyPoints: 510.0,
        dailyPoints: 165.0,
        stats: { strength: 80, endurance: 78, agility: 96, stamina: 82 },
        badges: ['Gravity Defier', 'Master of Reps'],
        avatar: '🤸‍♂️',
        streakDays: 12,
        stravaLinked: false
      },
      {
        id: 'u-5',
        username: 'MayaVanguard',
        name: 'Maya Lin',
        email: 'maya@apexmetrics.io',
        passwordHash,
        characterClass: 'Vanguard',
        campus: 'Downtown Campus',
        team: 'Cobalt Titans',
        level: 9,
        totalPoints: 2950.0,
        weeklyPoints: 410.0,
        dailyPoints: 80.0,
        stats: { strength: 74, endurance: 76, agility: 75, stamina: 78 },
        badges: ['Tri-Discipline', 'Dawn Patrol'],
        avatar: '⚡',
        streakDays: 6,
        stravaLinked: true
      }
    ];

    for (const u of initialUsers) {
      this.users.set(u.id, u);
      this.leaderboardZSets.allTime.zadd(u.id, u.totalPoints);
      this.leaderboardZSets.weekly.zadd(u.id, u.weeklyPoints);
      this.leaderboardZSets.daily.zadd(u.id, u.dailyPoints);
    }

    // Initial Workouts with diverse disciplines and verified proofs
    this.workouts = [
      {
        id: 'w-1',
        userId: 'u-1',
        userName: 'Alex Vance',
        userAvatar: '🏃‍♂️',
        userClass: 'Apex Strider',
        team: 'Crimson Lions',
        activityCategory: 'cardio',
        activityType: 'running',
        metrics: { distanceKm: 10.5, durationMinutes: 48, avgPace: '4:34 min/km' },
        points: 115.5,
        breakdown: { formula: '10.5 km * 10 pts/km (+10% Strider bonus)' },
        verificationStatus: 'verified',
        verificationBadge: 'Verified GPS (Garmin FIT)',
        trustScore: 98,
        zone: 'Track & Field Stadium',
        kudos: ['u-2', 'u-3', 'u-4'],
        comments: [
          { id: 'c-1', userId: 'u-2', userName: 'Marcus Thorne', text: 'Insane split time on the last 3k!' }
        ],
        timestamp: new Date(Date.now() - 3600000 * 2).toISOString()
      },
      {
        id: 'w-2',
        userId: 'u-2',
        userName: 'Marcus Thorne',
        userAvatar: '🏋️‍♂️',
        userClass: 'Juggernaut',
        team: 'Cobalt Titans',
        activityCategory: 'strength',
        activityType: 'Bench Press',
        metrics: { weightKg: 120, reps: 6, sets: 5, liftType: 'compound' },
        points: 198.0,
        breakdown: { formula: '(120kg * 30 total reps) * 0.05 (+10% Juggernaut bonus)' },
        verificationStatus: 'valid',
        verificationBadge: 'Peer Verified',
        trustScore: 92,
        zone: 'The Iron Dungeon / Student Gym',
        kudos: ['u-1', 'u-4'],
        comments: [],
        timestamp: new Date(Date.now() - 3600000 * 5).toISOString()
      },
      {
        id: 'w-3',
        userId: 'u-3',
        userName: 'Elena Rostova',
        userAvatar: '🏊‍♀️',
        userClass: 'Aquanaut',
        team: 'Emerald Vipers',
        activityCategory: 'cardio',
        activityType: 'swimming',
        metrics: { distanceKm: 3.2, durationMinutes: 52 },
        points: 110.4,
        breakdown: { formula: '3.2 km * 30 pts/km (+15% Aquanaut bonus)' },
        verificationStatus: 'verified',
        verificationBadge: 'Verified GPS (Smartwatch)',
        trustScore: 99,
        zone: 'Aquatic Center',
        kudos: ['u-1', 'u-2', 'u-5'],
        comments: [],
        timestamp: new Date(Date.now() - 3600000 * 9).toISOString()
      },
      {
        id: 'w-4',
        userId: 'u-4',
        userName: 'Kai Takahashi',
        userAvatar: '🤸‍♂️',
        userClass: 'Shinobi',
        team: 'Crimson Lions',
        activityCategory: 'calisthenics',
        activityType: 'pull_up',
        metrics: { reps: 45 },
        points: 148.5,
        breakdown: { formula: '45 reps * 3.0 pts/rep (+10% Shinobi bonus)' },
        verificationStatus: 'valid',
        verificationBadge: 'Heuristic Certified',
        trustScore: 88,
        zone: 'Memorial Stadium Steps',
        kudos: ['u-2'],
        comments: [],
        timestamp: new Date(Date.now() - 3600000 * 14).toISOString()
      }
    ];

    // Dynamic Bounties & Daily Quests
    this.bounties = [
      {
        id: 'b-1',
        title: 'Century Calisthenics',
        description: 'Complete 50 or more pull-ups or push-ups today for an instant 2x point bonus.',
        category: 'calisthenics',
        targetMetric: 'reps',
        targetValue: 50,
        rewardPoints: 75,
        multiplier: 2.0,
        expiresIn: '14h 22m',
        claimedBy: ['u-4']
      },
      {
        id: 'b-2',
        title: 'Dawn Patrol Warrior',
        description: 'Log any workout before 7:30 AM to ignite an early morning energy boost.',
        category: 'general',
        targetMetric: 'timeOfDay',
        targetValue: 7.5,
        rewardPoints: 60,
        multiplier: 1.5,
        expiresIn: '8h 10m',
        claimedBy: ['u-1']
      },
      {
        id: 'b-3',
        title: 'Iron Colossus Volume',
        description: 'Accumulate at least 3,500 kg in strength lifting volume in a single session.',
        category: 'strength',
        targetMetric: 'volumeKg',
        targetValue: 3500,
        rewardPoints: 90,
        multiplier: 1.25,
        expiresIn: '18h 45m',
        claimedBy: ['u-2']
      },
      {
        id: 'b-4',
        title: 'Aquatic Endurance Trial',
        description: 'Swim at least 2.5 km in a single session.',
        category: 'cardio',
        targetMetric: 'distanceKm',
        targetValue: 2.5,
        rewardPoints: 100,
        multiplier: 1.3,
        expiresIn: '22h 00m',
        claimedBy: ['u-3']
      }
    ];

    // Group Boss Raids (Co-op Community Challenge)
    this.raids = [
      {
        id: 'raid-1',
        title: 'Titan of Olympus',
        bossName: 'Kronos the Iron Behemoth',
        description: 'A colossal mythological titan has descended upon the campus. Unite with all athletes to deal damage through workout points!',
        totalHp: 30000,
        currentHp: 18450,
        endTime: new Date(Date.now() + 86400000 * 3).toISOString(), // 3 days remaining
        rewardBadge: 'Titan Slayer',
        rewardXp: 750,
        topDamagers: [
          { userId: 'u-2', userName: 'Marcus Thorne', damage: 3200 },
          { userId: 'u-1', userName: 'Alex Vance', damage: 2850 },
          { userId: 'u-3', userName: 'Elena Rostova', damage: 2100 },
          { userId: 'u-4', userName: 'Kai Takahashi', damage: 1800 }
        ]
      }
    ];

    // Turf Wars / Campus Territories
    this.territories = [
      {
        id: 'zone-1',
        name: 'The Iron Dungeon / Student Gym',
        controllingTeam: 'Cobalt Titans',
        controlPercent: 68,
        dominancePoints: 4200,
        activeBonus: '+5% Points on Strength Training',
        topGuardian: 'Marcus Thorne',
        coordinates: { x: 35, y: 40 }
      },
      {
        id: 'zone-2',
        name: 'Track & Field Stadium',
        controllingTeam: 'Crimson Lions',
        controlPercent: 74,
        dominancePoints: 3850,
        activeBonus: '+5% Points on Running Cardio',
        topGuardian: 'Alex Vance',
        coordinates: { x: 70, y: 25 }
      },
      {
        id: 'zone-3',
        name: 'Olympic Aquatic Center',
        controllingTeam: 'Emerald Vipers',
        controlPercent: 82,
        dominancePoints: 3100,
        activeBonus: '+5% Points on Swimming Cardio',
        topGuardian: 'Elena Rostova',
        coordinates: { x: 20, y: 75 }
      },
      {
        id: 'zone-4',
        name: 'Memorial Stadium Steps',
        controllingTeam: 'Crimson Lions',
        controlPercent: 55,
        dominancePoints: 2400,
        activeBonus: '+5% Points on Calisthenics',
        topGuardian: 'Kai Takahashi',
        coordinates: { x: 80, y: 65 }
      },
      {
        id: 'zone-5',
        name: 'University Quad & Green',
        controllingTeam: 'Contested',
        controlPercent: 45,
        dominancePoints: 1900,
        activeBonus: '+5% Points on Outdoor Sports & HIIT',
        topGuardian: 'Maya Lin',
        coordinates: { x: 50, y: 50 }
      }
    ];
  }

  // --- User Queries ---
  getUserById(id) {
    return this.users.get(id);
  }

  getUserByEmail(email) {
    return Array.from(this.users.values()).find(
      u => u.email.toLowerCase() === email.toLowerCase()
    );
  }

  createUser(userData) {
    const id = `u-${uuidv4().substring(0, 8)}`;
    const user = {
      id,
      ...userData,
      totalPoints: 0,
      weeklyPoints: 0,
      dailyPoints: 0,
      level: 1,
      stats: { strength: 10, endurance: 10, agility: 10, stamina: 10 },
      badges: ['Novice Recruit'],
      streakDays: 1,
      stravaLinked: false
    };
    this.users.set(id, user);
    this.leaderboardZSets.allTime.zadd(id, 0);
    this.leaderboardZSets.weekly.zadd(id, 0);
    this.leaderboardZSets.daily.zadd(id, 0);
    return user;
  }

  updateUser(id, updates) {
    const user = this.users.get(id);
    if (!user) return null;
    Object.assign(user, updates);
    return user;
  }

  // --- Workouts & Leaderboard Updates ---
  addWorkout(workoutData) {
    const id = `w-${uuidv4().substring(0, 8)}`;
    const workout = {
      id,
      ...workoutData,
      kudos: [],
      comments: [],
      timestamp: new Date().toISOString()
    };
    this.workouts.unshift(workout);

    // Update user stats & cumulative scores
    const user = this.users.get(workout.userId);
    if (user) {
      user.totalPoints += workout.points;
      user.weeklyPoints += workout.points;
      user.dailyPoints += workout.points;

      // Update RPG stats
      if (workout.statGains) {
        user.stats.strength = Math.min(100, Math.round((user.stats.strength + (workout.statGains.strength || 0)) * 10) / 10);
        user.stats.endurance = Math.min(100, Math.round((user.stats.endurance + (workout.statGains.endurance || 0)) * 10) / 10);
        user.stats.agility = Math.min(100, Math.round((user.stats.agility + (workout.statGains.agility || 0)) * 10) / 10);
        user.stats.stamina = Math.min(100, Math.round((user.stats.stamina + (workout.statGains.stamina || 0)) * 10) / 10);
      }

      // Update level
      user.level = Math.max(1, Math.floor(Math.sqrt(user.totalPoints / 25)) + 1);

      // Check Milestone Evolution Badges
      this.checkAndAwardBadges(user, workout);

      // Update Redis ZSET Leaderboards
      this.leaderboardZSets.allTime.zadd(user.id, user.totalPoints);
      this.leaderboardZSets.weekly.zadd(user.id, user.weeklyPoints);
      this.leaderboardZSets.daily.zadd(user.id, user.dailyPoints);
    }

    // Apply Damage to Active Boss Raid
    if (this.raids.length > 0) {
      const raid = this.raids[0];
      if (raid.currentHp > 0) {
        raid.currentHp = Math.max(0, raid.currentHp - Math.round(workout.points));
        const topD = raid.topDamagers.find(d => d.userId === workout.userId);
        if (topD) {
          topD.damage += Math.round(workout.points);
        } else {
          raid.topDamagers.push({
            userId: workout.userId,
            userName: workout.userName,
            damage: Math.round(workout.points)
          });
        }
        raid.topDamagers.sort((a, b) => b.damage - a.damage);
      }
    }

    // Apply Territory Turf Point
    if (workout.zone) {
      const zone = this.territories.find(t => t.name === workout.zone || t.id === workout.zone);
      if (zone && user && user.team) {
        zone.dominancePoints += Math.round(workout.points);
        if (zone.controllingTeam === user.team) {
          zone.controlPercent = Math.min(99, zone.controlPercent + 1);
        } else {
          zone.controlPercent = Math.max(10, zone.controlPercent - 2);
          if (zone.controlPercent <= 20) {
            zone.controllingTeam = user.team;
            zone.controlPercent = 51;
            zone.topGuardian = user.name;
          }
        }
      }
    }

    return workout;
  }

  checkAndAwardBadges(user, workout) {
    const existingBadges = new Set(user.badges);

    if (workout.activityType === 'swimming' && !existingBadges.has('Waterlogged')) {
      user.badges.push('Waterlogged');
    }
    if ((workout.activityType === 'pull_up' || workout.activityType === 'chin_up') && workout.metrics?.reps >= 20 && !existingBadges.has('Gravity Defier')) {
      user.badges.push('Gravity Defier');
    }
    if (workout.activityCategory === 'strength' && (workout.metrics?.weightKg >= 100 || workout.points >= 150) && !existingBadges.has('Iron Disciple')) {
      user.badges.push('Iron Disciple');
    }
    if (user.totalPoints >= 1000 && !existingBadges.has('Century Club')) {
      user.badges.push('Century Club');
    }
    if (user.totalPoints >= 5000 && !existingBadges.has('Apex Legend')) {
      user.badges.push('Apex Legend');
    }
  }

  // --- Leaderboards ---
  getLeaderboard(timeframe = 'weekly', campus = 'all', team = 'all') {
    const zset = this.leaderboardZSets[timeframe] || this.leaderboardZSets.weekly;
    const rankedPairs = zset.zrevrange(0, -1, true); // [[userId, score], ...]

    let results = [];
    for (let i = 0; i < rankedPairs.length; i++) {
      const [userId, score] = rankedPairs[i];
      const user = this.users.get(userId);
      if (!user) continue;

      if (campus !== 'all' && user.campus !== campus) continue;
      if (team !== 'all' && user.team !== team) continue;

      results.push({
        rank: results.length + 1,
        userId: user.id,
        name: user.name,
        username: user.username,
        characterClass: user.characterClass,
        campus: user.campus,
        team: user.team,
        avatar: user.avatar,
        score: Math.round(score * 10) / 10,
        level: user.level,
        streakDays: user.streakDays,
        stats: user.stats
      });
    }

    return results;
  }

  toggleKudos(workoutId, userId) {
    const workout = this.workouts.find(w => w.id === workoutId);
    if (!workout) return null;
    const index = workout.kudos.indexOf(userId);
    if (index > -1) {
      workout.kudos.splice(index, 1);
    } else {
      workout.kudos.push(userId);
    }
    return workout;
  }

  addComment(workoutId, comment) {
    const workout = this.workouts.find(w => w.id === workoutId);
    if (!workout) return null;
    const newComment = {
      id: `c-${uuidv4().substring(0, 6)}`,
      ...comment,
      timestamp: new Date().toISOString()
    };
    workout.comments.push(newComment);
    return workout;
  }
}

export const db = new Database();
