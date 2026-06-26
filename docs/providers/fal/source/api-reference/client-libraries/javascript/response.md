# response

**Source:** https://fal.ai/docs/api-reference/client-libraries/javascript/response.md

> ## Documentation Index
> Fetch the complete documentation index at: https://fal.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# response

> API reference for @fal-ai/client response

## Classes & Interfaces

### ApiError

```typescript theme={null}
interface ApiError
```

  | Name           | Type     | Description |
  | :------------- | :------- | :---------- |
  | `status`       | `number` | -           |
  | `body`         | `Body`   | -           |
  | `requestId`    | `string` | -           |
  | `timeoutType?` | `string` | -           |

### ValidationError

```typescript theme={null}
interface ValidationError
```

  #### getFieldErrors

  ```typescript theme={null}
  getFieldErrors(field: string): ValidationErrorInfo[]
  ```

  | Parameter | Type     | Description |
  | :-------- | :------- | :---------- |
  | `field`   | `string` | -           |

  **Returns:** `ValidationErrorInfo[]`

***

## Functions

### defaultResponseHandler

```typescript theme={null}
async function defaultResponseHandler(response: Response): Promise<Output>
```

| Parameter  | Type       | Description |
| :--------- | :--------- | :---------- |
| `response` | `Response` | -           |

**Returns:** `Promise<Output>`

### resultResponseHandler

```typescript theme={null}
async function resultResponseHandler(response: Response): Promise<Result<Output>>
```

| Parameter  | Type       | Description |
| :--------- | :--------- | :---------- |
| `response` | `Response` | -           |

**Returns:** `Promise<Result<Output>>`

***

## Types

### ResponseHandler

```typescript theme={null}
type ResponseHandler = (response: Response) => Promise<Output>
```

### ResponseHandlerCreator

```typescript theme={null}
type ResponseHandlerCreator = (
  config: RequiredConfig,
) => ResponseHandler<Output>
```
