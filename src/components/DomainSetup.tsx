'use client';

import { useState, useEffect } from 'react';

interface DomainSetupProps {
  onDomainVerified?: (domain: string) => void;
}

export function DomainSetup({ onDomainVerified }: DomainSetupProps) {
  const [domain, setDomain] = useState('');
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState('');

  const domainRegex = /^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i;

  const handleNext = () => {
    if (step === 1) {
      if (!domain) {
        setError('Please enter a domain name');
        return;
      }
      if (!domainRegex.test(domain)) {
        setError('Invalid domain format');
        return;
      }
      setError('');
      setStep(2);
    }
  };

  const handleVerify = async () => {
    setVerifying(true);
    setError('');
    try {
      const response = await fetch('/api/domains/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain }),
      });

      const data = await response.json();
      if (response.ok && data.verified) {
        setVerified(true);
        setStep(3);
        onDomainVerified?.(domain);
      } else {
        setError(data.error || 'Domain verification failed');
      }
    } catch (err) {
      setError('Network error. Please try again.');
    } finally {
      setVerifying(false);
    }
  };

  const copyCNAME = () => {
    const cnameText = `Type: CNAME\nName: ${domain}\nValue: platform.short.link`;
    navigator.clipboard.writeText(cnameText);
    alert('CNAME record copied to clipboard!');
  };

  // Auto-verify polling (Step 2 -> Step 3)
  useEffect(() => {
    if (step === 2 && !verifying) {
      const interval = setInterval(async () => {
        try {
          const response = await fetch('/api/domains/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ domain }),
          });
          const data = await response.json();
          if (response.ok && data.verified) {
            setVerified(true);
            setStep(3);
            onDomainVerified?.(domain);
            clearInterval(interval);
          }
        } catch (err) {
          // Silent fail, continue polling
        }
      }, 5000);

      // Timeout after 2 minutes
      const timeout = setTimeout(() => {
        clearInterval(interval);
        if (!verified) {
          setError('Verification timed out. Please check your DNS settings and try again.');
        }
      }, 120000);

      return () => {
        clearInterval(interval);
        clearTimeout(timeout);
      };
    }
  }, [step, domain, verifying, verified, onDomainVerified]);

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg border-2 border-gray-200">
      <h3 className="text-2xl font-bold mb-6">Add Custom Domain</h3>

      {/* Step Indicator */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-2">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              step >= 1 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}
          >
            1
          </div>
          <div className={`h-1 w-16 ${step >= 2 ? 'bg-purple-600' : 'bg-gray-200'}`} />
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              step >= 2 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}
          >
            2
          </div>
          <div className={`h-1 w-16 ${step >= 3 ? 'bg-purple-600' : 'bg-gray-200'}`} />
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
              step >= 3 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}
          >
            3
          </div>
        </div>
        <span className="text-sm text-gray-600">Step {step} of 3</span>
      </div>

      {/* Step 1: Enter Domain */}
      {step === 1 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-semibold mb-2">Domain Name</label>
            <input
              type="text"
              placeholder="links.yourcompany.com"
              value={domain}
              onChange={(e) => {
                setDomain(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-purple-600"
            />
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
          </div>
          <button
            onClick={handleNext}
            className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold"
          >
            Next
          </button>
        </div>
      )}

      {/* Step 2: DNS Instructions */}
      {step === 2 && (
        <div className="space-y-6">
          <div className="bg-purple-50 p-6 rounded-lg border-2 border-purple-200">
            <h4 className="font-semibold text-gray-900 mb-3">Step 2: Add CNAME Record</h4>
            <p className="text-sm text-gray-700 mb-3">
              Add this DNS record to your domain provider (e.g., Cloudflare, AWS Route 53, GoDaddy):
            </p>
            <div className="bg-white p-4 rounded border border-gray-300 font-mono text-sm mb-3">
              <div className="mb-2">
                <span className="font-semibold">Type:</span> CNAME
              </div>
              <div className="mb-2">
                <span className="font-semibold">Name:</span> {domain}
              </div>
              <div>
                <span className="font-semibold">Value:</span> platform.short.link
              </div>
            </div>
            <button
              onClick={copyCNAME}
              className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
            >
              Copy CNAME to Clipboard
            </button>
          </div>

          <div>
            <p className="text-sm text-gray-600 mb-4">
              After adding the CNAME record, click Verify. DNS propagation can take a few minutes.
            </p>
            <button
              onClick={handleVerify}
              disabled={verifying}
              className="w-full px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {verifying ? 'Verifying...' : 'Verify Domain'}
            </button>
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}
          {verifying && (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
              <p className="text-sm text-gray-600 mt-2">Checking DNS records...</p>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Success */}
      {step === 3 && verified && (
        <div className="text-center space-y-4">
          <div className="text-6xl mb-4">✓</div>
          <h4 className="text-2xl font-bold text-green-600">Domain Added Successfully!</h4>
          <p className="text-gray-600">
            Your domain <strong>{domain}</strong> has been verified and is ready to use.
          </p>
        </div>
      )}
    </div>
  );
}

