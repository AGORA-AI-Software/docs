---
title: TypeScript SDK
description: Agora Public API TypeScript/JavaScript client — install, authenticate, and upload leads.
tags:
  - sdk
  - typescript
  - javascript
---

# TypeScript SDK

:fontawesome-brands-js: TypeScript/JavaScript client for the Agora Public API. Works in Node.js and any bundler that supports ES modules. [:fontawesome-brands-github: Source](https://github.com/AGORA-AI-Software/sdk/tree/main/sdks/typescript){ .md-button }

## Install

=== "npm"

    ```bash
    npm install @agora-ai/public-api
    ```

=== "yarn"

    ```bash
    yarn add @agora-ai/public-api
    ```

=== "pnpm"

    ```bash
    pnpm add @agora-ai/public-api
    ```

---

## Configuration

```typescript
import { Configuration } from "@agora-ai/public-api";

// Production
const config = new Configuration({
  basePath: "https://core.agoraai.tech/api/v1",
});

// Development
const config = new Configuration({
  basePath: "https://core-dev.agoraai.tech/api/v1",
});
```

---

## Authentication

```typescript
import { AuthenticationApi, Configuration } from "@agora-ai/public-api";

const auth = new AuthenticationApi(
  new Configuration({ basePath: "https://core.agoraai.tech/api/v1" })
);

const { accessToken } = await auth.loginWithApiKey({
  apiKeyTokenRequest: {
    apiKey: process.env.AGORA_API_KEY!, // (1)!
  },
});
```

1. Load from `process.env` — never embed secrets in source code or bundle them into client-side builds.

---

## Upload leads

### Single lead

```typescript
import { LeadsApi, Configuration } from "@agora-ai/public-api";

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
      company: "Example Co",
      title: "VP of Operations",
    }],
    complianceAcknowledged: true, // (3)!
  },
});

console.log(response.status);       // "accepted"
console.log(response.validCount);   // 1
console.log(response.invalidCount); // 0
```

1. Pass the string `accessToken` from the authentication step.
2. E.164 format preferred.
3. Must be `true`.

### Bulk upload

```typescript
const response = await leads.uploadLeads({
  leadUploadRequest: {
    campaignId: 1,
    leads: myLeadsArray, // (1)!
    skipDuplicates: true, // (2)!
    tags: ["source:api", "batch:june-2026"], // (3)!
    complianceAcknowledged: true,
  },
});
```

1. Any array of `LeadInput` objects. No hard limit documented — batch large uploads if you hit timeouts.
2. Default `true` — silently skips leads already in the campaign.
3. Arbitrary tags attached to all leads in this batch.

### Handle validation errors

```typescript
const response = await leads.uploadLeads({ leadUploadRequest: request });

if (response.invalidCount > 0) {
  for (const error of response.errors ?? []) {
    console.error(`Row ${error.row}: ${error.varField} — ${error.message}`); // (1)!
  }
}
```

1. `error.varField` is the field name that failed (e.g. `"phone"`). `error.row` is the 0-based index into your `leads` array.

---

## Error handling

```typescript
import { ResponseError } from "@agora-ai/public-api";

try {
  const response = await leads.uploadLeads({ leadUploadRequest: request });
} catch (err) {
  if (err instanceof ResponseError) {
    switch (err.response.status) {
      case 401: // (1)!
        console.error("Token expired — re-exchange your API key");
        break;
      case 403: // (2)!
        console.error("Not authorised for this campaign");
        break;
      case 422: // (3)!
        const body = await err.response.json();
        console.error("Validation error:", body);
        break;
      default:
        throw err;
    }
  }
}
```

1. Re-run `loginWithApiKey` to obtain a fresh token, then retry.
2. Verify the API key's organisation has access to the target `campaignId`.
3. The response body contains a structured error object.

---

## Reference

| Export | Description |
|---|---|
| `AuthenticationApi` | Token exchange |
| `LeadsApi` | Lead upload |
| `Configuration` | Client configuration |
| `LeadInput` | Per-lead fields |
| `LeadUploadRequest` | Upload request body |
| `LeadUploadResponse` | Upload response |
| `ApiKeyTokenRequest` | Token request body |
| `ApiKeyTokenResponse` | Token response |

Full model schemas → [Models Reference](reference.md)
