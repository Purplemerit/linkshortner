'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Link from 'next/link';

export default function HelpCenterPage() {
    const categories = [
        { title: 'Getting Started', icon: '🚀', desc: 'Account setup, quick start guides, and basic concepts.' },
        { title: 'Account Management', icon: '👤', desc: 'Billing, profile settings, and team members.' },
        { title: 'Link Features', icon: '🔗', desc: 'Shortening, custom domains, and QR codes.' },
        { title: 'Analytics', icon: '📊', desc: 'Understanding your data and reports.' },
        { title: 'API & Developers', icon: '💻', desc: 'Integration guides, API keys, and webhooks.' },
        { title: 'Troubleshooting', icon: '🔧', desc: 'Common issues and error messages.' },
    ];

    return (
        <div className="min-h-screen bg-white">
            <Navbar currentPage="help" />

            {/* Hero Search */}
            <div className="bg-purple-600 py-20 px-4 sm:px-6 lg:px-8 text-center text-white relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10"></div>
                <div className="relative z-10 max-w-2xl mx-auto">
                    <h1 className="text-3xl sm:text-4xl font-bold mb-6">How can we help you?</h1>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search for articles..."
                            className="w-full py-4 px-6 pl-12 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-purple-400/50 shadow-2xl"
                        />
                        <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 -mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((cat, idx) => (
                        <Link href="#" key={idx} className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:border-purple-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-2xl mb-4 text-purple-600">
                                {cat.icon}
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">{cat.title}</h3>
                            <p className="text-gray-500 text-sm">{cat.desc}</p>
                        </Link>
                    ))}
                </div>

                <div className="mt-20">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Popular Articles</h2>
                    <div className="bg-white rounded-2xl border border-gray-200 divide-y divide-gray-100">
                        <Link href="#" className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors">
                            <span className="text-gray-700 font-medium">How to verify your custom domain</span>
                            <span className="text-gray-400">→</span>
                        </Link>
                        <Link href="#" className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors">
                            <span className="text-gray-700 font-medium">Setting up Single Sign-On (SSO)</span>
                            <span className="text-gray-400">→</span>
                        </Link>
                        <Link href="#" className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors">
                            <span className="text-gray-700 font-medium">Understanding click Analytics</span>
                            <span className="text-gray-400">→</span>
                        </Link>
                        <Link href="#" className="flex items-center justify-between p-6 hover:bg-gray-50 transition-colors">
                            <span className="text-gray-700 font-medium">API Rate Limits explained</span>
                            <span className="text-gray-400">→</span>
                        </Link>
                    </div>
                </div>

                <div className="mt-16 text-center">
                    <p className="text-gray-600 max-w-xl mx-auto mb-6">Can&apos;t find what you&apos;re looking for?</p>
                    <Link href="/contact" className="inline-block px-8 py-3 bg-gray-900 text-white rounded-lg font-bold hover:bg-black transition-colors shadow-lg">
                        Contact Support
                    </Link>
                </div>
            </div>

            <Footer />
        </div>
    );
}
