import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer
} from 'recharts';

export const StatRadarChart = ({ stats }) => {
  const data = [
    { attribute: 'Strength', value: stats?.strength || 10, fullMark: 100 },
    { attribute: 'Endurance', value: stats?.endurance || 10, fullMark: 100 },
    { attribute: 'Agility', value: stats?.agility || 10, fullMark: 100 },
    { attribute: 'Stamina', value: stats?.stamina || 10, fullMark: 100 }
  ];

  return (
    <div className="w-full h-56 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="70%" data={data}>
          <PolarGrid stroke="#374151" />
          <PolarAngleAxis
            dataKey="attribute"
            stroke="#94A3B8"
            tick={{ fill: '#E2E8F0', fontSize: 11, fontWeight: 'bold' }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            stroke="#475569"
            tick={false}
          />
          <Radar
            name="RPG Stats"
            dataKey="value"
            stroke="#06B6D4"
            fill="#06B6D4"
            fillOpacity={0.45}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
