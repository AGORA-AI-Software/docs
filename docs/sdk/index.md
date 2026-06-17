---
title: SDK Overview
description: Agora SDKs for Python, TypeScript, Java, and Go — install, authenticate, and upload leads.
tags:
  - sdk
---

# SDKs

Agora provides generated clients in four languages, all built from the same [OpenAPI contract](https://github.com/AGORA-AI-Software/sdk/blob/main/openapi/agora-public-api.yaml).

**Interactive API reference → [:material-api: docs.agoraai.tech/api](../api/index.md)**

## Available SDKs

<div class="grid cards" markdown>

-   :fontawesome-brands-python:{ .lg .middle } __Python__

    ---

    `pip install agora-public-api` · Requires Python 3.8+

    [:octicons-arrow-right-24: Python docs](python.md)

-   :fontawesome-brands-js:{ .lg .middle } __TypeScript / JavaScript__

    ---

    `npm install @agora-ai/public-api`

    [:octicons-arrow-right-24: TypeScript docs](typescript.md)

-   :fontawesome-brands-java:{ .lg .middle } __Java__

    ---

    Maven: `ai.agora:agora-public-api` · Requires Java 11+

    [:octicons-arrow-right-24: Java docs](java.md)

-   :fontawesome-brands-golang:{ .lg .middle } __Go__

    ---

    `go get github.com/AGORA-AI-Software/sdk/sdks/go` · Requires Go 1.21+

    [:octicons-arrow-right-24: Go docs](go.md)

</div>

## How authentication works

All SDKs use a two-credential model:

```
API Key  ──(POST /auth/api-key/token)──►  Bearer token (short-lived JWT)
                                                │
                                                ▼
                                    POST /leads/upload  ✓
```

1. Your **API key** is a long-lived secret — only ever sent to the token exchange endpoint.
2. The exchange returns a short-lived **bearer token** (JWT) used for all subsequent calls.
3. The bearer token expires; re-exchange when needed.

!!! warning "Keep your API key secret"
    Never log, commit, or embed your API key in client-side code. Store it in environment variables or a secrets manager.

## Environments

| Environment | Base URL |
|---|---|
| Production | `https://core.agoraai.tech/api/v1` |
| Development | `https://core-dev.agoraai.tech/api/v1` |

---

## Found a bug or have a feature request?

Open an issue in the [sdk repo](https://github.com/AGORA-AI-Software/sdk/issues/new) — that's where SDK bugs, feature requests, and OpenAPI contract changes are tracked.

For docs corrections, [open an issue here](https://github.com/AGORA-AI-Software/docs/issues/new).
