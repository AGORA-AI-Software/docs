---
title: Python SDK
description: Agora Public API Python client — install, authenticate, upload leads, and handle errors.
tags:
  - sdk
  - python
---

# Python SDK

:fontawesome-brands-python: Python client for the Agora Public API.

## Install

```bash
pip install agora-public-api
```

!!! info "Requirements"
    Python 3.8 or higher.

## Configuration

```python
import agora_public_api

# Production
configuration = agora_public_api.Configuration(
    host="https://core.agoraai.tech/api/v1"
)

# Development
configuration = agora_public_api.Configuration(
    host="https://core-dev.agoraai.tech/api/v1"
)
```

---

## Authentication

```python
import agora_public_api
from agora_public_api.models.api_key_token_request import ApiKeyTokenRequest
import os

configuration = agora_public_api.Configuration(
    host="https://core.agoraai.tech/api/v1"
)

with agora_public_api.ApiClient(configuration) as client:
    auth = agora_public_api.AuthenticationApi(client)
    token = auth.login_with_api_key(
        ApiKeyTokenRequest(api_key=os.environ["AGORA_API_KEY"]) # (1)!
    )
    configuration.access_token = token.access_token # (2)!
```

1. Load from environment — never hard-code API keys.
2. Set once on the `configuration` object. Every subsequent `ApiClient` using this configuration will include the bearer token automatically.

---

## Upload leads

### Single lead

```python
from agora_public_api.models.lead_upload_request import LeadUploadRequest
from agora_public_api.models.lead_input import LeadInput

with agora_public_api.ApiClient(configuration) as client:
    leads_api = agora_public_api.LeadsApi(client)
    response = leads_api.upload_leads(
        LeadUploadRequest(
            campaign_id=1,
            leads=[LeadInput(
                first_name="Jane",
                last_name="Doe",
                email="jane.doe@example.com",
                phone="+15551234567", # (1)!
                company="Example Co",
                title="VP of Operations",
            )],
            compliance_acknowledged=True, # (2)!
        )
    )
    print(response.status)        # "accepted"
    print(response.valid_count)   # 1
    print(response.invalid_count) # 0
```

1. E.164 format preferred (`+` country code + number). Examples: `+15551234567`, `+447911123456`.
2. Must be `True` — confirms you have legal permission to upload these contacts.

### Bulk upload

```python
leads = [
    LeadInput(first_name="Jane", last_name="Doe",   phone="+15551234567"),
    LeadInput(first_name="John", last_name="Smith",  phone="+15559876543"),
    # ... up to the API limit
]

response = leads_api.upload_leads(
    LeadUploadRequest(
        campaign_id=1,
        leads=leads,
        skip_duplicates=True, # (1)!
        tags=["source:api", "batch:june-2026"], # (2)!
        compliance_acknowledged=True,
    )
)
```

1. When `True` (default), leads that already exist in the campaign are silently skipped rather than rejected.
2. Arbitrary string tags attached to all leads in this batch — useful for filtering in the dashboard.

### Handle validation errors

```python
response = leads_api.upload_leads(request)

if response.invalid_count > 0:
    for error in response.errors:
        print(f"Row {error.row}: {error.var_field} — {error.message}") # (1)!
```

1. `error.var_field` is the field name that failed validation (e.g. `"phone"`). `error.row` is the 0-based index into the `leads` array you submitted.

---

## Error handling

```python
from agora_public_api.exceptions import ApiException

try:
    response = leads_api.upload_leads(request)
except ApiException as e:
    if e.status == 401:
        print("Token expired — re-exchange your API key") # (1)!
    elif e.status == 403:
        print("Not authorised for this campaign") # (2)!
    elif e.status == 422:
        print(f"Validation error: {e.body}") # (3)!
    else:
        raise
```

1. Re-run the `login_with_api_key` call to get a fresh token, then retry.
2. Check that the API key's organisation has access to `campaign_id`.
3. The response body contains a structured error — log it for debugging.

---

## Reference

| Class | Description |
|---|---|
| [`AuthenticationApi`](#authenticationapi) | Token exchange |
| [`LeadsApi`](#leadsapi) | Lead upload |
| [`LeadInput`](reference.md#leadinput) | Per-lead fields |
| [`LeadUploadRequest`](reference.md#leaduploadrequest) | Upload request body |
| [`LeadUploadResponse`](reference.md#leaduploadresponse) | Upload response |
| [`ApiKeyTokenRequest`](reference.md#apikeytokenrequest) | Token request body |
| [`ApiKeyTokenResponse`](reference.md#apikeytokenresponse) | Token response |
| [`LeadUploadError`](reference.md#leaduploaderror) | Per-row validation error |

### AuthenticationApi

::: tip Source
`agora_public_api.AuthenticationApi`
:::

#### `login_with_api_key(api_key_token_request)`

Exchanges a long-lived API key for a short-lived bearer JWT.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `api_key_token_request` | `ApiKeyTokenRequest` | Yes | Body containing `api_key` |

**Returns:** `ApiKeyTokenResponse` with `access_token`, `token_type`, `expires_in`

**Raises:** `ApiException(401)` if the key is invalid, expired, or revoked.

---

### LeadsApi

::: tip Source
`agora_public_api.LeadsApi`
:::

#### `upload_leads(lead_upload_request)`

Uploads leads into a campaign. Processing goes through Agora's standard contact upload pipeline.

| Parameter | Type | Required | Description |
|---|---|---|---|
| `lead_upload_request` | `LeadUploadRequest` | Yes | Upload body |

**Returns:** `LeadUploadResponse`

**Raises:**

| Status | Meaning |
|---|---|
| `400` | Request validation failed (e.g. invalid `campaign_id`) |
| `401` | Missing, invalid, or expired bearer token |
| `403` | Token not authorised for this campaign |
| `422` | Lead payload failed structured validation |
