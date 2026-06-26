# streaming

**Source:** https://fal.ai/docs/api-reference/client-libraries/javascript/streaming.md

> ## Documentation Index
> Fetch the complete documentation index at: https://fal.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# streaming

> API reference for @fal-ai/client streaming

## Classes & Interfaces

### FalStream

```typescript theme={null}
interface FalStream
```

The class representing a streaming response. With t

  | Name                 | Type                                      | Description                                                                                                                                                                                                                                                                                  |
  | :------------------- | :---------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | `config`             | `RequiredConfig`                          | -                                                                                                                                                                                                                                                                                            |
  | `endpointId`         | `string`                                  | -                                                                                                                                                                                                                                                                                            |
  | `url`                | `string`                                  | -                                                                                                                                                                                                                                                                                            |
  | `options`            | `StreamOptions<Input>`                    | -                                                                                                                                                                                                                                                                                            |
  | `listeners`          | `Map<FalStreamEventType, EventHandler[]>` | -                                                                                                                                                                                                                                                                                            |
  | `buffer`             | `Output[]`                                | -                                                                                                                                                                                                                                                                                            |
  | `currentData`        | `Output \| undefined`                     | -                                                                                                                                                                                                                                                                                            |
  | `lastEventTimestamp` | `any`                                     | -                                                                                                                                                                                                                                                                                            |
  | `streamClosed`       | `any`                                     | -                                                                                                                                                                                                                                                                                            |
  | `_requestId`         | `string \| null`                          | -                                                                                                                                                                                                                                                                                            |
  | `donePromise`        | `Promise<Output>`                         | -                                                                                                                                                                                                                                                                                            |
  | `abortController`    | `any`                                     | -                                                                                                                                                                                                                                                                                            |
  | `start`              | `any`                                     | -                                                                                                                                                                                                                                                                                            |
  | `handleResponse`     | `any`                                     | -                                                                                                                                                                                                                                                                                            |
  | `handleError`        | `any`                                     | -                                                                                                                                                                                                                                                                                            |
  | `on`                 | `any`                                     | -                                                                                                                                                                                                                                                                                            |
  | `emit`               | `any`                                     | -                                                                                                                                                                                                                                                                                            |
  | `done`               | `any`                                     | Gets a reference to the `Promise` that indicates whether the streaming is done or not. Developers should always call this in their apps to ensure the request is over. An alternative to this, is to use `on('done')` in case your application architecture works best with event listeners. |
  | `abort`              | `any`                                     | Aborts the streaming request. **Note:** This method is noop in case the request is already done.                                                                                                                                                                                             |

  #### `[Symbol.asyncIterator]`

  ```typescript theme={null}
  async [Symbol.asyncIterator](): any
  ```

  **Returns:** `any`

### StreamingClient

```typescript theme={null}
interface StreamingClient
```

The streaming client interface.

  #### stream

  ```typescript theme={null}
  stream(endpointId: Id, options: StreamOptions<InputType<Id>>): Promise<FalStream<InputType<Id>, OutputType<Id>>>
  ```

  Calls a fal app that supports streaming and provides a streaming-capable
  object as a result, that can be used to get partial results through either
  `AsyncIterator` or through an event listener.

  | Parameter    | Type                           | Description                                       |
  | :----------- | :----------------------------- | :------------------------------------------------ |
  | `endpointId` | `Id`                           | the endpoint id, e.g. `fal-ai/llavav15-13b`.      |
  | `options`    | `StreamOptions<InputType<Id>>` | the request options, including the input payload. |

  **Returns:** `Promise<FalStream<InputType<Id>, OutputType<Id>>>`

***

## Functions

### createStreamingClient

```typescript theme={null}
function createStreamingClient({ config, storage, }: StreamingClientDependencies): StreamingClient
```

| Parameter              | Type                          | Description |
| :--------------------- | :---------------------------- | :---------- |
| `{ config, storage, }` | `StreamingClientDependencies` | -           |

**Returns:** `StreamingClient`

***

## Types

### StreamingConnectionMode

```typescript theme={null}
type StreamingConnectionMode = "client" | "server"
```

### StreamOptions

```typescript theme={null}
type StreamOptions = {
  /**
   * The endpoint URL. If not provided, it will be generated from the
   * `endpointId` and the `queryParams`.
   */
  readonly url?: string;

  /**
   * The API input payload.
   */
  readonly input?: Input;

  /**
   * The query parameters to be sent with the request.
   */
  readonly queryParams?: Record<string, string>;

  /**
   * The maximum time interval in milliseconds between stream chunks. Defaults to 15s.
   */
  readonly timeout?: number;

  /**
   * Whether it should auto-upload File-like types to fal's storage
   * or not.
   */
  readonly autoUpload?: boolean;

  /**
   * The HTTP method, defaults to `post`;
   */
  readonly method?: "get" | "post" | "put" | "delete" | string;

  /**
   * The content type the client accepts as response.
   * By default this is set to `text/event-stream`.
   */
  readonly accept?: string;

  /**
   * The streaming connection mode. This is used to determine
   * whether the streaming will be done from the browser itself (client)
   * or through your own server, either when running on NodeJS or when
   * using a proxy that supports streaming.
   *
   * It defaults to `server`. Set to `client` if your server proxy doesn't
   * support streaming.
   */
  readonly connectionMode?: StreamingConnectionMode;

  /**
   * The signal to abort the request.
   */
  readonly signal?: AbortSignal;

  /**
   * A custom token provider function. Only used when `connectionMode` is `"client"`.
   * When provided, this function will be used to fetch authentication tokens
   * instead of the default internal token fetching mechanism.
   */
  readonly tokenProvider?: TokenProvider;
}
```

The stream API options. It requires the API input and also
offers configuration options.
