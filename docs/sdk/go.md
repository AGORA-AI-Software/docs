---
title: Go SDK
description: Agora Public API Go client — install, authenticate, and upload leads.
tags:
  - sdk
  - go
---

# Go SDK

:fontawesome-brands-golang: Go client for the Agora Public API.

!!! info "Requirements"
    Go 1.21 or higher.

## Install

```bash
go get github.com/AGORA-AI-Software/sdk/sdks/go@latest
```

---

## Configuration

```go
import agora "github.com/AGORA-AI-Software/sdk/sdks/go"

// Production
cfg := agora.NewConfiguration()
cfg.Servers = agora.ServerConfigurations{
    {URL: "https://core.agoraai.tech/api/v1"},
}

// Development
cfg := agora.NewConfiguration()
cfg.Servers = agora.ServerConfigurations{
    {URL: "https://core-dev.agoraai.tech/api/v1"},
}

client := agora.NewAPIClient(cfg)
```

---

## Authentication

```go
package main

import (
    "context"
    "fmt"
    "os"

    agora "github.com/AGORA-AI-Software/sdk/sdks/go"
)

func main() {
    cfg := agora.NewConfiguration()
    cfg.Servers = agora.ServerConfigurations{
        {URL: "https://core.agoraai.tech/api/v1"},
    }
    client := agora.NewAPIClient(cfg)
    ctx := context.Background()

    tokenResp, _, err := client.AuthenticationAPI.LoginWithApiKey(ctx).
        ApiKeyTokenRequest(agora.ApiKeyTokenRequest{
            ApiKey: os.Getenv("AGORA_API_KEY"), // (1)!
        }).Execute()
    if err != nil {
        panic(err)
    }

    // Attach token to context for all subsequent calls
    ctx = context.WithValue(ctx, agora.ContextAccessToken, tokenResp.GetAccessToken()) // (2)!
    fmt.Println("authenticated, token expires in", tokenResp.GetExpiresIn(), "seconds")
}
```

1. Load from environment — never hard-code secrets.
2. The SDK reads `ContextAccessToken` automatically on every authenticated call. Pass this `ctx` to every subsequent API call.

---

## Upload leads

### Single lead

```go
phone := "+15551234567" // (1)!

resp, httpResp, err := client.LeadsAPI.UploadLeads(ctx).
    LeadUploadRequest(agora.LeadUploadRequest{
        CampaignId: 1,
        Leads: []agora.LeadInput{
            {
                FirstName: agora.PtrString("Jane"), // (2)!
                LastName:  agora.PtrString("Doe"),
                Email:     agora.PtrString("jane.doe@example.com"),
                Phone:     &phone,
                Company:   agora.PtrString("Example Co"),
                Title:     agora.PtrString("VP of Operations"),
            },
        },
        ComplianceAcknowledged: true, // (3)!
    }).Execute()
if err != nil {
    panic(err)
}
_ = httpResp // (4)!

fmt.Printf("valid=%d invalid=%d\n", resp.GetValidCount(), resp.GetInvalidCount())
```

1. E.164 format preferred.
2. Optional string fields use `*string` — use `agora.PtrString()` or `&someVar` to pass a pointer.
3. Must be `true`.
4. `httpResp` is the raw `*http.Response` — useful for logging status codes or reading response headers.

### Bulk upload

```go
leads := []agora.LeadInput{
    {Phone: agora.PtrString("+15551234567")},
    {Phone: agora.PtrString("+15559876543")},
    // ...
}

skipDups := true
tags := []string{"source:api", "batch:june-2026"}

resp, _, err := client.LeadsAPI.UploadLeads(ctx).
    LeadUploadRequest(agora.LeadUploadRequest{
        CampaignId:             1,
        Leads:                  leads,
        SkipDuplicates:         &skipDups, // (1)!
        Tags:                   tags,
        ComplianceAcknowledged: true,
    }).Execute()
```

1. Pointer to bool — use `agora.PtrBool(true)` or `&boolVar`.

### Handle validation errors

```go
if resp.GetInvalidCount() > 0 {
    for _, e := range resp.GetErrors() {
        fmt.Printf("row %d: %s — %s\n", // (1)!
            e.GetRow(), e.GetVarField(), e.GetMessage())
    }
}
```

1. `GetVarField()` returns the field name that failed (e.g. `"phone"`). `GetRow()` is the 0-based index in your `Leads` slice.

---

## Error handling

```go
import "github.com/AGORA-AI-Software/sdk/sdks/go"

resp, httpResp, err := client.LeadsAPI.UploadLeads(ctx).
    LeadUploadRequest(request).Execute()

if err != nil {
    var apiErr *agora.GenericOpenAPIError
    if errors.As(err, &apiErr) {
        switch httpResp.StatusCode {
        case 401: // (1)!
            fmt.Println("token expired — re-exchange API key")
        case 403: // (2)!
            fmt.Println("not authorised for this campaign")
        case 422: // (3)!
            fmt.Printf("validation error: %s\n", apiErr.Body())
        default:
            panic(err)
        }
    }
}
```

1. Re-run `LoginWithApiKey` to get a fresh token, update `ctx`.
2. Confirm the key's organisation has access to the target `CampaignId`.
3. `apiErr.Body()` returns the raw response bytes.

---

## Reference

| Type | Description |
|---|---|
| `APIClient` | Top-level client with `.AuthenticationAPI` and `.LeadsAPI` |
| `AuthenticationAPI` | Token exchange |
| `LeadsAPI` | Lead upload |
| `LeadInput` | Per-lead fields |
| `LeadUploadRequest` | Upload request body |
| `LeadUploadResponse` | Upload response |
| `ApiKeyTokenRequest` | Token request body |
| `ApiKeyTokenResponse` | Token response |

Full model schemas → [Models Reference](reference.md)

Helper functions for pointer types: `PtrString(s)`, `PtrBool(b)`, `PtrInt32(n)`, `PtrFloat32(f)`.
