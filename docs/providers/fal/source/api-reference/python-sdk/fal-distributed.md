# fal.distributed

**Source:** https://fal.ai/docs/api-reference/python-sdk/fal-distributed.md

> ## Documentation Index
> Fetch the complete documentation index at: https://fal.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# fal.distributed

> API reference for fal.distributed

```python theme={null}
from fal.distributed import DistributedRunner, DistributedWorker
```

## Classes

### DistributedRunner

```python theme={null}
class fal.distributed.DistributedRunner
```

A class to launch and manage distributed workers.

  | Name                 | Type                       | Default                                                | Description |
  | :------------------- | :------------------------- | :----------------------------------------------------- | :---------- |
  | `worker_cls`         | `type[DistributedWorker]`  | `\<class 'fal.distributed.worker.DistributedWorker'\>` | -           |
  | `world_size`         | `int`                      | `1`                                                    | -           |
  | `master_addr`        | `str`                      | `'127.0.0.1'`                                          | -           |
  | `master_port`        | `int`                      | `29500`                                                | -           |
  | `worker_addr`        | `str`                      | `'127.0.0.1'`                                          | -           |
  | `worker_port`        | `int`                      | `54923`                                                | -           |
  | `timeout`            | `int`                      | `86400`                                                | -           |
  | `keepalive_payload`  | `dict[str, Any]`           | `\{\}`                                                 | -           |
  | `keepalive_interval` | `int \| float \| NoneType` | `None`                                                 | -           |
  | `cwd`                | `str \| Path \| NoneType`  | `None`                                                 | -           |
  | `set_device`         | `Optional[bool]`           | `None`                                                 | -           |

  | Name              | Type                          | Default | Description |
  | :---------------- | :---------------------------- | :------ | :---------- |
  | `zmq_socket`      | `Optional[Socket[Any]]`       | -       | -           |
  | `context`         | `Optional[mp.ProcessContext]` | -       | -           |
  | `keepalive_timer` | `Optional[KeepAliveTimer]`    | -       | -           |

  #### close\_zmq\_socket

  ```python theme={null}
  def close_zmq_socket(self) -> 'None'
  ```

  Closes the ZeroMQ socket.

  **Returns:** `NoneType`

  #### ensure\_alive

  ```python theme={null}
  def ensure_alive(self) -> 'None'
  ```

  Ensures that the distributed worker processes are alive. If the processes are not alive, it raises an error.

  **Returns:** `NoneType`

  #### gather\_errors

  ```python theme={null}
  def gather_errors(self) -> 'list[Exception]'
  ```

  Gathers errors from the distributed worker processes. This method should be called to collect any errors that occurred
  during execution.

  **Returns:** `list[Exception]`

  #### get\_zmq\_socket

  ```python theme={null}
  def get_zmq_socket(self) -> 'Socket[Any]'
  ```

  Returns a ZeroMQ socket of the specified type.

  **Returns:** `A ZeroMQ socket.`

  #### invoke

  ```python theme={null}
  async def invoke(self, payload: 'dict[str, Any]' = {}, timeout: 'Optional[int]' = None) -> 'Any'
  ```

  Invokes the distributed worker with the given payload.

  | Parameter | Type             | Default | Description                            |
  | :-------- | :--------------- | :------ | :------------------------------------- |
  | `payload` | `dict[str, Any]` | `\{\}`  | The payload to send to the worker.     |
  | `timeout` | `Optional[int]`  | `None`  | The timeout for the overall operation. |

  **Returns:** `Any`

  #### is\_alive

  ```python theme={null}
  def is_alive(self) -> 'bool'
  ```

  Check if the distributed worker processes are alive.

  **Returns:** `bool`

  #### keepalive

  ```python theme={null}
  def keepalive(self, timeout: 'Optional[Union[int, float]]' = 60.0) -> 'None'
  ```

  Sends the keepalive payload to the worker.

  | Parameter | Type                       | Default | Description |
  | :-------- | :------------------------- | :------ | :---------- |
  | `timeout` | `int \| float \| NoneType` | `60.0`  | -           |

  **Returns:** `NoneType`

  #### maybe\_cancel\_keepalive

  ```python theme={null}
  def maybe_cancel_keepalive(self) -> 'None'
  ```

  Cancels the keepalive timer if it is set.

  **Returns:** `NoneType`

  #### maybe\_reset\_keepalive

  ```python theme={null}
  def maybe_reset_keepalive(self) -> 'None'
  ```

  Resets the keepalive timer if it is set.

  **Returns:** `NoneType`

  #### maybe\_start\_keepalive

  ```python theme={null}
  def maybe_start_keepalive(self) -> 'None'
  ```

  Starts the keepalive timer if it is set.

  **Returns:** `NoneType`

  #### run

  ```python theme={null}
  def run(self, **kwargs: 'Any') -> 'None'
  ```

  The main function to run the distributed worker. This function is called by each worker process spawned by
  `torch.multiprocessing.spawn`. This method must be synchronous.

  | Parameter | Type  | Default | Description                          |
  | :-------- | :---- | :------ | :----------------------------------- |
  | `kwargs`  | `Any` | -       | The arguments to pass to the worker. |

  **Returns:** `NoneType`

  #### start

  ```python theme={null}
  async def start(self, timeout: 'int' = 1800, **kwargs: 'Any') -> 'None'
  ```

  Starts the distributed worker processes.

  | Parameter | Type  | Default | Description                                |
  | :-------- | :---- | :------ | :----------------------------------------- |
  | `timeout` | `int` | `1800`  | The timeout for the distributed processes. |
  | `kwargs`  | `Any` | -       | -                                          |

  **Returns:** `NoneType`

  #### stop

  ```python theme={null}
  async def stop(self, timeout: 'int' = 10) -> 'None'
  ```

  Stops the distributed worker processes.

  | Parameter | Type  | Default | Description                                        |
  | :-------- | :---- | :------ | :------------------------------------------------- |
  | `timeout` | `int` | `10`    | The timeout for the distributed processes to stop. |

  **Returns:** `NoneType`

  #### stream

  ```python theme={null}
  def stream(self, payload: 'dict[str, Any]' = {}, timeout: 'Optional[int]' = None, streaming_timeout: 'Optional[int]' = None, as_text_events: 'bool' = False) -> 'AsyncIterator[Any]'
  ```

  Streams the result from the distributed worker.

  | Parameter           | Type             | Default | Description                              |
  | :------------------ | :--------------- | :------ | :--------------------------------------- |
  | `payload`           | `dict[str, Any]` | `\{\}`  | The payload to send to the worker.       |
  | `timeout`           | `Optional[int]`  | `None`  | The timeout for the overall operation.   |
  | `streaming_timeout` | `Optional[int]`  | `None`  | The timeout in-between streamed results. |
  | `as_text_events`    | `bool`           | `False` | Whether to yield results as text events. |

  **Returns:** `AsyncIterator[Any]`

  #### terminate

  ```python theme={null}
  def terminate(self, timeout: 'Union[int, float]' = 10) -> 'None'
  ```

  Terminates the distributed worker processes. This method should be called to clean up the worker processes.

  | Parameter | Type           | Default | Description |
  | :-------- | :------------- | :------ | :---------- |
  | `timeout` | `int \| float` | `10`    | -           |

  **Returns:** `NoneType`

### DistributedWorker

```python theme={null}
class fal.distributed.DistributedWorker
```

A base class for distributed workers.

  | Name         | Type  | Default | Description |
  | :----------- | :---- | :------ | :---------- |
  | `rank`       | `int` | `0`     | -           |
  | `world_size` | `int` | `1`     | -           |

  | Name     | Type                        | Default | Description |
  | :------- | :-------------------------- | :------ | :---------- |
  | `queue`  | `queue.Queue[bytes]`        | -       | -           |
  | `loop`   | `asyncio.AbstractEventLoop` | -       | -           |
  | `thread` | `threading.Thread`          | -       | -           |

  | Name      | Type   | Description                       |
  | :-------- | :----- | :-------------------------------- |
  | `device`  | -      | The device for the current worker |
  | `running` | `bool` | Whether the event loop is running |

  #### add\_streaming\_error

  ```python theme={null}
  def add_streaming_error(self, error: 'Exception') -> 'None'
  ```

  Add an error to the queue.

  | Parameter | Type        | Default | Description                    |
  | :-------- | :---------- | :------ | :----------------------------- |
  | `error`   | `Exception` | -       | The error to add to the queue. |

  **Returns:** `NoneType`

  #### add\_streaming\_result

  ```python theme={null}
  def add_streaming_result(self, result: 'Any', image_format: 'str' = 'jpeg', as_text_event: 'bool' = False) -> 'None'
  ```

  Add a streaming result to the queue.

  | Parameter       | Type   | Default  | Description                     |
  | :-------------- | :----- | :------- | :------------------------------ |
  | `result`        | `Any`  | -        | The result to add to the queue. |
  | `image_format`  | `str`  | `'jpeg'` | -                               |
  | `as_text_event` | `bool` | `False`  | -                               |

  **Returns:** `NoneType`

  #### initialize

  ```python theme={null}
  def initialize(self, **kwargs: 'Any') -> 'None'
  ```

  Initialize the worker.

  | Parameter | Type  | Default | Description |
  | :-------- | :---- | :------ | :---------- |
  | `kwargs`  | `Any` | -       | -           |

  **Returns:** `NoneType`

  #### rank\_print

  ```python theme={null}
  def rank_print(self, message: 'str', debug: 'bool' = False) -> 'None'
  ```

  Print a message with the rank of the current worker.

  | Parameter | Type   | Default | Description                                      |
  | :-------- | :----- | :------ | :----------------------------------------------- |
  | `message` | `str`  | -       | The message to print.                            |
  | `debug`   | `bool` | `False` | Whether to print the message as a debug message. |

  **Returns:** `NoneType`

  #### run\_in\_worker

  ```python theme={null}
  def run_in_worker(self, func: 'Callable[..., Any]', *args: 'Any', **kwargs: 'Any') -> 'Future[Any]'
  ```

  Run a function in the worker.

  | Parameter | Type                      | Default | Description |
  | :-------- | :------------------------ | :------ | :---------- |
  | `func`    | `Callable[Ellipsis, Any]` | -       | -           |
  | `args`    | `Any`                     | -       | -           |
  | `kwargs`  | `Any`                     | -       | -           |

  **Returns:** `Future[Any]`

  #### setup

  ```python theme={null}
  def setup(self, **kwargs: 'Any') -> 'None'
  ```

  Override this method to set up the worker. This method is called once per worker.

  | Parameter | Type  | Default | Description |
  | :-------- | :---- | :------ | :---------- |
  | `kwargs`  | `Any` | -       | -           |

  **Returns:** `NoneType`

  #### shutdown

  ```python theme={null}
  def shutdown(self, timeout: 'Optional[Union[int, float]]' = None) -> 'None'
  ```

  Shutdown the event loop.

  | Parameter | Type                       | Default | Description                   |
  | :-------- | :------------------------- | :------ | :---------------------------- |
  | `timeout` | `int \| float \| NoneType` | `None`  | The timeout for the shutdown. |

  **Returns:** `NoneType`

  #### submit

  ```python theme={null}
  def submit(self, coro: 'Coroutine[Any, Any, Any]') -> 'Future[Any]'
  ```

  Submit a coroutine to the event loop.

  | Parameter | Type                       | Default | Description                                |
  | :-------- | :------------------------- | :------ | :----------------------------------------- |
  | `coro`    | `Coroutine[Any, Any, Any]` | -       | The coroutine to submit to the event loop. |

  **Returns:** `Future[Any]`

  #### teardown

  ```python theme={null}
  def teardown(self) -> 'None'
  ```

  Override this method to tear down the worker. This method is called once per worker.

  **Returns:** `NoneType`

