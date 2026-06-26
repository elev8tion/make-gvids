# queue

**Source:** https://fal.ai/docs/api-reference/client-libraries/javascript/queue.md

> ## Documentation Index
> Fetch the complete documentation index at: https://fal.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# queue

> API reference for @fal-ai/client queue

## Classes & Interfaces

### QueueClient

```typescript theme={null}
interface QueueClient
```

Represents a request queue with methods for submitting requests,
checking their status, retrieving results, and subscribing to updates.

  #### submit

  ```typescript theme={null}
  submit(endpointId: Id, options: SubmitOptions<InputType<Id>>): Promise<InQueueQueueStatus>
  ```

  Submits a request to the queue.

  | Parameter    | Type                           | Description                                    |
  | :----------- | :----------------------------- | :--------------------------------------------- |
  | `endpointId` | `Id`                           | - The ID of the function web endpoint.         |
  | `options`    | `SubmitOptions<InputType<Id>>` | - Options to configure how the request is run. |

  **Returns:** `Promise<InQueueQueueStatus>`

  #### status

  ```typescript theme={null}
  status(endpointId: string, options: QueueStatusOptions): Promise<QueueStatus>
  ```

  Retrieves the status of a specific request in the queue.

  | Parameter    | Type                 | Description                                    |
  | :----------- | :------------------- | :--------------------------------------------- |
  | `endpointId` | `string`             | - The ID of the function web endpoint.         |
  | `options`    | `QueueStatusOptions` | - Options to configure how the request is run. |

  **Returns:** `Promise<QueueStatus>`

  #### streamStatus

  ```typescript theme={null}
  streamStatus(endpointId: string, options: QueueStatusStreamOptions): Promise<FalStream<unknown, QueueStatus>>
  ```

  Subscribes to updates for a specific request in the queue using HTTP streaming events.

  | Parameter    | Type                       | Description                                                                 |
  | :----------- | :------------------------- | :-------------------------------------------------------------------------- |
  | `endpointId` | `string`                   | - The ID of the function web endpoint.                                      |
  | `options`    | `QueueStatusStreamOptions` | - Options to configure how the request is run and how updates are received. |

  **Returns:** `Promise<FalStream<unknown, QueueStatus>>`

  #### subscribeToStatus

  ```typescript theme={null}
  subscribeToStatus(endpointId: string, options: QueueStatusSubscriptionOptions): Promise<CompletedQueueStatus>
  ```

  Subscribes to updates for a specific request in the queue using polling or streaming.
  See `options.mode` for more details.

  | Parameter    | Type                             | Description                                                                 |
  | :----------- | :------------------------------- | :-------------------------------------------------------------------------- |
  | `endpointId` | `string`                         | - The ID of the function web endpoint.                                      |
  | `options`    | `QueueStatusSubscriptionOptions` | - Options to configure how the request is run and how updates are received. |

  **Returns:** `Promise<CompletedQueueStatus>`

  #### result

  ```typescript theme={null}
  result(endpointId: Id, options: BaseQueueOptions): Promise<Result<OutputType<Id>>>
  ```

  Retrieves the result of a specific request from the queue.

  | Parameter    | Type               | Description                                    |
  | :----------- | :----------------- | :--------------------------------------------- |
  | `endpointId` | `Id`               | - The ID of the function web endpoint.         |
  | `options`    | `BaseQueueOptions` | - Options to configure how the request is run. |

  **Returns:** `Promise<Result<OutputType<Id>>>`

  #### cancel

  ```typescript theme={null}
  cancel(endpointId: string, options: BaseQueueOptions): Promise<void>
  ```

  Cancels a request in the queue.

  | Parameter    | Type               | Description                                                                 |
  | :----------- | :----------------- | :-------------------------------------------------------------------------- |
  | `endpointId` | `string`           | - The ID of the function web endpoint.                                      |
  | `options`    | `BaseQueueOptions` | - Options to configure how the request is run and how updates are received. |

  **Returns:** `Promise<void>`

***

## Types

### QueuePriority

```typescript theme={null}
type QueuePriority = "low" | "normal"
```

### QueueStatusSubscriptionOptions

```typescript theme={null}
type QueueStatusSubscriptionOptions = QueueStatusOptions &
  QueueModeOptions &
  Omit<QueueCommonSubscribeOptions, "onEnqueue" | "webhookUrl">
```

### QueueSubscribeOptions

```typescript theme={null}
type QueueSubscribeOptions = QueueCommonSubscribeOptions &
  QueueModeOptions
```

Options for subscribing to the request queue.

### SubmitOptions

```typescript theme={null}
type SubmitOptions = RunOptions<Input> & {
  /**
   * The URL to send a webhook notification to when the request is completed.
   * @see WebHookResponse
   */
  webhookUrl?: string;

  /**
   * The priority of the request. It defaults to `normal`.
   * This will be sent as the `x-fal-queue-priority` header.
   *
   * @see QueuePriority
   */
  priority?: QueuePriority;

  /**
   * A hint for the runner to use when processing the request.
   * This will be sent as the `x-fal-runner-hint` header.
   */
  hint?: string;

  /**
   * Server-side request timeout in seconds. Limits total time spent waiting
   * before processing starts (includes queue wait, retries, and routing).
   * Does not apply once the application begins processing.
   *
   * This will be sent as the `x-fal-request-timeout` header.
   */
  startTimeout?: number;

  /**
   * Additional HTTP headers to include in the submit request.
   *
   * Note: `priority`, `hint`, `startTimeout`, and `objectLifecycle` will override the following headers:
   *  - `x-fal-queue-priority`
   *  - `x-fal-runner-hint`
   *  - `x-fal-request-timeout`
   *  - `x-fal-object-lifecycle-preference`
   */
  headers?: Record<string, string>;
}
```

Options for submitting a request to the queue.

### QueueStatusOptions

```typescript theme={null}
type QueueStatusOptions = BaseQueueOptions & {
  /**
   * If `true`, the response will include the logs for the request.
   * Defaults to `false`.
   */
  logs?: boolean;
}
```

### QueueStatusStreamOptions

```typescript theme={null}
type QueueStatusStreamOptions = QueueStatusOptions & {
  /**
   * The connection mode to use for streaming updates. It defaults to `server`.
   * Set to `client` if your server proxy doesn't support streaming.
   */
  connectionMode?: StreamingConnectionMode;
}
```
