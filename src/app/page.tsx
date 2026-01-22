'use client';

import { useState } from 'react';
import { LinkShortener } from '@/components/LinkShortener';
import { Navbar } from '@/components/Navbar';
import { BrandLogos } from '@/components/BrandLogos';
import { Footer } from '@/components/Footer';
import Link from 'next/link';

export default function Home() {
  const [showDemoModal, setShowDemoModal] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
    <div className="min-h-screen bg-white font-sans selection:bg-purple-100 selection:text-purple-900">
      {/* Demo Modal */}
      {showDemoModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-2xl w-full shadow-2xl border border-gray-100 transform transition-all scale-100">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 tracking-tight">Watch Demo</h2>
              <button
                onClick={() => setShowDemoModal(false)}
                className="text-gray-400 hover:text-gray-600 transition-colors bg-gray-50 hover:bg-gray-100 rounded-full w-8 h-8 flex items-center justify-center"
              >
                ✕
              </button>
            </div>
            <div className="aspect-video bg-gray-900 rounded-xl flex items-center justify-center mb-8 shadow-inner overflow-hidden relative group">
              <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/40 to-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="text-center text-white z-10 p-6">
                <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-4 border border-white/20 shadow-lg group-hover:scale-110 transition-transform duration-300">
                  <div className="text-3xl ml-1">▶️</div>
                </div>
                <p className="text-xl font-medium tracking-wide">Demo video coming soon!</p>
                <p className="text-sm text-gray-400 mt-2">See how short.link can transform your link management</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/sign-up"
                className="flex-1 px-6 py-3.5 bg-gray-900 text-white rounded-xl hover:bg-gray-800 font-semibold text-center transition-all hover:shadow-lg hover:-translate-y-0.5"
              >
                Start Free Trial
              </Link>
              <button
                onClick={() => setShowDemoModal(false)}
                className="px-6 py-3.5 border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <Navbar currentPage="home" />

      {/* 2. Hero Section */}
      <section className="relative px-4 sm:px-6 lg:px-8 py-16 sm:py-32 bg-[#0A0A0A] overflow-hidden">
        {/* Abstract Background Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[120px] mix-blend-screen opacity-60 animate-blob"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-600/20 rounded-full blur-[120px] mix-blend-screen opacity-60 animate-blob animation-delay-2000"></div>
          <div className="absolute top-[30%] left-[40%] w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[100px] mix-blend-screen opacity-40 animate-blob animation-delay-4000"></div>
        </div>

        {/* Floating Grid Pattern */}
        <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] opacity-10"></div>

        <div className="relative z-10 max-w-5xl mx-auto text-center pt-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-purple-300 text-sm font-medium mb-8 backdrop-blur-sm animate-fade-in-up">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-purple-500"></span>
            </span>
            New: Smart QR Codes are here
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-white mb-8 leading-[1.1] tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white to-white/70">
            Build stronger digital <br className="hidden md:block" /> connections
          </h1>

          <p className="text-lg sm:text-xl md:text-2xl text-gray-400 mb-12 leading-relaxed max-w-3xl mx-auto font-light">
            Use our <span className="text-purple-400 font-medium">Privacy-First</span> URL Shortener, QR Codes, and Analytics to engage your audience without compromising their data.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center mb-16">
            <Link
              href="/sign-up"
              className="px-8 py-4 bg-white text-black rounded-xl hover:bg-gray-100 font-bold text-lg transition-transform hover:-translate-y-1 shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]"
            >
              Get Started for Free
            </Link>
            <Link
              href="/pricing"
              className="px-8 py-4 bg-transparent border border-white/20 text-white rounded-xl hover:bg-white/10 font-bold text-lg transition-transform hover:-translate-y-1 backdrop-blur-sm"
            >
              View Pricing
            </Link>
          </div>

          {/* Social Proof */}
          <div className="border-t border-white/10 pt-10 pb-4 max-w-4xl mx-auto">
            <div className="flex justify-center gap-12 sm:gap-20 flex-wrap opacity-70 grayscale hover:grayscale-0 transition-all duration-500">
              <div className="flex flex-col items-center gap-1 group">
                <span className="text-2xl font-bold text-white group-hover:text-purple-400 transition-colors">500K+</span>
                <span className="text-xs uppercase tracking-widest text-gray-500">Links Created</span>
              </div>
              <div className="flex flex-col items-center gap-1 group">
                <span className="text-2xl font-bold text-white group-hover:text-blue-400 transition-colors">100K+</span>
                <span className="text-xs uppercase tracking-widest text-gray-500">Happy Users</span>
              </div>
              <div className="flex flex-col items-center gap-1 group">
                <span className="text-2xl font-bold text-white group-hover:text-pink-400 transition-colors">20M+</span>
                <span className="text-xs uppercase tracking-widest text-gray-500">Connections/Mo</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Link Shortener Component Overlay */}
      <div className="relative -mt-24 z-20 px-4 mb-24">
        <div className="max-w-4xl mx-auto transform hover:scale-[1.01] transition-transform duration-500">
          <LinkShortener />
        </div>
        <p className="text-center text-gray-400 text-sm mt-6 mb-12">
          ✨ No credit card required. Free plan includes 100 links/mo.
        </p>

        <div className="max-w-5xl mx-auto">
          <p className="text-center text-gray-500 font-medium text-xs tracking-[0.2em] uppercase mb-8 opacity-80">Trusted by 10,000+ Teams</p>
          <BrandLogos />
        </div>
      </div>


      {/* 3. Features Bento Grid */}
      <section id="features" className="px-4 sm:px-6 lg:px-8 py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mb-6 tracking-tight">
              Everything you need to <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">grow.</span>
            </h2>
            <p className="text-lg text-gray-600">
              Powerful features tailored for modern marketing teams, agencies, and creators.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-[300px]">
            {/* Large Feature 1 */}
            <div className="md:col-span-2 row-span-1 bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-purple-50 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110"></div>
              <div className="relative z-10 flex flex-col h-full justify-between">
                <div>
                  <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mb-6 text-2xl">📊</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Privacy-First Analytics</h3>
                  <p className="text-gray-600 max-w-md">Track clicks, referrers, and locations without compromising user privacy. No cookies, just insights.</p>
                </div>
                <div className="mt-4 flex gap-2">
                  <div className="h-2 w-24 bg-purple-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600 w-3/4"></div>
                  </div>
                  <div className="h-2 w-16 bg-blue-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 w-1/2"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-8 text-white shadow-lg hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6 text-2xl backdrop-blur-sm group-hover:bg-white/20 transition-colors">🎨</div>
              <h3 className="text-2xl font-bold mb-2">Branded Links</h3>
              <p className="text-gray-400">Connect your own domain to build trust and increase click-through rates by up to 34%.</p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 group">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mb-6 text-2xl group-hover:rotate-12 transition-transform">📱</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Smart QR Codes</h3>
              <p className="text-gray-600">Generate customizable QR codes that match your brand identity.</p>
            </div>

            {/* Large Feature 4 */}
            <div className="md:col-span-2 bg-gradient-to-r from-purple-50 to-blue-50 rounded-3xl p-8 border border-purple-100 shadow-sm hover:shadow-xl transition-all duration-300 flex items-center">
              <div className="flex-1">
                <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center mb-6 text-2xl shadow-sm">👥</div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Team Collaboration</h3>
                <p className="text-gray-600">Invite your team, assign roles, and manage links together in shared workspaces.</p>
              </div>
              <div className="hidden sm:flex -space-x-4">
                <div className="w-12 h-12 rounded-full border-4 border-white bg-gray-200"></div>
                <div className="w-12 h-12 rounded-full border-4 border-white bg-gray-300"></div>
                <div className="w-12 h-12 rounded-full border-4 border-white bg-gray-400 flex items-center justify-center text-xs font-bold text-gray-600">+3</div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/features"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 hover:border-gray-300 transition-all font-medium text-sm"
            >
              Explore all 50+ features <span className="text-purple-600">→</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Comparison Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-24 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-purple-600 font-semibold tracking-wider uppercase text-sm">Why switch correctly</span>
            <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mt-2">Better features. Fraction of the cost.</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 space-y-8">
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h3 className="font-bold text-gray-900 text-lg mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span>
                  Privacy First
                </h3>
                <p className="text-gray-600 text-sm">We don&apos;t sell your data or track your users across the web.</p>
              </div>
              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                <h3 className="font-bold text-gray-900 text-lg mb-2 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xs">✓</span>
                  Fair Pricing
                </h3>
                <p className="text-gray-600 text-sm">Stop paying for &quot;enterprise&quot; features you don&apos;t need.</p>
              </div>
            </div>

            <div className="lg:col-span-2 bg-white rounded-3xl border border-gray-200 shadow-xl overflow-hidden">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left font-semibold text-gray-500 text-sm">Feature</th>
                    <th className="px-6 py-4 text-center font-bold text-purple-600 text-lg bg-purple-50/50">short.link</th>
                    <th className="px-6 py-4 text-center font-semibold text-gray-400">Bitly</th>
                    <th className="px-6 py-4 text-center font-semibold text-gray-400">Short.io</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Monthly Price (Starter)</td>
                    <td className="px-6 py-4 text-center font-bold text-green-600 bg-purple-50/30">$12</td>
                    <td className="px-6 py-4 text-center text-gray-500">$29+</td>
                    <td className="px-6 py-4 text-center text-gray-500">$35</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Custom Domains</td>
                    <td className="px-6 py-4 text-center font-bold text-gray-900 bg-purple-50/30">Up to 10</td>
                    <td className="px-6 py-4 text-center text-gray-500">1</td>
                    <td className="px-6 py-4 text-center text-gray-500">3</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">GDPR Compliant Analytics</td>
                    <td className="px-6 py-4 text-center bg-purple-50/30 text-green-600">✅</td>
                    <td className="px-6 py-4 text-center text-gray-500">❌</td>
                    <td className="px-6 py-4 text-center text-gray-500">❌</td>
                  </tr>
                  <tr className="hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">Broken Link Monitoring</td>
                    <td className="px-6 py-4 text-center bg-purple-50/30 text-green-600">✅</td>
                    <td className="px-6 py-4 text-center text-gray-500">❌</td>
                    <td className="px-6 py-4 text-center text-gray-500">❌</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Pricing Preview Section - Simplified for Flow */}
      <section id="pricing" className="px-4 sm:px-6 lg:px-8 py-24 bg-gray-900 text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/30 rounded-full blur-[100px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/20 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-5xl font-bold mb-6">Simple pricing, no surprises.</h2>
            <p className="text-gray-400">Start for free, upgrade as you grow.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Free */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
              <h3 className="text-xl font-bold mb-2">Free</h3>
              <p className="text-gray-400 text-sm mb-6">For hobbyists and testing</p>
              <div className="text-4xl font-bold mb-6">₹0<span className="text-lg text-gray-500 font-normal">/mo</span></div>
              <Link href="/sign-up" className="block w-full py-3 rounded-xl border border-white/20 hover:bg-white hover:text-black transition-all text-center font-semibold mb-8">Get Started</Link>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex gap-2">✓ 100 links/mo</li>
                <li className="flex gap-2">✓ Basic Analytics</li>
                <li className="flex gap-2">✓ Unlimited clicks</li>
              </ul>
            </div>

            {/* Starter */}
            <div className="bg-purple-600 rounded-3xl p-8 transform scale-105 shadow-2xl relative">
              <div className="absolute top-4 right-4 bg-white/20 text-white text-xs font-bold px-2 py-1 rounded-full">POPULAR</div>
              <h3 className="text-xl font-bold mb-2">Starter</h3>
              <p className="text-purple-200 text-sm mb-6">For creators & small teams</p>
              <div className="text-4xl font-bold mb-6">₹999<span className="text-lg text-purple-200 font-normal">/mo</span></div>
              <Link href="/pricing" className="block w-full py-3 rounded-xl bg-white text-purple-600 hover:bg-gray-100 transition-all text-center font-bold mb-8 shadow-lg">Start Free Trial</Link>
              <ul className="space-y-3 text-sm text-white">
                <li className="flex gap-2">✓ <strong>500 links/mo</strong></li>
                <li className="flex gap-2">✓ <strong>Custom Domains (2)</strong></li>
                <li className="flex gap-2">✓ Smart QR Codes</li>
                <li className="flex gap-2">✓ 3 Team Members</li>
              </ul>
            </div>

            {/* Pro */}
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 hover:bg-white/10 transition-colors">
              <h3 className="text-xl font-bold mb-2">Pro</h3>
              <p className="text-gray-400 text-sm mb-6">For scaling businesses</p>
              <div className="text-4xl font-bold mb-6">₹2999<span className="text-lg text-gray-500 font-normal">/mo</span></div>
              <Link href="/pricing" className="block w-full py-3 rounded-xl border border-white/20 hover:bg-white hover:text-black transition-all text-center font-semibold mb-8">Contact Sales</Link>
              <ul className="space-y-3 text-sm text-gray-300">
                <li className="flex gap-2">✓ Unlimited links</li>
                <li className="flex gap-2">✓ 10 Custom Domains</li>
                <li className="flex gap-2">✓ SSO & Advanced Security</li>
                <li className="flex gap-2">✓ Dedicated Support</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 8. Final CTA Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-32 bg-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-8 tracking-tight">
            Ready to enhance your reach?
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Join 100,000+ marketers and creators using short.link to build stronger connections.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/sign-up"
              className="px-10 py-5 bg-black text-white rounded-full hover:bg-gray-800 font-bold text-lg transition-all hover:scale-105 shadow-xl"
            >
              Get Started for Free
            </Link>
          </div>
          <p className="mt-8 text-sm text-gray-400">No credit card required • Cancel anytime</p>
        </div>
      </section>

      {/* 9. Footer */}
      <Footer />
    </div>
  );
}
