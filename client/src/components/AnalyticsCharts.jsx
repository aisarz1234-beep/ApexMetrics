import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { TrendingUp, PieChart as PieIcon, Award } from 'lucide-react';

export const AnalyticsCharts = ({ workouts, user }) => {
  // 1. Process 7-day point trajectory
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const trendData = days.map((day, idx) => ({
    day,
    points: [45, 90, 160, 240, 310, 480, Math.round(user?.weeklyPoints || 680)][idx]
  }));

  // 2. Process Discipline Distribution
  const disciplineData = [
    { name: 'Cardio', value: 42, color: '#06B6D4' },
    { name: 'Strength', value: 28, color: '#F59E0B' },
    { name: 'Calisthenics', value: 18, color: '#8B5CF6' },
    { name: 'Sports & HIIT', value: 12, color: '#10B981' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 7-Day Performance Trend */}
      <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-cyan-400" />
              Weekly Point Velocity
            </h3>
            <p className="text-[11px] text-slate-400">Cumulative normalized score trajectory</p>
          </div>
          <span className="text-xs font-mono font-bold text-cyan-400 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/30">
            +{Math.round(user?.weeklyPoints || 680)} PTS
          </span>
        </div>

        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="pointGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#06B6D4" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" />
              <XAxis dataKey="day" stroke="#64748B" fontSize={11} />
              <YAxis stroke="#64748B" fontSize={11} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0F172A',
                  borderColor: '#334155',
                  borderRadius: '0.75rem',
                  fontSize: '12px'
                }}
              />
              <Area
                type="monotone"
                dataKey="points"
                stroke="#06B6D4"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#pointGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Discipline Distribution Breakdown */}
      <div className="p-6 rounded-2xl bg-[#111827] border border-slate-800 flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-violet-400" />
              Multi-Discipline Load Ratio
            </h3>
            <p className="text-[11px] text-slate-400">Cardiovascular vs Volume vs Rep Distribution</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 h-48">
          <div className="w-36 h-36">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={disciplineData}
                  cx="50%"
                  cy="50%"
                  innerRadius={36}
                  outerRadius={56}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {disciplineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 text-xs">
            {disciplineData.map(d => (
              <div key={d.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-slate-300 font-medium">{d.name}:</span>
                <span className="font-bold text-white font-mono">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
