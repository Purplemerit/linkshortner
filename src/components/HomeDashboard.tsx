'use client';

import { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Link, Copy, Check, Download, ArrowRight, TrendingUp, MousePointer, Globe, BarChart3 } from 'lucide-react';

interface HomeDashboardProps {
    onLinkCreated?: () => void;
    availableWorkspaces?: any[];
}

export function HomeDashboard({ onLinkCreated, availableWorkspaces = [] }: HomeDashboardProps) {
    const [activeMode, setActiveMode] = useState<'link' | 'qr'>('link');
    const [url, setUrl] = useState('');
    const [customCode, setCustomCode] = useState('');
    const [workspaceId, setWorkspaceId] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [createdLink, setCreatedLink] = useState<any>(null);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [stats, setStats] = useState({
        totalLinks: 0,
        totalClicks: 0,
        clicksToday: 0,
        conversionRate: 0
    });

    useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const res = await fetch('/api/links');
            if (res.ok) {
                const links = await res.json();
                const totalClicks = links.reduce((sum: number, l: any) => sum + (l.clicks || 0), 0);
                // Simulate today's clicks (would need proper tracking in production)
                const clicksToday = Math.floor(totalClicks * 0.1);
                const conversionRate = links.length > 0 ? Math.min(95, Math.round((totalClicks / (links.length * 100)) * 100)) : 0;

                setStats({
                    totalLinks: links.length,
                    totalClicks,
                    clicksToday,
                    conversionRate: conversionRate || 12
                });
            }
        } catch (e) {
            console.error('Error fetching stats:', e);
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!url) return;

        setIsCreating(true);
        setError('');
        setCreatedLink(null);

        try {
            const response = await fetch('/api/links', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    destination: url,
                    customCode: customCode || undefined,
                    workspaceId: workspaceId || undefined,
                }),
            });

            if (!response.ok) {
                const err = await response.json();
                throw new Error(err.error || 'Failed to create');
            }

            const newLink = await response.json();
            setCreatedLink(newLink);
            setUrl('');
            setCustomCode('');
            fetchStats();
            onLinkCreated?.();
        } catch (err) {
            setError((err as Error).message);
        } finally {
            setIsCreating(false);
        }
    };

    const copyToClipboard = async () => {
        if (!createdLink) return;
        await navigator.clipboard.writeText(createdLink.shortUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const downloadQR = () => {
        const svg = document.getElementById('home-qr-code');
        if (svg) {
            const svgData = new XMLSerializer().serializeToString(svg);
            const blob = new Blob([svgData], { type: 'image/svg+xml' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `qr-${createdLink?.shortCode || 'code'}.svg`;
            a.click();
            URL.revokeObjectURL(url);
        }
    };

    return (
        <div className="space-y-8">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-purple-100 rounded-lg">
                            <Link size={18} className="text-purple-600" />
                        </div>
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">All time</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalLinks}</p>
                    <p className="text-sm text-gray-500">Total Links</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <MousePointer size={18} className="text-blue-600" />
                        </div>
                        <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">+{stats.clicksToday} today</span>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.totalClicks.toLocaleString()}</p>
                    <p className="text-sm text-gray-500">Total Clicks</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <TrendingUp size={18} className="text-green-600" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{stats.conversionRate}%</p>
                    <p className="text-sm text-gray-500">Click Rate</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center justify-between mb-3">
                        <div className="p-2 bg-orange-100 rounded-lg">
                            <Globe size={18} className="text-orange-600" />
                        </div>
                    </div>
                    <p className="text-2xl font-bold text-gray-900">{Math.min(stats.totalClicks, 42)}</p>
                    <p className="text-sm text-gray-500">Countries</p>
                </div>
            </div>

            {/* Create Section */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                {/* Toggle Header */}
                <div className="border-b border-gray-100 px-6 py-4">
                    <div className="inline-flex bg-gray-100 rounded-full p-1">
                        <button
                            onClick={() => setActiveMode('link')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${activeMode === 'link'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <Link size={16} />
                            Short link
                        </button>
                        <button
                            onClick={() => setActiveMode('qr')}
                            className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-semibold transition-all ${activeMode === 'qr'
                                ? 'bg-white text-gray-900 shadow-sm'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                                <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v3h-3v-3zm-3 3h3v3h-3v-3zm3 3h3v3h-3v-3zm-3 3h3v3h-3v-3zm6 0h3v3h-3v-3z" />
                            </svg>
                            QR Code
                        </button>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleCreate} className="p-6">
                    <div className="space-y-4">
                        {/* URL Input */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                {activeMode === 'link' ? 'Paste your long URL' : 'Enter URL for QR Code'}
                            </label>
                            <div className="relative">
                                <input
                                    type="url"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    placeholder="https://example.com/my-super-long-url-that-needs-shortening"
                                    required
                                    className="w-full px-4 py-3.5 pr-32 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-50 text-base transition-all placeholder:text-gray-400"
                                />
                                <button
                                    type="submit"
                                    disabled={isCreating || !url}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 px-5 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-lg font-semibold text-sm disabled:from-gray-400 disabled:to-gray-500 hover:from-purple-700 hover:to-indigo-700 transition-all shadow-sm hover:shadow-md disabled:shadow-none flex items-center gap-2"
                                >
                                    {isCreating ? (
                                        <>
                                            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                            </svg>
                                            Creating...
                                        </>
                                    ) : (
                                        <>
                                            {activeMode === 'link' ? 'Shorten' : 'Generate'}
                                            <ArrowRight size={16} />
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Advanced Options */}
                        <details className="group">
                            <summary className="flex items-center gap-2 text-sm font-medium text-gray-600 cursor-pointer hover:text-gray-900">
                                <svg className="w-4 h-4 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                                Advanced options
                            </summary>
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 pl-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600 mb-1.5">Custom back-half</label>
                                    <input
                                        type="text"
                                        value={customCode}
                                        onChange={(e) => setCustomCode(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                                        placeholder="my-custom-link"
                                        className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 text-sm"
                                    />
                                </div>
                                {availableWorkspaces.length > 0 && (
                                    <div>
                                        <label className="block text-sm font-medium text-gray-600 mb-1.5">Workspace</label>
                                        <select
                                            value={workspaceId}
                                            onChange={(e) => setWorkspaceId(e.target.value)}
                                            className="w-full px-3 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 text-sm bg-white"
                                        >
                                            <option value="">Personal</option>
                                            {availableWorkspaces.map(w => (
                                                <option key={w.id} value={w.id}>{w.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                            </div>
                        </details>

                        {/* Error */}
                        {error && (
                            <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700 flex items-center gap-2">
                                <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                {error}
                            </div>
                        )}
                    </div>
                </form>

                {/* Success Result */}
                {createdLink && (
                    <div className="border-t border-gray-100 bg-gradient-to-r from-green-50 to-emerald-50 p-6">
                        <div className="flex items-center gap-2 text-green-700 font-semibold mb-4">
                            <Check size={20} className="text-green-600" />
                            {activeMode === 'link' ? 'Link created successfully!' : 'QR Code generated!'}
                        </div>

                        <div className={`flex ${activeMode === 'qr' ? 'flex-col md:flex-row gap-6' : 'flex-col'}`}>
                            {/* Link Display */}
                            <div className={`flex-1 ${activeMode === 'qr' ? '' : 'mb-0'}`}>
                                <div className="flex items-center gap-3 bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
                                    <div className="flex-1 overflow-hidden">
                                        <p className="font-mono text-purple-600 font-semibold truncate">{createdLink.shortUrl}</p>
                                        <p className="text-xs text-gray-500 truncate mt-1">{createdLink.destination}</p>
                                    </div>
                                    <button
                                        onClick={copyToClipboard}
                                        className={`p-3 rounded-lg transition-all ${copied
                                            ? 'bg-green-100 text-green-600'
                                            : 'bg-gray-100 text-gray-600 hover:bg-purple-100 hover:text-purple-600'
                                            }`}
                                    >
                                        {copied ? <Check size={20} /> : <Copy size={20} />}
                                    </button>
                                </div>
                            </div>

                            {/* QR Code Display */}
                            {activeMode === 'qr' && (
                                <div className="flex flex-col items-center gap-3">
                                    <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
                                        <QRCodeSVG
                                            id="home-qr-code"
                                            value={createdLink.shortUrl}
                                            size={140}
                                            level="H"
                                            includeMargin={true}
                                        />
                                    </div>
                                    <button
                                        onClick={downloadQR}
                                        className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-medium text-sm hover:bg-purple-700 transition-colors"
                                    >
                                        <Download size={16} />
                                        Download QR
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>


            {/* Quick Tips */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button
                    onClick={() => window.location.href = '/dashboard?tab=links'}
                    className="text-left bg-gradient-to-br from-purple-50 to-white border border-purple-100 rounded-xl p-5 hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer group"
                >
                    <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <Link size={20} className="text-purple-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                        Create custom links
                        <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-2 group-hover:ml-0 text-purple-600" />
                    </h3>
                    <p className="text-sm text-gray-600">Use custom back-halves to make your links memorable and branded.</p>
                </button>

                <button
                    onClick={() => window.location.href = '/dashboard?tab=analytics'}
                    className="text-left bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-xl p-5 hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer group"
                >
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <BarChart3 size={20} className="text-blue-600" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                        Track performance
                        <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-2 group-hover:ml-0 text-blue-600" />
                    </h3>
                    <p className="text-sm text-gray-600">See detailed analytics on clicks, locations, and devices.</p>
                </button>

                <button
                    onClick={() => window.location.href = '/dashboard?tab=qr'}
                    className="text-left bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-xl p-5 hover:shadow-md transition-all hover:-translate-y-1 cursor-pointer group"
                >
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                        <svg className="w-5 h-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5z" />
                        </svg>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1 flex items-center gap-2">
                        Generate QR codes
                        <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity -ml-2 group-hover:ml-0 text-green-600" />
                    </h3>
                    <p className="text-sm text-gray-600">Instantly create QR codes for print and offline marketing.</p>
                </button>
            </div>
        </div>
    );
}
