'use client';

import { useState } from 'react';

interface LinkResult {
  shortUrl: string;
  shortCode: string;
  id: string;
}

export function LinkShortener() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [result, setResult] = useState<LinkResult | null>(null);

  const handleShorten = async () => {
    setError('');
    
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
        alert('Copied to clipboard!');
      } catch (err) {
        setError('Failed to copy to clipboard');
      }
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-white rounded-lg border-2 border-gray-200">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">Shorten Your Link</h2>
      
      <div className="flex gap-4">
        <input
          type="url"
          placeholder="https://example.com/very-long-url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          disabled={loading}
          onKeyPress={(e) => {
            if (e.key === 'Enter' && !loading && url) {
              handleShorten();
            }
          }}
          className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 disabled:bg-gray-100"
        />
        
        <button
          onClick={handleShorten}
          disabled={loading || !url}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 font-semibold whitespace-nowrap"
        >
          {loading ? 'Shortening...' : 'Shorten'}
        </button>
      </div>

      {error && <p className="mt-4 text-red-600 font-semibold">{error}</p>}

      {result && (
        <div className="mt-6 p-4 bg-green-50 border-l-4 border-green-600 rounded">
          <p className="text-sm text-gray-600 mb-2">Your shortened link:</p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-lg font-mono text-purple-600 break-all">{result.shortUrl}</code>
            <button
              onClick={copyToClipboard}
              className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 text-sm font-semibold whitespace-nowrap"
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

