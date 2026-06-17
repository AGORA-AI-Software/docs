---
title: Models Reference
description: Complete schema reference for all Agora API request and response models.
tags:
  - sdk
  - reference
---

# Models Reference

Complete schema for every request and response model in the Agora Public API.

---

## LeadInput

A single lead record to upload.

| Field | Type | Required | Description |
|---|---|---|---|
| `phone` | `string` | **Yes** | Phone number — E.164 preferred (e.g. `+15551234567`) |
| `first_name` | `string` | No | First name |
| `last_name` | `string` | No | Last name |
| `email` | `string` | No | Email address |
| `company` | `string` | No | Company name |
| `title` | `string` | No | Job title |

!!! example "Minimal lead"
    Only `phone` is required:
    ```json
    { "phone": "+15551234567" }
    ```

!!! example "Full lead"
    ```json
    {
      "first_name": "Jane",
      "last_name": "Doe",
      "email": "jane.doe@example.com",
      "phone": "+15551234567",
      "company": "Example Co",
      "title": "VP of Operations"
    }
    ```

---

## LeadUploadRequest

The body of a `POST /leads/upload` request.

| Field | Type | Required | Default | Description |
|---|---|---|---|---|
| `campaign_id` | `integer` | **Yes** | — | Target campaign ID |
| `leads` | `LeadInput[]` | **Yes** | — | Array of leads to upload |
| `compliance_acknowledged` | `boolean` | **Yes** | — | Must be `true` to confirm upload permission |
| `source` | `string` | No | `"api"` | Upload source label |
| `tags` | `string[]` | No | `[]` | Arbitrary tags applied to all leads in this batch |
| `skip_duplicates` | `boolean` | No | `true` | When `true`, silently skips leads already in the campaign |
| `disclaimer_version` | `string` | No | `"v1.0"` | Compliance disclaimer version acknowledged |

!!! warning "`compliance_acknowledged` is required"
    This field must be `true` on every request. It represents your confirmation that you have legal permission to upload these contacts (TCPA, GDPR, etc.). Requests with `false` or a missing value are rejected.

---

## LeadUploadResponse

Returned by a successful `POST /leads/upload` (HTTP `202 Accepted`).

| Field | Type | Description |
|---|---|---|
| `status` | `string` | Upload status — typically `"accepted"` |
| `import_id` | `string` | Unique ID for this import batch |
| `received_count` | `integer` | Total leads received in the request |
| `valid_count` | `integer` | Leads that passed validation and were queued |
| `invalid_count` | `integer` | Leads that failed validation — see `errors` |
| `errors` | `LeadUploadError[]` | Per-row validation errors |

!!! example
    ```json
    {
      "status": "accepted",
      "import_id": "imp_abc123",
      "received_count": 3,
      "valid_count": 2,
      "invalid_count": 1,
      "errors": [
        { "row": 2, "var_field": "phone", "message": "invalid phone number format" }
      ]
    }
    ```

---

## LeadUploadError

A per-row validation error within a `LeadUploadResponse`.

| Field | Type | Description |
|---|---|---|
| `row` | `integer` | 0-based index of the failing lead in the request `leads` array |
| `var_field` | `string` | The field that failed validation (e.g. `"phone"`, `"email"`) |
| `message` | `string` | Human-readable description of the error |

---

## ApiKeyTokenRequest

The body of a `POST /auth/api-key/token` request.

| Field | Type | Required | Description |
|---|---|---|---|
| `api_key` | `string` | **Yes** | Your Agora API key — never log or persist this |

!!! danger "Security"
    Your API key is a long-lived credential. Only ever send it to the `/auth/api-key/token` endpoint. Never log it, embed it in client-side code, or commit it to version control.

---

## ApiKeyTokenResponse

Returned by a successful `POST /auth/api-key/token`.

| Field | Type | Description |
|---|---|---|
| `access_token` | `string` | Short-lived bearer JWT — use as `Authorization: Bearer <token>` |
| `token_type` | `string` | Always `"bearer"` |
| `expires_in` | `integer` | Seconds until the token expires |

!!! tip "Re-exchange before expiry"
    Store `expires_in` and proactively re-exchange your API key before the token expires to avoid `401` errors mid-operation.

---

## ErrorResponse

Returned on `4xx` errors.

| Field | Type | Description |
|---|---|---|
| `error` | `string` | Machine-readable error code |
| `message` | `string` | Human-readable description |

!!! example
    ```json
    {
      "error": "unauthorized",
      "message": "Missing, invalid, or expired bearer token"
    }
    ```

---

## HTTP status codes

| Code | Meaning | Common cause |
|---|---|---|
| `200` | OK | Token exchange succeeded |
| `202` | Accepted | Lead upload queued |
| `400` | Bad Request | Invalid `campaign_id` or missing required fields |
| `401` | Unauthorized | Missing, invalid, or expired bearer token |
| `403` | Forbidden | Token not authorised for the target campaign |
| `422` | Unprocessable Entity | Lead payload failed structured validation |
