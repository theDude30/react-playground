import { useCallback, useEffect, useState } from 'react';
import type { Rule, RuleException } from './types';

const API = 'http://localhost:3006';

export function useExceptions() {
  const [exceptions, setExceptions] = useState<RuleException[]>([]);
  const [createExceptionError,setCreateExceptionError]= useState('');
  const [rules, setRules] = useState<Rule[]>([]);

  useEffect(() => {
    fetch(`${API}/api/exceptions`)
      .then((res) => res.json())
      .then(setExceptions);
    fetch(`${API}/api/rules`)
      .then((res) => res.json())
      .then(setRules);
  }, []);

  const setEnabled = useCallback((id: string, enabled: boolean) => {
    setExceptions((prev) =>
      prev.map((e) => (e.id === id ? { ...e, enabled } : e)),
    );
    fetch(`${API}/api/exceptions/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ enabled }),
    });
  }, []);

  const create = useCallback((draft: Partial<RuleException>) => {
    setCreateExceptionError('');
    return fetch(`${API}/api/exceptions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(draft),
    })
      .then((res) => {
        if(!res.ok){
          throw Error("Error creating exception");
        }
        return res.json()
  })
      .then((data) => {
        setExceptions((prev) => [...prev, data.exception]);
        return data;
      })
      .catch((err)=>{
        setCreateExceptionError(err);
      })
  }, []);

  const remove = useCallback((id: string) => {
    setExceptions((prev) => prev.filter((e) => e.id !== id));
    fetch(`${API}/api/exceptions/${id}`, { method: 'DELETE' });
  }, []);

  return { exceptions, rules, setEnabled, create, remove ,createExceptionError};
}
