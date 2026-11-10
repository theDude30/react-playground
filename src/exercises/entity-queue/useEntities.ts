import { useCallback, useEffect, useState } from 'react';
import type { BulkResult, Entity } from './types';

const API = 'http://localhost:3002';

export function useEntities(spaceId: string, query: string) {
  const [entities, setEntities] = useState<Entity[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    fetch(`${API}/api/entities?spaceId=${spaceId}&q=${query}`, {
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data) => {
        setEntities(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== 'AbortError') setLoading(false);
      });
    return () => controller.abort();
  }, [spaceId, query]);

  const acknowledge = useCallback(
    (id: string) => {
      setEntities((prev) =>
        prev.map((e) => (e.id === id ? { ...e, acknowledged: true } : e)),
      );
      fetch(`${API}/api/entities/${id}/ack`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acknowledged: true }),
      });
    },
    [],
  );

  const saveNote = useCallback((id: string, note: string) => {
    fetch(`${API}/api/entities/${id}/note`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ note }),
    })
      .then((res) => res.json())
      .then((updated: Entity) => {
        setEntities((prev) => prev.map((e) => (e.id === id ? updated : e)));
      });
  }, []);

  const acknowledgeBulk = useCallback((ids: string[]) => {
    setEntities((prev) =>
      prev.map((e) => (ids.includes(e.id) ? { ...e, acknowledged: true } : e)),
    );
    return fetch(`${API}/api/entities/ack_bulk`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids }),
        })
        .then((res) => {
          if(!res.ok){
            throw Error("bulk failed");
          }
          return res.json()
        })
        .then((data:BulkResult)=>{
          if(!data.failed.length){
            return;
          }
          setEntities((prev) => prev.map((e) => {
            const failedEntity = data.failed.find(failed => failed.id === e.id);
            console.log("found failedEntity ? ",failedEntity)
            return (failedEntity ? {...e,acknowledged:false,reason:failedEntity.reason} : e);
          }))
        }) 
        .catch(()=>{
          setEntities((prev) =>
            prev.map((e) => (ids.includes(e.id) ? { ...e, acknowledged: false,reason: 'server failure'} : e)),
       );
        })}, []);

  return { entities, loading, acknowledge, saveNote, acknowledgeBulk };
}
