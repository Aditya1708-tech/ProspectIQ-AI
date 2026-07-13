import { useState, useEffect } from 'react';
import { getDashboardData } from '../services/api.js';

export function useDashboard() {
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getDashboardData()
      .then((data: any) => {
        setSummary(data);
        setError(null);
      })
      .catch((err: any) => {
        setError(err.message || 'Failed to fetch dashboard summary');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { summary, loading, error };
}
