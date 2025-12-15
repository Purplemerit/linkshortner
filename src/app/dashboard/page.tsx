'use client';

import { LinksDashboard } from '@/components/LinksDashboard';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { ClickTrendsChart } from '@/components/ClickTrendsChart';
import { UserButton } from '@clerk/nextjs';

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-purple-600">short.link</span>
            <span className="text-sm text-gray-600 hidden md:inline">Dashboard</span>
          </div>
          <div className="flex gap-4 items-center">
            <a href="/" className="px-4 py-2 text-gray-600 hover:text-purple-600 font-semibold">
              Home
            </a>
            <button className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg font-semibold">
              Settings
            </button>
            <UserButton afterSignOutUrl="/" />
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>

        {/* Analytics Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics Overview</h2>
          <AnalyticsDashboard linkId="link-1" />
          <div className="mt-8">
            <ClickTrendsChart linkId="link-1" />
          </div>
        </div>

        {/* Links Section */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Links</h2>
          <LinksDashboard />
        </div>
      </div>
    </div>
  );
}

