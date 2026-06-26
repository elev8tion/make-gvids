# Python Client

**Source:** https://fal.ai/docs/api-reference/client-libraries/python/index.md

> ## Documentation Index
> Fetch the complete documentation index at: https://fal.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Python Client

> API reference for fal-client Python package

The `fal-client` package provides a Python interface for calling fal AI models.

## Installation

```bash theme={null}
pip install fal-client
```

## Quick Start

```python theme={null}
import fal_client

result = fal_client.subscribe(
    "fal-ai/flux/dev",
    arguments={
        "prompt": "a cat wearing a hat",
        "image_size": "landscape_4_3"
    },
    with_logs=True,
    on_queue_update=lambda status: print(f"Status: {status}")
)

print(result["images"][0]["url"])
```

## API Reference

The following pages contain the auto-generated API reference for all public classes and functions in the `fal-client` package.
