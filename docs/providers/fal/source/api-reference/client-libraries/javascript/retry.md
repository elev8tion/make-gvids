# retry

**Source:** https://fal.ai/docs/api-reference/client-libraries/javascript/retry.md

> ## Documentation Index
> Fetch the complete documentation index at: https://fal.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# retry

> API reference for @fal-ai/client retry

## Classes & Interfaces

### RetryMetrics

```typescript theme={null}
interface RetryMetrics
```

Retry metrics for tracking retry attempts

  | Name            | Type     | Description |
  | :-------------- | :------- | :---------- |
  | `totalAttempts` | `number` | -           |
  | `totalDelay`    | `number` | -           |
  | `lastError?`    | `any`    | -           |

***

## Functions

### isRetryableError

```typescript theme={null}
function isRetryableError(error: any, retryableStatusCodes: number[]): boolean
```

Determines if an error is retryable based on the status code.
User-specified timeouts (504 with X-Fal-Request-Timeout-Type: user) are NOT retryable.

| Parameter              | Type       | Description |
| :--------------------- | :--------- | :---------- |
| `error`                | `any`      | -           |
| `retryableStatusCodes` | `number[]` | -           |

**Returns:** `boolean`

### calculateBackoffDelay

```typescript theme={null}
function calculateBackoffDelay(attempt: number, baseDelay: number, maxDelay: number, backoffMultiplier: number, enableJitter: boolean): number
```

Calculates the backoff delay for a given attempt using exponential backoff

| Parameter           | Type      | Description |
| :------------------ | :-------- | :---------- |
| `attempt`           | `number`  | -           |
| `baseDelay`         | `number`  | -           |
| `maxDelay`          | `number`  | -           |
| `backoffMultiplier` | `number`  | -           |
| `enableJitter`      | `boolean` | -           |

**Returns:** `number`

### executeWithRetry

```typescript theme={null}
async function executeWithRetry(operation: () => Promise<T>, options: RetryOptions, onRetry?: (attempt: number, error: any, delay: number) => void): Promise<{ result: T; metrics: RetryMetrics }>
```

Executes an operation with retry logic and returns both result and metrics

| Parameter   | Type                                                   | Description |
| :---------- | :----------------------------------------------------- | :---------- |
| `operation` | `() => Promise<T>`                                     | -           |
| `options`   | `RetryOptions`                                         | -           |
| `onRetry`   | `(attempt: number, error: any, delay: number) => void` | -           |

**Returns:** `Promise<{ result: T; metrics: RetryMetrics }>`

***

## Types

### RetryOptions

```typescript theme={null}
type RetryOptions = {
  maxRetries: number;
  baseDelay: number;
  maxDelay: number;
  backoffMultiplier: number;
  retryableStatusCodes: number[];
  enableJitter: boolean;
}
```
