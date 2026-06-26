# types.common

**Source:** https://fal.ai/docs/api-reference/client-libraries/javascript/types.common.md

> ## Documentation Index
> Fetch the complete documentation index at: https://fal.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# types.common

> API reference for @fal-ai/client types.common

## Classes & Interfaces

### InQueueQueueStatus

```typescript theme={null}
interface InQueueQueueStatus
```

  | Name             | Type         | Description |
  | :--------------- | :----------- | :---------- |
  | `status`         | `"IN_QUEUE"` | -           |
  | `queue_position` | `number`     | -           |

### InProgressQueueStatus

```typescript theme={null}
interface InProgressQueueStatus
```

  | Name     | Type            | Description |
  | :------- | :-------------- | :---------- |
  | `status` | `"IN_PROGRESS"` | -           |
  | `logs`   | `RequestLog[]`  | -           |

### CompletedQueueStatus

```typescript theme={null}
interface CompletedQueueStatus
```

  | Name       | Type           | Description |
  | :--------- | :------------- | :---------- |
  | `status`   | `"COMPLETED"`  | -           |
  | `logs`     | `RequestLog[]` | -           |
  | `metrics?` | `Metrics`      | -           |

***

## Functions

### isQueueStatus

```typescript theme={null}
function isQueueStatus(obj: any): obj is QueueStatus
```

| Parameter | Type  | Description |
| :-------- | :---- | :---------- |
| `obj`     | `any` | -           |

**Returns:** `obj is QueueStatus`

### isCompletedQueueStatus

```typescript theme={null}
function isCompletedQueueStatus(obj: any): obj is CompletedQueueStatus
```

| Parameter | Type  | Description |
| :-------- | :---- | :---------- |
| `obj`     | `any` | -           |

**Returns:** `obj is CompletedQueueStatus`

***

## Types

### Result

```typescript theme={null}
type Result = {
  data: T;
  requestId: string;
}
```

Represents an API result, containing the data,
the request ID and any other relevant information.

### RunOptions

```typescript theme={null}
type RunOptions = {
  /**
   * The function input. It will be submitted either as query params
   * or the body payload, depending on the `method`.
   */
  readonly input?: Input;

  /**
   * The HTTP method, defaults to `post`;
   */
  readonly method?: "get" | "post" | "put" | "delete" | string;

  /**
   * The abort signal to cancel the request.
   */
  readonly abortSignal?: AbortSignal;

  /**
   * Object lifecycle configuration for controlling how long generated objects
   * (images, files, etc.) remain available before expiring.
   *
   * @see StorageSettings
   * @see https://docs.fal.ai/model-apis/model-endpoints/queue#object-lifecycle
   */
  readonly storageSettings?: StorageSettings;

  /**
   * Server-side request timeout in seconds. Limits total time spent waiting
   * before processing starts (includes queue wait, retries, and routing).
   * Does not apply once the application begins processing.
   *
   * This will be sent as the `x-fal-request-timeout` header.
   */
  readonly startTimeout?: number;
}
```

The function input and other configuration when running
the function, such as the HTTP method to use.

### UrlOptions

```typescript theme={null}
type UrlOptions = {
  /**
   * If `true`, the function will use the queue to run the function
   * asynchronously and return the result in a separate call. This
   * influences how the URL is built.
   */
  readonly subdomain?: string;

  /**
   * The query parameters to include in the URL.
   */
  readonly query?: Record<string, string>;

  /**
   * The path to append to the function URL.
   */
  path?: string;
}
```

### RequestLog

```typescript theme={null}
type RequestLog = {
  message: string;
  level: "STDERR" | "STDOUT" | "ERROR" | "INFO" | "WARN" | "DEBUG";
  source: "USER";
  timestamp: string; // Using string to represent date-time format, but you could also use 'Date' type if you're going to construct Date objects.
}
```

### Metrics

```typescript theme={null}
type Metrics = {
  inference_time: number | null;
}
```

### QueueStatus

```typescript theme={null}
type QueueStatus = | InProgressQueueStatus
  | CompletedQueueStatus
  | InQueueQueueStatus
```

### ValidationErrorInfo

```typescript theme={null}
type ValidationErrorInfo = {
  msg: string;
  loc: Array<string | number>;
  type: string;
}
```

### WebHookResponse

```typescript theme={null}
type WebHookResponse = | {
      /** Indicates a successful response. */
      status: "OK";
      /** The payload of the response, structure determined by the Payload type. */
      payload: Payload;
      /** Error is never present in a successful response. */
      error: never;
      /** The unique identifier for the request. */
      request_id: string;
    }
  | {
      /** Indicates an unsuccessful response. */
      status: "ERROR";
      /** The payload of the response, structure determined by the Payload type. */
      payload: Payload;
      /** Description of the error that occurred. */
      error: string;
      /** The unique identifier for the request. */
      request_id: string;
    }
```

Represents the response from a WebHook request.
This is a union type that varies based on the `status` property.
