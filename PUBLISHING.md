# Publishing Workflow

This repo is the single source of truth for all public-facing Agora documentation. It covers two categories of content with slightly different workflows.

---

## Category 1 — Technical docs (Webhooks, API reference)

These live under `docs/` and are published automatically to **[docs.agoraai.tech](https://docs.agoraai.tech)** via GitHub Pages. No manual steps needed by marketing.

**Engineering workflow:**

1. Edit the relevant markdown file (e.g. `docs/webhooks/events.md`)
2. Open a PR — preview changes with `mkdocs serve` locally (see [Local development](#local-development))
3. Merge to `main` — the GitHub Actions workflow builds and deploys automatically within ~2 minutes
4. `docs.agoraai.tech` is live

**Marketing/design:** No action needed. The Framer site's "Docs" nav item links directly to `docs.agoraai.tech`. Content updates there automatically.

---

## Category 2 — Policy pages (Privacy, Security)

These live under `policies/` in this repo but must also be manually synced to the Framer site (e.g. `agoraai.tech/privacy`, `agoraai.tech/security`), because they are legal pages that need to live on the main domain.

**Engineering workflow:**

1. Edit the relevant policy file (e.g. `policies/privacy.md`)
2. Update the **Last updated** date at the top of the file
3. Open a PR with a clear description of what changed and why
4. Merge to `main`
5. A GitHub Action will automatically:
   - Post a Slack notification to `#marketing` with a summary of what changed and a link to the diff
   - Create a story in the tracker ([AGORA-AI-Software/tracker](https://github.com/AGORA-AI-Software/tracker)) assigned to `@stacy-nuno` with a checklist to sync the Framer page

**Marketing/design workflow:**

1. You will receive a Slack message in `#marketing` when a policy changes
2. A tracker story will be created and assigned to you with:
   - A link to the updated markdown file
   - A diff showing exactly what changed
   - A checklist: open the Framer page → update the content → publish
3. Mark the tracker story complete once Framer is updated

---

## Adding a new document

1. Create a new markdown file under `docs/` (for technical docs) or `policies/` (for legal/policy content)
2. Add it to the `nav:` section in `mkdocs.yml` if it's a technical doc
3. Open a PR — the reviewer should confirm the nav entry is correct
4. For policy files, the GitHub Action will handle marketing notification automatically on merge

---

## Local development

```bash
pip install mkdocs-material
mkdocs serve
```

Open [http://localhost:8000](http://localhost:8000). Changes hot-reload.

To build and check for broken links:

```bash
mkdocs build --strict
```

---

## Files at a glance

```
docs/                  # Technical docs — auto-published to docs.agoraai.tech
  index.md             # Landing page
  webhooks/            # Webhook integration guide (Diataxis structure)
  stylesheets/         # Custom CSS
docs/policies/         # Policy pages — marketing syncs these to Framer
  privacy.md
  security.md
mkdocs.yml             # MkDocs configuration
.github/workflows/
  deploy.yml           # Auto-deploy to GitHub Pages on push to main
  notify-marketing.yml # Notify Slack + create tracker story on policy changes (TODO — see tracker issue)
PUBLISHING.md          # This file
```

---

## DNS (action item for engineering)

To point `docs.agoraai.tech` at GitHub Pages:

1. In Cloudflare, add a `CNAME` record:
   - **Name:** `docs`
   - **Target:** `agora-ai-software.github.io`
   - **Proxy status:** DNS only (grey cloud) — GitHub Pages requires this
2. In the GitHub repo settings → Pages → Custom domain, enter `docs.agoraai.tech`
3. Check "Enforce HTTPS" once the cert provisions (usually a few minutes)
