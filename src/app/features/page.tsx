import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Features - short.link | 50+ URL Shortener Features',
  description: 'Explore all 50+ features of short.link: link shortening, QR codes, analytics, custom domains, team collaboration, and more.',
};

export default function FeaturesPage() {
  const categories = [
    {
      name: 'Link Management',
      features: [
        'Link Shortening',
        'Custom Short URLs',
        'HTTPS/SSL Encryption',
        'API Access',
        'Link Tagging',
        'Link History',
        'Password Protection',
        'Link Expiration',
        'Link Editing',
        'Bulk Import',
        'Link Cloaking',
        'Auto-Archive',
        'Multiple Domains',
        'Link Pause',
        'Link Cloning',
        'Link Notes',
      ],
    },
    {
      name: 'Custom Domains',
      features: [
        'Domain Setup',
        'DNS Verification',
        'SSL Automation',
        'Health Monitoring',
        'Root Router',
        'Custom 404 Pages',
        'Domain Analytics',
        'Multi-Domain Dashboard',
      ],
    },
    {
      name: 'QR Codes',
      features: [
        'QR Generation',
        'PNG Format',
        'JPEG Format',
        'SVG Format',
        'Size Customization',
        'Color Customization',
        'Gradients/Patterns',
        'Logo Branding',
      ],
    },
    {
      name: 'Analytics',
      features: [
        'Real-Time Dashboard',
        'Click Counts',
        'Real-Time Tracking',
        'Time-Series Data',
        'Date Filters',
        'Unique vs Total',
        'Geographic Data',
        'City-Level Analytics',
        'Device Tracking',
        'Browser Tracking',
        'Referrer Tracking',
        'OS Tracking',
      ],
    },
    {
      name: 'Team & Collaboration',
      features: [
        'Multi-User Accounts',
        'Role-Based Access',
        'Workspace Segmentation',
        'Activity Logs',
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
              <Link href="/" className="text-2xl font-bold text-purple-600">short.link</Link>
          <div className="flex gap-4">
                <Link href="/" className="px-4 py-2 text-gray-600 hover:text-purple-600 font-semibold">Home</Link>
            <a href="/pricing" className="px-4 py-2 text-gray-600 hover:text-purple-600 font-semibold">Pricing</a>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-4 text-center">
          All 50+ Features
        </h1>
        <p className="text-center text-gray-600 mb-12 text-lg">
          Everything you need to shorten, track, and manage your links
        </p>

        {categories.map((category, idx) => (
          <div key={idx} className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">{category.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {category.features.map((feature, fIdx) => (
                <div
                  key={fIdx}
                  className="bg-gray-50 p-4 rounded-lg border-2 border-gray-200 hover:border-purple-600 transition"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-purple-600">✓</span>
                    <span className="font-semibold text-gray-900">{feature}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}

        <div className="text-center mt-12">
          <a
            href="/pricing"
            className="px-8 py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-bold text-lg inline-block"
          >
            Get Started with All Features
          </a>
        </div>
      </div>
    </div>
  );
}

