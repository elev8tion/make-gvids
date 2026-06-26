# auth

**Source:** https://fal.ai/docs/api-reference/client-libraries/javascript/auth.md

> ## Documentation Index
> Fetch the complete documentation index at: https://fal.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# auth

> API reference for @fal-ai/client auth

***

## Functions

### getTemporaryAuthToken

```typescript theme={null}
async function getTemporaryAuthToken(app: string, config: RequiredConfig): Promise<string>
```

Get a token to connect to the realtime endpoint.

| Parameter | Type             | Description |
| :-------- | :--------------- | :---------- |
| `app`     | `string`         | -           |
| `config`  | `RequiredConfig` | -           |

**Returns:** `Promise<string>`

***

## Types

### TokenProvider

```typescript theme={null}
type TokenProvider = (app: string) => Promise<string>
```

A function that provides a temporary authentication token.
