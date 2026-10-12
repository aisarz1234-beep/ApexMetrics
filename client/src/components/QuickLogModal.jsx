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
  AlertTriangle,
  Upload,
  CheckCircle,
  Flame,
  ShieldCheck,
  Scroll,
  Swords
} from 'lucide-react';

export const QuickLogModal = ({ isOpen, onClose, onWorkoutLogged }) => {
  const { user } = useAuth();

  const [category, setCategory] = useState('cardio');
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
  const [exerciseName, setExerciseName] = useState('Barbell Bench Press');
  const [sportName, setSportName] = useState('Combat Sparring');
  const [zone, setZone] = useState('The Ironkeep Forge & Barracks');

  const [gpxVerified, setGpxVerified] = useState(false);
  const [gpxData, setGpxData] = useState(null);
  const [isVerifyingGpx, setIsVerifyingGpx] = useState(false);

  const [liveScore, setLiveScore] = useState({ finalPoints: 50, breakdownFormula: '' });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const calc = calculateLivePoints(category, activityType, metrics, user?.characterClass);
    setLiveScore(calc);
  }, [category, activityType, metrics, user?.characterClass]);

  if (!isOpen) return null;

  const handleMetricChange = (field, val) => {
    setMetrics(prev => ({ ...prev, [field]: val }));
  };

  const handleLoadSampleGpx = async () => {
    setIsVerifyingGpx(true);
    const sampleGpxText = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="Garmin Forerunner 965">
  <trk>
    <name>Linirea Woodland Sprint</name>
    <trkseg>
      <trkpt lat="37.7700" lon="-122.4100"><ele>15.2</ele><time>2026-10-12T06:00:00Z</time><hr>145</hr></trkpt>
      <trkpt lat="37.7800" lon="-122.4100"><ele>15.8</ele><time>2026-10-12T06:05:00Z</time><hr>158</hr></trkpt>
      <trkpt lat="37.7900" lon="-122.4100"><ele>16.4</ele><time>2026-10-12T06:10:00Z</time><hr>162</hr></trkpt>
      <trkpt lat="37.8000" lon="-122.4100"><ele>17.1</ele><time>2026-10-12T06:15:00Z</time><hr>165</hr></trkpt>
      <trkpt lat="37.8100" lon="-122.4100"><ele>18.0</ele><time>2026-10-12T06:20:00Z</time><hr>168</hr></trkpt>
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

      confetti({
        particleCount: 140,
        spread: 90,
        origin: { y: 0.6 }
      });

      if (onWorkoutLogged) onWorkoutLogged(res);
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Failed to proclaim heroic feat.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl kr-wood-panel border-4 border-[#78350F] shadow-2xl overflow-hidden my-8">
        {/* Header Trim */}
        <div className="flex items-center justify-between px-6 py-4 border-b-2 border-[#5C3317] bg-[#1E0F07]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-amber-400 to-amber-600 border border-amber-800 text-stone-900 flex items-center justify-center text-xl font-black shadow-kr-gold">
              ⚡
            </div>
            <div>
              <h3 className="text-2xl font-black text-amber-200">Log Multi-Discipline Workout</h3>
              <p className="text-xs text-amber-300/80">Standardized point normalization & verification engine</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-amber-300 hover:text-white rounded-lg hover:bg-[#3D2210] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {errorMsg && (
            <div className="p-3 rounded-xl bg-red-950 border border-red-500 text-red-200 text-xs font-bold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Discipline Selector Cards */}
          <div>
            <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
              Select Activity Discipline
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => {
                  setCategory('cardio');
                  setActivityType('running');
                }}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  category === 'cardio'
                    ? 'border-amber-400 bg-amber-500/20 text-amber-200 shadow-kr-gold'
                    : 'border-[#5C3317] bg-[#241409] text-amber-200/70 hover:border-amber-600'
                }`}
              >
                <div className="text-xl mb-1">🏃</div>
                <div className="text-sm font-black">Cardio</div>
                <div className="text-[10px] text-amber-300/70">Swim, Run, Bike</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCategory('calisthenics');
                  setActivityType('pull_up');
                }}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  category === 'calisthenics'
                    ? 'border-amber-400 bg-amber-500/20 text-amber-200 shadow-kr-gold'
                    : 'border-[#5C3317] bg-[#241409] text-amber-200/70 hover:border-amber-600'
                }`}
              >
                <div className="text-xl mb-1">🤸</div>
                <div className="text-sm font-black">Calisthenics</div>
                <div className="text-[10px] text-amber-300/70">Reps & Planks</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCategory('strength');
                  setActivityType('compound');
                }}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  category === 'strength'
                    ? 'border-amber-400 bg-amber-500/20 text-amber-200 shadow-kr-gold'
                    : 'border-[#5C3317] bg-[#241409] text-amber-200/70 hover:border-amber-600'
                }`}
              >
                <div className="text-xl mb-1">🏋️</div>
                <div className="text-sm font-black">Weightlifting</div>
                <div className="text-[10px] text-amber-300/70">Volume Lifts</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  setCategory('sports');
                  setActivityType('high_intensity');
                }}
                className={`p-3 rounded-xl border-2 text-left transition-all ${
                  category === 'sports'
                    ? 'border-amber-400 bg-amber-500/20 text-amber-200 shadow-kr-gold'
                    : 'border-[#5C3317] bg-[#241409] text-amber-200/70 hover:border-amber-600'
                }`}
              >
                <div className="text-xl mb-1">⚡</div>
                <div className="text-sm font-black whitespace-nowrap">Sports / HIIT</div>
                <div className="text-[10px] text-amber-300/70">Time-Based</div>
              </button>
            </div>
          </div>

          {/* Dynamic Inputs Based on Category */}
          <div className="p-4 rounded-xl bg-[#241409] border-2 border-[#5C3317] space-y-4">
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
                      className={`py-2 px-1 text-xs font-bold rounded-lg border-2 text-center transition-all ${
                        activityType === act.id
                          ? 'border-amber-400 bg-amber-500/20 text-amber-200'
                          : 'border-[#5C3317] bg-[#1A0E06] text-amber-300/60'
                      }`}
                    >
                      {act.label}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-amber-300 mb-1">
                      Distance Covered (km)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      min="0.1"
                      value={metrics.distanceKm}
                      onChange={e => handleMetricChange('distanceKm', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#180A04] border-2 border-[#5C3317] text-amber-100 font-mono text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-amber-300 mb-1">
                      Duration (minutes)
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      value={metrics.durationMinutes}
                      onChange={e => handleMetricChange('durationMinutes', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#180A04] border-2 border-[#5C3317] text-amber-100 font-mono text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                {/* GPS Smartwatch Verification */}
                <div className="p-3 rounded-xl bg-[#1A0E06] border border-[#5C3317]">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-amber-400" />
                      Smartwatch GPS Verification
                    </span>
                    {gpxVerified && (
                      <span className="text-[11px] font-bold text-emerald-400 flex items-center gap-1">
                        <CheckCircle className="w-3.5 h-3.5" /> Certified GPS (Trust: 99%)
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleLoadSampleGpx}
                      disabled={isVerifyingGpx}
                      className="kr-btn-gold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 shadow-sm font-bold"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      {isVerifyingGpx ? 'Inspecting Trackpoints...' : 'Load & Verify Garmin Track (Demo)'}
                    </button>
                    <span className="text-[11px] text-amber-200/70">
                      Calculates authentic Haversine pacing
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
                    { id: 'plank', label: 'Plank (0.2/s)' }
                  ].map(act => (
                    <button
                      key={act.id}
                      type="button"
                      onClick={() => setActivityType(act.id)}
                      className={`py-2 px-1 text-xs font-bold rounded-lg border-2 text-center transition-all ${
                        activityType === act.id
                          ? 'border-amber-400 bg-amber-500/20 text-amber-200'
                          : 'border-[#5C3317] bg-[#1A0E06] text-amber-300/60'
                      }`}
                    >
                      {act.label}
                    </button>
                  ))}
                </div>

                {activityType === 'plank' ? (
                  <div>
                    <label className="block text-xs font-bold text-amber-300 mb-1">
                      Time Under Tension (Seconds)
                    </label>
                    <input
                      type="number"
                      step="5"
                      min="5"
                      value={metrics.durationSeconds}
                      onChange={e => handleMetricChange('durationSeconds', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#180A04] border-2 border-[#5C3317] text-amber-100 font-mono text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>
                ) : (
                  <div>
                    <label className="block text-xs font-bold text-amber-300 mb-1">
                      Total Strict Repetitions
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      value={metrics.reps}
                      onChange={e => handleMetricChange('reps', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#180A04] border-2 border-[#5C3317] text-amber-100 font-mono text-sm focus:outline-none focus:border-amber-400"
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
                    <label className="block text-xs font-bold text-amber-300 mb-1">
                      Lift Coefficient
                    </label>
                    <select
                      value={metrics.liftType}
                      onChange={e => handleMetricChange('liftType', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#180A04] border-2 border-[#5C3317] text-amber-100 text-xs font-bold focus:outline-none focus:border-amber-400"
                    >
                      <option value="compound">Compound (0.05 coeff: Squat, Bench, Deadlift)</option>
                      <option value="isolation">Isolation (0.02 coeff: Curls, Raises, etc.)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-amber-300 mb-1">
                      Exercise Name
                    </label>
                    <input
                      type="text"
                      value={exerciseName}
                      onChange={e => setExerciseName(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#180A04] border-2 border-[#5C3317] text-amber-100 text-xs font-bold focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs font-bold text-amber-300 mb-1">
                      Weight (kg)
                    </label>
                    <input
                      type="number"
                      step="2.5"
                      min="1"
                      value={metrics.weightKg}
                      onChange={e => handleMetricChange('weightKg', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#180A04] border-2 border-[#5C3317] text-amber-100 font-mono text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-amber-300 mb-1">
                      Reps per Set
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      value={metrics.reps}
                      onChange={e => handleMetricChange('reps', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#180A04] border-2 border-[#5C3317] text-amber-100 font-mono text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-amber-300 mb-1">
                      Sets Done
                    </label>
                    <input
                      type="number"
                      step="1"
                      min="1"
                      value={metrics.sets}
                      onChange={e => handleMetricChange('sets', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#180A04] border-2 border-[#5C3317] text-amber-100 font-mono text-sm focus:outline-none focus:border-amber-400"
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
                    <label className="block text-xs font-bold text-amber-300 mb-1">
                      Intensity Tier
                    </label>
                    <select
                      value={metrics.intensity}
                      onChange={e => handleMetricChange('intensity', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#180A04] border-2 border-[#5C3317] text-amber-100 text-xs font-bold focus:outline-none focus:border-amber-400"
                    >
                      <option value="high_intensity">High-Intensity (2.0 pts/min: Sparring, Boxing, HIIT)</option>
                      <option value="moderate_intensity">Moderate-Intensity (1.0 pt/min: Mobility, Recovery)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-amber-300 mb-1">
                      Duration (Minutes)
                    </label>
                    <input
                      type="number"
                      step="5"
                      min="1"
                      value={metrics.durationMinutes}
                      onChange={e => handleMetricChange('durationMinutes', e.target.value)}
                      className="w-full px-3 py-2 rounded-lg bg-[#180A04] border-2 border-[#5C3317] text-amber-100 font-mono text-sm focus:outline-none focus:border-amber-400"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Territory Sector */}
            <div>
              <label className="block text-xs font-bold text-amber-300 uppercase tracking-wider mb-1">
                Turf War Territory Sector
              </label>
              <select
                value={zone}
                onChange={e => setZone(e.target.value)}
                className="w-full px-3 py-2 rounded-lg bg-[#180A04] border-2 border-[#5C3317] text-amber-100 text-xs font-bold focus:outline-none focus:border-amber-400"
              >
                <option value="The Ironkeep Forge & Barracks">The Ironkeep Forge & Barracks (+5% Strength)</option>
                <option value="Whispering Woods Ranger Glade">Whispering Woods Ranger Glade (+5% Running)</option>
                <option value="Sunken Merfolk Lagoon">Sunken Merfolk Lagoon (+5% Swimming)</option>
                <option value="Stormcloud Peak Mountain Bastion">Stormcloud Peak Mountain Bastion (+5% Calisthenics)</option>
                <option value="King Denas's Royal Tournament Field">King Denas's Royal Tournament Field (+5% Combat)</option>
              </select>
            </div>
          </div>

          {/* Unified Scoring Formula Live Preview */}
          <div className="kr-parchment p-4 flex items-center justify-between border-2 border-[#8D5B29] shadow-md">
            <div>
              <div className="text-[10px] uppercase tracking-wider font-bold text-[#78350F] flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-[#B45309]" />
                Standardized Formula Preview
              </div>
              <div className="text-sm text-[#381A05] font-bold mt-0.5">
                {liveScore.breakdownFormula}
              </div>
              {liveScore.bonusMultiplier > 1 && (
                <div className="text-xs text-[#991B1B] font-black mt-0.5">
                  ★ {user?.characterClass} Hero Affinity Bonus: +{Math.round((liveScore.bonusMultiplier - 1) * 100)}%
                </div>
              )}
            </div>

            <div className="text-right">
              <div className="text-[10px] text-[#78350F] font-bold uppercase">Points Awarded</div>
              <div className="text-3xl font-black text-[#B45309]">
                +{liveScore.finalPoints} <span className="text-xs font-bold text-[#78350F]">PTS</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2 border-t-2 border-[#5C3317]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 font-bold text-amber-300 hover:text-white transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="kr-btn-gold px-6 py-2.5 rounded-xl text-base font-black shadow-kr-button"
            >
              {submitting ? 'Submitting Log...' : 'Submit Workout Log ⚡'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
