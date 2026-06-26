# client

**Source:** https://fal.ai/docs/api-reference/client-libraries/javascript/client.md

> ## Documentation Index
> Fetch the complete documentation index at: https://fal.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# client

> API reference for @fal-ai/client client

## Classes & Interfaces

### FalClient

```typescript theme={null}
interface FalClient
```

The main client type, it provides access to simple API model usage,
as well as access to the `queue` and `storage` APIs.

  | Name        | Type                        | Description                                                                                                                                                                                       |
  | :---------- | :-------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
  | `queue`     | `QueueClient`               | The queue client to interact with the queue API.                                                                                                                                                  |
  | `realtime`  | `RealtimeClient`            | The realtime client to interact with the realtime API and receive updates in real-time.                                                                                                           |
  | `storage`   | `StorageClient`             | The storage client to interact with the storage API.                                                                                                                                              |
  | `streaming` | `StreamingClient`           | The streaming client to interact with the streaming API.                                                                                                                                          |
  | `stream`    | `StreamingClient["stream"]` | Calls a fal app that supports streaming and provides a streaming-capable object as a result, that can be used to get partial results through either `AsyncIterator` or through an event listener. |

  #### run

  ```typescript theme={null}
  run(endpointId: Id, options: RunOptions<InputType<Id>>): Promise<Result<OutputType<Id>>>
  ```

  Runs a fal endpoint identified by its `endpointId`.

  | Parameter    | Type                        | Description                                       |
  | :----------- | :-------------------------- | :------------------------------------------------ |
  | `endpointId` | `Id`                        | The endpoint id, e.g. `fal-ai/fast-sdxl`.         |
  | `options`    | `RunOptions<InputType<Id>>` | The request options, including the input payload. |

  **Returns:** `Promise<Result<OutputType<Id>>>`

  #### subscribe

  ```typescript theme={null}
  subscribe(endpointId: Id, options: RunOptions<InputType<Id>> & QueueSubscribeOptions): Promise<Result<OutputType<Id>>>
  ```

  Subscribes to updates for a specific request in the queue.

  | Parameter    | Type                                                | Description                                                                 |
  | :----------- | :-------------------------------------------------- | :-------------------------------------------------------------------------- |
  | `endpointId` | `Id`                                                | - The ID of the API endpoint.                                               |
  | `options`    | `RunOptions<InputType<Id>> & QueueSubscribeOptions` | - Options to configure how the request is run and how updates are received. |

  **Returns:** `Promise<Result<OutputType<Id>>>`

***

## Functions

### createFalClient

```typescript theme={null}
function createFalClient(userConfig?: Config): FalClient
```

Creates a new reference of the `FalClient`.

| Parameter    | Type     | Description                                              |
| :----------- | :------- | :------------------------------------------------------- |
| `userConfig` | `Config` | Optional configuration to override the default settings. |

**Returns:** `FalClient`
