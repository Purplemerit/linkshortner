import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Blog - short.link | URL Shortener Tips & Updates',
  description: 'Read the latest articles about URL shortening, analytics, QR codes, and privacy-first marketing.',
};

export default function BlogPage() {
  const posts = [
    {
      title: 'How to Create QR Codes for Your Marketing Campaigns',
      excerpt: 'Learn how to generate and customize QR codes for your links to boost engagement.',
      date: '2025-11-26',
    },
    {
      title: 'Privacy-First Analytics: Why It Matters',
      excerpt: 'Understanding the importance of privacy-first analytics in today\'s digital landscape.',
      date: '2025-11-25',
    },
    {
      title: 'Getting Started with short.link',
      excerpt: 'A comprehensive guide to getting started with short.link and all its features.',
      date: '2025-11-24',
    },
  ];

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
        <h1 className="text-5xl font-bold text-gray-900 mb-4">Blog</h1>
        <p className="text-gray-600 mb-12 text-lg">
          Tips, tutorials, and updates about URL shortening and digital marketing
        </p>

        <div className="space-y-8">
          {posts.map((post, idx) => (
            <article key={idx} className="bg-white p-8 rounded-lg border-2 border-gray-200 hover:border-purple-600 transition">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">{post.title}</h2>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">{post.date}</span>
                <Link
                  href={`/blog/${post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`}
                  className="text-purple-600 hover:text-purple-700 font-semibold"
                >
                  Read more →
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}

