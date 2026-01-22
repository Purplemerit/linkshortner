import Link from 'next/link';
import type { Metadata } from 'next';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Documentation - short.link | API & Integration Guides',
  description: 'Complete documentation for short.link API, integration guides, and feature tutorials.',
};

export default function DocsPage() {
  const sections = [
    {
      title: 'Getting Started',
      icon: '🚀',
      items: [
        { title: 'Quick Start Guide', href: '#quick-start', description: 'Get up and running in 5 minutes' },
        { title: 'Create Your First Link', href: '#first-link', description: 'Learn the basics of link creation' },
        { title: 'Dashboard Overview', href: '#dashboard', description: 'Navigate your dashboard like a pro' },
      ],
    },
    {
      title: 'Features',
      icon: '⭐',
      items: [
        { title: 'Custom Short URLs', href: '#custom-urls', description: 'Create branded short codes' },
        { title: 'QR Code Generation', href: '#qr-codes', description: 'Generate and customize QR codes' },
        { title: 'Password Protection', href: '#passwords', description: 'Secure links with passwords' },
        { title: 'Link Expiration', href: '#expiration', description: 'Set automatic expiry dates' },
        { title: 'Analytics Dashboard', href: '#analytics', description: 'Track and analyze clicks' },
      ],
    },
    {
      title: 'Custom Domains',
      icon: '🌐',
      items: [
        { title: 'Domain Setup', href: '#domain-setup', description: 'Add your custom domain' },
        { title: 'DNS Configuration', href: '#dns-config', description: 'Configure DNS records' },
        { title: 'SSL Certificates', href: '#ssl', description: 'Automatic SSL setup' },
      ],
    },
    {
      title: 'API Reference',
      icon: '🔌',
      items: [
        { title: 'Authentication', href: '#api-auth', description: 'API key generation and usage' },
        { title: 'Create Links', href: '#api-create', description: 'POST /api/links endpoint' },
        { title: 'Get Analytics', href: '#api-analytics', description: 'GET /api/links/:id/analytics' },
        { title: 'Rate Limits', href: '#api-limits', description: 'API usage limits and quotas' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar currentPage="docs" />

      {/* Hero */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-3 sm:mb-4">
            Documentation
          </h1>
          <p className="text-sm sm:text-base lg:text-lg xl:text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to know to use short.link effectively
          </p>
        </div>

        {/* Search (placeholder for now) */}
        <div className="max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="relative">
            <input
              type="text"
              placeholder="Search documentation..."
              className="w-full px-4 sm:px-6 py-2 sm:py-4 border-2 border-gray-300 rounded-lg sm:rounded-xl focus:border-purple-600 focus:outline-none text-xs sm:text-base lg:text-lg"
            />
            <span className="absolute right-3 sm:right-4 top-1/2 transform -translate-y-1/2 text-lg sm:text-2xl">🔍</span>
          </div>
        </div>

        {/* Documentation Sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
          {sections.map((section, idx) => (
            <div key={idx} className="bg-white rounded-lg sm:rounded-2xl border-2 border-gray-200 p-4 sm:p-6 lg:p-8 shadow-lg hover:shadow-xl transition-shadow">
              <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
                <span className="text-2xl sm:text-3xl lg:text-4xl">{section.icon}</span>
                <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{section.title}</h2>
              </div>
              <div className="space-y-2 sm:space-y-3 lg:space-y-4">
                {section.items.map((item, itemIdx) => (
                  <a
                    key={itemIdx}
                    href={item.href}
                    className="block p-2 sm:p-3 lg:p-4 rounded-lg border border-gray-200 hover:border-purple-400 hover:bg-purple-50 transition-all"
                  >
                    <h3 className="font-bold text-xs sm:text-sm lg:text-base text-gray-900 mb-0.5 sm:mb-1">{item.title}</h3>
                    <p className="text-xs text-gray-600">{item.description}</p>
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Quick Start Guide */}
        <div className="bg-white rounded-lg sm:rounded-2xl border-2 border-gray-200 p-4 sm:p-6 lg:p-10 mb-12 sm:mb-16" id="quick-start">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">🚀 Quick Start Guide</h2>

          <div className="space-y-6 sm:space-y-8">
            <div>
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 sm:mb-3">1. Sign Up</h3>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-2 sm:mb-4">
                Create your free account at{' '}
                <Link href="/sign-up" className="text-purple-600 hover:underline">short.link/sign-up</Link>
              </p>
              <div className="bg-gray-900 text-gray-100 p-3 sm:p-4 rounded-lg font-mono text-xs sm:text-sm">
                No credit card required • 100 free links per month
              </div>
            </div>

            <div>
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 sm:mb-3">2. Create Your First Link</h3>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-2 sm:mb-4">
                Go to your dashboard and click &quot;Shorten Link&quot;
              </p>
              <div className="bg-gray-50 border-2 border-gray-200 p-4 sm:p-6 rounded-lg">
                <ol className="list-decimal list-inside space-y-1 sm:space-y-2 text-xs sm:text-sm lg:text-base text-gray-700">
                  <li>Enter your destination URL</li>
                  <li>Customize your short code (optional)</li>
                  <li>Add tags, expiration, or password protection</li>
                  <li>Click &quot;Create Link&quot;</li>
                </ol>
              </div>
            </div>

            <div>
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 sm:mb-3">3. Share and Track</h3>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-4">
                Copy your short link and start sharing. Click on any link in your dashboard to view analytics.
              </p>
            </div>
          </div>
        </div>

        {/* API Example */}
        <div className="bg-white rounded-lg sm:rounded-2xl border-2 border-gray-200 p-4 sm:p-6 lg:p-10 mb-12 sm:mb-16" id="api-auth">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 sm:mb-8">🔌 API Quick Start</h2>

          <div className="space-y-4 sm:space-y-6">
            <div>
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Get Your API Key</h3>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-2 sm:mb-4">
                Navigate to{' '}
                <Link href="/dashboard/settings/api" className="text-purple-600 hover:underline">
                  Dashboard → API Access
                </Link>
              </p>
            </div>

            <div>
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Create a Link via API</h3>
              <div className="bg-gray-900 text-gray-100 p-3 sm:p-4 lg:p-6 rounded-lg font-mono text-xs lg:text-sm overflow-x-auto">
                <pre>{`curl -X POST https://short.link/api/links \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "destination": "https://example.com/very/long/url",
    "customCode": "mylink",
    "tags": ["marketing", "campaign"]
  }'`}</pre>
              </div>
            </div>

            <div>
              <h3 className="text-base sm:text-lg lg:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Response</h3>
              <div className="bg-gray-900 text-green-400 p-3 sm:p-4 lg:p-6 rounded-lg font-mono text-xs lg:text-sm overflow-x-auto">
                <pre>{`{
  "id": "clx123abc",
  "shortCode": "mylink",
  "shortUrl": "https://short.link/mylink",
  "destination": "https://example.com/very/long/url",
  "clicks": 0,
  "createdAt": "2026-01-22T00:00:00Z"
}`}</pre>
              </div>
            </div>
          </div>
        </div>

        {/* Need Help CTA */}
        <div className="bg-gradient-to-r from-purple-600 to-purple-800 rounded-lg sm:rounded-2xl p-6 sm:p-8 lg:p-10 text-center text-white">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Need More Help?</h2>
          <p className="text-purple-100 mb-6 sm:mb-8 text-xs sm:text-sm lg:text-lg">
            Can&apos;t find what you&apos;re looking for? Our support team is here to help.
          </p>
          <Link
            href="/contact"
            className="inline-block px-6 sm:px-8 py-2 sm:py-4 bg-white text-purple-600 rounded-lg sm:rounded-xl hover:bg-gray-100 font-bold text-xs sm:text-base lg:text-lg shadow-lg transition-all"
          >
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
