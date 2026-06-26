# Asset Download

**Source:** Kie AI Common API  
**Last updated:** 2026-06

## Overview

Generated assets (videos, images, audio) are delivered via time-limited URLs in callback payloads and task query responses. These URLs expire after a set period. The Asset Download API lets you:

1. **Re-download** assets whose original URLs have expired (within the 30-day retention window)
2. **Programmatically refresh** URLs without polling the task query endpoint
3. **Batch-download** all outputs from a completed task

> ⚠️ **Generated results are cleared after 30 days.** The Download URL API works only within that window. Save assets to your own storage promptly.

---

## Get Download URL

**POST** `/common-api/download-url`

Convert generated file identifiers into fresh, time-limited download URLs.

### Request Body

| Parameter | Type | Required | Description |
|---|---|---|---|
| file_ids | array[string] | Required | List of file identifiers to generate download URLs for |
| expiry | int | Optional | URL validity period in seconds (default: 3600 = 1 hour) |

### File ID Sources

File IDs come from multiple places depending on the callback schema:

| Source | ID Field | Example |
|---|---|---|
| New callback (`outputs[]`) | `outputs[].id` | `"v_abc123def"` |
| Legacy callback (`task_result.videos[]`) | `task_result.videos[].id` | `"v_abc123def"` |
| Task query response | `data.task_result.videos[].id` | `"v_abc123def"` |

### Request Example

```bash
curl --location 'https://api-singapore.klingai.com/common-api/download-url' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer {api_key}' \
  --data '{
    "file_ids": [
      "v_abc123def456",
      "i_ghi789jkl012"
    ],
    "expiry": 7200
  }'
```

### Response

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "urls": [
      {
        "file_id": "v_abc123def456",
        "url": "https://kcdn.klingai.com/download/v_abc123def456?token=xyz...",
        "expires_at": 1722776757708,
        "file_type": "video",
        "duration": "5",
        "size": 2048576
      },
      {
        "file_id": "i_ghi789jkl012",
        "url": "https://kcdn.klingai.com/download/i_ghi789jkl012?token=xyz...",
        "expires_at": 1722776757708,
        "file_type": "image",
        "size": 524288
      }
    ]
  }
}
```

### Response Fields

| Field | Description |
|---|---|
| file_id | The requested file identifier |
| url | Fresh download URL (valid until `expires_at`) |
| expires_at | Unix timestamp (ms) when the URL expires |
| file_type | `video`, `image`, or `audio` |
| duration | Video/audio duration in seconds (video/audio only) |
| size | File size in bytes |

---

## Complete Download Pipeline

### Python: Callback → Store Locally → Later Re-download

```python
import requests
import time
from pathlib import Path

API_KEY = "your_api_key"
BASE_URL = "https://api-singapore.klingai.com"
STORAGE_DIR = Path("./kling_outputs")
STORAGE_DIR.mkdir(exist_ok=True)


def download_file(url: str, destination: Path):
    """Stream a file to disk."""
    with requests.get(url, stream=True) as r:
        r.raise_for_status()
        with open(destination, "wb") as f:
            for chunk in r.iter_content(chunk_size=8192):
                f.write(chunk)


def handle_callback_outputs(outputs: list):
    """Process outputs from a callback payload — download and track file IDs."""
    manifest = []

    for output in outputs:
        file_id = output.get("id")
        output_type = output.get("type")

        if output_type == "video":
            url = output.get("url")
            ext = "mp4"
        elif output_type == "image":
            url = output.get("url")
            ext = "png"
        elif output_type == "audio":
            url = output.get("mp3_url")
            ext = "mp3"
        else:
            continue

        if not url:
            continue

        dest = STORAGE_DIR / f"{file_id}.{ext}"
        download_file(url, dest)

        manifest.append({
            "file_id": file_id,
            "type": output_type,
            "local_path": str(dest),
            "original_url": url,
            "downloaded_at": int(time.time()),
        })

    # Save manifest for later re-download
    import json
    manifest_path = STORAGE_DIR / "manifest.json"
    existing = []
    if manifest_path.exists():
        existing = json.loads(manifest_path.read_text())
    manifest_path.write_text(json.dumps(existing + manifest, indent=2))

    return manifest


def refresh_urls(file_ids: list[str], api_key: str = API_KEY) -> dict:
    """Get fresh download URLs for previously generated file IDs."""
    resp = requests.post(
        f"{BASE_URL}/common-api/download-url",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        json={"file_ids": file_ids, "expiry": 3600},
    )
    resp.raise_for_status()
    return resp.json()["data"]["urls"]


def re_download_expired(manifest_path: Path, api_key: str = API_KEY):
    """Re-download all assets from a manifest whose original URLs may have expired."""
    import json

    manifest = json.loads(manifest_path.read_text())
    file_ids = [entry["file_id"] for entry in manifest]
    fresh_urls = refresh_urls(file_ids, api_key)

    url_map = {u["file_id"]: u["url"] for u in fresh_urls}
    redownloaded = 0

    for entry in manifest:
        file_id = entry["file_id"]
        if file_id in url_map:
            dest = Path(entry["local_path"])
            if not dest.exists() or dest.stat().st_size == 0:
                download_file(url_map[file_id], dest)
                redownloaded += 1

    return redownloaded
```

### Node.js: Equivalent

```javascript
const fs = require('fs');
const path = require('path');
const axios = require('axios');

const API_KEY = 'your_api_key';
const BASE_URL = 'https://api-singapore.klingai.com';

async function refreshUrls(fileIds) {
  const { data } = await axios.post(
    `${BASE_URL}/common-api/download-url`,
    { file_ids: fileIds, expiry: 3600 },
    { headers: { Authorization: `Bearer ${API_KEY}` } }
  );
  return data.data.urls;
}

async function downloadFile(url, destPath) {
  const writer = fs.createWriteStream(destPath);
  const response = await axios({ url, method: 'GET', responseType: 'stream' });
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on('finish', resolve);
    writer.on('error', reject);
  });
}
```

---

## Integration with Task Lifecycle

```
1. Create task (POST /v1/videos/image2video)
   └─ callback_url set, external_task_id set
        │
2. Webhook received → extract outputs[].id and outputs[].url
   ├─ Download immediately from outputs[].url
   ├─ Store file_ids in your database
   └─ Set a reminder: re-download before 30-day expiry
        │
3. If URLs expire (< 30 days):
   └─ POST /common-api/download-url with saved file_ids
      └─ Get fresh URLs → re-download
        │
4. After 30 days:
   └─ Assets are purged. Recovery is NOT possible.
```

---

## Check Remaining Credits

**GET** `/common-api/get-account-credits`

Use this to track your balance before submitting expensive batch jobs:

```bash
curl --location 'https://api-singapore.klingai.com/common-api/get-account-credits' \
  --header 'Authorization: Bearer {api_key}'
```

```json
{
  "code": 0,
  "data": {
    "remaining_credits": 500.0,
    "currency": "USD",
    "resource_packages": [
      {
        "name": "Video Pro Pack",
        "remaining_units": 250,
        "expires_at": 1735689600000
      }
    ]
  }
}
```

Combine with pricing knowledge to estimate how many more jobs you can run:

```python
def estimate_remaining_jobs(credits_response: dict) -> dict:
    """Estimate remaining capacity from credits response."""
    credits = credits_response["data"]["remaining_credits"]

    return {
        "video_5s_720p_v3": int(credits / 0.084),       # kling-v3, no audio
        "video_5s_1080p_v3": int(credits / 0.112),       # kling-v3, no audio
        "video_5s_1080p_turbo": int(credits / 0.14),     # kling-3.0-turbo
        "image_2K_v3": int(credits / 0.028),             # kling-image-v3
        "avatar_5s_720p": int(credits / 0.28),           # 5s × 0.056/s
        "lip_sync_5s": int(credits / 0.07),              # per 5s
    }
```
