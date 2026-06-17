---
title: AI Agent Plugins
description: AI agent plugins for the Agora public API — reviewed skill content for curl, Restish, and SDK code generation.
tags:
  - sdk
  - ai
---

# AI Agent Plugins

The [sdk repo](https://github.com/AGORA-AI-Software/sdk) ships reviewed skill content for AI coding assistants. These plugins give agents accurate, pre-validated examples for the Agora API rather than having them generate code from scratch.

**Source:** [`plugins/agora-api/`](https://github.com/AGORA-AI-Software/sdk/tree/main/plugins/agora-api)

---

## Available skills

### `agora-lead-upload-api`

Generates **curl examples** for the token exchange and lead upload flow.

Use when: debugging raw HTTP, validating request/response shape, or building a minimal reproduction without any SDK or CLI dependency.

```bash
# Token exchange
curl -sS -X POST https://core.agoraai.tech/api/v1/auth/api-key/token \
  -H 'Content-Type: application/json' \
  -d '{"api_key":"agora_live_YOUR_KEY"}'

# Lead upload
curl -sS -X POST https://core.agoraai.tech/api/v1/leads/upload \
  -H "Authorization: Bearer $AGORA_ACCESS_TOKEN" \
  -H 'Content-Type: application/json' \
  -d '{
    "campaign_id": 1,
    "source": "api",
    "leads": [{"first_name":"Jane","last_name":"Doe","phone":"+15551234567"}],
    "compliance_acknowledged": true
  }'
```

---

### `agora-restish-cli`

Generates **Restish CLI commands** for terminal-based API access without writing application code.

Use when: a user wants to explore or automate the API from the terminal without installing an Agora-specific binary.

```bash
# Setup (from the sdk repo)
make install-restish
make setup-restish

# Auth
restish agora login-with-api-key '{"api_key":"agora_live_YOUR_KEY"}'
export AGORA_ACCESS_TOKEN='paste-token-here'

# Upload leads
restish agora upload-leads '{
  "campaign_id": 1,
  "leads": [{"phone": "+15551234567"}],
  "compliance_acknowledged": true
}'

# Discover the request shape for any operation
restish agora upload-leads --rsh-generate-body
```

---

### `agora-sdk-usage`

Generates **SDK application code** in Python, TypeScript, Java, and Go for the token exchange + lead upload workflow.

Use when: a user is building a service, script, or integration and needs working SDK snippets.

See the [SDK Quick Start](quickstart.md) for full examples in every language.

---

## How agents use these plugins

The skills are pre-reviewed against the live OpenAPI contract and regenerated on each SDK release. When an AI assistant uses these skills it produces accurate examples that match the current API surface — including correct field names, auth patterns, and compliance requirements — rather than hallucinating from general training data.

### Supported plugin formats

| Format | Location |
|---|---|
| Claude (`.claude-plugin`) | [`plugins/agora-api/.claude-plugin/`](https://github.com/AGORA-AI-Software/sdk/tree/main/plugins/agora-api/.claude-plugin) |
| OpenAI Codex (`.codex-plugin`) | [`plugins/agora-api/.codex-plugin/`](https://github.com/AGORA-AI-Software/sdk/tree/main/plugins/agora-api/.codex-plugin) |

---

## Regenerate skills

Skills are regenerated automatically during the SDK release pipeline. To regenerate manually from the sdk repo:

```bash
make generate-skills   # regenerate from openapi/agora-public-api.yaml
make lint-plugin       # validate the plugin manifests
```
