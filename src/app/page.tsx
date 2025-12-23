'use client';

import { LinkShortener } from '@/components/LinkShortener';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import Link from 'next/link';

export default function Home() {
  const features = [
    { icon: '🔗', title: 'Link Shortening', desc: 'Convert any long URL into a beautiful short link in seconds' },
    { icon: '🎨', title: 'Custom Domains', desc: 'Use your own domain for branded short links' },
    { icon: '📱', title: 'QR Codes', desc: 'Generate customizable QR codes for any link' },
    { icon: '📊', title: 'Real-Time Analytics', desc: 'Track clicks, geographic data, and referrers' },
    { icon: '🔒', title: 'Password Protection', desc: 'Secure your links with password authentication' },
    { icon: '⏰', title: 'Link Expiration', desc: 'Set time-based or click-based expiration for links' },
    { icon: '🏷️', title: 'Link Tagging', desc: 'Organize links with custom tags and categories' },
    { icon: '👥', title: 'Team Collaboration', desc: 'Invite team members with role-based access' },
    { icon: '🌍', title: 'Geographic Analytics', desc: 'See where your clicks are coming from' },
    { icon: '📈', title: 'Click Trends', desc: 'Visualize click patterns over time' },
    { icon: '🔍', title: 'Broken Link Monitoring', desc: 'Automated health checks and failure alerts' },
    { icon: '🔐', title: 'HTTPS/SSL', desc: 'All links encrypted with SSL by default' },
  ];

  const faqs = [
    {
      question: 'Do you track my users with cookies?',
      answer: 'No. We never use cookies or pixels to track users. Our analytics are privacy-first and GDPR-compliant by design.',
    },
    {
      question: 'Can I use my own domain?',
      answer: 'Yes! Starting with the Starter plan ($12/mo), you can add custom domains. Pro plan includes up to 10 custom domains.',
    },
    {
      question: 'How much does it cost?',
      answer: 'We offer a free tier with 100 links per month. Paid plans start at $12/month with 500 links per week and all features included.',
    },
    {
      question: 'Is there an API?',
      answer: 'Yes! All paid plans include REST API access. Free tier includes 1,000 API requests per month.',
    },
    {
      question: 'Can I export my data?',
      answer: 'Yes, you can export all your links and analytics data at any time in CSV or JSON format.',
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* 1. Navigation Bar */}
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-purple-600">short.link</span>
            <span className="text-sm text-gray-600 hidden md:inline">Privacy-first URL shortener</span>
          </div>

          <div className="hidden md:flex gap-8">
            <a href="#features" className="text-gray-600 hover:text-purple-600 font-semibold">Features</a>
            <a href="#pricing" className="text-gray-600 hover:text-purple-600 font-semibold">Pricing</a>
            <a href="/docs" className="text-gray-600 hover:text-purple-600 font-semibold">Docs</a>
            <a href="/blog" className="text-gray-600 hover:text-purple-600 font-semibold">Blog</a>
          </div>

          <div className="flex gap-4 items-center">
            <SignedOut>
              <Link href="/sign-in" className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg font-semibold">
                Sign In
              </Link>
              <Link href="/sign-up" className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold">
                Get Started Free
              </Link>
            </SignedOut>
            <SignedIn>
              <Link href="/dashboard" className="px-4 py-2 text-purple-600 hover:bg-purple-50 rounded-lg font-semibold">
                Dashboard
              </Link>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </div>
        </div>
      </nav>

      {/* 2. Hero Section */}
      <section className="px-8 py-32 bg-white">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-4 leading-tight">
            The Privacy-First URL Shortener
          </h1>

          <p className="text-xl md:text-2xl text-gray-600 mb-8 leading-relaxed">
            50+ features. Real-time analytics. Zero cookies. Starting at just{' '}
            <span className="text-purple-600 font-bold">$12/month</span>
          </p>

          {/* Social Proof */}
          <div className="flex justify-center gap-8 mb-12 flex-wrap">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">10,000+</div>
              <div className="text-sm text-gray-600">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">5M+</div>
              <div className="text-sm text-gray-600">Short Links Created</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-900">4.8★</div>
              <div className="text-sm text-gray-600">User Rating</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex gap-4 justify-center mb-12 flex-wrap">
            <button className="px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-bold text-lg">
              Start Free (100 links/month)
            </button>
            <button className="px-8 py-4 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 font-bold text-lg">
              Watch Demo
            </button>
          </div>

          {/* Link Shortener Component */}
          <LinkShortener />
        </div>
      </section>

      {/* 3. Features Preview Section */}
      <section id="features" className="px-8 py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">
            Powerful Features for Every Need
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            All 50 features included in every paid plan. No hidden limits.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="bg-white p-8 rounded-lg border-2 border-gray-200 hover:border-purple-600 hover:shadow-lg transition"
              >
                <div className="text-3xl mb-3">{feature.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4">{feature.desc}</p>
                <Link href="/features" className="text-purple-600 hover:text-purple-700 font-semibold">
                  Learn more →
                </Link>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link
              href="/features"
              className="px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 font-semibold inline-block"
            >
              See All 50 Features →
            </Link>
          </div>
        </div>
      </section>

      {/* 4. Pricing Preview Section */}
      <section id="pricing" className="px-8 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">
            Simple, Transparent Pricing
          </h2>
          <p className="text-center text-gray-600 mb-12 text-lg">
            No hidden fees. Cancel anytime. 30-day money-back guarantee.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              <Link href="/sign-up" className="w-full inline-block px-4 py-2 border-2 border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 text-center">
                Get Started
              </Link>
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
              <Link href="/sign-up" className="w-full inline-block px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold text-center">
                Start Free Trial
              </Link>
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
              <Link href="/enterprise" className="w-full inline-block px-4 py-2 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 text-center">
                Contact Sales
              </Link>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link href="/pricing" className="text-purple-600 hover:text-purple-700 font-semibold">
              See complete pricing →
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Comparison Section */}
      <section className="px-8 py-20 bg-purple-50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-gray-900 mb-4 text-center">
            Why short.link Wins
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-white p-8 rounded-lg">
              <h3 className="text-xl font-bold text-purple-600 mb-3">🔒 Privacy-First</h3>
              <p className="text-gray-600 mb-4">
                Zero cookies. IP anonymized. GDPR-compliant by default. Unlike Bitly and Short.io which track users, we respect privacy.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ No cookie tracking</li>
                <li>✓ No IP logging</li>
                <li>✓ GDPR compliant</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg">
              <h3 className="text-xl font-bold text-purple-600 mb-3">💰 Lowest Price</h3>
              <p className="text-gray-600 mb-4">
                50+ features at $12-39/mo. Bitly charges $29+ for basic features. We offer 40% more features at 60% lower price.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ $12-39/mo (vs Bitly $29+)</li>
                <li>✓ 50+ features included</li>
                <li>✓ No overage charges</li>
              </ul>
            </div>

            <div className="bg-white p-8 rounded-lg">
              <h3 className="text-xl font-bold text-purple-600 mb-3">🔍 Link Health Monitoring</h3>
              <p className="text-gray-600 mb-4">
                Automated broken link detection. Alerts on 404 errors. Usually $99+/mo, included free in our Starter plan.
              </p>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>✓ Auto-health checks</li>
                <li>✓ Failure alerts</li>
                <li>✓ Backup redirects</li>
              </ul>
            </div>
          </div>

          <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden mb-8">
            <table className="w-full">
              <thead className="bg-purple-600 text-white">
                <tr>
                  <th className="px-6 py-3 text-left font-semibold">Feature</th>
                  <th className="px-6 py-3 text-center font-semibold">short.link</th>
                  <th className="px-6 py-3 text-center font-semibold">Bitly</th>
                  <th className="px-6 py-3 text-center font-semibold">Short.io</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-3">Privacy-First Analytics</td>
                  <td className="px-6 py-3 text-center">✓</td>
                  <td className="px-6 py-3 text-center">✗</td>
                  <td className="px-6 py-3 text-center">✗</td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-3">Broken Link Monitoring</td>
                  <td className="px-6 py-3 text-center">✓</td>
                  <td className="px-6 py-3 text-center">✗</td>
                  <td className="px-6 py-3 text-center">✗</td>
                </tr>
                <tr className="border-b border-gray-200 hover:bg-gray-50">
                  <td className="px-6 py-3">Price (Starting)</td>
                  <td className="px-6 py-3 text-center font-semibold">$12/mo</td>
                  <td className="px-6 py-3 text-center">$29/mo</td>
                  <td className="px-6 py-3 text-center">$35/mo</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="text-center">
            <a
              href="/comparison"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold inline-block"
            >
              Full Comparison →
            </a>
          </div>
        </div>
      </section>

      {/* 6. Trust & Social Proof Section */}
      <section className="px-8 py-20 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Trusted by Teams Worldwide
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="flex gap-1 mb-3">★★★★★</div>
              <p className="text-gray-600 mb-4">
                &quot;We switched from Bitly and saved 60% on subscription costs. The privacy-first approach is exactly what we needed for GDPR compliance.&quot;
              </p>
              <div>
                <div className="font-semibold text-gray-900">Sarah Chen</div>
                <div className="text-sm text-gray-600">Marketing Director, TechCorp</div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="flex gap-1 mb-3">★★★★★</div>
              <p className="text-gray-600 mb-4">
                &quot;The analytics are incredibly detailed and the custom domain setup was seamless. Best URL shortener we&apos;ve used.&quot;
              </p>
              <div>
                <div className="font-semibold text-gray-900">Michael Rodriguez</div>
                <div className="text-sm text-gray-600">CTO, StartupXYZ</div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
              <div className="flex gap-1 mb-3">★★★★★</div>
              <p className="text-gray-600 mb-4">
                &quot;Love the QR code customization features. We use it for all our marketing campaigns. Highly recommend!&quot;
              </p>
              <div>
                <div className="font-semibold text-gray-900">Emily Johnson</div>
                <div className="text-sm text-gray-600">Marketing Manager, BrandCo</div>
              </div>
            </div>
          </div>

          <div>
            <p className="text-center text-gray-600 mb-8 font-semibold">Used by:</p>
            <div className="flex justify-center items-center gap-12 flex-wrap">
              <div className="text-gray-400 font-bold">Client Logo 1</div>
              <div className="text-gray-400 font-bold">Client Logo 2</div>
              <div className="text-gray-400 font-bold">Client Logo 3</div>
              <div className="text-gray-400 font-bold">Client Logo 4</div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. FAQ Section */}
      <section className="px-8 py-20 bg-gray-50">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 mb-12 text-center">
            Common Questions
          </h2>

          <div className="space-y-4">
            {faqs.map((faq, idx) => (
              <details key={idx} className="bg-white p-6 rounded-lg border border-gray-200">
                <summary className="cursor-pointer font-bold text-gray-900">
                  {faq.question}
                </summary>
                <p className="mt-4 text-gray-600">{faq.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 8. Final CTA Section */}
      <section className="px-8 py-32 bg-purple-600 text-white text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl font-bold mb-6">Ready to Start?</h2>
          <p className="text-xl text-purple-100 mb-12">
            100 free short links per month. No credit card required.
          </p>

          <div className="flex gap-4 justify-center flex-wrap">
            <button className="px-8 py-4 bg-white text-purple-600 rounded-lg hover:bg-gray-100 font-bold text-lg">
              Start Free
            </button>
            <button className="px-8 py-4 border-2 border-white text-white rounded-lg hover:bg-purple-700 font-bold text-lg">
              View Pricing
            </button>
          </div>
        </div>
      </section>

      {/* 9. Footer */}
      <footer className="bg-gray-900 text-white px-8 py-12">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h4 className="font-bold mb-4">short.link</h4>
            <p className="text-gray-400 text-sm">
              Privacy-first URL shortener with 50+ features. No cookies. No tracking.
            </p>
          </div>

          <div>
            <h4 className="font-bold mb-4">Product</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/features" className="hover:text-white">Features</a></li>
              <li><a href="/pricing" className="hover:text-white">Pricing</a></li>
              <li><a href="/docs" className="hover:text-white">Documentation</a></li>
              <li><a href="/blog" className="hover:text-white">Blog</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="/comparison" className="hover:text-white">Comparison</a></li>
              <li><a href="/privacy" className="hover:text-white">Privacy</a></li>
              <li><a href="/terms" className="hover:text-white">Terms</a></li>
              <li><a href="/security" className="hover:text-white">Security</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-4">Connect</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li><a href="https://twitter.com" className="hover:text-white" target="_blank" rel="noopener noreferrer">Twitter</a></li>
              <li><a href="https://github.com" className="hover:text-white" target="_blank" rel="noopener noreferrer">GitHub</a></li>
              <li><a href="/contact" className="hover:text-white">Contact</a></li>
              <li><a href="mailto:hello@short.link" className="hover:text-white">Email</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-gray-400 text-sm">© 2025 short.link. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="/privacy" className="text-gray-400 hover:text-white text-sm">Privacy</a>
            <a href="/terms" className="text-gray-400 hover:text-white text-sm">Terms</a>
            <a href="/security" className="text-gray-400 hover:text-white text-sm">Security</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
