import { createServer } from 'node:http';

const owners = [
  { id: 'u-1', name: 'Dana Levi' },
  { id: 'u-2', name: 'Omer Katz' },
];

let rules = [
  { id: 'rule-1', name: 'CPU > 85%', spaceId: 'ops', ownerId: 'u-1', threshold: 85, muted: false, locked: false, deletedAt: null,claimedBy:null },
  { id: 'rule-2', name: 'Heap pressure', spaceId: 'ops', ownerId: 'u-2', threshold: 75, muted: true, locked: false, deletedAt: null,claimedBy:null },
  { id: 'rule-3', name: 'Disk usage > 90%', spaceId: 'ops', ownerId: 'u-1', threshold: 90, muted: false, locked: true, deletedAt: null,claimedBy:null },
  { id: 'rule-4', name: 'Ingest lag', spaceId: 'ops', ownerId: 'u-2', threshold: 300, muted: false, locked: false, deletedAt: null,claimedBy:null },
  { id: 'rule-5', name: 'Cert expiry', spaceId: 'ops', ownerId: 'u-1', threshold: 14, muted: false, locked: false, deletedAt: null,claimedBy:null },
  { id: 'rule-6', name: 'Payment webhook failures', spaceId: 'billing', ownerId: 'u-2', threshold: 5, muted: false, locked: false, deletedAt: null,claimedBy:null },
  { id: 'rule-7', name: 'Invoice job stalled', spaceId: 'billing', ownerId: 'u-1', threshold: 600, muted: true, locked: false, deletedAt: null,claimedBy:null },
  { id: 'rule-8', name: 'Fraud score spike', spaceId: 'security', ownerId: 'u-2', threshold: 40, muted: false, locked: false, deletedAt: null,claimedBy:null },
];

function findOwner(id) {
  return new Promise((resolve) =>
    setTimeout(() => resolve(owners.find((o) => o.id === id)), 120),
  );
}

function send(res, status, body) {
  res.writeHead(status, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type,X-User',
    'Access-Control-Allow-Methods': 'GET,PATCH,DELETE,OPTIONS',
  });
  res.end(body === undefined ? '' : JSON.stringify(body));
}

function readBody(req) {
  return new Promise((resolve) => {
    let raw = '';
    req.on('data', (chunk) => (raw += chunk));
    req.on('end', () => resolve(raw ? JSON.parse(raw) : {}));
  });
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, 'http://localhost:3001');

  if (req.method === 'OPTIONS') return send(res, 204);

  if (req.method === 'GET' && url.pathname === '/api/alert_rules') {
    try {
      const found = rules.filter((r) => r.spaceId === url.searchParams.get('spaceId') && !r.deletedAt);
      const out = [];
      for (const rule of found) {
        const owner = await findOwner(rule.ownerId);
        out.push({ ...rule, ownerName: owner.name });
      }
      return send(res, 200, out);
    } catch (e) {
      return send(res, 500, { message:e.message } );
    }
  }

  const muteMatch = url.pathname.match(/^\/api\/alert_rules\/([^/]+)\/mute$/);
  if (req.method === 'PATCH' && muteMatch) {
    const body = await readBody(req);
    if(typeof body.muted !=='boolean') {
      return send(res,400,{message:'muted variable need to be boolean'})
    }
    const rule = rules.find((r) => r.id === muteMatch[1]);
    if (!rule) return send(res, 404, { error: 'not found' });
    if (rule.locked) return send(res, 409, { error: 'rule is locked' });
    rule.muted = body.muted;
    return send(res, 200, rule);
  }

  const delMatch = url.pathname.match(/^\/api\/alert_rules\/([^/]+)$/);
  if (req.method === 'DELETE' && delMatch) {
    const claimedBy = req.headers['x-user'];
      if(!claimedBy){
        return send(res,401)
      }
    
    const deletedRule = rules.find((r) => r.id === delMatch[1]);
    if(deletedRule){
      deletedRule.deletedAt=new Date().getTime();
      deletedRule.claimedBy=claimedBy;      
      return send(res, 200,{message: "Item deleted successfully", "id": deletedRule.id});
    }
    else{
      return send(res,404,{message:"rule not found",id: delMatch[1]})
    }
  }

  send(res, 404, { error: 'not found' });
});

server.listen(3001, () => console.log('alert-rules api on http://localhost:3001'));
