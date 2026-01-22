import type { Metadata } from 'next';
import Link from 'next/link';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Blog - short.link | URL Shortener Tips & Updates',
  description: 'Read the latest articles about URL shortening, analytics, QR codes, and privacy-first marketing.',
};

const posts = [
  {
    slug: 'how-to-create-qr-codes-for-your-marketing-campaigns',
    title: 'How to Create QR Codes for Your Marketing Campaigns',
    excerpt: 'Learn how to generate and customize QR codes for your links to boost engagement and track offline-to-online conversions.',
    date: '2025-11-26',
    category: 'Marketing',
    readTime: '5 min read',
  },
  {
    slug: 'privacy-first-analytics-why-it-matters',
    title: 'Privacy-First Analytics: Why It Matters',
    excerpt: 'Understanding the importance of privacy-first analytics in today\'s digital landscape and how it benefits your business.',
    date: '2025-11-25',
    category: 'Privacy',
    readTime: '7 min read',
  },
  {
    slug: 'getting-started-with-short-link',
    title: 'Getting Started with short.link',
    excerpt: 'A comprehensive guide to getting started with short.link and all its features. From your first link to advanced analytics.',
    date: '2025-11-24',
    category: 'Tutorial',
    readTime: '10 min read',
  },
  {
    slug: 'custom-domains-best-practices',
    title: 'Custom Domains: Best Practices for Branded Links',
    excerpt: 'Discover how to set up and manage custom domains for branded short links that increase trust and click-through rates.',
    date: '2025-11-20',
    category: 'Branding',
    readTime: '6 min read',
  },
  {
    slug: 'api-integration-guide',
    title: 'API Integration Guide: Automate Your Link Management',
    excerpt: 'Learn how to integrate short.link\'s API into your workflow for automated link creation and analytics retrieval.',
    date: '2025-11-15',
    category: 'Development',
    readTime: '8 min read',
  },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar currentPage="blog" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold text-gray-900 mb-3 sm:mb-4">Blog</h1>
        <p className="text-xs sm:text-sm lg:text-base xl:text-lg text-gray-600 mb-8 sm:mb-12">
          Tips, tutorials, and updates about URL shortening and digital marketing
        </p>

        <div className="space-y-6 sm:space-y-8">
          {posts.map((post) => (
            <article key={post.slug} className="bg-white p-4 sm:p-6 lg:p-8 rounded-lg sm:rounded-2xl border-2 border-gray-200 hover:border-purple-400 transition">
              <div className="flex items-center gap-3 sm:gap-4 mb-2 sm:mb-3 flex-wrap">
                <span className="px-2 sm:px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs sm:text-sm font-semibold">
                  {post.category}
                </span>
                <span className="text-xs sm:text-sm text-gray-500">{post.readTime}</span>
              </div>
              <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 hover:text-purple-600 transition">
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-3 sm:mb-4">{post.excerpt}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs sm:text-sm text-gray-500">{post.date}</span>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-purple-600 hover:text-purple-700 font-semibold text-xs sm:text-sm"
                >
                  Read more →
                </Link>
              </div>
            </article>
          ))}
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 sm:mt-16 bg-purple-50 p-4 sm:p-6 lg:p-8 rounded-lg sm:rounded-2xl border-2 border-purple-200">
          <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-2 sm:mb-4">Stay Updated</h2>
          <p className="text-xs sm:text-sm lg:text-base text-gray-600 mb-4 sm:mb-6">
            Get the latest tips and updates delivered to your inbox. No spam, unsubscribe anytime.
          </p>
          <form className="flex gap-2 sm:gap-4 flex-col sm:flex-row">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 min-w-[200px] px-3 sm:px-4 py-2 sm:py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 text-xs sm:text-sm"
            />
            <button
              type="submit"
              className="px-4 sm:px-6 py-2 sm:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold text-xs sm:text-sm whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>
      <Footer />
    </div>
  );
}
