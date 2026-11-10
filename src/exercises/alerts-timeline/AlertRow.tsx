import { memo, useEffect, useState } from 'react';
import type { Alert } from './types';

const API = 'http://localhost:3004';

type Props = {
  alert: Alert;
  expanded: boolean;
  selected: boolean;
  onToggleExpand: () => void;
  onToggleSelect: () => void;
  style: React.CSSProperties;
};

export const AlertRow = memo(function AlertRow({
  alert,
  expanded,
  selected,
  onToggleExpand,
  onToggleSelect,
  style,
}: Props) {
  const [detail, setDetail] = useState<string>('');

  useEffect(() => {
    if (!expanded) return;
    fetch(`${API}/api/alerts/${alert.id}/detail`)
      .then((res) => res.json())
      .then((d) => setDetail(d.detail));
  }, [expanded, alert.id]);

  return (
    <div style={style}>
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
        <input type="checkbox" checked={selected} onChange={onToggleSelect} />
        <div onClick={onToggleExpand} style={{ cursor: 'pointer', flex: 1 }}>
          <strong>{alert.ruleName}</strong> · {alert.severity} · {alert.host} ·{' '}
          {alert.riskScore} · {new Date(alert.at).toLocaleString()}
          {alert.reviewed && <span style={{ color: 'green' }}> reviewed</span>}
        </div>
      </div>
      {expanded && (
        <div style={{ paddingLeft: '2rem', fontSize: 12, color: '#555' }}>
          {detail || 'Loading…'}
        </div>
      )}
    </div>
  );
});
