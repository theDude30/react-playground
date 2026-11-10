import { createServer } from 'node:http';

const RULES = [
  'Suspicious PowerShell', 'Impossible travel', 'Root shell spawned',
  'Credential dumping', 'Unusual parent process', 'Port scan detected',
  'Anomalous data transfer', 'Disabled security tool',
];
const SEVERITIES = ['low', 'medium', 'high', 'critical'];
const HOSTS = ['db-primary-01', 'build-agent-14', 'payments-worker', 'jump-host-2', 'laptop-dl-93'];

function build(n) {
  const out = [];
  const now = Date.now();
  for (let i = 0; i < n; i++) {
    out.push({
      id: `a-${i}`,
      ruleName: RULES[i % RULES.length],
      severity: SEVERITIES[i % SEVERITIES.length],
      host: HOSTS[i % HOSTS.length],
      riskScore: (i * 7) % 101,
      at: new Date(now - i * 60_000).toISOString(),
      reviewed: i % 23 === 0,
      detail: `Matched on event ${i}. Parent process explorer.exe, user svc-${i % 17}.`,
    });
  }
  return out;
}

const alerts = build(5000);

function send(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  });
  res.end(body === undefined ? '' : JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (c) => (raw += c));
    req.on('end', () => resolve(raw ? JSON.parse(raw) : {}));
  });
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost:3004');
  if (req.method === 'OPTIONS') return send(res, 204);

  if (req.method === 'GET' && url.pathname === '/api/alerts') {
    return send(res, 200, alerts);
  }

  const detailMatch = url.pathname.match(/^\/api\/alerts\/([^/]+)\/detail$/);
  if (req.method === 'GET' && detailMatch) {
    await new Promise((r) => setTimeout(r, 400));
    const alert = alerts.find((a) => a.id === detailMatch[1]);
    if (!alert) return send(res, 404, { message: 'not found' });
    return send(res, 200, { id: alert.id, detail: alert.detail });
  }

  if (req.method === 'POST' && url.pathname === '/api/alerts/review') {
    const body = await readBody(req);
    for (const id of body.ids || []) {
      const alert = alerts.find((a) => a.id === id);
      if (alert) alert.reviewed = true;
    }
    return send(res, 200, { ok: true, count: (body.ids || []).length });
  }

  send(res, 404, { message: 'not found' });
});

server.listen(3004, () => console.log('alerts api on http://localhost:3004 (5000 alerts)'));
