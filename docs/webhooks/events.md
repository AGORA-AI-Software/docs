# Event Reference

## Request headers

Every Agora webhook POST includes:

| Header | Example | Description |
|---|---|---|
| `Content-Type` | `application/json` | Always JSON |
| `X-Agora-Signature-256` | `sha256=abc123…` | HMAC-SHA256 of the raw body, signed with your endpoint secret |
| `X-Agora-Event` | `lead.created` | The event type that triggered this delivery |
| `X-Agora-Delivery` | `42-1-1718900000` | Unique delivery identifier: `{endpoint_id}-{attempt}-{unix_ts}` |

## Event types

| Event | Trigger |
|---|---|
| `lead.created` | A single new lead is added to the campaign |
| `leads.bulk_created` | Multiple leads are created in one API call or CSV upload — fires once with the full list |
| `lead.status_changed` | A lead's pipeline status changes |
| `lead.converted` | A lead is marked as converted |
| `call.started` | An outbound call is answered (status `in-progress`) |
| `call.completed` | An outbound call ends |
| `form.submitted` | A form submission is received |
| `ping` | Manual test delivery sent from the dashboard or API |

## Payload shapes

### `lead.created`

Fires when a single lead is added individually.

```json
{
  "event": "lead.created",
  "campaign_id": 7,
  "lead_id": 1234,
  "contact_id": 5678,
  "timestamp": "2026-06-12T20:00:00Z"
}
```

### `leads.bulk_created`

Fires once when multiple leads are created in a single API call or CSV upload. Never fires alongside individual `lead.created` events for the same batch.

```json
{
  "event": "leads.bulk_created",
  "campaign_id": 7,
  "count": 10,
  "leads": [
    { "lead_id": 1234, "contact_id": 5678 },
    { "lead_id": 1235, "contact_id": 5679 }
  ],
  "timestamp": "2026-06-12T20:00:00Z"
}
```

### All other events

```json
{
  "event": "lead.status_changed",
  "campaign_id": 7,
  "timestamp": "2026-06-12T20:00:00Z",
  "...event-specific fields...": "..."
}
```

## Delivery behavior

| Property | Value |
|---|---|
| Method | `POST` |
| Timeout | 10 seconds |
| Automatic retry | Once, on non-2xx or timeout — live events only |
| Manual redeliver | One attempt, no automatic retry |
| Test ping | One attempt, no automatic retry |
| Max response body stored | 4 096 bytes |
| Retry delivery ID | Stored in `redelivery_of_id` on the second attempt of a live event |

### Why retry once and not more

Webhook consumers are expected to return `200 OK` quickly and handle processing asynchronously. A transient network hiccup, a brief cold-start delay, or a momentary 5xx from your server should be recoverable from a single retry. Multiple automatic retries introduce exponential backoff complexity, delivery ordering problems, and risk flooding your server during an outage. If you need guaranteed delivery after repeated failures, use the **Redeliver** button or API to manually replay specific deliveries once your server is healthy.

### Delivery ordering

Agora does not guarantee strict delivery ordering. Two events that fire within milliseconds of each other may arrive in either order at your server. Design your handler to be order-independent: apply status updates based on timestamps in the payload rather than assuming the most recently received event is the most recent state change.
