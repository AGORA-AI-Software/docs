# Webhooks API Reference

All paths are under `/api/v1`. Authentication requires a Bearer JWT.

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

## Test from the command line

```bash
TOKEN="<your dev-login or Firebase JWT>"
CAMPAIGN_ID=1
ENDPOINT_ID=42

# Send a test ping
curl -s -X POST \
  "http://localhost:8000/api/v1/campaigns/$CAMPAIGN_ID/webhooks/endpoints/$ENDPOINT_ID/test" \
  -H "Authorization: Bearer $TOKEN" | jq .
```

## Redeliver a failed delivery

Open the campaign's **Webhooks** tab and expand the endpoint row. The **Deliveries** sub-table shows all past attempts. Click the **↻** (redeliver) button on any row to fire a new delivery with the original payload.

You can also redeliver via the API:

```
POST /api/v1/campaigns/{campaign_id}/webhooks/deliveries/{delivery_id}/redeliver
Authorization: Bearer <token>
```

A new delivery record is created; the original delivery is preserved unchanged.
