import React, { useState, useEffect } from 'react';
import { api } from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import confetti from 'canvas-confetti';
import {
  Sparkles,
  Award,
  Flame,
  CheckCircle2,
  Clock,
  Zap,
  TrendingUp
} from 'lucide-react';

export const BountiesQuests = ({ onOpenLogModal }) => {
  const { user, setUser } = useAuth();
  const [bounties, setBounties] = useState([]);
  const [claimingId, setClaimingId] = useState(null);

  const fetchBounties = async () => {
    try {
      const res = await api.getBounties();
      setBounties(res.bounties || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchBounties();
  }, []);

  const handleClaim = async (bountyId) => {
    try {
      setClaimingId(bountyId);
      const res = await api.claimBounty(bountyId);

      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });

      if (res.user) {
        setUser(res.user);
      }
      fetchBounties();
    } catch (err) {
      alert(err.message || 'Could not claim bounty.');
    } finally {
      setClaimingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-black text-white tracking-tight flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-amber-400" />
          Dynamic Bounties & Daily Quests
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold">
            Bonus Multipliers
          </span>
        </h2>
        <p className="text-xs text-slate-400">
          Complete rotating fitness challenges to activate bonus multipliers and earn extra standardized points
        </p>
      </div>

      {/* Bounties Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bounties.map(bounty => {
          const isClaimed = bounty.claimedBy?.includes(user?.id);

          return (
            <div
              key={bounty.id}
              className={`p-6 rounded-2xl border flex flex-col justify-between transition-all ${
                isClaimed
                  ? 'border-emerald-500/30 bg-emerald-950/10'
                  : 'border-slate-800 bg-[#111827] hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-slate-800 text-cyan-400 border border-slate-700 uppercase">
                    {bounty.category}
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Expires in {bounty.expiresIn}</span>
                  </div>
                </div>

                <h3 className="text-lg font-extrabold text-white">{bounty.title}</h3>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  {bounty.description}
                </p>

                {/* Reward Callout */}
                <div className="flex items-center gap-2 mt-4 p-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span className="font-bold text-amber-300">
                    Reward: +{bounty.rewardPoints} PTS & {bounty.multiplier}x Multiplier
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                {isClaimed ? (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Reward Claimed (+{bounty.rewardPoints} pts)
                  </span>
                ) : (
                  <>
                    <button
                      onClick={onOpenLogModal}
                      className="text-xs text-slate-400 hover:text-white underline"
                    >
                      Log required workout →
                    </button>
                    <button
                      onClick={() => handleClaim(bounty.id)}
                      disabled={claimingId === bounty.id}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs shadow-glow-gold transition-all transform active:scale-95"
                    >
                      {claimingId === bounty.id ? 'Claiming...' : 'Claim Bounty Reward ⚡'}
                    </button>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
