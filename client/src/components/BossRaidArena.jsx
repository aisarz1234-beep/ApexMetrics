import React, { useState, useEffect } from 'react';
import { api } from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useSocket } from '../context/SocketContext.jsx';
import {
  Swords,
  Heart,
  Timer,
  Award,
  Sparkles,
  Flame,
  Users,
  Shield,
  Skull,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const BossRaidArena = ({ onOpenLogModal }) => {
  const { user } = useAuth();
  const { socket, latestEvent } = useSocket();
  const [raids, setRaids] = useState([]);
  const [cheerNotice, setCheerNotice] = useState('');

  const fetchRaids = async () => {
    try {
      const res = await api.getRaids();
      setRaids(res.raids || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchRaids();
  }, []);

  useEffect(() => {
    if (latestEvent?.type === 'workout:new' || latestEvent?.type === 'raid:cheered') {
      fetchRaids();
      if (latestEvent.type === 'raid:cheered') {
        setCheerNotice(latestEvent.data.message);
        setTimeout(() => setCheerNotice(''), 4500);
      }
    }
  }, [latestEvent]);

  const raid = raids[0];
  if (!raid) return null;

  const hpPercent = Math.max(0, Math.min(100, Math.round((raid.currentHp / raid.totalHp) * 100)));

  const handleCheer = () => {
    if (socket && user) {
      socket.emit('raid:cheer', {
        user,
        message: `${user?.name} rallied the Royal Vanguard! "Rain of Fire upon the enemy!" ☄️`
      });
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Boss Raid Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-amber-100 tracking-tight flex items-center gap-2">
            <Swords className="w-6 h-6 text-red-500" />
            Co-Op World Boss Raid
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-red-950/80 text-amber-300 border border-red-600/60 font-semibold uppercase">
              Vez'nan's Wrath
            </span>
          </h2>
          <p className="text-xs text-amber-200/60 mt-0.5">
            Unite athletic workouts across running, swimming, calisthenics, and lifting to defeat the raid boss!
          </p>
        </div>

        <button
          onClick={handleCheer}
          className="kr-btn-gold px-3.5 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 self-start sm:self-auto shadow-sm"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>Energize Squad ⚡</span>
        </button>
      </div>

      {cheerNotice && (
        <div className="p-3 rounded-xl bg-red-950/80 border border-amber-500/60 text-amber-200 text-xs font-semibold text-center animate-bounce-subtle">
          {cheerNotice}
        </div>
      )}

      {/* Boss Encounter Card */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#251008] via-[#1A0A05] to-[#120703] border border-red-700/50 p-6 sm:p-7 shadow-xl">
        <div className="flex flex-col lg:flex-row items-center gap-6 sm:gap-8 relative z-10">
          {/* Boss Portrait */}
          <div className="relative flex-shrink-0">
            <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl bg-gradient-to-br from-purple-950/80 via-[#3B0E05] to-red-950/80 border border-amber-500/60 flex items-center justify-center text-6xl sm:text-7xl shadow-xl relative overflow-hidden group">
              <span className="transform group-hover:scale-105 transition-transform duration-300">
                🧙‍♂️
              </span>
            </div>
            <div className="absolute -bottom-2 -right-2 px-2.5 py-0.5 rounded-full bg-red-700 border border-amber-400 text-amber-100 font-bold text-[10px] shadow uppercase tracking-wider flex items-center gap-1">
              <Skull className="w-3 h-3" />
              <span>World Boss</span>
            </div>
          </div>

          {/* Boss Stats & HP Gauge */}
          <div className="flex-1 w-full space-y-3.5">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold text-amber-100">
                    {raid.bossName || "Vez'nan the Dark Wizard"}
                  </h3>
                  <div className="text-xs text-red-400 font-semibold tracking-wide mt-0.5">
                    {raid.bossTitle || 'Master of the Nether Golem'}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-amber-200 font-medium bg-[#32140A] px-2.5 py-1 rounded-lg border border-red-700/60">
                  <Timer className="w-3.5 h-3.5 text-amber-400" />
                  <span>Raid Ends in 3 Days</span>
                </div>
              </div>

              <p className="text-xs text-amber-200/70 mt-1.5 leading-relaxed italic">
                "{raid.bossQuote || 'You cannot stop the inevitable, mortal fools!'}" — {raid.description}
              </p>
            </div>

            {/* Boss HP Bar */}
            <div className="space-y-1">
              <div className="flex justify-between items-center text-xs font-semibold">
                <span className="text-amber-200 flex items-center gap-1.5">
                  <Heart className="w-3.5 h-3.5 fill-red-500 text-red-500" />
                  Nether Golem Health Pool
                </span>
                <span className="text-red-400 font-mono">
                  {raid.currentHp.toLocaleString()} / {raid.totalHp.toLocaleString()} HP ({hpPercent}%)
                </span>
              </div>
              <div className="w-full h-4 rounded-full bg-[#180A04] p-0.5 border border-red-700/60 shadow-inner">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-red-700 via-red-500 to-amber-500 transition-all duration-700"
                  style={{ width: `${hpPercent}%` }}
                />
              </div>
            </div>

            {/* Victory Spoils & Attack CTA */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#220E06] border border-[#521C0E] text-xs">
                <Award className="w-4 h-4 text-amber-400" />
                <div>
                  <div className="text-[10px] text-amber-300 font-medium">Victory Spoils</div>
                  <div className="font-bold text-amber-100 text-xs">{raid.rewardBadge} (+{raid.rewardXp} XP & ⭐⭐⭐)</div>
                </div>
              </div>

              <button
                onClick={onOpenLogModal}
                className="kr-btn-crimson px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm"
              >
                <Flame className="w-4 h-4" />
                <span>Log Workout to Strike Boss! ⚡</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Top Contributors */}
      <div className="kr-wood-panel p-5 sm:p-6">
        <h4 className="text-base sm:text-lg font-bold text-amber-100 mb-3.5 flex items-center gap-2">
          <Users className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
          Raid Strike Contributions (Top Damage Athletes)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {raid.topDamagers?.map((dmg, idx) => (
            <div
              key={dmg.userId}
              className="p-3 rounded-xl bg-[#180E08] border border-[#3E2211] flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-[#24140B] border border-amber-500/40 flex items-center justify-center font-bold text-xs text-amber-300">
                  #{idx + 1}
                </div>
                <div>
                  <div className="font-bold text-xs text-amber-100">{dmg.userName}</div>
                  <div className="text-[10px] text-amber-400/70 font-medium">Raid Contributor</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono font-bold text-red-400">
                  {dmg.damage.toLocaleString()}
                </div>
                <div className="text-[9px] text-amber-300/70 font-semibold uppercase">DMG</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
