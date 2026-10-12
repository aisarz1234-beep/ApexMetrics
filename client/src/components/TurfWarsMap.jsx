import React, { useState, useEffect } from 'react';
import { api } from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useSocket } from '../context/SocketContext.jsx';
import {
  MapPin,
  Shield,
  Flag,
  Zap,
  Flame,
  Award,
  Sparkles,
  Users
} from 'lucide-react';

export const TurfWarsMap = ({ onOpenLogModal }) => {
  const { user } = useAuth();
  const { latestEvent } = useSocket();
  const [territories, setTerritories] = useState([]);
  const [selectedZone, setSelectedZone] = useState(null);

  const fetchTerritories = async () => {
    try {
      const res = await api.getTerritories();
      setTerritories(res.territories || []);
      if (!selectedZone && res.territories?.length > 0) {
        setSelectedZone(res.territories[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchTerritories();
  }, []);

  useEffect(() => {
    if (latestEvent?.type === 'workout:new') {
      fetchTerritories();
    }
  }, [latestEvent]);

  const getTeamColor = (teamName) => {
    if (teamName?.includes('Crimson')) return { badge: 'bg-rose-500/20 text-rose-400 border-rose-500/40', bar: 'bg-rose-500', text: 'text-rose-400' };
    if (teamName?.includes('Cobalt')) return { badge: 'bg-blue-500/20 text-blue-400 border-blue-500/40', bar: 'bg-blue-500', text: 'text-blue-400' };
    if (teamName?.includes('Emerald')) return { badge: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40', bar: 'bg-emerald-500', text: 'text-emerald-400' };
    return { badge: 'bg-amber-500/20 text-amber-400 border-amber-500/40', bar: 'bg-amber-500', text: 'text-amber-400' };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
            <MapPin className="w-6 h-6 text-cyan-400" />
            Campus Turf Wars & Territory Capture
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 font-bold">
              Map Arena
            </span>
          </h2>
          <p className="text-xs text-slate-400">
            Log workouts at campus training grounds to conquer virtual territories for your faction
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold">Your Faction:</span>
          <span className={`text-xs px-3 py-1 rounded-lg border font-extrabold ${getTeamColor(user?.team).badge}`}>
            {user?.team || 'Crimson Lions'}
          </span>
        </div>
      </div>

      {/* Campus Map & Territories Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Visual Campus Territory Interactive Map */}
        <div className="lg:col-span-2 rounded-3xl bg-slate-900 border border-slate-800 p-6 relative overflow-hidden flex flex-col justify-between min-h-[420px]">
          {/* Subtle Campus Grid Map Overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)] bg-[size:3rem_3rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-25" />

          <div className="relative z-10 flex items-center justify-between">
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
              <Flag className="w-3.5 h-3.5 text-cyan-400" />
              Interactive Campus Sector Map
            </div>
            <span className="text-[11px] text-slate-500 font-medium">Click sector to inspect & fortify</span>
          </div>

          {/* Interactive Zone Hotspots */}
          <div className="relative z-10 my-auto py-8 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {territories.map(zone => {
              const teamCol = getTeamColor(zone.controllingTeam);
              const isSelected = selectedZone?.id === zone.id;

              return (
                <button
                  key={zone.id}
                  onClick={() => setSelectedZone(zone)}
                  className={`p-4 rounded-2xl border text-left transition-all relative overflow-hidden group ${
                    isSelected
                      ? 'border-cyan-400 bg-slate-800/90 shadow-glow-cyan'
                      : 'border-slate-800 bg-slate-900/80 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xl">
                      {zone.name.includes('Gym') ? '🏛️' :
                       zone.name.includes('Track') ? '🏟️' :
                       zone.name.includes('Aquatic') ? '🏊‍♂️' :
                       zone.name.includes('Steps') ? '🪜' : '🌳'}
                    </span>
                    <span className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${teamCol.badge}`}>
                      {zone.controlPercent}%
                    </span>
                  </div>

                  <div className="font-extrabold text-xs text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
                    {zone.name}
                  </div>
                  <div className={`text-[10px] font-bold mt-0.5 ${teamCol.text}`}>
                    {zone.controllingTeam}
                  </div>

                  {/* Micro Progress Bar */}
                  <div className="w-full h-1.5 rounded-full bg-slate-800 mt-3 overflow-hidden">
                    <div
                      className={`h-full ${teamCol.bar} transition-all duration-500`}
                      style={{ width: `${zone.controlPercent}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          {/* Map Footer Note */}
          <div className="relative z-10 text-[11px] text-slate-400 flex items-center justify-between border-t border-slate-800/80 pt-3">
            <span>Control bonuses apply automatically upon logging workouts</span>
            <button
              onClick={onOpenLogModal}
              className="text-cyan-400 hover:underline font-bold"
            >
              Log Workout in Zone →
            </button>
          </div>
        </div>

        {/* Selected Sector Inspector Panel */}
        {selectedZone && (
          <div className="p-6 rounded-3xl bg-[#111827] border border-slate-800 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Sector Intel
                </span>
                <span className={`text-xs px-2.5 py-0.5 rounded-full border font-bold ${getTeamColor(selectedZone.controllingTeam).badge}`}>
                  {selectedZone.controllingTeam} Controlled
                </span>
              </div>

              <h3 className="text-xl font-black text-white mt-2">{selectedZone.name}</h3>

              <div className="mt-4 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-semibold flex items-center gap-2">
                <Sparkles className="w-4 h-4 flex-shrink-0" />
                <span>Zone Buff: {selectedZone.activeBonus}</span>
              </div>

              {/* Dominance Points & Stats */}
              <div className="space-y-3 mt-4">
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Dominance Points</span>
                  <span className="font-bold text-white font-mono">
                    {selectedZone.dominancePoints.toLocaleString()} PTS
                  </span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Territory Control</span>
                  <span className="font-bold text-white">{selectedZone.controlPercent}%</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-slate-400">Top Guardian</span>
                  <span className="font-bold text-amber-400">{selectedZone.topGuardian}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenLogModal}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-xs shadow-glow-cyan transition-all transform active:scale-95"
            >
              Fortify or Capture Territory (+5% Bonus) ⚡
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
