---
title: "each::labs Documentation"
description: "The generative media platform. 500+ AI models, multi-step workflows, and an intelligent agent interface. Build with each::api, each::workflows, and each::sense."
---

each::labs is a generative media platform for developers and AI agents. Get access to 500+ production-ready AI models with just one API key.

## Products

  - **[each::api](/api/overview)** — Direct model access. Run image, video, audio, and 3D generation models from a single endpoint. Async predictions with webhook delivery.

  - **[each::workflows](/workflows/overview)** — Multi-step pipelines. Chain models together with parameter passing, versioning, fallback configs, and bulk execution.

  - **[each::sense](/sense/overview)** — AI agent interface. OpenAI-compatible endpoint that understands natural language, auto-selects models, generates media, and builds workflows.

  - **[LLM Router](/llm-router/overview)** — One endpoint, 300+ LLMs. OpenAI, Anthropic, Google, and more. OpenAI-compatible, just swap the base URL.

  - **[MCP Server](/mcp)** — Connect to Cursor, Claude Desktop, Windsurf, and more. Generate media without ever leaving your IDE.

## Quick Start

  
**Get your API key**
Sign up at [eachlabs.ai](https://eachlabs.ai) and create an API key from [Settings → API Keys](https://eachlabs.ai/settings/api-keys).

  
**Generate an image**
```bash cURL
    curl -X POST https://api.eachlabs.ai/v1/prediction \
      -H "Content-Type: application/json" \
      -H "X-API-Key: $EACHLABS_API_KEY" \
      -d '{
        "model": "nano-banana-pro",
        "input": {
          "prompt": "A cinematic landscape at golden hour",
          "aspect_ratio": "16:9"
        }
      }'
    ```

    ```python Python
    import requests

    response = requests.post(
        "https://api.eachlabs.ai/v1/prediction",
        headers={"X-API-Key": "YOUR_API_KEY"},
        json={
            "model": "nano-banana-pro",
            "input": {
                "prompt": "A cinematic landscape at golden hour",
                "aspect_ratio": "16:9"
            }
        }
    )

    prediction_id = response.json()["predictionID"]
    ```

    ```javascript JavaScript
    const response = await fetch("https://api.eachlabs.ai/v1/prediction", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": "YOUR_API_KEY",
      },
      body: JSON.stringify({
        model: "nano-banana-pro",
        input: {
          prompt: "A cinematic landscape at golden hour",
          aspect_ratio: "16:9",
        },
      }),
    });

    const { predictionID } = await response.json();
    ```

  
**Or use the AI agent**
Skip model selection entirely and let each::sense handle it for you:

    ```python
    from openai import OpenAI

    client = OpenAI(
        api_key="YOUR_API_KEY",
        base_url="https://eachsense-agent.core.eachlabs.run/v1"
    )

    response = client.chat.completions.create(
        model="eachsense/beta",
        messages=[{"role": "user", "content": "Generate a cinematic landscape at golden hour"}],
    )
    ```

## Base URLs

| Product | Base URL | Protocol | Status |
|---------|----------|----------|--------|
| each::api | `https://api.eachlabs.ai` | REST | Canonical api-service host |
| each::workflows | `https://workflows.eachlabs.run/api/v1` | REST | Workflows-engine host; planned to route through `https://api.eachlabs.ai` |
| each::sense | `https://eachsense-agent.core.eachlabs.run` | REST + SSE | Current each::sense host |
| LLM Router | `https://api.eachlabs.ai/v1` | REST + SSE | Canonical api-service host |

## For AI Agents

each::sense is fully OpenAI-compatible. Just point any agent framework at the base URL with your API key and you're good to go:

```python
# Works with LangChain, CrewAI, AutoGen, or any OpenAI-compatible client
client = OpenAI(
    api_key="YOUR_API_KEY",
    base_url="https://eachsense-agent.core.eachlabs.run/v1"
)
```

Machine-readable documentation index available at [`/llms.txt`](/llms.txt).

  - **[Authentication](/authentication)** — API key setup and security best practices.

  - **[Error Reference](/errors)** — HTTP status codes and error handling across all products.

