import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Self-Hosted - short.link | Self-Hosted Installation Guide',
  description: 'Learn how to self-host short.link with Docker. Complete installation and configuration guide.',
};

export default function SelfHostedPage() {
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
        <h1 className="text-5xl font-bold text-gray-900 mb-8">Self-Hosted Guide</h1>
        <div className="prose max-w-none">
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Prerequisites</h2>
          <ul className="list-disc pl-6 text-gray-600 mb-6">
            <li>Docker and Docker Compose</li>
            <li>Domain name with DNS access</li>
            <li>SSL certificate (Let&apos;s Encrypt recommended)</li>
          </ul>
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Installation</h2>
          <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 mb-6">
            <pre className="text-sm">
{`docker-compose up -d`}
            </pre>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mt-8 mb-4">Configuration</h2>
          <p className="text-gray-600 mb-4">
            Edit the .env file to configure your instance:
          </p>
          <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200 mb-6">
            <pre className="text-sm">
{`DOMAIN=yourdomain.com
DATABASE_URL=postgresql://...
REDIS_URL=redis://...`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

