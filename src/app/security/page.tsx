import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Security - short.link | Security & Compliance',
  description: 'Learn about short.link security measures, compliance, and data protection.',
};

export default function SecurityPage() {
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
        <h1 className="text-5xl font-bold text-gray-900 mb-8">Security & Compliance</h1>
        <div className="prose max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Security Measures</h2>
          <ul className="list-disc pl-6 text-gray-600 mb-6">
            <li>All connections encrypted with SSL/TLS</li>
            <li>Regular security audits</li>
            <li>Secure password storage (bcrypt)</li>
            <li>API rate limiting</li>
          </ul>
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Compliance</h2>
          <ul className="list-disc pl-6 text-gray-600 mb-6">
            <li>GDPR compliant</li>
            <li>CCPA compliant</li>
            <li>SOC 2 Type II (in progress)</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

