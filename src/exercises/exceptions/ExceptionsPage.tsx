import { useState } from 'react';
import { useExceptions } from './useExceptions';
import type { Condition } from './types';

const SPACE = 'ops';

export function ExceptionsPage() {
  const { exceptions, rules, setEnabled, create, remove,createExceptionError } = useExceptions();

  const [name, setName] = useState('');
  const [ruleId, setRuleId] = useState('');
  const [conditions, setConditions] = useState<Condition[]>([]);

  const ordered = [...exceptions].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
  const activeCount = exceptions.filter((e) => e.enabled).length;

  function addCondition() {
    conditions.push({ field: '', operator: 'is', value: '' });
    setConditions(conditions);
  }

  function onCreate() {
    create({ name, ruleId, spaceId: SPACE, conditions });
    setName('');
    setRuleId('');
    setConditions([]);
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui', maxWidth: 820 }}>
      <h1>Rule exceptions</h1>
      <p style={{ color: '#666' }}>{activeCount} active exceptions in {SPACE}</p>
      {(createExceptionError)&&  <span style={{color:'red'}}>Error Creating Exception</span>}
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '2rem' }}>
        <tbody>
          {ordered.map((exception) => (
            <tr key={exception.id} style={{ borderTop: '1px solid #eee' }}>
              <td style={{ padding: '0.5rem 0' }}>
                <strong>{exception.name}</strong>
                <div style={{ fontSize: 12, color: '#666' }}>
                  {rules.find((r) => r.id === exception.ruleId)?.name} ·{' '}
                  {exception.conditions.length} conditions ·{' '}
                  {exception.expiresAt ? `expires ${exception.expiresAt}` : 'no expiry'}
                </div>
              </td>
              <td>
                <input
                  type="checkbox"
                  checked={exception.enabled}
                  onChange={(e) => setEnabled(exception.id, e.target.checked)}
                />
              </td>
              <td>
                <button onClick={() => remove(exception.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>New exception</h2>
      <div style={{ display: 'grid', gap: '0.5rem', maxWidth: 520 }}>
        <input placeholder="name" value={name} onChange={(e) => setName(e.target.value)} />
        <select value={ruleId} onChange={(e) => setRuleId(e.target.value)}>
          <option value="">select a rule</option>
          {rules.map((rule) => (
            <option key={rule.id} value={rule.id}>{rule.name}</option>
          ))}
        </select>

        {conditions.map((condition, i) => (
          <div key={i} style={{ display: 'flex', gap: '0.5rem' }}>
            <input
              placeholder="field"
              value={condition.field}
              onChange={(e) => {
                conditions[i].field = e.target.value;
                setConditions([...conditions]);
              }}
            />
            <input
              placeholder="value"
              value={condition.value}
              onChange={(e) => {
                conditions[i].value = e.target.value;
                setConditions([...conditions]);
              }}
            />
          </div>
        ))}
        <button onClick={addCondition}>Add condition</button>
        <button type="submit" title={conditions.length<1 || !conditions.find(condition=>condition.field.length && condition.value.length) || !name ? "Needs name and one condition filled" : 'create new exception'} onClick={onCreate}  disabled={conditions.length<1 || !conditions.find(condition=>condition.field.length && condition.value.length) || !name}>Create exception</button>
      </div>
    </main>
  );
}
