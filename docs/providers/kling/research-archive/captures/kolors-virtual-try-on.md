# Kling — Kolors Virtual Try-On (captured)

Captured by user from the live Kling site (Documents/kling-virtual-try-on.txt).
Used by **Phase 2 (outfit dressing)**.

## Create task
`POST https://api-singapore.klingai.com/v1/images/kolors-virtual-try-on`
Headers: `Authorization: Bearer <token>`, `Content-Type: application/json`

### Body
| Field | Req | Notes |
|-------|-----|-------|
| `model_name` | optional | `kolors-virtual-try-on-v1` or **`kolors-virtual-try-on-v1-5`** (default v1) |
| `human_image` | **required** | The person. Base64 (RAW — **no `data:image/...;base64,` prefix**) or URL. jpg/jpeg/png, ≤10MB, ≥300px each side. |
| `cloth_image` | **required** | The garment. Single **upper, lower, or dress**, or (v1-5) a merged **upper+lower** white-bg image. Base64 RAW or URL. Same format/size limits. |
| `callback_url` | optional | Async callback. |
| `external_task_id` | optional | Custom task id (unique per account). |

### Garment-combination rules (v1-5)
- Single item (upper / lower / dress) → try-on of that item. ✅
- Merge **upper + lower** into one white-bg image → ✅ full outfit.
- **Fails:** upper+upper, lower+lower, dress+dress, upper+dress, lower+dress.
- ⚠️ **No shoes / hats / accessories** — model is upper/lower/dress only.

### Response (create)
`{ code, message, request_id, data: { task_id, task_status: submitted|processing|succeed|failed, created_at, updated_at } }`

## Query task (single)
`GET /v1/images/kolors-virtual-try-on/{id}` (or by `external_task_id`)
→ `data.task_status`, `data.task_result.images[].url` (results purged after 30 days — save promptly).

## Query task (list)
`GET /v1/images/kolors-virtual-try-on?pageNum=1&pageSize=30`

## curl
```bash
curl --request POST \
  --url https://api-singapore.klingai.com/v1/images/kolors-virtual-try-on \
  --header 'Authorization: Bearer <token>' \
  --header 'Content-Type: application/json' \
  --data '{
    "model_name": "kolors-virtual-try-on-v1-5",
    "human_image": "<url-or-raw-base64>",
    "cloth_image": "<url-or-raw-base64>",
    "callback_url": "",
    "external_task_id": ""
  }'
```
