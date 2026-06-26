# utils

**Source:** https://fal.ai/docs/api-reference/client-libraries/javascript/utils.md

> ## Documentation Index
> Fetch the complete documentation index at: https://fal.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# utils

> API reference for @fal-ai/client utils

***

## Functions

### ensureEndpointIdFormat

```typescript theme={null}
function ensureEndpointIdFormat(id: string): string
```

| Parameter | Type     | Description |
| :-------- | :------- | :---------- |
| `id`      | `string` | -           |

**Returns:** `string`

### parseEndpointId

```typescript theme={null}
function parseEndpointId(id: string): EndpointId
```

| Parameter | Type     | Description |
| :-------- | :------- | :---------- |
| `id`      | `string` | -           |

**Returns:** `EndpointId`

### isValidUrl

```typescript theme={null}
function isValidUrl(url: string): any
```

| Parameter | Type     | Description |
| :-------- | :------- | :---------- |
| `url`     | `string` | -           |

**Returns:** `any`

### throttle

```typescript theme={null}
function throttle(func: T, limit: number, leading?: any): (...funcArgs: Parameters<T>) => ReturnType<T> | void
```

| Parameter | Type     | Description |
| :-------- | :------- | :---------- |
| `func`    | `T`      | -           |
| `limit`   | `number` | -           |
| `leading` | `any`    | -           |

**Returns:** `(...funcArgs: Parameters<T>) => ReturnType<T> | void`

### isReact

```typescript theme={null}
function isReact(): any
```

Not really the most optimal way to detect if we're running in React,
but the idea here is that we can support multiple rendering engines
(starting with React), with all their peculiarities, without having
to add a dependency or creating custom integrations (e.g. custom hooks).

Yes, a bit of magic to make things works out-of-the-box.

**Returns:** `any`

### isPlainObject

```typescript theme={null}
function isPlainObject(value: any): boolean
```

Check if a value is a plain object.

| Parameter | Type  | Description           |
| :-------- | :---- | :-------------------- |
| `value`   | `any` | - The value to check. |

**Returns:** `boolean`

### sleep

```typescript theme={null}
async function sleep(ms: number): Promise<void>
```

Utility function to sleep for a given number of milliseconds

| Parameter | Type     | Description |
| :-------- | :------- | :---------- |
| `ms`      | `number` | -           |

**Returns:** `Promise<void>`

***

## Types

### EndpointId

```typescript theme={null}
type EndpointId = {
  readonly owner: string;
  readonly alias: string;
  readonly path?: string;
  readonly namespace?: EndpointNamespace;
}
```
