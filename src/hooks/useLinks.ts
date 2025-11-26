import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Link } from '@/lib/dummy-data';

export function useLinks() {
  const [links, setLinks] = useState<Link[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchLinks = async () => {
    setLoading(true);
    setError(null);
    const response = await api.links.list();
    if (response.error) {
      setError(response.error);
    } else if (response.data) {
      setLinks(response.data as Link[]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLinks();
  }, []);

  const createLink = async (destination: string, customCode?: string, tags?: string[]) => {
    setLoading(true);
    setError(null);
    const response = await api.links.create(destination, customCode, tags);
    if (response.error) {
      setError(response.error);
      setLoading(false);
      return null;
    }
    if (response.data) {
      await fetchLinks();
      setLoading(false);
      return response.data;
    }
    setLoading(false);
    return null;
  };

  return {
    links,
    loading,
    error,
    createLink,
    refetch: fetchLinks,
  };
}

