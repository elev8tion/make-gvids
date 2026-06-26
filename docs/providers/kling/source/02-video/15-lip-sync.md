# Lip Sync

**Source:** https://kling.ai/document-api/api/video/lip-sync

## Create Task

**POST** `/v1/videos/lip-sync`

Generates lip-synced talking head videos from images and audio.

### Request Body

| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| image | string | Required | - | Reference image (Base64 or URL) |
| audio_id | string | Optional | - | Audio from TTS API. Mutually exclusive with sound_file |
| sound_file | string | Optional | - | Audio file. Mutually exclusive with audio_id |
| prompt | string | Optional | - | Text prompt for additional control |
| mode | string | Optional | std | std / pro |
| callback_url | string | Optional | - | Callback URL |
| external_task_id | string | Optional | - | Custom task ID |

### Query Task
**GET** `/v1/videos/lip-sync/{id}` | **GET** `/v1/videos/lip-sync`
