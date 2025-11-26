'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { dummyAnalytics } from '@/lib/dummy-data';

interface ClickTrendsChartProps {
  linkId?: string;
}

export function ClickTrendsChart({ linkId }: ClickTrendsChartProps) {
  // Generate dates for the last 7 days
  const dates = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }));
  }

  const data = dates.map((date, index) => ({
    date,
    clicks: dummyAnalytics.clicksByDay[index] || 0,
  }));

  return (
    <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
      <h3 className="text-xl font-bold mb-6">Click Trends (Last 7 Days)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis
            dataKey="date"
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <YAxis
            stroke="#6b7280"
            style={{ fontSize: '12px' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#1f2937',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="clicks"
            stroke="#9333ea"
            strokeWidth={2}
            dot={{ fill: '#9333ea', r: 4 }}
            name="Total Clicks"
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

