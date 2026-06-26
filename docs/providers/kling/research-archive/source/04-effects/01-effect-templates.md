# Effect Templates

**Source:** https://kling.ai/document-api/api/effects/templates

## Overview

Effect Templates API provides pre-built video effects that can be applied to user content.

## Endpoints

- **GET** `/v1/effects/templates` — List available effect templates
- **POST** `/v1/effects/apply` — Apply an effect template to content
- **GET** `/v1/effects/tasks/{id}` — Query effect task status

### Key Concepts
- Effect templates are pre-configured visual effects/transformations
- Templates can be applied to images or videos
- Results follow the standard async task pattern (submitted → processing → succeed → failed)
