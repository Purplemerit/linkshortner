'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Link from 'next/link';
import { useState } from 'react';

export default function DevelopersPage() {
    const [copied, setCopied] = useState(false);
    const codeSnippet = `curl -X POST https://short.link/api/v1/links \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"url": "https://example.com/long-url"}'`;

    const copyCode = () => {
        navigator.clipboard.writeText(codeSnippet);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar currentPage="developers" />

            {/* Hero */}
            <div className="bg-[#0A0A0A] text-white pt-24 pb-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-900/20 rounded-full blur-[120px] pointer-events-none"></div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center relative z-10">
                    <div>
                        <div className="inline-block px-3 py-1 rounded-full bg-purple-900/30 border border-purple-500/30 text-purple-400 text-sm font-medium mb-6">
                            API v1.0 is live
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-extrabold mb-6 tracking-tight leading-tight">
                            Build powerful link features directly into your app.
                        </h1>
                        <p className="text-gray-400 text-lg mb-8 max-w-lg">
                            Programmatically create short links, manage QR codes, and retrieve analytics with our robust and fast REST API.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Link href="/docs" className="px-6 py-3 bg-white text-black rounded-lg font-bold hover:bg-gray-100 transition-colors">
                                Read Documentation
                            </Link>
                            <Link href="/dashboard/settings/api" className="px-6 py-3 bg-white/10 border border-white/20 text-white rounded-lg font-bold hover:bg-white/20 transition-colors">
                                Get API Key
                            </Link>
                        </div>
                    </div>
                    <div className="bg-gray-900 rounded-xl border border-gray-800 shadow-2xl p-6 font-mono text-sm relative group">
                        <div className="flex items-center justify-between mb-4 border-b border-gray-800 pb-4">
                            <div className="flex space-x-2">
                                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                                <div className="w-3 h-3 rounded-full bg-green-500"></div>
                            </div>
                            <button onClick={copyCode} className="text-gray-500 hover:text-white transition-colors text-xs uppercase tracking-wider">
                                {copied ? 'Copied!' : 'Copy'}
                            </button>
                        </div>
                        <pre className="text-green-400 overflow-x-auto">
                            <code>{codeSnippet}</code>
                        </pre>
                    </div>
                </div>
            </div>

            {/* Features Grid */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="grid md:grid-cols-3 gap-8">
                    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-2xl mb-6">🚀</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">High Performance</h3>
                        <p className="text-gray-500">Global edge network ensures sub-millisecond latency for link redirects and API responses.</p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="w-12 h-12 bg-purple-50 rounded-lg flex items-center justify-center text-2xl mb-6">🔒</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Secure by Default</h3>
                        <p className="text-gray-500">All endpoints require secure authentication tokens. Full HTTPS support.</p>
                    </div>
                    <div className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm">
                        <div className="w-12 h-12 bg-green-50 rounded-lg flex items-center justify-center text-2xl mb-6">📈</div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Webhooks</h3>
                        <p className="text-gray-500">Receive real-time notifications for link clicks and other events directly to your server.</p>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
