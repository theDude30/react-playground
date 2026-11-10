import { createServer } from 'node:http';

const USERS = ['d.levi', 'o.katz', 'unassigned'];

let theCase = {
  id: 'case-42',
  title: 'Repeated failed logins from unusual geo',
  status: 'open',
  assignee: 'd.levi',
  severity: 'high',
  createdAt: '2026-09-21T08:14:00.000Z',
};

let comments = [
  { id: 'c-1', author: 'd.levi', at: '2026-09-21T08:20:00.000Z', body: 'Pulled the source IPs — three ASNs, all residential proxies.' },
  { id: 'c-2', author: 'o.katz', at: '2026-09-21T09:02:00.000Z', body: 'Confirmed with the identity team, MFA was not satisfied on any of them.' },
  { id: 'c-3', author: 'd.levi', at: '2026-09-22T11:47:00.000Z', body: 'Blocked the ranges at the edge. Watching for a retry.' },
  { id: 'c-4', author: 'o.katz', at: '2026-09-24T07:30:00.000Z', body: 'No further attempts in 48h. Proposing we close.' },
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
  const url = new URL(req.url, 'http://localhost:3005');
  if (req.method === 'OPTIONS') return send(res, 204);

  if (req.method === 'GET' && url.pathname === '/api/case') {
    return send(res, 200, { case: theCase, comments, users: USERS });
  }

  if (req.method === 'PATCH' && url.pathname === '/api/case') {
    const body = await readBody(req);
    await slow(700);
    if (body.status && theCase.status === 'closed' && body.status === 'open') {
      return send(res, 409, { message: 'reopen a closed case through the reopen flow' });
    }
    Object.assign(theCase, body);
    return send(res, 200, { case: theCase });
  }

  if (req.method === 'POST' && url.pathname === '/api/comments') {
    const body = await readBody(req);
    await slow(500);
    const comment = {
      id: `c-${comments.length + 1}`,
      author: 'd.levi',
      at: new Date().toISOString(),
      body: body.body,
    };
    comments.push(comment);
    return send(res, 200, { comment });
  }

  const del = url.pathname.match(/^\/api\/comments\/([^/]+)$/);
  if (req.method === 'DELETE' && del) {
    comments = comments.filter((c) => c.id !== del[1]);
    return send(res, 204);
  }

  send(res, 404, { message: 'not found' });
});

server.listen(3005, () => console.log('cases api on http://localhost:3005'));
