'use client';

import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { SignedIn, SignedOut } from '@clerk/nextjs';



export default function FeaturesPage() {
  const categories = [
    {
      name: 'Link Management',
      icon: '🔗',
      description: 'Complete control over your shortened links with powerful management tools',
      features: [
        { name: 'Link Shortening', description: 'Create short, memorable links instantly' },
        { name: 'Custom Short URLs', description: 'Choose your own branded short codes' },
        { name: 'HTTPS/SSL Encryption', description: 'Secure links with SSL certificates' },
        { name: 'API Access', description: 'Programmatic link creation and management' },
        { name: 'Link Tagging', description: 'Organize links with custom tags' },
        { name: 'Link History', description: 'Complete audit trail of all changes' },
        { name: 'Password Protection', description: 'Lock links behind passwords' },
        { name: 'Link Expiration', description: 'Auto-expire links after set time' },
        { name: 'Link Editing', description: 'Update destination URLs anytime' },
        { name: 'Bulk Import', description: 'Upload CSV files to create many links' },
        { name: 'Link Cloaking', description: 'Hide destination until clicked' },
        { name: 'Auto-Archive', description: 'Automatically archive old links' },
        { name: 'Multiple Domains', description: 'Use multiple custom domains' },
        { name: 'Link Pause', description: 'Temporarily disable links' },
        { name: 'Link Cloning', description: 'Duplicate existing links' },
        { name: 'Link Notes', description: 'Add internal notes to links' },
      ],
    },
    {
      name: 'Custom Domains',
      icon: '🌐',
      description: 'Brand your links with your own domain for maximum trust and recognition',
      features: [
        { name: 'Domain Setup', description: 'Easy CNAME configuration' },
        { name: 'DNS Verification', description: 'Automatic domain verification' },
        { name: 'SSL Automation', description: 'Free SSL certificates' },
        { name: 'Health Monitoring', description: 'Monitor domain uptime' },
        { name: 'Root Router', description: 'Custom root domain behavior' },
        { name: 'Custom 404 Pages', description: 'Branded error pages' },
        { name: 'Domain Analytics', description: 'Per-domain statistics' },
        { name: 'Multi-Domain Dashboard', description: 'Manage all domains in one place' },
      ],
    },
    {
      name: 'QR Codes',
      icon: '📱',
      description: 'Generate beautiful, customizable QR codes for your short links',
      features: [
        { name: 'QR Generation', description: 'Instant QR code creation' },
        { name: 'PNG Format', description: 'Download as PNG images' },
        { name: 'JPEG Format', description: 'Export to JPEG format' },
        { name: 'SVG Format', description: 'Vector SVG downloads' },
        { name: 'Size Customization', description: 'Adjust QR code dimensions' },
        { name: 'Color Customization', description: 'Match your brand colors' },
        { name: 'Gradients/Patterns', description: 'Apply gradients and patterns' },
        { name: 'Logo Branding', description: 'Add your logo to QR codes' },
      ],
    },
    {
      name: 'Analytics',
      icon: '📊',
      description: 'Deep insights into link performance with comprehensive analytics',
      features: [
        { name: 'Real-Time Dashboard', description: 'Live click tracking' },
        { name: 'Click Counts', description: 'Total and unique clicks' },
        { name: 'Real-Time Tracking', description: 'See clicks as they happen' },
        { name: 'Time-Series Data', description: 'Historical trend analysis' },
        { name: 'Date Filters', description: 'Custom date range reports' },
        { name: 'Unique vs Total', description: 'Distinguish unique visitors' },
        { name: 'Geographic Data', description: 'Country-level tracking' },
        { name: 'City-Level Analytics', description: 'Precise location data' },
        { name: 'Device Tracking', description: 'Mobile vs desktop breakdown' },
        { name: 'Browser Tracking', description: 'Browser usage statistics' },
        { name: 'Referrer Tracking', description: 'See where clicks come from' },
        { name: 'OS Tracking', description: 'Operating system analytics' },
      ],
    },
    {
      name: 'Team & Collaboration',
      icon: '👥',
      description: 'Work together with your team on link management',
      features: [
        { name: 'Multi-User Accounts', description: 'Invite team members' },
        { name: 'Role-Based Access', description: 'Set permissions per user' },
        { name: 'Workspace Segmentation', description: 'Separate workspaces for teams' },
        { name: 'Activity Logs', description: 'Track team member actions' },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <Navbar currentPage="features" />

      {/* Hero Section */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="text-center mb-12 sm:mb-16">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-4 sm:mb-6 bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
            50+ Powerful Features
          </h1>
          <p className="text-sm sm:text-base lg:text-xl text-gray-600 max-w-2xl mx-auto">
            Everything you need to shorten, track, manage, and optimize your links with professional-grade tools
          </p>
        </div>

        {/* Feature Categories */}
        <div className="space-y-16">
          {categories.map((category, idx) => (
            <div key={idx} className="bg-white rounded-2xl border-2 border-gray-200 p-8 shadow-lg hover:shadow-xl transition-shadow">
              {/* Category Header */}
              <div className="mb-8">
                <div className="flex items-center gap-4 mb-3">
                  <span className="text-5xl">{category.icon}</span>
                  <h2 className="text-4xl font-bold text-gray-900">{category.name}</h2>
                </div>
                <p className="text-gray-600 text-lg ml-16">{category.description}</p>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {category.features.map((feature, fIdx) => (
                  <div
                    key={fIdx}
                    className="group bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border-2 border-gray-200 hover:border-purple-400 hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center mt-0.5">
                        <span className="text-purple-600 font-bold text-sm">✓</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-bold text-gray-900 mb-1 group-hover:text-purple-600 transition-colors">
                          {feature.name}
                        </h3>
                        <p className="text-xs text-gray-600 leading-relaxed">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* CTA Section */}
        <div className="mt-12 sm:mt-16 lg:mt-20 bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 text-white rounded-lg sm:rounded-2xl p-6 sm:p-8 lg:p-12 text-center shadow-xl lg:shadow-2xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-3 sm:mb-4">Ready to experience all these features?</h2>
          <p className="text-purple-100 mb-6 sm:mb-8 text-xs sm:text-sm lg:text-xl">
            Start with 100 free links per month. Upgrade anytime to unlock advanced features.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <SignedOut>
              <Link
                href="/sign-up?redirect_url=/onboarding/choose-plan"
                className="px-6 sm:px-10 py-2 sm:py-4 bg-white text-purple-600 rounded-lg sm:rounded-xl hover:bg-gray-100 font-bold text-sm sm:text-base lg:text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Start Free Trial
              </Link>
            </SignedOut>
            <SignedIn>
              <Link
                href="/dashboard"
                className="px-6 sm:px-10 py-2 sm:py-4 bg-white text-purple-600 rounded-lg sm:rounded-xl hover:bg-gray-100 font-bold text-sm sm:text-base lg:text-lg shadow-lg hover:shadow-xl transition-all"
              >
                Go to Dashboard
              </Link>
            </SignedIn>

            <Link
              href="/pricing"
              className="px-6 sm:px-10 py-2 sm:py-4 border-2 border-white text-white rounded-lg sm:rounded-xl hover:bg-purple-700 font-bold text-sm sm:text-base lg:text-lg transition-all"
            >
              View Plans
            </Link>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-12 sm:mt-16 lg:mt-20 grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="text-center p-4 sm:p-6 bg-white rounded-lg border-2 border-gray-200 hover:border-purple-400 transition-colors">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-600 mb-2">50+</div>
            <div className="text-xs sm:text-sm lg:text-base text-gray-600">Features</div>
          </div>
          <div className="text-center p-4 sm:p-6 bg-white rounded-lg border-2 border-gray-200 hover:border-purple-400 transition-colors">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-600 mb-2">99.9%</div>
            <div className="text-xs sm:text-sm lg:text-base text-gray-600">Uptime</div>
          </div>
          <div className="text-center p-4 sm:p-6 bg-white rounded-lg border-2 border-gray-200 hover:border-purple-400 transition-colors">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-600 mb-2">24/7</div>
            <div className="text-xs sm:text-sm lg:text-base text-gray-600">Support</div>
          </div>
          <div className="text-center p-4 sm:p-6 bg-white rounded-lg border-2 border-gray-200 hover:border-purple-400 transition-colors">
            <div className="text-2xl sm:text-3xl lg:text-4xl font-bold text-purple-600 mb-2">∞</div>
            <div className="text-xs sm:text-sm lg:text-base text-gray-600">Redirects</div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
