# How to Rotate Your Webhook Secret

In the campaign's **Webhooks** tab, click **Edit** on the endpoint, then click **Regenerate Secret** at the bottom of the form. A confirmation dialog warns that the current secret stops working immediately. After confirming, the new secret is shown once — copy it before closing.

## Zero-downtime rotation

1. Click **Regenerate Secret** and copy the new value.
2. Update your server to accept signatures from **both** the old and new secret.
3. Once your server is deployed, remove the old secret from your validation logic.

## Via the API

```
POST /api/v1/campaigns/{campaign_id}/webhooks/endpoints/{endpoint_id}/regenerate-secret
Authorization: Bearer <token>
```

Response:

```json
{ "secret": "new_hex_secret_here" }
```

The new secret takes effect immediately on the server. Any in-flight deliveries that were signed with the old secret will fail validation on your side until you complete the cutover.
