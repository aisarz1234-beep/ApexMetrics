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
    { name: 'Alleria Swiftwind', email: 'alleria@kingdomrush.realm', icon: '🏹', role: 'Apex Strider' },
    { name: 'Sir Gerald Lightseeker', email: 'gerald@kingdomrush.realm', icon: '🛡️', role: 'Paladin Knight' },
    { name: 'Malik Hammerfury', email: 'malik@kingdomrush.realm', icon: '🔨', role: 'Juggernaut' },
    { name: 'Magnus Spellbane', email: 'magnus@kingdomrush.realm', icon: '🔮', role: 'Shinobi' },
    { name: 'Catha Tidecaller', email: 'catha@kingdomrush.realm', icon: '🔱', role: 'Aquanaut' },
    { name: 'King Denas', email: 'denas@kingdomrush.realm', icon: '👑', role: 'Vanguard' },
    { name: 'Alex Vance', email: 'alex@apexmetrics.io', icon: '🏃‍♂️', role: 'Apex Strider' },
    { name: 'Marcus Thorne', email: 'marcus@apexmetrics.io', icon: '🏋️‍♂️', role: 'Juggernaut' }
  ];

  const navTabs = [
    { id: 'dashboard', label: 'Feed & Stats', icon: Zap },
    { id: 'leaderboards', label: 'Leaderboards', icon: Trophy },
    { id: 'character', label: 'RPG Character', icon: User },
    { id: 'raids', label: 'Boss Raids', icon: Swords },
    { id: 'turf', label: 'Turf Wars', icon: MapPin },
    { id: 'anticheat', label: 'Anti-Cheat', icon: ShieldAlert }
  ];

  return (
    <nav className="sticky top-0 z-40 bg-[#140C07]/95 backdrop-blur-md border-b border-[#3E2211] shadow-lg">
      {/* Top Gold Accent Line */}
      <div className="h-[1.5px] bg-gradient-to-r from-transparent via-amber-500/70 to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2 lg:gap-4">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2.5 sm:gap-3 flex-shrink-0">
            <div
              className="flex items-center justify-center w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-b from-amber-400 to-amber-600 border border-amber-300/80 text-stone-950 font-black text-lg sm:text-xl shadow-md cursor-pointer hover:scale-105 transition-transform flex-shrink-0"
              onClick={() => setActiveTab('dashboard')}
            >
              🛡️
            </div>
            <div className="cursor-pointer flex-shrink-0" onClick={() => setActiveTab('dashboard')}>
              <span className="text-lg sm:text-xl font-extrabold tracking-tight bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent whitespace-nowrap">
                ApexMetrics
              </span>
              <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-amber-200/75 font-medium whitespace-nowrap">
                <span className={`w-2 h-2 rounded-full ${connected ? 'bg-emerald-400 shadow-[0_0_6px_#34D399] animate-pulse' : 'bg-amber-400'}`} />
                <span className="whitespace-nowrap">{connected ? 'Live Sync Active' : 'Connecting...'}</span>
              </div>
            </div>
          </div>

          {/* Desktop Navigation Tabs (Strict 1-Line Formatting) */}
          <div className="hidden md:flex items-center gap-0.5 lg:gap-1.5 flex-shrink-0">
            {navTabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-2 py-1.5 lg:px-3 lg:py-1.5 rounded-lg text-xs lg:text-sm font-semibold transition-all flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${
                    isActive
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/40'
                      : 'text-amber-200/70 hover:text-amber-100 hover:bg-[#25150A]/70 border border-transparent'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 lg:w-4 lg:h-4 text-amber-400 flex-shrink-0" />
                  <span className="whitespace-nowrap">{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* User Controls & Quick-Log */}
          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Quick Log Action (Strict 1-Line) */}
            <button
              onClick={onOpenLogModal}
              className="flex items-center gap-1.5 px-3 py-1.5 lg:px-3.5 lg:py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs lg:text-sm shadow-sm transition-all whitespace-nowrap flex-shrink-0"
            >
              <PlusCircle className="w-3.5 h-3.5 lg:w-4 lg:h-4 flex-shrink-0" />
              <span className="whitespace-nowrap">Log Activity</span>
            </button>

            {/* Athlete Profile / Quick Switch */}
            {user && (
              <div className="relative flex-shrink-0">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1.5 rounded-xl bg-[#201309] border border-[#522E14] hover:border-amber-400/50 transition-all text-left whitespace-nowrap flex-shrink-0"
                >
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-[#140C07] border border-amber-500/40 flex items-center justify-center text-sm sm:text-base flex-shrink-0 shadow-inner">
                    {user.avatar || '🛡️'}
                  </div>
                  <div className="hidden sm:block whitespace-nowrap">
                    <div className="text-xs font-bold text-amber-100 leading-none whitespace-nowrap">
                      {user.name}
                    </div>
                    <div className="text-[10px] text-amber-400 font-medium mt-0.5 flex items-center gap-1 whitespace-nowrap">
                      <span>Lvl {user.level || 1}</span>
                      <span>•</span>
                      <span>{Math.round(user.totalPoints || 0).toLocaleString()} pts</span>
                    </div>
                  </div>
                </button>

                {/* Dropdown switch menu */}
                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-[#1C1008]/98 border border-[#522E14] backdrop-blur-xl shadow-2xl p-2 z-50 text-xs">
                    <div className="px-2 py-1 text-amber-400 font-semibold uppercase tracking-wider text-[10px] border-b border-[#3E2211] mb-1 flex items-center justify-between">
                      <span>Current Hero</span>
                      <Crown className="w-3.5 h-3.5 text-amber-400" />
                    </div>
                    <div className="px-2 py-2 mb-2 bg-[#25150A] border border-[#482813] rounded-lg">
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
                              : 'hover:bg-[#25150A] text-amber-200/80'
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
        <div className="md:hidden flex items-center gap-1 overflow-x-auto py-2 border-t border-[#3E2211] text-xs">
          {navTabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-2.5 py-1.5 rounded-md font-semibold whitespace-nowrap flex-shrink-0 ${
                activeTab === tab.id ? 'bg-amber-500/20 text-amber-300 font-bold' : 'text-amber-200/70'
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
