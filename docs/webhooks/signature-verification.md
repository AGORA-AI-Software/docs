# How to Verify Webhook Signatures

Every Agora webhook request includes an `X-Agora-Signature-256` header of the form `sha256=<hex>`. Verifying it proves the request came from Agora and was not tampered with in transit.

## The verification algorithm

1. Read the raw request body as bytes — do not parse JSON first.
2. Compute `HMAC-SHA256(secret, body_bytes)`, where `secret` is the endpoint secret shown at creation time.
3. Prepend `sha256=` to the hex digest.
4. Compare the result to the `X-Agora-Signature-256` header using a constant-time comparison function.
5. Reject the request if they do not match.

!!! warning "Always use constant-time comparison"
    A regular string equality check leaks timing information that can be exploited to forge signatures. Use the language-provided constant-time function shown in the examples below.

## Code examples

=== "Python"

    ```python
    import hashlib
    import hmac
    from fastapi import Request, HTTPException

    async def verify_agora_signature(request: Request, secret: str) -> None:
        body = await request.body()
        expected = "sha256=" + hmac.new(
            secret.encode(), body, hashlib.sha256
        ).hexdigest()
        received = request.headers.get("X-Agora-Signature-256", "")
        if not hmac.compare_digest(expected, received):
            raise HTTPException(status_code=401, detail="Invalid webhook signature")
    ```

=== "Node.js"

    ```js
    const crypto = require('crypto');

    function verifyAgoraSignature(req, secret) {
      const body = req.rawBody; // use express.raw() or bodyParser with verify callback
      const expected = 'sha256=' + crypto
        .createHmac('sha256', secret)
        .update(body)
        .digest('hex');
      const received = req.headers['x-agora-signature-256'] ?? '';
      if (!crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(received))) {
        throw new Error('Invalid webhook signature');
      }
    }
    ```

=== "Ruby"

    ```ruby
    require 'openssl'

    def verify_agora_signature(body, secret, header)
      expected = 'sha256=' + OpenSSL::HMAC.hexdigest('SHA256', secret, body)
      unless Rack::Utils.secure_compare(expected, header.to_s)
        raise 'Invalid webhook signature'
      end
    end
    ```

!!! important
    Read the body as raw bytes **before** any JSON parsing. Middleware that re-serialises the body (whitespace changes, key ordering) will break signature verification.

## Why HMAC and not an API key

An API key in a header identifies the caller but does not bind the secret to the specific payload. Anyone who intercepts the request can forge or replay any payload while keeping the header intact.

HMAC-SHA256 signs the body. The signature is computed from both the secret and the exact bytes of the payload, so even a single character change invalidates it. Your server can cryptographically verify that the payload was produced by Agora and has not been altered since it left our servers.
