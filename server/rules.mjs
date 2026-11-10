import { createServer } from 'node:http';

let rules = [
  { id: 'r-1', name: 'Suspicious PowerShell', description: 'Encoded command line', severity: 'high',     riskScore: 73, query: 'process.name: "powershell.exe" and process.args: "-enc"', enabled: true },
  { id: 'r-2', name: 'Impossible travel',     description: 'Logins from distant geos', severity: 'medium', riskScore: 0,  query: 'event.action: "login"', enabled: true },
  { id: 'r-3', name: 'Root shell spawned',    description: '',                       severity: 'critical', riskScore: 100, query: 'user.name: "root" and process.name: "bash"', enabled: false },
  { id: 'r-4', name: 'Legacy rule',           description: 'Kept for reference',     severity: 'low',    riskScore: 12, query: 'event.code: "4625"', enabled: false },
];

function send(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,OPTIONS',
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

const slow = () => new Promise((r) => setTimeout(r, 900));

const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost:3003');
  if (req.method === 'OPTIONS') return send(res, 204);

  if (req.method === 'GET' && url.pathname === '/api/rules') {
    return send(res, 200, rules);
  }

  const putMatch = url.pathname.match(/^\/api\/rules\/([^/]+)$/);
  if (req.method === 'PUT' && putMatch) {
    const body = await readBody(req);
    await slow();
    const rule = rules.find((r) => r.id === putMatch[1]);
    if (!rule) return send(res, 404, { message: 'not found' });
    if (!body.query) {
      return send(res, 200, { ok: false, message: 'query cannot be empty' });
    }
    Object.assign(rule, body);
    return send(res, 200, { ok: true, rule });
  }

  if (req.method === 'POST' && url.pathname === '/api/rules') {
    const rule = await readBody(req);
     if (!rule.query) {
      return send(res, 200, { ok: false, message: 'query cannot be empty' });
    }
   const ruleExists = rules.find((r) => r.id === rule.id);
    if(ruleExists){
      return send(res, 200, { ok: true, rule:ruleExists });
    }
    rules.push(rule);
    return send(res, 200, { ok: true, rule });
  }

  send(res, 404, { message: 'not found' });
});

server.listen(3003, () => console.log('rules api on http://localhost:3003'));
