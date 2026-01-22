'use client';

import { useUser } from '@clerk/nextjs';
import { useState, useEffect } from 'react';

export function VerificationBanner() {
  const { user, isLoaded } = useUser();
  const [isDismissed, setIsDismissed] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [linkCount, setLinkCount] = useState<number>(0);

  // Check if banner was dismissed (stored in localStorage)
  useEffect(() => {
    const dismissed = localStorage.getItem('verification-banner-dismissed');
    if (dismissed === 'true') {
      setIsDismissed(true);
    }
  }, []);

  // Fetch user's link count
  useEffect(() => {
    async function fetchLinkCount() {
      if (!user) return;

      try {
        const response = await fetch('/api/links');
        if (response.ok) {
          const links = await response.json();
          setLinkCount(Array.isArray(links) ? links.length : 0);
        }
      } catch (error) {
        console.error('Error fetching link count:', error);
      }
    }

    fetchLinkCount();
  }, [user]);

  if (!isLoaded || !user) {
    return null;
  }

  // Check if email is verified
  // For OAuth providers (Google, GitHub, etc), emailVerified is automatically true
  // For email/password signups, check verification status
  const primaryEmail = user.primaryEmailAddress;
  const emailVerified =
    primaryEmail?.verification?.status === 'verified' ||
    user.emailAddresses.some(email => email.verification?.status === 'verified') ||
    user.externalAccounts?.length > 0; // OAuth verified emails

  // Don't show banner if email is verified or if dismissed
  if (emailVerified || isDismissed) {
    return null;
  }

  const handleDismiss = () => {
    localStorage.setItem('verification-banner-dismissed', 'true');
    setIsDismissed(true);
  };

  const handleResend = async () => {
    if (!user.primaryEmailAddress) return;

    setIsResending(true);
    setResendSuccess(false);

    try {
      await user.primaryEmailAddress.prepareVerification({
        strategy: 'email_link',
        redirectUrl: `${window.location.origin}/dashboard`
      });
      setResendSuccess(true);

      // Hide success message after 5 seconds
      setTimeout(() => {
        setResendSuccess(false);
      }, 5000);
    } catch (error) {
      console.error('Error resending verification email:', error);
    } finally {
      setIsResending(false);
    }
  };

  const linksUsed = linkCount;
  const linksLimit = 2;
  const isLimitReached = linksUsed >= linksLimit;

  // If email is verified or dismissed, don't show anything
  if (emailVerified || isDismissed) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 md:p-6 mb-6 rounded-r-lg">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div className="flex flex-shrink-0">
          <svg
            className="h-6 md:h-5 w-6 md:w-5 text-yellow-400"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="flex-1 md:ml-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <h3 className="text-sm md:text-base font-bold text-yellow-900">
                ✉️ Verify your email to unlock unlimited links
              </h3>
              <div className="mt-2 text-xs md:text-sm text-yellow-700">
                <p>
                  <span className="font-semibold">{linksUsed}/{linksLimit}</span> free links used.
                  {isLimitReached && (
                    <span className="text-red-600 font-bold ml-2">Limit reached!</span>
                  )}
                </p>
                <p className="mt-1 text-yellow-700">
                  Verify <span className="font-bold">{user.primaryEmailAddress?.emailAddress}</span>
                </p>
              </div>
              <div className="mt-4 flex flex-col sm:flex-row gap-2 sm:gap-3">
                <button
                  onClick={handleResend}
                  disabled={isResending || resendSuccess}
                  className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-transparent text-xs sm:text-sm font-semibold rounded-lg shadow-sm text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:bg-yellow-400 disabled:cursor-not-allowed transition-colors"
                >
                  {isResending ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                        className="-ml-1 mr-2 h-4 w-4"
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
                      Sent!
                    </>
                  ) : (
                    'Resend Email'
                  )}
                </button>
                <a
                  href="/verify-email"
                  className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 border border-yellow-600 text-xs sm:text-sm font-semibold rounded-lg text-yellow-700 bg-white hover:bg-yellow-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
                >
                  Learn More
                </a>
              </div>
            </div>
            <div className="md:ml-auto md:pl-3 md:flex-shrink-0">
              <button
                onClick={handleDismiss}
                className="inline-flex rounded-lg bg-yellow-100 p-1.5 text-yellow-600 hover:bg-yellow-200 focus:outline-none focus:ring-2 focus:ring-yellow-600 focus:ring-offset-2 focus:ring-offset-yellow-50 transition-colors"
                title="Dismiss"
              >
                <span className="sr-only">Dismiss</span>
                <svg
                  className="h-5 w-5"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
