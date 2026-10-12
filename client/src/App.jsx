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
  Scroll
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
      setToastMessage(`⚔️ ${w.userName} proclaimed a feat in ${w.activityType} (+${w.points} PTS)!`);
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
    setToastMessage(`🎉 Glory to the Kingdom! You earned +${data.workout?.points} standardized points!`);
    setTimeout(() => setToastMessage(''), 4500);
  };

  return (
    <div className="min-h-screen bg-[#120D08] text-amber-50 flex flex-col font-sans selection:bg-amber-500 selection:text-black">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-[#3D2210] border-2 border-amber-400 backdrop-blur-xl shadow-kr-gold text-amber-200 text-sm font-bold flex items-center gap-2 animate-bounce-subtle">
          <Shield className="w-5 h-5 text-amber-400 fill-amber-500" />
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
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Dashboard Overview */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {/* Grand Hero Banner */}
            <div className="kr-wood-panel p-6 sm:p-8 border-4 border-[#78350F] relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div>
                  <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase tracking-wider mb-1">
                    <Crown className="w-4 h-4 text-amber-400" />
                    Athletic Realm of Champions
                  </div>
                  <h1 className="text-3xl sm:text-5xl font-black text-amber-200 tracking-tight drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
                    Unified Multi-Discipline <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-amber-500 bg-clip-text text-transparent">Athletic Scoring</span>
                  </h1>
                  <p className="text-sm sm:text-base text-amber-100/90 mt-2 max-w-2xl leading-relaxed">
                    Compete fairly across running, swimming, cycling, calisthenics, and weightlifting with a normalized point engine and real-time leaderboards.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsLogModalOpen(true)}
                    className="kr-btn-gold px-6 py-3.5 rounded-2xl text-base font-black flex items-center gap-2 shadow-kr-button"
                  >
                    <PlusCircle className="w-5 h-5" />
                    <span>Log Activity ⚡</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('leaderboards')}
                    className="px-5 py-3 rounded-2xl bg-[#382012] hover:bg-[#4A2B19] text-amber-200 font-bold text-base border-2 border-[#5C3317] transition-colors"
                  >
                    Leaderboards
                  </button>
                </div>
              </div>

              {/* Point Multiplier Formula Showcase Bar */}
              <div className="mt-6 pt-6 border-t-2 border-[#5C3317] grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="p-3.5 rounded-xl bg-[#241409] border-2 border-[#5C3317]">
                  <div className="text-amber-300 font-bold text-xs">🏊 Swimming</div>
                  <div className="text-amber-400 font-mono font-black text-sm mt-0.5">30.0 pts / km</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#241409] border-2 border-[#5C3317]">
                  <div className="text-amber-300 font-bold text-xs">🏃 Running</div>
                  <div className="text-amber-400 font-mono font-black text-sm mt-0.5">10.0 pts / km</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#241409] border-2 border-[#5C3317]">
                  <div className="text-amber-300 font-bold text-xs">🤸 Pull-ups</div>
                  <div className="text-amber-400 font-mono font-black text-sm mt-0.5">3.0 pts / rep</div>
                </div>
                <div className="p-3.5 rounded-xl bg-[#241409] border-2 border-[#5C3317]">
                  <div className="text-amber-300 font-bold text-xs">🏋️ Compound Lifts</div>
                  <div className="text-amber-400 font-mono font-black text-sm mt-0.5">0.05 per kg-rep</div>
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
      <footer className="mt-auto border-t-4 border-[#5E3418] bg-[#1E0F07] py-6 text-center text-xs text-amber-200/70">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="text-amber-300 font-black text-sm">🛡️ ApexMetrics: Kingdom of Champions</span>
            <span>•</span>
            <span>Fair Multi-Discipline Scoring & Real-Time Leaderboards</span>
          </div>
          <div className="flex items-center gap-4 text-amber-400 font-mono text-[11px] font-bold">
            <span>TLS 1.3</span>
            <span>•</span>
            <span>REDIS ZSET ENGINE</span>
            <span>•</span>
            <span>SOCKET.IO REALM SYNC</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
