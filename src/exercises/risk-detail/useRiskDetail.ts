import { useEffect, useState } from 'react';
import type { Alert, Criticality, Entity, ScoreResponse } from './types';

const API = 'http://localhost:3007';

export function useRiskDetail(entityId: string) {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [detail, setDetail] = useState<ScoreResponse | null>(null);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [criticallyLoading,setCriticallyLoading] = useState<boolean>(false);
  const [criticallyError,setCriticallyError] = useState<string | null>(null);


  useEffect(() => {
    fetch(`${API}/api/entities`)
      .then((res) => res.json())
      .then(setEntities);
  }, []);

  useEffect(() => {
    if (!entityId) return;
    fetch(`${API}/api/entities/${entityId}/score`)
      .then((res) => res.json())
      .then((data) => {
        setDetail(data);
        return fetch(`${API}/api/entities/${entityId}/alerts`);
      })
      .then((res) => {
        if (!res.ok) throw new Error('could not load alerts');
        return res.json();
      })
      .then(setAlerts)
      .catch((err) => setError(err.message));

    setInterval(() => {
      fetch(`${API}/api/entities/${entityId}/score`)
        .then((res) => res.json())
        .then(setDetail);
    }, 30000);
  }, [entityId]);

  function setCriticality(criticality: Criticality) {
    if(!entityId || !criticality) return;
    setCriticallyLoading(true);
    fetch(`${API}/api/entities/${entityId}/criticality`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ criticality }),
    })
    .then((res)=>{
      if (!res.ok) 
        throw new Error('error calculating score,try again');
      return res.json();
    })
    .then((data:ScoreResponse)=>{
     setCriticallyLoading(false);
     setDetail((prev)=>(prev ? {...prev,...data}: {...data}));
    })
    .catch((error:Error)=>{
       setCriticallyLoading(false);
       setCriticallyError(error.message)
    })
  }

  return { entities, detail, alerts, error, setCriticality,criticallyLoading,criticallyError };
}
