'use client';

import { useState } from 'react';

interface TeamInviteModalProps {
  onClose: () => void;
  onInvite: (email: string, role: string) => void;
}

export function TeamInviteModal({ onClose, onInvite }: TeamInviteModalProps) {
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<'admin' | 'editor' | 'viewer'>('editor');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const handleInvite = async () => {
    setError('');
    
    if (!email) {
      setError('Please enter an email address');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/team/members', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, role }),
      });

      const data = await response.json();
      if (response.ok) {
        onInvite(email, role);
        setEmail('');
        setRole('editor');
      } else {
        setError(data.error || 'Failed to send invite');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPreviewText = () => {
    if (!email) return '';
    const name = email.split('@')[0];
    const roleName = role.charAt(0).toUpperCase() + role.slice(1);
    return `${name} will be invited as ${roleName}`;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg border-2 border-gray-200 shadow-lg max-w-md w-full p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Invite Team Member</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Email Address</label>
            <input
              type="email"
              placeholder="team@company.com"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as any)}
              className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
            >
              <option value="admin">Admin (Manage links + team)</option>
              <option value="editor">Editor (Create/edit own links)</option>
              <option value="viewer">Viewer (Read-only access)</option>
            </select>
          </div>

          {getPreviewText() && (
            <p className="text-sm text-gray-600 italic">{getPreviewText()}</p>
          )}

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex gap-2 pt-4">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-2 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 font-semibold"
            >
              Cancel
            </button>
            <button
              onClick={handleInvite}
              disabled={loading || !email}
              className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? 'Sending...' : 'Send Invite'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

