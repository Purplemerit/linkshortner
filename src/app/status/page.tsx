'use client';

import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';

export default function StatusPage() {
    const services = [
        { name: 'Link Redirects (Global Edge)', status: 'operational', uptime: '100%' },
        { name: 'API V1', status: 'operational', uptime: '99.99%' },
        { name: 'Dashboard & UI', status: 'operational', uptime: '99.95%' },
        { name: 'Link Creation', status: 'operational', uptime: '100%' },
        { name: 'Analytics Engine', status: 'operational', uptime: '99.98%' },
        { name: 'Database Clusters', status: 'operational', uptime: '100%' },
    ];

    return (
        <div className="min-h-screen bg-gray-50 font-sans">
            <Navbar currentPage="status" />

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-8">
                    <div className="bg-green-500 p-8 text-white text-center">
                        <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 backdrop-blur-sm">
                            <svg className="w-10 h-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-bold mb-2">All Systems Operational</h1>
                        <p className="text-green-100 opacity-90">Last updated: Just now</p>
                    </div>

                    <div className="p-8">
                        <div className="space-y-4">
                            {services.map((service, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 rounded-xl hover:bg-gray-50 transition-colors border border-transparent hover:border-gray-100">
                                    <span className="font-medium text-gray-900">{service.name}</span>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-gray-500 hidden sm:inline-block">{service.uptime}</span>
                                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                            Operational
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <h2 className="text-lg font-bold text-gray-900 mb-6">Past Incidents</h2>
                    <div className="space-y-4 text-left">
                        <div className="bg-white p-6 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-bold text-gray-500 uppercase">Oct 12, 2024</span>
                                <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                                <span className="text-xs font-bold text-green-600">Resolved</span>
                            </div>
                            <h3 className="font-bold text-gray-900">Minor latency in Asia-Pacific region</h3>
                            <p className="text-sm text-gray-600 mt-2">We observed slightly elevated latency for redirects in the AP-South-1 region. Traffic was rerouted to alternative edge nodes immediately. Issue resolved in 5 mins.</p>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-gray-200">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-bold text-gray-500 uppercase">Sep 05, 2024</span>
                                <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                                <span className="text-xs font-bold text-green-600">Resolved</span>
                            </div>
                            <h3 className="font-bold text-gray-900">Scheduled Maintenance</h3>
                            <p className="text-sm text-gray-600 mt-2">Database upgrades completed successfully with zero downtime.</p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}
