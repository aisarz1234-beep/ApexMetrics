import React, { useState, useEffect } from 'react';
import { api } from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useSocket } from '../context/SocketContext.jsx';
import {
  MapPin,
  Shield,
  Flag,
  Flame,
  Star,
  Swords,
  Sparkles,
  Crown
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

  const getTeamBanner = (teamName) => {
    if (teamName?.includes('Ironfist')) return { badge: 'bg-red-950/60 text-red-300 border-red-500/40', bar: 'bg-red-500', text: 'text-red-400' };
    if (teamName?.includes('Knights') || teamName?.includes('Linirea')) return { badge: 'bg-blue-950/60 text-blue-300 border-blue-500/40', bar: 'bg-blue-500', text: 'text-blue-400' };
    if (teamName?.includes('Sentinels') || teamName?.includes('Emerald')) return { badge: 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40', bar: 'bg-emerald-500', text: 'text-emerald-400' };
    return { badge: 'bg-amber-950/60 text-amber-300 border-amber-500/40', bar: 'bg-amber-500', text: 'text-amber-400' };
  };

  return (
    <div className="space-y-6">
      {/* Turf Wars Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-amber-100 tracking-tight flex items-center gap-2">
            <MapPin className="w-6 h-6 text-amber-400" />
            Campus Turf Wars & Territory Map
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/40 font-semibold uppercase">
              Live Sectors
            </span>
          </h2>
          <p className="text-xs text-amber-200/60 mt-0.5">
            Train at campus zones and strongholds to capture regional territory for your team
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-amber-200/80 font-medium">Your Team:</span>
          <span className={`text-xs px-2.5 py-0.5 rounded-lg border font-bold ${getTeamBanner(user?.team).badge}`}>
            {user?.team || 'Royal Knights of Linirea'}
          </span>
        </div>
      </div>

      {/* Campaign Map & Territory Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign Map Container */}
        <div className="lg:col-span-2 kr-wood-panel p-5 sm:p-6 relative overflow-hidden flex flex-col justify-between min-h-[440px]">
          <div className="relative z-10 flex items-center justify-between pb-3 border-b border-[#432512]">
            <div className="text-sm font-bold text-amber-200 flex items-center gap-2">
              <Flag className="w-4 h-4 text-amber-400" />
              Campus Sectors & Strongholds
            </div>
            <span className="text-xs text-amber-200/60">Select sector to view details</span>
          </div>

          {/* Interactive Territory Nodes */}
          <div className="relative z-10 my-auto py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
            {territories.map(zone => {
              const banner = getTeamBanner(zone.controllingTeam);
              const isSelected = selectedZone?.id === zone.id;

              return (
                <button
                  key={zone.id}
                  onClick={() => setSelectedZone(zone)}
                  className={`p-3.5 rounded-xl border text-left transition-all relative overflow-hidden ${
                    isSelected
                      ? 'border-amber-400/80 bg-gradient-to-b from-[#381D0B] to-[#1E0F06] shadow-sm'
                      : 'border-[#3D2211] bg-[#160E08] hover:border-amber-600/40'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-2xl">{zone.icon || '⚔️'}</span>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <Star className="w-3 h-3 fill-amber-400" />
                      <Star className="w-3 h-3 fill-amber-400" />
                    </div>
                  </div>

                  <div className="font-bold text-xs text-amber-100 line-clamp-1">
                    {zone.name}
                  </div>
                  <div className={`text-[10px] font-semibold mt-0.5 ${banner.text}`}>
                    {zone.controllingTeam} ({zone.controlPercent}%)
                  </div>

                  {/* Control Bar */}
                  <div className="w-full h-1.5 rounded-full bg-[#120A04] mt-2.5 overflow-hidden border border-[#3E2211]">
                    <div
                      className={`h-full ${banner.bar} transition-all duration-500`}
                      style={{ width: `${zone.controlPercent}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="relative z-10 text-xs text-amber-200/70 flex items-center justify-between border-t border-[#432512] pt-3">
            <span>⚔️ Control bonuses apply automatically when recording physical logs</span>
            <button
              onClick={onOpenLogModal}
              className="text-amber-400 hover:text-amber-300 font-semibold hover:underline"
            >
              Defend or Capture Sector →
            </button>
          </div>
        </div>

        {/* Selected Sector Briefing Card */}
        {selectedZone && (
          <div className="kr-wood-panel p-5 sm:p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-[#432512] pb-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400/90">
                  Territory Briefing
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded-md bg-[#24140B] text-amber-200 font-semibold border border-amber-600/30">
                  {selectedZone.controlPercent}% Control
                </span>
              </div>

              <h3 className="text-xl font-bold text-amber-100 mt-3 leading-snug">
                {selectedZone.name}
              </h3>

              <div className="mt-3.5 p-2.5 rounded-xl bg-[#140C07] border border-[#3E2211] text-amber-200 text-xs font-medium flex items-start gap-2">
                <Sparkles className="w-4 h-4 flex-shrink-0 text-amber-400 mt-0.5" />
                <span>Sector Bonus: {selectedZone.activeBonus}</span>
              </div>

              {/* Dominance Points & Top Guardian */}
              <div className="space-y-2 mt-4 text-xs text-amber-200/80">
                <div className="flex justify-between border-b border-[#3E2211] pb-1.5">
                  <span className="font-medium">Total Sector Points:</span>
                  <span className="font-bold text-amber-300 font-mono">
                    {selectedZone.dominancePoints?.toLocaleString()} PTS
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#3E2211] pb-1.5">
                  <span className="font-medium">Controlling Team:</span>
                  <span className="font-bold text-amber-100">{selectedZone.controllingTeam}</span>
                </div>
                <div className="flex justify-between border-b border-[#3E2211] pb-1.5">
                  <span className="font-medium">Top Contributor:</span>
                  <span className="font-bold text-amber-300">{selectedZone.topGuardian}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenLogModal}
              className="kr-btn-gold w-full py-2.5 rounded-xl text-sm font-bold shadow-sm"
            >
              Capture / Fortify Sector (+5% Bonus) ⚔️
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
