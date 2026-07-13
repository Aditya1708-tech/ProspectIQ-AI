import { useState, useEffect } from 'react';
import { getCustomerAnalyze } from '../services/api.js';

export function useRelationship(id: string) {
  const [relationshipHealth, setRelationshipHealth] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getCustomerAnalyze(id)
      .then((data: any) => {
        setRelationshipHealth(data?.relationshipIQ || null);
        setError(null);
      })
      .catch((err: any) => {
        setError(err.message || 'Failed to fetch relationship health');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  return { relationshipHealth, loading, error };
}
