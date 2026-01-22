'use client';

import { useState, useEffect } from 'react';
import { AnalyticsData } from '@/lib/dummy-data';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface AnalyticsDashboardProps {
  linkId?: string;
}

const emptyAnalytics: AnalyticsData = {
  totalClicks: 0,
  uniqueClicks: 0,
  topCountries: [],
  topReferrers: [],
  deviceBreakdown: { mobile: 0, desktop: 0, tablet: 0 },
  clicksByDay: [],
  topBrowsers: [],
  topOS: []
};

export function AnalyticsDashboard({ linkId }: AnalyticsDashboardProps) {
  const [data, setData] = useState<AnalyticsData>(emptyAnalytics);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<'today' | '7d' | '30d' | 'custom'>('7d');
  const [customStart, setCustomStart] = useState('');
  const [customEnd, setCustomEnd] = useState('');

  useEffect(() => {
    if (!linkId) return;

    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        let url = `/api/links/${linkId}/analytics?range=${timeRange}`;
        if (timeRange === 'custom' && customStart && customEnd) {
          url += `&start=${customStart}&end=${customEnd}`;
        }

        const response = await fetch(url);
        if (response.ok) {
          const result = await response.json();
          setData(result);
        } else {
          console.error('Failed to fetch analytics');
          setData(emptyAnalytics);
        }
      } catch (error) {
        console.error('Error fetching analytics:', error);
        setData(emptyAnalytics);
      } finally {
        setLoading(false);
      }
    };

    if (timeRange !== 'custom' || (customStart && customEnd)) {
      fetchAnalytics();
    }
  }, [linkId, timeRange, customStart, customEnd]);

  const clickRate = data.totalClicks > 0
    ? ((data.uniqueClicks / data.totalClicks) * 100).toFixed(1)
    : '0.0';

  const topDevice = Object.entries(data.deviceBreakdown).reduce((a, b) =>
    (data.deviceBreakdown[a[0] as keyof typeof data.deviceBreakdown] || 0) >
      (data.deviceBreakdown[b[0] as keyof typeof data.deviceBreakdown] || 0)
      ? a
      : b,
    ['none', 0]
  )[0];

  const totalDevices = data.deviceBreakdown.mobile + data.deviceBreakdown.desktop + data.deviceBreakdown.tablet;

  // Generate chart data
  const chartData = (data.clicksByDay || []).map((clicks, index) => {
    const date = new Date();
    const daysAgo = (data.clicksByDay.length - 1) - index;
    date.setDate(date.getDate() - daysAgo);
    return {
      date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      clicks
    };
  });

  if (loading) {
    return <div className="w-full text-center py-12 text-gray-500">Loading analytics...</div>;
  }

  if (!linkId) {
    return <div className="w-full text-center py-12 text-gray-500">Select a link to view analytics</div>;
  }

  return (
    <div className="w-full">
      {/* Time Range Filter */}
      <div className="mb-6 flex flex-wrap gap-2 items-center">
        {(['today', '7d', '30d'] as const).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm ${timeRange === range
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
              }`}
          >
            {range === 'today' ? 'Today' : range === '7d' ? '7 Days' : '30 Days'}
          </button>
        ))}

        <button
          onClick={() => setTimeRange('custom')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm ${timeRange === 'custom'
            ? 'bg-purple-600 text-white'
            : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            }`}
        >
          Custom Range
        </button>

        {timeRange === 'custom' && (
          <div className="flex flex-wrap gap-2 items-center ml-2">
            <input
              type="date"
              value={customStart}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              onChange={(e) => setCustomStart(e.target.value)}
            />
            <span className="text-gray-500">-</span>
            <input
              type="date"
              value={customEnd}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
              onChange={(e) => setCustomEnd(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Total Clicks</p>
          <p className="text-3xl font-bold text-gray-900">{data.totalClicks.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Unique Visitors</p>
          <p className="text-3xl font-bold text-gray-900">{data.uniqueClicks.toLocaleString()}</p>
        </div>

        <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Click Rate</p>
          <p className="text-3xl font-bold text-purple-600">{clickRate}%</p>
        </div>

        <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
          <p className="text-sm text-gray-600 mb-2">Top Device</p>
          <p className="text-3xl font-bold text-gray-900 capitalize">{topDevice}</p>
          <p className="text-xs text-gray-500 mt-1">
            {data.deviceBreakdown[topDevice as keyof typeof data.deviceBreakdown] || 0} clicks
          </p>
        </div>
      </div>

      {/* Click Trends Chart */}
      <div className="bg-white p-6 rounded-lg border-2 border-gray-200 mb-8">
        <h3 className="text-xl font-bold mb-6">Click Trends</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={chartData}>
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

      {/* Top Countries & Device Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Top Countries */}
        <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
          <h3 className="font-bold mb-4">Top Countries</h3>
          <div className="space-y-3">
            {data.topCountries.length === 0 ? (
              <p className="text-gray-500 text-sm">No data yet</p>
            ) : (
              data.topCountries.map((item) => (
                <div key={item.country}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-semibold">{item.country}</span>
                    <span className="text-gray-600">{item.clicks} ({item.percentage}%)</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
          <h3 className="font-bold mb-4">Device Breakdown</h3>
          <div className="space-y-3">
            {totalDevices === 0 ? (
              <p className="text-gray-500 text-sm">No data yet</p>
            ) : (
              Object.entries(data.deviceBreakdown).map(([device, clicks]) => {
                const percentage = totalDevices > 0 ? (clicks / totalDevices) * 100 : 0;
                return (
                  <div key={device}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-semibold capitalize">{device}</span>
                      <span className="text-gray-600">{clicks} ({percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-600 h-2 rounded-full"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Top Referrers */}
      <div className="bg-white p-6 rounded-lg border-2 border-gray-200 mb-8">
        <h3 className="font-bold mb-4">Top Referrers</h3>
        <div className="space-y-2">
          {data.topReferrers.length === 0 ? (
            <p className="text-gray-500 text-sm">No data yet</p>
          ) : (
            data.topReferrers.map((item) => (
              <div key={item.referrer} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                <span className="font-semibold">{item.referrer === 'direct' ? 'Direct' : item.referrer}</span>
                <span className="text-gray-600">{item.clicks} clicks ({item.percentage}%)</span>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Top Browsers & OS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Top Browsers */}
        <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
          <h3 className="font-bold mb-4">Top Browsers</h3>
          <div className="space-y-2">
            {(!data.topBrowsers || data.topBrowsers.length === 0) ? (
              <p className="text-gray-500 text-sm">No data yet</p>
            ) : (
              data.topBrowsers.map((item) => (
                <div key={item.browser} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                  <span className="font-semibold">{item.browser}</span>
                  <span className="text-gray-600">{item.clicks} clicks</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Top OS */}
        <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
          <h3 className="font-bold mb-4">Top OS</h3>
          <div className="space-y-2">
            {(!data.topOS || data.topOS.length === 0) ? (
              <p className="text-gray-500 text-sm">No data yet</p>
            ) : (
              data.topOS.map((item) => (
                <div key={item.os} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
                  <span className="font-semibold">{item.os}</span>
                  <span className="text-gray-600">{item.clicks} clicks</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

