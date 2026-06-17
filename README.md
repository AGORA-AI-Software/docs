# Agora Docs

Public-facing documentation for the [Agora](https://agoraai.tech) platform — webhooks, API reference, SDKs, and policy pages.

**Live site → [docs.agoraai.tech](https://docs.agoraai.tech)**

---

## What's in here

| Path | Published at | Description |
|---|---|---|
| `docs/webhooks/` | [/webhooks](https://docs.agoraai.tech/webhooks/) | Webhook integration guide (quick start, signature verification, event reference, idempotency, secret rotation, API) |
| `docs/sdks/` | [/sdks](https://docs.agoraai.tech/sdks/) | SDK quick starts for Python, TypeScript, Java, and Go — links out to per-language docs in the [sdk repo](https://github.com/AGORA-AI-Software/sdk) |
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

For policy pages (`docs/policies/`), merging to `main` will also notify the marketing team to sync the updated content to the Framer site. See [PUBLISHING.md](PUBLISHING.md) for the full workflow.

## Found an issue?

[Open an issue](https://github.com/AGORA-AI-Software/docs/issues/new) in this repo.
