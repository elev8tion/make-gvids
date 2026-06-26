# fal — Background Removal (rembg) (captured)

Captured by user (Documents/background remove.txt). Used by **Phase 1 (subject isolation)**.
This is the **one fal dependency** in an otherwise Kling-primary pipeline.

## Model
`fal-ai/imageutils/rembg` — remove background from an image.

## Usage (fal JS client)
```js
import { fal } from "@fal-ai/client";

const result = await fal.subscribe("fal-ai/imageutils/rembg", {
  input: {
    image_url: "https://.../input.jpg"   // public URL (or fal CDN upload)
  },
  logs: true,
  onQueueUpdate: (update) => {
    if (update.status === "IN_PROGRESS") {
      update.logs.map((log) => log.message).forEach(console.log);
    }
  },
});
console.log(result.data);       // bg-removed image (transparent PNG)
console.log(result.requestId);
```

## Notes
- Input: `image_url` (publicly reachable, or upload via `fal.storage.upload()` → CDN url).
- `fal.subscribe()` handles queue submit + poll internally (no manual polling).
- Auth: `FAL_KEY` env var.
- Output: transparent-background image in `result.data`.
