'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { LinksDashboard } from '@/components/LinksDashboard';
import { AnalyticsDashboard } from '@/components/AnalyticsDashboard';
import { HomeDashboard } from '@/components/HomeDashboard';
import { Link as LinkType } from '@/lib/dummy-data';
import { QRCodeSVG } from 'qrcode.react';
import { useSubscription } from '@/hooks/useSubscription';

type TabType = 'home' | 'links' | 'qr' | 'analytics';

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get('tab') as TabType | null;
  // If no tab param, show home; otherwise show the specified tab
  const initialTab: TabType = tabParam && ['links', 'qr', 'analytics'].includes(tabParam) ? tabParam : 'home';

  const [activeTab, setActiveTab] = useState<TabType>(initialTab);
  const [links, setLinks] = useState<LinkType[]>([]);
  const [loading, setLoading] = useState(true);
  const { plan } = useSubscription();
  const [activeAnalyticsLinkId, setActiveAnalyticsLinkId] = useState<string | undefined>(undefined);

  // Sync tab state with URL
  useEffect(() => {
    const tab = searchParams.get('tab') as TabType;
    if (tab && ['links', 'qr', 'analytics'].includes(tab)) {
      setActiveTab(tab);
    } else {
      setActiveTab('home');
    }

    // Auto-scroll to create form if action=create
    if (searchParams.get('action') === 'create') {
      // slight delay to ensure render
      setTimeout(() => {
        const formElement = document.getElementById('create-link-section');
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth' });
          // Optional: Flash or highlight
        }
      }, 100);
    }

    // Pre-fill campaignId from URL if present
    const campaignId = searchParams.get('campaignId');
    if (campaignId) {
      setCreateFormData(prev => ({ ...prev, campaignId }));
      // Scroll to create form if campaignId is provided (assuming intent is to create)
      setTimeout(() => {
        const formElement = document.getElementById('create-link-section');
        if (formElement) {
          formElement.scrollIntoView({ behavior: 'smooth' });
        }
      }, 150);
    }
  }, [searchParams]);


  // Update URL when tab changes internally
  const handleTabChange = (newTab: TabType) => {
    setActiveTab(newTab);
    const params = new URLSearchParams(searchParams.toString());
    if (newTab === 'home') {
      params.delete('tab');
    } else {
      params.set('tab', newTab);
    }
    router.push(`/dashboard?${params.toString()}`);
  };

  const [createFormData, setCreateFormData] = useState({
    destination: '',
    customCode: '',
    tags: '',
    workspaceId: '',
    campaignId: '',
  });

  const [availableWorkspaces, setAvailableWorkspaces] = useState<any[]>([]);
  const [availableCampaigns, setAvailableCampaigns] = useState<any[]>([]);

  const [isCreating, setIsCreating] = useState(false);
  const [createError, setCreateError] = useState('');
  const [createSuccess, setCreateSuccess] = useState('');

  // Bulk QR download state
  const [selectedQRLinks, setSelectedQRLinks] = useState<string[]>([]);
  const [isDownloadingBulk, setIsDownloadingBulk] = useState(false);

  // CSV Import state
  const [isImporting, setIsImporting] = useState(false);
  const [importResults, setImportResults] = useState<{ success: number; failed: number } | null>(null);

  const fetchLinks = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/links');
      if (response.ok) {
        const data = await response.json();
        setLinks(data);
        if (data.length > 0 && !activeAnalyticsLinkId) {
          setActiveAnalyticsLinkId(data[0].id);
        }
      } else {
        const err = await response.json();
        console.error('Failed to fetch links:', err.error);
      }
    } catch (error) {
      console.error('Error fetching links:', error);
    } finally {
      setLoading(false);
    }
  }, [activeAnalyticsLinkId]);

  const fetchWorkspaces = useCallback(async () => {
    try {
      const res = await fetch('/api/teams');
      if (res.ok) {
        const teams = await res.json();
        const workspaces = teams.flatMap((t: any) => t.workspaces.map((w: any) => ({
          id: w.id,
          name: w.name,
          teamName: t.name,
          slug: w.slug
        })));
        setAvailableWorkspaces(workspaces);
      }
    } catch (error) {
      console.error('Error fetching workspaces:', error);
    }
  }, []);

  const fetchCampaigns = useCallback(async () => {
    try {
      const res = await fetch('/api/campaigns');
      if (res.ok) {
        const campaigns = await res.json();
        setAvailableCampaigns(campaigns);
      }
    } catch (error) {
      console.error('Error fetching campaigns:', error);
    }
  }, []);

  useEffect(() => {
    fetchLinks();
    fetchWorkspaces();
    fetchCampaigns();
  }, [fetchLinks, fetchWorkspaces, fetchCampaigns]);

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setCreateError('');
    setCreateSuccess('');

    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          destination: createFormData.destination,
          customCode: createFormData.customCode || undefined,
          tags: createFormData.tags ? createFormData.tags.split(',').map(t => t.trim()) : [],
          workspaceId: createFormData.workspaceId || undefined,
          campaignId: createFormData.campaignId || undefined,
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to create link');
      }

      const newLink = await response.json();
      setCreateSuccess(`Link created successfully! ${newLink.shortUrl}`);
      setCreateFormData({ destination: '', customCode: '', tags: '', workspaceId: '', campaignId: '' });
      await fetchLinks();

      // Auto-hide success message after 5 seconds
      setTimeout(() => setCreateSuccess(''), 5000);
    } catch (error) {
      setCreateError((error as Error).message);
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteLink = async (linkId: string) => {
    try {
      const response = await fetch(`/api/links/${linkId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Failed to delete');
      }

      await fetchLinks();

      if (activeAnalyticsLinkId === linkId) {
        setActiveAnalyticsLinkId(links[0]?.id);
      }
    } catch (error) {
      console.error('Error deleting link:', error);
      alert((error as Error).message);
    }
  };

  const handleBulkDownloadQR = async () => {
    if (selectedQRLinks.length === 0) {
      alert('Please select at least one link to download QR codes');
      return;
    }

    setIsDownloadingBulk(true);
    try {
      const JSZip = (await import('jszip')).default;
      const zip = new JSZip();

      // Generate QR codes for each selected link
      for (const linkId of selectedQRLinks) {
        const link = links.find(l => l.id === linkId);
        if (!link) continue;

        const svgElement = document.getElementById(`qr-tab-${linkId}`);
        if (svgElement) {
          const svgData = new XMLSerializer().serializeToString(svgElement);
          zip.file(`qr-${link.shortCode}.svg`, svgData);
        }
      }

      // Generate and download ZIP
      const blob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(blob);
      const downloadLink = document.createElement('a');
      downloadLink.href = url;
      downloadLink.download = `qr-codes-${new Date().toISOString().split('T')[0]}.zip`;
      downloadLink.click();
      URL.revokeObjectURL(url);

      // Clear selection after download
      setSelectedQRLinks([]);
    } catch (error) {
      console.error('Error creating ZIP:', error);
      alert('Failed to download QR codes. Please try again.');
    } finally {
      setIsDownloadingBulk(false);
    }
  };

  const toggleQRSelection = (linkId: string) => {
    setSelectedQRLinks(prev =>
      prev.includes(linkId)
        ? prev.filter(id => id !== linkId)
        : [...prev, linkId]
    );
  };

  const toggleSelectAll = () => {
    if (selectedQRLinks.length === links.length) {
      setSelectedQRLinks([]);
    } else {
      setSelectedQRLinks(links.map(l => l.id));
    }
  };

  const handleCSVImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportResults(null);

    try {
      const text = await file.text();
      const rows = text.split('\n').filter(row => row.trim());

      // Skip header row if present
      const dataRows = rows[0].toLowerCase().includes('url') || rows[0].toLowerCase().includes('destination')
        ? rows.slice(1)
        : rows;

      let successCount = 0;
      let failedCount = 0;
      const errors: string[] = [];

      for (const row of dataRows) {
        const parts = row.split(',').map(p => p.trim().replace(/"/g, ''));
        if (parts.length < 1 || !parts[0]) continue;

        const destination = parts[0];
        const tags = parts[1] ? parts[1].split(';').map(t => t.trim()) : [];

        try {
          const response = await fetch('/api/links', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ destination, tags }),
          });

          const data = await response.json();

          if (response.ok) {
            successCount++;
            console.log('✅ Created:', destination);
          } else {
            failedCount++;
            console.error('❌ Failed:', destination, data.error);
            errors.push(`${destination}: ${data.error || 'Unknown error'}`);
          }
        } catch (error) {
          failedCount++;
          console.error('❌ Error for:', destination, error);
          errors.push(`${destination}: ${error}`);
        }
      }

      // Show detailed errors in console
      if (errors.length > 0) {
        console.group('CSV Import Errors:');
        errors.forEach(err => console.error(err));
        console.groupEnd();
      }

      setImportResults({ success: successCount, failed: failedCount });
      await fetchLinks();

      // Clear file input
      event.target.value = '';
    } catch (error) {
      console.error('CSV Import Error:', error);
      alert('Failed to import CSV. Please check the file format.');
    } finally {
      setIsImporting(false);
    }
  };

  // Tabs definition removed as we use Sidebar now

  return (
    <div className="w-full">
      {/* Tab Navigation Removed - Using Sidebar */}

      {/* Tab Content */}
      <div className="w-full">
        {/* Home Tab */}
        {activeTab === 'home' && (
          <HomeDashboard
            availableWorkspaces={availableWorkspaces}
            onTabChange={handleTabChange}
            onLinkCreated={() => {
              fetchLinks();
              // Optionally show a toast or notification
            }}
          />

        )}

        {/* Links Tab */}
        {activeTab === 'links' && (
          <div className="space-y-6 md:space-y-8">

            {/* Upgrade Banner for Free Plan Users */}
            {plan && plan.name === 'Free' && (
              <div className="bg-gradient-to-r from-purple-700 to-indigo-800 rounded-xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl"></div>
                <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold mb-2">Unlock the full power of short.link</h3>
                    <p className="text-purple-100 max-w-xl">
                      Get custom domains, advanced analytics, and team collaboration. Professional features from just ₹999/mo.
                    </p>
                  </div>
                  <a
                    href="/pricing"
                    className="px-6 py-3 bg-white text-purple-700 rounded-lg font-bold hover:bg-gray-100 transition-transform hover:-translate-y-0.5 shadow-md whitespace-nowrap"
                  >
                    View Plans & Upgrade
                  </a>
                </div>
              </div>
            )}

            {/* Create Link Form */}
            <div id="create-link-section" className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4 bg-gray-50/50">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span className="p-1.5 bg-purple-100 text-purple-600 rounded-lg">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                  </span>
                  Create New Link
                </h2>
              </div>

              <form onSubmit={handleCreateLink} className="p-6 space-y-6">
                {/* Destination URL */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Destination URL
                  </label>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" /></svg>
                      </div>
                      <input
                        type="url"
                        placeholder="https://example.com/your-long-url"
                        value={createFormData.destination}
                        onChange={(e) => setCreateFormData({ ...createFormData, destination: e.target.value })}
                        required
                        className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-50 transition-all placeholder:text-gray-400 text-base"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={isCreating || !createFormData.destination}
                      className="px-8 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700 transition-all shadow-md hover:shadow-purple-200 active:scale-95 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2 whitespace-nowrap"
                    >
                      {isCreating ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                          <span>Creating...</span>
                        </>
                      ) : (
                        <>
                          <span>Shorten</span>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" /></svg>
                        </>
                      )}
                    </button>
                  </div>

                </div>

                {/* Advanced Options Accordion */}
                <details className="group">
                  <summary className="flex items-center gap-2 text-sm font-medium text-gray-600 cursor-pointer hover:text-gray-900 select-none">
                    <svg className="w-4 h-4 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                    Advanced options (Custom Code, Tags, Workspace)
                  </summary>

                  <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 pl-6 animate-in slide-in-from-top-2 duration-200">
                    {/* Custom Code */}
                    <div className="col-span-1">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        Custom Code
                      </label>
                      <div className="flex">
                        <span className="inline-flex items-center px-3 rounded-l-lg border border-r-0 border-gray-200 bg-gray-50 text-gray-500 text-sm">
                          /
                        </span>
                        <input
                          type="text"
                          placeholder="vanity-link"
                          value={createFormData.customCode}
                          onChange={(e) => setCreateFormData({ ...createFormData, customCode: e.target.value })}
                          pattern="[a-z0-9-]+"
                          className="flex-1 px-3 py-2 border border-gray-200 rounded-r-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm"
                        />
                      </div>
                      <p className="text-[10px] text-gray-400 mt-1">
                        Optional. Leave blank for auto-generated.
                      </p>
                    </div>

                    {/* Workspace Selector */}
                    {availableWorkspaces.length > 0 && (
                      <div className="col-span-1">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                          Workspace
                        </label>
                        <select
                          value={createFormData.workspaceId}
                          onChange={(e) => setCreateFormData({ ...createFormData, workspaceId: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm bg-white"
                        >
                          <option value="">Personal (No Workspace)</option>
                          {availableWorkspaces.map(w => (
                            <option key={w.id} value={w.id}>{w.name} (Team: {w.teamName})</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Tags */}
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                        Tags
                      </label>
                      <input
                        type="text"
                        placeholder="marketing, social, summer-sale"
                        value={createFormData.tags}
                        onChange={(e) => setCreateFormData({ ...createFormData, tags: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm"
                      />
                    </div>

                    {/* Campaign Selector */}
                    {availableCampaigns.length > 0 && (
                      <div className="col-span-1 md:col-span-2">
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">
                          Campaign
                        </label>
                        <select
                          value={createFormData.campaignId}
                          onChange={(e) => setCreateFormData({ ...createFormData, campaignId: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 text-sm bg-white"
                        >
                          <option value="">No Campaign</option>
                          {availableCampaigns.map(c => (
                            <option key={c.id} value={c.id}>{c.name}</option>
                          ))}
                        </select>
                        <p className="text-[10px] text-gray-400 mt-1">
                          Group this link into a marketing campaign for better tracking.
                        </p>
                      </div>
                    )}
                  </div>
                </details>

                {/* Messages */}
                {createError && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-sm text-red-700">
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                    {createError}
                  </div>
                )}
                {createSuccess && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-sm text-green-700">
                    <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM10 11a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm0-4a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                    {createSuccess}
                  </div>
                )}
              </form>
            </div>

            {/* Links List */}
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4 md:mb-6">Your Links</h2>

              {/* Import Results */}
              {importResults && (
                <div className="mb-4 p-3 md:p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-xs md:text-sm text-green-800">
                    ✅ CSV Import Complete: <strong>{importResults.success} links created</strong>
                    {importResults.failed > 0 && `, ${importResults.failed} failed`}
                  </p>
                  <button
                    onClick={() => setImportResults(null)}
                    className="text-xs text-green-600 hover:text-green-700 mt-1.5"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              <LinksDashboard
                links={links}
                loading={loading}
                onLinkSelect={(link) => {
                  setActiveAnalyticsLinkId(link.id);
                  setActiveTab('analytics');
                }}
                onLinkDelete={handleDeleteLink}
                onLinkUpdate={fetchLinks}
                onCSVImport={handleCSVImport}
                isImporting={isImporting}
              />
            </div>
          </div>
        )}

        {/* QR Codes Tab */}
        {activeTab === 'qr' && (
          <div className="space-y-8">
            {/* Create New QR Code Section */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="border-b border-gray-100 px-6 py-4 bg-gray-50/50">
                <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <span className="p-1.5 bg-green-100 text-green-600 rounded-lg">
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v3h-3v-3zm-3 3h3v3h-3v-3zm3 3h3v3h-3v-3zm-3 3h3v3h-3v-3zm6 0h3v3h-3v-3z" /></svg>
                  </span>
                  Create New QR Code
                </h2>
              </div>

              <form onSubmit={handleCreateLink} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Destination URL
                    </label>
                    <div className="relative">
                      <input
                        type="url"
                        placeholder="https://example.com/page-for-qr-code"
                        value={createFormData.destination}
                        onChange={(e) => setCreateFormData({ ...createFormData, destination: e.target.value })}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-green-500 focus:ring-4 focus:ring-green-50 text-base transition-all placeholder:text-gray-400"
                      />
                      <button
                        type="submit"
                        disabled={isCreating || !createFormData.destination}
                        className="absolute right-2 top-1/2 -translate-y-1/2 px-6 py-1.5 bg-green-600 text-white rounded-lg font-semibold text-sm disabled:bg-gray-300 disabled:cursor-not-allowed hover:bg-green-700 transition-colors shadow-sm flex items-center gap-2"
                      >
                        {isCreating ? 'Generating...' : 'Generate QR'}
                      </button>
                    </div>
                  </div>

                  {/* Advanced Options Toggle */}
                  <details className="group">
                    <summary className="flex items-center gap-2 text-sm font-medium text-gray-600 cursor-pointer hover:text-gray-900 select-none">
                      <svg className="w-4 h-4 transition-transform group-open:rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                      Optional: Customization
                    </summary>
                    <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 pl-6 animate-in slide-in-from-top-2 duration-200">
                      <div>
                        <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Label (Short Code)</label>
                        <input
                          type="text"
                          placeholder="summer-promo"
                          value={createFormData.customCode}
                          onChange={(e) => setCreateFormData({ ...createFormData, customCode: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 text-sm"
                        />
                      </div>
                      {availableWorkspaces.length > 0 && (
                        <div>
                          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5">Workspace</label>
                          <select
                            value={createFormData.workspaceId}
                            onChange={(e) => setCreateFormData({ ...createFormData, workspaceId: e.target.value })}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-green-500 text-sm bg-white"
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

                  {/* Messages */}
                  {createError && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-xl flex items-center gap-3 text-sm text-red-700">
                      <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                      {createError}
                    </div>
                  )}
                  {createSuccess && (
                    <div className="p-4 bg-green-50 border border-green-200 rounded-xl flex items-center gap-3 text-sm text-green-700">
                      <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM10 11a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm0-4a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" /></svg>
                      {createSuccess}
                    </div>
                  )}
                </div>
              </form>
            </div>

            {/* Manage QR Codes */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4">
              <h2 className="text-xl md:text-2xl font-bold text-gray-900">Your QR Codes</h2>

              {/* Bulk Download Controls */}
              {links.length > 0 && (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
                  <button
                    onClick={toggleSelectAll}
                    className="px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-2 font-medium text-sm transition-colors"
                  >
                    <div className={`w-4 h-4 rounded border ${selectedQRLinks.length === links.length ? 'bg-purple-600 border-purple-600' : 'border-gray-400'}`}>
                      {selectedQRLinks.length === links.length && <svg className="w-3.5 h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                    </div>
                    Select All
                  </button>
                  {selectedQRLinks.length > 0 && (
                    <button
                      onClick={handleBulkDownloadQR}
                      disabled={isDownloadingBulk}
                      className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 font-medium disabled:opacity-50 text-sm flex items-center justify-center gap-2 transition-colors shadow-sm"
                    >
                      {isDownloadingBulk ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                          Downloading...
                        </>
                      ) : (
                        <>
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                          Download {selectedQRLinks.length} Selected
                        </>
                      )}
                    </button>
                  )}
                </div>
              )}
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-600 mx-auto"></div>
                <p className="text-gray-600 mt-4">Loading...</p>
              </div>
            ) : links.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 border-dashed">
                <div className="text-6xl mb-4 text-green-100 mx-auto w-fit">
                  <svg className="w-20 h-20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v3h-3v-3zm-3 3h3v3h-3v-3zm3 3h3v3h-3v-3zm-3 3h3v3h-3v-3zm6 0h3v3h-3v-3z" /></svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">No QR codes yet</h3>
                <p className="text-gray-500 max-w-sm mx-auto mb-6">Create your first QR code to get started sharing links physically.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {links.map((link) => (
                  <div
                    key={link.id}
                    className={`bg-white rounded-xl border p-6 transition-all relative group hover:shadow-lg ${selectedQRLinks.includes(link.id)
                      ? 'border-green-500 shadow-md ring-1 ring-green-500'
                      : 'border-gray-100 hover:border-green-200'
                      }`}
                  >
                    {/* Checkbox for selection */}
                    <div className="absolute top-4 right-4 z-10 transition-opacity">
                      <input
                        type="checkbox"
                        checked={selectedQRLinks.includes(link.id)}
                        onChange={() => toggleQRSelection(link.id)}
                        className="w-5 h-5 text-green-600 border-gray-300 rounded focus:ring-green-500 cursor-pointer"
                      />
                    </div>

                    <div className="flex flex-col items-center text-center">
                      <div className="bg-white p-4 rounded-xl border border-gray-100 shadow-sm mb-4 group-hover:scale-105 transition-transform duration-300">
                        <QRCodeSVG
                          id={`qr-tab-${link.id}`}
                          value={link.shortUrl}
                          size={150}
                          level="H"
                          includeMargin={true}
                        />
                      </div>

                      <div className="w-full">
                        <h3 className="font-mono text-lg font-bold text-green-600 mb-1 truncate px-2">
                          {link.shortCode}
                        </h3>
                        <p className="text-xs text-gray-400 mb-4 truncate px-4" title={link.destination}>
                          {link.destination}
                        </p>

                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              const svg = document.getElementById(`qr-tab-${link.id}`);
                              if (svg) {
                                const svgData = new XMLSerializer().serializeToString(svg);
                                const blob = new Blob([svgData], { type: 'image/svg+xml' });
                                const url = URL.createObjectURL(blob);
                                const downloadLink = document.createElement('a');
                                downloadLink.href = url;
                                downloadLink.download = `qr-${link.shortCode}.svg`;
                                downloadLink.click();
                                URL.revokeObjectURL(url);
                              }
                            }}
                            className="flex-1 py-2 bg-gray-50 text-gray-700 hover:bg-green-50 hover:text-green-700 rounded-lg font-medium text-sm transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                            Download
                          </button>
                          <a
                            href={link.shortUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="py-2 px-3 bg-gray-50 text-gray-700 hover:bg-purple-50 hover:text-purple-700 rounded-lg transition-colors cursor-pointer"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          plan?.name === 'FREE' ? (
            <div className="max-w-4xl mx-auto px-4 py-8">
              <div className="bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100 rounded-2xl p-8 text-center ring-4 ring-blue-50/50">
                <div className="text-6xl mb-4 bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto text-blue-600">📊</div>
                <h2 className="text-3xl font-bold text-gray-900 mb-3">Advanced Analytics Locked</h2>
                <p className="text-gray-600 mb-8 text-lg max-w-lg mx-auto">
                  Upgrade to <strong>Pro</strong> to see detailed click tracking, location data, device stats, and referrals.
                </p>
                <a href="/pricing" className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:shadow-lg font-bold transition-all hover:scale-105">
                  Upgrade to Pro
                </a>
              </div>
            </div>
          ) : (
            <div className="space-y-4 md:space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 md:gap-4 mb-4 md:mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900">Analytics</h2>

                {/* Filters */}
                {links.length > 0 && (
                  <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                    {/* Workspace Filter */}
                    {availableWorkspaces.length > 0 && (
                      <div className="flex items-center gap-2">
                        <label className="text-xs md:text-sm font-semibold text-gray-700 whitespace-nowrap">
                          Workspace:
                        </label>
                        <select
                          id="analytics-workspace-filter"
                          onChange={(e) => {
                            const workspaceId = e.target.value;
                            if (workspaceId) {
                              // Filter to show only first link from selected workspace
                              const workspaceLinks = links.filter(l => l.workspaceId === workspaceId);
                              if (workspaceLinks.length > 0) {
                                setActiveAnalyticsLinkId(workspaceLinks[0].id);
                              }
                            } else {
                              // Show all links, select first
                              if (links.length > 0) {
                                setActiveAnalyticsLinkId(links[0].id);
                              }
                            }
                          }}
                          className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 text-xs md:text-sm bg-white"
                        >
                          <option value="">All Workspaces</option>
                          {availableWorkspaces.map(w => (
                            <option key={w.id} value={w.id}>{w.name}</option>
                          ))}
                        </select>
                      </div>
                    )}

                    {/* Link Selector */}
                    <div className="flex items-center gap-2">
                      <label className="text-xs md:text-sm font-semibold text-gray-700 whitespace-nowrap">
                        Select Link:
                      </label>
                      <select
                        value={activeAnalyticsLinkId || ''}
                        onChange={(e) => setActiveAnalyticsLinkId(e.target.value)}
                        className="px-3 md:px-4 py-2 border border-gray-300 md:border-2 rounded-lg focus:outline-none focus:border-purple-600 font-mono text-xs md:text-sm bg-white transition-colors"
                      >
                        {links.map((link) => (
                          <option key={link.id} value={link.id}>
                            {link.shortCode} - {link.clicks} clicks {link.workspaceId ? `(${availableWorkspaces.find(w => w.id === link.workspaceId)?.name || 'Workspace'})` : ''}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {loading ? (
                <div className="text-center py-8 md:py-12">
                  <div className="animate-spin rounded-full h-10 md:h-12 w-10 md:w-12 border-b-2 border-purple-600 mx-auto"></div>
                  <p className="text-gray-600 mt-3 md:mt-4 text-sm md:text-base">Loading...</p>
                </div>
              ) : links.length === 0 ? (
                <div className="text-center py-8 md:py-12 bg-white rounded-lg md:rounded-xl border border-gray-200 md:border-2">
                  <div className="text-5xl md:text-6xl mb-3 md:mb-4">📊</div>
                  <p className="text-gray-600 mb-4 text-sm md:text-base px-4">No links yet. Create a link to view analytics.</p>
                  <button
                    onClick={() => setActiveTab('links')}
                    className="px-4 md:px-6 py-2 md:py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold text-sm md:text-base transition-colors"
                  >
                    Create Your First Link
                  </button>
                </div>
              ) : (
                <AnalyticsDashboard linkId={activeAnalyticsLinkId} />
              )}
            </div>
          )
        )}
      </div>
    </div>
  );
}
