# fal_client

**Source:** https://fal.ai/docs/api-reference/client-libraries/python/fal_client.md

> ## Documentation Index
> Fetch the complete documentation index at: https://fal.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# fal_client

> API reference for fal_client

```python theme={null}
from fal_client import (
    SyncClient,
    AsyncClient,
    RealtimeConnection,
    AsyncRealtimeConnection,
    Status,
    Queued,
    InProgress,
    Completed,
    SyncRequestHandle,
    AsyncRequestHandle,
    run,
    subscribe_async,
    subscribe,
    submit,
    stream,
    run_async,
    submit_async,
    stream_async,
    realtime,
    realtime_async,
    cancel,
    cancel_async,
    status,
    status_async,
    result,
    result_async,
    encode,
    encode_file,
    encode_image,
)
```

## Classes

### SyncClient

```python theme={null}
class fal_client.SyncClient
```

  | Name              | Type          | Default | Description |
  | :---------------- | :------------ | :------ | :---------- |
  | `key`             | `str \| None` | `None`  | -           |
  | `default_timeout` | `float`       | `120.0` | -           |

  | Name              | Type          | Default | Description |
  | :---------------- | :------------ | :------ | :---------- |
  | `key`             | `str \| None` | `None`  | -           |
  | `default_timeout` | `float`       | `120.0` | -           |

  | Name        | Type                 | Description |
  | :---------- | :------------------- | :---------- |
  | `_executor` | `ThreadPoolExecutor` | -           |

  #### cancel

  ```python theme={null}
  def cancel(self, application: 'str', request_id: 'str') -> 'None'
  ```

  | Parameter     | Type  | Default | Description |
  | :------------ | :---- | :------ | :---------- |
  | `application` | `str` | -       | -           |
  | `request_id`  | `str` | -       | -           |

  **Returns:** `NoneType`

  #### get\_handle

  ```python theme={null}
  def get_handle(self, application: 'str', request_id: 'str') -> 'SyncRequestHandle'
  ```

  | Parameter     | Type  | Default | Description |
  | :------------ | :---- | :------ | :---------- |
  | `application` | `str` | -       | -           |
  | `request_id`  | `str` | -       | -           |

  **Returns:** `SyncRequestHandle`

  #### realtime

  ```python theme={null}
  def realtime(self, application: 'str', *, use_jwt: 'bool' = True, path: 'str' = '/realtime', max_buffering: 'int | None' = None, token_expiration: 'int' = 120, encode_message: 'Callable[[Any], bytes] | None' = None, decode_message: 'Callable[[bytes], Any] | None' = None) -> 'Iterator[RealtimeConnection]'
  ```

  | Parameter          | Type                             | Default       | Description |
  | :----------------- | :------------------------------- | :------------ | :---------- |
  | `application`      | `str`                            | -             | -           |
  | `use_jwt`          | `bool`                           | `True`        | -           |
  | `path`             | `str`                            | `'/realtime'` | -           |
  | `max_buffering`    | `int \| None`                    | `None`        | -           |
  | `token_expiration` | `int`                            | `120`         | -           |
  | `encode_message`   | `Optional[Callable[Any, bytes]]` | `None`        | -           |
  | `decode_message`   | `Optional[Callable[bytes, Any]]` | `None`        | -           |

  **Returns:** `Iterator[RealtimeConnection]`

  #### result

  ```python theme={null}
  def result(self, application: 'str', request_id: 'str') -> 'AnyJSON'
  ```

  | Parameter     | Type  | Default | Description |
  | :------------ | :---- | :------ | :---------- |
  | `application` | `str` | -       | -           |
  | `request_id`  | `str` | -       | -           |

  **Returns:** `dict[str, Any]`

  #### run

  ```python theme={null}
  def run(self, application: 'str', arguments: 'AnyJSON', *, path: 'str' = '', timeout: 'Optional[Union[int, float]]' = None, start_timeout: 'Optional[Union[int, float]]' = None, hint: 'str | None' = None, headers: 'dict[str, str]' = {}) -> 'AnyJSON'
  ```

  Run an application with the given arguments (which will be JSON serialized).

  | Parameter       | Type                       | Default | Description                                                                                                                                              |
  | :-------------- | :------------------------- | :------ | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | `application`   | `str`                      | -       | -                                                                                                                                                        |
  | `arguments`     | `dict[str, Any]`           | -       | -                                                                                                                                                        |
  | `path`          | `str`                      | `''`    | -                                                                                                                                                        |
  | `timeout`       | `int \| float \| NoneType` | `None`  | Client-side HTTP timeout in seconds. Controls how long the HTTP client waits for a response. Defaults to the client's default\_timeout.                  |
  | `start_timeout` | `int \| float \| NoneType` | `None`  | Server-side request timeout in seconds. Limits total time spent waiting before processing starts. Does not apply once the application begins processing. |
  | `hint`          | `str \| None`              | `None`  | -                                                                                                                                                        |
  | `headers`       | `dict[str, str]`           | `\{\}`  | -                                                                                                                                                        |

  **Returns:** `dict[str, Any]`

  #### status

  ```python theme={null}
  def status(self, application: 'str', request_id: 'str', *, with_logs: 'bool' = False) -> 'Status'
  ```

  | Parameter     | Type   | Default | Description |
  | :------------ | :----- | :------ | :---------- |
  | `application` | `str`  | -       | -           |
  | `request_id`  | `str`  | -       | -           |
  | `with_logs`   | `bool` | `False` | -           |

  **Returns:** `Status`

  #### stream

  ```python theme={null}
  def stream(self, application: 'str', arguments: 'AnyJSON', *, path: 'str' = '/stream', timeout: 'float | None' = None) -> 'Iterator[dict[str, Any]]'
  ```

  Stream the output of an application with the given arguments (which will be JSON serialized). This is only supported at a few select applications at the moment, so be sure to first consult with the documentation of individual applications
  to see if this is supported.

  The function will iterate over each event that is streamed from the server.

  | Parameter     | Type             | Default     | Description |
  | :------------ | :--------------- | :---------- | :---------- |
  | `application` | `str`            | -           | -           |
  | `arguments`   | `dict[str, Any]` | -           | -           |
  | `path`        | `str`            | `'/stream'` | -           |
  | `timeout`     | `float \| None`  | `None`      | -           |

  **Returns:** `Iterator[dict[str, Any]]`

  #### submit

  ```python theme={null}
  def submit(self, application: 'str', arguments: 'AnyJSON', *, path: 'str' = '', hint: 'str | None' = None, webhook_url: 'str | None' = None, priority: 'Optional[Priority]' = None, headers: 'dict[str, str]' = {}, start_timeout: 'Optional[Union[int, float]]' = None) -> 'SyncRequestHandle'
  ```

  Submit an application with the given arguments (which will be JSON serialized).

  | Parameter       | Type                             | Default | Description                                                                                                                                                                                          |
  | :-------------- | :------------------------------- | :------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | `application`   | `str`                            | -       | -                                                                                                                                                                                                    |
  | `arguments`     | `dict[str, Any]`                 | -       | -                                                                                                                                                                                                    |
  | `path`          | `str`                            | `''`    | -                                                                                                                                                                                                    |
  | `hint`          | `str \| None`                    | `None`  | -                                                                                                                                                                                                    |
  | `webhook_url`   | `str \| None`                    | `None`  | -                                                                                                                                                                                                    |
  | `priority`      | `Optional[Literal[normal, low]]` | `None`  | -                                                                                                                                                                                                    |
  | `headers`       | `dict[str, str]`                 | `\{\}`  | -                                                                                                                                                                                                    |
  | `start_timeout` | `int \| float \| NoneType`       | `None`  | Server-side request timeout in seconds. Limits total time spent waiting before processing starts (includes queue wait, retries, and routing). Does not apply once the application begins processing. |

  **Returns:** `SyncRequestHandle`

  #### subscribe

  ```python theme={null}
  def subscribe(self, application: 'str', arguments: 'AnyJSON', *, path: 'str' = '', hint: 'str | None' = None, with_logs: 'bool' = False, on_enqueue: 'Optional[Callable[[str], None]]' = None, on_queue_update: 'Optional[Callable[[Status], None]]' = None, priority: 'Optional[Priority]' = None, headers: 'dict[str, str]' = {}, start_timeout: 'Optional[Union[int, float]]' = None, client_timeout: 'Optional[Union[int, float]]' = None) -> 'AnyJSON'
  ```

  Subscribe to an application and wait for the result.

  | Parameter         | Type                                   | Default | Description                                                                                                                                                                                          |
  | :---------------- | :------------------------------------- | :------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | `application`     | `str`                                  | -       | -                                                                                                                                                                                                    |
  | `arguments`       | `dict[str, Any]`                       | -       | -                                                                                                                                                                                                    |
  | `path`            | `str`                                  | `''`    | -                                                                                                                                                                                                    |
  | `hint`            | `str \| None`                          | `None`  | -                                                                                                                                                                                                    |
  | `with_logs`       | `bool`                                 | `False` | -                                                                                                                                                                                                    |
  | `on_enqueue`      | `Optional[Callable[str, NoneType]]`    | `None`  | -                                                                                                                                                                                                    |
  | `on_queue_update` | `Optional[Callable[Status, NoneType]]` | `None`  | -                                                                                                                                                                                                    |
  | `priority`        | `Optional[Literal[normal, low]]`       | `None`  | -                                                                                                                                                                                                    |
  | `headers`         | `dict[str, str]`                       | `\{\}`  | -                                                                                                                                                                                                    |
  | `start_timeout`   | `int \| float \| NoneType`             | `None`  | Server-side request timeout in seconds. Limits total time spent waiting before processing starts (includes queue wait, retries, and routing). Does not apply once the application begins processing. |
  | `client_timeout`  | `int \| float \| NoneType`             | `None`  | Client-side total timeout in seconds. Limits the total time spent waiting for the entire request to complete (including queue wait and processing). If not set, waits indefinitely.                  |

  **Returns:** `dict[str, Any]`

  #### upload

  ```python theme={null}
  def upload(self, data: 'str | bytes', content_type: 'str', file_name: 'str | None' = None, *, repository: 'UploadRepositoryId | None' = None, fallback_repository: 'UploadRepositoryId | list[UploadRepositoryId] | None' = None) -> 'str'
  ```

  Upload the given data blob to the CDN and return the access URL. The content type should be specified as the second argument. Use upload\_file or upload\_image for convenience.

  | Parameter             | Type                                                                       | Default | Description |
  | :-------------------- | :------------------------------------------------------------------------- | :------ | :---------- |
  | `data`                | `str \| bytes`                                                             | -       | -           |
  | `content_type`        | `str`                                                                      | -       | -           |
  | `file_name`           | `str \| None`                                                              | `None`  | -           |
  | `repository`          | `Optional[Literal[fal_v3, cdn, fal]]`                                      | `None`  | -           |
  | `fallback_repository` | `Literal[fal_v3, cdn, fal] \| list[Literal[fal_v3, cdn, fal]] \| NoneType` | `None`  | -           |

  **Returns:** `str`

  #### upload\_file

  ```python theme={null}
  def upload_file(self, path: 'os.PathLike', *, repository: 'UploadRepositoryId | None' = None, fallback_repository: 'UploadRepositoryId | list[UploadRepositoryId] | None' = None) -> 'str'
  ```

  Upload a file from the local filesystem to the CDN and return the access URL.

  | Parameter             | Type                                                                       | Default | Description |
  | :-------------------- | :------------------------------------------------------------------------- | :------ | :---------- |
  | `path`                | `PathLike`                                                                 | -       | -           |
  | `repository`          | `Optional[Literal[fal_v3, cdn, fal]]`                                      | `None`  | -           |
  | `fallback_repository` | `Literal[fal_v3, cdn, fal] \| list[Literal[fal_v3, cdn, fal]] \| NoneType` | `None`  | -           |

  **Returns:** `str`

  #### upload\_image

  ```python theme={null}
  def upload_image(self, image: 'Image.Image', format: 'str' = 'jpeg', *, repository: 'UploadRepositoryId | None' = None, fallback_repository: 'UploadRepositoryId | list[UploadRepositoryId] | None' = None) -> 'str'
  ```

  Upload a pillow image object to the CDN and return the access URL.

  | Parameter             | Type                                                     | Default  | Description |
  | :-------------------- | :------------------------------------------------------- | :------- | :---------- |
  | `image`               | `Image.Image`                                            | -        | -           |
  | `format`              | `str`                                                    | `'jpeg'` | -           |
  | `repository`          | `UploadRepositoryId \| None`                             | `None`   | -           |
  | `fallback_repository` | `UploadRepositoryId \| list[UploadRepositoryId] \| None` | `None`   | -           |

  #### ws\_connect

  ```python theme={null}
  def ws_connect(self, application: 'str', *, use_jwt: 'bool' = True, path: 'str' = '', max_buffering: 'int | None' = None, token_expiration: 'int' = 120) -> "Iterator['Connection']"
  ```

  | Parameter          | Type          | Default | Description |
  | :----------------- | :------------ | :------ | :---------- |
  | `application`      | `str`         | -       | -           |
  | `use_jwt`          | `bool`        | `True`  | -           |
  | `path`             | `str`         | `''`    | -           |
  | `max_buffering`    | `int \| None` | `None`  | -           |
  | `token_expiration` | `int`         | `120`   | -           |

### AsyncClient

```python theme={null}
class fal_client.AsyncClient
```

  | Name              | Type          | Default | Description |
  | :---------------- | :------------ | :------ | :---------- |
  | `key`             | `str \| None` | `None`  | -           |
  | `default_timeout` | `float`       | `120.0` | -           |

  | Name              | Type          | Default | Description |
  | :---------------- | :------------ | :------ | :---------- |
  | `key`             | `str \| None` | `None`  | -           |
  | `default_timeout` | `float`       | `120.0` | -           |

  #### cancel

  ```python theme={null}
  async def cancel(self, application: 'str', request_id: 'str') -> 'None'
  ```

  | Parameter     | Type  | Default | Description |
  | :------------ | :---- | :------ | :---------- |
  | `application` | `str` | -       | -           |
  | `request_id`  | `str` | -       | -           |

  **Returns:** `NoneType`

  #### get\_handle

  ```python theme={null}
  def get_handle(self, application: 'str', request_id: 'str') -> 'AsyncRequestHandle'
  ```

  | Parameter     | Type  | Default | Description |
  | :------------ | :---- | :------ | :---------- |
  | `application` | `str` | -       | -           |
  | `request_id`  | `str` | -       | -           |

  **Returns:** `AsyncRequestHandle`

  #### realtime

  ```python theme={null}
  def realtime(self, application: 'str', *, use_jwt: 'bool' = True, path: 'str' = '/realtime', max_buffering: 'int | None' = None, token_expiration: 'int' = 120, encode_message: 'Callable[[Any], bytes] | None' = None, decode_message: 'Callable[[bytes], Any] | None' = None) -> 'AsyncIterator[AsyncRealtimeConnection]'
  ```

  | Parameter          | Type                             | Default       | Description |
  | :----------------- | :------------------------------- | :------------ | :---------- |
  | `application`      | `str`                            | -             | -           |
  | `use_jwt`          | `bool`                           | `True`        | -           |
  | `path`             | `str`                            | `'/realtime'` | -           |
  | `max_buffering`    | `int \| None`                    | `None`        | -           |
  | `token_expiration` | `int`                            | `120`         | -           |
  | `encode_message`   | `Optional[Callable[Any, bytes]]` | `None`        | -           |
  | `decode_message`   | `Optional[Callable[bytes, Any]]` | `None`        | -           |

  **Returns:** `AsyncIterator[AsyncRealtimeConnection]`

  #### result

  ```python theme={null}
  async def result(self, application: 'str', request_id: 'str') -> 'AnyJSON'
  ```

  | Parameter     | Type  | Default | Description |
  | :------------ | :---- | :------ | :---------- |
  | `application` | `str` | -       | -           |
  | `request_id`  | `str` | -       | -           |

  **Returns:** `dict[str, Any]`

  #### run

  ```python theme={null}
  async def run(self, application: 'str', arguments: 'AnyJSON', *, path: 'str' = '', timeout: 'Optional[Union[int, float]]' = None, start_timeout: 'Optional[Union[int, float]]' = None, hint: 'str | None' = None, headers: 'dict[str, str]' = {}) -> 'AnyJSON'
  ```

  Run an application with the given arguments (which will be JSON serialized). The path parameter can be used to specify a subpath when applicable. This method will return the result of the inference call directly.

  | Parameter       | Type                       | Default | Description                                                                                                                                              |
  | :-------------- | :------------------------- | :------ | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | `application`   | `str`                      | -       | -                                                                                                                                                        |
  | `arguments`     | `dict[str, Any]`           | -       | -                                                                                                                                                        |
  | `path`          | `str`                      | `''`    | -                                                                                                                                                        |
  | `timeout`       | `int \| float \| NoneType` | `None`  | Client-side HTTP timeout in seconds. Controls how long the HTTP client waits for a response. Defaults to the client's default\_timeout.                  |
  | `start_timeout` | `int \| float \| NoneType` | `None`  | Server-side request timeout in seconds. Limits total time spent waiting before processing starts. Does not apply once the application begins processing. |
  | `hint`          | `str \| None`              | `None`  | -                                                                                                                                                        |
  | `headers`       | `dict[str, str]`           | `\{\}`  | -                                                                                                                                                        |

  **Returns:** `dict[str, Any]`

  #### status

  ```python theme={null}
  async def status(self, application: 'str', request_id: 'str', *, with_logs: 'bool' = False) -> 'Status'
  ```

  | Parameter     | Type   | Default | Description |
  | :------------ | :----- | :------ | :---------- |
  | `application` | `str`  | -       | -           |
  | `request_id`  | `str`  | -       | -           |
  | `with_logs`   | `bool` | `False` | -           |

  **Returns:** `Status`

  #### stream

  ```python theme={null}
  def stream(self, application: 'str', arguments: 'AnyJSON', *, path: 'str' = '/stream', timeout: 'float | None' = None) -> 'AsyncIterator[dict[str, Any]]'
  ```

  Stream the output of an application with the given arguments (which will be JSON serialized). This is only supported at a few select applications at the moment, so be sure to first consult with the documentation of individual applications
  to see if this is supported.

  The function will iterate over each event that is streamed from the server.

  | Parameter     | Type             | Default     | Description |
  | :------------ | :--------------- | :---------- | :---------- |
  | `application` | `str`            | -           | -           |
  | `arguments`   | `dict[str, Any]` | -           | -           |
  | `path`        | `str`            | `'/stream'` | -           |
  | `timeout`     | `float \| None`  | `None`      | -           |

  **Returns:** `AsyncIterator[dict[str, Any]]`

  #### submit

  ```python theme={null}
  async def submit(self, application: 'str', arguments: 'AnyJSON', *, path: 'str' = '', hint: 'str | None' = None, webhook_url: 'str | None' = None, priority: 'Optional[Priority]' = None, headers: 'dict[str, str]' = {}, start_timeout: 'Optional[Union[int, float]]' = None) -> 'AsyncRequestHandle'
  ```

  Submit an application with the given arguments (which will be JSON serialized). The path parameter can be used to specify a subpath when applicable. This method will return a handle to the request that can be used to check the status
  and retrieve the result of the inference call when it is done.

  | Parameter       | Type                             | Default | Description                                                                                                                                                                                          |
  | :-------------- | :------------------------------- | :------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | `application`   | `str`                            | -       | -                                                                                                                                                                                                    |
  | `arguments`     | `dict[str, Any]`                 | -       | -                                                                                                                                                                                                    |
  | `path`          | `str`                            | `''`    | -                                                                                                                                                                                                    |
  | `hint`          | `str \| None`                    | `None`  | -                                                                                                                                                                                                    |
  | `webhook_url`   | `str \| None`                    | `None`  | -                                                                                                                                                                                                    |
  | `priority`      | `Optional[Literal[normal, low]]` | `None`  | -                                                                                                                                                                                                    |
  | `headers`       | `dict[str, str]`                 | `\{\}`  | -                                                                                                                                                                                                    |
  | `start_timeout` | `int \| float \| NoneType`       | `None`  | Server-side request timeout in seconds. Limits total time spent waiting before processing starts (includes queue wait, retries, and routing). Does not apply once the application begins processing. |

  **Returns:** `AsyncRequestHandle`

  #### subscribe

  ```python theme={null}
  async def subscribe(self, application: 'str', arguments: 'AnyJSON', *, path: 'str' = '', hint: 'str | None' = None, with_logs: 'bool' = False, on_enqueue: 'Optional[Callable[[str], None]]' = None, on_queue_update: 'Optional[Callable[[Status], None]]' = None, priority: 'Optional[Priority]' = None, headers: 'dict[str, str]' = {}, start_timeout: 'Optional[Union[int, float]]' = None, client_timeout: 'Optional[Union[int, float]]' = None) -> 'AnyJSON'
  ```

  Subscribe to an application and wait for the result.

  | Parameter         | Type                                   | Default | Description                                                                                                                                                                                          |
  | :---------------- | :------------------------------------- | :------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | `application`     | `str`                                  | -       | -                                                                                                                                                                                                    |
  | `arguments`       | `dict[str, Any]`                       | -       | -                                                                                                                                                                                                    |
  | `path`            | `str`                                  | `''`    | -                                                                                                                                                                                                    |
  | `hint`            | `str \| None`                          | `None`  | -                                                                                                                                                                                                    |
  | `with_logs`       | `bool`                                 | `False` | -                                                                                                                                                                                                    |
  | `on_enqueue`      | `Optional[Callable[str, NoneType]]`    | `None`  | -                                                                                                                                                                                                    |
  | `on_queue_update` | `Optional[Callable[Status, NoneType]]` | `None`  | -                                                                                                                                                                                                    |
  | `priority`        | `Optional[Literal[normal, low]]`       | `None`  | -                                                                                                                                                                                                    |
  | `headers`         | `dict[str, str]`                       | `\{\}`  | -                                                                                                                                                                                                    |
  | `start_timeout`   | `int \| float \| NoneType`             | `None`  | Server-side request timeout in seconds. Limits total time spent waiting before processing starts (includes queue wait, retries, and routing). Does not apply once the application begins processing. |
  | `client_timeout`  | `int \| float \| NoneType`             | `None`  | Client-side total timeout in seconds. Limits the total time spent waiting for the entire request to complete (including queue wait and processing). If not set, waits indefinitely.                  |

  **Returns:** `dict[str, Any]`

  #### upload

  ```python theme={null}
  async def upload(self, data: 'str | bytes', content_type: 'str', file_name: 'str | None' = None, *, repository: 'UploadRepositoryId | None' = None, fallback_repository: 'UploadRepositoryId | list[UploadRepositoryId] | None' = None) -> 'str'
  ```

  Upload the given data blob to the CDN and return the access URL. The content type should be specified as the second argument. Use upload\_file or upload\_image for convenience.

  | Parameter             | Type                                                                       | Default | Description |
  | :-------------------- | :------------------------------------------------------------------------- | :------ | :---------- |
  | `data`                | `str \| bytes`                                                             | -       | -           |
  | `content_type`        | `str`                                                                      | -       | -           |
  | `file_name`           | `str \| None`                                                              | `None`  | -           |
  | `repository`          | `Optional[Literal[fal_v3, cdn, fal]]`                                      | `None`  | -           |
  | `fallback_repository` | `Literal[fal_v3, cdn, fal] \| list[Literal[fal_v3, cdn, fal]] \| NoneType` | `None`  | -           |

  **Returns:** `str`

  #### upload\_file

  ```python theme={null}
  async def upload_file(self, path: 'os.PathLike', *, repository: 'UploadRepositoryId | None' = None, fallback_repository: 'UploadRepositoryId | list[UploadRepositoryId] | None' = None) -> 'str'
  ```

  Upload a file from the local filesystem to the CDN and return the access URL.

  | Parameter             | Type                                                                       | Default | Description |
  | :-------------------- | :------------------------------------------------------------------------- | :------ | :---------- |
  | `path`                | `PathLike`                                                                 | -       | -           |
  | `repository`          | `Optional[Literal[fal_v3, cdn, fal]]`                                      | `None`  | -           |
  | `fallback_repository` | `Literal[fal_v3, cdn, fal] \| list[Literal[fal_v3, cdn, fal]] \| NoneType` | `None`  | -           |

  **Returns:** `str`

  #### upload\_image

  ```python theme={null}
  async def upload_image(self, image: 'Image.Image', format: 'str' = 'jpeg', *, repository: 'UploadRepositoryId | None' = None, fallback_repository: 'UploadRepositoryId | list[UploadRepositoryId] | None' = None) -> 'str'
  ```

  Upload a pillow image object to the CDN and return the access URL.

  | Parameter             | Type                                                     | Default  | Description |
  | :-------------------- | :------------------------------------------------------- | :------- | :---------- |
  | `image`               | `Image.Image`                                            | -        | -           |
  | `format`              | `str`                                                    | `'jpeg'` | -           |
  | `repository`          | `UploadRepositoryId \| None`                             | `None`   | -           |
  | `fallback_repository` | `UploadRepositoryId \| list[UploadRepositoryId] \| None` | `None`   | -           |

  #### ws\_connect

  ```python theme={null}
  def ws_connect(self, application: 'str', *, use_jwt: 'bool' = True, path: 'str' = '', max_buffering: 'int | None' = None, token_expiration: 'int' = 120) -> "AsyncIterator['WebSocketClientProtocol']"
  ```

  | Parameter          | Type          | Default | Description |
  | :----------------- | :------------ | :------ | :---------- |
  | `application`      | `str`         | -       | -           |
  | `use_jwt`          | `bool`        | `True`  | -           |
  | `path`             | `str`         | `''`    | -           |
  | `max_buffering`    | `int \| None` | `None`  | -           |
  | `token_expiration` | `int`         | `120`   | -           |

### RealtimeConnection

```python theme={null}
class fal_client.RealtimeConnection
```

Synchronous realtime connection wrapper.

  | Name              | Type                             | Default | Description |
  | :---------------- | :------------------------------- | :------ | :---------- |
  | `_ws`             | `'Connection'`                   | -       | -           |
  | `_encode_message` | `Callable[[Any], bytes] \| None` | `None`  | -           |
  | `_decode_message` | `Callable[[bytes], Any] \| None` | `None`  | -           |

  #### close

  ```python theme={null}
  def close(self) -> 'None'
  ```

  **Returns:** `NoneType`

  #### recv

  ```python theme={null}
  def recv(self) -> 'dict[str, Any] | None'
  ```

  **Returns:** `dict[str, Any] | None`

  #### send

  ```python theme={null}
  def send(self, arguments: 'dict[str, Any]') -> 'None'
  ```

  | Parameter   | Type             | Default | Description |
  | :---------- | :--------------- | :------ | :---------- |
  | `arguments` | `dict[str, Any]` | -       | -           |

  **Returns:** `NoneType`

### AsyncRealtimeConnection

```python theme={null}
class fal_client.AsyncRealtimeConnection
```

Asynchronous realtime connection wrapper.

  | Name              | Type                             | Default | Description |
  | :---------------- | :------------------------------- | :------ | :---------- |
  | `_ws`             | `'WebSocketClientProtocol'`      | -       | -           |
  | `_encode_message` | `Callable[[Any], bytes] \| None` | `None`  | -           |
  | `_decode_message` | `Callable[[bytes], Any] \| None` | `None`  | -           |

  #### close

  ```python theme={null}
  async def close(self) -> 'None'
  ```

  **Returns:** `NoneType`

  #### recv

  ```python theme={null}
  async def recv(self) -> 'dict[str, Any] | None'
  ```

  **Returns:** `dict[str, Any] | None`

  #### send

  ```python theme={null}
  async def send(self, arguments: 'dict[str, Any]') -> 'None'
  ```

  | Parameter   | Type             | Default | Description |
  | :---------- | :--------------- | :------ | :---------- |
  | `arguments` | `dict[str, Any]` | -       | -           |

  **Returns:** `NoneType`

### Status

```python theme={null}
class fal_client.Status
```

### Queued

```python theme={null}
class fal_client.Queued
```

Indicates the request is enqueued and waiting to be processed. The position field indicates the relative position in the queue (0-indexed).

> **Inherits from:** `Status`

  | Name       | Type  | Default | Description |
  | :--------- | :---- | :------ | :---------- |
  | `position` | `int` | -       | -           |

  | Name       | Type  | Default | Description |
  | :--------- | :---- | :------ | :---------- |
  | `position` | `int` | -       | -           |

### InProgress

```python theme={null}
class fal_client.InProgress
```

Indicates the request is currently being processed. If the status operation called with the `with_logs` parameter set to True, the logs field will be a list of
log objects.

> **Inherits from:** `Status`

  | Name   | Type                           | Default | Description |
  | :----- | :----------------------------- | :------ | :---------- |
  | `logs` | `list[dict[str, Any]] \| None` | -       | -           |

  | Name   | Type                           | Default | Description |
  | :----- | :----------------------------- | :------ | :---------- |
  | `logs` | `list[dict[str, Any]] \| None` | -       | -           |

### Completed

```python theme={null}
class fal_client.Completed
```

Indicates the request has been completed and the result can be gathered. The logs field will contain the logs if the status operation was called with the `with_logs` parameter set to True. Metrics
might contain the inference time, and other internal metadata (number of tokens
processed, etc.).

> **Inherits from:** `Status`

  | Name      | Type                           | Default | Description |
  | :-------- | :----------------------------- | :------ | :---------- |
  | `logs`    | `list[dict[str, Any]] \| None` | -       | -           |
  | `metrics` | `dict[str, Any]`               | -       | -           |

  | Name      | Type                           | Default | Description |
  | :-------- | :----------------------------- | :------ | :---------- |
  | `logs`    | `list[dict[str, Any]] \| None` | -       | -           |
  | `metrics` | `dict[str, Any]`               | -       | -           |

### SyncRequestHandle

```python theme={null}
class fal_client.SyncRequestHandle
```

> **Inherits from:** `_BaseRequestHandle`

  | Name           | Type     | Default | Description |
  | :------------- | :------- | :------ | :---------- |
  | `request_id`   | `str`    | -       | -           |
  | `response_url` | `str`    | -       | -           |
  | `status_url`   | `str`    | -       | -           |
  | `cancel_url`   | `str`    | -       | -           |
  | `client`       | `Client` | -       | -           |

  | Name     | Type           | Default | Description |
  | :------- | :------------- | :------ | :---------- |
  | `client` | `httpx.Client` | -       | -           |

  #### cancel

  ```python theme={null}
  def cancel(self) -> 'None'
  ```

  Cancel the request.

  **Returns:** `NoneType`

  #### from\_request\_id

  ```python theme={null}
  def from_request_id(cls, client: 'httpx.Client', application: 'str', request_id: 'str') -> 'SyncRequestHandle'
  ```

  | Parameter     | Type     | Default | Description |
  | :------------ | :------- | :------ | :---------- |
  | `client`      | `Client` | -       | -           |
  | `application` | `str`    | -       | -           |
  | `request_id`  | `str`    | -       | -           |

  **Returns:** `SyncRequestHandle`

  #### get

  ```python theme={null}
  def get(self) -> 'AnyJSON'
  ```

  Wait till the request is completed and return the result of the inference call.

  **Returns:** `dict[str, Any]`

  #### iter\_events

  ```python theme={null}
  def iter_events(self, *, with_logs: 'bool' = False, interval: 'float' = 0.1) -> 'Iterator[Status]'
  ```

  Continuously poll for the status of the request and yield it at each interval till the request is completed. If `with_logs` is True, logs will be included in the response.

  | Parameter   | Type    | Default | Description |
  | :---------- | :------ | :------ | :---------- |
  | `with_logs` | `bool`  | `False` | -           |
  | `interval`  | `float` | `0.1`   | -           |

  **Returns:** `Iterator[Status]`

  #### status

  ```python theme={null}
  def status(self, *, with_logs: 'bool' = False) -> 'Status'
  ```

  Returns the status of the request (which can be one of the following: Queued, InProgress, Completed). If `with_logs` is True, logs will be included
  for InProgress and Completed statuses.

  | Parameter   | Type   | Default | Description |
  | :---------- | :----- | :------ | :---------- |
  | `with_logs` | `bool` | `False` | -           |

  **Returns:** `Status`

### AsyncRequestHandle

```python theme={null}
class fal_client.AsyncRequestHandle
```

> **Inherits from:** `_BaseRequestHandle`

  | Name           | Type          | Default | Description |
  | :------------- | :------------ | :------ | :---------- |
  | `request_id`   | `str`         | -       | -           |
  | `response_url` | `str`         | -       | -           |
  | `status_url`   | `str`         | -       | -           |
  | `cancel_url`   | `str`         | -       | -           |
  | `client`       | `AsyncClient` | -       | -           |

  | Name     | Type                | Default | Description |
  | :------- | :------------------ | :------ | :---------- |
  | `client` | `httpx.AsyncClient` | -       | -           |

  #### cancel

  ```python theme={null}
  async def cancel(self) -> 'None'
  ```

  Cancel the request.

  **Returns:** `NoneType`

  #### from\_request\_id

  ```python theme={null}
  def from_request_id(cls, client: 'httpx.AsyncClient', application: 'str', request_id: 'str') -> 'AsyncRequestHandle'
  ```

  | Parameter     | Type          | Default | Description |
  | :------------ | :------------ | :------ | :---------- |
  | `client`      | `AsyncClient` | -       | -           |
  | `application` | `str`         | -       | -           |
  | `request_id`  | `str`         | -       | -           |

  **Returns:** `AsyncRequestHandle`

  #### get

  ```python theme={null}
  async def get(self) -> 'AnyJSON'
  ```

  Wait till the request is completed and return the result.

  **Returns:** `dict[str, Any]`

  #### iter\_events

  ```python theme={null}
  def iter_events(self, *, with_logs: 'bool' = False, interval: 'float' = 0.1) -> 'AsyncIterator[Status]'
  ```

  Continuously poll for the status of the request and yield it at each interval till the request is completed. If `with_logs` is True, logs will be included in the response.

  | Parameter   | Type    | Default | Description |
  | :---------- | :------ | :------ | :---------- |
  | `with_logs` | `bool`  | `False` | -           |
  | `interval`  | `float` | `0.1`   | -           |

  **Returns:** `AsyncIterator[Status]`

  #### status

  ```python theme={null}
  async def status(self, *, with_logs: 'bool' = False) -> 'Status'
  ```

  Returns the status of the request (which can be one of the following: Queued, InProgress, Completed). If `with_logs` is True, logs will be included
  for InProgress and Completed statuses.

  | Parameter   | Type   | Default | Description |
  | :---------- | :----- | :------ | :---------- |
  | `with_logs` | `bool` | `False` | -           |

  **Returns:** `Status`

***

## Functions

### run

```python theme={null}
def run(self, application: 'str', arguments: 'AnyJSON', *, path: 'str' = '', timeout: 'Optional[Union[int, float]]' = None, start_timeout: 'Optional[Union[int, float]]' = None, hint: 'str | None' = None, headers: 'dict[str, str]' = {}) -> 'AnyJSON'
```

Run an application with the given arguments (which will be JSON serialized).

| Parameter       | Type                       | Default | Description                                                                                                                                              |
| :-------------- | :------------------------- | :------ | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `application`   | `str`                      | -       | -                                                                                                                                                        |
| `arguments`     | `dict[str, Any]`           | -       | -                                                                                                                                                        |
| `path`          | `str`                      | `''`    | -                                                                                                                                                        |
| `timeout`       | `int \| float \| NoneType` | `None`  | Client-side HTTP timeout in seconds. Controls how long the HTTP client waits for a response. Defaults to the client's default\_timeout.                  |
| `start_timeout` | `int \| float \| NoneType` | `None`  | Server-side request timeout in seconds. Limits total time spent waiting before processing starts. Does not apply once the application begins processing. |
| `hint`          | `str \| None`              | `None`  | -                                                                                                                                                        |
| `headers`       | `dict[str, str]`           | `\{\}`  | -                                                                                                                                                        |

**Returns:** `dict[str, Any]`

### subscribe\_async

```python theme={null}
async def subscribe_async(self, application: 'str', arguments: 'AnyJSON', *, path: 'str' = '', hint: 'str | None' = None, with_logs: 'bool' = False, on_enqueue: 'Optional[Callable[[str], None]]' = None, on_queue_update: 'Optional[Callable[[Status], None]]' = None, priority: 'Optional[Priority]' = None, headers: 'dict[str, str]' = {}, start_timeout: 'Optional[Union[int, float]]' = None, client_timeout: 'Optional[Union[int, float]]' = None) -> 'AnyJSON'
```

Subscribe to an application and wait for the result.

| Parameter         | Type                                   | Default | Description                                                                                                                                                                                          |
| :---------------- | :------------------------------------- | :------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `application`     | `str`                                  | -       | -                                                                                                                                                                                                    |
| `arguments`       | `dict[str, Any]`                       | -       | -                                                                                                                                                                                                    |
| `path`            | `str`                                  | `''`    | -                                                                                                                                                                                                    |
| `hint`            | `str \| None`                          | `None`  | -                                                                                                                                                                                                    |
| `with_logs`       | `bool`                                 | `False` | -                                                                                                                                                                                                    |
| `on_enqueue`      | `Optional[Callable[str, NoneType]]`    | `None`  | -                                                                                                                                                                                                    |
| `on_queue_update` | `Optional[Callable[Status, NoneType]]` | `None`  | -                                                                                                                                                                                                    |
| `priority`        | `Optional[Literal[normal, low]]`       | `None`  | -                                                                                                                                                                                                    |
| `headers`         | `dict[str, str]`                       | `\{\}`  | -                                                                                                                                                                                                    |
| `start_timeout`   | `int \| float \| NoneType`             | `None`  | Server-side request timeout in seconds. Limits total time spent waiting before processing starts (includes queue wait, retries, and routing). Does not apply once the application begins processing. |
| `client_timeout`  | `int \| float \| NoneType`             | `None`  | Client-side total timeout in seconds. Limits the total time spent waiting for the entire request to complete (including queue wait and processing). If not set, waits indefinitely.                  |

**Returns:** `dict[str, Any]`

### subscribe

```python theme={null}
def subscribe(self, application: 'str', arguments: 'AnyJSON', *, path: 'str' = '', hint: 'str | None' = None, with_logs: 'bool' = False, on_enqueue: 'Optional[Callable[[str], None]]' = None, on_queue_update: 'Optional[Callable[[Status], None]]' = None, priority: 'Optional[Priority]' = None, headers: 'dict[str, str]' = {}, start_timeout: 'Optional[Union[int, float]]' = None, client_timeout: 'Optional[Union[int, float]]' = None) -> 'AnyJSON'
```

Subscribe to an application and wait for the result.

| Parameter         | Type                                   | Default | Description                                                                                                                                                                                          |
| :---------------- | :------------------------------------- | :------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `application`     | `str`                                  | -       | -                                                                                                                                                                                                    |
| `arguments`       | `dict[str, Any]`                       | -       | -                                                                                                                                                                                                    |
| `path`            | `str`                                  | `''`    | -                                                                                                                                                                                                    |
| `hint`            | `str \| None`                          | `None`  | -                                                                                                                                                                                                    |
| `with_logs`       | `bool`                                 | `False` | -                                                                                                                                                                                                    |
| `on_enqueue`      | `Optional[Callable[str, NoneType]]`    | `None`  | -                                                                                                                                                                                                    |
| `on_queue_update` | `Optional[Callable[Status, NoneType]]` | `None`  | -                                                                                                                                                                                                    |
| `priority`        | `Optional[Literal[normal, low]]`       | `None`  | -                                                                                                                                                                                                    |
| `headers`         | `dict[str, str]`                       | `\{\}`  | -                                                                                                                                                                                                    |
| `start_timeout`   | `int \| float \| NoneType`             | `None`  | Server-side request timeout in seconds. Limits total time spent waiting before processing starts (includes queue wait, retries, and routing). Does not apply once the application begins processing. |
| `client_timeout`  | `int \| float \| NoneType`             | `None`  | Client-side total timeout in seconds. Limits the total time spent waiting for the entire request to complete (including queue wait and processing). If not set, waits indefinitely.                  |

**Returns:** `dict[str, Any]`

### submit

```python theme={null}
def submit(self, application: 'str', arguments: 'AnyJSON', *, path: 'str' = '', hint: 'str | None' = None, webhook_url: 'str | None' = None, priority: 'Optional[Priority]' = None, headers: 'dict[str, str]' = {}, start_timeout: 'Optional[Union[int, float]]' = None) -> 'SyncRequestHandle'
```

Submit an application with the given arguments (which will be JSON serialized).

| Parameter       | Type                             | Default | Description                                                                                                                                                                                          |
| :-------------- | :------------------------------- | :------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `application`   | `str`                            | -       | -                                                                                                                                                                                                    |
| `arguments`     | `dict[str, Any]`                 | -       | -                                                                                                                                                                                                    |
| `path`          | `str`                            | `''`    | -                                                                                                                                                                                                    |
| `hint`          | `str \| None`                    | `None`  | -                                                                                                                                                                                                    |
| `webhook_url`   | `str \| None`                    | `None`  | -                                                                                                                                                                                                    |
| `priority`      | `Optional[Literal[normal, low]]` | `None`  | -                                                                                                                                                                                                    |
| `headers`       | `dict[str, str]`                 | `\{\}`  | -                                                                                                                                                                                                    |
| `start_timeout` | `int \| float \| NoneType`       | `None`  | Server-side request timeout in seconds. Limits total time spent waiting before processing starts (includes queue wait, retries, and routing). Does not apply once the application begins processing. |

**Returns:** `SyncRequestHandle`

### stream

```python theme={null}
def stream(self, application: 'str', arguments: 'AnyJSON', *, path: 'str' = '/stream', timeout: 'float | None' = None) -> 'Iterator[dict[str, Any]]'
```

Stream the output of an application with the given arguments (which will be JSON serialized). This is only supported at a few select applications at the moment, so be sure to first consult with the documentation of individual applications
to see if this is supported.

The function will iterate over each event that is streamed from the server.

| Parameter     | Type             | Default     | Description |
| :------------ | :--------------- | :---------- | :---------- |
| `application` | `str`            | -           | -           |
| `arguments`   | `dict[str, Any]` | -           | -           |
| `path`        | `str`            | `'/stream'` | -           |
| `timeout`     | `float \| None`  | `None`      | -           |

**Returns:** `Iterator[dict[str, Any]]`

### run\_async

```python theme={null}
async def run_async(self, application: 'str', arguments: 'AnyJSON', *, path: 'str' = '', timeout: 'Optional[Union[int, float]]' = None, start_timeout: 'Optional[Union[int, float]]' = None, hint: 'str | None' = None, headers: 'dict[str, str]' = {}) -> 'AnyJSON'
```

Run an application with the given arguments (which will be JSON serialized). The path parameter can be used to specify a subpath when applicable. This method will return the result of the inference call directly.

| Parameter       | Type                       | Default | Description                                                                                                                                              |
| :-------------- | :------------------------- | :------ | :------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `application`   | `str`                      | -       | -                                                                                                                                                        |
| `arguments`     | `dict[str, Any]`           | -       | -                                                                                                                                                        |
| `path`          | `str`                      | `''`    | -                                                                                                                                                        |
| `timeout`       | `int \| float \| NoneType` | `None`  | Client-side HTTP timeout in seconds. Controls how long the HTTP client waits for a response. Defaults to the client's default\_timeout.                  |
| `start_timeout` | `int \| float \| NoneType` | `None`  | Server-side request timeout in seconds. Limits total time spent waiting before processing starts. Does not apply once the application begins processing. |
| `hint`          | `str \| None`              | `None`  | -                                                                                                                                                        |
| `headers`       | `dict[str, str]`           | `\{\}`  | -                                                                                                                                                        |

**Returns:** `dict[str, Any]`

### submit\_async

```python theme={null}
async def submit_async(self, application: 'str', arguments: 'AnyJSON', *, path: 'str' = '', hint: 'str | None' = None, webhook_url: 'str | None' = None, priority: 'Optional[Priority]' = None, headers: 'dict[str, str]' = {}, start_timeout: 'Optional[Union[int, float]]' = None) -> 'AsyncRequestHandle'
```

Submit an application with the given arguments (which will be JSON serialized). The path parameter can be used to specify a subpath when applicable. This method will return a handle to the request that can be used to check the status
and retrieve the result of the inference call when it is done.

| Parameter       | Type                             | Default | Description                                                                                                                                                                                          |
| :-------------- | :------------------------------- | :------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `application`   | `str`                            | -       | -                                                                                                                                                                                                    |
| `arguments`     | `dict[str, Any]`                 | -       | -                                                                                                                                                                                                    |
| `path`          | `str`                            | `''`    | -                                                                                                                                                                                                    |
| `hint`          | `str \| None`                    | `None`  | -                                                                                                                                                                                                    |
| `webhook_url`   | `str \| None`                    | `None`  | -                                                                                                                                                                                                    |
| `priority`      | `Optional[Literal[normal, low]]` | `None`  | -                                                                                                                                                                                                    |
| `headers`       | `dict[str, str]`                 | `\{\}`  | -                                                                                                                                                                                                    |
| `start_timeout` | `int \| float \| NoneType`       | `None`  | Server-side request timeout in seconds. Limits total time spent waiting before processing starts (includes queue wait, retries, and routing). Does not apply once the application begins processing. |

**Returns:** `AsyncRequestHandle`

### stream\_async

```python theme={null}
def stream_async(self, application: 'str', arguments: 'AnyJSON', *, path: 'str' = '/stream', timeout: 'float | None' = None) -> 'AsyncIterator[dict[str, Any]]'
```

Stream the output of an application with the given arguments (which will be JSON serialized). This is only supported at a few select applications at the moment, so be sure to first consult with the documentation of individual applications
to see if this is supported.

The function will iterate over each event that is streamed from the server.

| Parameter     | Type             | Default     | Description |
| :------------ | :--------------- | :---------- | :---------- |
| `application` | `str`            | -           | -           |
| `arguments`   | `dict[str, Any]` | -           | -           |
| `path`        | `str`            | `'/stream'` | -           |
| `timeout`     | `float \| None`  | `None`      | -           |

**Returns:** `AsyncIterator[dict[str, Any]]`

### realtime

```python theme={null}
def realtime(self, application: 'str', *, use_jwt: 'bool' = True, path: 'str' = '/realtime', max_buffering: 'int | None' = None, token_expiration: 'int' = 120, encode_message: 'Callable[[Any], bytes] | None' = None, decode_message: 'Callable[[bytes], Any] | None' = None) -> 'Iterator[RealtimeConnection]'
```

| Parameter          | Type                             | Default       | Description |
| :----------------- | :------------------------------- | :------------ | :---------- |
| `application`      | `str`                            | -             | -           |
| `use_jwt`          | `bool`                           | `True`        | -           |
| `path`             | `str`                            | `'/realtime'` | -           |
| `max_buffering`    | `int \| None`                    | `None`        | -           |
| `token_expiration` | `int`                            | `120`         | -           |
| `encode_message`   | `Optional[Callable[Any, bytes]]` | `None`        | -           |
| `decode_message`   | `Optional[Callable[bytes, Any]]` | `None`        | -           |

**Returns:** `Iterator[RealtimeConnection]`

### realtime\_async

```python theme={null}
def realtime_async(self, application: 'str', *, use_jwt: 'bool' = True, path: 'str' = '/realtime', max_buffering: 'int | None' = None, token_expiration: 'int' = 120, encode_message: 'Callable[[Any], bytes] | None' = None, decode_message: 'Callable[[bytes], Any] | None' = None) -> 'AsyncIterator[AsyncRealtimeConnection]'
```

| Parameter          | Type                             | Default       | Description |
| :----------------- | :------------------------------- | :------------ | :---------- |
| `application`      | `str`                            | -             | -           |
| `use_jwt`          | `bool`                           | `True`        | -           |
| `path`             | `str`                            | `'/realtime'` | -           |
| `max_buffering`    | `int \| None`                    | `None`        | -           |
| `token_expiration` | `int`                            | `120`         | -           |
| `encode_message`   | `Optional[Callable[Any, bytes]]` | `None`        | -           |
| `decode_message`   | `Optional[Callable[bytes, Any]]` | `None`        | -           |

**Returns:** `AsyncIterator[AsyncRealtimeConnection]`

### cancel

```python theme={null}
def cancel(self, application: 'str', request_id: 'str') -> 'None'
```

| Parameter     | Type  | Default | Description |
| :------------ | :---- | :------ | :---------- |
| `application` | `str` | -       | -           |
| `request_id`  | `str` | -       | -           |

**Returns:** `NoneType`

### cancel\_async

```python theme={null}
async def cancel_async(self, application: 'str', request_id: 'str') -> 'None'
```

| Parameter     | Type  | Default | Description |
| :------------ | :---- | :------ | :---------- |
| `application` | `str` | -       | -           |
| `request_id`  | `str` | -       | -           |

**Returns:** `NoneType`

### status

```python theme={null}
def status(self, application: 'str', request_id: 'str', *, with_logs: 'bool' = False) -> 'Status'
```

| Parameter     | Type   | Default | Description |
| :------------ | :----- | :------ | :---------- |
| `application` | `str`  | -       | -           |
| `request_id`  | `str`  | -       | -           |
| `with_logs`   | `bool` | `False` | -           |

**Returns:** `Status`

### status\_async

```python theme={null}
async def status_async(self, application: 'str', request_id: 'str', *, with_logs: 'bool' = False) -> 'Status'
```

| Parameter     | Type   | Default | Description |
| :------------ | :----- | :------ | :---------- |
| `application` | `str`  | -       | -           |
| `request_id`  | `str`  | -       | -           |
| `with_logs`   | `bool` | `False` | -           |

**Returns:** `Status`

### result

```python theme={null}
def result(self, application: 'str', request_id: 'str') -> 'AnyJSON'
```

| Parameter     | Type  | Default | Description |
| :------------ | :---- | :------ | :---------- |
| `application` | `str` | -       | -           |
| `request_id`  | `str` | -       | -           |

**Returns:** `dict[str, Any]`

### result\_async

```python theme={null}
async def result_async(self, application: 'str', request_id: 'str') -> 'AnyJSON'
```

| Parameter     | Type  | Default | Description |
| :------------ | :---- | :------ | :---------- |
| `application` | `str` | -       | -           |
| `request_id`  | `str` | -       | -           |

**Returns:** `dict[str, Any]`

### encode

```python theme={null}
def encode(data: 'str | bytes', content_type: 'str') -> 'str'
```

Encode the given data blob to a data URL with the specified content type.

| Parameter      | Type           | Default | Description |
| :------------- | :------------- | :------ | :---------- |
| `data`         | `str \| bytes` | -       | -           |
| `content_type` | `str`          | -       | -           |

**Returns:** `str`

### encode\_file

```python theme={null}
def encode_file(path: 'os.PathLike') -> 'str'
```

Encode a file from the local filesystem to a data URL with the inferred content type.

| Parameter | Type       | Default | Description |
| :-------- | :--------- | :------ | :---------- |
| `path`    | `PathLike` | -       | -           |

**Returns:** `str`

### encode\_image

```python theme={null}
def encode_image(image: 'Image.Image', format: 'str' = 'jpeg') -> 'str'
```

Encode a pillow image object to a data URL with the specified format.

| Parameter | Type          | Default  | Description |
| :-------- | :------------ | :------- | :---------- |
| `image`   | `Image.Image` | -        | -           |
| `format`  | `str`         | `'jpeg'` | -           |
