'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function VerifyEmailPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [error, setError] = useState('');

  // Check if email is already verified, if so redirect to dashboard
  useEffect(() => {
    if (isLoaded && user) {
      const emailVerified = user.primaryEmailAddress?.verification?.status === 'verified';
      if (emailVerified) {
        router.push('/dashboard');
      }
    }
  }, [isLoaded, user, router]);

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
      </div>
    );
  }

  if (!user) {
    router.push('/sign-in');
    return null;
  }

  const emailVerified = user.primaryEmailAddress?.verification?.status === 'verified';

  if (emailVerified) {
    return null; // Will redirect via useEffect
  }

  const handleResend = async () => {
    if (!user.primaryEmailAddress) return;

    setIsResending(true);
    setError('');
    setResendSuccess(false);

    try {
      await user.primaryEmailAddress.prepareVerification({
        strategy: 'email_link',
        redirectUrl: `${window.location.origin}/dashboard`
      });
      setResendSuccess(true);

      // Hide success message after 10 seconds
      setTimeout(() => {
        setResendSuccess(false);
      }, 10000);
    } catch (err) {
      console.error('Error resending verification email:', err);
      setError('Failed to resend verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full">
        <div className="bg-white p-8 rounded-xl shadow-lg">
          {/* Icon */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-full mb-4">
              <svg
                className="w-8 h-8 text-purple-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">
              Verify Your Email
            </h1>
            <p className="text-gray-600">
              We sent a verification link to:
            </p>
            <p className="font-semibold text-purple-600 mt-2 break-all">
              {user.primaryEmailAddress?.emailAddress}
            </p>
          </div>

          {/* Instructions */}
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-900 mb-2">
              What to do next:
            </h3>
            <ol className="text-sm text-blue-800 space-y-1 list-decimal list-inside">
              <li>Check your email inbox</li>
              <li>Click the verification link in the email</li>
              <li>Return to this page - you&apos;ll be redirected automatically</li>
            </ol>
          </div>

          {/* Success Message */}
          {resendSuccess && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-600 mr-2"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-sm text-green-800 font-medium">
                  Verification email sent successfully!
                </p>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Actions */}
          <div className="space-y-4">
            <button
              onClick={handleResend}
              disabled={isResending || resendSuccess}
              className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:bg-purple-400 disabled:cursor-not-allowed transition-colors"
            >
              {isResending ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Sending...
                </>
              ) : resendSuccess ? (
                <>
                  <svg
                    className="-ml-1 mr-3 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.857-9.809a.75.75 0 00-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 10-1.06 1.061l2.5 2.5a.75.75 0 001.137-.089l4-5.5z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Email Sent!
                </>
              ) : (
                'Resend Verification Email'
              )}
            </button>

            <a
              href="/dashboard"
              className="block w-full px-6 py-3 border-2 border-gray-300 text-base font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 text-center transition-colors"
            >
              Go to Dashboard
            </a>

            <a
              href="/api/auth/signout"
              className="block w-full px-6 py-3 text-base font-medium text-gray-600 hover:text-gray-900 text-center transition-colors"
            >
              Sign Out
            </a>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Can&apos;t find the email?
            </p>
            <ul className="mt-2 text-sm text-gray-500 space-y-1">
              <li>• Check your spam/junk folder</li>
              <li>• Make sure {user.primaryEmailAddress?.emailAddress} is correct</li>
              <li>• Wait a few minutes and check again</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
