import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Comparison - short.link vs Bitly, Short.io | URL Shortener Comparison',
  description: 'Compare short.link with Bitly, Short.io, and Rebrandly. See why short.link offers the best features at the lowest price.',
};

export default function ComparisonPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <a href="/" className="text-2xl font-bold text-purple-600">short.link</a>
          <div className="flex gap-4">
            <a href="/" className="px-4 py-2 text-gray-600 hover:text-purple-600 font-semibold">Home</a>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-4 text-center">
          short.link vs Competitors
        </h1>
        <p className="text-center text-gray-600 mb-12 text-lg">
          See how we compare to the competition
        </p>

        <div className="bg-white rounded-lg border-2 border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead className="bg-purple-600 text-white">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Feature</th>
                <th className="px-6 py-3 text-center font-semibold">short.link</th>
                <th className="px-6 py-3 text-center font-semibold">Bitly</th>
                <th className="px-6 py-3 text-center font-semibold">Short.io</th>
                <th className="px-6 py-3 text-center font-semibold">Rebrandly</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-3 font-semibold">Privacy-First Analytics</td>
                <td className="px-6 py-3 text-center text-green-600 font-bold">✓</td>
                <td className="px-6 py-3 text-center text-red-600">✗</td>
                <td className="px-6 py-3 text-center text-red-600">✗</td>
                <td className="px-6 py-3 text-center text-red-600">✗</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-3 font-semibold">Broken Link Monitoring</td>
                <td className="px-6 py-3 text-center text-green-600 font-bold">✓</td>
                <td className="px-6 py-3 text-center text-red-600">✗</td>
                <td className="px-6 py-3 text-center text-red-600">✗</td>
                <td className="px-6 py-3 text-center text-red-600">✗</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-3 font-semibold">Starting Price</td>
                <td className="px-6 py-3 text-center font-bold text-purple-600">$12/mo</td>
                <td className="px-6 py-3 text-center">$29/mo</td>
                <td className="px-6 py-3 text-center">$35/mo</td>
                <td className="px-6 py-3 text-center">$29/mo</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-3 font-semibold">Custom Domains</td>
                <td className="px-6 py-3 text-center text-green-600 font-bold">✓</td>
                <td className="px-6 py-3 text-center text-green-600">✓</td>
                <td className="px-6 py-3 text-center text-green-600">✓</td>
                <td className="px-6 py-3 text-center text-green-600">✓</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-3 font-semibold">QR Code Generation</td>
                <td className="px-6 py-3 text-center text-green-600 font-bold">✓</td>
                <td className="px-6 py-3 text-center text-green-600">✓</td>
                <td className="px-6 py-3 text-center text-green-600">✓</td>
                <td className="px-6 py-3 text-center text-green-600">✓</td>
              </tr>
              <tr className="border-b border-gray-200 hover:bg-gray-50">
                <td className="px-6 py-3 font-semibold">API Access</td>
                <td className="px-6 py-3 text-center text-green-600 font-bold">✓</td>
                <td className="px-6 py-3 text-center text-green-600">✓</td>
                <td className="px-6 py-3 text-center text-green-600">✓</td>
                <td className="px-6 py-3 text-center text-green-600">✓</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

