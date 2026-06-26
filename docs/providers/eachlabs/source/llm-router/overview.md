---
title: "LLM Router"
description: "One API key, 300+ LLM models. OpenAI, Anthropic, Google, Meta, Mistral... you name it."
---

LLM Router gives you access to 300+ large language models through a single, OpenAI-compatible API. Smart routing, automatic failover, caching, cost optimization. One base URL to rule them all.

```
https://api.eachlabs.ai/v1
```

## Key Features

  OpenAI, Anthropic, Google, Meta, Mistral, DeepSeek, Cohere and a whole lot more. All from one endpoint.
  Smart model selection and response caching that actually saves you money. Your wallet will thank you.
  Picks the best provider based on availability, latency, and cost. No more babysitting your API calls.
  Provider goes down? Requests get rerouted automatically. Zero downtime, zero drama.
  Same request twice? Get it from cache. Faster responses, lower costs. Configurable TTL and cache keys.
  Token usage, costs, latency, error rates. All your models, all your providers, one dashboard.

## Supported Providers

| Provider | Example Models |
|----------|---------------|
| OpenAI | `openai/gpt-4o`, `openai/gpt-4o-mini`, `openai/o1`, `openai/o3-mini` |
| Anthropic | `anthropic/claude-sonnet-4-20250514`, `anthropic/claude-3-5-haiku-20241022` |
| Google | `google/gemini-2.5-pro-preview-06-05`, `google/gemini-2.0-flash` |
| Meta | `meta-llama/llama-4-maverick`, `meta-llama/llama-3.3-70b-instruct` |
| DeepSeek | `deepseek/deepseek-r1`, `deepseek/deepseek-chat` |
| Mistral | `mistralai/mistral-large-latest`, `mistralai/codestral-latest` |
| Cohere | `cohere/command-r-plus`, `cohere/command-r` |
| Amazon | `amazon/nova-pro-v1`, `amazon/nova-lite-v1` |

> **📝  Note:** This is just a taste. Check out the full menu on the [Available Models](/llm-router/models) page.

## Model Format

Models use the `provider/model-name` format:

```
openai/gpt-4o
anthropic/claude-sonnet-4-20250514
google/gemini-2.5-pro-preview-06-05
deepseek/deepseek-r1
```

## How It Works

  
**Send a request**
Make an OpenAI-compatible API call to `https://api.eachlabs.ai/v1` with your each::labs API key. That's it.

  
**LLM Router does its thing**
Validates your request, checks the cache, picks the best provider. All in milliseconds.

  
**Get your response**
Standard OpenAI-compatible response. Works with any SDK or framework that speaks OpenAI.

## Pricing

You only pay for the tokens you use. Pricing varies per model and we match the original provider's pricing, so you're never overpaying. Check per-model costs on the [Available Models](/llm-router/models) page or in your [dashboard](https://www.eachlabs.ai).

## Next Steps

  - **[Quickstart](/llm-router/quickstart)** — Ship your first LLM Router request in under 5 minutes.

  - **[Authentication](/authentication)** — API key setup and security best practices.

