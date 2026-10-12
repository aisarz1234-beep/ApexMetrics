import React, { useState, useEffect } from 'react';
import { api } from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import {
  ShieldAlert,
  ShieldCheck,
  Lock,
  KeyRound,
  FileCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Radio,
  RefreshCw
} from 'lucide-react';

export const AntiCheatInspector = () => {
  const { user, connectStrava } = useAuth();
  const [flaggedWorkouts, setFlaggedWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFlaggedFeed = async () => {
    try {
      setLoading(true);
      const res = await api.getAntiCheatFeed();
      setFlaggedWorkouts(res.flaggedWorkouts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFlaggedFeed();
  }, []);

  const handleVote = async (workoutId, vote) => {
    try {
      await api.voteAntiCheat(workoutId, vote);
      fetchFlaggedFeed();
    } catch (err) {
      alert(err.message || 'Error recording vote.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-amber-400" />
          Hybrid Anti-Cheat & Production Security Engine
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold">
            Live Verifier
          </span>
        </h2>
        <p className="text-xs text-slate-400">
          Multi-layer algorithmic heuristic validation, GPX/FIT cryptographic inspection, and peer-review audits
        </p>
      </div>

      {/* Production Security Architecture Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 text-cyan-400 font-bold text-xs uppercase">
            <Lock className="w-4 h-4" />
            TLS 1.3 & HTTPS
          </div>
          <div className="text-xs text-white font-extrabold">Data In-Transit & At-Rest</div>
          <p className="text-[11px] text-slate-400">
            Enforced SSL termination and encrypted environment credential isolation.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 text-violet-400 font-bold text-xs uppercase">
            <KeyRound className="w-4 h-4" />
            Bcrypt & JWT Auth
          </div>
          <div className="text-xs text-white font-extrabold">Secure Session Mgmt</div>
          <p className="text-[11px] text-slate-400">
            Salted rounds password hashing with signed JWT claims preventing forgery.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase">
            <FileCheck className="w-4 h-4" />
            GPX/FIT Parser
          </div>
          <div className="text-xs text-white font-extrabold">Smartwatch GPS Verifier</div>
          <p className="text-[11px] text-slate-400">
            Haversine velocity sanity checks eliminate simulated or vehicular cardio logs.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 space-y-1.5">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase">
            <Radio className="w-4 h-4" />
            Rate Limiting & IDOR
          </div>
          <div className="text-xs text-white font-extrabold">Production Hardened</div>
          <p className="text-[11px] text-slate-400">
            Strict resource ownership verification and endpoint request throttling.
          </p>
        </div>
      </div>

      {/* Strava OAuth 2.0 Integration Status Card */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-slate-900 via-orange-950/20 to-slate-900 border border-orange-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-orange-600 flex items-center justify-center text-2xl font-black text-white shadow-lg">
            S
          </div>
          <div>
            <div className="text-sm font-extrabold text-white">Strava API OAuth 2.0 Synchronizer</div>
            <div className="text-xs text-slate-300">
              Auto-syncs verified GPS runs and rides directly from Strava to eliminate manual cardio claims.
            </div>
          </div>
        </div>

        {user?.stravaLinked ? (
          <div className="px-4 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Connected & Syncing GPS
          </div>
        ) : (
          <button
            onClick={connectStrava}
            className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-xs shadow-md transition-all active:scale-95 whitespace-nowrap"
          >
            Connect Strava Athlete Profile ⚡
          </button>
        )}
      </div>

      {/* Flagged Logs & Peer-Review Feed */}
      <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-extrabold text-white flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Peer-Review Activity Feed (Extreme Claim Audits)
            </h3>
            <p className="text-xs text-slate-400">
              Community audits for workouts exceeding human velocity, cadence, or volume thresholds
            </p>
          </div>
          <button
            onClick={fetchFlaggedFeed}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="py-8 text-center text-slate-500 text-xs font-medium">
            Checking audit queue...
          </div>
        ) : flaggedWorkouts.length === 0 ? (
          <div className="py-8 text-center p-6 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 text-xs">
            <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            No anomalous or suspicious workouts currently flagged in the audit queue. All incoming submissions are within verified bounds!
          </div>
        ) : (
          <div className="space-y-3">
            {flaggedWorkouts.map(log => (
              <div
                key={log.id}
                className="p-4 rounded-xl bg-slate-900 border border-rose-500/30 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm text-white">
                    <span>{log.userAvatar}</span>
                    <span>{log.userName}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-400">
                      {log.activityType}
                    </span>
                  </div>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-bold">
                    Flagged for Audit
                  </span>
                </div>

                {/* Flag Reasons */}
                <div className="space-y-1">
                  {log.flags?.map((f, i) => (
                    <div key={i} className="text-xs text-rose-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{f.message}</span>
                    </div>
                  ))}
                </div>

                {/* Community Voting */}
                <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                  <span className="text-slate-400 font-medium">
                    Community Votes: {log.peerVotes?.verify || 0} Verified / {log.peerVotes?.reject || 0} Rejected
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleVote(log.id, 'verify')}
                      className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verify Proof</span>
                    </button>
                    <button
                      onClick={() => handleVote(log.id, 'reject')}
                      className="px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 font-bold flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Confirm Fake</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
