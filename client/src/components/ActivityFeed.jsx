import React, { useState, useEffect } from 'react';
import { api } from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useSocket } from '../context/SocketContext.jsx';
import {
  Heart,
  MessageSquare,
  ShieldCheck,
  MapPin,
  Send,
  Zap,
  Sparkles
} from 'lucide-react';

export const ActivityFeed = () => {
  const { user } = useAuth();
  const { latestEvent } = useSocket();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCommentId, setActiveCommentId] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');

  const fetchWorkouts = async () => {
    try {
      setLoading(true);
      const res = await api.getWorkouts({ category: filterCategory });
      setWorkouts(res.workouts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWorkouts();
  }, [filterCategory]);

  useEffect(() => {
    if (latestEvent?.type === 'workout:new') {
      fetchWorkouts();
    } else if (latestEvent?.type === 'workout:kudos') {
      setWorkouts(prev =>
        prev.map(w =>
          w.id === latestEvent.data.workoutId
            ? { ...w, kudos: latestEvent.data.kudos }
            : w
        )
      );
    } else if (latestEvent?.type === 'workout:comment') {
      setWorkouts(prev =>
        prev.map(w =>
          w.id === latestEvent.data.workoutId
            ? { ...w, comments: latestEvent.data.comments }
            : w
        )
      );
    }
  }, [latestEvent]);

  const handleKudos = async (workoutId) => {
    try {
      const res = await api.toggleKudos(workoutId);
      setWorkouts(prev =>
        prev.map(w => (w.id === workoutId ? res.workout : w))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const handleSendComment = async (workoutId) => {
    if (!commentText.trim()) return;
    try {
      const res = await api.addComment(workoutId, commentText);
      setWorkouts(prev =>
        prev.map(w => (w.id === workoutId ? res.workout : w))
      );
      setCommentText('');
    } catch (err) {
      console.error(err);
    }
  };

  const getDisciplineIcon = (cat, type) => {
    if (cat === 'cardio') {
      if (type === 'swimming') return '🏊‍♂️';
      if (type === 'cycling') return '🚴‍♂️';
      return '🏃‍♂️';
    }
    if (cat === 'strength') return '🏋️‍♂️';
    if (cat === 'calisthenics') return '🤸‍♂️';
    return '⚡';
  };

  const getCategoryBadgeClass = (cat) => {
    if (cat === 'cardio') return 'badge-cardio';
    if (cat === 'strength') return 'badge-strength';
    if (cat === 'calisthenics') return 'badge-calisthenics';
    return 'badge-sports';
  };

  return (
    <div className="space-y-4">
      {/* Feed Filters Header */}
      <div className="flex items-center justify-between flex-wrap gap-2.5">
        <h3 className="text-xl font-bold text-amber-100 flex items-center gap-2">
          <Zap className="w-5 h-5 text-amber-400" />
          Community Activity Feed
        </h3>

        <div className="flex items-center gap-1 p-1 bg-[#1A1009] border border-[#482813] rounded-xl text-xs font-semibold">
          {['all', 'cardio', 'calisthenics', 'strength', 'sports'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                filterCategory === cat
                  ? 'bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40 shadow-sm'
                  : 'text-amber-200/70 hover:text-amber-100 border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Workouts Feed List */}
      <div className="space-y-3.5">
        {loading ? (
          <div className="py-12 text-center text-amber-200/70 font-medium text-sm">
            Loading recent community athletic logs...
          </div>
        ) : workouts.length === 0 ? (
          <div className="py-12 text-center text-amber-200/60 font-medium text-sm">
            No activity logs found for this filter.
          </div>
        ) : (
          workouts.map(item => {
            const hasGivenKudos = item.kudos?.includes(user?.id);
            const isCommentsOpen = activeCommentId === item.id;

            return (
              <div
                key={item.id}
                className="p-4 sm:p-5 rounded-2xl kr-wood-panel hover:border-amber-500/50 transition-all space-y-3.5"
              >
                {/* Header: Athlete & Verification Status */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#1B1008] border border-amber-500/40 flex items-center justify-center text-xl shadow-inner">
                      {item.userAvatar || '🛡️'}
                    </div>
                    <div>
                      <div className="font-bold text-sm sm:text-base text-amber-100 flex items-center gap-2">
                        {item.userName}
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#160E08] text-amber-300 border border-amber-600/50">
                          {item.userClass}
                        </span>
                      </div>
                      <div className="text-xs text-amber-200/70 flex items-center gap-1.5 mt-0.5 font-medium">
                        <span className="text-amber-300/90">{item.team}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-amber-200/60">
                          <MapPin className="w-3 h-3 text-amber-400" />
                          {item.zone}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Verification Pill */}
                  <div>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-lg border flex items-center gap-1 ${
                      item.verificationStatus === 'verified'
                        ? 'bg-emerald-950/60 text-emerald-300 border-emerald-500/40'
                        : item.verificationStatus === 'flagged_review'
                        ? 'bg-red-950/60 text-red-300 border-red-500/40'
                        : 'bg-amber-950/60 text-amber-300 border-amber-500/40'
                    }`}>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {item.verificationBadge || 'Self-Reported'}
                    </span>
                  </div>
                </div>

                {/* Workout Metrics Box */}
                <div className="p-3 sm:p-3.5 rounded-xl bg-[#180E08] border border-[#3E2211] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl sm:text-3xl">
                      {getDisciplineIcon(item.activityCategory, item.activityType)}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${getCategoryBadgeClass(item.activityCategory)}`}>
                          {item.activityCategory}
                        </span>
                        <span className="text-xs font-bold text-amber-100">
                          {item.exerciseName || item.sportName || item.activityType?.replace('_', ' ')}
                        </span>
                      </div>
                      <div className="text-xs text-amber-200/80 font-medium mt-1">
                        {item.activityCategory === 'cardio' && `${item.metrics?.distanceKm} km • ${item.metrics?.durationMinutes} mins`}
                        {item.activityCategory === 'calisthenics' && (
                          item.activityType === 'plank'
                            ? `${item.metrics?.durationSeconds} seconds plank`
                            : `${item.metrics?.reps} total reps`
                        )}
                        {item.activityCategory === 'strength' && `${item.metrics?.weightKg} kg × ${item.metrics?.reps} reps (${item.metrics?.sets} sets)`}
                        {item.activityCategory === 'sports' && `${item.metrics?.durationMinutes} mins (${item.metrics?.intensity})`}
                      </div>
                    </div>
                  </div>

                  {/* Standardized Points Awarded */}
                  <div className="text-right">
                    <div className="text-xl sm:text-2xl font-extrabold text-amber-300 tracking-tight">
                      +{Math.round(item.points * 10) / 10} <span className="text-xs font-bold text-amber-200/60">PTS</span>
                    </div>
                    <div className="text-[10px] text-amber-200/50 font-mono mt-0.5">
                      {item.breakdown?.formula || ''}
                    </div>
                  </div>
                </div>

                {/* Kudos & Comments Actions */}
                <div className="flex items-center justify-between pt-0.5 text-xs">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleKudos(item.id)}
                      className={`flex items-center gap-1.5 font-semibold transition-all px-2.5 py-1 rounded-lg border text-xs ${
                        hasGivenKudos
                          ? 'bg-red-950/70 border-red-500/60 text-red-300'
                          : 'border-[#4A2914] bg-[#1A1009] text-amber-200/80 hover:border-amber-400/60 hover:text-amber-100'
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${hasGivenKudos ? 'fill-red-500 text-red-500' : ''}`} />
                      <span>{item.kudos?.length || 0} Kudos</span>
                    </button>

                    <button
                      onClick={() => setActiveCommentId(isCommentsOpen ? null : item.id)}
                      className="flex items-center gap-1.5 text-amber-200/70 hover:text-amber-100 font-semibold px-2.5 py-1 rounded-lg bg-[#1A1009] border border-[#4A2914] hover:border-amber-400/60 transition-colors text-xs"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{item.comments?.length || 0} Comments</span>
                    </button>
                  </div>

                  <span className="text-[11px] text-amber-200/50 font-mono">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Comment Drawer */}
                {isCommentsOpen && (
                  <div className="pt-3 border-t border-[#452612] space-y-2.5">
                    <div className="space-y-1.5 max-h-48 overflow-y-auto">
                      {item.comments?.length === 0 ? (
                        <div className="text-xs text-amber-200/50 italic py-1">No comments yet. Leave a cheer!</div>
                      ) : (
                        item.comments?.map(c => (
                          <div key={c.id} className="p-2 rounded-lg bg-[#180F08] border border-[#3E2211] text-xs">
                            <span className="font-bold text-amber-300">{c.userName}: </span>
                            <span className="text-amber-100/90">{c.text}</span>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Cheer on this champion..."
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSendComment(item.id)}
                        className="flex-1 px-3 py-1.5 rounded-lg bg-[#150E09] border border-[#482813] text-xs text-amber-100 focus:outline-none focus:border-amber-400"
                      />
                      <button
                        onClick={() => handleSendComment(item.id)}
                        className="kr-btn-gold px-3 py-1.5 rounded-lg text-xs flex items-center justify-center"
                      >
                        <Send className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
