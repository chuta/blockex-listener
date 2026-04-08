## blockex-listener

Small proxy for **SendGrid Inbound Parse** that injects `x-webhook-key` and forwards the request to the Netlify email listeners.

### Why
SendGrid Inbound Parse can’t set custom headers. Our Netlify listeners verify requests using:

- `SENDGRID_WEBHOOK_VERIFICATION_KEY` (env) compared against incoming `x-webhook-key` header

So we place this proxy in front to add that header.

### Endpoints
- `POST /inbound/deposit` → forwards to `DEPOSIT_LISTENER_URL`
- `POST /inbound/withdrawal` → forwards to `WITHDRAWAL_LISTENER_URL`
- `GET /healthz`

### Required env
- `SENDGRID_WEBHOOK_VERIFICATION_KEY` (same value configured in Netlify)
- `DEPOSIT_LISTENER_URL` (e.g. `https://blockex.trade/.netlify/functions/ngn-bank-deposit-listener`)
- `WITHDRAWAL_LISTENER_URL` (e.g. `https://blockex.trade/.netlify/functions/ngn-bank-withdrawal-listener`)
- `PORT` (optional; default `8080`)

### Local run

```bash
npm install
SENDGRID_WEBHOOK_VERIFICATION_KEY=... \
DEPOSIT_LISTENER_URL=... \
WITHDRAWAL_LISTENER_URL=... \
npm start
```

