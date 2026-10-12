import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext.jsx';
import { useSocket } from './context/SocketContext.jsx';
import { Navbar } from './components/Navbar.jsx';
import { LiveLeaderboard } from './components/LiveLeaderboard.jsx';
import { CharacterCard } from './components/CharacterCard.jsx';
import { BossRaidArena } from './components/BossRaidArena.jsx';
import { TurfWarsMap } from './components/TurfWarsMap.jsx';
import { BountiesQuests } from './components/BountiesQuests.jsx';
import { ActivityFeed } from './components/ActivityFeed.jsx';
import { AntiCheatInspector } from './components/AntiCheatInspector.jsx';
import { AnalyticsCharts } from './components/AnalyticsCharts.jsx';
import { QuickLogModal } from './components/QuickLogModal.jsx';
import {
  Zap,
  Trophy,
  Flame,
  Award,
  Sparkles,
  Swords,
  MapPin,
  TrendingUp,
  Activity,
  PlusCircle,
  ShieldCheck,
  Check
} from 'lucide-react';

export default function App() {
  const { user, setUser } = useAuth();
  const { latestEvent } = useSocket();

  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Handle incoming live websocket notifications
  useEffect(() => {
    if (latestEvent?.type === 'workout:new') {
      const w = latestEvent.data.workout;
      setToastMessage(`⚡ ${w.userName} logged ${w.activityType} for +${w.points} PTS!`);
      setTimeout(() => setToastMessage(''), 4500);

      // If it was our user, refresh user state
      if (w.userId === user?.id && latestEvent.data.user) {
        setUser(latestEvent.data.user);
      }
    }
  }, [latestEvent, user?.id]);

  const handleWorkoutLogged = (data) => {
    if (data.user) {
      setUser(data.user);
    }
    setToastMessage(`🎉 Great work! You earned +${data.workout?.points} standardized points.`);
    setTimeout(() => setToastMessage(''), 4500);
  };

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-cyan-950/90 border border-cyan-500/50 backdrop-blur-xl shadow-glow-cyan text-white text-xs font-bold flex items-center gap-2 animate-bounce-subtle">
          <Zap className="w-4 h-4 text-cyan-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLogModal={() => setIsLogModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Hero Quick Stats Banner */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-[#111827] to-cyan-950/30 border border-slate-800 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 text-cyan-400 font-extrabold text-xs uppercase tracking-wider mb-1">
                    <Sparkles className="w-4 h-4" />
                    Unified Multi-Discipline Normalization Engine
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    Welcome to <span className="bg-gradient-to-r from-cyan-400 to-violet-400 bg-clip-text text-transparent">ApexMetrics</span>
                  </h1>
                  <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl leading-relaxed">
                    Compare and compete fairly across running, swimming, cycling, calisthenics, and heavy strength training with a single unified score.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsLogModalOpen(true)}
                    className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-sm shadow-glow-cyan transition-all transform hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
                  >
                    <PlusCircle className="w-5 h-5" />
                    <span>Quick-Log Workout</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('leaderboards')}
                    className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold text-sm border border-slate-700 transition-colors"
                  >
                    View Ranks
                  </button>
                </div>
              </div>

              {/* Point Multiplier Formula Showcase Bar */}
              <div className="mt-6 pt-6 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-slate-400 font-medium">🏊 Swimming</div>
                  <div className="text-cyan-400 font-mono font-bold mt-0.5">30.0 pts / km</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-slate-400 font-medium">🏃 Running</div>
                  <div className="text-cyan-400 font-mono font-bold mt-0.5">10.0 pts / km</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-slate-400 font-medium">🤸 Pull-ups</div>
                  <div className="text-cyan-400 font-mono font-bold mt-0.5">3.0 pts / rep</div>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                  <div className="text-slate-400 font-medium">🏋️ Compound Volume</div>
                  <div className="text-cyan-400 font-mono font-bold mt-0.5">0.05 per kg-rep</div>
                </div>
              </div>
            </div>

            {/* Performance Analytics & Velocity */}
            <AnalyticsCharts user={user} />

            {/* Live Feed & Quests Column */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <ActivityFeed />
              </div>
              <div className="space-y-8">
                <BountiesQuests onOpenLogModal={() => setIsLogModalOpen(true)} />
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: Dynamic Leaderboards */}
        {activeTab === 'leaderboards' && <LiveLeaderboard />}

        {/* Tab 3: RPG Character Profile & Radar */}
        {activeTab === 'character' && <CharacterCard />}

        {/* Tab 4: Group Boss Raids */}
        {activeTab === 'raids' && (
          <BossRaidArena onOpenLogModal={() => setIsLogModalOpen(true)} />
        )}

        {/* Tab 5: Campus Turf Wars */}
        {activeTab === 'turf' && (
          <TurfWarsMap onOpenLogModal={() => setIsLogModalOpen(true)} />
        )}

        {/* Tab 6: Anti-Cheat & Security */}
        {activeTab === 'anticheat' && <AntiCheatInspector />}
      </main>

      {/* Quick-Log Modal */}
      <QuickLogModal
        isOpen={isLogModalOpen}
        onClose={() => setIsLogModalOpen(false)}
        onWorkoutLogged={handleWorkoutLogged}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-[#0B0F19] py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-cyan-400 font-black">⚡ ApexMetrics</span>
            <span>•</span>
            <span>Unified Multi-Discipline Normalization & Real-Time Leaderboard System</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400 font-medium">
            <span>TLS 1.3</span>
            <span>•</span>
            <span>Redis ZSET Sorted Sets</span>
            <span>•</span>
            <span>Socket.io WebSockets</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
