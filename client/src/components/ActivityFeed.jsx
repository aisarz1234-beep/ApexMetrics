import React, { useState, useEffect } from 'react';
import { api } from '../utils/api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useSocket } from '../context/SocketContext.jsx';
import {
  Heart,
  MessageSquare,
  ShieldCheck,
  Zap,
  MapPin,
  Send,
  Flame,
  Award,
  Clock
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

  const getActivityIcon = (cat, type) => {
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
      {/* Category Filter Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="text-xl font-extrabold text-white flex items-center gap-2">
          <Zap className="w-5 h-5 text-cyan-400" />
          Community Activity Feed
        </h3>

        <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl text-xs">
          {['all', 'cardio', 'calisthenics', 'strength', 'sports'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1 rounded-lg font-semibold capitalize transition-all ${
                filterCategory === cat
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Feed List */}
      <div className="space-y-4">
        {loading ? (
          <div className="py-12 text-center text-slate-500 font-medium">
            Loading recent community athletic logs...
          </div>
        ) : workouts.length === 0 ? (
          <div className="py-12 text-center text-slate-500 font-medium">
            No activity logs found for this filter.
          </div>
        ) : (
          workouts.map(item => {
            const hasGivenKudos = item.kudos?.includes(user?.id);
            const isCommentsOpen = activeCommentId === item.id;

            return (
              <div
                key={item.id}
                className="p-5 rounded-2xl bg-[#111827] border border-slate-800 hover:border-slate-700/80 transition-all space-y-4"
              >
                {/* Header: User Profile & Verification Badge */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-xl">
                      {item.userAvatar || '⚡'}
                    </div>
                    <div>
                      <div className="font-extrabold text-sm text-white flex items-center gap-2">
                        {item.userName}
                        <span className="text-[10px] px-2 py-0.2 rounded bg-slate-800 text-cyan-400 font-bold border border-slate-700">
                          {item.userClass}
                        </span>
                      </div>
                      <div className="text-[11px] text-slate-400 flex items-center gap-1.5 mt-0.5">
                        <span className="font-medium">{item.team}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-slate-500" />
                          {item.zone}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Anti-Cheat / Verification Badge */}
                  <div className="text-right">
                    <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg border flex items-center gap-1 ${
                      item.verificationStatus === 'verified'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : item.verificationStatus === 'flagged_review'
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30'
                    }`}>
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {item.verificationBadge || 'Self-Reported'}
                    </span>
                  </div>
                </div>

                {/* Workout Metrics Card */}
                <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800/80 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">
                      {getActivityIcon(item.activityCategory, item.activityType)}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-white uppercase tracking-wider">
                        {item.exerciseName || item.sportName || item.activityType?.replace('_', ' ')}
                      </div>
                      <div className="text-xs text-slate-300 font-mono mt-0.5">
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
                    <div className="text-lg font-black text-cyan-300 tracking-tight">
                      +{Math.round(item.points * 10) / 10} <span className="text-xs font-bold text-slate-400">PTS</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono">
                      {item.breakdown?.formula || ''}
                    </div>
                  </div>
                </div>

                {/* Social Interactions: Kudos & Comments */}
                <div className="flex items-center justify-between pt-1 text-xs">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => handleKudos(item.id)}
                      className={`flex items-center gap-1.5 font-bold transition-all px-2.5 py-1 rounded-lg ${
                        hasGivenKudos
                          ? 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                          : 'text-slate-400 hover:text-white hover:bg-slate-800'
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${hasGivenKudos ? 'fill-rose-500 text-rose-500' : ''}`} />
                      <span>{item.kudos?.length || 0} Kudos</span>
                    </button>

                    <button
                      onClick={() => setActiveCommentId(isCommentsOpen ? null : item.id)}
                      className="flex items-center gap-1.5 text-slate-400 hover:text-white font-medium px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors"
                    >
                      <MessageSquare className="w-4 h-4" />
                      <span>{item.comments?.length || 0} Comments</span>
                    </button>
                  </div>

                  <span className="text-[11px] text-slate-500">
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                {/* Comment Drawer */}
                {isCommentsOpen && (
                  <div className="pt-3 border-t border-slate-800 space-y-3">
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                      {item.comments?.length === 0 ? (
                        <div className="text-[11px] text-slate-500 italic">No comments yet. Leave positive kudos!</div>
                      ) : (
                        item.comments?.map(c => (
                          <div key={c.id} className="p-2 rounded-lg bg-slate-900 text-xs">
                            <span className="font-bold text-cyan-400">{c.userName}: </span>
                            <span className="text-slate-300">{c.text}</span>
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
                        className="flex-1 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                      <button
                        onClick={() => handleSendComment(item.id)}
                        className="p-2 rounded-lg bg-cyan-500 text-black hover:bg-cyan-400 font-bold transition-all"
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
