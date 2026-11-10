import { useState } from 'react';
import { useRiskDetail } from './useRiskDetail';
import type { Criticality } from './types';

const LEVELS: Criticality[] = ['low', 'medium', 'high', 'extreme'];

export function RiskDetailPage() {
  const [entityId, setEntityId] = useState('e-1');
  const { entities, detail, alerts, error, setCriticality,criticallyLoading,criticallyError } = useRiskDetail(entityId);
  if (error) return <p style={{ color: 'tomato' }}>{error}</p>;
  if (!detail) return <p>Loading…</p>;
  const max = Math.max(...detail.history.map((h) => h.score));
  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui', maxWidth: 780 }}>
      <select value={entityId} onChange={(e) => setEntityId(e.target.value)} disabled={criticallyLoading}>
        {entities.map((entity) => (
          <option key={entity.id} value={entity.id}>{entity.name}</option>
        ))}
      </select>

      <h1 style={{ fontSize: 48, margin: '1rem 0 0' }}>{detail.score}</h1>
      <div style={{ color: '#666' }}>risk score · criticality {detail.criticality}</div>

      <div style={{ margin: '1rem 0' }}>
        {LEVELS.map((level) => (
          <button
            key={level}
            disabled={criticallyLoading}
            onClick={() => setCriticality(level)}
            style={{ marginRight: '0.5rem', fontWeight: level === detail.criticality ? 700 : 400 }}
          >
            {level}
          </button>
        ))}
        {criticallyError && <span style={{color:'red'}}> Error re-calculating, details : {criticallyError}</span>}
      </div>

      <h2>Last 30 days</h2>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 120 }}>
        {detail.history.map((point, i) => (
          <div
            key={i}
            title={`${point.at}: ${point.score}`}
            style={{ width: 10, height: `${(point.score / max) * 100}%`, background: '#69a' }}
          />
        ))}
      </div>

      <h2>Contributing alerts</h2>
      <ul>
        {alerts.map((alert) => (
          <li key={alert.id}>
            {alert.ruleName} · {alert.severity}
          </li>
        ))}
      </ul>
    </main>
  );
}
