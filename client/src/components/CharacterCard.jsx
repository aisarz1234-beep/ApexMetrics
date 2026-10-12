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
      quote: 'The roaring ocean tides answer my call!',
      specialSkill: 'Tidal Maelstrom',
      desc: '+15% Point Multiplier on Swimming Cardio Load',
      stars: 5,
      color: 'border-cyan-400 bg-cyan-500/10 text-cyan-300'
    },
    {
      id: 'Vanguard',
      heroName: 'King Denas',
      role: 'High Sovereign of Linirea',
      avatar: '👑',
      quote: 'My kingdom shall never fall! Charge, champions!',
      specialSkill: 'Royal Decrees of Valor',
      desc: '+5% Balanced Multiplier across all athletic disciplines',
      stars: 5,
      color: 'border-amber-300 bg-amber-400/15 text-amber-200'
    }
  ];

  // Kingdom Rush Campaign Medals & Badges
  const milestoneMedals = [
    {
      id: 'Veznan Slayer',
      name: "Bane of Vez'nan",
      icon: '☠️',
      tier: 'Legendary',
      desc: "Dealt crushing blows to the dark wizard Vez'nan in the co-op raid boss battle.",
      unlocked: user.badges?.includes('Veznan Slayer') || user.badges?.includes('Titan Slayer')
    },
    {
      id: 'Iron Bastion',
      name: 'Iron Bastion',
      icon: '🛡️',
      tier: 'Epic',
      desc: 'Mastered heavy barbell compound volume until your armor hardened into steel.',
      unlocked: user.badges?.includes('Iron Bastion') || user.badges?.includes('Iron Disciple')
    },
    {
      id: 'Waterlogged',
      name: 'Abyssal Trident',
      icon: '🌊',
      tier: 'Rare',
      desc: 'Braved the perilous depths in heavy distance swimming sessions.',
      unlocked: user.badges?.includes('Waterlogged')
    },
    {
      id: 'Gravity Defier',
      name: 'Gravity Defier',
      icon: '🧗‍♂️',
      tier: 'Rare',
      desc: 'Surpassed 50+ strict pull-ups and acrobatic calisthenics feats.',
      unlocked: user.badges?.includes('Gravity Defier')
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
      <div className="kr-wood-panel p-6 sm:p-8 relative overflow-hidden border-4 border-[#78350F]">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-6 relative z-10">
          {/* Hero Portrait & Info */}
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="relative">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl bg-gradient-to-b from-[#452815] to-[#1F1208] border-4 border-amber-400 shadow-kr-gold flex items-center justify-center text-6xl shadow-2xl relative overflow-hidden">
                <span>{user.avatar || '🛡️'}</span>
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
              </div>
              <div className="absolute -bottom-2 -right-2 px-2.5 py-1 rounded-full bg-amber-500 border-2 border-amber-800 text-stone-900 font-black text-xs shadow-lg flex items-center gap-1">
                <Star className="w-3 h-3 fill-stone-900" />
                <span>Level {user.level || 1}</span>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2">
                <h2 className="text-3xl sm:text-4xl font-black text-amber-200 drop-shadow">
                  {user.name}
                </h2>
              </div>
              <p className="text-xs text-amber-400 font-bold uppercase tracking-wider mt-0.5">
                {user.characterClass} • {user.team}
              </p>
              <p className="text-xs text-amber-100/90 italic mt-1.5">
                "{user.quote || 'For honor, strength, and victory!'}"
              </p>

              {/* Level Progress XP Bar */}
              <div className="mt-4 w-full sm:w-80">
                <div className="flex justify-between text-xs font-bold text-amber-200 mb-1">
                  <span>Level Progression (Lvl {level})</span>
                  <span className="font-mono text-amber-400 font-bold">
                    {Math.round(levelPointsEarned)} / {Math.round(levelPointsNeeded)} XP ({percent}%)
                  </span>
                </div>
                <div className="w-full h-4 rounded-full bg-[#180D06] p-0.5 border-2 border-[#78350F] shadow-inner">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 shadow-kr-gold transition-all duration-700"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Points Overview Cards */}
          <div className="grid grid-cols-2 gap-3 w-full sm:w-auto">
            <div className="p-4 rounded-xl bg-[#241409] border-2 border-[#5C3317] text-center shadow-md">
              <div className="text-xs text-amber-300 font-bold whitespace-nowrap">Total Points</div>
              <div className="text-2xl font-black text-amber-400 mt-1 whitespace-nowrap">
                {Math.round(user.totalPoints || 0).toLocaleString()} <span className="text-xs font-bold text-amber-200/70">PTS</span>
              </div>
            </div>

            <div className="p-4 rounded-xl bg-[#241409] border-2 border-[#5C3317] text-center shadow-md">
              <div className="text-xs text-amber-300 font-bold whitespace-nowrap">Weekly Points</div>
              <div className="text-2xl font-black text-amber-300 mt-1 whitespace-nowrap">
                {Math.round(user.weeklyPoints || 0).toLocaleString()} <span className="text-xs font-bold text-amber-200/70">PTS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Hero Attributes Matrix & Hero Champion Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attribute Matrix Card */}
        <div className="kr-stone-card p-6 border-3 border-[#5C3317]">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#5C3317]">
            <div>
              <h3 className="text-xl font-black text-amber-200 flex items-center gap-2">
                <Shield className="w-5 h-5 text-amber-400" />
                Character Attributes & Stats
              </h3>
              <p className="text-xs text-amber-100/70">
                Calculated dynamically from cardio distance, calisthenics reps, and volume
              </p>
            </div>
          </div>

          <StatRadarChart stats={user.stats} />

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4 pt-4 border-t border-[#5C3317] text-center">
            <div className="p-2 rounded-lg bg-[#140E0A] border border-[#5C3317]">
              <div className="text-xs text-amber-300 font-bold">⚔️ Strength</div>
              <div className="text-lg font-black text-amber-400">{user.stats?.strength || 10}</div>
            </div>
            <div className="p-2 rounded-lg bg-[#140E0A] border border-[#5C3317]">
              <div className="text-xs text-amber-300 font-bold">🏹 Endurance</div>
              <div className="text-lg font-black text-emerald-400">{user.stats?.endurance || 10}</div>
            </div>
            <div className="p-2 rounded-lg bg-[#140E0A] border border-[#5C3317]">
              <div className="text-xs text-amber-300 font-bold">⚡ Agility</div>
              <div className="text-lg font-black text-cyan-400">{user.stats?.agility || 10}</div>
            </div>
            <div className="p-2 rounded-lg bg-[#140E0A] border border-[#5C3317]">
              <div className="text-xs text-amber-300 font-bold">🛡️ Stamina</div>
              <div className="text-lg font-black text-amber-300">{user.stats?.stamina || 10}</div>
            </div>
          </div>
        </div>

        {/* Hero Champion Roster & Class Skills */}
        <div className="kr-wood-panel p-6 border-3 border-[#5C3317]">
          <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#5C3317]">
            <div>
              <h3 className="text-xl font-black text-amber-200 flex items-center gap-2">
                <Swords className="w-5 h-5 text-amber-400" />
                Hero Champions & Archetypes
              </h3>
              <p className="text-xs text-amber-100/70">
                Select your champion archetype to activate discipline affinity multipliers
              </p>
            </div>
          </div>

          <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
            {heroChampions.map(champ => {
              const isSelected = user.characterClass === champ.id || user.name === champ.heroName;
              return (
                <button
                  key={champ.heroName}
                  onClick={() => handleSelectChampion(champ)}
                  className={`w-full p-3 rounded-xl border-2 text-left flex items-start gap-3 transition-all ${
                    isSelected
                      ? 'border-amber-400 bg-gradient-to-r from-amber-950/60 to-[#2A160A] shadow-kr-gold'
                      : 'border-[#5C3317] bg-[#1A0E06]/80 hover:border-amber-600'
                  }`}
                >
                  <span className="text-3xl">{champ.avatar}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-black text-amber-200">
                        {champ.heroName}
                      </span>
                      {isSelected ? (
                        <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-400 text-stone-900">
                          Active Hero
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-400 font-bold">Select</span>
                      )}
                    </div>
                    <div className="text-[11px] text-amber-400 font-bold">{champ.role} • Skill: {champ.specialSkill}</div>
                    <div className="text-[11px] text-amber-100/80 mt-0.5 leading-snug">{champ.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Badges & Achievements */}
      <div className="kr-stone-card p-6 border-3 border-[#5C3317]">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#5C3317]">
          <div>
            <h3 className="text-xl font-black text-amber-200 flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" />
              Badges & Achievements
            </h3>
            <p className="text-xs text-amber-100/70">
              Milestone badges earned through physical discipline, streaks, and raids
            </p>
          </div>
          <span className="text-sm font-black text-amber-400">
            {user.badges?.length || 0} / {milestoneMedals.length} Badges Unlocked
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {milestoneMedals.map(medal => (
            <div
              key={medal.id}
              className={`p-4 rounded-xl border-2 transition-all ${
                medal.unlocked
                  ? 'border-amber-400/70 bg-gradient-to-b from-[#382012] to-[#1F1208] shadow-kr-gold'
                  : 'border-[#3D2515] bg-[#120D08]/60 opacity-40 grayscale'
              }`}
            >
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#25150A] border-2 border-amber-500/40 flex items-center justify-center text-2xl shadow-inner flex-shrink-0">
                  {medal.icon}
                </div>
                <div>
                  <div className="text-sm font-black text-amber-200 flex items-center gap-1.5">
                    {medal.name}
                    {medal.unlocked && <CheckCircle className="w-3.5 h-3.5 text-amber-400" />}
                  </div>
                  <div className="text-[10px] uppercase font-bold text-amber-400 mt-0.5">
                    {medal.tier} Badge
                  </div>
                  <p className="text-xs text-amber-100/80 mt-1 leading-snug">
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
