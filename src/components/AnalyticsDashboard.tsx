'use client';

import { useState } from 'react';
import { dummyAnalytics } from '@/lib/dummy-data';

interface AnalyticsDashboardProps {
  linkId?: string;
}

export function AnalyticsDashboard({ linkId }: AnalyticsDashboardProps) {
  const [data] = useState(dummyAnalytics);
  const [timeRange, setTimeRange] = useState<'today' | '7d' | '30d' | 'custom'>('7d');

  const clickRate = data.totalClicks > 0 
    ? ((data.uniqueClicks / data.totalClicks) * 100).toFixed(1)
    : '0.0';

  const topDevice = Object.entries(data.deviceBreakdown).reduce((a, b) =>
    data.deviceBreakdown[a[0] as keyof typeof data.deviceBreakdown] >
    data.deviceBreakdown[b[0] as keyof typeof data.deviceBreakdown]
      ? a
      : b
  )[0];

  const totalDevices = data.deviceBreakdown.mobile + data.deviceBreakdown.desktop + data.deviceBreakdown.tablet;

  return (
    <div className="w-full">
      {/* Time Range Filter */}
      <div className="mb-6 flex gap-2">
        {(['today', '7d', '30d'] as const).map((range) => (
          <button
            key={range}
            onClick={() => setTimeRange(range)}
            className={`px-4 py-2 rounded-lg font-semibold text-sm ${
              timeRange === range
                ? 'bg-purple-600 text-white'
                : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
            }`}
          >
            {range === 'today' ? 'Today' : range === '7d' ? '7 Days' : '30 Days'}
          </button>
        ))}
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
            {data.deviceBreakdown[topDevice as keyof typeof data.deviceBreakdown]} clicks
          </p>
        </div>
      </div>

      {/* Top Countries & Device Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        {/* Top Countries */}
        <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
          <h3 className="font-bold mb-4">Top Countries</h3>
          <div className="space-y-3">
            {data.topCountries.map((item) => (
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
            ))}
          </div>
        </div>

        {/* Device Breakdown */}
        <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
          <h3 className="font-bold mb-4">Device Breakdown</h3>
          <div className="space-y-3">
            {Object.entries(data.deviceBreakdown).map(([device, clicks]) => {
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
            })}
          </div>
        </div>
      </div>

      {/* Top Referrers */}
      <div className="bg-white p-6 rounded-lg border-2 border-gray-200">
        <h3 className="font-bold mb-4">Top Referrers</h3>
        <div className="space-y-2">
          {data.topReferrers.map((item) => (
            <div key={item.referrer} className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0">
              <span className="font-semibold">{item.referrer === 'direct' ? 'Direct' : item.referrer}</span>
              <span className="text-gray-600">{item.clicks} clicks ({item.percentage}%)</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

