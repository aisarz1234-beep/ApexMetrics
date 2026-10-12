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
  Zap,
  Users,
  ShieldAlert,
  Flame
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

  // Listen for real-time raid damage & cheers
  useEffect(() => {
    if (latestEvent?.type === 'workout:new' || latestEvent?.type === 'raid:cheered') {
      fetchRaids();
      if (latestEvent.type === 'raid:cheered') {
        setCheerNotice(latestEvent.data.message);
        setTimeout(() => setCheerNotice(''), 4000);
      }
    }
  }, [latestEvent]);

  const raid = raids[0];
  if (!raid) return null;

  const hpPercent = Math.max(0, Math.min(100, Math.round((raid.currentHp / raid.totalHp) * 100)));

  const handleCheer = () => {
    if (socket && user) {
      socket.emit('raid:cheer', { user });
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 }
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <Swords className="w-6 h-6 text-rose-500" />
            Group Boss Raids
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold">
              Co-Op Event
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Unite across sports to hit massive cumulative point goals and defeat virtual world bosses
          </p>
        </div>

        <button
          onClick={handleCheer}
          className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center gap-2 transition-all shadow-glow-gold active:scale-95 self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Energize Squad ⚡</span>
        </button>
      </div>

      {cheerNotice && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-bold text-center animate-bounce-subtle">
          {cheerNotice}
        </div>
      )}

      {/* Epic Boss Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-slate-900 via-rose-950/20 to-slate-900 border border-rose-500/30 p-6 sm:p-8 shadow-glow-crimson">
        <div className="flex flex-col lg:flex-row items-center gap-8">
          {/* Boss Visual Avatar */}
          <div className="relative flex-shrink-0">
            <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-3xl bg-gradient-to-br from-rose-600/30 via-slate-800 to-amber-600/20 border-2 border-rose-500/40 flex items-center justify-center text-6xl sm:text-7xl shadow-2xl relative overflow-hidden group">
              <span className="transform group-hover:scale-110 transition-transform duration-300">
                👹
              </span>
              <div className="absolute inset-0 bg-gradient-to-t from-rose-950/80 via-transparent to-transparent" />
            </div>
            <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-rose-600 text-white font-black text-xs shadow-lg uppercase tracking-wider">
              Raid Boss
            </div>
          </div>

          {/* Boss Stats & HP Bar */}
          <div className="flex-1 w-full space-y-4">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-2xl sm:text-3xl font-black text-white">{raid.bossName}</h3>
                <div className="flex items-center gap-1.5 text-xs text-rose-400 font-bold bg-rose-500/10 px-3 py-1 rounded-lg border border-rose-500/20">
                  <Timer className="w-3.5 h-3.5" />
                  <span>3 Days Remaining</span>
                </div>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {raid.description}
              </p>
            </div>

            {/* Boss HP Gauge */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold">
                <span className="text-slate-400 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500" />
                  Boss Health Pool
                </span>
                <span className="text-rose-400 font-mono">
                  {raid.currentHp.toLocaleString()} / {raid.totalHp.toLocaleString()} HP ({hpPercent}%)
                </span>
              </div>
              <div className="w-full h-5 rounded-full bg-slate-800 p-0.5 border border-slate-700">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-rose-600 via-red-500 to-amber-500 transition-all duration-700 shadow-glow-crimson"
                  style={{ width: `${hpPercent}%` }}
                />
              </div>
            </div>

            {/* Raid Rewards Preview & Attack Button */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-800/80 border border-slate-700 text-xs">
                  <Award className="w-4 h-4 text-amber-400" />
                  <div>
                    <div className="text-[10px] text-slate-400 font-semibold">Defeat Reward</div>
                    <div className="font-bold text-white">{raid.rewardBadge} (+{raid.rewardXp} XP)</div>
                  </div>
                </div>
              </div>

              <button
                onClick={onOpenLogModal}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-amber-600 hover:from-rose-500 hover:to-amber-500 text-white font-extrabold text-sm shadow-glow-crimson transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
              >
                <Flame className="w-4 h-4" />
                <span>Log Workout to Deal Damage!</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Top Damagers MVP Leaderboard */}
      <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800">
        <h4 className="text-sm font-extrabold text-white uppercase tracking-wider mb-4 flex items-center gap-2">
          <Users className="w-4 h-4 text-cyan-400" />
          Raid Squad Contributions (Top Damagers)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {raid.topDamagers?.map((dmg, idx) => (
            <div
              key={dmg.userId}
              className="p-3 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-slate-800 flex items-center justify-center font-black text-xs text-amber-400 border border-slate-700">
                  #{idx + 1}
                </div>
                <div>
                  <div className="text-xs font-bold text-white">{dmg.userName}</div>
                  <div className="text-[10px] text-slate-400">Raid Striker</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono font-black text-rose-400">
                  {dmg.damage.toLocaleString()}
                </div>
                <div className="text-[10px] text-slate-500 font-bold uppercase">DMG</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
