# Kling Skills

**Source:** https://kling.ai/document-api/api/get-started/kling-skills  
**Last updated:** 2026/04/01 16:02

## Overview

KlingAI API Official Skill. Developers can leverage Kling AI Skill in third-party Agents to perform video generation, image generation, element management and other operations, with support for tools including Openclaw, Claude Code, Cursor, Codex, Copilot and Opencode. The system automatically selects subcommands (video / image / element) based on user intent and intelligently routes requests to the corresponding API endpoints.

## Kling AI Skill Capabilities

- **Video Generation** (Text-to-Video, Image-to-Video, Video Editing Omni 3.0)  
  Supported models: kling-v3 / kling-v2-6 / kling-v3-omni / kling-video-o1

- **Image Generation** (Text-to-Image, Image-to-Image, 4K Image)  
  Supported models: kling-v3 / kling-v3-omni / kling-image-o1

- **Element/Character Management** — Create reusable characters and maintain character consistency across videos

## Installation

- **Installation URL:** `https://clawhub.ai/klingai-dev/klingai`
- **ClawHub:** [Link](https://clawhub.ai)
- **Buy Resource Pack:** [Link]
- **User Guide:** [Link]

### Environment Requirements
- Node.js 18+, no other dependencies.

### Authentication Methods
- When installing a skill, a URL will be provided for one-click binding using your Kling account (recommended).
- To bind manually by obtaining AK/SK, run:
  ```
  node kling.mjs account --import-credentials --access_key_id <ak> --secret_access_key <sk>
  ```
- Unable to access through API Key temporarily, expected to support within June

### Regions
If `KLING_API_BASE` is not set, the script automatically detects and caches the China/Global endpoint. The region can be forcibly specified by setting `KLING_API_BASE`.

## Notes

- Fees are incurred for each submission. Please confirm before submitting if your intent is unclear.
- Video generation typically takes 1–5 minutes, image generation about 20–60 seconds, and element creation around 30 seconds–2 minutes.
- Generated assets are retained for 30 days; please download and save them in a timely manner.
- Bilingual interaction (Chinese & English) is supported, with automatic user language detection.
