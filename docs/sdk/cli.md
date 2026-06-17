---
title: CLI (Restish)
description: Use the Restish CLI to explore the Agora API from the terminal — no code required.
tags:
  - sdk
  - cli
---

# CLI — Restish

[Restish](https://rest.sh) is an OpenAPI-aware HTTP CLI. It reads Agora's OpenAPI contract and gives you typed, auto-completing commands — no SDK code required.

!!! tip "Best for"
    Quickly exploring the API, testing from a terminal, or scripting without a full SDK.

---

## Install

=== "macOS (Homebrew)"

    ```bash
    brew install danielgtaylor/restish/restish
    ```

=== "Go"

    ```bash
    go install github.com/danielgtaylor/restish@latest
    ```

=== "From the SDK repo"

    ```bash
    git clone https://github.com/AGORA-AI-Software/sdk
    cd sdk
    make install-restish  # installs + configures in one step
    ```

---

## Setup

From the SDK repo:

```bash
make setup-restish
```

Or manually register the Agora API:

```bash
restish api configure agora https://core.agoraai.tech/openapi.json
```

This downloads the OpenAPI contract and generates shell completions for all endpoints.

---

## Authenticate

```bash
# Exchange your API key for a bearer token
TOKEN=$(restish agora login-with-api-key '{"api_key":"agora_live_REDACTED"}' \
  --rsh-output-format json | jq -r '.body.access_token') # (1)!

export AGORA_ACCESS_TOKEN="$TOKEN"
```

1. Requires `jq` — install with `brew install jq` or `apt install jq`.

---

## Upload leads

```bash
restish agora upload-leads \
  --header "Authorization: Bearer $AGORA_ACCESS_TOKEN" \
  '{
    "campaign_id": 1,
    "leads": [
      {"first_name": "Jane", "last_name": "Doe", "phone": "+15551234567"}
    ],
    "compliance_acknowledged": true
  }'
```

---

## Use the development environment

```bash
# Register a dev profile pointing at core-dev
restish api configure agora-dev https://core-dev.agoraai.tech/openapi.json

# Then use --profile dev
restish --profile dev agora-dev upload-leads ...
```

Or with the SDK repo's Makefile profile:

```bash
make setup-restish-dev
restish --profile dev agora upload-leads ...
```

---

## Explore available operations

```bash
restish api show agora          # list all operations
restish agora --help            # auto-generated help from the OpenAPI contract
restish agora upload-leads --help
```

---

## Shell completions

```bash
# bash
restish completion bash >> ~/.bashrc

# zsh
restish completion zsh >> ~/.zshrc

# fish
restish completion fish > ~/.config/fish/completions/restish.fish
```

After reloading your shell, ++tab++ completion works on operation names and parameter flags.
