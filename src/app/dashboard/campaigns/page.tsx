'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { FolderOpen, Plus, ExternalLink, Trash2, BarChart2 } from 'lucide-react';
import { format } from 'date-fns';

interface Campaign {
    id: string;
    name: string;
    description?: string;
    utmSource?: string;
    utmMedium?: string;
    utmCampaign?: string;
    createdAt: string;
    _count: {
        links: number;
    };
}

export default function CampaignsPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newCampaign, setNewCampaign] = useState({ name: '', utmSource: '', utmMedium: '' });
    const [createError, setCreateError] = useState('');

    const fetchCampaigns = async () => {
        try {
            const res = await fetch('/api/campaigns');
            if (res.ok) {
                const data = await res.json();
                setCampaigns(data);
            }
        } catch (error) {
            console.error('Error fetching campaigns:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        setCreateError('');

        try {
            const res = await fetch('/api/campaigns', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newCampaign)
            });

            if (res.ok) {
                setNewCampaign({ name: '', utmSource: '', utmMedium: '' });
                setIsCreating(false);
                fetchCampaigns();
            } else {
                const err = await res.json();
                setCreateError(err.error || 'Failed to create campaign');
            }
        } catch (error) {
            setCreateError('Network error');
        }
    };

    return (
        <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                        <FolderOpen className="text-purple-600" />
                        Campaigns
                    </h1>
                    <p className="text-gray-600 mt-1">
                        Track marketing campaigns and organize your links.
                    </p>
                </div>
                <button
                    onClick={() => setIsCreating(true)}
                    className="px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 flex items-center gap-2"
                >
                    <Plus size={18} />
                    New Campaign
                </button>
            </div>

            {/* Create Modal/Form Overlay */}
            {isCreating && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
                        <h3 className="text-xl font-bold mb-4">Create Campaign</h3>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
                                <input
                                    type="text"
                                    required
                                    placeholder="Summer Sale 2024"
                                    value={newCampaign.name}
                                    onChange={e => setNewCampaign({ ...newCampaign, name: e.target.value })}
                                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">UTM Source</label>
                                    <input
                                        type="text"
                                        placeholder="newsletter"
                                        value={newCampaign.utmSource}
                                        onChange={e => setNewCampaign({ ...newCampaign, utmSource: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">UTM Medium</label>
                                    <input
                                        type="text"
                                        placeholder="email"
                                        value={newCampaign.utmMedium}
                                        onChange={e => setNewCampaign({ ...newCampaign, utmMedium: e.target.value })}
                                        className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                                    />
                                </div>
                            </div>
                            {createError && <p className="text-red-500 text-sm">{createError}</p>}
                            <div className="flex justify-end gap-3 mt-6">
                                <button
                                    type="button"
                                    onClick={() => setIsCreating(false)}
                                    className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                                >
                                    Create
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* List */}
            {loading ? (
                <div className="text-center py-12">Loading...</div>
            ) : campaigns.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-2xl border border-gray-200 border-dashed">
                    <div className="text-5xl mb-4">📂</div>
                    <h3 className="text-lg font-bold text-gray-900 mb-2">No campaigns yet</h3>
                    <p className="text-gray-500 mb-6">Create your first campaign to start tracking.</p>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 text-sm"
                    >
                        Create Campaign
                    </button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {campaigns.map(campaign => (
                        <div key={campaign.id} className="bg-white rounded-xl border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all p-6 group">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                                    <FolderOpen size={24} />
                                </div>
                                <div className="text-xs text-gray-500 font-mono">
                                    {format(new Date(campaign.createdAt), 'MMM d, yyyy')}
                                </div>
                            </div>

                            <h3 className="text-lg font-bold text-gray-900 mb-2 truncate" title={campaign.name}>
                                {campaign.name}
                            </h3>

                            <div className="flex gap-2 mb-4">
                                {campaign.utmSource && (
                                    <span className="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded-full">
                                        src: {campaign.utmSource}
                                    </span>
                                )}
                                {campaign.utmMedium && (
                                    <span className="text-xs px-2 py-1 bg-green-50 text-green-700 rounded-full">
                                        med: {campaign.utmMedium}
                                    </span>
                                )}
                            </div>

                            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                                <div className="text-sm text-gray-600">
                                    <strong>{campaign._count.links}</strong> links
                                </div>
                                <div className="flex gap-3">
                                    <Link
                                        href={`/dashboard?tab=links&campaignId=${campaign.id}`}
                                        className="text-purple-600 hover:text-purple-700 text-sm font-bold flex items-center gap-1 bg-purple-50 px-3 py-1.5 rounded-lg transition-all"
                                    >
                                        <Plus size={14} /> Add Link
                                    </Link>
                                    <Link
                                        href={`/dashboard/campaigns/${campaign.id}`} // Details page
                                        className="text-gray-600 hover:text-gray-900 text-sm font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform px-2"
                                    >
                                        Details <ExternalLink size={14} />
                                    </Link>
                                </div>

                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
