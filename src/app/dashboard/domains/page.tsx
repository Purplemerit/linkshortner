'use client';

import { useState, useEffect } from 'react';
import { DomainSetup } from '@/components/DomainSetup';
import { useSubscription } from '@/hooks/useSubscription';

interface Domain {
    id: string;
    domain: string;
    verified: boolean;
    verifiedAt: string | null;
    createdAt: string;
}

export default function DomainsPage() {
    const [domains, setDomains] = useState<Domain[]>([]);
    const [loading, setLoading] = useState(true);
    const [showSetup, setShowSetup] = useState(false);

    useEffect(() => {
        fetchDomains();
    }, []);

    const fetchDomains = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/domains');
            if (res.ok) {
                const data = await res.json();
                setDomains(data);
            }
        } catch (error) {
            console.error('Failed to fetch domains:', error);
        } finally {
            setLoading(false);
        }
    };

    const { plan, loading: planLoading } = useSubscription();

    if (planLoading) return <div className="p-8 text-center">Loading subscription...</div>;

    if (plan && plan.name === 'FREE') {
        return (
            <div className="max-w-6xl mx-auto px-8 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Custom Domains</h1>
                <p className="text-gray-600 mb-8">Connect your own domain to create branded short links</p>

                <div className="bg-gradient-to-br from-purple-50 to-white border-2 border-purple-100 rounded-2xl p-8 text-center max-w-2xl mx-auto">
                    <div className="text-5xl mb-4">💎</div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Upgrade to Connect Domains</h2>
                    <p className="text-gray-600 mb-8 text-lg">
                        Custom domains are available on Starter and Professional plans.
                        Brand your links with your own domain like <strong>links.brand.com</strong>.
                    </p>
                    <a href="/pricing" className="inline-block px-8 py-4 bg-purple-600 text-white rounded-xl hover:bg-purple-700 font-bold transition-transform hover:scale-105 shadow-lg shadow-purple-200">
                        View Upgrade Options
                    </a>
                </div>
            </div>
        );
    }

    const handleDomainVerified = () => {
        setShowSetup(false);
        fetchDomains();
    };

    const handleDelete = async (domainId: string) => {
        if (!confirm('Are you sure you want to remove this domain?')) return;

        try {
            const res = await fetch(`/api/domains/${domainId}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                fetchDomains();
            } else {
                alert('Failed to delete domain');
            }
        } catch (error) {
            console.error('Error deleting domain:', error);
            alert('Error deleting domain');
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-8 py-8">
            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Custom Domains</h1>
                    <p className="text-gray-600">
                        Connect your own domain to create branded short links
                    </p>
                </div>
                <button
                    onClick={() => setShowSetup(true)}
                    className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
                >
                    + Add Domain
                </button>
            </div>

            {/* Add Domain Modal */}
            {showSetup && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
                    <div className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 shadow-2xl relative">
                        <button
                            onClick={() => setShowSetup(false)}
                            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                        >
                            ×
                        </button>
                        <DomainSetup onDomainVerified={handleDomainVerified} />
                    </div>
                </div>
            )}

            {/* Domains List */}
            {loading ? (
                <div className="text-center py-12 text-gray-500">Loading domains...</div>
            ) : domains.length === 0 ? (
                <div className="bg-white rounded-xl border-2 border-gray-200 p-12 text-center">
                    <div className="text-6xl mb-4">🌐</div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">No custom domains yet</h3>
                    <p className="text-gray-600 mb-6">
                        Add a custom domain to create branded short links like links.yourbrand.com/abc123
                    </p>
                    <button
                        onClick={() => setShowSetup(true)}
                        className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
                    >
                        Add Your First Domain
                    </button>
                </div>
            ) : (
                <div className="bg-white rounded-xl border-2 border-gray-200 overflow-hidden">
                    <table className="w-full">
                        <thead className="bg-gray-50 border-b-2 border-gray-200">
                            <tr>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                    Domain
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                    Verified
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                    Added
                                </th>
                                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {domains.map((domain) => (
                                <tr key={domain.id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <code className="text-purple-600 font-mono font-semibold">
                                            {domain.domain}
                                        </code>
                                    </td>
                                    <td className="px-6 py-4">
                                        {domain.verified ? (
                                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                                                ✓ Verified
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                                                ⏳ Pending
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {domain.verifiedAt
                                            ? new Date(domain.verifiedAt).toLocaleDateString()
                                            : '-'}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-600">
                                        {new Date(domain.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => handleDelete(domain.id)}
                                            className="text-red-600 hover:text-red-700 font-semibold text-sm"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Info Section */}
            <div className="mt-8 bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                <h3 className="font-bold text-blue-900 mb-2">📘 How to add a custom domain:</h3>
                <ol className="list-decimal list-inside space-y-2 text-sm text-blue-800">
                    <li>Click &quot;Add Domain&quot; and enter your domain name</li>
                    <li>Add the CNAME record to your DNS provider (Cloudflare, GoDaddy, etc.)</li>
                    <li>Wait for DNS propagation (usually 5-10 minutes)</li>
                    <li>We&apos;ll automatically verify your domain</li>
                    <li>Start creating short links with your custom domain!</li>
                </ol>
            </div>
        </div>
    );
}
