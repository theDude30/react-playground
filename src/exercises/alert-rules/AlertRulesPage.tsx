import { useMemo, useState } from 'react';
import { useAlertRules } from './useAlertRules';

const SPACES = ['ops', 'billing', 'security'];

export function AlertRulesPage() {
  const [spaceId, setSpaceId] = useState('ops');
  const { rules, loading, toggleMute, remove } = useAlertRules(spaceId);

  const sorted = useMemo(
    () => rules.sort((a, b) => a.name.localeCompare(b.name)),
    [rules],
  );

  const mutedCount = useMemo(() => rules.filter((r) => r.muted).length, [rules]);

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Alert rules</h1>

      <label>
        Space{' '}
        <select value={spaceId} onChange={(e) => setSpaceId(e.target.value)}>
          {SPACES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>

      <p>
        {mutedCount} of {rules.length} muted
      </p>

      {loading && <p>Loading…</p>}

      <ul style={{ listStyle: 'none', padding: 0 }}>
        {sorted.map((rule) => (
          <li
            key={rule.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: 6,
              padding: '0.75rem 1rem',
              marginBottom: '0.5rem',
              opacity: rule.muted ? 0.5 : 1,
            }}
          >
            <strong>{rule.name}</strong> — threshold {rule.threshold} — owner{' '}
            {rule.ownerName}
            <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
              <button onClick={() => toggleMute(rule.id)}>
                {rule.muted ? 'Unmute' : 'Mute'}
              </button>
              <button onClick={() => remove(rule.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>
    </main>
  );
}
