import { useState, useEffect } from 'react';
import { getCustomerProfile } from '../services/api.js';

export function useCustomer(id: string) {
  const [customer, setCustomer] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getCustomerProfile(id)
      .then((data: any) => {
        setCustomer(data);
        setError(null);
      })
      .catch((err: any) => {
        setError(err.message || 'Failed to fetch customer');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  return { customer, loading, error };
}
