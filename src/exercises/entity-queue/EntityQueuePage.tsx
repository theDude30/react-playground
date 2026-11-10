import { useEffect, useState } from 'react';
import debounce from '@/hooks/myDebounce';
import { useEntities } from './useEntities';
import type { Entity } from './types';

const SPACES = ['ops', 'billing', 'security'];

export function EntityQueuePage() {
  const [spaceId, setSpaceId] = useState('ops');
  const [query, setQuery] = useState('');
  const [threshold, setThreshold] = useState(50);
  const [selected, setSelected] = useState<string[]>([]);
  const [draftNote, setDraftNote] = useState('');
  const [visible, setVisible] = useState<Entity[]>([]);

  const { entities, loading, acknowledge, saveNote, acknowledgeBulk } =
    useEntities(spaceId, query);

  useEffect(() => {
    setVisible(
      entities
        .filter((e) => e.riskScore > threshold)
        .sort((a, b) => a.riskScore - b.riskScore),
    );
  }, [entities, threshold]);

  const onSearch = debounce((value: string) => setQuery(value), 300);

  function toggleSelected(id: string) {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Entity review queue</h1>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <select value={spaceId} onChange={(e) => setSpaceId(e.target.value)}>
          {SPACES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <input
          placeholder="search name"
          onChange={(e) => onSearch(e.currentTarget.value)}
        />
        <label>
          threshold {threshold}
          <input
            type="range"
            min={0}
            max={100}
            value={threshold}
            onChange={(e) => setThreshold(Number(e.target.value))}
          />
        </label>
        <button onClick={() => acknowledgeBulk(selected)}>
          Acknowledge {selected.length} selected
        </button>
      </div>

      {loading && <p>Loading…</p>}

      <table style={{ width: '100%', marginTop: '1rem', borderCollapse: 'collapse' }}>
        <tbody>
          {visible.map((entity) => (
            <tr key={entity.id} style={{ borderTop: '1px solid #ddd', }}>
              <td>
                <input
                  type="checkbox"
                  checked={selected.includes(entity.id)}
                  onChange={() => toggleSelected(entity.id)}
                />
              </td>
              <td>{entity.kind}</td>
              <td><strong>{entity.name}</strong></td>
              <td>{entity.riskScore}</td>
              <td>{entity.acknowledged ? 'acknowledged' : '—'}</td>
              <td style={{ width: '40%' }}>
                <div style={{ fontSize: 12, color: '#666' }}>{entity.note}</div>
                <textarea
                  rows={2}
                  value={draftNote}
                  onChange={(e) => setDraftNote(e.target.value)}
                  placeholder="add a note"
                />
                <button onClick={() => saveNote(entity.id, draftNote)}>Save note</button>
              </td>
              <td>
                {!entity.acknowledged && (
                  <button onClick={() => acknowledge(entity.id)}>Acknowledge</button>
                )}
              </td>
              {entity.reason &&
              <td style={{border: '1px solid red'}}>
                Error in ack - : {entity.reason}
              </td>
              }
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
}
