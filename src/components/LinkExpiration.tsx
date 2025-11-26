'use client';

import { useState } from 'react';

interface LinkExpirationProps {
  onExpirationChange?: (expiresAt: string | null, maxClicks: number | null) => void;
  initialExpiresAt?: string | null;
  initialMaxClicks?: number | null;
}

export function LinkExpiration({
  onExpirationChange,
  initialExpiresAt = null,
  initialMaxClicks = null,
}: LinkExpirationProps) {
  const [mode, setMode] = useState<'time' | 'clicks' | 'both'>(
    initialExpiresAt && initialMaxClicks ? 'both' : initialExpiresAt ? 'time' : initialMaxClicks ? 'clicks' : 'time'
  );
  const [expiresAt, setExpiresAt] = useState<string>(
    initialExpiresAt ? new Date(initialExpiresAt).toISOString().slice(0, 16) : ''
  );
  const [expiresTime, setExpiresTime] = useState<string>(
    initialExpiresAt ? new Date(initialExpiresAt).toTimeString().slice(0, 5) : ''
  );
  const [maxClicks, setMaxClicks] = useState<string>(initialMaxClicks?.toString() || '');

  const getMinDate = () => {
    const now = new Date();
    now.setMinutes(now.getMinutes() + 1);
    return now.toISOString().slice(0, 16);
  };

  const handleDateChange = (date: string, time: string) => {
    setExpiresAt(date);
    setExpiresTime(time);
    if (date && time) {
      const dateTime = new Date(`${date}T${time}`);
      onExpirationChange?.(dateTime.toISOString(), mode === 'clicks' || mode === 'both' ? parseInt(maxClicks) || null : null);
    } else {
      onExpirationChange?.(null, mode === 'clicks' || mode === 'both' ? parseInt(maxClicks) || null : null);
    }
  };

  const handleClicksChange = (clicks: string) => {
    const numClicks = parseInt(clicks);
    if (clicks === '' || (numClicks > 0 && numClicks <= 10000)) {
      setMaxClicks(clicks);
      onExpirationChange?.(
        mode === 'time' || mode === 'both' ? (expiresAt && expiresTime ? new Date(`${expiresAt}T${expiresTime}`).toISOString() : null) : null,
        clicks ? numClicks : null
      );
    }
  };

  const getPreviewText = () => {
    if (mode === 'time' && expiresAt && expiresTime) {
      const date = new Date(`${expiresAt}T${expiresTime}`);
      const days = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
      return `Expires in ${days} day${days !== 1 ? 's' : ''} (${date.toLocaleString()})`;
    }
    if (mode === 'clicks' && maxClicks) {
      return `Max ${maxClicks} click${parseInt(maxClicks) !== 1 ? 's' : ''}`;
    }
    if (mode === 'both') {
      const parts = [];
      if (expiresAt && expiresTime) {
        const date = new Date(`${expiresAt}T${expiresTime}`);
        const days = Math.ceil((date.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        parts.push(`Expires in ${days} day${days !== 1 ? 's' : ''}`);
      }
      if (maxClicks) {
        parts.push(`Max ${maxClicks} click${parseInt(maxClicks) !== 1 ? 's' : ''}`);
      }
      return parts.length > 0 ? parts.join(' or ') : 'No expiration set';
    }
    return 'No expiration set';
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
      <label className="block text-sm font-semibold text-gray-700 mb-4">Link Expiration</label>

      {/* Mode Tabs */}
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => {
            setMode('time');
            onExpirationChange?.(expiresAt && expiresTime ? new Date(`${expiresAt}T${expiresTime}`).toISOString() : null, null);
          }}
          className={`px-4 py-2 rounded-lg font-semibold text-sm ${
            mode === 'time' || mode === 'both'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
          }`}
        >
          Time-Based
        </button>
        <button
          onClick={() => {
            setMode('clicks');
            onExpirationChange?.(null, maxClicks ? parseInt(maxClicks) : null);
          }}
          className={`px-4 py-2 rounded-lg font-semibold text-sm ${
            mode === 'clicks' || mode === 'both'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
          }`}
        >
          Click-Based
        </button>
        <button
          onClick={() => setMode('both')}
          className={`px-4 py-2 rounded-lg font-semibold text-sm ${
            mode === 'both'
              ? 'bg-purple-600 text-white'
              : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
          }`}
        >
          Both
        </button>
      </div>

      {/* Time-Based Expiration */}
      {(mode === 'time' || mode === 'both') && (
        <div className="space-y-4 mb-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Expiration Date</label>
            <input
              type="date"
              value={expiresAt}
              min={getMinDate().split('T')[0]}
              onChange={(e) => handleDateChange(e.target.value, expiresTime)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Expiration Time</label>
            <input
              type="time"
              value={expiresTime}
              onChange={(e) => handleDateChange(expiresAt, e.target.value)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
            />
          </div>
        </div>
      )}

      {/* Click-Based Expiration */}
      {(mode === 'clicks' || mode === 'both') && (
        <div className="mb-4">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Maximum Clicks (1-10,000)</label>
          <input
            type="number"
            min="1"
            max="10000"
            value={maxClicks}
            onChange={(e) => handleClicksChange(e.target.value)}
            placeholder="Enter max clicks"
            className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
          />
        </div>
      )}

      {/* Preview */}
      <div className="mt-4 p-3 bg-white rounded border border-gray-300">
        <p className="text-sm text-gray-600 italic">{getPreviewText()}</p>
      </div>
    </div>
  );
}

