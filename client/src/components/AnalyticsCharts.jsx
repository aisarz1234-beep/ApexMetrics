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
import { TrendingUp, PieChart as PieIcon, Crown } from 'lucide-react';

export const AnalyticsCharts = ({ workouts, user }) => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const trendData = days.map((day, idx) => ({
    day,
    points: [45, 95, 170, 260, 340, 520, Math.round(user?.weeklyPoints || 840)][idx]
  }));

  const disciplineData = [
    { name: 'Cardio', value: 42, color: '#16A34A', icon: '🏃' },
    { name: 'Strength', value: 28, color: '#DC2626', icon: '🏋️' },
    { name: 'Calisthenics', value: 18, color: '#9333EA', icon: '🤸' },
    { name: 'Sports & HIIT', value: 12, color: '#2563EB', icon: '⚡' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 7-Day Point Velocity */}
      <div className="p-6 rounded-2xl kr-wood-panel border-3 border-[#5C3317]">
        <div className="flex items-center justify-between mb-4 pb-2 border-b border-[#5C3317]">
          <div>
            <h3 className="text-lg font-black text-amber-200 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-400" />
              Weekly Point Velocity & Trend
            </h3>
            <p className="text-xs text-amber-100/70">Cumulative standardized score trajectory</p>
          </div>
          <span className="text-xs font-mono font-black text-amber-300 bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-500/40">
            +{Math.round(user?.weeklyPoints || 840)} PTS
          </span>
        </div>

        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="krPointGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.6} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#5C3317" />
              <XAxis dataKey="day" stroke="#FDE68A" fontSize={12} />
              <YAxis stroke="#FDE68A" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#241409',
                  borderColor: '#78350F',
                  borderRadius: '0.75rem',
                  fontSize: '13px',
                  color: '#FEF3C7',
                  fontFamily: 'Outfit, Inter, sans-serif'
                }}
              />
              <Area
                type="monotone"
                dataKey="points"
                stroke="#F59E0B"
                strokeWidth={3}
                fillOpacity={1}
                fill="url(#krPointGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Multi-Discipline Load Ratio */}
      <div className="p-6 rounded-2xl kr-stone-card border-3 border-[#5C3317] flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2 pb-2 border-b border-[#5C3317]">
          <div>
            <h3 className="text-lg font-black text-amber-200 flex items-center gap-2">
              <PieIcon className="w-5 h-5 text-amber-400" />
              Activity Discipline Distribution
            </h3>
            <p className="text-xs text-amber-100/70">Cardio vs Volume vs Rep Ratio</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 h-52">
          <div className="w-40 h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={disciplineData}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={62}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {disciplineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#382012" strokeWidth={2} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2.5 text-xs">
            {disciplineData.map(d => (
              <div key={d.name} className="flex items-center gap-2.5">
                <span className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: d.color }} />
                <span className="text-amber-100 font-bold">{d.icon} {d.name}:</span>
                <span className="font-mono font-black text-amber-300">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
