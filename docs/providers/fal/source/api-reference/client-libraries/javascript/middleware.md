# middleware

**Source:** https://fal.ai/docs/api-reference/client-libraries/javascript/middleware.md

> ## Documentation Index
> Fetch the complete documentation index at: https://fal.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# middleware

> API reference for @fal-ai/client middleware

***

## Functions

### withMiddleware

```typescript theme={null}
function withMiddleware(middlewares: RequestMiddleware[]): RequestMiddleware
```

Setup a execution chain of middleware functions.

| Parameter     | Type                  | Description                       |
| :------------ | :-------------------- | :-------------------------------- |
| `middlewares` | `RequestMiddleware[]` | one or more middleware functions. |

**Returns:** `RequestMiddleware`

### withProxy

```typescript theme={null}
function withProxy(config: RequestProxyConfig): RequestMiddleware
```

| Parameter | Type                 | Description |
| :-------- | :------------------- | :---------- |
| `config`  | `RequestProxyConfig` | -           |

**Returns:** `RequestMiddleware`

***

## Types

### RequestConfig

```typescript theme={null}
type RequestConfig = {
  url: string;
  method: string;
  headers?: Record<string, string | string[]>;
}
```

A request configuration object.

**Note:** This is a simplified version of the `RequestConfig` type from the
`fetch` API. It contains only the properties that are relevant for the
fal client. It also works around the fact that the `fetch` API `Request`
does not support mutability, its clone method has critical limitations
to our use case.

### RequestMiddleware

```typescript theme={null}
type RequestMiddleware = (
  request: RequestConfig,
) => Promise<RequestConfig>
```

### RequestProxyConfig

```typescript theme={null}
type RequestProxyConfig = {
  targetUrl: string;
}
```
