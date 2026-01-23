'use client';

import { useState } from 'react';
import { useUser } from '@clerk/nextjs';
import Link from 'next/link';
import { QRCodeSVG } from 'qrcode.react';

interface LinkResult {
  shortUrl: string;
  shortCode: string;
  id: string;
}

export function LinkShortener() {
  const { isSignedIn, isLoaded } = useUser();
  const [activeTab, setActiveTab] = useState<'short_link' | 'qr_code'>('short_link');
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<LinkResult | null>(null);
  const [showQRResult, setShowQRResult] = useState(false);

  const handleShorten = async () => {
    setError('');
    setShowQRResult(false);

    // Validation
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      setError('Invalid URL (must start with http:// or https://)');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/links', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ destination: url }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to create link' }));
        throw new Error(errorData.error || 'Failed to create link');
      }

      const data = await response.json();
      setResult({
        shortUrl: data.shortUrl,
        shortCode: data.shortCode,
        id: data.id,
      });
      setUrl('');

      // If currently on QR tab, show QR result immediately
      if (activeTab === 'qr_code') {
        setShowQRResult(true);
      }

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (result?.shortUrl) {
      try {
        await navigator.clipboard.writeText(result.shortUrl);
        // Could use a toast here
      } catch (err) {
        setError('Failed to copy to clipboard');
      }
    }
  };

  const canCreateMore = true;

  return (
    <div className="w-full max-w-3xl mx-auto bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-white/50 overflow-hidden ring-1 ring-black/5">
      {/* Tabs Header */}
      <div className="flex p-2 bg-gray-50/50 space-x-2">
        <button
          onClick={() => setActiveTab('short_link')}
          className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === 'short_link'
            ? 'bg-white text-purple-600 shadow-md ring-1 ring-black/5'
            : 'text-gray-500 hover:bg-white/50 hover:text-gray-700'
            }`}
        >
          <span className="text-xl">🔗</span> Short Link
        </button>
        <button
          onClick={() => setActiveTab('qr_code')}
          className={`flex-1 py-3 px-6 rounded-xl font-bold text-sm sm:text-base transition-all duration-200 flex items-center justify-center gap-2 ${activeTab === 'qr_code'
            ? 'bg-white text-purple-600 shadow-md ring-1 ring-black/5'
            : 'text-gray-500 hover:bg-white/50 hover:text-gray-700'
            }`}
        >
          <span className="text-xl">📱</span> QR Code
        </button>
      </div>

      <div className="p-6 md:p-10">
        <h2 className="text-3xl font-extrabold text-gray-900 mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
          {activeTab === 'short_link' ? 'Shorten a long link' : 'Create a Custom QR Code'}
        </h2>

        {/* Anonymous User Upsell */}
        {!isSignedIn && isLoaded && (
          <div className="mb-8 p-4 bg-purple-50/50 border border-purple-100 rounded-2xl flex items-center gap-4">
            <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-xl shrink-0">
              🚀
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-purple-900">
                Want to track your clicks?
              </p>
              <p className="text-xs text-purple-700 mt-0.5">
                <Link href="/sign-up?redirect_url=/onboarding/choose-plan" className="underline font-bold hover:text-purple-900">

                  Create a free account
                </Link> to get analytics and manage your links.

              </p>
            </div>
          </div>
        )}

        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
            <svg className="h-6 w-6 text-gray-400 group-focus-within:text-purple-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="url"
              placeholder={activeTab === 'short_link' ? "Paste a long URL here..." : "Enter URL for your QR Code..."}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              disabled={loading || !canCreateMore}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !loading && url && canCreateMore) {
                  handleShorten();
                }
              }}
              className="flex-1 pl-16 pr-6 py-5 bg-gray-50 border-2 border-transparent hover:bg-white focus:bg-white focus:border-purple-500 rounded-2xl text-lg outline-none transition-all duration-200 shadow-inner"
            />

            <button
              onClick={handleShorten}
              disabled={loading || !url || !canCreateMore}
              className="px-8 py-5 bg-gray-900 text-white rounded-2xl hover:bg-black disabled:bg-gray-300 disabled:cursor-not-allowed font-bold text-lg whitespace-nowrap transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl hover:shadow-2xl flex items-center gap-2 justify-center"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing
                </>
              ) : (
                <>
                  {activeTab === 'short_link' ? 'Shorten Link' : 'Generate QR'}
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 animate-in slide-in-from-top-2">
            <svg className="w-5 h-5 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        )}

        {result && (
          <div className="mt-8 relative z-10">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-100 to-blue-50 rounded-2xl transform rotate-1 opacity-50"></div>
            <div className="relative bg-white border border-gray-100 p-6 rounded-2xl shadow-lg animate-in fade-in slide-in-from-top-4 flex flex-col md:flex-row gap-6 items-center">

              {/* QR Code Display */}
              {(activeTab === 'qr_code' || showQRResult) && (
                <div className="bg-white p-3 rounded-xl shadow-sm border border-gray-100 shrink-0">
                  <QRCodeSVG
                    value={result.shortUrl}
                    size={120}
                    level="H"
                    includeMargin={true}
                  />
                </div>
              )}

              <div className="flex-1 w-full text-center md:text-left">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Your Short Link</p>
                <div className="flex items-center justify-center md:justify-start gap-2 mb-4 group cursor-pointer" onClick={copyToClipboard}>
                  <code className="text-2xl sm:text-3xl font-bold text-purple-600 break-all hover:text-purple-700 transition-colors">{result.shortUrl}</code>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                  <button
                    onClick={copyToClipboard}
                    className="flex-1 sm:flex-none px-6 py-2.5 bg-gray-900 text-white rounded-lg hover:bg-black font-semibold text-sm transition-all shadow-lg hover:shadow-xl active:scale-95 flex items-center justify-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                    </svg>
                    Copy Link
                  </button>
                  {!isSignedIn && (
                    <Link
                      href={`/sign-up?redirect_url=${encodeURIComponent(`/onboarding/choose-plan?claim_link=${result.id}`)}`}


                      className="flex-1 sm:flex-none px-6 py-2.5 bg-white border border-gray-200 text-purple-600 rounded-lg hover:bg-purple-50 hover:border-purple-200 font-semibold text-sm transition-all flex items-center justify-center gap-2"
                    >
                      ✨ Claim Link
                    </Link>
                  )}
                </div>
              </div>
            </div>

            {!isSignedIn && (
              <p className="text-center text-xs text-gray-400 mt-3 animate-pulse">
                Links created anonymously expire in 24h. <Link href={`/sign-up?redirect_url=${encodeURIComponent(`/onboarding/choose-plan?claim_link=${result.id}`)}`} className="underline hover:text-gray-600">Sign up to keep them forever.</Link>


              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

