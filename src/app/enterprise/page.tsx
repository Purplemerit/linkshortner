import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Enterprise - short.link | Enterprise Solutions',
  description: 'Enterprise solutions for short.link. Custom pricing, dedicated support, and advanced features.',
};

export default function EnterprisePage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-purple-600">short.link</Link>
          <div className="flex gap-4">
            <Link href="/" className="px-4 py-2 text-gray-600 hover:text-purple-600 font-semibold">Home</Link>
          </div>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-8">Enterprise Solutions</h1>
        <p className="text-gray-600 mb-12 text-lg">
          Custom solutions for large organizations
        </p>

        <div className="space-y-8 mb-12">
          <div className="bg-gray-50 p-8 rounded-lg border-2 border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Enterprise Features</h2>
            <ul className="list-disc pl-6 text-gray-600 space-y-2">
              <li>Unlimited links and team members</li>
              <li>Dedicated account manager</li>
              <li>Custom SLA (99.9% uptime)</li>
              <li>On-premise deployment option</li>
              <li>Advanced security features</li>
              <li>Custom integrations</li>
            </ul>
          </div>

          <div className="bg-purple-50 p-8 rounded-lg border-2 border-purple-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact Sales</h2>
            <p className="text-gray-600 mb-4">
              Get in touch with our sales team to discuss your enterprise needs.
            </p>
            <form className="space-y-4">
              <input
                type="email"
                placeholder="your@email.com"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
              />
              <textarea
                placeholder="Tell us about your requirements..."
                rows={4}
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
              />
              <button className="px-8 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold">
                Contact Sales
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

