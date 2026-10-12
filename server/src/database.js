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

    // Initial Kingdom Rush Hero Champions
    const initialUsers = [
      {
        id: 'u-1',
        username: 'SirGerald',
        name: 'Sir Gerald Lightseeker',
        title: 'Paladin of the Realm',
        quote: 'For honor and the King!',
        email: 'gerald@kingdomrush.realm',
        passwordHash,
        characterClass: 'Paladin Knight',
        campus: 'Royal Citadel Barracks',
        team: 'Royal Knights of Linirea',
        level: 16,
        totalPoints: 6450.0,
        weeklyPoints: 840.5,
        dailyPoints: 215.0,
        stats: { strength: 96, endurance: 82, agility: 70, stamina: 92 },
        badges: ['Crown Defender', 'Iron Bastion', 'Shield Master', 'Veznan Slayer'],
        avatar: '🛡️',
        portrait: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b675?w=150',
        streakDays: 21,
        stravaLinked: true
      },
      {
        id: 'u-2',
        username: 'AlleriaSwift',
        name: 'Alleria Swiftwind',
        title: 'Elven Ranger Huntress',
        quote: 'Bullseye! Swift as the wind.',
        email: 'alleria@kingdomrush.realm',
        passwordHash,
        characterClass: 'Apex Strider',
        campus: 'Whispering Woods',
        team: 'Emerald Sentinels',
        level: 14,
        totalPoints: 5120.5,
        weeklyPoints: 680.0,
        dailyPoints: 120.0,
        stats: { strength: 65, endurance: 98, agility: 95, stamina: 85 },
        badges: ['Windwalker', 'Deadeye Mark', 'Marathon Scout'],
        avatar: '🏹',
        streakDays: 14,
        stravaLinked: true
      },
      {
        id: 'u-3',
        username: 'MalikHammer',
        name: 'Malik Hammerfury',
        title: 'Dwarven Juggernaut',
        quote: 'Feel the hammer of justice!',
        email: 'malik@kingdomrush.realm',
        passwordHash,
        characterClass: 'Juggernaut',
        campus: 'Ironkeep Forge',
        team: 'Crimson Ironfist Clan',
        level: 15,
        totalPoints: 5980.0,
        weeklyPoints: 790.0,
        dailyPoints: 180.0,
        stats: { strength: 99, endurance: 58, agility: 55, stamina: 82 },
        badges: ['Titan Lifter', 'Iron Disciple', 'Anvil Breaker'],
        avatar: '🔨',
        streakDays: 18,
        stravaLinked: false
      },
      {
        id: 'u-4',
        username: 'MagnusMage',
        name: 'Magnus Spellbane',
        title: 'Arcane Sorcerer & Acrobat',
        quote: 'Arcane mysteries defy gravity!',
        email: 'magnus@kingdomrush.realm',
        passwordHash,
        characterClass: 'Shinobi',
        campus: 'Stormcloud Spire',
        team: 'Royal Knights of Linirea',
        level: 12,
        totalPoints: 4120.0,
        weeklyPoints: 540.0,
        dailyPoints: 150.0,
        stats: { strength: 72, endurance: 80, agility: 98, stamina: 78 },
        badges: ['Gravity Defier', 'Arcane Focus', 'Master of Reps'],
        avatar: '🔮',
        streakDays: 10,
        stravaLinked: false
      },
      {
        id: 'u-5',
        username: 'CathaTriton',
        name: 'Catha Tidecaller',
        title: 'Guardian of the Sunken Abyss',
        quote: 'The tides bend to my will!',
        email: 'catha@kingdomrush.realm',
        passwordHash,
        characterClass: 'Aquanaut',
        campus: 'Sunken Lagoon',
        team: 'Emerald Sentinels',
        level: 13,
        totalPoints: 4620.0,
        weeklyPoints: 610.0,
        dailyPoints: 110.0,
        stats: { strength: 74, endurance: 95, agility: 80, stamina: 99 },
        badges: ['Waterlogged', 'Abyssal Diver', 'Tidecaller'],
        avatar: '🔱',
        streakDays: 9,
        stravaLinked: true
      },
      {
        id: 'u-6',
        username: 'KingDenas',
        name: 'King Denas',
        title: 'Ruler of Linirea',
        quote: 'For the Kingdom of Linirea!',
        email: 'denas@kingdomrush.realm',
        passwordHash,
        characterClass: 'Vanguard',
        campus: 'Royal Tournament Grounds',
        team: 'Royal Knights of Linirea',
        level: 17,
        totalPoints: 7200.0,
        weeklyPoints: 920.0,
        dailyPoints: 230.0,
        stats: { strength: 88, endurance: 88, agility: 86, stamina: 90 },
        badges: ['High Sovereign', 'Crown Champion', 'Century Club'],
        avatar: '👑',
        streakDays: 25,
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

    // Group Boss Raids (Kingdom Rush Epic World Boss)
    this.raids = [
      {
        id: 'raid-1',
        title: 'Siege of the Dark Tower',
        bossName: "Vez'nan the Dark Wizard",
        bossTitle: "Master of the Nether Nether Golem",
        bossQuote: "You cannot stop the inevitable, mortal fools!",
        description: "The dark wizard Vez'nan has summoned his massive Nether Golem to raze Linirea! Unite all athletic champions—warriors, rangers, and dwarfs—to deal damage with every workout log!",
        totalHp: 40000,
        currentHp: 24500,
        endTime: new Date(Date.now() + 86400000 * 3).toISOString(),
        rewardBadge: "Vez'nan's Nemesis",
        rewardXp: 1200,
        rewardStars: 3,
        topDamagers: [
          { userId: 'u-1', userName: 'Sir Gerald Lightseeker', damage: 4500 },
          { userId: 'u-3', userName: 'Malik Hammerfury', damage: 4100 },
          { userId: 'u-2', userName: 'Alleria Swiftwind', damage: 3200 },
          { userId: 'u-4', userName: 'Magnus Spellbane', damage: 2400 }
        ]
      }
    ];

    // Turf Wars / Kingdom of Linirea Campaign Sectors
    this.territories = [
      {
        id: 'zone-1',
        name: 'The Ironkeep Forge & Barracks',
        controllingTeam: 'Crimson Ironfist Clan',
        controlPercent: 72,
        dominancePoints: 4800,
        activeBonus: '+5% Points on Heavy Strength Lifts',
        topGuardian: 'Malik Hammerfury',
        icon: '⚔️',
        stars: 3,
        coordinates: { x: 30, y: 35 }
      },
      {
        id: 'zone-2',
        name: 'Whispering Woods Ranger Glade',
        controllingTeam: 'Emerald Sentinels',
        controlPercent: 78,
        dominancePoints: 4150,
        activeBonus: '+5% Points on Running & Sprint Cardio',
        topGuardian: 'Alleria Swiftwind',
        icon: '🏹',
        stars: 3,
        coordinates: { x: 72, y: 25 }
      },
      {
        id: 'zone-3',
        name: 'Sunken Merfolk Lagoon',
        controllingTeam: 'Emerald Sentinels',
        controlPercent: 85,
        dominancePoints: 3400,
        activeBonus: '+5% Points on Swimming Endurance',
        topGuardian: 'Catha Tidecaller',
        icon: '🌊',
        stars: 3,
        coordinates: { x: 18, y: 75 }
      },
      {
        id: 'zone-4',
        name: 'Stormcloud Peak Mountain Bastion',
        controllingTeam: 'Royal Knights of Linirea',
        controlPercent: 64,
        dominancePoints: 2900,
        activeBonus: '+5% Points on Bodyweight Calisthenics',
        topGuardian: 'Magnus Spellbane',
        icon: '⚡',
        stars: 3,
        coordinates: { x: 82, y: 65 }
      },
      {
        id: 'zone-5',
        name: "King Denas's Royal Tournament Field",
        controllingTeam: 'Royal Knights of Linirea',
        controlPercent: 80,
        dominancePoints: 5200,
        activeBonus: '+5% Points on Combat Sports & HIIT',
        topGuardian: 'King Denas',
        icon: '👑',
        stars: 3,
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
