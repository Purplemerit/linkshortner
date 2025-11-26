import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms of Service - short.link',
  description: 'Terms of Service for short.link. Read our terms and conditions.',
};

export default function TermsPage() {
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

      <div className="max-w-4xl mx-auto px-8 py-20">
        <h1 className="text-5xl font-bold text-gray-900 mb-8">Terms of Service</h1>
        <div className="prose max-w-none">
          <p className="text-gray-600 mb-4">
            <strong>Last Updated:</strong> November 26, 2025
          </p>
          <p className="text-gray-600 mb-6">
            By using short.link, you agree to these Terms of Service.
          </p>
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Acceptable Use</h2>
          <p className="text-gray-600 mb-4">
            You agree not to use short.link for:
          </p>
          <ul className="list-disc pl-6 text-gray-600 mb-6">
            <li>Illegal activities</li>
            <li>Spam or phishing</li>
            <li>Malware distribution</li>
            <li>Copyright infringement</li>
          </ul>
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Service Availability</h2>
          <p className="text-gray-600 mb-4">
            We strive for 99.9% uptime but do not guarantee uninterrupted service.
          </p>
        </div>
      </div>
    </div>
  );
}

