'use client';

import { useState, useEffect } from 'react';

export default function ApiAccessPage() {
    const [apiKey, setApiKey] = useState<string | null>(null);
    const [apiCalls, setApiCalls] = useState(0);
    const [loading, setLoading] = useState(true);
    const [copied, setCopied] = useState(false);
    const [regenerating, setRegenerating] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchApiKey();
    }, []);

    const fetchApiKey = async () => {
        try {
            setError(null);
            const res = await fetch('/api/user/api-key');
            
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to fetch API key');
            }
            
            const data = await res.json();
            setApiKey(data.apiKey);
            setApiCalls(data.apiCalls || 0);
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMsg);
            console.error('Failed to fetch API key:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = () => {
        if (apiKey) {
            navigator.clipboard.writeText(apiKey);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleRegenerate = async () => {
        setRegenerating(true);
        setError(null);
        try {
            const res = await fetch('/api/user/api-key', {
                method: 'POST',
            });
            
            if (!res.ok) {
                const data = await res.json();
                throw new Error(data.error || 'Failed to regenerate key');
            }
            
            const data = await res.json();
            setApiKey(data.apiKey);
            setShowConfirm(false);
            setCopied(false);
        } catch (err) {
            const errorMsg = err instanceof Error ? err.message : 'An error occurred';
            setError(errorMsg);
            console.error('Failed to regenerate key:', err);
        } finally {
            setRegenerating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        );
    }

    return (
        <div className="space-y-8 p-6 md:p-8">
            {/* Error Message */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-sm text-red-800">{error}</p>
                </div>
            )}

            {/* API Key Card */}
            <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">API Key</h2>
                <p className="text-sm text-gray-600 mb-6">
                    Use this key to authenticate your API requests. Keep it secret and never share it in client-side code or public repositories.
                </p>

                {/* API Key Display */}
                <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 mb-6">
                    <div className="flex flex-col sm:flex-row gap-3">
                        <div className="flex-1 flex items-center">
                            <code className="font-mono text-xs md:text-sm text-gray-700 break-all">
                                {apiKey ? apiKey : 'No API key generated'}
                            </code>
                        </div>
                        <button
                            onClick={handleCopy}
                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold transition-colors text-sm whitespace-nowrap"
                        >
                            {copied ? '✓ Copied!' : '📋 Copy'}
                        </button>
                    </div>
                </div>

                {/* Regenerate Key Section */}
                <div className="border-t-2 border-gray-200 pt-6">
                    {!showConfirm ? (
                        <button
                            onClick={() => setShowConfirm(true)}
                            className="text-sm text-purple-600 font-semibold hover:text-purple-700 hover:underline"
                        >
                            🔄 Regenerate Key
                        </button>
                    ) : (
                        <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200 mt-4">
                            <p className="text-sm text-red-900 font-bold mb-4">
                                ⚠️ Are you sure? This will invalidate your current API key immediately.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-3">
                                <button
                                    onClick={handleRegenerate}
                                    disabled={regenerating}
                                    className="px-4 py-2 bg-red-600 text-white text-sm rounded-lg hover:bg-red-700 font-semibold disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {regenerating ? '🔄 Regenerating...' : '✓ Yes, Regenerate'}
                                </button>
                                <button
                                    onClick={() => setShowConfirm(false)}
                                    className="px-4 py-2 bg-white text-gray-700 text-sm border-2 border-gray-300 rounded-lg hover:bg-gray-50 font-semibold transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Usage Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                <div className="bg-white p-6 rounded-lg border-2 border-gray-200 shadow-sm">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Total API Calls</h3>
                    <p className="text-3xl md:text-4xl font-bold text-purple-600">{apiCalls.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-2">This month</p>
                </div>
                <div className="bg-white p-6 rounded-lg border-2 border-gray-200 shadow-sm">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Rate Limit</h3>
                    <p className="text-3xl md:text-4xl font-bold text-blue-600">100/min</p>
                    <p className="text-xs text-gray-500 mt-2">Requests per minute</p>
                </div>
                <div className="bg-white p-6 rounded-lg border-2 border-gray-200 shadow-sm">
                    <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Status</h3>
                    <p className="text-3xl md:text-4xl font-bold text-green-600">✓ Active</p>
                    <p className="text-xs text-gray-500 mt-2">API is working</p>
                </div>
            </div>

            {/* API Documentation */}
            <div className="bg-white rounded-xl border-2 border-gray-200 shadow-sm p-6 md:p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">API Documentation</h2>

                {/* Authentication Section */}
                <div className="mb-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Authentication</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        Include your API key in the <code className="bg-gray-100 px-2 py-1 rounded text-purple-600">Authorization</code> header with the Bearer scheme:
                    </p>
                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                        <code className="text-green-400 text-xs md:text-sm font-mono block whitespace-pre">
{`Authorization: Bearer ${apiKey || 'YOUR_API_KEY'}`}
                        </code>
                    </div>
                </div>

                {/* Create Short Link */}
                <div className="mb-8 border-t-2 border-gray-200 pt-8">
                    <h3 className="text-lg font-bold text-gray-900 mb-3">Create Short Link</h3>
                    <p className="text-sm text-gray-600 mb-4">
                        <strong>Endpoint:</strong> <code className="bg-gray-100 px-2 py-1 rounded text-purple-600">POST /api/links</code>
                    </p>

                    <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-900 mb-2">Request Body:</p>
                        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                            <code className="text-cyan-400 text-xs md:text-sm font-mono">
{`{
  "destination": "https://example.com/very/long/url",
  "customCode": "my-link",      // optional
  "tags": ["tag1", "tag2"]      // optional
}`}
                            </code>
                        </div>
                    </div>

                    <div>
                        <p className="text-sm font-semibold text-gray-900 mb-2">Example cURL Request:</p>
                        <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                            <code className="text-green-400 text-xs md:text-sm font-mono block whitespace-pre">
{`curl -X POST https://short.link/api/links \\
  -H "Authorization: Bearer ${apiKey || 'YOUR_API_KEY'}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "destination": "https://example.com"
  }'`}
                            </code>
                        </div>
                    </div>
                </div>

                {/* Response Example */}
                <div className="border-t-2 border-gray-200 pt-8">
                    <p className="text-sm font-semibold text-gray-900 mb-2">Response:</p>
                    <div className="bg-gray-900 rounded-lg p-4 overflow-x-auto">
                        <code className="text-yellow-400 text-xs md:text-sm font-mono block whitespace-pre">
{`{
  "id": "507f1f77bcf86cd799439011",
  "shortCode": "abc123",
  "shortUrl": "https://short.link/abc123",
  "destination": "https://example.com",
  "clicks": 0,
  "createdAt": "2024-01-22T10:30:00Z"
}`}
                        </code>
                    </div>
                </div>
            </div>

            {/* Rate Limiting Info */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
                <h3 className="font-bold text-blue-900 mb-2">ℹ️ Rate Limiting</h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• <strong>Rate Limit:</strong> 100 requests per minute</li>
                    <li>• <strong>Response Code:</strong> 429 (Too Many Requests) if limit exceeded</li>
                    <li>• <strong>Retry-After:</strong> Check the Retry-After header for when you can retry</li>
                </ul>
            </div>

            {/* Best Practices */}
            <div className="bg-green-50 border-2 border-green-200 rounded-lg p-6">
                <h3 className="font-bold text-green-900 mb-2">✓ Best Practices</h3>
                <ul className="text-sm text-green-800 space-y-1">
                    <li>• Keep your API key secret - never commit it to version control</li>
                    <li>• Use environment variables to store your API key</li>
                    <li>• Regenerate your key if you suspect it has been compromised</li>
                    <li>• Monitor your API usage from the dashboard</li>
                    <li>• Use meaningful custom codes for better tracking</li>
                </ul>
            </div>
        </div>
    );
}
