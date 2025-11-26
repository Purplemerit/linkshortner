'use client';

import { useState } from 'react';

interface PasswordProtectionProps {
  onPasswordChange?: (password: string, enabled: boolean) => void;
  initialProtected?: boolean;
}

export function PasswordProtection({ onPasswordChange, initialProtected = false }: PasswordProtectionProps) {
  const [enabled, setEnabled] = useState(initialProtected);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const getPasswordStrength = (pwd: string): 'weak' | 'medium' | 'strong' => {
    if (pwd.length < 4) return 'weak';
    if (pwd.length < 6) return 'medium';
    return 'strong';
  };

  const strength = getPasswordStrength(password);
  const passwordsMatch = password && confirmPassword && password === confirmPassword;
  const isValid = enabled ? password.length >= 6 && passwordsMatch : true;

  const handleToggle = (value: boolean) => {
    setEnabled(value);
    if (!value) {
      setPassword('');
      setConfirmPassword('');
    }
    onPasswordChange?.('', value);
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (value && confirmPassword && value === confirmPassword) {
      onPasswordChange?.(value, enabled);
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (password && value && password === value) {
      onPasswordChange?.(password, enabled);
    }
  };

  return (
    <div className="p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <label className="text-sm font-semibold text-gray-700">
          Protect this link with password
        </label>
        <button
          type="button"
          onClick={() => handleToggle(!enabled)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            enabled ? 'bg-purple-600' : 'bg-gray-300'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {enabled && (
        <div className="space-y-4">
          {/* Password Strength Meter */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-sm font-semibold text-gray-700">Password</label>
              <span className="text-xs text-gray-500">{password.length} characters</span>
            </div>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => handlePasswordChange(e.target.value)}
                placeholder="Enter password (min 6 characters)"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {password && (
              <div className="mt-2">
                <div className="flex gap-1">
                  <div
                    className={`h-1 flex-1 rounded ${
                      strength === 'weak' ? 'bg-red-500' : strength === 'medium' ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                  />
                  <div
                    className={`h-1 flex-1 rounded ${
                      strength === 'medium' || strength === 'strong' ? 'bg-yellow-500' : 'bg-gray-200'
                    }`}
                  />
                  <div
                    className={`h-1 flex-1 rounded ${
                      strength === 'strong' ? 'bg-green-500' : 'bg-gray-200'
                    }`}
                  />
                </div>
                <p className="text-xs mt-1">
                  Strength:{' '}
                  <span
                    className={
                      strength === 'weak'
                        ? 'text-red-600'
                        : strength === 'medium'
                        ? 'text-yellow-600'
                        : 'text-green-600'
                    }
                  >
                    {strength.charAt(0).toUpperCase() + strength.slice(1)}
                  </span>
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => handleConfirmPasswordChange(e.target.value)}
                placeholder="Confirm password"
                className="w-full px-4 py-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600 pr-10"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
            {confirmPassword && (
              <p className={`text-xs mt-1 ${passwordsMatch ? 'text-green-600' : 'text-red-600'}`}>
                {passwordsMatch ? '✓ Passwords match' : '✗ Passwords do not match'}
              </p>
            )}
          </div>

          {!isValid && (
            <p className="text-sm text-red-600">
              Password must be at least 6 characters and passwords must match
            </p>
          )}
        </div>
      )}
    </div>
  );
}

