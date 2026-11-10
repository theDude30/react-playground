import { useEffect, useState } from 'react';
import { AlertRow } from './AlertRow';
import { FilterProvider, useFilter } from './FilterContext';
import { useAlerts } from './useAlerts';
import type { Alert, Severity } from './types';

const SEVERITIES: Severity[] = ['low', 'medium', 'high', 'critical'];
const RANK: Record<Severity, number> = { low: 0, medium: 1, high: 2, critical: 3 };

function Timeline() {
  const { alerts, markReviewed } = useAlerts();
  const { text, setText, minSeverity, setMinSeverity } = useFilter();

  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selected, setSelected] = useState<string[]>([]);
  const [visible, setVisible] = useState<Alert[]>([]);

  useEffect(() => {
    const filtered = alerts
      .filter((a) => a.ruleName.toLowerCase().includes(text.toLowerCase()))
      .filter((a) => RANK[a.severity] >= RANK[minSeverity])
      .sort((a, b) => new Date(b.at).getTime() -new Date(a.at).getTime());
    setVisible(filtered);
  }, [alerts, text, minSeverity]);

  const groups: Record<string, number> = {};
  for (const alert of alerts) {
    groups[alert.ruleName] = (groups[alert.ruleName] || 0) + 1;
  }

  return (
    <main style={{ padding: '2rem', fontFamily: 'system-ui' }}>
      <h1>Alerts</h1>

      <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
        <input
          placeholder="filter by rule"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <select
          value={minSeverity}
          onChange={(e) => setMinSeverity(e.target.value as Severity)}
        >
          {SEVERITIES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
        <button onClick={() => markReviewed(selected)}>
          Mark {selected.length} reviewed
        </button>
        <span>{visible.length} of {alerts.length}</span>
      </div>

      <div style={{ display: 'flex', gap: '1rem', margin: '1rem 0', flexWrap: 'wrap' }}>
        {Object.keys(groups).map((rule, i) => (
          <div key={i} style={{ border: '1px solid #ddd', padding: '0.25rem 0.5rem' }}>
            {rule}: {groups[rule]}
          </div>
        ))}
      </div>

      <div>
        {visible.map((alert, i) => (
          <AlertRow
            key={i}
            alert={alert}
            expanded={expandedId === alert.id}
            selected={selected.includes(alert.id)}
            onToggleExpand={() => setExpandedId(expandedId === alert.id ? null : alert.id)}
            onToggleSelect={() =>
              setSelected(
                selected.includes(alert.id)
                  ? selected.filter((s) => s !== alert.id)
                  : [...selected, alert.id],
              )
            }
            style={{ borderTop: '1px solid #eee', padding: '0.4rem 0' }}
          />
        ))}
      </div>
    </main>
  );
}

export function AlertsTimelinePage() {
  return (
    <FilterProvider>
      <Timeline />
    </FilterProvider>
  );
}
