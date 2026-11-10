import { useCallback, useEffect, useState } from 'react';
import type { Alert } from './types';

const API = 'http://localhost:3004';

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    fetch(`${API}/api/alerts`)
      .then((res) => res.json())
      .then(setAlerts);
  }, []);

  const markReviewed = useCallback((ids: string[]) => {
    fetch(`${API}/api/alerts/review`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ids }),
    }).then(() => {
      setAlerts((prev) =>
        prev.map((a) => (ids.includes(a.id) ? { ...a, reviewed: true } : a)),
      );
    });
  }, []);

  return { alerts, markReviewed };
}
