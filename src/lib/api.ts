const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '';

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export async function apiRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  try {
    // Build request URL dynamically so the app works across different base URLs/origins.
    let url: string;
    if (API_BASE_URL) {
      url = `${API_BASE_URL.replace(/\/$/, '')}${endpoint}`;
    } else if (typeof window !== 'undefined') {
      // In the browser, use the current origin so requests target the same host.
      url = `${window.location.origin}/api${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    } else {
      // Fallback for environments without window (SSR). Use environment override if provided.
      url = `/api${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`;
    }

    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      return { error: error.error || `HTTP ${response.status}` };
    }

    const data = await response.json();
    return { data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Network error',
    };
  }
}

export const api = {
  links: {
    create: (destination: string, customCode?: string, tags?: string[]) =>
      apiRequest<{ id: string; shortCode: string; shortUrl: string; destination: string; createdAt: string; clicks: number }>(
        '/links',
        {
          method: 'POST',
          body: JSON.stringify({ destination, customCode, tags }),
        }
      ),
    list: () =>
      apiRequest<Array<{ id: string; shortUrl: string; destination: string; createdAt: string; clicks: number; tags: string[] }>>(
        '/links'
      ),
    checkAvailability: (code: string) =>
      apiRequest<{ code: string; available: boolean; suggestion?: string }>(
        `/links/check-availability?code=${encodeURIComponent(code)}`
      ),
    getAnalytics: (linkId: string, range?: string) =>
      apiRequest<any>(`/links/${linkId}/analytics${range ? `?range=${range}` : ''}`),
    updateTags: (linkId: string, tags: string[]) =>
      apiRequest<{ id: string; tags: string[] }>(`/links/${linkId}/tags`, {
        method: 'POST',
        body: JSON.stringify({ tags }),
      }),
  },
  domains: {
    verify: (domain: string) =>
      apiRequest<{ verified: boolean; verifiedAt?: string; sslCertExpiry?: string }>(
        '/domains/verify',
        {
          method: 'POST',
          body: JSON.stringify({ domain }),
        }
      ),
  },
  qr: {
    generate: (linkId: string, size?: number, format?: string) =>
      apiRequest<{ qrUrl: string }>(`/qr/${linkId}${size ? `?size=${size}&format=${format || 'png'}` : ''}`),
  },
  team: {
    invite: (email: string, role: string) =>
      apiRequest<{ id: string; email: string; role: string }>('/team/members', {
        method: 'POST',
        body: JSON.stringify({ email, role }),
      }),
    remove: (memberId: string) =>
      apiRequest<void>(`/team/members/${memberId}`, {
        method: 'DELETE',
      }),
  },
};

