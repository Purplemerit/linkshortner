'use client';

import { useState, useEffect } from 'react';

interface CustomCodeInputProps {
  onCodeChange?: (code: string, available: boolean) => void;
  initialCode?: string;
}

export function CustomCodeInput({ onCodeChange, initialCode = '' }: CustomCodeInputProps) {
  const [customCode, setCustomCode] = useState(initialCode);
  const [available, setAvailable] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (customCode) {
        checkAvailability(customCode);
      } else {
        setAvailable(null);
        setError('');
      }
    }, 500); // Debounce 500ms

    return () => clearTimeout(timeoutId);
  }, [customCode]);

  const checkAvailability = async (code: string) => {
    // Validation
    if (code.length < 3) {
      setError('Code must be at least 3 characters');
      setAvailable(null);
      return;
    }
    if (code.length > 50) {
      setError('Code must be less than 50 characters');
      setAvailable(null);
      return;
    }
    if (!/^[a-z0-9-]+$/.test(code)) {
      setError('Code can only contain lowercase letters, numbers, and hyphens');
      setAvailable(null);
      return;
    }

    setChecking(true);
    setError('');
    try {
      const response = await fetch(`/api/links/check-availability?code=${encodeURIComponent(code)}`);
      const data = await response.json();
      
      if (response.ok) {
        setAvailable(data.available);
        if (!data.available && data.suggestion) {
          setError(`Taken. Suggestion: ${data.suggestion}`);
        }
        onCodeChange?.(code, data.available);
      } else {
        setAvailable(false);
        setError(data.error || 'Failed to check availability');
      }
    } catch (err) {
      setAvailable(false);
      setError('Network error');
    } finally {
      setChecking(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        Custom Short Code (Optional)
      </label>
      
      <div className="flex gap-2 items-center">
        <span className="flex items-center px-3 bg-gray-200 rounded-lg text-gray-700 font-mono text-sm">
          short.link/
        </span>
        
        <input
          type="text"
          placeholder="my-campaign"
          value={customCode}
          onChange={(e) => {
            const value = e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '');
            setCustomCode(value);
          }}
          className="flex-1 px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
        />
        
        <div className="flex items-center gap-2 min-w-[120px]">
          {checking && <span className="text-yellow-600 text-sm">Checking...</span>}
          {!checking && available === true && (
            <span className="text-green-600 text-sm font-semibold">✓ Available</span>
          )}
          {!checking && available === false && (
            <span className="text-red-600 text-sm font-semibold">✗ Taken</span>
          )}
        </div>
      </div>
      
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
      {customCode && !error && available === null && (
        <p className="mt-2 text-xs text-gray-500">3-50 characters, lowercase letters, numbers, and hyphens only</p>
      )}
    </div>
  );
}

