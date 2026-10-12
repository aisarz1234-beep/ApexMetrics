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
  Star,
  Scroll
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
        particleCount: 110,
        spread: 80,
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
    <div className="space-y-4">
      {/* Bounty Board Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-amber-100 tracking-tight flex items-center gap-2">
          <Scroll className="w-5 h-5 text-amber-400" />
          Active Quests & Bounties
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-300 border border-amber-500/40 font-semibold uppercase">
            Bonus Multipliers
          </span>
        </h2>
        <p className="text-xs text-amber-200/60 mt-0.5">
          Complete daily fitness challenges to earn bonus points and multipliers
        </p>
      </div>

      {/* Quests List */}
      <div className="space-y-3">
        {bounties.map(bounty => {
          const isClaimed = bounty.claimedBy?.includes(user?.id);

          return (
            <div
              key={bounty.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all flex flex-col justify-between ${
                isClaimed
                  ? 'border-emerald-600/40 bg-[#142318]/80'
                  : 'kr-wood-panel hover:border-amber-500/50'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#1B1008] text-amber-300 border border-amber-600/40 uppercase">
                    {bounty.category} Quest
                  </span>
                  <div className="flex items-center gap-1 text-[11px] text-amber-200/60 font-medium">
                    <Clock className="w-3 h-3 text-amber-400" />
                    <span>Expires: {bounty.expiresIn}</span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-amber-100">{bounty.title}</h3>
                <p className="text-xs text-amber-200/70 mt-1 leading-relaxed">
                  {bounty.description}
                </p>

                {/* Reward Badge */}
                <div className="flex items-center gap-2 mt-3 p-2 rounded-xl bg-[#180E08] border border-[#3E2211] text-xs font-medium">
                  <Flame className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <span className="text-amber-300 font-semibold">
                    +{bounty.rewardPoints} PTS & {bounty.multiplier}x Multiplier
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-[#432512] flex items-center justify-between text-xs">
                {isClaimed ? (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Claimed (+{bounty.rewardPoints} pts)
                  </span>
                ) : (
                  <>
                    <button
                      onClick={onOpenLogModal}
                      className="text-amber-400 hover:text-amber-300 font-medium hover:underline"
                    >
                      Log required workout →
                    </button>
                    <button
                      disabled={claimingId === bounty.id}
                      onClick={() => handleClaim(bounty.id)}
                      className="kr-btn-gold px-3.5 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" />
                      <span>{claimingId === bounty.id ? 'Claiming...' : 'Claim Reward'}</span>
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
