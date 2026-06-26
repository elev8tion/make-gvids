# Virtual Try-On

**Source:** https://kling.ai/document-api/api/image/virtual-try-on

## Create Task

**POST** `/v1/images/kolors-virtual-try-on`

### Request Body

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| model_name | string | No | kolors-virtual-try-on-v1 | kolors-virtual-try-on-v1, kolors-virtual-try-on-v1-5 |
| human_image | string | Required | - | Person image (Base64 or URL). JPG/PNG, ≤10MB, ≥300px |
| cloth_image | string | Required | - | Clothing image (product/white bg). JPG/PNG, ≤10MB, ≥300px. v1-5 supports "upper+lower" combo |
| callback_url | string | No | - | Callback URL |
| external_task_id | string | No | - | Custom task ID |

### v1-5 Combo Rules
- Single item (upper, lower, dress) → single try-on
- "upper + lower" → Success
- "upper + upper", "lower + lower", "dress + dress" → Fails
- "upper + dress", "lower + dress" → Fails

### Query Task
**GET** `/v1/images/kolors-virtual-try-on/{id}` | **GET** `/v1/images/kolors-virtual-try-on`
