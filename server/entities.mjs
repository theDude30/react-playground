import { createServer } from 'node:http';

let entities = [
  { id: 'e-1', name: 'svc-deploy-bot',   kind: 'user', spaceId: 'ops',      riskScore: 91, acknowledged: false, protected: false, note: '' },
  { id: 'e-2', name: 'db-primary-01',    kind: 'host', spaceId: 'ops',      riskScore: 78, acknowledged: false, protected: true,  note: 'Escalated to platform team 2026-08-02.' },
  { id: 'e-3', name: 'd.levi',           kind: 'user', spaceId: 'ops',      riskScore: 65, acknowledged: false, protected: false, note: '' },
  { id: 'e-4', name: 'build-agent-14',   kind: 'host', spaceId: 'ops',      riskScore: 65, acknowledged: true,  protected: false, note: 'Known CI noise.' },
  { id: 'e-5', name: 'o.katz',           kind: 'user', spaceId: 'ops',      riskScore: 40, acknowledged: false, protected: false, note: '' },
  { id: 'e-6', name: 'payments-worker',  kind: 'host', spaceId: 'billing',  riskScore: 88, acknowledged: false, protected: true,  note: '' },
  { id: 'e-7', name: 'invoice-cron',     kind: 'host', spaceId: 'billing',  riskScore: 52, acknowledged: false, protected: false, note: '' },
  { id: 'e-8', name: 'root',             kind: 'user', spaceId: 'security', riskScore: 99, acknowledged: false, protected: false, note: '' },
];

function send(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,OPTIONS',
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
  const url = new URL(req.url, 'http://localhost:3002');
  if (req.method === 'OPTIONS') return send(res, 204);

  if (req.method === 'GET' && url.pathname === '/api/entities') {
    const space = url.searchParams.get('spaceId');
    const q = url.searchParams.get('q') || '';
    const found = entities.filter((e) => e.spaceId === space && e.name.includes(q));
    return send(res, 200, found);
  }

  const ackMatch = url.pathname.match(/^\/api\/entities\/([^/]+)\/ack$/);
  if (req.method === 'PATCH' && ackMatch) {
    const body = await readBody(req);
    const entity = entities.find((e) => e.id === ackMatch[1]);
    if (!entity) return send(res, 404, { message: 'not found' });
    if (entity.protected) return send(res, 403, { message: 'entity is protected' });
    entity.acknowledged = body.acknowledged;
    return send(res, 200, entity);
  }

  const noteMatch = url.pathname.match(/^\/api\/entities\/([^/]+)\/note$/);
  if (req.method === 'POST' && noteMatch) {
    const body = await readBody(req);
    const entity = entities.find((e) => e.id === noteMatch[1]);
    if (!entity) return send(res, 404, { message: 'not found' });
    entity.note = body.note;
    return send(res, 200, entity);
  }

  if (req.method === 'POST' && url.pathname === '/api/entities/ack_bulk') {
    const body = await readBody(req);
    const succeeded = [];
    const failed = [];
    for (const id of body.ids || []) {
      const entity = entities.find((e) => e.id === id);
      if (!entity) { failed.push({ id, reason: 'not found' }); continue; }
      if (entity.protected) { failed.push({ id, reason: 'protected' }); continue; }
      entity.acknowledged = true;
      succeeded.push(id);
    }
    return send(res, 200, { succeeded, failed });
  }

  send(res, 404, { message: 'not found' });
});

server.listen(3002, () => console.log('entities api on http://localhost:3002'));
