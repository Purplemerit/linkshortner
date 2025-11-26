import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Documentation - short.link | API Reference & Guides',
  description: 'Complete documentation for short.link API, integration guides, and quick start tutorials.',
};

export default function DocsPage() {
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
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Documentation</h1>
        <p className="text-gray-600 mb-12 text-lg">
          Everything you need to integrate short.link into your application
        </p>

        <div className="space-y-8">
          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Quick Start</h2>
            <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
              <pre className="text-sm">
{`POST /api/links
Content-Type: application/json

{
  "destination": "https://example.com/very-long-url"
}

Response:
{
  "id": "link-123",
  "shortCode": "abc123",
  "shortUrl": "https://short.link/abc123",
  "destination": "https://example.com/very-long-url"
}`}
              </pre>
            </div>
          </section>

          <section>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">API Reference</h2>
            <div className="space-y-4">
              <div className="border-l-4 border-purple-600 pl-4">
                <h3 className="font-bold text-lg">POST /api/links</h3>
                <p className="text-gray-600">Create a new short link</p>
              </div>
              <div className="border-l-4 border-purple-600 pl-4">
                <h3 className="font-bold text-lg">GET /api/links</h3>
                <p className="text-gray-600">List all your links</p>
              </div>
              <div className="border-l-4 border-purple-600 pl-4">
                <h3 className="font-bold text-lg">GET /api/links/[id]/analytics</h3>
                <p className="text-gray-600">Get analytics for a specific link</p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

