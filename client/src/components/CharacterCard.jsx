import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { StatRadarChart } from './StatRadarChart.jsx';
import {
  Shield,
  Award,
  Crown,
  Swords,
  Sparkles,
  Zap,
  CheckCircle,
  Flame,
  Star
} from 'lucide-react';

export const CharacterCard = () => {
  const { user, updateProfile } = useAuth();
  const [selectedHero, setSelectedHero] = useState(null);

  if (!user) return null;

  // Level progress math
  const level = user.level || 1;
  const currentTotal = user.totalPoints || 0;
  const pointsCurrentLevel = Math.pow(level - 1, 2) * 25;
  const pointsNextLevel = Math.pow(level, 2) * 25;
  const levelPointsEarned = Math.max(0, currentTotal - pointsCurrentLevel);
  const levelPointsNeeded = pointsNextLevel - pointsCurrentLevel;
  const percent = Math.min(100, Math.round((levelPointsEarned / levelPointsNeeded) * 100));

  // Kingdom Rush Hero Champions
  const heroChampions = [
    {
      id: 'Paladin Knight',
      heroName: 'Sir Gerald Lightseeker',
      role: 'Holy Paladin Knight',
      avatar: '🛡️',
      quote: 'For honor and the King! None shall pass!',
      specialSkill: 'Shield of Retribution',
      desc: '+10% Point Multiplier on Compound Strength Lifts (Squats, Bench, Deadlifts)',
      stars: 5,
      color: 'border-amber-400 bg-amber-500/10 text-amber-300'
    },
    {
      id: 'Apex Strider',
      heroName: 'Alleria Swiftwind',
      role: 'Elven Ranger Huntress',
      avatar: '🏹',
      quote: 'Swift as the forest breeze. Bullseye!',
      specialSkill: 'Multishot Swiftstride',
      desc: '+10% Point Multiplier on Running & Sprint Cardio',
      stars: 5,
      color: 'border-emerald-400 bg-emerald-500/10 text-emerald-300'
    },
    {
      id: 'Juggernaut',
      heroName: 'Malik Hammerfury',
      role: 'Dwarven Anvil Berserker',
      avatar: '🔨',
      quote: 'Feel the hammer of raw dwarven justice!',
      specialSkill: 'Earthquake Smash',
      desc: '+15% Heavy Volume Multiplier on Raw Iron Lifting',
      stars: 5,
      color: 'border-rose-400 bg-rose-500/10 text-rose-300'
    },
    {
      id: 'Shinobi',
      heroName: 'Magnus Spellbane',
      role: 'Arcane Sorcerer & Acrobat',
      avatar: '🔮',
      quote: 'Gravity is merely an illusion to the arcane mind.',
      specialSkill: 'Arcane Telekinesis',
      desc: '+10% Point Multiplier on Bodyweight Calisthenics & Planks',
      stars: 4,
      color: 'border-violet-400 bg-violet-500/10 text-violet-300'
    },
    {
      id: 'Aquanaut',
      heroName: 'Catha Tidecaller',
      role: 'Merfolk Abyssal Guardian',
      avatar: '🔱',
      quote: 'The deep currents answer my call!',
      specialSkill: 'Abyssal Surge',
      desc: '+15% Point Multiplier on Swimming Cardio & Water Sports',
      stars: 5,
      color: 'border-cyan-400 bg-cyan-500/10 text-cyan-300'
    },
    {
      id: 'Vanguard',
      heroName: 'King Denas',
      role: 'Royal Commander of Linirea',
      avatar: '👑',
      quote: 'For the glory of the realm!',
      specialSkill: 'Royal Decrees',
      desc: '+10% Universal Multiplier across All Combined Disciplines',
      stars: 5,
      color: 'border-yellow-400 bg-yellow-500/10 text-yellow-300'
    }
  ];

  const milestoneMedals = [
    {
      id: 'Titan Lifter',
      name: 'Iron Bastion Medal',
      icon: '🛡️',
      tier: 'Legendary',
      desc: 'Achieved 20,000+ kg combined volume in compound weight training.',
      unlocked: user.badges?.includes('Titan Lifter') || user.badges?.includes('Iron Bastion')
    },
    {
      id: 'Sprinter Apex',
      name: 'Windwalker Sash',
      icon: '🏹',
      tier: 'Heroic',
      desc: 'Completed a sub-20 minute 5K or verified 10K outdoor run.',
      unlocked: user.badges?.includes('Sprinter Apex') || user.badges?.includes('Windwalker')
    },
    {
      id: 'Century Club',
      name: 'Order of the Centurion',
      icon: '🎖️',
      tier: 'Heroic',
      desc: 'Amassed over 1,000+ standardized points in the Royal Realm tournament.',
      unlocked: user.badges?.includes('Century Club')
    },
    {
      id: 'Gravity Defier',
      name: 'Gargoyle Defier',
      icon: '🧗‍♂️',
      tier: 'Rare',
      desc: 'Surpassed 50+ strict pull-ups and acrobatic calisthenics feats.',
      unlocked: user.badges?.includes('Gravity Defier')
    },
    {
      id: 'Dawn Patrol',
      name: 'Sunstone Vanguard',
      icon: '🌅',
      tier: 'Common',
      desc: 'Marched onto the training field before sunrise at 7:00 AM.',
      unlocked: user.badges?.includes('Dawn Patrol')
    }
  ];

  const handleSelectChampion = async (champ) => {
    await updateProfile({
      characterClass: champ.id,
      name: champ.heroName,
      avatar: champ.avatar
    });
  };

  return (
    <div className="space-y-6">
      {/* Hero Showcase Banner */}
      <div className="kr-wood-panel p-6 sm:p-7 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          {/* Hero Portrait & Info */}
          <div className="flex flex-col sm:flex-row items-center gap-5 text-center sm:text-left">
            <div className="relative flex-shrink-0">
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl bg-gradient-to-b from-[#382012] to-[#1A0E07] border border-amber-400/80 shadow-kr-gold flex items-center justify-center text-5xl shadow-xl relative overflow-hidden">
                <span>{user.avatar || '🛡️'}</span>
              </div>
              <div className="absolute -bottom-2 -right-2 px-2 py-0.5 rounded-full bg-amber-500 border border-amber-800 text-stone-900 font-bold text-[11px] shadow flex items-center gap-1">
                <Star className="w-3 h-3 fill-stone-900" />
                <span>Lvl {user.level || 1}</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-2xl sm:text-3xl font-extrabold text-amber-100">
                  {user.name}
                </h2>
              </div>
              <p className="text-xs text-amber-400 font-semibold uppercase tracking-wider mt-0.5">
                {user.characterClass} • {user.team}
              </p>
              <p className="text-xs text-amber-200/70 italic mt-1">
                "{user.quote || 'For honor, strength, and victory!'}"
              </p>

              {/* Level Progress XP Bar */}
              <div className="mt-3.5 w-full sm:w-72">
                <div className="flex justify-between text-xs font-semibold text-amber-200/80 mb-1">
                  <span>Level Progress (Lvl {level})</span>
                  <span className="font-mono text-amber-300 font-bold">
                    {Math.round(levelPointsEarned)} / {Math.round(levelPointsNeeded)} XP ({percent}%)
                  </span>
                </div>
                <div className="w-full h-3 rounded-full bg-[#140C07] p-0.5 border border-[#482813]">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-amber-300 transition-all duration-700"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Points Overview Cards */}
          <div className="grid grid-cols-2 gap-3 w-full sm:w-auto">
            <div className="p-3.5 sm:p-4 rounded-xl bg-[#1A1009] border border-[#452612] text-center">
              <div className="text-xs text-amber-300/80 font-semibold whitespace-nowrap">Total Points</div>
              <div className="text-xl sm:text-2xl font-extrabold text-amber-300 mt-0.5 whitespace-nowrap">
                {Math.round(user.totalPoints || 0).toLocaleString()} <span className="text-xs font-semibold text-amber-200/60">PTS</span>
              </div>
            </div>

            <div className="p-3.5 sm:p-4 rounded-xl bg-[#1A1009] border border-[#452612] text-center">
              <div className="text-xs text-amber-300/80 font-semibold whitespace-nowrap">Weekly Points</div>
              <div className="text-xl sm:text-2xl font-extrabold text-amber-300 mt-0.5 whitespace-nowrap">
                {Math.round(user.weeklyPoints || 0).toLocaleString()} <span className="text-xs font-semibold text-amber-200/60">PTS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Attributes Matrix & Hero Champion Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attribute Matrix Card */}
        <div className="kr-wood-panel p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-[#452612]">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-amber-100 flex items-center gap-2">
                <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                Character Attributes & Stats
              </h3>
              <p className="text-xs text-amber-200/60 mt-0.5">
                Dynamic balance from cardio, calisthenics, and volume
              </p>
            </div>
          </div>

          <StatRadarChart stats={user.stats} />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-3.5 border-t border-[#432512] text-center">
            <div className="p-2 rounded-lg bg-[#140C07] border border-[#3E2211]">
              <div className="text-xs text-amber-300/80 font-medium">⚔️ Strength</div>
              <div className="text-base font-extrabold text-amber-300">{user.stats?.strength || 10}</div>
            </div>
            <div className="p-2 rounded-lg bg-[#140C07] border border-[#3E2211]">
              <div className="text-xs text-emerald-300/80 font-medium">🏹 Endurance</div>
              <div className="text-base font-extrabold text-emerald-400">{user.stats?.endurance || 10}</div>
            </div>
            <div className="p-2 rounded-lg bg-[#140C07] border border-[#3E2211]">
              <div className="text-xs text-cyan-300/80 font-medium">⚡ Agility</div>
              <div className="text-base font-extrabold text-cyan-400">{user.stats?.agility || 10}</div>
            </div>
            <div className="p-2 rounded-lg bg-[#140C07] border border-[#3E2211]">
              <div className="text-xs text-amber-300/80 font-medium">🛡️ Stamina</div>
              <div className="text-base font-extrabold text-amber-300">{user.stats?.stamina || 10}</div>
            </div>
          </div>
        </div>

        {/* Hero Champion Roster & Class Skills */}
        <div className="kr-wood-panel p-5 sm:p-6">
          <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-[#452612]">
            <div>
              <h3 className="text-base sm:text-lg font-bold text-amber-100 flex items-center gap-2">
                <Swords className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
                Hero Champions & Archetypes
              </h3>
              <p className="text-xs text-amber-200/60 mt-0.5">
                Select your champion archetype to activate discipline affinity
              </p>
            </div>
          </div>

          <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
            {heroChampions.map(champ => {
              const isSelected = user.characterClass === champ.id || user.name === champ.heroName;
              return (
                <button
                  key={champ.heroName}
                  onClick={() => handleSelectChampion(champ)}
                  className={`w-full p-2.5 sm:p-3 rounded-xl border text-left flex items-start gap-3 transition-all ${
                    isSelected
                      ? 'border-amber-400/80 bg-gradient-to-r from-amber-950/60 to-[#2A160A] shadow-sm'
                      : 'border-[#3E2211] bg-[#160E08] hover:border-amber-600/50'
                  }`}
                >
                  <span className="text-2xl sm:text-3xl flex-shrink-0">{champ.avatar}</span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <span className="text-sm font-bold text-amber-100 truncate">
                        {champ.heroName}
                      </span>
                      {isSelected ? (
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-amber-400 text-stone-900 flex-shrink-0">
                          Active Hero
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-400/80 font-medium flex-shrink-0">Select</span>
                      )}
                    </div>
                    <div className="text-[11px] text-amber-400 font-medium">{champ.role} • Skill: {champ.specialSkill}</div>
                    <div className="text-[11px] text-amber-200/70 mt-0.5 leading-snug">{champ.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Badges & Achievements */}
      <div className="kr-wood-panel p-5 sm:p-6">
        <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-[#452612]">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-amber-100 flex items-center gap-2">
              <Award className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              Badges & Achievements
            </h3>
            <p className="text-xs text-amber-200/60 mt-0.5">
              Milestone badges earned through physical discipline, streaks, and raids
            </p>
          </div>
          <span className="text-xs font-semibold text-amber-400">
            {user.badges?.length || 0} / {milestoneMedals.length} Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {milestoneMedals.map(medal => (
            <div
              key={medal.id}
              className={`p-3.5 rounded-xl border transition-all ${
                medal.unlocked
                  ? 'border-amber-400/60 bg-gradient-to-b from-[#2E1B0E] to-[#1A0F08] shadow-sm'
                  : 'border-[#331C0E] bg-[#120D08]/60 opacity-40 grayscale'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#201309] border border-amber-500/40 flex items-center justify-center text-xl shadow-inner flex-shrink-0">
                  {medal.icon}
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-bold text-amber-100 flex items-center gap-1.5">
                    {medal.name}
                    {medal.unlocked && <CheckCircle className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                  <div className="text-[10px] uppercase font-semibold text-amber-400 mt-0.5">
                    {medal.tier} Badge
                  </div>
                  <p className="text-xs text-amber-200/70 mt-1 leading-snug">
                    {medal.desc}
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
