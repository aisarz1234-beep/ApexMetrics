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
  RefreshCw,
  Scroll
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
      alert(err.message || 'Error recording inquisition vote.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Anti-Cheat Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-amber-100 tracking-tight flex items-center gap-2">
          <ShieldAlert className="w-6 h-6 text-amber-400" />
          Anti-Cheat & Security Inspector
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 font-semibold uppercase">
            Engine Active
          </span>
        </h2>
        <p className="text-xs text-amber-200/60 mt-0.5">
          Algorithmic heuristic vetting, cryptographic GPX file verification, and community audits
        </p>
      </div>

      {/* Security Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-xl kr-wood-panel space-y-1">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase">
            <Lock className="w-3.5 h-3.5" />
            TLS 1.3 Transport
          </div>
          <div className="text-sm text-amber-100 font-bold">Encrypted In-Transit</div>
          <p className="text-xs text-amber-200/70 leading-snug">
            Hermetic SSL transport safeguards every athlete record across the platform.
          </p>
        </div>

        <div className="p-4 rounded-xl kr-wood-panel space-y-1">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase">
            <KeyRound className="w-3.5 h-3.5" />
            Salted Bcrypt Seal
          </div>
          <div className="text-sm text-amber-100 font-bold">Secure JWT Tokens</div>
          <p className="text-xs text-amber-200/70 leading-snug">
            Signed JWT credential tokens mitigate unauthorized request manipulation.
          </p>
        </div>

        <div className="p-4 rounded-xl kr-wood-panel space-y-1">
          <div className="flex items-center gap-2 text-emerald-400 font-semibold text-xs uppercase">
            <FileCheck className="w-3.5 h-3.5" />
            Smartwatch Parser
          </div>
          <div className="text-sm text-amber-100 font-bold">Cryptographic GPS</div>
          <p className="text-xs text-amber-200/70 leading-snug">
            Haversine geometry validates authentic paces and flags vehicular speeds.
          </p>
        </div>

        <div className="p-4 rounded-xl kr-wood-panel space-y-1">
          <div className="flex items-center gap-2 text-amber-400 font-semibold text-xs uppercase">
            <Radio className="w-3.5 h-3.5" />
            Rate Limit & IDOR
          </div>
          <div className="text-sm text-amber-100 font-bold">Strict Verification</div>
          <p className="text-xs text-amber-200/70 leading-snug">
            Strict athlete identity validation ensures no user can tamper with another's score.
          </p>
        </div>
      </div>

      {/* Strava Integration Card */}
      <div className="p-5 sm:p-6 rounded-2xl kr-wood-panel flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-b from-orange-500 to-orange-700 border border-orange-400/80 flex items-center justify-center text-2xl font-bold text-white shadow-md">
            S
          </div>
          <div>
            <div className="text-base sm:text-lg font-bold text-amber-100">
              Strava Integration (Certified GPS Workouts)
            </div>
            <div className="text-xs text-amber-200/70 mt-0.5">
              Synchronize authentic satellite runs and rides directly to eliminate self-reported claims.
            </div>
          </div>
        </div>

        {user?.stravaLinked ? (
          <div className="px-3.5 py-1.5 rounded-xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-300 font-bold text-xs flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            Account Linked & Certified
          </div>
        ) : (
          <button
            onClick={connectStrava}
            className="kr-btn-gold px-4 py-2 rounded-xl text-xs font-bold shadow-sm whitespace-nowrap"
          >
            Connect Strava Account ⚡
          </button>
        )}
      </div>

      {/* Flagged Workouts / Audit Queue */}
      <div className="p-5 sm:p-6 rounded-2xl kr-wood-panel space-y-4">
        <div className="flex items-center justify-between border-b border-[#432512] pb-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-amber-100 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              Community Audit Feed (Anomalous Workout Reviews)
            </h3>
            <p className="text-xs text-amber-200/60 mt-0.5">
              Peer audits for workouts exceeding human velocity, cadence, or volume thresholds
            </p>
          </div>
          <button
            onClick={fetchFlaggedFeed}
            className="p-1.5 rounded-lg bg-[#180E08] border border-[#3E2211] text-amber-300 hover:text-white"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>
        </div>

        {loading ? (
          <div className="py-8 text-center text-amber-200/70 text-xs">
            Fetching flagged audit queue...
          </div>
        ) : flaggedWorkouts.length === 0 ? (
          <div className="py-8 text-center p-5 rounded-xl bg-[#160E08] border border-[#3E2211] text-amber-200/70 text-xs">
            <ShieldCheck className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
            No anomalous workouts currently flagged in the review queue. All registered activities are certified authentic!
          </div>
        ) : (
          <div className="space-y-3">
            {flaggedWorkouts.map(log => (
              <div
                key={log.id}
                className="p-3.5 sm:p-4 rounded-xl bg-[#180E08] border border-red-500/50 space-y-2.5 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-xs sm:text-sm text-amber-100">
                    <span>{log.userAvatar}</span>
                    <span>{log.userName}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded bg-[#140C07] text-amber-300 font-semibold">
                      {log.activityType}
                    </span>
                  </div>
                  <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-red-950/80 border border-red-500/60 text-red-300 font-bold">
                    Under Review
                  </span>
                </div>

                <div className="space-y-1">
                  {log.flags?.map((f, i) => (
                    <div key={i} className="text-xs text-red-300/90 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{f.message}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#3E2211] text-xs">
                  <span className="text-amber-200/60 font-medium">
                    Peer Votes: {log.peerVotes?.verify || 0} Verified / {log.peerVotes?.reject || 0} Rejected
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleVote(log.id, 'verify')}
                      className="px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-semibold flex items-center gap-1 text-xs"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verify</span>
                    </button>
                    <button
                      onClick={() => handleVote(log.id, 'reject')}
                      className="px-2.5 py-1 rounded-lg bg-red-950/80 border border-red-500/50 text-red-300 font-semibold flex items-center gap-1 text-xs"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject</span>
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
