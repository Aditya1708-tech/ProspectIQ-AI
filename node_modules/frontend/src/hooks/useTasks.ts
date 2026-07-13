import { useState, useEffect } from 'react';
import { getTasks } from '../services/api.js';

export function useTasks() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    getTasks()
      .then((data: any[]) => {
        setTasks(data);
        setError(null);
      })
      .catch((err: any) => {
        setError(err.message || 'Failed to fetch tasks');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { tasks, loading, error, setTasks };
}
