/**
 * Client-Side Point Formula Engine for real-time live preview
 */
export const MULTIPLIERS = {
  CARDIO: {
    swimming: 30.0,
    running: 10.0,
    cycling: 3.0
  },
  CALISTHENICS: {
    pull_up: 3.0,
    chin_up: 3.0,
    push_up: 0.8,
    squat: 0.5,
    lunge: 0.5,
    plank: 0.2
  },
  STRENGTH_COEFFICIENT: {
    compound: 0.05,
    isolation: 0.02
  },
  SPORTS: {
    high_intensity: 2.0,
    moderate_intensity: 1.0
  }
};

export function calculateLivePoints(category, type, metrics, userClass = 'Vanguard') {
  let basePoints = 0;
  let breakdownFormula = '';

  switch (category) {
    case 'cardio': {
      const km = parseFloat(metrics.distanceKm || 0);
      const mult = MULTIPLIERS.CARDIO[type?.toLowerCase()] || 10.0;
      basePoints = km * mult;
      breakdownFormula = `${km} km × ${mult} pts/km`;
      break;
    }
    case 'calisthenics': {
      const t = (type || '').toLowerCase();
      if (t === 'plank') {
        const sec = parseFloat(metrics.durationSeconds || 0);
        basePoints = sec * MULTIPLIERS.CALISTHENICS.plank;
        breakdownFormula = `${sec}s × 0.2 pts/s`;
      } else {
        const reps = parseInt(metrics.reps || 0, 10);
        const mult = MULTIPLIERS.CALISTHENICS[t] || 0.8;
        basePoints = reps * mult;
        breakdownFormula = `${reps} reps × ${mult} pts/rep`;
      }
      break;
    }
    case 'strength': {
      const weight = parseFloat(metrics.weightKg || 0);
      const reps = parseInt(metrics.reps || 0, 10);
      const sets = parseInt(metrics.sets || 1, 10);
      const totalReps = reps * sets;
      const volume = weight * totalReps;
      const coeff = metrics.liftType === 'isolation'
        ? MULTIPLIERS.STRENGTH_COEFFICIENT.isolation
        : MULTIPLIERS.STRENGTH_COEFFICIENT.compound;
      basePoints = volume * coeff;
      breakdownFormula = `(${weight}kg × ${totalReps} total reps) × ${coeff}`;
      break;
    }
    case 'sports': {
      const mins = parseFloat(metrics.durationMinutes || 0);
      const mult = MULTIPLIERS.SPORTS[metrics.intensity || 'high_intensity'] || 1.0;
      basePoints = mins * mult;
      breakdownFormula = `${mins} mins × ${mult} pts/min`;
      break;
    }
    default:
      basePoints = 0;
      breakdownFormula = 'N/A';
  }

  // Class bonus
  let bonusMultiplier = 1.0;
  const cls = (userClass || '').toLowerCase();
  if (cls.includes('juggernaut') && category === 'strength') bonusMultiplier = 1.10;
  else if (cls.includes('strider') && type === 'running') bonusMultiplier = 1.10;
  else if (cls.includes('aquanaut') && type === 'swimming') bonusMultiplier = 1.15;
  else if (cls.includes('shinobi') && category === 'calisthenics') bonusMultiplier = 1.10;
  else if (cls.includes('vanguard')) bonusMultiplier = 1.05;

  const finalPoints = Math.round(basePoints * bonusMultiplier * 10) / 10;

  return {
    basePoints: Math.round(basePoints * 10) / 10,
    bonusMultiplier,
    finalPoints,
    breakdownFormula
  };
}
