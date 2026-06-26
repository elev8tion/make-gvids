# JavaScript Client

**Source:** https://fal.ai/docs/api-reference/client-libraries/javascript/index.md

> ## Documentation Index
> Fetch the complete documentation index at: https://fal.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# JavaScript Client

> API reference for @fal-ai/client

The `@fal-ai/client` package provides a TypeScript/JavaScript interface for calling fal AI models.

## Installation

```bash theme={null}
npm install @fal-ai/client
```

## Quick Start

```typescript theme={null}
import { fal } from "@fal-ai/client";

const result = await fal.subscribe("fal-ai/flux/dev", {
  input: {
    prompt: "a cat wearing a hat",
    image_size: "landscape_4_3"
  },
  logs: true,
  onQueueUpdate: (status) => console.log(`Status: ${status.status}`)
});

console.log(result.data.images[0].url);
```

## API Overview

| Method                   | Description                        |
| :----------------------- | :--------------------------------- |
| `fal.run()`              | Run a model synchronously          |
| `fal.subscribe()`        | Run via queue with status updates  |
| `fal.stream()`           | Stream partial results             |
| `fal.queue.submit()`     | Submit to queue, get request ID    |
| `fal.queue.status()`     | Check request status               |
| `fal.queue.result()`     | Get completed result               |
| `fal.realtime.connect()` | Open realtime WebSocket connection |
| `fal.storage.upload()`   | Upload file to fal CDN             |

## API Reference

The following pages contain the auto-generated API reference for all public classes and functions in the `@fal-ai/client` package.
