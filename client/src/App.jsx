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
  Shield,
  Trophy,
  Flame,
  Award,
  Sparkles,
  Swords,
  MapPin,
  PlusCircle,
  Crown,
  Star,
  Zap,
  Info
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
      setToastMessage(`⚔️ ${w.userName} logged ${w.activityType} (+${w.points} PTS)!`);
      setTimeout(() => setToastMessage(''), 4500);

      if (w.userId === user?.id && latestEvent.data.user) {
        setUser(latestEvent.data.user);
      }
    }
  }, [latestEvent, user?.id]);

  const handleWorkoutLogged = (data) => {
    if (data.user) {
      setUser(data.user);
    }
    setToastMessage(`🎉 Glory to the Kingdom! You earned +${data.workout?.points} points!`);
    setTimeout(() => setToastMessage(''), 4500);
  };

  return (
    <div className="min-h-screen bg-[#120D08] text-amber-50 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-[#24150B]/95 border border-amber-400/60 backdrop-blur-xl shadow-xl text-amber-200 text-xs font-semibold flex items-center gap-2.5 animate-bounce-subtle">
          <Shield className="w-4 h-4 text-amber-400 fill-amber-500 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Kingdom Rush Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenLogModal={() => setIsLogModalOpen(true)}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Clean Hero Header Banner */}
            <div className="kr-wood-panel p-6 sm:p-7 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-2">
                    <Crown className="w-3.5 h-3.5 text-amber-400" />
                    <span>Kingdom of Champions</span>
                  </div>
                  <h1 className="text-2xl sm:text-4xl font-extrabold text-amber-100 tracking-tight">
                    Unified Multi-Discipline <span className="bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-400 bg-clip-text text-transparent">Athletic Scoring</span>
                  </h1>
                  <p className="text-sm text-amber-100/75 mt-1.5 max-w-2xl leading-relaxed">
                    Compete fairly across running, swimming, cycling, calisthenics, and weightlifting with a normalized point engine and real-time leaderboards.
                  </p>
                </div>

                <div className="flex items-center gap-3 flex-shrink-0">
                  <button
                    onClick={() => setIsLogModalOpen(true)}
                    className="kr-btn-gold px-4 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2"
                  >
                    <PlusCircle className="w-4 h-4" />
                    <span>Log Activity ⚡</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('leaderboards')}
                    className="px-4 py-2.5 rounded-xl bg-[#2D1B0F] hover:bg-[#3D2515] text-amber-200 font-semibold text-sm border border-[#552F15] transition-colors"
                  >
                    Leaderboards
                  </button>
                </div>
              </div>

              {/* Point Multiplier Formula Showcase Bar (Clean Pills Strip) */}
              <div className="mt-5 pt-4 border-t border-[#4A2812] flex flex-wrap items-center gap-2 text-xs">
                <span className="text-amber-400 font-semibold flex items-center gap-1 mr-1">
                  <Zap className="w-3.5 h-3.5" /> Formula Ratios:
                </span>
                <div className="px-2.5 py-1 rounded-lg bg-[#1A1009] border border-[#452612] text-amber-200/90 font-medium">
                  🏊 Swim <span className="text-amber-400 font-bold">30.0</span> pts/km
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-[#1A1009] border border-[#452612] text-amber-200/90 font-medium">
                  🏃 Run <span className="text-amber-400 font-bold">10.0</span> pts/km
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-[#1A1009] border border-[#452612] text-amber-200/90 font-medium">
                  🚴 Cycle <span className="text-amber-400 font-bold">3.0</span> pts/km
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-[#1A1009] border border-[#452612] text-amber-200/90 font-medium">
                  🤸 Pull-ups <span className="text-amber-400 font-bold">3.0</span> pts/rep
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-[#1A1009] border border-[#452612] text-amber-200/90 font-medium">
                  🏋️ Lifts <span className="text-amber-400 font-bold">0.05</span> / kg-rep
                </div>
              </div>
            </div>

            {/* Performance Analytics & Velocity */}
            <AnalyticsCharts user={user} />

            {/* Live Feed & Quests Column */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <ActivityFeed />
              </div>
              <div className="space-y-6">
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
      <footer className="mt-auto border-t border-[#452612] bg-[#140D08] py-5 text-center text-xs text-amber-200/60">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-amber-300 font-bold">🛡️ ApexMetrics</span>
            <span>•</span>
            <span>Kingdom of Champions • Fair Multi-Discipline Scoring</span>
          </div>
          <div className="flex items-center gap-3 text-amber-400/80 font-mono text-[11px]">
            <span>TLS 1.3</span>
            <span>•</span>
            <span>REDIS ZSET</span>
            <span>•</span>
            <span>SOCKET.IO SYNC</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
