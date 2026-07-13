import { useState, useEffect } from 'react';
import { getCustomerAnalyze } from '../services/api.js';

export function usePredictIQ(id: string) {
  const [predictionData, setPredictionData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getCustomerAnalyze(id)
      .then((data: any) => {
        setPredictionData(data?.predictIQ || null);
        setError(null);
      })
      .catch((err: any) => {
        setError(err.message || 'Failed to fetch prediction metrics');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  return { predictionData, loading, error };
}
