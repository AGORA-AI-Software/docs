# Agora Docs

Public-facing documentation for the [Agora](https://agoraai.tech) platform — webhooks, API reference, and policy pages.

**Live site → [docs.agoraai.tech](https://docs.agoraai.tech)**

---

## What's in here

| Path | Published at | Description |
|---|---|---|
| `docs/sdk/` | [/sdk](https://docs.agoraai.tech/sdk/) | SDK quick start, per-language docs (Python, TypeScript, Java, Go), CLI, and models reference |
| `docs/api/` | [/api](https://docs.agoraai.tech/api/) | Interactive Swagger UI for the Agora public API |
| `docs/webhooks/` | [/webhooks](https://docs.agoraai.tech/webhooks/) | Webhook integration guide (quick start, signature verification, event reference, idempotency, secret rotation, API) |
| `docs/policies/privacy.md` | [/policies/privacy/](https://docs.agoraai.tech/policies/privacy/) | Privacy policy |
| `docs/policies/security.md` | [/policies/security/](https://docs.agoraai.tech/policies/security/) | Security acknowledgement and responsible disclosure |

## Contributing

All docs are written in Markdown and built with [MkDocs Material](https://squidfunk.github.io/mkdocs-material/).

### Run locally

```bash
pip install mkdocs-material
mkdocs serve
```

Open [http://localhost:8000](http://localhost:8000). Changes hot-reload.

### Making changes

1. Edit or add files under `docs/`
2. Open a pull request against `main`
3. The site deploys automatically via GitHub Actions once merged


## Found an issue?

[Open an issue](https://github.com/AGORA-AI-Software/docs/issues/new) in this repo.
