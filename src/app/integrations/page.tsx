'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import Link from 'next/link';

export default function IntegrationsPage() {
    const integrationCategories = [
        {
            title: 'Marketing & Analytics',
            tools: [
                { name: 'Google Analytics', icon: '📊', desc: 'Track short link clicks directly in GA4.' },
                { name: 'Segment', icon: '🔄', desc: 'Send click events to your Segment warehouse.' },
                { name: 'Mixpanel', icon: '📉', desc: 'Advanced product analytics for your links.' },
            ]
        },
        {
            title: 'Productivity',
            tools: [
                { name: 'Slack', icon: '💬', desc: 'Shorten links directly from Slack commands.' },
                { name: 'Microsoft Teams', icon: '👥', desc: 'Share branded links in your Teams channels.' },
                { name: 'Zapier', icon: '⚡', desc: 'Automate link creation from 5000+ apps.' },
                { name: 'Notion', icon: '📝', desc: 'Embed rich link previews in Notion docs.' },
            ]
        },
        {
            title: 'Social Media',
            tools: [
                { name: 'Buffer', icon: '📱', desc: 'Auto-shorten links in your scheduled posts.' },
                { name: 'Hootsuite', icon: '🦉', desc: 'Seamless integration for social management.' },
                { name: 'Twitter/X', icon: '🐦', desc: 'Optimized previews for Twiiter cards.' },
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            <Navbar currentPage="integrations" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
                <div className="text-center mb-16 sm:mb-20">
                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
                        Connect with your <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">favorite tools.</span>
                    </h1>
                    <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto">
                        short.link integrates seamlessly with the platforms you use every day, making your workflow smoother and faster.
                    </p>
                </div>

                <div className="space-y-16">
                    {integrationCategories.map((category, idx) => (
                        <div key={idx}>
                            <h2 className="text-2xl font-bold text-gray-900 mb-8 border-b border-gray-100 pb-4">{category.title}</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {category.tools.map((tool, tIdx) => (
                                    <div key={tIdx} className="group p-6 rounded-2xl border border-gray-200 hover:border-purple-200 hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 bg-white">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 bg-gray-50 rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                                                {tool.icon}
                                            </div>
                                            <h3 className="font-bold text-lg text-gray-900">{tool.name}</h3>
                                        </div>
                                        <p className="text-gray-500 text-sm leading-relaxed mb-6">
                                            {tool.desc}
                                        </p>
                                        <Link href="#" className="inline-flex items-center text-sm font-semibold text-purple-600 hover:text-purple-700">
                                            Learn more <span className="ml-1 transition-transform group-hover:translate-x-1">→</span>
                                        </Link>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-24 bg-gray-900 rounded-3xl p-8 sm:p-12 text-center text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-purple-600/20 rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-600/20 rounded-full blur-3xl"></div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-bold mb-4">Don&apos;t see what you need?</h2>
                        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                            We&apos;re constantly adding new integrations. Request a specific tool and we&apos;ll prioritize it.
                        </p>
                        <Link href="/contact" className="px-8 py-3 bg-white text-gray-900 rounded-full font-bold hover:bg-gray-100 transition-colors">
                            Request Integration
                        </Link>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
