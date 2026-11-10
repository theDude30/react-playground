import { createServer } from 'node:http';

const RULES = [
  { id: 'r-1', name: 'Suspicious PowerShell', spaceId: 'ops' },
  { id: 'r-2', name: 'Credential dumping', spaceId: 'ops' },
  { id: 'r-3', name: 'Payment webhook failures', spaceId: 'billing' },
  { id: 'r-4', name: 'Fraud score spike', spaceId: 'security' },
];

let exceptions = [
  { id: 'e-1', name: 'Backup agent full-disk read', ruleId: 'r-1', spaceId: 'ops', enabled: true,  createdAt: '2026-09-25T10:00:00.000Z', expiresAt: null,                         conditions: [{ field: 'process.name', operator: 'is', value: 'backup-agent' }] },
  { id: 'e-2', name: 'CI runner credential access',  ruleId: 'r-2', spaceId: 'ops', enabled: true,  createdAt: '2026-09-20T09:00:00.000Z', expiresAt: '2026-09-27T00:00:00.000Z', conditions: [{ field: 'host.name', operator: 'is', value: 'build-agent-14' }] },
  { id: 'e-3', name: 'Jump host admin shell',        ruleId: 'r-1', spaceId: 'ops', enabled: false, createdAt: '2026-09-18T14:30:00.000Z', expiresAt: null,                         conditions: [{ field: 'host.name', operator: 'is', value: 'jump-host-2' }] },
  { id: 'e-4', name: 'Legacy payments retry',        ruleId: 'r-3', spaceId: 'billing', enabled: true, createdAt: '2026-09-22T11:00:00.000Z', expiresAt: '2026-10-30T00:00:00.000Z', conditions: [{ field: 'service.name', operator: 'is', value: 'payments-worker' }] },
];

function send(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
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

const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost:3006');
  if (req.method === 'OPTIONS') return send(res, 204);

  if (req.method === 'GET' && url.pathname === '/api/exceptions') {
    return send(res, 200, exceptions);
  }

  if (req.method === 'GET' && url.pathname === '/api/rules') {
    return send(res, 200, RULES);
  }

  if (req.method === 'POST' && url.pathname === '/api/exceptions') {
    const body = await readBody(req);
    await slow(600);
    if(body.conditions.length<1){
      return send(res, 400, { message: 'exception needs at least one condition' });
    }
    const exception = { id: `e-${exceptions.length + 1}`, createdAt: new Date().toISOString(), enabled: true, ...body };
    exceptions.push(exception);
    return send(res, 200, { ok: true, exception });
  }

  const patch = url.pathname.match(/^\/api\/exceptions\/([^/]+)$/);
  if (req.method === 'PATCH' && patch) {
    const body = await readBody(req);
    await slow(600);
    const exception = exceptions.find((e) => e.id === patch[1]);
    if (!exception) return send(res, 404, { message: 'not found' });
    if (body.enabled === false) {
      const siblings = exceptions.filter((e) => e.ruleId === exception.ruleId && e.enabled);
      if (siblings.length <= 1) {
        return send(res, 409, { message: 'cannot disable the only exception on a rule' });
      }
    }
    Object.assign(exception, body);
    return send(res, 200, { ok: true, exception });
  }

  const del = url.pathname.match(/^\/api\/exceptions\/([^/]+)$/);
  if (req.method === 'DELETE' && del) {
    exceptions = exceptions.filter((e) => e.id !== del[1]);
    return send(res, 204);
  }

  send(res, 404, { message: 'not found' });
});

server.listen(3006, () => console.log('exceptions api on http://localhost:3006'));
