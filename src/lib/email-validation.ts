import disposableDomains from 'disposable-email-domains';

// Major email providers only (per user preference)
const TRUSTED_DOMAINS = [
  // Gmail
  'gmail.com',
  'googlemail.com',

  // Yahoo
  'yahoo.com',
  'yahoo.co.uk',
  'yahoo.co.in',
  'yahoo.fr',
  'yahoo.de',
  'yahoo.es',
  'yahoo.it',

  // Outlook/Hotmail/Live
  'outlook.com',
  'hotmail.com',
  'live.com',
  'msn.com',

  // Apple
  'icloud.com',
  'me.com',
  'mac.com',

  // ProtonMail
  'protonmail.com',
  'proton.me',
  'pm.me',

  // Other Major Providers
  'aol.com',
  'zoho.com',
  'yandex.com',
  'yandex.ru',
  'mail.com',
  'gmx.com',
  'gmx.net',
];

export interface EmailValidationResult {
  valid: boolean;
  reason?: string;
  domain?: string;
  isTrusted?: boolean;
  isDisposable?: boolean;
}

/**
 * Extract domain from email address
 */
export function extractDomain(email: string): string | null {
  if (!email || typeof email !== 'string') {
    return null;
  }

  const parts = email.toLowerCase().trim().split('@');
  if (parts.length !== 2) {
    return null;
  }

  return parts[1];
}

/**
 * Check if email uses a disposable/temporary email service
 */
export function isDisposableEmail(email: string): boolean {
  const domain = extractDomain(email);
  if (!domain) {
    return false;
  }

  return disposableDomains.includes(domain);
}

/**
 * Check if email domain is a trusted major provider
 */
export function isTrustedDomain(email: string): boolean {
  const domain = extractDomain(email);
  if (!domain) {
    return false;
  }

  return TRUSTED_DOMAINS.includes(domain);
}

/**
 * Validate email format
 */
export function isValidEmailFormat(email: string): boolean {
  if (!email || typeof email !== 'string') {
    return false;
  }

  // Basic email regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Comprehensive email domain validation
 * Returns validation result with details
 */
export function validateEmailDomain(email: string): EmailValidationResult {
  // Check email format
  if (!isValidEmailFormat(email)) {
    return {
      valid: false,
      reason: 'Invalid email format',
    };
  }

  const domain = extractDomain(email);
  if (!domain) {
    return {
      valid: false,
      reason: 'Could not extract domain from email',
    };
  }

  // Check if disposable
  const disposable = isDisposableEmail(email);
  if (disposable) {
    return {
      valid: false,
      reason: 'Temporary email addresses are not allowed',
      domain,
      isDisposable: true,
      isTrusted: false,
    };
  }

  // Check if trusted (optional - we're using blocklist approach)
  const trusted = isTrustedDomain(email);

  // For blocklist approach: Valid if not disposable
  // For allowlist approach: Valid only if trusted
  // Currently using blocklist as per plan

  return {
    valid: true,
    domain,
    isDisposable: false,
    isTrusted: trusted,
  };
}

/**
 * Get list of all trusted domains
 */
export function getTrustedDomains(): string[] {
  return [...TRUSTED_DOMAINS];
}

/**
 * Check if domain is in the disposable list
 */
export function isDomainDisposable(domain: string): boolean {
  return disposableDomains.includes(domain.toLowerCase());
}
