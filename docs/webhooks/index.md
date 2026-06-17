---
title: Webhooks
description: Receive real-time HTTP POST notifications for leads, calls, and form submissions in your Agora campaigns.
tags:
  - webhooks
---

# Webhooks

Agora webhooks let your server receive real-time HTTP POST notifications whenever events occur in your campaigns — lead created, call completed, form submitted, and more.

<div class="grid cards" markdown>

-   :material-lightning-bolt:{ .lg .middle } __Quick Start__

    ---

    Get a live `ping` delivery to a test URL in under 5 minutes.

    [:octicons-arrow-right-24: Quick start](quickstart.md)

-   :material-shield-key:{ .lg .middle } __Signature Verification__

    ---

    Verify every request came from Agora using HMAC-SHA256.

    [:octicons-arrow-right-24: Python · Node.js · Ruby examples](signature-verification.md)

-   :material-format-list-bulleted:{ .lg .middle } __Event Reference__

    ---

    All event types, request headers, payload shapes, and delivery behavior.

    [:octicons-arrow-right-24: Event reference](events.md)

-   :material-api:{ .lg .middle } __REST API__

    ---

    Full REST API for managing endpoints and replaying deliveries.

    [:octicons-arrow-right-24: API reference](api.md)

</div>

---

## How it works

```
Campaign event fires
        │
        ▼
Agora signs payload with HMAC-SHA256
        │
        ▼
POST to your endpoint  ──►  Your server verifies signature
        │                              │
        │                     returns 2xx within 10s
        │
  non-2xx / timeout?
        │
        ▼
  One automatic retry
        │
        ▼
  Recorded in Deliveries panel
```

!!! tip "Idempotency"
    Because of the automatic retry, your handler may receive the same event twice. Build it to be idempotent — see [How to handle duplicate deliveries](idempotency.md).
