import Link from 'next/link';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  return {
    title: `${params.slug.replace(/-/g, ' ')} - Blog - short.link`,
    description: `Article: ${params.slug.replace(/-/g, ' ')}`,
  };
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const title = params.slug.replace(/-/g, ' ');

  return (
    <div className="min-h-screen bg-white">
      <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-8 py-4 flex justify-between items-center">
          <Link href="/" className="text-2xl font-bold text-purple-600">short.link</Link>
          <div className="flex gap-4">
            <Link href="/blog" className="px-4 py-2 text-gray-600 hover:text-purple-600 font-semibold">Blog</Link>
          </div>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-8 py-20">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">{title}</h1>
        <p className="text-gray-600 mb-8">This is a placeholder article page generated from the slug.</p>

        <div className="prose">
          <p>Full article content will be available here in production. Use the admin or CMS to add posts.</p>
        </div>

        <div className="mt-10">
          <Link href="/blog" className="text-purple-600 hover:text-purple-700 font-semibold">← Back to Blog</Link>
        </div>
      </main>
    </div>
  );
}
