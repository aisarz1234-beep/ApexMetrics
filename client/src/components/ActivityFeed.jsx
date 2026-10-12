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

  return (
    <div className="space-y-6">
      {/* Feed Filters */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-2xl font-black text-amber-200 flex items-center gap-2">
          <Zap className="w-6 h-6 text-amber-400" />
          Community Activity Feed
        </h3>

        <div className="flex items-center gap-1 p-1 bg-[#241409] border-2 border-[#5C3317] rounded-xl text-xs font-bold">
          {['all', 'cardio', 'calisthenics', 'strength', 'sports'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all ${
                filterCategory === cat
                  ? 'kr-btn-gold text-stone-900 shadow-sm'
                  : 'text-amber-200/70 hover:text-amber-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Workouts Feed List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-12 text-center text-amber-300 font-bold">
            Loading recent community athletic logs...
          </div>
        ) : workouts.length === 0 ? (
          <div className="py-12 text-center text-amber-300/80 font-bold">
            No activity logs found for this filter.
          </div>
        ) : (
          workouts.map(item => {
            const hasGivenKudos = item.kudos?.includes(user?.id);
            const isCommentsOpen = activeCommentId === item.id;

            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl kr-wood-panel border-2 border-[#5C3317] hover:border-amber-500/70 transition-all space-y-4"
              >
                {/* Header: User Profile & Verification Seal */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-[#241409] border-2 border-amber-500/60 flex items-center justify-center text-2xl shadow-inner">
                      {item.userAvatar || '🛡️'}
                    </div>
                    <div>
                      <div className="font-black text-base text-amber-100 flex items-center gap-2">
                        {item.userName}
                        <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-[#180A04] text-amber-300 border border-amber-600">
                          {item.userClass}
                        </span>
                      </div>
                      <div className="text-xs text-amber-200/80 flex items-center gap-2 mt-0.5 font-medium">
                        <span className="font-bold text-amber-300">{item.team}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-amber-400" />
                          {item.zone}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Verification Badge */}
                  <div>
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-xl border flex items-center gap-1 ${
                      item.verificationStatus === 'verified'
                        ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500'
                        : item.verificationStatus === 'flagged_review'
                        ? 'bg-red-950/80 text-red-300 border-red-500'
                        : 'bg-amber-950/80 text-amber-300 border-amber-500'
                    }`}>
                      <ShieldCheck className="w-4 h-4" />
                      {item.verificationBadge || 'Self-Reported'}
                    </span>
                  </div>
                </div>

                {/* Workout Metrics Box */}
                <div className="p-4 rounded-xl bg-[#1A0E06] border-2 border-[#4A260F] flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">
                      {getDisciplineIcon(item.activityCategory, item.activityType)}
                    </span>
                    <div>
                      <div className="text-xs font-black text-amber-300 uppercase tracking-wider">
                        {item.exerciseName || item.sportName || item.activityType?.replace('_', ' ')}
                      </div>
                      <div className="text-sm text-amber-100 font-bold mt-0.5">
                        {item.activityCategory === 'cardio' && `${item.metrics?.distanceKm} km in ${item.metrics?.durationMinutes} mins`}
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
                    <div className="text-2xl font-black text-amber-300 tracking-tight">
                      +{Math.round(item.points * 10) / 10} <span className="text-xs font-bold text-amber-200/70">PTS</span>
                    </div>
                    <div className="text-[10px] text-amber-200/60 font-mono">
                      {item.breakdown?.formula || ''}
                    </div>
                  </div>
                </div>

                {/* Kudos & Comments (Clean Wording) */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleKudos(item.id)}
                      className={`flex items-center gap-1.5 font-bold transition-all px-3 py-1.5 rounded-xl border ${
                        hasGivenKudos
                          ? 'bg-red-950 border-red-500 text-red-300'
                          : 'border-[#5C3317] bg-[#241409] text-amber-200 hover:border-amber-400'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${hasGivenKudos ? 'fill-red-500 text-red-500' : ''}`} />
                      <span>{item.kudos?.length || 0} Kudos</span>
                    </button>

                    <button
                      onClick={() => setActiveCommentId(isCommentsOpen ? null : item.id)}
                      className="flex items-center gap-1.5 text-amber-200/80 hover:text-amber-100 font-bold px-3 py-1.5 rounded-xl bg-[#241409] border border-[#5C3317] hover:border-amber-500 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{item.comments?.length || 0} Comments</span>
                    </button>
                  </div>

                  <span className="text-xs text-amber-200/60 font-mono">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Comment Drawer */}
                {isCommentsOpen && (
                  <div className="pt-3 border-t-2 border-[#5C3317] space-y-3">
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {item.comments?.length === 0 ? (
                        <div className="text-xs text-amber-200/60 italic">No comments yet. Leave positive kudos!</div>
                      ) : (
                        item.comments?.map(c => (
                          <div key={c.id} className="p-2.5 rounded-xl bg-[#1A0E06] border border-[#5C3317] text-xs">
                            <span className="font-black text-amber-300">{c.userName}: </span>
                            <span className="text-amber-100">{c.text}</span>
                          </div>
                        ))
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Cheer on your training partner..."
                        value={commentText}
                        onChange={e => setCommentText(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleSendComment(item.id)}
                        className="flex-1 px-3 py-2 rounded-xl bg-[#180A04] border-2 border-[#5C3317] text-xs text-amber-100 font-bold focus:outline-none focus:border-amber-400"
                      />
                      <button
                        onClick={() => handleSendComment(item.id)}
                        className="kr-btn-gold px-3.5 py-2 rounded-xl text-xs flex items-center justify-center shadow-sm"
                      >
                        <Send className="w-4 h-4" />
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
