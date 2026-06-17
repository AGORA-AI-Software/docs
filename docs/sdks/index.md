# SDKs

Agora provides generated API clients for four languages. All SDKs authenticate with an API key exchanged for a short-lived bearer token, then use that token to call the public API.

**Interactive API reference → [core.agoraai.tech/api-docs](https://core.agoraai.tech/api-docs)**

---

## Python

```bash
pip install agora-public-api
```

Requires Python 3.8+.

```python
import agora_public_api
from agora_public_api.api import authentication_api, leads_api
from agora_public_api.model.api_key_token_request import ApiKeyTokenRequest
from agora_public_api.model.lead_upload_request import LeadUploadRequest
from agora_public_api.model.lead_input import LeadInput

configuration = agora_public_api.Configuration(
    host="https://core.agoraai.tech/api/v1"
)

with agora_public_api.ApiClient(configuration) as client:
    auth = authentication_api.AuthenticationApi(client)
    token_response = auth.login_with_api_key(
        ApiKeyTokenRequest(api_key="agora_live_YOUR_KEY")
    )
    configuration.access_token = token_response.access_token

    leads = leads_api.LeadsApi(client)
    response = leads.upload_leads(
        LeadUploadRequest(
            campaign_id=1,
            leads=[LeadInput(
                first_name="Jane",
                last_name="Doe",
                email="jane.doe@example.com",
                phone="+15551234567",
            )],
            compliance_acknowledged=True,
        )
    )
```

[Full Python SDK docs →](https://github.com/AGORA-AI-Software/sdk/tree/main/sdks/python)

---

## TypeScript / JavaScript

```bash
npm install @agora-ai/public-api
# or
yarn add @agora-ai/public-api
```

```typescript
import { AuthenticationApi, LeadsApi, Configuration } from "@agora-ai/public-api";

const config = new Configuration({ basePath: "https://core.agoraai.tech/api/v1" });

const auth = new AuthenticationApi(config);
const { accessToken } = await auth.loginWithApiKey({
  apiKeyTokenRequest: { apiKey: "agora_live_YOUR_KEY" },
});

const leads = new LeadsApi(
  new Configuration({ basePath: "https://core.agoraai.tech/api/v1", accessToken })
);

const response = await leads.uploadLeads({
  leadUploadRequest: {
    campaignId: 1,
    leads: [{ firstName: "Jane", lastName: "Doe", phone: "+15551234567" }],
    complianceAcknowledged: true,
  },
});
```

[Full TypeScript SDK docs →](https://github.com/AGORA-AI-Software/sdk/tree/main/sdks/typescript)

---

## Java

```xml
<!-- Maven -->
<dependency>
  <groupId>ai.agora</groupId>
  <artifactId>agora-public-api</artifactId>
</dependency>
```

```groovy
// Gradle
implementation 'ai.agora:agora-public-api'
```

[Full Java SDK docs →](https://github.com/AGORA-AI-Software/sdk/tree/main/sdks/java)

---

## Go

```bash
go get github.com/AGORA-AI-Software/sdk/sdks/go
```

[Full Go SDK docs →](https://github.com/AGORA-AI-Software/sdk/tree/main/sdks/go)

---

## Environments

| Environment | Base URL |
|---|---|
| Production | `https://core.agoraai.tech/api/v1` |
| Development | `https://core-dev.agoraai.tech/api/v1` |

## Authentication

All SDK calls require a bearer token obtained by exchanging your API key:

```
POST /api/v1/auth/token
{ "api_key": "agora_live_YOUR_KEY" }
→ { "access_token": "..." }
```

API keys are scoped per organisation. Contact [support@agoraai.tech](mailto:support@agoraai.tech) to obtain one.
