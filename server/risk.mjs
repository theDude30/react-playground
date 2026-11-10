import { createServer } from 'node:http';

const ENTITIES = [
  { id: 'e-1', name: 'svc-deploy-bot', criticality: 'high' },
  { id: 'e-2', name: 'db-primary-01',  criticality: 'extreme' },
  { id: 'e-3', name: 'd.levi',         criticality: 'medium' },
];

const WEIGHT = { low: 0.6, medium: 1, high: 1.4, extreme: 1.8 };
const BASE = { 'e-1': 52, 'e-2': 44, 'e-3': 31 };

function history(id) {
  const out = [];
  const now = Date.now();
  for (let d = 29; d >= 0; d--) {
    if (d % 7 === 3) continue;               // deliberate gaps
    out.push({
      at: new Date(now - d * 86400000).toISOString().slice(0, 10),
      score: Math.round(BASE[id] * WEIGHT[ENTITIES.find((e) => e.id === id).criticality] * (0.9 + ((d * 7) % 20) / 100)),
    });
  }
  return out;
}

function score(id) {
  const entity = ENTITIES.find((e) => e.id === id);
  return Math.min(100, Math.round(BASE[id] * WEIGHT[entity.criticality]));
}

function send(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,PATCH,OPTIONS',
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

const slow = (ms) => new Promise((r) => setTimeout(r, ms));
let calls = 0;

const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost:3007');
  if (req.method === 'OPTIONS') return send(res, 204);

  if (req.method === 'GET' && url.pathname === '/api/entities') {
    return send(res, 200, ENTITIES);
  }

  const scoreMatch = url.pathname.match(/^\/api\/entities\/([^/]+)\/score$/);
  if (req.method === 'GET' && scoreMatch) {
    const id = scoreMatch[1];
    // e-1 is deliberately slower than the others
    await slow(id === 'e-1' ? 1400 : 250);
    const entity = ENTITIES.find((e) => e.id === id);
    if (!entity) return send(res, 404, { message: 'not found' });
    return send(res, 200, { id, score: score(id), criticality: entity.criticality, history: history(id) });
  }

  const alertsMatch = url.pathname.match(/^\/api\/entities\/([^/]+)\/alerts$/);
  if (req.method === 'GET' && alertsMatch) {
    await slow(400);
    calls++;
    if (calls % 3 === 0) return send(res, 503, { message: 'alerts service unavailable' });
    return send(res, 200, [
      { id: 'a-1', ruleName: 'Credential dumping', severity: 'critical', at: new Date().toISOString() },
      { id: 'a-2', ruleName: 'Impossible travel', severity: 'high', at: new Date().toISOString() },
    ]);
  }

  const critMatch = url.pathname.match(/^\/api\/entities\/([^/]+)\/criticality$/);
  if (req.method === 'PATCH' && critMatch) {
    const body = await readBody(req);
    const entity = ENTITIES.find((e) => e.id === critMatch[1]);
    if (!entity) return send(res, 404, { message: 'not found' });
    if (!WEIGHT[body.criticality]) return send(res, 400, { message: 'unknown criticality' });
    await slow(1500);
    entity.criticality = body.criticality;
    return send(res, 200, { id: entity.id, criticality: entity.criticality, score: score(entity.id) });
  }

  send(res, 404, { message: 'not found' });
});

server.listen(3007, () => console.log('risk api on http://localhost:3007'));
