---
title: Quick Start
description: Exchange an API key for a bearer token and upload your first lead in under 5 minutes.
tags:
  - sdk
  - tutorial
---

# Quick Start

Upload your first lead in under 5 minutes.

## Prerequisites

- [x] An Agora API key (`agora_live_…` for production or `agora_test_…` for development)
- [x] A campaign ID to upload leads into — visible in the Agora dashboard URL

## Step 1 — Exchange your API key for a bearer token

Your API key is a long-lived secret. Exchange it for a short-lived JWT to use on all subsequent requests.

=== ":material-console: curl"

    ```bash
    curl -sS -X POST https://core.agoraai.tech/api/v1/auth/api-key/token \
      -H 'Content-Type: application/json' \
      -d '{"api_key":"agora_live_REDACTED"}' # (1)!
    ```

    1. Replace `agora_live_REDACTED` with your actual API key. This is the **only** endpoint that accepts your API key directly.

    The response:

    ```json
    {
      "access_token": "eyJ...", // (1)!
      "token_type": "bearer",
      "expires_in": 3600
    }
    ```

    1. Copy this value. Set it as an environment variable for the next step:
       ```bash
       export AGORA_TOKEN='eyJ...'
       ```

=== ":fontawesome-brands-python: Python"

    ```python
    import agora_public_api
    from agora_public_api.models.api_key_token_request import ApiKeyTokenRequest

    configuration = agora_public_api.Configuration( # (1)!
        host="https://core.agoraai.tech/api/v1"
    )

    with agora_public_api.ApiClient(configuration) as client:
        auth = agora_public_api.AuthenticationApi(client)
        token = auth.login_with_api_key(
            ApiKeyTokenRequest(api_key="agora_live_REDACTED") # (2)!
        )
        print(token.access_token)
    ```

    1. Swap `host` for `https://core-dev.agoraai.tech/api/v1` to target the development environment.
    2. Load from `os.environ["AGORA_API_KEY"]` in production — never hard-code secrets.

=== ":fontawesome-brands-js: TypeScript"

    ```typescript
    import { AuthenticationApi, Configuration } from "@agora-ai/public-api";

    const auth = new AuthenticationApi(
      new Configuration({ basePath: "https://core.agoraai.tech/api/v1" }) // (1)!
    );

    const { accessToken } = await auth.loginWithApiKey({
      apiKeyTokenRequest: { apiKey: process.env.AGORA_API_KEY! }, // (2)!
    });

    console.log(accessToken);
    ```

    1. Change `basePath` to `https://core-dev.agoraai.tech/api/v1` for development.
    2. Always load secrets from environment variables, never from source code.

=== ":fontawesome-brands-java: Java"

    ```java
    ApiClient client = new ApiClient();
    client.setBasePath("https://core.agoraai.tech/api/v1"); // (1)!

    AuthenticationApi auth = new AuthenticationApi(client);
    ApiKeyTokenResponse token = auth.loginWithApiKey(
        new ApiKeyTokenRequest().apiKey(System.getenv("AGORA_API_KEY")) // (2)!
    );

    System.out.println(token.getAccessToken());
    ```

    1. Use `https://core-dev.agoraai.tech/api/v1` for the development environment.
    2. Load from environment variables or a secrets manager — never hard-code.

=== ":fontawesome-brands-golang: Go"

    ```go
    cfg := agora.NewConfiguration()
    cfg.Servers = agora.ServerConfigurations{
        {URL: "https://core.agoraai.tech/api/v1"}, // (1)!
    }
    client := agora.NewAPIClient(cfg)

    tokenResp, _, err := client.AuthenticationAPI.LoginWithApiKey(ctx).
        ApiKeyTokenRequest(agora.ApiKeyTokenRequest{
            ApiKey: os.Getenv("AGORA_API_KEY"), // (2)!
        }).Execute()
    if err != nil { panic(err) }

    fmt.Println(tokenResp.GetAccessToken())
    ```

    1. Change to `https://core-dev.agoraai.tech/api/v1` for development.
    2. Always source secrets from environment variables.

---

## Step 2 — Upload a lead

=== ":material-console: curl"

    ```bash
    curl -sS -X POST https://core.agoraai.tech/api/v1/leads/upload \
      -H "Authorization: Bearer $AGORA_TOKEN" \
      -H 'Content-Type: application/json' \
      -d '{
        "campaign_id": 1, // (1)!
        "leads": [{
          "first_name": "Jane",
          "last_name": "Doe",
          "email": "jane.doe@example.com",
          "phone": "+15551234567" // (2)!
        }],
        "compliance_acknowledged": true // (3)!
      }'
    ```

    1. Your campaign ID — visible in the Agora dashboard URL.
    2. E.164 format is preferred: `+` country code + number. Invalid formats may be rejected at validation.
    3. **Required.** Must be `true` to confirm you have permission to upload these contacts under applicable law (TCPA, GDPR, etc.).

=== ":fontawesome-brands-python: Python"

    ```python
    from agora_public_api.models.lead_upload_request import LeadUploadRequest
    from agora_public_api.models.lead_input import LeadInput

    # Re-use the configuration from Step 1, with the token set
    configuration.access_token = token.access_token

    with agora_public_api.ApiClient(configuration) as client:
        leads_api = agora_public_api.LeadsApi(client)
        response = leads_api.upload_leads(
            LeadUploadRequest(
                campaign_id=1, # (1)!
                leads=[LeadInput(
                    first_name="Jane",
                    last_name="Doe",
                    email="jane.doe@example.com",
                    phone="+15551234567", # (2)!
                )],
                compliance_acknowledged=True, # (3)!
            )
        )
        print(f"{response.valid_count} valid, {response.invalid_count} invalid")
    ```

    1. Your campaign ID from the Agora dashboard.
    2. E.164 format preferred.
    3. Must be `True` — confirms you have permission to upload these contacts.

=== ":fontawesome-brands-js: TypeScript"

    ```typescript
    import { LeadsApi } from "@agora-ai/public-api";

    const leads = new LeadsApi(
      new Configuration({
        basePath: "https://core.agoraai.tech/api/v1",
        accessToken, // (1)!
      })
    );

    const response = await leads.uploadLeads({
      leadUploadRequest: {
        campaignId: 1,
        leads: [{
          firstName: "Jane",
          lastName: "Doe",
          email: "jane.doe@example.com",
          phone: "+15551234567", // (2)!
        }],
        complianceAcknowledged: true, // (3)!
      },
    });

    console.log(`${response.validCount} valid, ${response.invalidCount} invalid`);
    ```

    1. The `accessToken` string from Step 1.
    2. E.164 format preferred.
    3. Must be `true` — confirms you have permission to upload these contacts.

=== ":fontawesome-brands-java: Java"

    ```java
    ((HttpBearerAuth) client.getAuthentication("bearerAuth"))
        .setBearerToken(token.getAccessToken()); // (1)!

    LeadsApi leadsApi = new LeadsApi(client);
    LeadUploadResponse response = leadsApi.uploadLeads(
        new LeadUploadRequest()
            .campaignId(1)
            .leads(List.of(
                new LeadInput()
                    .firstName("Jane")
                    .lastName("Doe")
                    .phone("+15551234567") // (2)!
            ))
            .complianceAcknowledged(true) // (3)!
    );

    System.out.printf("%d valid, %d invalid%n",
        response.getValidCount(), response.getInvalidCount());
    ```

    1. Set the bearer token on the same `client` instance from Step 1.
    2. E.164 format preferred.
    3. Must be `true`.

=== ":fontawesome-brands-golang: Go"

    ```go
    // Attach the token to context
    ctx = context.WithValue(ctx, agora.ContextAccessToken, tokenResp.GetAccessToken()) // (1)!

    phone := "+15551234567" // (2)!
    resp, _, err := client.LeadsAPI.UploadLeads(ctx).
        LeadUploadRequest(agora.LeadUploadRequest{
            CampaignId: 1,
            Leads:      []agora.LeadInput{{Phone: &phone}},
            ComplianceAcknowledged: true, // (3)!
        }).Execute()
    if err != nil { panic(err) }

    fmt.Printf("%d valid, %d invalid\n", resp.GetValidCount(), resp.GetInvalidCount())
    ```

    1. Pass the token via context — the SDK picks it up automatically on every call.
    2. Pointer required for optional string fields in Go.
    3. Must be `true`.

---

## Step 3 — Check the response

A successful upload returns HTTP `202 Accepted`:

```json
{
  "status": "accepted",
  "import_id": "imp_abc123", // (1)!
  "received_count": 1,
  "valid_count": 1,
  "invalid_count": 0,
  "errors": []
}
```

1. Save this `import_id` if you need to correlate the upload with campaign events later.

If `invalid_count > 0`, the `errors` array tells you exactly which rows failed and why. See [Models Reference](reference.md#leaduploaderror) for the error schema.

---

## Next steps

- [Upload leads in bulk](python.md#bulk-upload) — send thousands of leads in one request
- [Handle validation errors](reference.md#leaduploaderror) — per-row error schema
- [Webhooks](../webhooks/index.md) — receive real-time callbacks when leads are processed
