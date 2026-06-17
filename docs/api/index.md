---
title: API Reference
description: Interactive Agora REST API reference — try every endpoint directly from your browser.
tags:
  - api
  - reference
---

# API Reference

Interactive documentation for the Agora Public API. Expand any endpoint to inspect request/response schemas and try calls directly in the browser.

!!! info "Environments"
    Two environments are available. Select the server at the top of the UI below.

    | Environment | Base URL | Swagger UI |
    |---|---|---|
    | **Production** | `https://core.agoraai.tech/api/v1` | [core.agoraai.tech/api-docs](https://core.agoraai.tech/api-docs) |
    | **Development** | `https://core-dev.agoraai.tech/api/v1` | [core-dev.agoraai.tech/api-docs](https://core-dev.agoraai.tech/api-docs) |

!!! tip "Authentication in the UI"
    Click **Authorize :material-lock-outline:** and paste your bearer token (obtained from the [Quick Start](../sdk/quickstart.md)) to authenticate Try-it-out requests.

---

<link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css">
<script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js" crossorigin></script>

<div id="swagger-ui"></div>

<style>
/* Blend Swagger UI into the Material theme */
.swagger-ui .topbar { display: none; }
.swagger-ui { font-family: var(--md-text-font); }
[data-md-color-scheme="slate"] .swagger-ui,
[data-md-color-scheme="slate"] .swagger-ui .scheme-container,
[data-md-color-scheme="slate"] .swagger-ui .opblock-tag,
[data-md-color-scheme="slate"] .swagger-ui .opblock .opblock-summary-operation-id,
[data-md-color-scheme="slate"] .swagger-ui .opblock .opblock-summary-path,
[data-md-color-scheme="slate"] .swagger-ui .opblock .opblock-summary-description,
[data-md-color-scheme="slate"] .swagger-ui .opblock-description-wrapper p,
[data-md-color-scheme="slate"] .swagger-ui table thead tr td,
[data-md-color-scheme="slate"] .swagger-ui table thead tr th,
[data-md-color-scheme="slate"] .swagger-ui .response-col_status,
[data-md-color-scheme="slate"] .swagger-ui .response-col_description,
[data-md-color-scheme="slate"] .swagger-ui .parameter__name,
[data-md-color-scheme="slate"] .swagger-ui .parameter__type,
[data-md-color-scheme="slate"] .swagger-ui .info p,
[data-md-color-scheme="slate"] .swagger-ui .info li,
[data-md-color-scheme="slate"] .swagger-ui .info h1,
[data-md-color-scheme="slate"] .swagger-ui .info h2,
[data-md-color-scheme="slate"] .swagger-ui .info h3 { color: var(--md-default-fg-color); }
[data-md-color-scheme="slate"] .swagger-ui .scheme-container,
[data-md-color-scheme="slate"] .swagger-ui .opblock-tag { background: var(--md-default-bg-color); }
[data-md-color-scheme="slate"] .swagger-ui input[type=text],
[data-md-color-scheme="slate"] .swagger-ui textarea { background: #1a1030; color: var(--md-default-fg-color); }
</style>
