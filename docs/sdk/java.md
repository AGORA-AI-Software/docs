---
title: Java SDK
description: Agora Public API Java client — Maven/Gradle install, authentication, and lead upload.
tags:
  - sdk
  - java
---

# Java SDK

:fontawesome-brands-java: Java client for the Agora Public API. [:fontawesome-brands-github: Source](https://github.com/AGORA-AI-Software/sdk/tree/main/sdks/java){ .md-button }

!!! info "Requirements"
    Java 11 or higher.

## Install

=== "Maven"

    ```xml
    <dependency>
      <groupId>ai.agora</groupId>
      <artifactId>agora-public-api</artifactId>
      <version>0.1.0</version>
    </dependency>
    ```

=== "Gradle (Groovy)"

    ```groovy
    implementation 'ai.agora:agora-public-api:0.1.0'
    ```

=== "Gradle (Kotlin)"

    ```kotlin
    implementation("ai.agora:agora-public-api:0.1.0")
    ```

---

## Configuration

```java
import ai.agora.publicapi.ApiClient;

// Production
ApiClient client = new ApiClient();
client.setBasePath("https://core.agoraai.tech/api/v1");

// Development
ApiClient client = new ApiClient();
client.setBasePath("https://core-dev.agoraai.tech/api/v1");
```

---

## Authentication

```java
import ai.agora.publicapi.api.AuthenticationApi;
import ai.agora.publicapi.model.ApiKeyTokenRequest;
import ai.agora.publicapi.model.ApiKeyTokenResponse;
import ai.agora.publicapi.auth.HttpBearerAuth;

ApiClient client = new ApiClient();
client.setBasePath("https://core.agoraai.tech/api/v1");

AuthenticationApi auth = new AuthenticationApi(client);
ApiKeyTokenResponse token = auth.loginWithApiKey(
    new ApiKeyTokenRequest().apiKey(System.getenv("AGORA_API_KEY")) // (1)!
);

// Set bearer token for all subsequent calls
((HttpBearerAuth) client.getAuthentication("bearerAuth")) // (2)!
    .setBearerToken(token.getAccessToken());
```

1. Always load from environment variables or a secrets manager — never hard-code.
2. Mutates the same `client` instance. Every API class sharing this client will now send the bearer token.

---

## Upload leads

### Single lead

```java
import ai.agora.publicapi.api.LeadsApi;
import ai.agora.publicapi.model.LeadInput;
import ai.agora.publicapi.model.LeadUploadRequest;
import ai.agora.publicapi.model.LeadUploadResponse;
import java.util.List;

LeadsApi leadsApi = new LeadsApi(client); // (1)!

LeadUploadResponse response = leadsApi.uploadLeads(
    new LeadUploadRequest()
        .campaignId(1)
        .leads(List.of(
            new LeadInput()
                .firstName("Jane")
                .lastName("Doe")
                .email("jane.doe@example.com")
                .phone("+15551234567") // (2)!
                .company("Example Co")
                .title("VP of Operations")
        ))
        .complianceAcknowledged(true) // (3)!
);

System.out.printf("valid=%d invalid=%d%n",
    response.getValidCount(), response.getInvalidCount());
```

1. Reuse the same `client` that already has the bearer token set.
2. E.164 format preferred.
3. Must be `true`.

### Bulk upload

```java
List<LeadInput> leads = List.of(
    new LeadInput().firstName("Jane").phone("+15551234567"),
    new LeadInput().firstName("John").phone("+15559876543")
    // ...
);

LeadUploadResponse response = leadsApi.uploadLeads(
    new LeadUploadRequest()
        .campaignId(1)
        .leads(leads)
        .skipDuplicates(true) // (1)!
        .tags(List.of("source:api", "batch:june-2026")) // (2)!
        .complianceAcknowledged(true)
);
```

1. Default `true` — skips leads already in the campaign.
2. String tags applied to all leads in this batch.

### Handle validation errors

```java
LeadUploadResponse response = leadsApi.uploadLeads(request);

if (response.getInvalidCount() > 0) {
    for (LeadUploadError error : response.getErrors()) {
        System.err.printf("Row %d: %s — %s%n", // (1)!
            error.getRow(), error.getVarField(), error.getMessage());
    }
}
```

1. `getVarField()` returns the field that failed (e.g. `"phone"`). `getRow()` is the 0-based index in your `leads` list.

---

## Error handling

```java
import ai.agora.publicapi.ApiException;

try {
    LeadUploadResponse response = leadsApi.uploadLeads(request);
} catch (ApiException e) {
    switch (e.getCode()) {
        case 401: // (1)!
            System.err.println("Token expired — re-exchange API key");
            break;
        case 403: // (2)!
            System.err.println("Not authorised for this campaign");
            break;
        case 422: // (3)!
            System.err.println("Validation error: " + e.getResponseBody());
            break;
        default:
            throw e;
    }
}
```

1. Re-run `loginWithApiKey` to get a fresh token.
2. Confirm the API key's organisation has access to the target `campaignId`.
3. The response body contains a structured error.

---

## Reference

| Class | Package | Description |
|---|---|---|
| `AuthenticationApi` | `ai.agora.publicapi.api` | Token exchange |
| `LeadsApi` | `ai.agora.publicapi.api` | Lead upload |
| `LeadInput` | `ai.agora.publicapi.model` | Per-lead fields |
| `LeadUploadRequest` | `ai.agora.publicapi.model` | Upload request body |
| `LeadUploadResponse` | `ai.agora.publicapi.model` | Upload response |
| `ApiKeyTokenRequest` | `ai.agora.publicapi.model` | Token request body |
| `ApiKeyTokenResponse` | `ai.agora.publicapi.model` | Token response |

Full model schemas → [Models Reference](reference.md)
