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
          <h2 className="text-3xl font-black text-amber-200 tracking-tight flex items-center gap-2">
            <Swords className="w-7 h-7 text-red-500" />
            Co-Op World Boss Raid
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-red-950/80 text-amber-300 border border-red-600 font-bold uppercase">
              Vez'nan's Wrath
            </span>
          </h2>
          <p className="text-xs text-amber-100/70">
            Unite athletic workouts across running, swimming, calisthenics, and lifting to defeat the raid boss!
          </p>
        </div>

        <button
          onClick={handleCheer}
          className="kr-btn-gold px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 self-start sm:self-auto shadow-kr-button"
        >
          <Sparkles className="w-4 h-4" />
          <span>Energize Squad ⚡</span>
        </button>
      </div>

      {cheerNotice && (
        <div className="p-3 rounded-xl bg-red-950 border-2 border-amber-500 text-amber-200 text-sm font-bold text-center animate-bounce-subtle shadow-kr-gold">
          {cheerNotice}
        </div>
      )}

      {/* Boss Encounter Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-b from-[#2B1108] via-[#1A0A05] to-[#120703] border-4 border-red-800 p-6 sm:p-8 shadow-kr-crimson">
        <div className="flex flex-col lg:flex-row items-center gap-8 relative z-10">
          {/* Boss Portrait */}
          <div className="relative flex-shrink-0">
            <div className="w-40 h-40 sm:w-48 sm:h-48 rounded-3xl bg-gradient-to-br from-purple-950 via-[#3B0E05] to-red-950 border-4 border-amber-500/80 flex items-center justify-center text-7xl sm:text-8xl shadow-2xl relative overflow-hidden group">
              <span className="transform group-hover:scale-110 transition-transform duration-300">
                🧙‍♂️
              </span>
              <div className="absolute inset-0 bg-gradient-to-t from-red-950/90 via-transparent to-transparent pointer-events-none" />
            </div>
            <div className="absolute -bottom-2 -right-2 px-3 py-1 rounded-full bg-red-700 border-2 border-amber-400 text-amber-100 font-black text-xs shadow-lg uppercase tracking-wider flex items-center gap-1">
              <Skull className="w-3.5 h-3.5" />
              <span>Final Boss</span>
            </div>
          </div>

          {/* Boss Stats & HP Gauge */}
          <div className="flex-1 w-full space-y-4">
            <div>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h3 className="text-3xl sm:text-4xl font-black text-amber-200">
                    {raid.bossName || "Vez'nan the Dark Wizard"}
                  </h3>
                  <div className="text-xs text-red-400 font-bold tracking-wider mt-0.5">
                    {raid.bossTitle || 'Master of the Nether Golem'}
                  </div>
                </div>

                <div className="flex items-center gap-1.5 text-xs text-amber-200 font-bold bg-[#38160B] px-3 py-1.5 rounded-xl border border-red-600">
                  <Timer className="w-4 h-4 text-amber-400" />
                  <span>Raid Ends in 3 Days</span>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-amber-100/90 mt-2 leading-relaxed italic">
                "{raid.bossQuote || 'You cannot stop the inevitable, mortal fools!'}" — {raid.description}
              </p>
            </div>

            {/* Boss HP Bar */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs font-black">
                <span className="text-amber-200 flex items-center gap-1.5 text-sm">
                  <Heart className="w-4 h-4 fill-red-500 text-red-500" />
                  Nether Golem Health Pool
                </span>
                <span className="text-red-400 font-mono text-sm">
                  {raid.currentHp.toLocaleString()} / {raid.totalHp.toLocaleString()} HP ({hpPercent}%)
                </span>
              </div>
              <div className="w-full h-6 rounded-full bg-[#180A04] p-1 border-2 border-amber-600 shadow-inner">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-red-700 via-red-500 to-amber-500 shadow-kr-crimson transition-all duration-700 relative overflow-hidden"
                  style={{ width: `${hpPercent}%` }}
                >
                  <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.15)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.15)_50%,rgba(255,255,255,0.15)_75%,transparent_75%,transparent)] bg-[size:1rem_1rem] animate-pulse" />
                </div>
              </div>
            </div>

            {/* Victory Spoils & Attack CTA */}
            <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
              <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#2A1006] border-2 border-[#682410] text-xs">
                <Award className="w-5 h-5 text-amber-400" />
                <div>
                  <div className="text-[10px] text-amber-300 font-bold">Victory Spoils</div>
                  <div className="font-black text-amber-100 text-sm">{raid.rewardBadge} (+{raid.rewardXp} XP & ⭐⭐⭐)</div>
                </div>
              </div>

              <button
                onClick={onOpenLogModal}
                className="kr-btn-crimson px-5 py-2.5 rounded-xl text-sm font-black flex items-center gap-2 shadow-kr-button"
              >
                <Flame className="w-4 h-4" />
                <span>Log Workout to Strike Boss! ⚡</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Top Contributors */}
      <div className="kr-stone-card p-6 border-3 border-[#5C3317]">
        <h4 className="text-xl font-black text-amber-200 mb-4 flex items-center gap-2">
          <Users className="w-5 h-5 text-amber-400" />
          Raid Strike Contributions (Top Damage Athletes)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {raid.topDamagers?.map((dmg, idx) => (
            <div
              key={dmg.userId}
              className="p-3.5 rounded-xl bg-[#241409] border-2 border-[#5C3317] flex items-center justify-between shadow-md"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#382012] border border-amber-500/50 flex items-center justify-center font-black text-sm text-amber-300">
                  #{idx + 1}
                </div>
                <div>
                  <div className="font-bold text-xs text-amber-100">{dmg.userName}</div>
                  <div className="text-[10px] text-amber-400/80 font-bold">Raid Contributor</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-mono font-black text-red-400">
                  {dmg.damage.toLocaleString()}
                </div>
                <div className="text-[9px] text-amber-300 font-bold uppercase">DMG</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
