# fal

**Source:** https://fal.ai/docs/api-reference/python-sdk/fal.md

> ## Documentation Index
> Fetch the complete documentation index at: https://fal.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# fal

> API reference for fal

```python theme={null}
from fal import (
    App,
    HealthCheck,
    FalServerlessKeyCredentials,
    ContainerImage,
    function,
    cached,
    endpoint,
    realtime,
    sync_dir,
)
```

## Classes

### App

```python theme={null}
class fal.App
```

Create a fal serverless application. Subclass this to define your application with custom setup, endpoints,
and configuration. The App class handles model loading, request routing,
and lifecycle management.

**Example:**

```python theme={null}
>>> class TextToImage(fal.App, machine_type="GPU"):
...     requirements = ["diffusers", "torch"]
...
...     def setup(self):
...         self.pipe = StableDiffusionPipeline.from_pretrained(
...             "runwayml/stable-diffusion-v1-5"
...         )
...
...     @fal.endpoint("/")
...     def generate(self, prompt: str) -> dict:
...         image = self.pipe(prompt).images[0]
...         return {"url": fal.toolkit.upload_image(image)}
```

> **Inherits from:** `BaseServable`

  | Name          | Type   | Default | Description |
  | :------------ | :----- | :------ | :---------- |
  | `_allow_init` | `bool` | `False` | -           |

  | Name                       | Type                                              | Default                                                                                                                | Description                                                                                                                                                                                                                                                                                                                       |
  | :------------------------- | :------------------------------------------------ | :--------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | `requirements`             | `ClassVar[list[str] \| list[list[str]]]`          | `[]`                                                                                                                   | Pip packages to install in the environment. Supports standard pip syntax including version specifiers. Use a list of strings for a single install step, or a list of lists to install in multiple steps. Example: `["numpy==1.24.0", "torch\>=2.0.0"]` or `[["setuptools", "wheel"], ["numpy==1.24.0"]]`                          |
  | `requirements_context_dir` | `ClassVar[Optional[str]]`                         | `None`                                                                                                                 | Base directory for resolving local-path requirements such as `.[extra]` or `projects/foo[extra]`. Defaults to the directory containing the app file.                                                                                                                                                                              |
  | `local_python_modules`     | `ClassVar[list[str]]`                             | `[]`                                                                                                                   | List of local Python module names to include in the deployment. Use for custom code not available on PyPI. Example: `["my_utils", "models"]`                                                                                                                                                                                      |
  | `machine_type`             | `ClassVar[str \| list[str]]`                      | `'S'`                                                                                                                  | Compute instance type for your application. CPU options: 'XS', 'S' (default), 'M', 'L'. GPU options: 'GPU-A6000', 'GPU-A100', 'GPU-H100', 'GPU-H200', 'GPU-B200'. Use a string for a single type, or a list to define fallback types (tried in order until one is available). Example: `"GPU-A100"` or `["GPU-H100", "GPU-A100"]` |
  | `num_gpus`                 | `ClassVar[int \| None]`                           | `None`                                                                                                                 | Number of GPUs to allocate. Only applies to GPU machine types.                                                                                                                                                                                                                                                                    |
  | `regions`                  | `ClassVar[Optional[list[str]]]`                   | `None`                                                                                                                 | Allowed regions for deployment. None means any region. Example: `["us-east", "eu-west"]`                                                                                                                                                                                                                                          |
  | `host_kwargs`              | `ClassVar[dict[str, Any]]`                        | `\{'_scheduler': 'nomad', '_scheduler_options': \{'storage_region': 'us-east'\}, 'resolver': 'uv', 'keep_alive': 60\}` | Advanced configuration dictionary passed to the host. For internal use. Prefer using class attributes instead.                                                                                                                                                                                                                    |
  | `app_name`                 | `ClassVar[Optional[str]]`                         | `None`                                                                                                                 | Custom name for the application. Defaults to class name.                                                                                                                                                                                                                                                                          |
  | `app_auth`                 | `ClassVar[Optional[AuthModeLiteral]]`             | `None`                                                                                                                 | Authentication mode. Options: 'private' (API key required), 'public' (no auth), 'shared' (shareable link).                                                                                                                                                                                                                        |
  | `app_files`                | `ClassVar[list[str]]`                             | `[]`                                                                                                                   | List of files/directories to include in deployment. Example: `["./models", "./config.yaml"]`                                                                                                                                                                                                                                      |
  | `app_files_ignore`         | `ClassVar[list[str]]`                             | `['\\.pyc$', '__pycache__/', '\\.git/', '\\.DS_Store$']`                                                               | Regex patterns to exclude from deployment. Default excludes `.pyc`, `__pycache__`, `.git`, `.DS_Store`.                                                                                                                                                                                                                           |
  | `app_files_context_dir`    | `ClassVar[Optional[str]]`                         | `None`                                                                                                                 | Base directory for resolving app\_files paths. Defaults to the directory containing the app file.                                                                                                                                                                                                                                 |
  | `request_timeout`          | `ClassVar[Optional[int]]`                         | `None`                                                                                                                 | Maximum seconds for a single request. None for default.                                                                                                                                                                                                                                                                           |
  | `startup_timeout`          | `ClassVar[Optional[int]]`                         | `None`                                                                                                                 | Maximum seconds for app startup/setup. None for default.                                                                                                                                                                                                                                                                          |
  | `min_concurrency`          | `ClassVar[Optional[int]]`                         | `None`                                                                                                                 | Minimum warm instances to keep running. Set to 1+ to avoid cold starts. Default is 0 (scale to zero).                                                                                                                                                                                                                             |
  | `max_concurrency`          | `ClassVar[Optional[int]]`                         | `None`                                                                                                                 | Maximum instances to scale up to.                                                                                                                                                                                                                                                                                                 |
  | `concurrency_buffer`       | `ClassVar[Optional[int]]`                         | `None`                                                                                                                 | Additional instances to keep warm above current load.                                                                                                                                                                                                                                                                             |
  | `concurrency_buffer_perc`  | `ClassVar[Optional[int]]`                         | `None`                                                                                                                 | Percentage buffer of instances above current load.                                                                                                                                                                                                                                                                                |
  | `scaling_delay`            | `ClassVar[Optional[int]]`                         | `None`                                                                                                                 | Seconds to wait for a request to be picked up by a runner before triggering a scale up. Useful for apps with slow startup times.                                                                                                                                                                                                  |
  | `max_multiplexing`         | `ClassVar[Optional[int]]`                         | `None`                                                                                                                 | Maximum concurrent requests per instance.                                                                                                                                                                                                                                                                                         |
  | `kind`                     | `ClassVar[Optional[str]]`                         | `None`                                                                                                                 | Deployment kind. For internal use.                                                                                                                                                                                                                                                                                                |
  | `image`                    | `ClassVar[Optional[ContainerImage]]`              | `None`                                                                                                                 | Custom container image for the application. Use ContainerImage to specify a Dockerfile.                                                                                                                                                                                                                                           |
  | `local_file_path`          | `ClassVar[Optional[str]]`                         | `None`                                                                                                                 | -                                                                                                                                                                                                                                                                                                                                 |
  | `skip_retry_conditions`    | `ClassVar[Optional[list[RetryConditionLiteral]]]` | `None`                                                                                                                 | -                                                                                                                                                                                                                                                                                                                                 |
  | `isolate_channel`          | `async_grpc.Channel \| None`                      | `None`                                                                                                                 | -                                                                                                                                                                                                                                                                                                                                 |

  | Name              | Type                     | Description |   |
  | :---------------- | :----------------------- | :---------- | - |
  | `current_request` | \`fal.app.RequestContext | None\`      | - |

  #### collect\_routes

  ```python theme={null}
  def collect_routes(self) -> 'dict[RouteSignature, Callable[..., Any]]'
  ```

  **Returns:** `dict[RouteSignature, Callable[Ellipsis, Any]]`

  #### get\_endpoints

  ```python theme={null}
  def get_endpoints(cls) -> 'list[str]'
  ```

  **Returns:** `list[str]`

  #### get\_health\_check\_config

  ```python theme={null}
  def get_health_check_config(cls) -> 'Optional[ApplicationHealthCheckConfig]'
  ```

  **Returns:** `Optional[ApplicationHealthCheckConfig]`

  #### handle\_exit

  ```python theme={null}
  def handle_exit(self)
  ```

  Handle exit signal.

  #### health

  ```python theme={null}
  def health(self)
  ```

  #### lifespan

  ```python theme={null}
  def lifespan(self, app: 'fastapi.FastAPI')
  ```

  | Parameter | Type      | Default | Description |
  | :-------- | :-------- | :------ | :---------- |
  | `app`     | `FastAPI` | -       | -           |

  #### provide\_hints

  ```python theme={null}
  def provide_hints(self) -> 'list[str]'
  ```

  Provide hints for routing the application.

  **Returns:** `list[str]`

  #### run\_local

  ```python theme={null}
  def run_local(cls, *args, **kwargs)
  ```

  | Parameter | Type | Default | Description |
  | :-------- | :--- | :------ | :---------- |
  | `args`    | -    | -       | -           |
  | `kwargs`  | -    | -       | -           |

  #### setup

  ```python theme={null}
  def setup(self)
  ```

  Setup the application before serving.

  #### spawn

  ```python theme={null}
  def spawn(cls) -> 'AppSpawnInfo'
  ```

  **Returns:** `AppSpawnInfo`

  #### teardown

  ```python theme={null}
  def teardown(self)
  ```

  Teardown the application after serving.

### HealthCheck

```python theme={null}
class fal.HealthCheck
```

  | Name                   | Type             | Default | Description                                                                                                                                                                                                                                                      |
  | :--------------------- | :--------------- | :------ | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
  | `start_period_seconds` | `Optional[int]`  | `None`  | Minimum time the runner has been running before considering the runner unhealthy when health check fails. To prevent the health check from failing too early, this will be replaced by startup\_timeout of the application if it's less than it. Defaults to 30. |
  | `timeout_seconds`      | `Optional[int]`  | `None`  | Timeout in seconds for the health check request. Defaults to 5 seconds.                                                                                                                                                                                          |
  | `failure_threshold`    | `Optional[int]`  | `None`  | Number of consecutive failures before considering the runner as unhealthy. Defaults to 3.                                                                                                                                                                        |
  | `call_regularly`       | `Optional[bool]` | `None`  | Perform health check every 15s. If false, only do it when the x-fal-runner-health-check header is present. Defaults to True.                                                                                                                                     |

  | Name                   | Type             | Default | Description |
  | :--------------------- | :--------------- | :------ | :---------- |
  | `start_period_seconds` | `Optional[int]`  | `None`  | -           |
  | `timeout_seconds`      | `Optional[int]`  | `None`  | -           |
  | `failure_threshold`    | `Optional[int]`  | `None`  | -           |
  | `call_regularly`       | `Optional[bool]` | `None`  | -           |

### FalServerlessKeyCredentials

```python theme={null}
class fal.FalServerlessKeyCredentials
```

> **Inherits from:** `Credentials`

  | Name         | Type  | Default | Description |
  | :----------- | :---- | :------ | :---------- |
  | `key_id`     | `str` | -       | -           |
  | `key_secret` | `str` | -       | -           |

  | Name         | Type  | Default | Description |
  | :----------- | :---- | :------ | :---------- |
  | `key_id`     | `str` | -       | -           |
  | `key_secret` | `str` | -       | -           |

  #### to\_grpc

  ```python theme={null}
  def to_grpc(self) -> 'grpc.ChannelCredentials'
  ```

  **Returns:** `ChannelCredentials`

  #### to\_headers

  ```python theme={null}
  def to_headers(self) -> 'dict[str, str]'
  ```

  **Returns:** `dict[str, str]`

### ContainerImage

```python theme={null}
class fal.ContainerImage
```

ContainerImage represents a Docker image that can be built from a Dockerfile.

  | Name                | Type                                        | Default                               | Description |
  | :------------------ | :------------------------------------------ | :------------------------------------ | :---------- |
  | `dockerfile_str`    | `str`                                       | -                                     | -           |
  | `build_args`        | `dict[str, str]`                            | `\<factory\>`                         | -           |
  | `registries`        | `dict[str, dict[str, str]]`                 | `\<factory\>`                         | -           |
  | `builder`           | `Optional[Literal[depot, service, worker]]` | `None`                                | -           |
  | `compression`       | `str`                                       | `'gzip'`                              | -           |
  | `force_compression` | `bool`                                      | `False`                               | -           |
  | `secrets`           | `dict[str, str]`                            | `\<factory\>`                         | -           |
  | `context_dir`       | `PathLike`                                  | `/home/runner/work/fal-docs/fal-docs` | -           |
  | `dockerignore`      | `Optional[list[str]]`                       | `None`                                | -           |
  | `dockerignore_path` | `Optional[PathLike]`                        | `None`                                | -           |

  | Name                | Type                                        | Default                               | Description |
  | :------------------ | :------------------------------------------ | :------------------------------------ | :---------- |
  | `dockerfile_str`    | `str`                                       | -                                     | -           |
  | `build_args`        | `dict[str, str]`                            | -                                     | -           |
  | `registries`        | `dict[str, dict[str, str]]`                 | -                                     | -           |
  | `builder`           | `Optional[Literal[depot, service, worker]]` | `None`                                | -           |
  | `compression`       | `str`                                       | `'gzip'`                              | -           |
  | `force_compression` | `bool`                                      | `False`                               | -           |
  | `secrets`           | `dict[str, str]`                            | -                                     | -           |
  | `context_dir`       | `PathLike`                                  | `/home/runner/work/fal-docs/fal-docs` | -           |
  | `dockerignore`      | `Optional[list[str]]`                       | `None`                                | -           |
  | `dockerignore_path` | `Optional[PathLike]`                        | `None`                                | -           |

  #### add\_dockerignore

  ```python theme={null}
  def add_dockerignore(self, patterns: Optional[List[str]] = None, path: Optional[os.PathLike] = None) -> None
  ```

  Add or update dockerignore patterns. Sets the internal dockerignore patterns using gitignore-style matching.
  You can provide either a list of patterns or a path to a .dockerignore file.

  | Parameter  | Type                  | Default | Description                      |
  | :--------- | :-------------------- | :------ | :------------------------------- |
  | `patterns` | `Optional[list[str]]` | `None`  | List of gitignore-style patterns |
  | `path`     | `Optional[PathLike]`  | `None`  | Path to a .dockerignore file     |

  **Returns:** `NoneType`

  **Raises:**

  * `ValueError`: If both patterns and path are provided, or neither

  #### from\_dockerfile

  ```python theme={null}
  def from_dockerfile(cls, path: str, **kwargs) -> 'ContainerImage'
  ```

  | Parameter | Type  | Default | Description |
  | :-------- | :---- | :------ | :---------- |
  | `path`    | `str` | -       | -           |
  | `kwargs`  | -     | -       | -           |

  **Returns:** `ContainerImage`

  #### from\_dockerfile\_str

  ```python theme={null}
  def from_dockerfile_str(cls, text: str, **kwargs) -> 'ContainerImage'
  ```

  | Parameter | Type  | Default | Description |
  | :-------- | :---- | :------ | :---------- |
  | `text`    | `str` | -       | -           |
  | `kwargs`  | -     | -       | -           |

  **Returns:** `ContainerImage`

  #### get\_copy\_add\_sources

  ```python theme={null}
  def get_copy_add_sources(self) -> List[str]
  ```

  Get list of src paths/patterns from COPY/ADD commands. This method only parses the Dockerfile - it doesn't access the filesystem.

  **Returns:** `list[str]`

  #### to\_dict

  ```python theme={null}
  def to_dict(self) -> dict
  ```

  **Returns:** `dict`

***

## Functions

### function

```python theme={null}
def function(kind: 'str' = 'virtualenv', *, host: 'Host | None' = None, local_python_modules: 'list[str] | None' = None, **config: 'Any')
```

| Parameter              | Type                       | Default        | Description                                                                                                           |
| :--------------------- | :------------------------- | :------------- | :-------------------------------------------------------------------------------------------------------------------- |
| `kind`                 | `str`                      | `'virtualenv'` | -                                                                                                                     |
| `host`                 | `fal.api.api.Host \| None` | `None`         | -                                                                                                                     |
| `local_python_modules` | `list[str] \| None`        | `None`         | -                                                                                                                     |
| `config`               | `Any`                      | -              | Additional function options such as `requirements`, `requirements_context_dir`, `machine_type`, and scaling settings. |

### cached

```python theme={null}
def cached(func: 'Callable[ArgsT, ReturnT]') -> 'Callable[ArgsT, ReturnT]'
```

Cache the result of the given function in-memory.

| Parameter | Type                       | Default | Description |
| :-------- | :------------------------- | :------ | :---------- |
| `func`    | `Callable[ArgsT, ReturnT]` | -       | -           |

**Returns:** `Callable[ArgsT, ReturnT]`

### endpoint

```python theme={null}
def endpoint(path: 'str', *, is_websocket: 'bool' = False, health_check: 'HealthCheck | None' = None) -> 'Callable[[EndpointT], EndpointT]'
```

Designate the decorated function as an application endpoint.

| Parameter      | Type                          | Default | Description |
| :------------- | :---------------------------- | :------ | :---------- |
| `path`         | `str`                         | -       | -           |
| `is_websocket` | `bool`                        | `False` | -           |
| `health_check` | `fal.sdk.HealthCheck \| None` | `None`  | -           |

**Returns:** `Callable[EndpointT, EndpointT]`

### realtime

```python theme={null}
def realtime(path: 'str', *, buffering: 'int | None' = None, session_timeout: 'float | None' = None, input_modal: 'Any | None' = <object object at 0x7f9efed85f00>, output_modal: 'Any | None' = <object object at 0x7f9efed85f00>, max_batch_size: 'int' = 1, content_type: 'str' = 'application/msgpack', encode_message: 'Callable[[Any], bytes] | None' = None, decode_message: 'Callable[[bytes], Any] | None' = None) -> 'Callable[[EndpointT], EndpointT]'
```

Designate the decorated function as a realtime application endpoint.

| Parameter         | Type                             | Default                               | Description |
| :---------------- | :------------------------------- | :------------------------------------ | :---------- |
| `path`            | `str`                            | -                                     | -           |
| `buffering`       | `int \| None`                    | `None`                                | -           |
| `session_timeout` | `float \| None`                  | `None`                                | -           |
| `input_modal`     | `Any \| None`                    | `\<object object at 0x7f9efed85f00\>` | -           |
| `output_modal`    | `Any \| None`                    | `\<object object at 0x7f9efed85f00\>` | -           |
| `max_batch_size`  | `int`                            | `1`                                   | -           |
| `content_type`    | `str`                            | `'application/msgpack'`               | -           |
| `encode_message`  | `Optional[Callable[Any, bytes]]` | `None`                                | -           |
| `decode_message`  | `Optional[Callable[bytes, Any]]` | `None`                                | -           |

**Returns:** `Callable[EndpointT, EndpointT]`

### sync\_dir

```python theme={null}
def sync_dir(local_dir: 'str | Path', remote_dir: 'str', force_upload=False) -> 'str'
```

| Parameter      | Type                  | Default | Description |
| :------------- | :-------------------- | :------ | :---------- |
| `local_dir`    | `str \| pathlib.Path` | -       | -           |
| `remote_dir`   | `str`                 | -       | -           |
| `force_upload` | -                     | `False` | -           |

**Returns:** `str`
