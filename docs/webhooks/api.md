---
title: Webhook REST API
description: REST API for managing webhook endpoints and replaying deliveries.
tags:
  - webhooks
  - reference
---

# Webhook REST API

!!! tip "Try it interactively"
    All webhook management endpoints are available in the [interactive API reference](../api/index.md). Expand any endpoint and click **Try it out** to make live requests.

All paths are under `/api/v1`. Authentication requires a Bearer JWT — see the [Quick Start](../sdk/quickstart.md) for how to obtain one.

## Endpoints

| Method | Path | Description |
|---|---|---|
| `GET` | `/campaigns/{id}/webhooks/events` | List all supported event type strings |
| `POST` | `/campaigns/{id}/webhooks/endpoints` | Create endpoint — returns secret **once** |
| `GET` | `/campaigns/{id}/webhooks/endpoints` | List endpoints |
| `PATCH` | `/campaigns/{id}/webhooks/endpoints/{eid}` | Update URL, description, events, or enabled state |
| `DELETE` | `/campaigns/{id}/webhooks/endpoints/{eid}` | Delete endpoint and all delivery history |
| `GET` | `/campaigns/{id}/webhooks/endpoints/{eid}/deliveries` | List delivery history (query params: `success`, `limit`) |
| `POST` | `/campaigns/{id}/webhooks/endpoints/{eid}/test` | Send a one-shot test ping (no retry) |
| `POST` | `/campaigns/{id}/webhooks/endpoints/{eid}/regenerate-secret` | Rotate the signing secret — returns new secret **once** |
| `POST` | `/campaigns/{id}/webhooks/deliveries/{did}/redeliver` | Redeliver a past delivery (one attempt, no retry) |

!!! info "Coming soon in the public API"
    Webhook management endpoints will be added to the public OpenAPI spec and Swagger UI in an upcoming release, enabling programmatic endpoint management via SDK and CLI in addition to the dashboard.

## Redeliver a failed delivery

Open the campaign's **Webhooks** tab and expand the endpoint row. The **Deliveries** sub-table shows all past attempts. Click the **↻** (redeliver) button on any row to fire a new delivery with the original payload.

A new delivery record is created; the original delivery is preserved unchanged.
