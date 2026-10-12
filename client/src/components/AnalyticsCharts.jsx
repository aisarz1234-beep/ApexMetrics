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
    { name: 'Cardio', value: 42, color: '#10B981', icon: '🏃' },
    { name: 'Strength', value: 28, color: '#EF4444', icon: '🏋️' },
    { name: 'Calisthenics', value: 18, color: '#A855F7', icon: '🤸' },
    { name: 'Sports & HIIT', value: 12, color: '#3B82F6', icon: '⚡' }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* 7-Day Point Velocity */}
      <div className="p-5 sm:p-6 rounded-2xl kr-wood-panel">
        <div className="flex items-center justify-between mb-4 pb-2.5 border-b border-[#452612]">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-amber-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              Weekly Point Velocity
            </h3>
            <p className="text-xs text-amber-200/60 mt-0.5">Cumulative standardized score trajectory</p>
          </div>
          <span className="text-xs font-mono font-bold text-amber-300 bg-amber-500/15 px-2.5 py-1 rounded-lg border border-amber-500/30">
            +{Math.round(user?.weeklyPoints || 840)} PTS
          </span>
        </div>

        <div className="h-52 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="krPointGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.45} />
                  <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#3D2413" />
              <XAxis dataKey="day" stroke="#D97706" fontSize={11} tickLine={false} />
              <YAxis stroke="#D97706" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1E120A',
                  borderColor: '#6B3E1C',
                  borderRadius: '0.75rem',
                  fontSize: '12px',
                  color: '#FEF3C7',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.6)'
                }}
              />
              <Area
                type="monotone"
                dataKey="points"
                stroke="#F59E0B"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#krPointGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Multi-Discipline Load Ratio */}
      <div className="p-5 sm:p-6 rounded-2xl kr-wood-panel flex flex-col justify-between">
        <div className="flex items-center justify-between mb-2 pb-2.5 border-b border-[#452612]">
          <div>
            <h3 className="text-base sm:text-lg font-bold text-amber-100 flex items-center gap-2">
              <PieIcon className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400" />
              Activity Discipline Ratio
            </h3>
            <p className="text-xs text-amber-200/60 mt-0.5">Cardio vs Volume vs Rep Distribution</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-6 h-52">
          <div className="w-36 h-36 sm:w-40 sm:h-40">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={disciplineData}
                  cx="50%"
                  cy="50%"
                  innerRadius={42}
                  outerRadius={62}
                  paddingAngle={4}
                  dataKey="value"
                >
                  {disciplineData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#1A0F08" strokeWidth={2} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="space-y-2 text-xs">
            {disciplineData.map(d => (
              <div key={d.name} className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                <span className="text-amber-100/90 font-medium">{d.icon} {d.name}:</span>
                <span className="font-mono font-bold text-amber-300">{d.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
