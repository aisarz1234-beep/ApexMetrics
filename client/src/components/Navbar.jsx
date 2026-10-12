import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { useSocket } from '../context/SocketContext.jsx';
import {
  Zap,
  Trophy,
  User,
  ShieldAlert,
  Flame,
  Swords,
  MapPin,
  PlusCircle,
  CheckCircle2,
  RefreshCw
} from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab, onOpenLogModal }) => {
  const { user, login, connectStrava } = useAuth();
  const { connected } = useSocket();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const demoAccounts = [
    { name: 'Alex Vance (Apex Strider)', email: 'alex@apexmetrics.io' },
    { name: 'Marcus Thorne (Juggernaut)', email: 'marcus@apexmetrics.io' },
    { name: 'Elena Rostova (Aquanaut)', email: 'elena@apexmetrics.io' },
    { name: 'Kai Takahashi (Shinobi)', email: 'kai@apexmetrics.io' }
  ];

  return (
    <nav className="sticky top-0 z-40 bg-[#0B0F19]/90 backdrop-blur-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-violet-600 shadow-glow-cyan text-white font-black text-xl">
              ⚡
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-cyan-400 via-sky-300 to-violet-400 bg-clip-text text-transparent">
                ApexMetrics
              </span>
              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-medium">
                <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
                <span>{connected ? 'Live Sync Active' : 'Connecting...'}</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Tabs */}
          <div className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'dashboard'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Zap className="w-4 h-4" /> Feed & Stats
            </button>

            <button
              onClick={() => setActiveTab('leaderboards')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'leaderboards'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Trophy className="w-4 h-4" /> Leaderboards
            </button>

            <button
              onClick={() => setActiveTab('character')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'character'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <User className="w-4 h-4" /> RPG Character
            </button>

            <button
              onClick={() => setActiveTab('raids')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'raids'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Swords className="w-4 h-4" /> Boss Raids
            </button>

            <button
              onClick={() => setActiveTab('turf')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'turf'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <MapPin className="w-4 h-4" /> Turf Wars
            </button>

            <button
              onClick={() => setActiveTab('anticheat')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'anticheat'
                  ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/30'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <ShieldAlert className="w-4 h-4 text-amber-400" /> Anti-Cheat
            </button>
          </div>

          {/* User Controls & Quick-Log */}
          <div className="flex items-center gap-3">
            {/* Quick Log Action */}
            <button
              onClick={onOpenLogModal}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold text-sm shadow-glow-cyan transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Log Activity</span>
            </button>

            {/* Athlete Profile / Quick Switch */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2.5 p-1.5 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-500/50 transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-lg border border-slate-700">
                    {user.avatar || '⚡'}
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-xs font-bold text-white leading-none">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-cyan-400 font-medium mt-0.5 flex items-center gap-1">
                      <span>Lvl {user.level || 1}</span>
                      <span>•</span>
                      <span>{Math.round(user.totalPoints || 0)} pts</span>
                    </div>
                  </div>
                </button>

                {/* Dropdown switch menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-slate-900/95 border border-slate-700 backdrop-blur-xl shadow-2xl p-2 z-50 text-xs">
                    <div className="px-2 py-1 text-slate-400 font-semibold uppercase tracking-wider text-[10px] border-b border-slate-800 mb-1">
                      Current Athlete
                    </div>
                    <div className="px-2 py-2 mb-2 bg-slate-800/60 rounded-lg">
                      <div className="font-bold text-white text-sm">{user.name}</div>
                      <div className="text-cyan-400 text-[11px] font-semibold">{user.characterClass} • {user.team}</div>
                      <div className="mt-1 flex items-center justify-between text-slate-400 text-[11px]">
                        <span>Streak: 🔥 {user.streakDays || 1} days</span>
                        {user.stravaLinked ? (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Strava Sync
                          </span>
                        ) : (
                          <button
                            onClick={connectStrava}
                            className="text-amber-400 hover:underline flex items-center gap-1"
                          >
                            + Connect Strava
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="px-2 py-1 text-slate-400 font-semibold uppercase tracking-wider text-[10px]">
                      Switch Profile (Demo Testing)
                    </div>
                    {demoAccounts.map(acc => (
                      <button
                        key={acc.email}
                        onClick={() => {
                          login(acc.email, 'apex1234');
                          setShowUserMenu(false);
                        }}
                        className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between transition-all ${
                          user.email === acc.email
                            ? 'bg-cyan-500/20 text-cyan-300 font-bold'
                            : 'hover:bg-slate-800 text-slate-300'
                        }`}
                      >
                        <span>{acc.name}</span>
                        {user.email === acc.email && <span className="text-cyan-400 text-xs">Active</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Scrollbar */}
        <div className="md:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-slate-800/80 text-xs">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-2.5 py-1.5 rounded-md font-semibold whitespace-nowrap ${
              activeTab === 'dashboard' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400'
            }`}
          >
            Feed
          </button>
          <button
            onClick={() => setActiveTab('leaderboards')}
            className={`px-2.5 py-1.5 rounded-md font-semibold whitespace-nowrap ${
              activeTab === 'leaderboards' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400'
            }`}
          >
            Leaderboards
          </button>
          <button
            onClick={() => setActiveTab('character')}
            className={`px-2.5 py-1.5 rounded-md font-semibold whitespace-nowrap ${
              activeTab === 'character' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400'
            }`}
          >
            Character
          </button>
          <button
            onClick={() => setActiveTab('raids')}
            className={`px-2.5 py-1.5 rounded-md font-semibold whitespace-nowrap ${
              activeTab === 'raids' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400'
            }`}
          >
            Boss Raids
          </button>
          <button
            onClick={() => setActiveTab('turf')}
            className={`px-2.5 py-1.5 rounded-md font-semibold whitespace-nowrap ${
              activeTab === 'turf' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400'
            }`}
          >
            Turf Wars
          </button>
          <button
            onClick={() => setActiveTab('anticheat')}
            className={`px-2.5 py-1.5 rounded-md font-semibold whitespace-nowrap ${
              activeTab === 'anticheat' ? 'bg-cyan-500/20 text-cyan-400' : 'text-slate-400'
            }`}
          >
            Anti-Cheat
          </button>
        </div>
      </div>
    </nav>
  );
};
