import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../utils/api.js';
import { calculateLivePoints } from '../utils/scoringCalculator.js';
import confetti from 'canvas-confetti';
import {
  X,
  Zap,
  Activity,
  Dumbbell,
  Timer,
  FileCheck2,
  AlertTriangle,
  Upload,
  CheckCircle,
  Flame,
  ShieldCheck
} from 'lucide-react';

export const QuickLogModal = ({ isOpen, onClose, onWorkoutLogged }) => {
  const { user } = useAuth();

  const [category, setCategory] = useState('cardio'); // 'cardio' | 'calisthenics' | 'strength' | 'sports'
  const [activityType, setActivityType] = useState('running');
  const [metrics, setMetrics] = useState({
    distanceKm: '5.0',
    durationMinutes: '25',
    reps: '25',
    sets: '3',
    weightKg: '80',
    liftType: 'compound',
    durationSeconds: '60',
    intensity: 'high_intensity'
  });
  const [exerciseName, setExerciseName] = useState('Bench Press');
  const [sportName, setSportName] = useState('HIIT Circuit');
  const [zone, setZone] = useState('Track & Field Stadium');

  // GPX Verification state
  const [gpxFile, setGpxFile] = useState(null);
  const [gpxVerified, setGpxVerified] = useState(false);
  const [gpxData, setGpxData] = useState(null);
  const [isVerifyingGpx, setIsVerifyingGpx] = useState(false);

  // Live Score Preview
  const [liveScore, setLiveScore] = useState({ finalPoints: 50, breakdownFormula: '' });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Update live score whenever inputs change
  useEffect(() => {
    const calc = calculateLivePoints(category, activityType, metrics, user?.characterClass);
    setLiveScore(calc);
  }, [category, activityType, metrics, user?.characterClass]);

  if (!isOpen) return null;

  const handleMetricChange = (field, val) => {
    setMetrics(prev => ({ ...prev, [field]: val }));
  };

  // Mock GPX sample generator for quick verification test
  const handleLoadSampleGpx = async () => {
    setIsVerifyingGpx(true);
    const sampleGpxText = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Garmin Forerunner 965">
  <trk>
    <name>Morning 5K Campus Speed Run</name>
    <trkseg>
      <trkpt lat="37.7749" lon="-122.4194"><ele>15.2</ele><time>2026-10-12T06:30:00Z</time><hr>145</hr></trkpt>
      <trkpt lat="37.7758" lon="-122.4182"><ele>15.8</ele><time>2026-10-12T06:34:00Z</time><hr>158</hr></trkpt>
      <trkpt lat="37.7770" lon="-122.4165"><ele>16.4</ele><time>2026-10-12T06:38:00Z</time><hr>162</hr></trkpt>
      <trkpt lat="37.7785" lon="-122.4140"><ele>17.1</ele><time>2026-10-12T06:42:00Z</time><hr>165</hr></trkpt>
      <trkpt lat="37.7801" lon="-122.4115"><ele>18.0</ele><time>2026-10-12T06:47:00Z</time><hr>168</hr></trkpt>
      <trkpt lat="37.7815" lon="-122.4090"><ele>18.5</ele><time>2026-10-12T06:52:00Z</time><hr>164</hr></trkpt>
    </trkseg>
  </trk>
</gpx>`;
    try {
      const res = await api.uploadGpx(sampleGpxText);
      setGpxData(res);
      setGpxVerified(res.verified);
      if (res.distanceKm) {
        setMetrics(prev => ({
          ...prev,
          distanceKm: res.distanceKm.toString(),
          durationMinutes: res.durationMinutes.toString()
        }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsVerifyingGpx(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrorMsg('');

    try {
      const payload = {
        activityCategory: category,
        activityType,
        metrics,
        exerciseName: category === 'strength' ? exerciseName : undefined,
        sportName: category === 'sports' ? sportName : undefined,
        zone,
        isGpxVerified: gpxVerified,
        gpxVerificationData: gpxData
      };

      const res = await api.logWorkout(payload);

      // Trigger Confetti Celebration!
      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 }
      });

      if (onWorkoutLogged) onWorkoutLogged(res);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit workout log.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-[#111827] border border-slate-700 rounded-2xl shadow-2xl overflow-hidden my-8">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-900/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold">
              ⚡
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-white">Log Multi-Discipline Workout</h3>
              <p className="text-xs text-slate-400">Standardized point scoring with heuristic validation</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {errorMsg && (
            <div className="p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Discipline Selector Cards */}
          <div>
            <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
              Select Discipline
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => {
                  setCategory('cardio');
                  setActivityType('running');
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  category === 'cardio'
                    ? 'border-cyan-500 bg-cyan-500/10 text-cyan-300 shadow-glow-cyan'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Activity className="w-5 h-5 mb-1 text-cyan-400" />
                <div className="text-xs font-bold">Cardio</div>
                <div className="text-[10px] text-slate-400">Swim, Run, Bike</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCategory('calisthenics');
                  setActivityType('pull_up');
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  category === 'calisthenics'
                    ? 'border-violet-500 bg-violet-500/10 text-violet-300 shadow-glow-purple'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Flame className="w-5 h-5 mb-1 text-violet-400" />
                <div className="text-xs font-bold">Calisthenics</div>
                <div className="text-[10px] text-slate-400">Reps & Planks</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCategory('strength');
                  setActivityType('compound');
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  category === 'strength'
                    ? 'border-amber-500 bg-amber-500/10 text-amber-300 shadow-glow-gold'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Dumbbell className="w-5 h-5 mb-1 text-amber-400" />
                <div className="text-xs font-bold">Strength</div>
                <div className="text-[10px] text-slate-400">Volume Lifts</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCategory('sports');
                  setActivityType('high_intensity');
                }}
                className={`p-3 rounded-xl border text-left transition-all ${
                  category === 'sports'
                    ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                    : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                }`}
              >
                <Timer className="w-5 h-5 mb-1 text-emerald-400" />
                <div className="text-xs font-bold">Sports / HIIT</div>
                <div className="text-[10px] text-slate-400">Time-Based</div>
              </button>
            </div>
          </div>

          {/* Dynamic Inputs Based on Category */}
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 space-y-4">
            {/* Cardio Inputs */}
            {category === 'cardio' && (
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'running', label: '🏃 Running (10 pts/km)' },
                    { id: 'swimming', label: '🏊 Swimming (30 pts/km)' },
                    { id: 'cycling', label: '🚴 Cycling (3 pts/km)' }
                  ].map(act => (
                    <button
                      key={act.id}
                      type="button"
                      onClick={() => setActivityType(act.id)}
                      className={`py-2 px-2 text-xs font-semibold rounded-lg border text-center transition-all ${
                        activityType === act.id
                          ? 'border-cyan-500 bg-cyan-500/20 text-cyan-300'
                          : 'border-slate-800 bg-slate-900 text-slate-400'
                      }`}
                    >
                      {act.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Distance (km)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={metrics.distanceKm}
                      onChange={e => handleMetricChange('distanceKm', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      value={metrics.durationMinutes}
                      onChange={e => handleMetricChange('durationMinutes', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-cyan-500"
                    />
                  </div>
                </div>

                {/* GPX/FIT File Verification Drawer */}
                <div className="p-3 rounded-lg bg-slate-800/60 border border-slate-700/80">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-cyan-400" />
                      Smartwatch / GPX Verification Engine
                    </span>
                    {gpxVerified && (
                      <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> GPS Verified (Trust: 99%)
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleLoadSampleGpx}
                      disabled={isVerifyingGpx}
                      className="text-xs px-3 py-1.5 rounded bg-slate-700 hover:bg-slate-600 text-cyan-300 font-semibold flex items-center gap-1.5 transition-all"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      {isVerifyingGpx ? 'Analyzing Trackpoints...' : 'Load & Verify Garmin Track (Demo)'}
                    </button>
                    <span className="text-[11px] text-slate-400">
                      Auto-computes true Haversine distance & pace limits
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Calisthenics Inputs */}
            {category === 'calisthenics' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {[
                    { id: 'pull_up', label: 'Pull-up (3.0 pts)' },
                    { id: 'push_up', label: 'Push-up (0.8 pts)' },
                    { id: 'squat', label: 'Squat (0.5 pts)' },
                    { id: 'plank', label: 'Plank (0.2/sec)' }
                  ].map(act => (
                    <button
                      key={act.id}
                      type="button"
                      onClick={() => setActivityType(act.id)}
                      className={`py-2 px-1 text-xs font-semibold rounded-lg border text-center transition-all ${
                        activityType === act.id
                          ? 'border-violet-500 bg-violet-500/20 text-violet-300'
                          : 'border-slate-800 bg-slate-900 text-slate-400'
                      }`}
                    >
                      {act.label}
                    </button>
                  ))}
                </div>

                {activityType === 'plank' ? (
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Time Under Tension (Seconds)
                    </label>
                    <input
                      type="number"
                      step="5"
                      min="5"
                      value={metrics.durationSeconds}
                      onChange={e => handleMetricChange('durationSeconds', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-violet-500"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Total Repetitions
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      value={metrics.reps}
                      onChange={e => handleMetricChange('reps', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-violet-500"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Strength Inputs */}
            {category === 'strength' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Lift Category & Multiplier
                    </label>
                    <select
                      value={metrics.liftType}
                      onChange={e => handleMetricChange('liftType', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-amber-500"
                    >
                      <option value="compound">Compound (0.05 coeff: Squat, Bench, Deadlift)</option>
                      <option value="isolation">Isolation (0.02 coeff: Curls, Raises, etc.)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Exercise Name
                    </label>
                    <input
                      type="text"
                      value={exerciseName}
                      onChange={e => setExerciseName(e.target.value)}
                      placeholder="e.g. Barbell Bench Press"
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="2.5"
                      min="1"
                      value={metrics.weightKg}
                      onChange={e => handleMetricChange('weightKg', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Reps per Set
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      value={metrics.reps}
                      onChange={e => handleMetricChange('reps', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Sets Completed
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      value={metrics.sets}
                      onChange={e => handleMetricChange('sets', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Sports & HIIT Inputs */}
            {category === 'sports' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Intensity Tier
                    </label>
                    <select
                      value={metrics.intensity}
                      onChange={e => handleMetricChange('intensity', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
                    >
                      <option value="high_intensity">High-Intensity (2.0 pts/min: HIIT, Boxing)</option>
                      <option value="moderate_intensity">Moderate-Intensity (1.0 pt/min: Yoga, Mobility)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1">
                      Duration (Minutes)
                    </label>
                    <input
                      type="number"
                      step="5"
                      min="1"
                      value={metrics.durationMinutes}
                      onChange={e => handleMetricChange('durationMinutes', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white font-mono text-sm focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Campus Zone (Turf Wars Territory Capture) */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
                Campus Location (Turf Wars Zone)
              </label>
              <select
                value={zone}
                onChange={e => setZone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-white text-xs font-medium focus:outline-none focus:border-cyan-500"
              >
                <option value="The Iron Dungeon / Student Gym">The Iron Dungeon / Student Gym (+5% Strength)</option>
                <option value="Track & Field Stadium">Track & Field Stadium (+5% Running)</option>
                <option value="Olympic Aquatic Center">Olympic Aquatic Center (+5% Swimming)</option>
                <option value="Memorial Stadium Steps">Memorial Stadium Steps (+5% Calisthenics)</option>
                <option value="University Quad & Green">University Quad & Green (+5% Sports)</option>
              </select>
            </div>
          </div>

          {/* Unified Scoring Engine Live Preview */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-slate-900 to-cyan-950/40 border border-cyan-500/30 flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-wider font-extrabold text-cyan-400 flex items-center gap-1">
                <Zap className="w-3.5 h-3.5" />
                Unified Scoring Formula
              </div>
              <div className="text-xs text-slate-300 font-mono mt-0.5">
                {liveScore.breakdownFormula}
              </div>
              {liveScore.bonusMultiplier > 1 && (
                <div className="text-[11px] text-amber-400 font-semibold mt-0.5">
                  ★ {user?.characterClass} Affinity Bonus: +{Math.round((liveScore.bonusMultiplier - 1) * 100)}%
                </div>
              )}
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-400 font-medium">Standardized Points</div>
              <div className="text-2xl font-black text-cyan-300 tracking-tight">
                +{liveScore.finalPoints} <span className="text-xs font-bold text-slate-400">PTS</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-slate-400 hover:text-white font-medium text-sm transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-glow-cyan transition-all transform active:scale-95 disabled:opacity-50"
            >
              {submitting ? 'Verifying & Saving...' : 'Submit Certified Log ⚡'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
