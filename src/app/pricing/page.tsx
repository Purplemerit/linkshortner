import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Pricing - short.link | Transparent URL Shortener Pricing',
  description: 'Simple, transparent pricing for short.link. Free tier available. Plans starting at $12/month. No hidden fees.',
};

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold text-purple-600">short.link</Link>
          <div className="flex gap-4">
                <Link href="/" className="px-4 py-2 text-gray-600 hover:text-purple-600 font-semibold">Home</Link>
            <a href="/features" className="px-4 py-2 text-gray-600 hover:text-purple-600 font-semibold">Features</a>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-4 text-center">
          Simple, Transparent Pricing
        </h1>
        <p className="text-center text-gray-600 mb-12 text-lg">
          No hidden fees. Cancel anytime. 30-day money-back guarantee.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Free Tier */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
            <p className="text-gray-600 mb-6">Perfect for testing</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">$0</span>
              <span className="text-gray-600">/month</span>
            </div>
            <ul className="space-y-3 mb-6 text-sm text-gray-600">
              <li className="flex items-center gap-2">✓ 100 links/week</li>
              <li className="flex items-center gap-2">✓ Basic analytics</li>
              <li className="flex items-center gap-2">✓ 1 default domain</li>
              <li className="flex items-center gap-2">✗ No custom domains</li>
              <li className="flex items-center gap-2">✗ No team members</li>
            </ul>
            <button className="w-full px-4 py-2 border-2 border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50">
              Get Started
            </button>
          </div>

          {/* Starter Tier */}
          <div className="bg-white border-2 border-purple-600 rounded-lg p-8 relative md:transform md:scale-105">
            <div className="absolute top-4 right-4 bg-purple-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
              Most Popular
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
            <p className="text-gray-600 mb-6">For teams & agencies</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">$12</span>
              <span className="text-gray-600">/month</span>
            </div>
            <ul className="space-y-3 mb-6 text-sm text-gray-600">
              <li className="flex items-center gap-2">✓ 500 links/week</li>
              <li className="flex items-center gap-2">✓ Real-time analytics</li>
              <li className="flex items-center gap-2">✓ 2 custom domains</li>
              <li className="flex items-center gap-2">✓ QR codes</li>
              <li className="flex items-center gap-2">✓ 3 team members</li>
            </ul>
            <button className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold">
              Start Free Trial
            </button>
          </div>

          {/* Pro Tier */}
          <div className="bg-white border-2 border-gray-200 rounded-lg p-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Professional</h3>
            <p className="text-gray-600 mb-6">For enterprises</p>
            <div className="mb-6">
              <span className="text-4xl font-bold text-gray-900">$39</span>
              <span className="text-gray-600">/month</span>
            </div>
            <ul className="space-y-3 mb-6 text-sm text-gray-600">
              <li className="flex items-center gap-2">✓ 5,000 links/month</li>
              <li className="flex items-center gap-2">✓ All analytics</li>
              <li className="flex items-center gap-2">✓ 10 custom domains</li>
              <li className="flex items-center gap-2">✓ Advanced team RBAC</li>
              <li className="flex items-center gap-2">✓ API access</li>
            </ul>
            <button className="w-full px-4 py-2 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50">
              Contact Sales
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

