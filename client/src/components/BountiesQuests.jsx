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
    <div className="space-y-6">
      {/* Bounty Board Header */}
      <div>
        <h2 className="text-3xl font-black text-amber-200 tracking-tight flex items-center gap-2">
          <Scroll className="w-7 h-7 text-amber-400" />
          Dynamic Bounties & Daily Quests
          <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500 font-bold uppercase">
            Active Multipliers
          </span>
        </h2>
        <p className="text-xs text-amber-100/70">
          Complete daily fitness challenges to earn bonus standardized points and multipliers
        </p>
      </div>

      {/* Quests Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {bounties.map(bounty => {
          const isClaimed = bounty.claimedBy?.includes(user?.id);

          return (
            <div
              key={bounty.id}
              className={`p-6 rounded-2xl border-3 flex flex-col justify-between transition-all relative ${
                isClaimed
                  ? 'border-emerald-600/50 bg-[#162419]/90'
                  : 'border-[#5C3317] bg-[#241409] hover:border-amber-400 shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="text-xs font-black px-2.5 py-0.5 rounded-md bg-[#382012] text-amber-300 border border-[#78350F] uppercase">
                    {bounty.category} Quest
                  </span>
                  <div className="flex items-center gap-1 text-xs text-amber-300/80">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Expires: {bounty.expiresIn}</span>
                  </div>
                </div>

                <h3 className="text-xl font-black text-amber-100">{bounty.title}</h3>
                <p className="text-xs text-amber-100/80 mt-1 leading-relaxed">
                  {bounty.description}
                </p>

                {/* Reward Badge */}
                <div className="flex items-center gap-2 mt-4 p-2.5 rounded-xl bg-[#1A0E06] border border-[#5C3317] text-xs font-bold">
                  <Flame className="w-4 h-4 text-amber-400" />
                  <span className="text-amber-300">
                    Reward: +{bounty.rewardPoints} PTS & {bounty.multiplier}x Multiplier (⭐⭐⭐)
                  </span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-5 pt-4 border-t border-[#5C3317] flex items-center justify-between">
                {isClaimed ? (
                  <span className="text-xs font-black text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" /> Bounty Claimed (+{bounty.rewardPoints} pts)
                  </span>
                ) : (
                  <>
                    <button
                      onClick={onOpenLogModal}
                      className="text-xs text-amber-400 hover:text-amber-300 font-bold underline"
                    >
                      Log required activity →
                    </button>
                    <button
                      onClick={() => handleClaim(bounty.id)}
                      disabled={claimingId === bounty.id}
                      className="kr-btn-gold px-4 py-2 rounded-xl text-xs font-black shadow-kr-button"
                    >
                      {claimingId === bounty.id ? 'Claiming...' : 'Claim Bounty ⭐'}
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
