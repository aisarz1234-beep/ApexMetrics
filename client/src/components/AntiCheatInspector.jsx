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
        <h2 className="text-3xl font-black text-amber-200 tracking-tight flex items-center gap-2">
          <ShieldAlert className="w-7 h-7 text-amber-400" />
          Anti-Cheat & Security Inspector
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-500 font-bold uppercase">
            Engine Active
          </span>
        </h2>
        <p className="text-xs text-amber-100/70">
          Algorithmic heuristic vetting, cryptographic GPX/FIT file verification, and community audits
        </p>
      </div>

      {/* Security Pillars */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="p-4 rounded-2xl kr-wood-panel border-2 border-[#5C3317] space-y-1.5">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase">
            <Lock className="w-4 h-4" />
            TLS 1.3 Encryption
          </div>
          <div className="text-sm text-amber-100 font-black">Encrypted In-Transit</div>
          <p className="text-xs text-amber-200/70 leading-snug">
            Hermetic SSL transport safeguards every athlete record across the platform.
          </p>
        </div>

        <div className="p-4 rounded-2xl kr-wood-panel border-2 border-[#5C3317] space-y-1.5">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase">
            <KeyRound className="w-4 h-4" />
            Salted Bcrypt Seal
          </div>
          <div className="text-sm text-amber-100 font-black">Secure JWT Tokens</div>
          <p className="text-xs text-amber-200/70 leading-snug">
            Signed JWT credential tokens mitigate unauthorized request manipulation.
          </p>
        </div>

        <div className="p-4 rounded-2xl kr-wood-panel border-2 border-[#5C3317] space-y-1.5">
          <div className="flex items-center gap-2 text-emerald-400 font-bold text-xs uppercase">
            <FileCheck className="w-4 h-4" />
            Smartwatch Parser
          </div>
          <div className="text-sm text-amber-100 font-black">Cryptographic GPS</div>
          <p className="text-xs text-amber-200/70 leading-snug">
            Haversine geometry validates authentic paces and flags vehicular speeds.
          </p>
        </div>

        <div className="p-4 rounded-2xl kr-wood-panel border-2 border-[#5C3317] space-y-1.5">
          <div className="flex items-center gap-2 text-amber-400 font-bold text-xs uppercase">
            <Radio className="w-4 h-4" />
            Rate Limit & IDOR
          </div>
          <div className="text-sm text-amber-100 font-black">Strict Verification</div>
          <p className="text-xs text-amber-200/70 leading-snug">
            Strict athlete identity validation ensures no user can tamper with another's score.
          </p>
        </div>
      </div>

      {/* Strava Integration Card */}
      <div className="p-6 rounded-2xl kr-wood-panel border-3 border-[#8D5B29] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-kr-card">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-b from-orange-500 to-orange-700 border-2 border-amber-300 flex items-center justify-center text-3xl font-black text-white shadow-lg">
            S
          </div>
          <div>
            <div className="text-xl font-black text-amber-100">
              Strava Integration (Certified GPS Workouts)
            </div>
            <div className="text-xs text-amber-200/80">
              Synchronize authentic satellite runs and rides directly to eliminate self-reported claims.
            </div>
          </div>
        </div>

        {user?.stravaLinked ? (
          <div className="px-4 py-2 rounded-xl bg-emerald-950 border-2 border-emerald-500 text-emerald-300 font-black text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Account Linked & Certified
          </div>
        ) : (
          <button
            onClick={connectStrava}
            className="kr-btn-gold px-5 py-2.5 rounded-xl text-xs font-black shadow-kr-button whitespace-nowrap"
          >
            Connect Strava Account ⚡
          </button>
        )}
      </div>

      {/* Flagged Workouts / Audit Queue */}
      <div className="p-6 rounded-2xl kr-stone-card border-3 border-[#5C3317] space-y-4">
        <div className="flex items-center justify-between border-b-2 border-[#5C3317] pb-3">
          <div>
            <h3 className="text-xl font-black text-amber-200 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              Community Audit Feed (Anomalous Workout Reviews)
            </h3>
            <p className="text-xs text-amber-100/70">
              Peer audits for workouts exceeding human velocity, cadence, or volume thresholds
            </p>
          </div>
          <button
            onClick={fetchFlaggedFeed}
            className="p-2 rounded-xl bg-[#241409] border border-[#5C3317] text-amber-300 hover:text-white"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="py-8 text-center text-amber-300 text-sm">
            Fetching flagged audit queue...
          </div>
        ) : flaggedWorkouts.length === 0 ? (
          <div className="py-8 text-center p-6 rounded-2xl bg-[#1A0E06] border-2 border-[#5C3317] text-amber-200/80 text-sm">
            <ShieldCheck className="w-10 h-10 text-emerald-400 mx-auto mb-2" />
            No anomalous workouts currently flagged in the review queue. All registered activities are certified authentic!
          </div>
        ) : (
          <div className="space-y-3">
            {flaggedWorkouts.map(log => (
              <div
                key={log.id}
                className="p-4 rounded-xl bg-[#241409] border-2 border-red-500 space-y-3 shadow-md"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-black text-sm text-amber-100">
                    <span>{log.userAvatar}</span>
                    <span>{log.userName}</span>
                    <span className="text-xs px-2 py-0.5 rounded bg-[#180A04] text-amber-300">
                      {log.activityType}
                    </span>
                  </div>
                  <span className="text-xs px-3 py-1 rounded-full bg-red-950 border border-red-500 text-red-300 font-black">
                    Under Review
                  </span>
                </div>

                <div className="space-y-1">
                  {log.flags?.map((f, i) => (
                    <div key={i} className="text-xs text-red-300 flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                      <span>{f.message}</span>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-[#5C3317] text-xs">
                  <span className="text-amber-200/70 font-bold">
                    Peer Votes: {log.peerVotes?.verify || 0} Verified / {log.peerVotes?.reject || 0} Rejected
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleVote(log.id, 'verify')}
                      className="px-3 py-1.5 rounded-xl bg-emerald-950 border border-emerald-500 text-emerald-300 font-bold flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Verify Workout</span>
                    </button>
                    <button
                      onClick={() => handleVote(log.id, 'reject')}
                      className="px-3 py-1.5 rounded-xl bg-red-950 border border-red-500 text-red-300 font-bold flex items-center gap-1"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      <span>Reject Workout</span>
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
