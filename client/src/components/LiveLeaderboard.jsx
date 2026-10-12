import React, { useState, useEffect } from 'react';
import { api } from '../utils/api.js';
import { useSocket } from '../context/SocketContext.jsx';
import {
  Trophy,
  Flame,
  Medal,
  Crown,
  Users,
  Building2,
  Calendar,
  Sparkles,
  ArrowUpRight,
  Shield
} from 'lucide-react';

export const LiveLeaderboard = () => {
  const { latestEvent } = useSocket();
  const [timeframe, setTimeframe] = useState('weekly'); // 'daily' | 'weekly' | 'allTime'
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

  // Real-time leaderboard updates from WebSockets
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
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
                Unified Dynamic Leaderboards
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 animate-pulse">
                  ⚡ Live ZSET
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Fair multi-discipline normalized rankings computed with Redis Sorted Sets in real-time
              </p>
            </div>
          </div>
        </div>

        {/* Timeframe Filter Buttons */}
        <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800 self-start md:self-auto">
          {[
            { id: 'daily', label: 'Daily' },
            { id: 'weekly', label: 'Weekly' },
            { id: 'allTime', label: 'All-Time' }
          ].map(tf => (
            <button
              key={tf.id}
              onClick={() => setTimeframe(tf.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                timeframe === tf.id
                  ? 'bg-cyan-500 text-black shadow-glow-cyan'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Secondary Scope Filters: Campus & Team */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
          <Building2 className="w-4 h-4 text-slate-400 ml-1" />
          <span className="text-xs font-semibold text-slate-400">Campus:</span>
          <select
            value={campus}
            onChange={e => setCampus(e.target.value)}
            className="flex-1 bg-slate-800 text-white text-xs font-medium rounded-lg px-2 py-1 border border-slate-700 focus:outline-none"
          >
            <option value="all">Global (All Campuses)</option>
            <option value="Engineering Quad">Engineering Quad</option>
            <option value="Main Gym">Main Gym</option>
            <option value="Aquatic Center">Olympic Aquatic Center</option>
            <option value="North Oval">North Oval</option>
            <option value="Downtown Campus">Downtown Campus</option>
          </select>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-xl bg-slate-900/60 border border-slate-800">
          <Users className="w-4 h-4 text-slate-400 ml-1" />
          <span className="text-xs font-semibold text-slate-400">Faction / Team:</span>
          <select
            value={team}
            onChange={e => setTeam(e.target.value)}
            className="flex-1 bg-slate-800 text-white text-xs font-medium rounded-lg px-2 py-1 border border-slate-700 focus:outline-none"
          >
            <option value="all">All Factions</option>
            <option value="Crimson Lions">Crimson Lions</option>
            <option value="Cobalt Titans">Cobalt Titans</option>
            <option value="Emerald Vipers">Emerald Vipers</option>
          </select>
        </div>
      </div>

      {/* Leaderboard Table / Cards */}
      <div className="space-y-3">
        {loading ? (
          <div className="py-12 text-center text-slate-500 font-medium">
            Fetching latest athlete standings...
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="py-12 text-center text-slate-500 font-medium">
            No workouts logged yet for this filter filter. Be the first to log!
          </div>
        ) : (
          leaderboard.map(athlete => {
            const isTop1 = athlete.rank === 1;
            const isTop2 = athlete.rank === 2;
            const isTop3 = athlete.rank === 3;

            return (
              <div
                key={athlete.userId}
                className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${
                  isTop1
                    ? 'bg-gradient-to-r from-amber-950/30 via-slate-900 to-slate-900 border-amber-500/40 shadow-glow-gold'
                    : isTop2
                    ? 'bg-gradient-to-r from-slate-800/40 via-slate-900 to-slate-900 border-slate-600'
                    : isTop3
                    ? 'bg-gradient-to-r from-amber-900/20 via-slate-900 to-slate-900 border-amber-700/30'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                {/* Rank & Profile */}
                <div className="flex items-center gap-4">
                  {/* Rank Badge */}
                  <div className="w-9 h-9 flex items-center justify-center font-black text-lg">
                    {isTop1 ? (
                      <span className="text-amber-400 drop-shadow flex items-center gap-0.5">
                        <Crown className="w-6 h-6 fill-amber-400" />
                      </span>
                    ) : isTop2 ? (
                      <span className="text-slate-300 font-black">#2</span>
                    ) : isTop3 ? (
                      <span className="text-amber-600 font-black">#3</span>
                    ) : (
                      <span className="text-slate-500 font-bold text-sm">#{athlete.rank}</span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl shadow-inner">
                    {athlete.avatar || '⚡'}
                  </div>

                  {/* Athlete Info */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-extrabold text-white text-base leading-none">
                        {athlete.name}
                      </span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-slate-800 text-slate-300 border border-slate-700">
                        Lvl {athlete.level}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-1">
                      <span className="font-semibold text-cyan-400">{athlete.characterClass}</span>
                      <span>•</span>
                      <span className="text-slate-400">{athlete.campus}</span>
                      <span>•</span>
                      <span className={`font-semibold ${
                        athlete.team === 'Crimson Lions' ? 'text-rose-400' :
                        athlete.team === 'Cobalt Titans' ? 'text-blue-400' : 'text-emerald-400'
                      }`}>
                        {athlete.team}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Score & Streak */}
                <div className="text-right flex items-center gap-5">
                  <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/20">
                    <Flame className="w-3.5 h-3.5 fill-amber-400" />
                    <span>{athlete.streakDays || 1}d Streak</span>
                  </div>

                  <div>
                    <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">
                      Points
                    </div>
                    <div className="text-xl sm:text-2xl font-black text-cyan-300 tracking-tight">
                      {athlete.score.toLocaleString()}{' '}
                      <span className="text-xs font-bold text-slate-400">PTS</span>
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
