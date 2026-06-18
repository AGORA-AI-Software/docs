---
title: Webhook REST API
description: Public REST API for querying webhook configuration and delivery health. Dashboard-only actions like creating or deleting endpoints are managed through the Agora UI.
tags:
  - webhooks
  - reference
---

# Webhook REST API

All paths are under `/api/v1`. Authentication requires a Bearer JWT obtained by exchanging an API key — see [Quick Start](../sdk/quickstart.md).

!!! tip "Try it interactively"
    These endpoints are available in the [interactive API reference](../api/index.md). Expand any operation and click **Try it out** to make live requests against production.

## Public endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/webhooks/{campaign_id}/events` | List all subscribable event type strings |
| `GET` | `/webhooks/{campaign_id}/endpoints` | List configured endpoints for a campaign |
| `GET` | `/webhooks/{campaign_id}/endpoints/{eid}/health` | Delivery health snapshot for an endpoint |

### List event types

Returns the full set of event type strings you can subscribe to when configuring an endpoint in the dashboard.

=== "curl"

    ```bash
    curl -sS https://core.agoraai.tech/api/v1/webhooks/$CAMPAIGN_ID/events \
      -H "Authorization: Bearer $TOKEN"
    ```

=== "Restish"

    ```bash
    restish agora list-webhook-event-types $CAMPAIGN_ID
    ```

=== "Python"

    ```python
    hooks = webhooks_api.WebhooksApi(client)
    event_types = hooks.list_webhook_event_types(campaign_id=1)
    ```

**Response**

```json
[
  "lead.created",
  "leads.bulk_created",
  "lead.status_changed",
  "lead.converted",
  "call.started",
  "call.completed",
  "form.submitted"
]
```

---

### List endpoints

Returns all webhook endpoints configured on a campaign. Signing secrets are never included.

=== "curl"

    ```bash
    curl -sS https://core.agoraai.tech/api/v1/webhooks/$CAMPAIGN_ID/endpoints \
      -H "Authorization: Bearer $TOKEN"
    ```

=== "Restish"

    ```bash
    restish agora list-webhook-endpoints $CAMPAIGN_ID
    ```

=== "Python"

    ```python
    endpoints = hooks.list_webhook_endpoints(campaign_id=1)
    for ep in endpoints:
        print(ep.url, ep.subscribed_events, ep.is_enabled)
    ```

**Response schema**

| Field | Type | Description |
|---|---|---|
| `id` | integer | Endpoint ID |
| `campaign_id` | integer | |
| `url` | string | Destination URL |
| `description` | string \| null | Optional label |
| `subscribed_events` | string[] | Event types subscribed |
| `is_enabled` | boolean | Whether deliveries are active |
| `created_at` | datetime | |
| `last_delivery_is_successful` | boolean \| null | Outcome of most recent delivery |

---

### Get endpoint health

Returns a delivery health snapshot for a single endpoint. Use this in monitoring or alerting pipelines to detect degraded integrations.

=== "curl"

    ```bash
    curl -sS \
      https://core.agoraai.tech/api/v1/webhooks/$CAMPAIGN_ID/endpoints/$ENDPOINT_ID/health \
      -H "Authorization: Bearer $TOKEN"
    ```

=== "Restish"

    ```bash
    restish agora get-webhook-endpoint-health $CAMPAIGN_ID $ENDPOINT_ID
    ```

=== "Python"

    ```python
    health = hooks.get_webhook_endpoint_health(campaign_id=1, endpoint_id=12)
    if health.success_rate and health.success_rate < 0.95:
        alert(f"Webhook {health.url} degraded: {health.success_rate:.1%}")
    ```

**Example response**

```json
{
  "endpoint_id": 12,
  "url": "https://hooks.example.com/agora",
  "is_enabled": true,
  "total_deliveries": 843,
  "successful_deliveries": 841,
  "failed_deliveries": 2,
  "success_rate": 0.9976,
  "last_delivery_at": "2026-06-17T14:22:01Z",
  "last_delivery_is_successful": true,
  "avg_duration_ms": 142.3
}
```

**Response schema**

| Field | Type | Description |
|---|---|---|
| `total_deliveries` | integer | All delivery attempts ever recorded |
| `successful_deliveries` | integer | Attempts that received 2xx within 10 s |
| `failed_deliveries` | integer | Timeouts and non-2xx responses |
| `success_rate` | float \| null | `successful / total` (0–1). Null if no deliveries yet |
| `last_delivery_at` | datetime \| null | Timestamp of most recent attempt |
| `last_delivery_is_successful` | boolean \| null | Outcome of most recent attempt |
| `avg_duration_ms` | float \| null | Mean round-trip time across all deliveries |

!!! tip "Alerting guidance"
    Alert on `success_rate < 0.95` or on `last_delivery_at` being stale relative to your expected event volume. A healthy endpoint at typical load should stay above 99%.

---

## Dashboard-only actions

The following actions are only available through the Agora dashboard and are not exposed in the public API:

| Action | Where |
|---|---|
| Create / delete an endpoint | Campaign → **Webhooks** tab → **+ Add Endpoint** |
| Update URL, events, or enabled state | Endpoint row → **Edit** |
| Send a test ping | Endpoint row → **Test** |
| View individual delivery logs | Expand endpoint row → **Deliveries** sub-table |
| Redeliver a failed delivery | Delivery row → **↻** button |
| Rotate signing secret | Edit modal → **Regenerate Secret** |
