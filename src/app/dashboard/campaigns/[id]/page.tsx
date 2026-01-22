'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Trash2, Calendar, Link as LinkIcon, ExternalLink, BarChart2 } from 'lucide-react';
import { format } from 'date-fns';

interface LinkData {
    id: string;
    shortCode: string;
    destination: string;
    clicks: number;
    createdAt: string;
}

interface Campaign {
    id: string;
    name: string;
    utmSource?: string;
    utmMedium?: string;
    createdAt: string;
    links: LinkData[];
}

export default function CampaignDetailsPage({ params }: { params: { id: string } }) {
    const router = useRouter();
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                const res = await fetch(`/api/campaigns/${params.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setCampaign(data);
                } else {
                    router.push('/dashboard/campaigns');
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchCampaign();
    }, [params.id, router]);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this campaign? The links will remain but will be unlinked from this campaign.')) return;

        try {
            const res = await fetch(`/api/campaigns/${params.id}`, { method: 'DELETE' });
            if (res.ok) {
                router.push('/dashboard/campaigns');
            }
        } catch (e) {
            alert('Failed to delete');
        }
    };

    if (loading) return <div className="p-8 text-center">Loading campaign...</div>;
    if (!campaign) return null;

    const totalClicks = campaign.links.reduce((sum, link) => sum + link.clicks, 0);

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <Link href="/dashboard/campaigns" className="text-gray-500 hover:text-gray-700 flex items-center gap-2 mb-4 text-sm">
                    <ArrowLeft size={16} /> Back to Campaigns
                </Link>

                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">{campaign.name}</h1>
                        <div className="flex gap-3 text-sm text-gray-600">
                            <span className="flex items-center gap-1"><Calendar size={14} /> {format(new Date(campaign.createdAt), 'MMM d, yyyy')}</span>
                            {campaign.utmSource && <span className="px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs border border-blue-100">UTM Source: {campaign.utmSource}</span>}
                            {campaign.utmMedium && <span className="px-2 py-0.5 bg-green-50 text-green-700 rounded-full text-xs border border-green-100">UTM Medium: {campaign.utmMedium}</span>}
                        </div>
                    </div>
                    <button
                        onClick={handleDelete}
                        className="px-4 py-2 border border-red-200 text-red-600 rounded-lg hover:bg-red-50 flex items-center gap-2 text-sm font-medium transition-colors"
                    >
                        <Trash2 size={16} /> Delete Campaign
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="text-gray-500 text-sm font-medium mb-1">Total Links</div>
                    <div className="text-3xl font-bold text-gray-900">{campaign.links.length}</div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="text-gray-500 text-sm font-medium mb-1">Total Clicks</div>
                    <div className="text-3xl font-bold text-purple-600">{totalClicks}</div>
                </div>
                <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <div className="text-gray-500 text-sm font-medium mb-1">Avg. Clicks/Link</div>
                    <div className="text-3xl font-bold text-gray-900">
                        {campaign.links.length > 0 ? Math.round(totalClicks / campaign.links.length) : 0}
                    </div>
                </div>
            </div>

            {/* Links Table */}
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <h3 className="font-bold text-gray-900">Campaign Links</h3>
                </div>
                {campaign.links.length === 0 ? (
                    <div className="p-12 text-center text-gray-500">
                        No links in this campaign yet.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-gray-500 uppercase bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Short Link</th>
                                    <th className="px-6 py-3 font-medium">Destination</th>
                                    <th className="px-6 py-3 font-medium text-right">Clicks</th>
                                    <th className="px-6 py-3 font-medium text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {campaign.links.map(link => (
                                    <tr key={link.id} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4 font-medium text-purple-600 font-mono">
                                            {link.shortCode}
                                        </td>
                                        <td className="px-6 py-4 text-gray-600 max-w-xs truncate" title={link.destination}>
                                            {link.destination}
                                        </td>
                                        <td className="px-6 py-4 text-right font-medium">
                                            {link.clicks}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <a
                                                href={`/${link.shortCode}`}
                                                target="_blank"
                                                className="text-gray-400 hover:text-purple-600 inline-block p-1"
                                                title="Open Link"
                                            >
                                                <ExternalLink size={16} />
                                            </a>
                                            <Link
                                                href={`/dashboard?tab=analytics&linkId=${link.id}`}
                                                className="text-gray-400 hover:text-purple-600 inline-block p-1 ml-2"
                                                title="View Analytics"
                                            >
                                                <BarChart2 size={16} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
