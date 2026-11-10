import { useCallback, useEffect, useState } from 'react';
import type { Rule } from './types';

const API = 'http://localhost:3003';

export function useRules() {
  const [rules, setRules] = useState<Rule[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/rules`)
      .then((res) => res.json())
      .then(setRules);
  }, []);

  const save = useCallback(async (rule: Rule,isNew:boolean) => {
    setSaving(true);
    const res = await fetch(
      isNew ? `${API}/api/rules` : `${API}/api/rules/${rule.id}`,
      {
        method: isNew ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rule),
      },
    );
    const data = await res.json();
    setRules((prev) =>
      isNew ? [...prev, {...data.rule,isNew:false}] : prev.map((r) => (r.id === rule.id ? data.rule : r)),
    );
    setSaving(false);
    return data;
  }, []);

  return { rules, saving, save };
}
