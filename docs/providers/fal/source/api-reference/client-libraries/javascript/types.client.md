# types.client

**Source:** https://fal.ai/docs/api-reference/client-libraries/javascript/types.client.md

> ## Documentation Index
> Fetch the complete documentation index at: https://fal.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# types.client

> API reference for @fal-ai/client types.client

***

## Types

### EndpointType

```typescript theme={null}
type EndpointType = keyof EndpointTypeMap | (string & {})
```

### InputType

```typescript theme={null}
type InputType = T extends keyof EndpointTypeMap
  ? EndpointTypeMap[T]["input"]
  : Record<string, any>
```

### OutputType

```typescript theme={null}
type OutputType = T extends keyof EndpointTypeMap
  ? EndpointTypeMap[T]["output"]
  : any
```
