# How to Handle Duplicate Deliveries Idempotently

Under failure conditions (network error, your server returning 5xx) Agora retries live events once automatically. Your server may therefore receive the same logical event twice.

Build your handler to be idempotent. Suggested deduplication keys by event:

| Event | Deduplication key |
|---|---|
| `lead.created` | `campaign_id` + `lead_id` |
| `leads.bulk_created` | `campaign_id` + `timestamp` (the batch timestamp is unique per upload) |
| `lead.status_changed` | `campaign_id` + `lead_id` + `timestamp` |
| `lead.converted` | `campaign_id` + `lead_id` |
| `call.started` / `call.completed` | `campaign_id` + call identifier + `timestamp` |

On receipt, check whether you have already processed the key before acting. For `leads.bulk_created`, process the `leads` array as an upsert rather than a strict insert so duplicate deliveries of the same batch are safe.
