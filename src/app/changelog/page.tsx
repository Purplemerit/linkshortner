'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function ChangelogPage() {
    const changes = [
        {
            version: 'v2.1.0',
            date: 'October 15, 2024',
            title: 'Smart QR Codes & Team Workspaces',
            type: 'Major Release',
            items: [
                'Introduced fully customizable QR codes with logo support.',
                'Added Team Workspaces for collaborative link management.',
                'New "Dark Mode" for the dashboard (beta).',
                'Improved API rate limits for Pro plan users.'
            ]
        },
        {
            version: 'v2.0.4',
            date: 'September 28, 2024',
            title: 'Analytics Performance Improvements',
            type: 'Update',
            items: [
                'Real-time analytics are now 3x faster.',
                'Fixed an issue with CSV exports for large datasets.',
                'Added device-specific breakdown in reports.'
            ]
        },
        {
            version: 'v2.0.0',
            date: 'August 10, 2024',
            title: 'The New Brand Identity',
            type: 'Major Release',
            items: [
                'Complete UI redesign with a focus on ease of use.',
                'Launched new public API with comprehensive documentation.',
                'Added SSO support for Enterprise customers.',
                'Simplified billing dashboard.'
            ]
        }
    ];

    return (
        <div className="min-h-screen bg-white">
            <Navbar currentPage="changelog" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="text-center mb-16">
                    <span className="text-purple-600 font-semibold tracking-wider uppercase text-sm">Product Updates</span>
                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-3 mb-6">Changelog</h1>
                    <p className="text-lg text-gray-500">
                        See what&apos;s new and how we&apos;re improving short.link.
                    </p>
                </div>

                <div className="space-y-12 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-gray-200 before:to-transparent">
                    {changes.map((change, idx) => (
                        <div key={idx} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group">

                            {/* Dot */}
                            <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-gray-100 group-hover:bg-purple-600 group-hover:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 transition-colors z-10">
                                <svg className="fill-current w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 12 12">
                                    <path d="M12 2.585L10.59.585 6 5.175 1.41.585 0 2.585l6 6z" />
                                    <path d="M0 7.415l1.41-2 4.59 4.59 4.59-4.59 1.41 2-6 6z" transform="rotate(180 6 6)" />
                                </svg>
                            </div>

                            {/* Card */}
                            <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
                                <div className="flex items-center justify-between mb-2">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${change.type === 'Major Release' ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-600'}`}>
                                        {change.type}
                                    </span>
                                    <time className="text-xs text-gray-400 font-medium">{change.date}</time>
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">{change.title} <span className="text-gray-400 font-normal text-sm ml-2">({change.version})</span></h3>
                                <ul className="space-y-2 mt-4">
                                    {change.items.map((item, i) => (
                                        <li key={i} className="flex items-start text-sm text-gray-600">
                                            <span className="mr-2 text-purple-500">•</span>
                                            {item}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <Footer />
        </div>
    );
}
