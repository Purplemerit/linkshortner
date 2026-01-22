import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';

export const metadata: Metadata = {
  title: 'Comparison - short.link vs Bitly, Short.io | URL Shortener Comparison',
  description: 'Compare short.link with Bitly, Short.io, and Rebrandly. See why short.link offers the best features at the lowest price.',
};

export default function ComparisonPage() {
  const features = [
    { name: 'Privacy-First Analytics', shortlink: true, bitly: false, shortio: false, rebrandly: false },
    { name: 'No Cookie Tracking', shortlink: true, bitly: false, shortio: false, rebrandly: false },
    { name: 'GDPR Compliant by Default', shortlink: true, bitly: false, shortio: false, rebrandly: false },
    { name: 'Broken Link Monitoring', shortlink: true, bitly: false, shortio: false, rebrandly: false },
    { name: 'Custom Domains', shortlink: true, bitly: true, shortio: true, rebrandly: true },
    { name: 'QR Code Generation', shortlink: true, bitly: true, shortio: true, rebrandly: true },
    { name: 'API Access', shortlink: true, bitly: true, shortio: true, rebrandly: true },
    { name: 'Team Collaboration', shortlink: true, bitly: true, shortio: true, rebrandly: true },
    { name: 'Link Expiration', shortlink: true, bitly: true, shortio: true, rebrandly: true },
    { name: 'Password Protection', shortlink: true, bitly: true, shortio: true, rebrandly: true },
    { name: 'Geographic Analytics', shortlink: true, bitly: true, shortio: true, rebrandly: true },
    { name: 'Self-Hosted Option', shortlink: true, bitly: false, shortio: false, rebrandly: false },
  ];

  const pricing = [
    { name: 'short.link', free: '100 links/mo', starter: '$12/mo', pro: '$39/mo' },
    { name: 'Bitly', free: '10 links/mo', starter: '$29/mo', pro: '$199/mo' },
    { name: 'Short.io', free: '50 links/mo', starter: '$35/mo', pro: '$149/mo' },
    { name: 'Rebrandly', free: '25 links/mo', starter: '$29/mo', pro: '$89/mo' },
  ];

  return (
    <div className="min-h-screen bg-white">
      <Navbar currentPage="comparison" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 mb-3 sm:mb-4 text-center">
          short.link vs Competitors
        </h1>
        <p className="text-center text-gray-600 mb-8 sm:mb-12 text-sm sm:text-base lg:text-lg">
          See how we compare to the competition on features and pricing
        </p>

        {/* Feature Comparison Table */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Feature Comparison</h2>
          <div className="bg-white rounded-lg border-2 border-gray-200 overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead className="bg-purple-600 text-white">
                <tr>
                  <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 text-left font-semibold">Feature</th>
                  <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 text-center font-semibold">short.link</th>
                  <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 text-center font-semibold">Bitly</th>
                  <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 text-center font-semibold">Short.io</th>
                  <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 text-center font-semibold">Rebrandly</th>
                </tr>
              </thead>
              <tbody>
                {features.map((feature, idx) => (
                  <tr key={idx} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 font-semibold">{feature.name}</td>
                    <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-center">
                      {feature.shortlink ? (
                        <span className="text-green-600 font-bold">✓</span>
                      ) : (
                        <span className="text-red-600">✗</span>
                      )}
                    </td>
                    <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-center">
                      {feature.bitly ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <span className="text-red-600">✗</span>
                      )}
                    </td>
                    <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-center">
                      {feature.shortio ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <span className="text-red-600">✗</span>
                      )}
                    </td>
                    <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-center">
                      {feature.rebrandly ? (
                        <span className="text-green-600">✓</span>
                      ) : (
                        <span className="text-red-600">✗</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pricing Comparison */}
        <div className="mb-12 sm:mb-16">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Pricing Comparison</h2>
          <div className="bg-white rounded-lg border-2 border-gray-200 overflow-x-auto">
            <table className="w-full text-xs sm:text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 text-left font-semibold">Platform</th>
                  <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 text-center font-semibold">Free Tier</th>
                  <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 text-center font-semibold">Starter</th>
                  <th className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 lg:py-4 text-center font-semibold">Pro</th>
                </tr>
              </thead>
              <tbody>
                {pricing.map((platform, idx) => (
                  <tr key={idx} className={`border-b border-gray-200 ${idx === 0 ? 'bg-purple-50' : 'hover:bg-gray-50'}`}>
                    <td className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-3 font-semibold ${idx === 0 ? 'text-purple-600' : ''}`}>
                      {platform.name}
                    </td>
                    <td className="px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-center">{platform.free}</td>
                    <td className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-center ${idx === 0 ? 'font-bold text-purple-600' : ''}`}>
                      {platform.starter}
                    </td>
                    <td className={`px-3 sm:px-4 lg:px-6 py-2 sm:py-3 text-center ${idx === 0 ? 'font-bold text-purple-600' : ''}`}>
                      {platform.pro}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Why Choose Us */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 mb-12 sm:mb-16">
          <div className="bg-purple-50 p-5 sm:p-6 lg:p-8 rounded-lg sm:rounded-xl border-2 border-purple-200">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🔒</div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Privacy-First</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Unlike competitors, we never use cookies or track individual users. GDPR-compliant by default.
            </p>
          </div>
          <div className="bg-purple-50 p-5 sm:p-6 lg:p-8 rounded-lg sm:rounded-xl border-2 border-purple-200">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">💰</div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Best Value</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Get more features at a fraction of the cost. Save up to 60% compared to Bitly.
            </p>
          </div>
          <div className="bg-purple-50 p-5 sm:p-6 lg:p-8 rounded-lg sm:rounded-xl border-2 border-purple-200">
            <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">🔍</div>
            <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 sm:mb-3">Link Monitoring</h3>
            <p className="text-xs sm:text-sm text-gray-600">
              Exclusive broken link detection and health monitoring. Usually costs $99+/mo separately.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-purple-600 text-white rounded-lg sm:rounded-2xl p-6 sm:p-8 lg:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 sm:mb-4">Ready to switch?</h2>
          <p className="text-purple-100 mb-6 sm:mb-8 text-xs sm:text-sm lg:text-lg">
            Import your existing links from any platform. Start free, upgrade anytime.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <Link
              href="/sign-up"
              className="px-6 sm:px-8 py-2 sm:py-4 bg-white text-purple-600 rounded-lg hover:bg-gray-100 font-bold text-sm sm:text-base transition-colors"
            >
              Start Free Trial
            </Link>
            <Link
              href="/contact"
              className="px-6 sm:px-8 py-2 sm:py-4 border-2 border-white text-white rounded-lg hover:bg-purple-700 font-bold text-sm sm:text-base transition-colors"
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
