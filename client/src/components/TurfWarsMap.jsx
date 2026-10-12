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
    if (teamName?.includes('Ironfist')) return { badge: 'bg-red-900/60 text-amber-200 border-red-500', bar: 'bg-red-600', text: 'text-red-400' };
    if (teamName?.includes('Knights') || teamName?.includes('Linirea')) return { badge: 'bg-blue-900/60 text-amber-200 border-blue-500', bar: 'bg-blue-600', text: 'text-blue-400' };
    if (teamName?.includes('Sentinels') || teamName?.includes('Emerald')) return { badge: 'bg-emerald-900/60 text-amber-200 border-emerald-500', bar: 'bg-emerald-600', text: 'text-emerald-400' };
    return { badge: 'bg-amber-900/60 text-amber-200 border-amber-500', bar: 'bg-amber-500', text: 'text-amber-400' };
  };

  return (
    <div className="space-y-6">
      {/* Turf Wars Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl font-black text-amber-200 tracking-tight flex items-center gap-2">
            <MapPin className="w-7 h-7 text-amber-400" />
            Campus Turf Wars & Territory Map
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500 font-bold uppercase">
              Live Sectors
            </span>
          </h2>
          <p className="text-xs text-amber-100/70">
            Train at campus zones and strongholds to capture regional territory for your team
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs text-amber-300 font-bold">Your Team:</span>
          <span className={`text-xs px-3 py-1 rounded-xl border-2 font-black ${getTeamBanner(user?.team).badge}`}>
            {user?.team || 'Royal Knights of Linirea'}
          </span>
        </div>
      </div>

      {/* Campaign Map & Territory Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Campaign Map Container */}
        <div className="lg:col-span-2 kr-wood-panel p-6 border-4 border-[#78350F] relative overflow-hidden flex flex-col justify-between min-h-[460px]">
          <div className="absolute inset-0 bg-[radial-gradient(#8D5B29_1px,transparent_1px)] [background-size:24px_24px] opacity-20 pointer-events-none" />

          <div className="relative z-10 flex items-center justify-between">
            <div className="text-sm font-black text-amber-300 flex items-center gap-2">
              <Flag className="w-4 h-4 text-amber-400" />
              Campus Sectors & Strongholds
            </div>
            <span className="text-xs text-amber-200/80 italic">Select sector to view territory details</span>
          </div>

          {/* Interactive Territory Nodes */}
          <div className="relative z-10 my-auto py-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {territories.map(zone => {
              const banner = getTeamBanner(zone.controllingTeam);
              const isSelected = selectedZone?.id === zone.id;

              return (
                <button
                  key={zone.id}
                  onClick={() => setSelectedZone(zone)}
                  className={`p-4 rounded-2xl border-3 text-left transition-all relative overflow-hidden group ${
                    isSelected
                      ? 'border-amber-400 bg-gradient-to-b from-[#4A260F] to-[#251307] shadow-kr-gold transform -translate-y-1'
                      : 'border-[#5C3317] bg-[#1E1007]/90 hover:border-amber-500'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{zone.icon || '⚔️'}</span>
                    <div className="flex items-center gap-0.5 text-amber-400">
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                      <Star className="w-3.5 h-3.5 fill-amber-400" />
                    </div>
                  </div>

                  <div className="font-black text-sm text-amber-200 group-hover:text-amber-400 transition-colors line-clamp-1">
                    {zone.name}
                  </div>
                  <div className={`text-[11px] font-bold mt-0.5 ${banner.text}`}>
                    {zone.controllingTeam} ({zone.controlPercent}%)
                  </div>

                  {/* Control Bar */}
                  <div className="w-full h-2 rounded-full bg-[#120A04] mt-3 overflow-hidden border border-[#5C3317]">
                    <div
                      className={`h-full ${banner.bar} shadow-sm transition-all duration-500`}
                      style={{ width: `${zone.controlPercent}%` }}
                    />
                  </div>
                </button>
              );
            })}
          </div>

          <div className="relative z-10 text-xs text-amber-200/80 flex items-center justify-between border-t border-[#5C3317] pt-3">
            <span>⚔️ Control bonuses apply automatically when recording physical logs</span>
            <button
              onClick={onOpenLogModal}
              className="text-amber-400 hover:text-amber-300 font-bold underline"
            >
              Defend or Capture Sector →
            </button>
          </div>
        </div>

        {/* Selected Sector Briefing Card */}
        {selectedZone && (
          <div className="kr-parchment p-6 flex flex-col justify-between space-y-4 shadow-2xl relative">
            <div>
              <div className="flex items-center justify-between border-b-2 border-[#8D5B29]/60 pb-2">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#78350F]">
                  Territory Briefing
                </span>
                <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#5C3317] text-amber-100 font-bold">
                  {selectedZone.controlPercent}% Control
                </span>
              </div>

              <h3 className="text-2xl font-black text-[#381A05] mt-3 leading-snug">
                {selectedZone.name}
              </h3>

              <div className="mt-4 p-3 rounded-xl bg-amber-200/60 border border-[#8D5B29] text-[#451A03] text-xs font-bold flex items-start gap-2 shadow-inner">
                <Sparkles className="w-4 h-4 flex-shrink-0 text-[#B45309] mt-0.5" />
                <span>Sector Bonus: {selectedZone.activeBonus}</span>
              </div>

              {/* Dominance Points & Top Guardian */}
              <div className="space-y-3 mt-5 text-sm text-[#451A03]">
                <div className="flex justify-between border-b border-[#8D5B29]/30 pb-1">
                  <span className="font-bold">Total Sector Points:</span>
                  <span className="font-black text-[#78350F] font-mono">
                    {selectedZone.dominancePoints?.toLocaleString()} PTS
                  </span>
                </div>
                <div className="flex justify-between border-b border-[#8D5B29]/30 pb-1">
                  <span className="font-bold">Controlling Team:</span>
                  <span className="font-black text-[#881337]">{selectedZone.controllingTeam}</span>
                </div>
                <div className="flex justify-between border-b border-[#8D5B29]/30 pb-1">
                  <span className="font-bold">Top Contributor:</span>
                  <span className="font-black text-[#78350F]">{selectedZone.topGuardian}</span>
                </div>
              </div>
            </div>

            <button
              onClick={onOpenLogModal}
              className="kr-btn-gold w-full py-3 rounded-xl text-base shadow-kr-button"
            >
              Capture / Fortify Sector (+5% Bonus) ⚔️
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
