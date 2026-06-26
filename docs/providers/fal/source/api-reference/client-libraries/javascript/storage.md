# storage

**Source:** https://fal.ai/docs/api-reference/client-libraries/javascript/storage.md

> ## Documentation Index
> Fetch the complete documentation index at: https://fal.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# storage

> API reference for @fal-ai/client storage

## Classes & Interfaces

### StorageSettings

```typescript theme={null}
interface StorageSettings
```

Configuration for object lifecycle and storage behavior.

  | Name        | Type               | Description                                                                                                                           |
  | :---------- | :----------------- | :------------------------------------------------------------------------------------------------------------------------------------ |
  | `expiresIn` | `ObjectExpiration` | The expiration time for the stored files (images, videos, etc.). You can specify one of the enumerated values or a number of seconds. |

### StorageClient

```typescript theme={null}
interface StorageClient
```

File support for the client. This interface establishes the contract for
uploading files to the server and transforming the input to replace file
objects with URLs.

  | Name             | Type                                                           | Description                                                                                                                                                                                   |
  | :--------------- | :------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | `upload`         | `(file: Blob, options?: UploadOptions) => Promise<string>`     | Upload a file to the server. Returns the URL of the uploaded file.                                                                                                                            |
  | `transformInput` | `(input: Record<string, any>) => Promise<Record<string, any>>` | Transform the input to replace file objects with URLs. This is used to transform the input before sending it to the server and ensures that the server receives URLs instead of file objects. |

***

## Functions

### getExpirationDurationSeconds

```typescript theme={null}
function getExpirationDurationSeconds(lifecycle: StorageSettings): number | undefined
```

Converts an `StorageSettings` to the expiration duration in seconds.

| Parameter   | Type              | Description              |
| :---------- | :---------------- | :----------------------- |
| `lifecycle` | `StorageSettings` | the lifecycle preference |

**Returns:** `number | undefined`

### buildObjectLifecycleHeaders

```typescript theme={null}
function buildObjectLifecycleHeaders(lifecycle: StorageSettings | undefined): Record<string, string>
```

Builds the headers for the Object Lifecycle preference to be used in API requests.
This is used by the queue and run APIs to control the lifecycle of generated objects.

| Parameter   | Type                           | Description              |
| :---------- | :----------------------------- | :----------------------- |
| `lifecycle` | `StorageSettings \| undefined` | the lifecycle preference |

**Returns:** `Record<string, string>`

### createStorageClient

```typescript theme={null}
function createStorageClient({ config, }: StorageClientDependencies): StorageClient
```

| Parameter     | Type                        | Description |
| :------------ | :-------------------------- | :---------- |
| `{ config, }` | `StorageClientDependencies` | -           |

**Returns:** `StorageClient`

***

## Types

### UploadOptions

```typescript theme={null}
type UploadOptions = {
  /**
   * Custom lifecycle configuration for the uploaded file.
   * This object will be sent as the X-Fal-Object-Lifecycle header.
   */
  lifecycle?: StorageSettings;
}
```

Options for uploading a file.
