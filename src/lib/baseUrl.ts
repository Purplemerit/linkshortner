import { headers } from 'next/headers';

export function getBaseUrl() {
    // 1. Try to get from request headers (most reliable for current deployment)
    try {
        const host = headers().get('host');
        if (host) {
            // Check if it's localhost and we have a custom BASE_URL set
            if (host.includes('localhost') && process.env.NEXT_PUBLIC_BASE_URL && !process.env.NEXT_PUBLIC_BASE_URL.includes('localhost')) {
                return process.env.NEXT_PUBLIC_BASE_URL;
            }

            const protocol = headers().get('x-forwarded-proto') || 'https';
            return `${protocol}://${host}`;
        }
    } catch (e) {
        // headers() might throw if called outside of request context (rare in Next.js 13+ APIs)
    }

    // 2. Fallback to environment variable
    if (process.env.NEXT_PUBLIC_BASE_URL) {
        return process.env.NEXT_PUBLIC_BASE_URL;
    }

    // 3. Absolute fallback
    return 'http://localhost:3000';
}
