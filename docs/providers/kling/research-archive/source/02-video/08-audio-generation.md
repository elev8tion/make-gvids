# Audio Generation

**Source:** https://kling.ai/document-api/api/video/audio-generation

Audio generation for video soundtracks.

## Endpoints

### Create Task (TTS)
**POST** `/v1/audio/generations`

Generates audio/voice for use in video generation tasks.

### Query Task
**GET** `/v1/audio/generations/{id}` | **GET** `/v1/audio/generations`

### Custom Voice
**POST** `/v1/voices` — Create custom voice

The generated audio_id can be used in the Avatar endpoint's `audio_id` parameter or in video generation's `voice_list` parameter.
