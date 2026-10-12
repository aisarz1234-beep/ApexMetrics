export const CONFIG = {
  PORT: process.env.PORT || 5000,
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  JWT_SECRET: process.env.JWT_SECRET || 'apexmetrics_super_secure_jwt_secret_key_2026_production',
  RATE_LIMIT_WINDOW_MS: 15 * 60 * 1000, // 15 mins
  RATE_LIMIT_MAX_REQUESTS: 250,
  
  // Scoring Constants
  MULTIPLIERS: {
    CARDIO: {
      swimming: 30.0, // pts per km
      running: 10.0,   // pts per km
      cycling: 3.0     // pts per km
    },
    CALISTHENICS: {
      pull_up: 3.0,    // pts per rep
      chin_up: 3.0,    // pts per rep
      push_up: 0.8,    // pts per rep
      squat: 0.5,      // pts per rep
      lunge: 0.5,      // pts per rep
      plank: 0.2       // pts per second
    },
    STRENGTH_COEFFICIENT: {
      compound: 0.05,  // per kg-rep (Squat, Deadlift, Bench Press, OHP)
      isolation: 0.02  // per kg-rep (Bicep Curls, Lateral Raises, etc.)
    },
    SPORTS: {
      high_intensity: 2.0,     // pts per minute (HIIT, Sparring, Competitive Matches)
      moderate_intensity: 1.0  // pts per minute (Yoga, Light Stretching, Recovery)
    }
  },

  // Anti-Cheat Heuristic Limits
  ANTI_CHEAT_THRESHOLDS: {
    // Pace limits in minutes per km
    MIN_RUN_PACE_MIN_PER_KM: 2.2, // ~2:12/km (faster than world record is suspicious)
    MIN_SWIM_PACE_MIN_PER_KM: 9.5, // ~57s per 100m
    MIN_CYCLE_PACE_MIN_PER_KM: 0.9, // ~66 km/h sustained

    // Rep caps in single session
    MAX_PULL_UPS_PER_LOG: 150,
    MAX_PUSH_UPS_PER_LOG: 400,
    MAX_SQUATS_PER_LOG: 600,
    MAX_PLANK_SECONDS_PER_LOG: 600, // 10 minutes

    // Strength caps (volume kg * reps in single session)
    MAX_STRENGTH_SESSION_VOLUME: 40000, // 40,000 kg total session volume
    MAX_SINGLE_REP_WEIGHT_KG: 505 // Near world record raw deadlift/squat
  }
};
