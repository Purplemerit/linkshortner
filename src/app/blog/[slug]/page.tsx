import Link from 'next/link';
import type { Metadata } from 'next';

// Blog content database
const blogPosts: { [key: string]: { title: string; content: string; date: string; category: string; author: string } } = {
  'how-to-create-qr-codes-for-your-marketing-campaigns': {
    title: 'How to Create QR Codes for Your Marketing Campaigns',
    date: '2025-11-26',
    category: 'Marketing',
    author: 'Sarah Chen',
    content: `
QR codes have become an essential tool for bridging the gap between offline and online marketing. With short.link, creating customized QR codes is easier than ever.

## Why Use QR Codes?

QR codes offer several advantages for marketers:

- **Instant Access**: Users can scan and access your content immediately
- **Trackable**: Monitor how many people scan your codes and when
- **Versatile**: Use them on print materials, packaging, signage, and more
- **Customizable**: Match your brand colors and add your logo

## Creating Your First QR Code

1. **Create a short link** - Start by shortening your destination URL
2. **Click the QR icon** - Find it next to your newly created link
3. **Customize the design** - Choose colors, add your logo, select a size
4. **Download and use** - Export as PNG, JPEG, or SVG

## Best Practices

- Always test your QR code before printing
- Provide a call-to-action near the code
- Ensure adequate size for easy scanning (minimum 2cm x 2cm)
- Use high contrast colors for better readability
- Track your QR code analytics to measure success
    `
  },
  'privacy-first-analytics-why-it-matters': {
    title: 'Privacy-First Analytics: Why It Matters',
    date: '2025-11-25',
    category: 'Privacy',
    author: 'Michael Rodriguez',
    content: `
In an era of increasing privacy awareness, understanding the difference between traditional analytics and privacy-first approaches is crucial for any business.

## The Problem with Traditional Analytics

Most URL shorteners and analytics platforms use:

- **Cookies** to track users across sites
- **IP logging** to identify individual users
- **Third-party pixels** that share data with advertisers

This approach raises serious privacy concerns and can violate regulations like GDPR and CCPA.

## Our Privacy-First Approach

At short.link, we've built our analytics from the ground up with privacy in mind:

- **No cookies or tracking pixels** - We never set cookies on your visitors
- **IP anonymization** - We hash and anonymize IP addresses immediately
- **Aggregated data only** - We show you trends, not individual user data
- **GDPR compliant by default** - No consent banners needed

## Benefits for Your Business

- Build trust with privacy-conscious users
- Avoid GDPR fines and compliance headaches
- Get accurate analytics without being blocked by ad blockers
- Future-proof your marketing as privacy regulations tighten
    `
  },
  'getting-started-with-short-link': {
    title: 'Getting Started with short.link',
    date: '2025-11-24',
    category: 'Tutorial',
    author: 'Emily Johnson',
    content: `
Welcome to short.link! This guide will walk you through everything you need to know to get started.

## Creating Your First Link

1. **Sign up** for a free account at short.link
2. **Paste your long URL** into the shortener on the dashboard
3. **Click Shorten** - your new short link is ready!

## Customizing Your Links

- **Custom codes** - Instead of random characters, use memorable words
- **Tags** - Organize your links with custom tags
- **Password protection** - Secure sensitive links
- **Expiration** - Set links to expire after a date or number of clicks

## Understanding Analytics

Once your link is created, you can track:

- **Click counts** - Total and unique clicks
- **Geographic data** - Where your visitors are located
- **Devices & browsers** - What technology they're using
- **Referrers** - Where traffic is coming from

## Next Steps

- Explore custom domains for branded links
- Set up team collaboration for your organization
- Integrate with our API for automation
    `
  },
  'custom-domains-best-practices': {
    title: 'Custom Domains: Best Practices for Branded Links',
    date: '2025-11-20',
    category: 'Branding',
    author: 'David Kim',
    content: `
Using a custom domain for your short links can significantly boost trust and click-through rates.

## Why Use Custom Domains?

- **Brand recognition** - Your domain, your identity
- **Higher CTR** - Users trust branded links more
- **Professional appearance** - Look like a serious business
- **Full control** - Own your link infrastructure

## Setting Up a Custom Domain

1. **Add your domain** in the dashboard settings
2. **Configure DNS** - Add the CNAME record we provide
3. **Wait for verification** - Usually takes 5-10 minutes
4. **Start using it** - All new links can use your domain

## Best Practices

- Choose a short, memorable domain
- Consider using a subdomain like go.yourbrand.com
- Set up SSL (we handle this automatically)
- Monitor domain health regularly
    `
  },
  'api-integration-guide': {
    title: 'API Integration Guide: Automate Your Link Management',
    date: '2025-11-15',
    category: 'Development',
    author: 'Alex Thompson',
    content: `
Our REST API allows you to integrate short.link into your applications and workflows.

## Getting Started

First, generate an API key from your dashboard settings. Then make your first request:

\`\`\`bash
curl -X POST https://api.short.link/api/links \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"destination": "https://example.com"}'
\`\`\`

## Common Use Cases

- **CMS Integration** - Auto-shorten links in your content
- **Email Marketing** - Track link clicks in newsletters
- **Social Media** - Shorten links before posting
- **E-commerce** - Create unique links for products

## Rate Limits

- Free: 1,000 requests/month
- Starter: 10,000 requests/month
- Professional: Unlimited

Check our documentation for the complete API reference.
    `
  }
};

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const post = blogPosts[params.slug];
  const title = post?.title || params.slug.replace(/-/g, ' ');
  return {
    title: `${title} - Blog - short.link`,
    description: post ? `Article: ${title}` : `Blog article about ${params.slug.replace(/-/g, ' ')}`,
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts[params.slug];
  const title = post?.title || params.slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-purple-600">short.link</Link>
          <div className="flex gap-4">
            <Link href="/blog" className="px-4 py-2 text-gray-600 hover:text-purple-600 font-semibold">Blog</Link>
            <Link href="/features" className="px-4 py-2 text-gray-600 hover:text-purple-600 font-semibold">Features</Link>
            <Link href="/pricing" className="px-4 py-2 text-gray-600 hover:text-purple-600 font-semibold">Pricing</Link>
            <Link href="/sign-up" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold">Get Started</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-8 py-20">
        {/* Breadcrumb */}
        <div className="mb-8">
          <Link href="/blog" className="text-purple-600 hover:text-purple-700 font-semibold">
            ← Back to Blog
          </Link>
        </div>

        {/* Article Header */}
        <header className="mb-12">
          {post && (
            <span className="inline-block px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold mb-4">
              {post.category}
            </span>
          )}
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">{title}</h1>
          {post && (
            <div className="flex items-center gap-4 text-gray-600">
              <span>By {post.author}</span>
              <span>•</span>
              <span>{post.date}</span>
            </div>
          )}
        </header>

        {/* Article Content */}
        <article className="prose prose-lg max-w-none">
          {post ? (
            <div className="text-gray-700 leading-relaxed">
              {post.content.split('\n\n').map((paragraph, idx) => {
                if (paragraph.startsWith('## ')) {
                  return (
                    <h2 key={idx} className="text-2xl font-bold text-gray-900 mt-10 mb-4">
                      {paragraph.replace('## ', '')}
                    </h2>
                  );
                }
                if (paragraph.startsWith('- ')) {
                  const items = paragraph.split('\n').filter(line => line.startsWith('- '));
                  return (
                    <ul key={idx} className="list-disc pl-6 space-y-2 my-4">
                      {items.map((item, i) => (
                        <li key={i} className="text-gray-600">
                          {item.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
                        </li>
                      ))}
                    </ul>
                  );
                }
                if (paragraph.match(/^\d\./)) {
                  const items = paragraph.split('\n').filter(line => line.match(/^\d\./));
                  return (
                    <ol key={idx} className="list-decimal pl-6 space-y-2 my-4">
                      {items.map((item, i) => (
                        <li key={i} className="text-gray-600">
                          {item.replace(/^\d\.\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
                        </li>
                      ))}
                    </ol>
                  );
                }
                if (paragraph.trim()) {
                  return (
                    <p key={idx} className="my-4 text-gray-600">
                      {paragraph}
                    </p>
                  );
                }
                return null;
              })}
            </div>
          ) : (
            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded">
              <p className="text-gray-700">
                This article is coming soon. Check back later for the full content!
              </p>
            </div>
          )}
        </article>

        {/* CTA */}
        <div className="mt-16 bg-purple-50 p-8 rounded-xl border-2 border-purple-200">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Ready to get started?</h2>
          <p className="text-gray-600 mb-6">
            Start creating short links with privacy-first analytics today.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link
              href="/sign-up"
              className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
            >
              Start Free
            </Link>
            <Link
              href="/features"
              className="px-6 py-3 border-2 border-purple-600 text-purple-600 rounded-lg hover:bg-purple-50 font-semibold"
            >
              View Features
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
