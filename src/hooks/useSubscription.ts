import { useState, useEffect } from 'react';
import { PLANS } from '@/lib/subscription';

// Define the shape of the plan object based on PLANS in lib/subscription
type Plan = typeof PLANS.FREE;

export function useSubscription() {
    const [plan, setPlan] = useState<Plan | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchSubscription() {
            try {
                const res = await fetch('/api/subscription');
                if (res.ok) {
                    const data = await res.json();
                    setPlan(data);
                } else {
                    setError('Failed to fetch subscription');
                }
            } catch (err) {
                console.error(err);
                setError('Error fetching subscription');
            } finally {
                setLoading(false);
            }
        }

        fetchSubscription();
    }, []);

    return { plan, loading, error };
}
