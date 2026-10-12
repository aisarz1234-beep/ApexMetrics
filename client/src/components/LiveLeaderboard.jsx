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
    <div className="space-y-4">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-b from-amber-400 to-amber-600 border border-amber-300 flex items-center justify-center text-stone-950 font-bold shadow-kr-gold">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-amber-100 tracking-tight flex items-center gap-2">
              Leaderboard Standings
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/40">
                Live Redis ZSET
              </span>
            </h2>
            <p className="text-xs text-amber-200/60 mt-0.5">
              Normalized multi-discipline points computed in real-time
            </p>
          </div>
        </div>

        {/* Timeframe Filter Buttons */}
        <div className="flex items-center p-1 rounded-xl bg-[#1A1009] border border-[#482813] self-start sm:self-auto">
          {[
            { id: 'daily', label: 'Daily' },
            { id: 'weekly', label: 'Weekly' },
            { id: 'allTime', label: 'All-Time' }
          ].map(tf => (
            <button
              key={tf.id}
              onClick={() => setTimeframe(tf.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                timeframe === tf.id
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 shadow-sm'
                  : 'text-amber-200/70 hover:text-amber-100 border border-transparent'
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Stronghold & Faction Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#1A1009] border border-[#452612]">
          <Building2 className="w-4 h-4 text-amber-400 ml-1 flex-shrink-0" />
          <span className="text-xs font-medium text-amber-200/80">Stronghold:</span>
          <select
            value={campus}
            onChange={e => setCampus(e.target.value)}
            className="flex-1 bg-[#24150B] text-amber-100 text-xs font-medium rounded-lg px-2.5 py-1.5 border border-[#522D13] focus:outline-none focus:border-amber-400"
          >
            <option value="all">Global (All Strongholds)</option>
            <option value="Royal Citadel Barracks">Royal Citadel Barracks</option>
            <option value="Whispering Woods">Whispering Woods</option>
            <option value="Ironkeep Forge">Ironkeep Forge</option>
            <option value="Stormcloud Spire">Stormcloud Spire</option>
            <option value="Sunken Lagoon">Sunken Lagoon</option>
          </select>
        </div>

        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#1A1009] border border-[#452612]">
          <Users className="w-4 h-4 text-amber-400 ml-1 flex-shrink-0" />
          <span className="text-xs font-medium text-amber-200/80">Faction:</span>
          <select
            value={team}
            onChange={e => setTeam(e.target.value)}
            className="flex-1 bg-[#24150B] text-amber-100 text-xs font-medium rounded-lg px-2.5 py-1.5 border border-[#522D13] focus:outline-none focus:border-amber-400"
          >
            <option value="all">All Factions</option>
            <option value="Royal Knights of Linirea">Royal Knights of Linirea 🛡️</option>
            <option value="Crimson Ironfist Clan">Crimson Ironfist Clan ⚔️</option>
            <option value="Emerald Sentinels">Emerald Sentinels 🏹</option>
          </select>
        </div>
      </div>

      {/* Standings List */}
      <div className="space-y-2.5">
        {loading ? (
          <div className="py-12 text-center text-amber-200/70 text-sm font-medium">
            Fetching latest athlete standings...
          </div>
        ) : leaderboard.length === 0 ? (
          <div className="py-12 text-center text-amber-200/60 text-sm font-medium">
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
                className={`flex items-center justify-between p-3.5 sm:p-4 rounded-xl transition-all ${
                  isTop1
                    ? 'bg-gradient-to-r from-[#2E1B0B] via-[#201309] to-[#180E06] border border-amber-400/60 border-l-4 border-l-amber-400 shadow-sm'
                    : isTop2
                    ? 'bg-gradient-to-r from-[#24170F] via-[#1B110A] to-[#150D07] border border-stone-400/50 border-l-4 border-l-stone-300'
                    : isTop3
                    ? 'bg-gradient-to-r from-[#26150B] via-[#1C1008] to-[#150D06] border border-amber-700/60 border-l-4 border-l-amber-600'
                    : 'bg-[#180E08] border border-[#3E2211] hover:border-amber-500/40'
                }`}
              >
                {/* Rank & Profile */}
                <div className="flex items-center gap-3 sm:gap-4">
                  {/* Rank Badge */}
                  <div className="w-8 sm:w-9 h-8 sm:h-9 flex items-center justify-center font-bold text-sm sm:text-base">
                    {isTop1 ? (
                      <Crown className="w-6 h-6 fill-amber-400 text-amber-500" />
                    ) : isTop2 ? (
                      <span className="text-stone-300 font-extrabold">#2</span>
                    ) : isTop3 ? (
                      <span className="text-amber-600 font-extrabold">#3</span>
                    ) : (
                      <span className="text-amber-200/60 font-semibold text-xs">#{athlete.rank}</span>
                    )}
                  </div>

                  {/* Hero Avatar */}
                  <div className="w-10 h-10 rounded-xl bg-[#201309] border border-amber-500/40 flex items-center justify-center text-xl shadow-inner">
                    {athlete.avatar || '🛡️'}
                  </div>

                  {/* Champion Info */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-amber-100 text-sm sm:text-base leading-none">
                        {athlete.name}
                      </span>
                      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-[#150D07] text-amber-300 border border-amber-600/40">
                        Lvl {athlete.level}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-amber-200/70 mt-1 font-medium">
                      <span className="text-amber-300 font-semibold">{athlete.characterClass}</span>
                      <span>•</span>
                      <span>{athlete.campus}</span>
                      <span>•</span>
                      <span className="text-amber-200/60">{athlete.team}</span>
                    </div>
                  </div>
                </div>

                {/* Score & Streak */}
                <div className="text-right flex items-center gap-3 sm:gap-4">
                  <div className="hidden sm:flex items-center gap-1 text-xs font-medium text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-lg border border-amber-500/30">
                    <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{athlete.streakDays || 1}d Streak</span>
                  </div>

                  <div>
                    <div className="text-lg sm:text-xl font-extrabold text-amber-300 tracking-tight">
                      {athlete.score.toLocaleString()}{' '}
                      <span className="text-xs font-semibold text-amber-200/60">PTS</span>
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
