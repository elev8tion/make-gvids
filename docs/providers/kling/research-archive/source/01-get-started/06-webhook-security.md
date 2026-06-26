# Webhook Security Verification

**Source:** Kling AI platform + Kie AI Common API  
**Last updated:** 2026-06

## Overview

When using `callback_url` on async task creation (video, image, virtual try-on, effects, etc.), Kling AI sends HTTP POST callbacks to your server when task status changes. In production, you **must verify** that incoming webhooks genuinely originated from Kling AI to prevent forged requests and replay attacks.

> ⚠️ **Without verification**, any third party who knows your callback URL can send fake completion payloads, potentially triggering downstream workflows with fabricated data.

---

## How It Works

Kling AI (via the Kie AI platform) uses **HMAC-SHA256** to sign each webhook request. The signature is included in the `X-Kie-Signature` HTTP header.

### Signature Generation (Server Side)

The server:

1. Concatenates the **timestamp** + **"."** + **request body**
2. Computes HMAC-SHA256 of that string using your **webhook secret key**
3. Sends the resulting hex digest in the `X-Kie-Signature` header

```
signature = HMAC-SHA256(secret, timestamp + "." + body)
```

### Headers Sent with Each Webhook

| Header | Description |
|---|---|
| `X-Kie-Signature` | HMAC-SHA256 hex digest |
| `X-Kie-Timestamp` | Unix timestamp (seconds) when the webhook was sent |
| `Content-Type` | `application/json` |

---

## Verification Code

### Python (Flask/FastAPI)

```python
import hmac
import hashlib
import time

WEBHOOK_SECRET = "your_webhook_secret_from_kling_dashboard"

def verify_webhook(request_body: str, signature_header: str, timestamp_header: str) -> bool:
    """
    Verify a Kling AI webhook signature.
    Returns True if the webhook is authentic and not replayed.
    """
    # 1. Reject stale webhooks (> 5 minutes old)
    try:
        timestamp = int(timestamp_header)
    except (TypeError, ValueError):
        return False

    now = int(time.time())
    if abs(now - timestamp) > 300:  # 5-minute tolerance
        return False  # Replay attack or excessively delayed delivery

    # 2. Reconstruct the signed payload
    signed_payload = f"{timestamp}.{request_body}"

    # 3. Compute expected signature
    expected_signature = hmac.new(
        WEBHOOK_SECRET.encode("utf-8"),
        signed_payload.encode("utf-8"),
        hashlib.sha256
    ).hexdigest()

    # 4. Constant-time comparison
    return hmac.compare_digest(expected_signature, signature_header)


# --- Flask Example ---
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route("/kling-callback", methods=["POST"])
def kling_callback():
    body = request.get_data(as_text=True)
    signature = request.headers.get("X-Kie-Signature", "")
    timestamp = request.headers.get("X-Kie-Timestamp", "")

    if not verify_webhook(body, signature, timestamp):
        return jsonify({"error": "Invalid signature"}), 403

    payload = request.get_json()
    task_id = payload.get("id") or payload.get("task_id")
    status = payload.get("status") or payload.get("task_status")

    # Process the verified webhook...
    if status in ("succeeded", "succeed"):
        for output in payload.get("outputs", []):
            if output.get("type") == "video":
                download_video(output["url"])
            elif output.get("type") == "image":
                download_image(output["url"])

    return jsonify({"received": True}), 200
```

### Node.js (Express)

```javascript
const crypto = require('crypto');

const WEBHOOK_SECRET = 'your_webhook_secret_from_kling_dashboard';

function verifyWebhook(body, signatureHeader, timestampHeader) {
  // 1. Reject stale webhooks (> 5 minutes old)
  const timestamp = parseInt(timestampHeader, 10);
  if (isNaN(timestamp)) return false;

  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestamp) > 300) return false;

  // 2. Reconstruct the signed payload
  const signedPayload = `${timestamp}.${body}`;

  // 3. Compute expected signature
  const expectedSignature = crypto
    .createHmac('sha256', WEBHOOK_SECRET)
    .update(signedPayload)
    .digest('hex');

  // 4. Constant-time comparison
  return crypto.timingSafeEqual(
    Buffer.from(expectedSignature),
    Buffer.from(signatureHeader)
  );
}

// --- Express Example ---
app.post('/kling-callback', (req, res) => {
  const body = JSON.stringify(req.body); // raw body, not parsed
  const signature = req.headers['x-kie-signature'] || '';
  const timestamp = req.headers['x-kie-timestamp'] || '';

  if (!verifyWebhook(body, signature, timestamp)) {
    return res.status(403).json({ error: 'Invalid signature' });
  }

  // Process verified webhook...
  console.log('Verified task:', req.body.id);
  res.json({ received: true });
});
```

> **Important:** Use the **raw request body** (as a string, before JSON parsing) for signature verification. JSON serialization differences between your framework and the sender can break signature matching.

---

## Replay Attack Protection

The timestamp check (`abs(now - timestamp) > 300`) prevents replay attacks — an attacker can't resend a captured webhook after 5 minutes because the timestamp will have expired.

For high-security scenarios, add a nonce cache:

```python
import hashlib

# Track processed webhook IDs to prevent re-processing
SEEN_NONCES = set()  # In production, use Redis with TTL

def verify_with_nonce(body, signature, timestamp, task_id):
    if not verify_webhook(body, signature, timestamp):
        return False

    nonce = hashlib.sha256(f"{timestamp}.{task_id}".encode()).hexdigest()
    if nonce in SEEN_NONCES:
        return False  # Already processed
    SEEN_NONCES.add(nonce)
    return True
```

---

## Callback Payload Schemas

### New Callback (Kling 3.0 Turbo and subsequent models)

```json
{
  "id": "string",
  "status": "submitted | processing | succeeded | failed",
  "message": "string",
  "create_time": 1722769557708,
  "update_time": 1722769557708,
  "external_id": "string",
  "outputs": [
    {
      "type": "video | image | audio | voice | element",
      "url": "string",
      "duration": "string"
    }
  ],
  "billing": [
    {
      "charge_type": "cash | unit",
      "amount": "string",
      "currency": "CNY | USD",
      "package_type": "video | image | audio"
    }
  ]
}
```

### Legacy Callback (Kling 3.0 Omni and earlier models)

```json
{
  "task_id": "string",
  "task_status": "submitted | processing | succeed | failed",
  "task_status_msg": "string",
  "created_at": 1722769557708,
  "updated_at": 1722769557708,
  "task_result": {
    "images": [{"index": 0, "url": "string"}],
    "videos": [{"id": "string", "url": "string", "duration": "string"}]
  }
}
```

**Key difference:** New callbacks use `status` / `outputs[]` / `billing[]`. Legacy callbacks use `task_status` / `task_result.videos[]`. You must handle both schemas if you support both v3+ and legacy models.

---

## Obtaining Your Webhook Secret

1. Log in to the [Kling AI console](https://kling.ai)
2. Navigate to **API Settings** → **Webhooks**
3. Generate or view your webhook secret key
4. Store it securely (environment variable, secrets manager — never in source code)

> If no webhook secret is configured, signature verification is skipped and all callbacks arrive unsigned. **Always enable it in production.**
