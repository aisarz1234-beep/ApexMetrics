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
  RefreshCw,
  Crown
} from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab, onOpenLogModal }) => {
  const { user, login, connectStrava } = useAuth();
  const { connected } = useSocket();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const demoAccounts = [
    { name: 'Sir Gerald Lightseeker', email: 'gerald@kingdomrush.realm', icon: '🛡️', role: 'Paladin Knight' },
    { name: 'Alleria Swiftwind', email: 'alleria@kingdomrush.realm', icon: '🏹', role: 'Apex Strider' },
    { name: 'Malik Hammerfury', email: 'malik@kingdomrush.realm', icon: '🔨', role: 'Juggernaut' },
    { name: 'Magnus Spellbane', email: 'magnus@kingdomrush.realm', icon: '🔮', role: 'Shinobi' },
    { name: 'Catha Tidecaller', email: 'catha@kingdomrush.realm', icon: '🔱', role: 'Aquanaut' },
    { name: 'King Denas', email: 'denas@kingdomrush.realm', icon: '👑', role: 'Vanguard' },
    { name: 'Alex Vance', email: 'alex@apexmetrics.io', icon: '🏃‍♂️', role: 'Apex Strider' },
    { name: 'Marcus Thorne', email: 'marcus@apexmetrics.io', icon: '🏋️‍♂️', role: 'Juggernaut' }
  ];

  return (
    <nav className="sticky top-0 z-40 bg-[#1C1108]/95 backdrop-blur-md border-b border-[#522D13] shadow-xl">
      {/* Top Gold Accent Bar */}
      <div className="h-0.5 bg-gradient-to-r from-amber-700 via-amber-400 to-amber-700" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-b from-amber-400 to-amber-600 border border-amber-300 shadow-kr-gold text-stone-950 font-black text-xl cursor-pointer hover:scale-105 transition-transform"
              onClick={() => setActiveTab('dashboard')}
            >
              🛡️
            </div>
            <div className="cursor-pointer" onClick={() => setActiveTab('dashboard')}>
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">
                ApexMetrics
              </span>
              <div className="flex items-center gap-1.5 text-[11px] text-amber-200/80 font-medium">
                <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-400 shadow-[0_0_8px_#34D399] animate-pulse' : 'bg-amber-400'}`} />
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
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                  : 'text-amber-200/70 hover:text-amber-100 hover:bg-[#382012]/60 border border-transparent'
              }`}
            >
              <Zap className="w-4 h-4 text-amber-400" /> Feed & Stats
            </button>

            <button
              onClick={() => setActiveTab('leaderboards')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'leaderboards'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                  : 'text-amber-200/70 hover:text-amber-100 hover:bg-[#382012]/60 border border-transparent'
              }`}
            >
              <Trophy className="w-4 h-4 text-amber-400" /> Leaderboards
            </button>

            <button
              onClick={() => setActiveTab('character')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'character'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                  : 'text-amber-200/70 hover:text-amber-100 hover:bg-[#382012]/60 border border-transparent'
              }`}
            >
              <User className="w-4 h-4 text-amber-400" /> RPG Character
            </button>

            <button
              onClick={() => setActiveTab('raids')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'raids'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                  : 'text-amber-200/70 hover:text-amber-100 hover:bg-[#382012]/60 border border-transparent'
              }`}
            >
              <Swords className="w-4 h-4 text-amber-400" /> Boss Raids
            </button>

            <button
              onClick={() => setActiveTab('turf')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'turf'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                  : 'text-amber-200/70 hover:text-amber-100 hover:bg-[#382012]/60 border border-transparent'
              }`}
            >
              <MapPin className="w-4 h-4 text-amber-400" /> Turf Wars
            </button>

            <button
              onClick={() => setActiveTab('anticheat')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-2 ${
                activeTab === 'anticheat'
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                  : 'text-amber-200/70 hover:text-amber-100 hover:bg-[#382012]/60 border border-transparent'
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
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-gradient-to-b from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-kr-button border border-amber-300/60 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Log Activity</span>
            </button>

            {/* Athlete Profile / Quick Switch */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2.5 p-1.5 rounded-xl bg-[#29170C] border border-[#5E3216] hover:border-amber-400/60 transition-all text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-[#180E07] border border-amber-500/40 flex items-center justify-center text-lg shadow-inner">
                    {user.avatar || '🛡️'}
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-xs font-bold text-amber-100 leading-none">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-amber-400 font-medium mt-0.5 flex items-center gap-1">
                      <span>Lvl {user.level || 1}</span>
                      <span>•</span>
                      <span>{Math.round(user.totalPoints || 0).toLocaleString()} pts</span>
                    </div>
                  </div>
                </button>

                {/* Dropdown switch menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#241409]/98 border border-[#5E3216] backdrop-blur-xl shadow-2xl p-2 z-50 text-xs">
                    <div className="px-2 py-1 text-amber-400 font-semibold uppercase tracking-wider text-[10px] border-b border-[#4A2610] mb-1 flex items-center justify-between">
                      <span>Current Hero</span>
                      <Crown className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <div className="px-2 py-2 mb-2 bg-[#382012]/80 border border-[#522D13] rounded-lg">
                      <div className="font-bold text-amber-100 text-sm">{user.name}</div>
                      <div className="text-amber-400 text-[11px] font-semibold">{user.characterClass} • {user.team}</div>
                      <div className="mt-1 flex items-center justify-between text-amber-200/80 text-[11px]">
                        <span>Streak: 🔥 {user.streakDays || 1} days</span>
                        {user.stravaLinked ? (
                          <span className="text-emerald-400 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" /> Strava Sync
                          </span>
                        ) : (
                          <button
                            onClick={connectStrava}
                            className="text-amber-300 hover:underline flex items-center gap-1"
                          >
                            + Connect Strava
                          </button>
                        )}
                      </div>
                    </div>

                    <div className="px-2 py-1 text-amber-400 font-semibold uppercase tracking-wider text-[10px]">
                      Switch Profile (Demo Testing)
                    </div>
                    <div className="max-h-56 overflow-y-auto space-y-0.5">
                      {demoAccounts.map(acc => (
                        <button
                          key={acc.email}
                          onClick={() => {
                            login(acc.email, 'apex1234');
                            setShowUserMenu(false);
                          }}
                          className={`w-full text-left px-2 py-1.5 rounded-lg flex items-center justify-between transition-all ${
                            user.email === acc.email
                              ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40'
                              : 'hover:bg-[#382012] text-amber-200/80'
                          }`}
                        >
                          <span>{acc.name}</span>
                          {user.email === acc.email && <span className="text-amber-400 text-xs">Active</span>}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile Navigation Scrollbar */}
        <div className="md:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-[#4A2610] text-xs">
          {[
            { id: 'dashboard', label: 'Feed & Stats' },
            { id: 'leaderboards', label: 'Leaderboards' },
            { id: 'character', label: 'RPG Character' },
            { id: 'raids', label: 'Boss Raids' },
            { id: 'turf', label: 'Turf Wars' },
            { id: 'anticheat', label: 'Anti-Cheat' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-2.5 py-1.5 rounded-md font-semibold whitespace-nowrap ${
                activeTab === tab.id ? 'bg-amber-500/25 text-amber-300 font-bold' : 'text-amber-200/70'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
};
