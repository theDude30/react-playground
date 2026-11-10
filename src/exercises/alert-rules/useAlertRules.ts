import { useCallback, useEffect, useState } from 'react';
import type { AlertRule } from './types';

const API = 'http://localhost:3001';
const claimedBy="tzahi";

export function useAlertRules(spaceId: string) {
  const [rules, setRules] = useState<AlertRule[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setRules([]);
    setLoading(true);
    fetch(`${API}/api/alert_rules?spaceId=${spaceId}`,{
      signal:controller.signal
    })
      .then((res) =>{
        if(!res.ok){
          throw new Error(`Request failed: ${res.status}`)
        }
        return res.json();
      })
      .then((data) => {
        setRules(data);
        setLoading(false);
      }).catch(err=>{
          if (err.name !== 'AbortError') setLoading(false);
      })
    return () => controller.abort();
  }, [spaceId]);

  const toggleMute = useCallback((id: string) => {
    const rule = rules.find((r) => r.id === id);
    if (!rule) return;
    const newMutedValue = !rule.muted;
    setRules(rules.map((r) => (r.id === id ? { ...r, muted: newMutedValue } : r)));

    fetch(`${API}/api/alert_rules/${id}/mute`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ muted: newMutedValue }),
    }).then(resp=>{
      if(!resp.ok){
       setRules((prev) => prev.map((r) => (r.id === id ? { ...r, muted: !newMutedValue } : r)));
      }
    })
    .catch(() =>{
      setRules((prev) => prev.map((r) => (r.id === id ? { ...r, muted: !newMutedValue } : r)));
    })

  }, [rules]);

  const remove = useCallback(
    (id: string) => {
      const next = rules.filter((r) => r.id !== id);
      const removed = rules.find(r=>r.id === id);
      if(!removed){
        return;
      }
      setRules(next);
      fetch(`${API}/api/alert_rules/${id}`, { method: 'DELETE',headers:{"X-User":claimedBy}})
      .then((resp)=>{
        if(!resp.ok){
         setRules(prev => [...prev, removed])
        }
      })
      .catch(()=>setRules(prev => [...prev, removed]))
    },
    [rules],
  );

  return { rules, loading, toggleMute, remove };
}
