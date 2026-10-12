import { CONFIG } from './config.js';

/**
 * ApexMetrics Unified Scoring Engine
 * Normalizes multi-discipline athletic physical activities into a standardized score.
 */
export class ScoringEngine {
  /**
   * Calculates points for a given workout log.
   * @param {Object} workout - The workout input payload
   * @param {string} userClass - Character class (e.g. 'Juggernaut', 'Apex Strider', etc.)
   * @param {Object} options - Optional bonus multipliers (e.g. bounty multiplier, streak multiplier)
   * @returns {Object} { rawPoints, finalPoints, breakdown, statGains }
   */
  static calculatePoints(workout, userClass = 'Vanguard', options = {}) {
    const { activityCategory, activityType, metrics } = workout;
    let basePoints = 0;
    let breakdown = {};
    let statGains = { strength: 0, endurance: 0, agility: 0, stamina: 0 };

    switch (activityCategory) {
      case 'cardio': {
        const distanceKm = parseFloat(metrics.distanceKm || 0);
        const durationMin = parseFloat(metrics.durationMinutes || 0);
        const type = (activityType || '').toLowerCase();
        const multiplier = CONFIG.MULTIPLIERS.CARDIO[type] || 10.0;
        
        basePoints = distanceKm * multiplier;
        breakdown = {
          type,
          distanceKm,
          pointsPerKm: multiplier,
          formula: `${distanceKm} km * ${multiplier} pts/km`
        };

        // Stat gains
        if (type === 'running') {
          statGains.endurance += distanceKm * 3.0;
          statGains.stamina += distanceKm * 1.5;
        } else if (type === 'swimming') {
          statGains.endurance += distanceKm * 6.0;
          statGains.stamina += distanceKm * 4.0;
          statGains.strength += distanceKm * 2.0;
        } else if (type === 'cycling') {
          statGains.endurance += distanceKm * 1.2;
          statGains.stamina += distanceKm * 1.0;
        }
        break;
      }

      case 'calisthenics': {
        const type = (activityType || '').toLowerCase();
        if (type === 'plank') {
          const seconds = parseFloat(metrics.durationSeconds || metrics.reps || 0);
          const multiplier = CONFIG.MULTIPLIERS.CALISTHENICS.plank;
          basePoints = seconds * multiplier;
          breakdown = {
            type,
            seconds,
            pointsPerSec: multiplier,
            formula: `${seconds}s * ${multiplier} pts/s`
          };
          statGains.stamina += seconds * 0.15;
          statGains.strength += seconds * 0.05;
        } else {
          const reps = parseInt(metrics.reps || 0, 10);
          const multiplier = CONFIG.MULTIPLIERS.CALISTHENICS[type] || 0.8;
          basePoints = reps * multiplier;
          breakdown = {
            type,
            reps,
            pointsPerRep: multiplier,
            formula: `${reps} reps * ${multiplier} pts/rep`
          };

          if (type.includes('pull_up') || type.includes('chin_up')) {
            statGains.strength += reps * 1.2;
            statGains.agility += reps * 0.6;
          } else if (type.includes('push_up')) {
            statGains.strength += reps * 0.4;
            statGains.agility += reps * 0.4;
          } else { // squat or lunge
            statGains.agility += reps * 0.3;
            statGains.stamina += reps * 0.3;
          }
        }
        break;
      }

      case 'strength': {
        const liftType = (metrics.liftType || 'compound').toLowerCase(); // 'compound' or 'isolation'
        const weightKg = parseFloat(metrics.weightKg || 0);
        const reps = parseInt(metrics.reps || 0, 10);
        const sets = parseInt(metrics.sets || 1, 10);
        const totalReps = reps * sets;
        const volume = weightKg * totalReps;
        
        const coefficient = liftType === 'isolation' 
          ? CONFIG.MULTIPLIERS.STRENGTH_COEFFICIENT.isolation 
          : CONFIG.MULTIPLIERS.STRENGTH_COEFFICIENT.compound;

        basePoints = volume * coefficient;
        breakdown = {
          exerciseName: workout.exerciseName || activityType,
          liftType,
          weightKg,
          sets,
          reps,
          totalReps,
          volumeKg: volume,
          coefficient,
          formula: `(${weightKg}kg * ${totalReps} total reps) * ${coefficient}`
        };

        statGains.strength += (volume * 0.0035);
        statGains.stamina += (volume * 0.001);
        break;
      }

      case 'sports': {
        const intensity = (metrics.intensity || 'high_intensity').toLowerCase();
        const durationMinutes = parseFloat(metrics.durationMinutes || 0);
        const multiplier = CONFIG.MULTIPLIERS.SPORTS[intensity] || 1.0;

        basePoints = durationMinutes * multiplier;
        breakdown = {
          sportName: workout.sportName || activityType,
          intensity,
          durationMinutes,
          pointsPerMin: multiplier,
          formula: `${durationMinutes} mins * ${multiplier} pts/min`
        };

        if (intensity === 'high_intensity') {
          statGains.agility += durationMinutes * 1.5;
          statGains.endurance += durationMinutes * 1.2;
          statGains.stamina += durationMinutes * 1.0;
        } else {
          statGains.stamina += durationMinutes * 0.6;
          statGains.agility += durationMinutes * 0.4;
        }
        break;
      }

      default:
        basePoints = 10;
        breakdown = { formula: 'Default baseline' };
    }

    // Apply RPG Character Class Affinity Multiplier
    let classBonusMultiplier = 1.0;
    const normalizedClass = (userClass || 'Vanguard').toLowerCase();

    if ((normalizedClass.includes('juggernaut') || normalizedClass.includes('paladin')) && workout.activityCategory === 'strength') {
      classBonusMultiplier = 1.10; // +10% bonus for Paladin / Juggernaut on strength
    } else if ((normalizedClass.includes('strider') || normalizedClass.includes('ranger')) && workout.activityType === 'running') {
      classBonusMultiplier = 1.10; // +10% bonus for Rangers on running
    } else if ((normalizedClass.includes('aquanaut') || normalizedClass.includes('tidecaller')) && workout.activityType === 'swimming') {
      classBonusMultiplier = 1.15; // +15% bonus for Aquanaut on swimming
    } else if ((normalizedClass.includes('shinobi') || normalizedClass.includes('sorcerer')) && workout.activityCategory === 'calisthenics') {
      classBonusMultiplier = 1.10; // +10% bonus for Calisthenics
    } else if (normalizedClass.includes('vanguard') || normalizedClass.includes('king')) {
      classBonusMultiplier = 1.05; // Balanced +5% across all disciplines
    }

    // Apply Quest/Bounty & Streak Multipliers
    const bountyMultiplier = parseFloat(options.bountyMultiplier || 1.0);
    const streakMultiplier = parseFloat(options.streakMultiplier || 1.0);

    const totalMultiplier = classBonusMultiplier * bountyMultiplier * streakMultiplier;
    const finalPoints = Math.round(basePoints * totalMultiplier * 10) / 10;

    // Round stat gains to 1 decimal
    for (const key of Object.keys(statGains)) {
      statGains[key] = Math.round(statGains[key] * 10) / 10;
    }

    return {
      rawPoints: Math.round(basePoints * 10) / 10,
      classBonusMultiplier,
      bountyMultiplier,
      streakMultiplier,
      totalMultiplier: Math.round(totalMultiplier * 100) / 100,
      finalPoints,
      breakdown,
      statGains
    };
  }

  /**
   * Calculate User Level from cumulative points
   */
  static getLevelProgress(totalPoints) {
    // Level formula: Level = floor(sqrt(totalPoints / 25)) + 1
    const level = Math.max(1, Math.floor(Math.sqrt(totalPoints / 25)) + 1);
    const pointsForCurrentLevel = Math.pow(level - 1, 2) * 25;
    const pointsForNextLevel = Math.pow(level, 2) * 25;
    const progressInLevel = totalPoints - pointsForCurrentLevel;
    const neededForLevel = pointsForNextLevel - pointsForCurrentLevel;
    const percent = Math.min(100, Math.max(0, Math.round((progressInLevel / neededForLevel) * 100)));

    return {
      level,
      totalPoints,
      pointsForCurrentLevel,
      pointsForNextLevel,
      currentLevelPoints: progressInLevel,
      pointsNeeded: pointsForNextLevel - totalPoints,
      progressPercent: percent
    };
  }
}
