# Quick Start — Receive your first webhook delivery

This tutorial walks you through getting a live `ping` delivery to a test URL in under five minutes. You will learn how the full flow works: configure an endpoint, send a test ping, and inspect the signed payload.

**Prerequisites:** You are logged in as a Company Admin. You have access to a publicly reachable URL that can accept POST requests — [Webhook.site](https://webhook.site) works for testing.

## 1. Open the Webhooks tab

In the Company Admin dashboard, navigate to any campaign and click the **Webhooks** tab.

## 2. Add your endpoint

Click **Add Endpoint** and fill in:

- **URL** — your Webhook.site URL (e.g. `https://webhook.site/your-unique-id`)
- **Events** — tick at least one event. Subscribe to `lead.created` for individual lead additions, or `leads.bulk_created` for CSV and API batch uploads (a single upload of 10 leads fires one `leads.bulk_created`, not 10 `lead.created` events)
- **Description** — optional label shown in the dashboard

Click **Create**. A one-time secret appears — copy it now and store it somewhere safe. You will use it to verify signatures. It will not be shown again.

## 3. Send a test ping

Your new endpoint row now has a **Test** button. Click it. The button shows a spinner while the request is in flight, then shows either:

- ✅ **200 · 142ms** — your server received the request and returned a 2xx response
- ❌ **error** — the server was unreachable or returned a non-2xx status

Switch to your Webhook.site tab. You will see a POST request with:

```
X-Agora-Signature-256: sha256=<hex>
X-Agora-Event: ping
X-Agora-Delivery: <endpoint_id>-1-<timestamp>
Content-Type: application/json
```

```json
{
  "event": "ping",
  "message": "Test delivery from Agora — your endpoint is configured correctly.",
  "endpoint_id": 42,
  "campaign_id": 7
}
```

You have now confirmed end-to-end connectivity. The delivery is also recorded in the **Deliveries** panel under your endpoint row.

## 4. What happens next

From now on, whenever a subscribed event fires in this campaign, Agora will POST the same way — HMAC-signed, same headers, similar JSON structure. If delivery fails, one automatic retry is made. Both attempts are recorded in the Deliveries panel.
