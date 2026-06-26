# File Upload

**Source:** Kie AI File Upload API  
**Last updated:** 2026-06

## Overview

Kling AI's generation endpoints accept images and audio as either **external URLs** or **Base64 strings**. The File Upload API provides a managed alternative — upload files once, get back a `file_id`, and reference that ID in subsequent generation tasks. This eliminates the need to self-host files or deal with Base64 encoding limitations.

### Why Use File Upload vs. URL/Base64?

| Method | Max Size | Expires | Reusable | Best For |
|---|---|---|---|---|
| **URL** | No Kling limit (external host determines) | Until your host removes it | Yes, while hosted | Simple one-offs, already-hosted assets |
| **Base64** | ~10MB (encoding overhead) | Per-request | No | Quick tests, small images |
| **File Upload** | Configurable, supports streaming | Platform-managed | Yes, via `file_id` | Production pipelines, large files, audio |

---

## Upload Methods

### 1. Base64 Upload

**POST** `/file-upload-api/upload-file-base-64`

Upload a file encoded as a Base64 string. Best for small files already in memory.

#### Request Body

| Parameter | Type | Required | Description |
|---|---|---|---|
| file | string | Required | Base64-encoded file content |
| filename | string | Required | Original filename with extension (e.g., `"photo.jpg"`) |
| mime_type | string | Optional | MIME type (auto-detected from filename if omitted) |

```bash
curl --location 'https://api-singapore.klingai.com/file-upload-api/upload-file-base-64' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer {api_key}' \
  --data '{
    "file": "/9j/4AAQSkZJRgABAQEASABIAAD...",
    "filename": "reference_image.jpg",
    "mime_type": "image/jpeg"
  }'
```

#### Response

```json
{
  "code": 0,
  "message": "success",
  "data": {
    "file_id": "file_abc123def456",
    "filename": "reference_image.jpg",
    "size": 245760,
    "mime_type": "image/jpeg",
    "created_at": 1722769557708
  }
}
```

#### Python Example

```python
import base64
import requests

def upload_base64(file_path: str, api_key: str) -> str:
    """Upload a local file as Base64 and return its file_id."""
    with open(file_path, "rb") as f:
        encoded = base64.b64encode(f.read()).decode("utf-8")

    filename = file_path.split("/")[-1]

    resp = requests.post(
        "https://api-singapore.klingai.com/file-upload-api/upload-file-base-64",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        json={
            "file": encoded,
            "filename": filename,
        },
    )
    resp.raise_for_status()
    data = resp.json()
    return data["data"]["file_id"]
```

---

### 2. File Stream Upload

**POST** `/file-upload-api/upload-file-stream`

Upload a file as a multipart form-data stream. Best for larger files — avoids Base64 encoding overhead (33% size increase) and memory duplication.

```bash
curl --location 'https://api-singapore.klingai.com/file-upload-api/upload-file-stream' \
  --header 'Authorization: Bearer {api_key}' \
  --form 'file=@"/path/to/large_video.mp4"' \
  --form 'filename="large_video.mp4"'
```

#### Python Example

```python
import requests

def upload_stream(file_path: str, api_key: str) -> str:
    """Upload a file as a multipart stream and return its file_id."""
    filename = file_path.split("/")[-1]

    with open(file_path, "rb") as f:
        resp = requests.post(
            "https://api-singapore.klingai.com/file-upload-api/upload-file-stream",
            headers={"Authorization": f"Bearer {api_key}"},
            files={"file": (filename, f)},
            data={"filename": filename},
        )
    resp.raise_for_status()
    return resp.json()["data"]["file_id"]
```

---

### 3. URL Upload

**POST** `/file-upload-api/upload-file-url`

Upload a file by providing its public URL. Kling's servers fetch it directly — your bandwidth is never consumed. Best for files already hosted on CDNs, S3, or public buckets.

```bash
curl --location 'https://api-singapore.klingai.com/file-upload-api/upload-file-url' \
  --header 'Content-Type: application/json' \
  --header 'Authorization: Bearer {api_key}' \
  --data '{
    "url": "https://example-bucket.s3.amazonaws.com/photos/portrait.jpg",
    "filename": "portrait.jpg"
  }'
```

#### Python Example

```python
def upload_from_url(file_url: str, filename: str, api_key: str) -> str:
    """Upload a file from a public URL and return its file_id."""
    resp = requests.post(
        "https://api-singapore.klingai.com/file-upload-api/upload-file-url",
        headers={
            "Authorization": f"Bearer {api_key}",
            "Content-Type": "application/json",
        },
        json={"url": file_url, "filename": filename},
    )
    resp.raise_for_status()
    return resp.json()["data"]["file_id"]
```

---

## Using Uploaded Files in Generation

Once you have a `file_id`, pass it to generation endpoints in the standard `image` / `sound_file` / `image_list` fields:

### Image-to-Video with Uploaded File

```bash
curl --location 'https://api-singapore.klingai.com/v1/videos/image2video' \
  --header 'Authorization: Bearer {api_key}' \
  --header 'Content-Type: application/json' \
  --data '{
    "model_name": "kling-v3",
    "image": "file_abc123def456",
    "prompt": "A person walking through a sunlit forest",
    "duration": "5",
    "mode": "pro"
  }'
```

> **Note:** The `image` parameter accepts a `file_id` string in addition to URLs and Base64. If the API does not recognize the format, the file upload API may be from a different Kling platform version — fall back to using the file's downloadable URL after upload.

---

## Supported File Types

| Category | Formats | Max Size (recommended) |
|---|---|---|
| **Images** | JPG, JPEG, PNG | 10MB |
| **Audio** | MP3, WAV, M4A, AAC | 5MB |
| **Video** | MP4 | Per model limits |

---

## File Lifecycle

- Uploaded files are retained for **30 days** (matching generated asset retention)
- There is no delete API — files expire automatically
- File IDs are scoped to your account and work across all API keys

---

## Method Selection Flowchart

```
Need to upload a file?
│
├─ Already on a public URL?
│   → URL Upload (fastest, no bandwidth)
│
├─ File < 5MB and already in memory?
│   → Base64 Upload (simplest integration)
│
├─ File > 5MB or on disk?
│   → Stream Upload (avoids encoding overhead)
│
└─ Uploading many files in a batch?
    → Stream Upload + parallel requests
       (concurrency limits apply)
```
