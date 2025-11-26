import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { AnalyticsData } from '@/lib/dummy-data';

export function useAnalytics(linkId: string, range: string = '7d') {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAnalytics = async () => {
    if (!linkId) return;
    setLoading(true);
    setError(null);
    const response = await api.links.getAnalytics(linkId, range);
    if (response.error) {
      setError(response.error);
    } else if (response.data) {
      setData(response.data as AnalyticsData);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAnalytics();
    // Poll every 5 seconds for real-time updates
    const interval = setInterval(fetchAnalytics, 5000);
    return () => clearInterval(interval);
  }, [linkId, range]);

  return {
    data,
    loading,
    error,
    refetch: fetchAnalytics,
  };
}

