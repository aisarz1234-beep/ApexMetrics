import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { StatRadarChart } from './StatRadarChart.jsx';
import {
  Sparkles,
  Award,
  Shield,
  Zap,
  TrendingUp,
  Dumbbell,
  CheckCircle,
  Flame
} from 'lucide-react';

export const CharacterCard = () => {
  const { user, updateProfile } = useAuth();
  const [switchingClass, setSwitchingClass] = useState(false);

  if (!user) return null;

  // Level progress math
  const level = user.level || 1;
  const currentTotal = user.totalPoints || 0;
  const pointsCurrentLevel = Math.pow(level - 1, 2) * 25;
  const pointsNextLevel = Math.pow(level, 2) * 25;
  const levelPointsEarned = Math.max(0, currentTotal - pointsCurrentLevel);
  const levelPointsNeeded = pointsNextLevel - pointsCurrentLevel;
  const percent = Math.min(100, Math.round((levelPointsEarned / levelPointsNeeded) * 100));

  const classes = [
    {
      id: 'Juggernaut',
      icon: '🏋️‍♂️',
      desc: '+10% Bonus on Compound Strength Lifts',
      accent: 'border-amber-500 text-amber-400'
    },
    {
      id: 'Apex Strider',
      icon: '🏃‍♂️',
      desc: '+10% Bonus on Running Cardio',
      accent: 'border-cyan-500 text-cyan-400'
    },
    {
      id: 'Aquanaut',
      icon: '🏊‍♀️',
      desc: '+15% Bonus on Swimming Cardio',
      accent: 'border-blue-500 text-blue-400'
    },
    {
      id: 'Shinobi',
      icon: '🤸‍♂️',
      desc: '+10% Bonus on Bodyweight Calisthenics',
      accent: 'border-violet-500 text-violet-400'
    },
    {
      id: 'Vanguard',
      icon: '⚡',
      desc: '+5% Balanced Multiplier Across All Disciplines',
      accent: 'border-emerald-500 text-emerald-400'
    }
  ];

  const milestoneBadges = [
    {
      id: 'Waterlogged',
      name: 'Waterlogged',
      icon: '🌊',
      desc: 'Submerged until gills sprouted. Completed heavy endurance swimming sessions.',
      unlocked: user.badges?.includes('Waterlogged')
    },
    {
      id: 'Gravity Defier',
      name: 'Gravity Defier',
      icon: '🧗‍♂️',
      desc: 'Newton wept. Crushed high-repetition bodyweight pull-ups and calisthenics.',
      unlocked: user.badges?.includes('Gravity Defier')
    },
    {
      id: 'Iron Disciple',
      name: 'Iron Disciple',
      icon: '🏛️',
      desc: 'Lifted heavy iron until chalk became your skin tone.',
      unlocked: user.badges?.includes('Iron Disciple')
    },
    {
      id: 'Century Club',
      name: 'Century Club',
      icon: '💯',
      desc: 'Surpassed 1,000+ standardized points in the unified scoring engine.',
      unlocked: user.badges?.includes('Century Club')
    },
    {
      id: 'Dawn Patrol',
      name: 'Dawn Patrol',
      icon: '🌅',
      desc: 'Logged intense physical output before the world hit snooze at 7:00 AM.',
      unlocked: user.badges?.includes('Dawn Patrol')
    },
    {
      id: 'Titan Slayer',
      name: 'Titan Slayer',
      icon: '⚔️',
      desc: 'Dealt over 1,000 damage in co-op community Boss Raids.',
      unlocked: user.badges?.includes('Titan Slayer')
    }
  ];

  const handleSelectClass = async (className) => {
    await updateProfile({ characterClass: className });
    setSwitchingClass(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-slate-900 via-[#111827] to-slate-900 border border-slate-700/80 p-6 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6 relative z-10">
          {/* Avatar and Basic Details */}
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="relative">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-cyan-600 to-violet-600 flex items-center justify-center text-4xl shadow-glow-cyan border-2 border-white/20">
                {user.avatar || '⚡'}
              </div>
              <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-amber-500 text-black font-extrabold text-xs shadow-md">
                Lvl {user.level}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl font-black text-white">{user.name}</h2>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-slate-800 text-cyan-400 border border-slate-700 font-bold">
                  @{user.username}
                </span>
              </div>

              <div className="text-sm font-semibold text-slate-300 mt-1 flex items-center justify-center sm:justify-start gap-2">
                <span className="text-cyan-400">{user.characterClass}</span>
                <span>•</span>
                <span className="text-violet-400">{user.campus}</span>
                <span>•</span>
                <span className="text-amber-400">🔥 {user.streakDays || 1}d Streak</span>
              </div>

              {/* Level XP Bar */}
              <div className="mt-4 w-full sm:w-80">
                <div className="flex justify-between text-xs font-semibold text-slate-400 mb-1">
                  <span>Level {level} Progression</span>
                  <span className="text-cyan-400 font-mono">
                    {Math.round(levelPointsEarned)} / {Math.round(levelPointsNeeded)} XP ({percent}%)
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-slate-800 overflow-hidden border border-slate-700/50">
                  <div
                    className="h-full bg-gradient-to-r from-cyan-500 via-sky-400 to-violet-500 rounded-full transition-all duration-700"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Stat Pill Overview */}
          <div className="grid grid-cols-2 gap-3 w-full md:w-auto">
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 text-center">
              <div className="text-xs text-slate-400 font-medium">All-Time Points</div>
              <div className="text-lg font-black text-cyan-300 mt-0.5">
                {Math.round(user.totalPoints).toLocaleString()}
              </div>
            </div>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700 text-center">
              <div className="text-xs text-slate-400 font-medium">Weekly Score</div>
              <div className="text-lg font-black text-amber-300 mt-0.5">
                {Math.round(user.weeklyPoints).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Attributes Radar & Character Class Switcher */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Radar Attributes */}
        <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" />
                RPG Attribute Matrix
              </h3>
              <p className="text-xs text-slate-400">
                Grown dynamically from physical volume, cadence, and load
              </p>
            </div>
          </div>

          <StatRadarChart stats={user.stats} />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-4 border-t border-slate-800/80 text-center">
            <div>
              <div className="text-[11px] font-medium text-slate-400">Strength</div>
              <div className="text-base font-black text-amber-400">{user.stats?.strength || 10}</div>
            </div>
            <div>
              <div className="text-[11px] font-medium text-slate-400">Endurance</div>
              <div className="text-base font-black text-cyan-400">{user.stats?.endurance || 10}</div>
            </div>
            <div>
              <div className="text-[11px] font-medium text-slate-400">Agility</div>
              <div className="text-base font-black text-violet-400">{user.stats?.agility || 10}</div>
            </div>
            <div>
              <div className="text-[11px] font-medium text-slate-400">Stamina</div>
              <div className="text-base font-black text-emerald-400">{user.stats?.stamina || 10}</div>
            </div>
          </div>
        </div>

        {/* Character Class Mastery */}
        <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-extrabold text-white flex items-center gap-2">
                  <Shield className="w-5 h-5 text-violet-400" />
                  Character Class & Affinity Flairs
                </h3>
                <p className="text-xs text-slate-400">
                  Select your archetype for unique point multipliers
                </p>
              </div>
            </div>

            <div className="space-y-2.5">
              {classes.map(cls => {
                const isSelected = user.characterClass === cls.id;
                return (
                  <button
                    key={cls.id}
                    onClick={() => handleSelectClass(cls.id)}
                    className={`w-full p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-500/15 shadow-glow-cyan'
                        : 'border-slate-800 bg-slate-900/60 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{cls.icon}</span>
                      <div>
                        <div className="text-sm font-extrabold text-white flex items-center gap-2">
                          {cls.id}
                          {isSelected && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-400 text-black font-black uppercase">
                              Active
                            </span>
                          )}
                        </div>
                        <div className="text-xs text-slate-400 mt-0.5">{cls.desc}</div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Milestone Evolution Badges */}
      <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Milestone Evolution Badges & Titles
            </h3>
            <p className="text-xs text-slate-400">
              Humorous and animated accolades unlocked through real physical milestones
            </p>
          </div>
          <span className="text-xs font-bold text-slate-400">
            {user.badges?.length || 0} / {milestoneBadges.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {milestoneBadges.map(badge => (
            <div
              key={badge.id}
              className={`p-4 rounded-xl border transition-all ${
                badge.unlocked
                  ? 'border-amber-500/40 bg-gradient-to-tr from-slate-900 to-amber-950/20 shadow-glow-gold'
                  : 'border-slate-800/80 bg-slate-900/40 opacity-50 grayscale'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-slate-800 flex items-center justify-center text-2xl border border-slate-700">
                  {badge.icon}
                </div>
                <div>
                  <div className="font-extrabold text-sm text-white flex items-center gap-1.5">
                    {badge.name}
                    {badge.unlocked && (
                      <CheckCircle className="w-3.5 h-3.5 text-amber-400" />
                    )}
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5 leading-snug">
                    {badge.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
