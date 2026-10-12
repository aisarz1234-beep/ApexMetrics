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
    { attribute: 'Strength ⚔️', value: stats?.strength || 10, fullMark: 100 },
    { attribute: 'Endurance 🏹', value: stats?.endurance || 10, fullMark: 100 },
    { attribute: 'Agility ⚡', value: stats?.agility || 10, fullMark: 100 },
    { attribute: 'Stamina 🛡️', value: stats?.stamina || 10, fullMark: 100 }
  ];

  return (
    <div className="w-full h-60 flex items-center justify-center">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="72%" data={data}>
          <PolarGrid stroke="#5C3317" strokeWidth={1.5} />
          <PolarAngleAxis
            dataKey="attribute"
            stroke="#FDE68A"
            tick={{ fill: '#FDE68A', fontSize: 12, fontWeight: 'bold', fontFamily: 'Outfit, Inter, sans-serif' }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            stroke="#78350F"
            tick={false}
          />
          <Radar
            name="Hero Attributes"
            dataKey="value"
            stroke="#F59E0B"
            strokeWidth={3}
            fill="#F59E0B"
            fillOpacity={0.55}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
};
