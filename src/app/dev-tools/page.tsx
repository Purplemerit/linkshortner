'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import { Navbar } from '@/components/Navbar';

export default function DevToolsPage() {
    const { user } = useUser();
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<any>(null);

    const grantSubscription = async () => {
        setLoading(true);
        setResult(null);

        try {
            const response = await fetch('/api/dev/grant-subscription', {
                method: 'POST',
            });

            const data = await response.json();
            setResult(data);
        } catch (error) {
            setResult({ error: 'Failed to grant subscription' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar currentPage="dev-tools" />
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
                <div className="bg-white rounded-xl border-2 border-gray-200 p-4 sm:p-6 lg:p-8 shadow-lg">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">🛠️ Dev Tools</h1>
                        <p className="text-gray-600">Development utilities for testing</p>
                    </div>

                    {/* User Info */}
                    {user && (
                        <div className="mb-8 p-3 sm:p-4 lg:p-6 bg-blue-50 border-2 border-blue-200 rounded-lg">
                            <h2 className="font-bold text-blue-900 mb-2 text-base sm:text-lg">Current User</h2>
                            <p className="text-sm text-blue-800">
                                📧 {user.emailAddresses[0]?.emailAddress}
                            </p>
                            <p className="text-xs text-blue-600 mt-1">
                                ID: {user.id}
                            </p>
                        </div>
                    )}

                    {/* Grant Subscription */}
                    <div className="mb-8">
                        <h2 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900 mb-4">
                            Grant Test Subscription
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Click below to grant yourself a PROFESSIONAL plan subscription for testing.
                            This will give you access to all premium features for 1 year.
                        </p>

                        <button
                            onClick={grantSubscription}
                            disabled={loading}
                            className="w-full px-4 sm:px-6 lg:px-8 py-3 sm:py-4 lg:py-5 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-bold text-base sm:text-lg lg:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? '⏳ Processing...' : '🚀 Grant PROFESSIONAL Subscription'}
                        </button>
                    </div>

                    {/* Result */}
                    {result && (
                        <div className={`p-4 sm:p-6 lg:p-8 rounded-lg border-2 ${result.success
                            ? 'bg-green-50 border-green-200'
                            : 'bg-red-50 border-red-200'
                            }`}>
                            <h3 className={`font-bold mb-3 ${result.success ? 'text-green-900' : 'text-red-900'
                                }`}>
                                {result.success ? '✅ Success!' : '❌ Error'}
                            </h3>

                            {result.message && (
                                <p className={`mb-4 ${result.success ? 'text-green-800' : 'text-red-800'
                                    }`}>
                                    {result.message}
                                </p>
                            )}

                            {result.subscription && (
                                <div className="mb-4 p-3 sm:p-4 lg:p-5 bg-white rounded-lg">
                                    <p className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">Subscription Details:</p>
                                    <ul className="space-y-1 text-sm text-gray-700">
                                        <li>📦 Plan: <strong>{result.subscription.plan}</strong></li>
                                        <li>✅ Status: <strong>{result.subscription.status}</strong></li>
                                        <li>📅 Valid Until: <strong>{result.subscription.validUntil}</strong></li>
                                    </ul>
                                </div>
                            )}

                            {result.features && (
                                <div className="space-y-2">
                                    <p className="font-semibold text-green-900 text-base sm:text-lg">Features Unlocked:</p>
                                    {result.features.map((feature: string, idx: number) => (
                                        <p key={idx} className="text-sm text-green-800 ml-4">
                                            {feature}
                                        </p>
                                    ))}
                                </div>
                            )}

                            {result.error && (
                                <p className="text-red-800">{result.error}</p>
                            )}

                            <div className="mt-6 pt-4 border-t border-gray-300">
                                <a
                                    href="/dashboard"
                                    className="inline-block px-4 sm:px-6 lg:px-8 py-2 sm:py-3 lg:py-4 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold text-sm sm:text-base"
                                >
                                    Go to Dashboard →
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Info */}
                    <div className="mt-8 p-3 sm:p-4 lg:p-6 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
                        <h3 className="font-bold text-yellow-900 mb-2 text-base sm:text-lg">⚠️ Development Only</h3>
                        <p className="text-sm text-yellow-800">
                            This tool is for development and testing purposes only. In production,
                            subscriptions should only be created through the Razorpay payment flow.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
