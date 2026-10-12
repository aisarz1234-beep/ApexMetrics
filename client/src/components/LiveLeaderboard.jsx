import React, { useState, useEffect } from 'react';
import { api } from '../utils/api.js';
import { useSocket } from '../context/SocketContext.jsx';
import {
  Trophy,
  Flame,
  Crown,
  Users,
  Building2,
  Calendar,
  Sparkles,
  Shield,
  Star
} from 'lucide-react';

export const LiveLeaderboard = () => {
  const { latestEvent } = useSocket();
  const [timeframe, setTimeframe] = useState('weekly');
  const [campus, setCampus] = useState('all');
  const [team, setTeam] = useState('all');
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await api.getLeaderboard({ timeframe, campus, team });
      setLeaderboard(res.leaderboard || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
  }, [timeframe, campus, team]);

  useEffect(() => {
    if (latestEvent?.type === 'leaderboard:update' || latestEvent?.type === 'workout:new') {
      fetchLeaderboard();
    }
  }, [latestEvent]);

  return (
    <div className="space-y-6">
      {/* Header & Description */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-amber-400 to-amber-600 border-2 border-amber-800 flex items-center justify-center text-stone-900 shadow-kr-gold">
              <Trophy className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-amber-200 tracking-tight flex items-center gap-2">
                Unified Dynamic Leaderboards
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500 animate-pulse">
                  ⚡ Live ZSET
                </span>
              </h2>
              <p className="text-xs text-amber-100/70">
                Fair multi-discipline normalized rankings computed with Redis Sorted Sets in real-time
              </p>
            </div>
          </div>
        </div>

        {/* Timeframe Filter Buttons (Clean Wording) */}
        <div className="flex items-center p-1.5 rounded-xl bg-[#241409] border-2 border-[#5C3317] self-start md:self-auto">
          {[
            { id: 'daily', label: 'Daily' },
            { id: 'weekly', label: 'Weekly' },
            { id: 'allTime', label: 'All-Time' }
          ].map(tf => (
            <button
              key={tf.id}
              onClick={() => setTimeframe(tf.id)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeframe === tf.id
                  ? 'kr-btn-gold text-stone-900 shadow-kr-gold'
                  : 'text-amber-200/70 hover:text-amber-100'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stronghold & Faction Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#241409] border-2 border-[#5C3317]">
          <Building2 className="w-4 h-4 text-amber-400 ml-1" />
          <span className="text-xs font-bold text-amber-300">Campus / Stronghold:</span>
          <select
            value={campus}
            onChange={e => setCampus(e.target.value)}
            className="flex-1 bg-[#382012] text-amber-100 text-xs font-bold rounded-lg px-2.5 py-1.5 border border-[#78350F] focus:outline-none"
          >
            <option value="all">Global (All Strongholds)</option>
            <option value="Royal Citadel Barracks">Royal Citadel Barracks</option>
            <option value="Whispering Woods">Whispering Woods</option>
            <option value="Ironkeep Forge">Ironkeep Forge</option>
            <option value="Stormcloud Spire">Stormcloud Spire</option>
            <option value="Sunken Lagoon">Sunken Lagoon</option>
          </select>
        </div>

        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#241409] border-2 border-[#5C3317]">
          <Users className="w-4 h-4 text-amber-400 ml-1" />
          <span className="text-xs font-bold text-amber-300">Faction / Team:</span>
          <select
            value={team}
            onChange={e => setTeam(e.target.value)}
            className="flex-1 bg-[#382012] text-amber-100 text-xs font-bold rounded-lg px-2.5 py-1.5 border border-[#78350F] focus:outline-none"
          >
            <option value="all">All Factions</option>
            <option value="Royal Knights of Linirea">Royal Knights of Linirea 🛡️</option>
            <option value="Crimson Ironfist Clan">Crimson Ironfist Clan ⚔️</option>
            <option value="Emerald Sentinels">Emerald Sentinels 🏹</option>
          </select>
        </div>
      </div>

      {/* Champions Standings Cards */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-12 text-center text-amber-300 text-base font-bold">
            Fetching latest athlete standings...
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="py-12 text-center text-amber-300/80 text-base font-bold">
            No workouts logged yet for this filter. Be the first to log!
          </div>
        ) : (
          leaderboard.map(athlete => {
            const isTop1 = athlete.rank === 1;
            const isTop2 = athlete.rank === 2;
            const isTop3 = athlete.rank === 3;

            return (
              <div
                key={athlete.userId}
                className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                  isTop1
                    ? 'bg-gradient-to-r from-[#4A2C11] via-[#2D1B0B] to-[#1E1106] border-amber-400 shadow-kr-gold'
                    : isTop2
                    ? 'bg-gradient-to-r from-[#31251E] via-[#221A15] to-[#18110D] border-slate-400'
                    : isTop3
                    ? 'bg-gradient-to-r from-[#3A2215] via-[#24140A] to-[#190C05] border-amber-700'
                    : 'bg-[#241409] border-[#4A2810] hover:border-[#6B3A18]'
                }`}
              >
                {/* Rank & Profile */}
                <div className="flex items-center gap-4">
                  {/* Rank Crown / Badge */}
                  <div className="w-10 h-10 flex items-center justify-center font-black text-xl">
                    {isTop1 ? (
                      <span className="text-amber-400 drop-shadow flex items-center gap-0.5">
                        <Crown className="w-7 h-7 fill-amber-400 text-amber-500 animate-bounce-subtle" />
                      </span>
                    ) : isTop2 ? (
                      <span className="text-slate-300 font-black">#2</span>
                    ) : isTop3 ? (
                      <span className="text-amber-600 font-black">#3</span>
                    ) : (
                      <span className="text-amber-200/60 font-bold text-sm">#{athlete.rank}</span>
                    )}
                  </div>

                  {/* Hero Avatar */}
                  <div className="w-12 h-12 rounded-xl bg-[#382012] border-2 border-amber-500/60 flex items-center justify-center text-2xl shadow-inner">
                    {athlete.avatar || '🛡️'}
                  </div>

                  {/* Champion Info */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-amber-100 text-base leading-none">
                        {athlete.name}
                      </span>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-[#382012] text-amber-300 border border-amber-600">
                        Level {athlete.level}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-amber-200/80 mt-1 font-medium">
                      <span className="font-bold text-amber-400">{athlete.characterClass}</span>
                      <span>•</span>
                      <span>{athlete.campus}</span>
                      <span>•</span>
                      <span className="font-bold text-amber-300">{athlete.team}</span>
                    </div>
                  </div>
                </div>

                {/* Score & Streak */}
                <div className="text-right flex items-center gap-5">
                  <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/30">
                    <Flame className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <span>{athlete.streakDays || 1}d Streak</span>
                  </div>

                  <div>
                    <div className="text-[10px] text-amber-300/80 font-bold uppercase tracking-wider">
                      Points
                    </div>
                    <div className="text-2xl font-black text-amber-300 tracking-tight">
                      {athlete.score.toLocaleString()}{' '}
                      <span className="text-xs font-bold text-amber-200/70">PTS</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
