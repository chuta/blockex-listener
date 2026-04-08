import Fastify from 'fastify';

const app = Fastify({ logger: true });

const KEY = (process.env.SENDGRID_WEBHOOK_VERIFICATION_KEY || '').trim();
const DEPOSIT_URL = (process.env.DEPOSIT_LISTENER_URL || '').trim();
const WITHDRAWAL_URL = (process.env.WITHDRAWAL_LISTENER_URL || '').trim();

if (!KEY) throw new Error('Missing env: SENDGRID_WEBHOOK_VERIFICATION_KEY');
if (!DEPOSIT_URL) throw new Error('Missing env: DEPOSIT_LISTENER_URL');
if (!WITHDRAWAL_URL) throw new Error('Missing env: WITHDRAWAL_LISTENER_URL');

async function forward(request, reply, targetUrl) {
  const contentType = request.headers['content-type'] || 'application/octet-stream';
  const userAgent = request.headers['user-agent'] || 'blockex-listener/1.0';

  const res = await fetch(targetUrl, {
    method: 'POST',
    headers: {
      'content-type': contentType,
      'user-agent': userAgent,
      'x-webhook-key': KEY,
    },
    body: request.raw,
  });

  const text = await res.text();
  reply
    .code(res.status)
    .header('content-type', res.headers.get('content-type') || 'text/plain')
    .send(text);
}

app.get('/healthz', async () => ({ ok: true }));

// SendGrid Inbound Parse targets
app.post('/inbound/deposit', async (request, reply) => forward(request, reply, DEPOSIT_URL));
app.post('/inbound/withdrawal', async (request, reply) => forward(request, reply, WITHDRAWAL_URL));

app.listen({ host: '0.0.0.0', port: Number(process.env.PORT || 8080) });

