import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy Policy - short.link',
  description: 'Privacy policy for short.link. Learn how we protect your data and respect your privacy.',
};

export default function PrivacyPage() {
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
        <h1 className="text-5xl font-bold text-gray-900 mb-8">Privacy Policy</h1>
        <div className="prose max-w-none">
          <p className="text-gray-600 mb-4">
            <strong>Last Updated:</strong> November 26, 2025
          </p>
          <p className="text-gray-600 mb-6">
            At short.link, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information.
          </p>
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Information We Collect</h2>
          <p className="text-gray-600 mb-4">
            We collect minimal information necessary to provide our service:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-6">
            <li>Email address (for account creation)</li>
            <li>Links you create (destination URLs)</li>
            <li>Analytics data (anonymized, no cookies)</li>
          </ul>
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">How We Use Your Information</h2>
          <p className="text-gray-600 mb-4">
            We use your information solely to provide and improve our service. We do not sell or share your data with third parties.
          </p>
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Privacy-First Analytics</h2>
          <p className="text-gray-600 mb-4">
            Our analytics are privacy-first by design:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-6">
            <li>No cookies or tracking pixels</li>
            <li>IP addresses are anonymized</li>
            <li>GDPR-compliant by default</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

