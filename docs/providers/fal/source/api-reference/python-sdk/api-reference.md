# fal.api

**Source:** https://fal.ai/docs/api-reference/python-sdk/api-reference.md

> ## Documentation Index
> Fetch the complete documentation index at: https://fal.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# fal.api

> API reference for fal.api

```python theme={null}
from fal.api import (
    SyncServerlessClient,
    AppsNamespace,
    RunnersNamespace,
    KeysNamespace,
    SecretsNamespace,
)
```

## Classes

### SyncServerlessClient

```python theme={null}
class fal.api.SyncServerlessClient
```

Synchronous Python client for fal Serverless. Manage apps, runners, and deployments programmatically. The namespaces
and methods mirror the CLI so you can automate the same workflows from Python.

**Example:**

```python theme={null}
from fal.api import SyncServerlessClient

client = SyncServerlessClient()

# List apps
apps = client.apps.list()

# Scale an app
client.apps.scale("my-app", max_concurrency=10)

# Deploy
client.deploy("path/to/myfile.py::MyApp")
```

**Namespaces:**

* client.apps.\*    - corresponds to `fal apps ...`
* client.runners.\* - corresponds to `fal runners ...`
* client.keys.\*    - corresponds to `fal keys ...`
* client.secrets.\* - corresponds to `fal secrets ...`
* client.deploy()  - corresponds to `fal deploy ...`

  | Name      | Type            | Default | Description                                   |
  | :-------- | :-------------- | :------ | :-------------------------------------------- |
  | `host`    | `Optional[str]` | `None`  | Optional. Override API host.                  |
  | `api_key` | `Optional[str]` | `None`  | Optional. If omitted, read from env/profile.  |
  | `profile` | `Optional[str]` | `None`  | Optional. Named profile to use.               |
  | `team`    | `Optional[str]` | `None`  | Optional. Team context for runner operations. |

  | Name      | Type            | Default | Description |
  | :-------- | :-------------- | :------ | :---------- |
  | `host`    | `Optional[str]` | `None`  | -           |
  | `api_key` | `Optional[str]` | `None`  | -           |
  | `profile` | `Optional[str]` | `None`  | -           |
  | `team`    | `Optional[str]` | `None`  | -           |

  | Name           | Type          | Description |
  | :------------- | :------------ | :---------- |
  | `_credentials` | `Credentials` | -           |
  | `_grpc_host`   | `str`         | -           |
  | `_rest_url`    | `str`         | -           |

  #### deploy

  ```python theme={null}
  def deploy(self, *args, **kwargs)
  ```

  Deploy an application. Corresponds to `fal deploy`. If app\_ref is omitted, discovery behavior matches the CLI
  (e.g., uses pyproject.toml).

  **Example:**

  ```python theme={null}
  # Auto-discover from pyproject.toml
  client.deploy()

  # Deploy from a file path
  client.deploy("path/to/myfile.py")

  # Deploy a specific class
  client.deploy("path/to/myfile.py::MyApp")

  # With options
  client.deploy(
      app_ref="path/to/myfile.py::MyApp",
      app_name="myapp",
      auth="public",
      strategy="rolling",
  )
  ```

  | Parameter | Type | Default | Description |
  | :-------- | :--- | :------ | :---------- |
  | `args`    | -    | -       | -           |
  | `kwargs`  | -    | -       | -           |

### AppsNamespace

```python theme={null}
class fal.api.AppsNamespace
```

Namespace for app management operations. Corresponds to `fal apps ...` CLI commands.

Accessed via `client.apps`.

**Example:**

```python theme={null}
from fal.api import SyncServerlessClient

client = SyncServerlessClient()
apps = client.apps.list()
client.apps.scale("my-app", max_concurrency=10)
```

  | Name     | Type                   | Default | Description |
  | :------- | :--------------------- | :------ | :---------- |
  | `client` | `SyncServerlessClient` | -       | -           |

  #### list

  ```python theme={null}
  def list(self, *, filter: 'str | None' = None, environment_name: 'str | None' = None) -> 'List[AliasInfo]'
  ```

  List all applications. Corresponds to `fal apps list`.

  **Example:**

  ```python theme={null}
  apps = client.apps.list()
  filtered = client.apps.list(filter="stable")
  ```

  | Parameter          | Type          | Default | Description                      |
  | :----------------- | :------------ | :------ | :------------------------------- |
  | `filter`           | `str \| None` | `None`  | Optional app name filter string. |
  | `environment_name` | `str \| None` | `None`  | Optional environment name.       |

  **Returns:** `list[AliasInfo]`

  #### rollout

  ```python theme={null}
  def rollout(self, app_name: 'str', *, force: 'bool' = False, environment_name: 'str | None' = None) -> 'None'
  ```

  | Parameter          | Type          | Default | Description |
  | :----------------- | :------------ | :------ | :---------- |
  | `app_name`         | `str`         | -       | -           |
  | `force`            | `bool`        | `False` | -           |
  | `environment_name` | `str \| None` | `None`  | -           |

  **Returns:** `NoneType`

  #### runners

  ```python theme={null}
  def runners(self, app_name: 'str', *, since=None, state: 'List[str] | None' = None, environment_name: 'str | None' = None) -> 'List[RunnerInfo]'
  ```

  List runners for a specific app. Corresponds to `fal apps runners \<app\>`.

  **Example:**

  ```python theme={null}
  from datetime import datetime, timedelta

  runners = client.apps.runners("my-app")
  recent = client.apps.runners(
      "my-app", since=datetime.now() - timedelta(hours=1)
  )
  running = client.apps.runners("my-app", state=["running"])
  ```

  | Parameter          | Type                  | Default | Description                                      |
  | :----------------- | :-------------------- | :------ | :----------------------------------------------- |
  | `app_name`         | `str`                 | -       | Name of the application.                         |
  | `since`            | -                     | `None`  | Only return runners started after this datetime. |
  | `state`            | `Optional[list[str]]` | `None`  | Filter by runner state (e.g., \["running"]).     |
  | `environment_name` | `str \| None`         | `None`  | Optional environment name.                       |

  **Returns:** `list[RunnerInfo]`

  #### scale

  ```python theme={null}
  def scale(self, app_name: 'str', *, keep_alive: 'int | None' = None, max_multiplexing: 'int | None' = None, max_concurrency: 'int | None' = None, min_concurrency: 'int | None' = None, concurrency_buffer: 'int | None' = None, concurrency_buffer_perc: 'int | None' = None, scaling_delay: 'int | None' = None, request_timeout: 'int | None' = None, startup_timeout: 'int | None' = None, machine_types: 'List[str] | None' = None, regions: 'List[str] | None' = None, environment_name: 'str | None' = None) -> 'apps_api.AliasInfo'
  ```

  Adjust scaling settings for an application. Corresponds to `fal apps scale`. Any omitted option keeps the current value.

  **Example:**

  ```python theme={null}
  client.apps.scale(
      "my-app",
      keep_alive=300,
      max_concurrency=10,
      min_concurrency=1,
      machine_types=["GPU-H100", "GPU-H200"],
  )
  ```

  | Parameter                 | Type                  | Default | Description                                          |
  | :------------------------ | :-------------------- | :------ | :--------------------------------------------------- |
  | `app_name`                | `str`                 | -       | Name of the application.                             |
  | `keep_alive`              | `int \| None`         | `None`  | Keep-alive time in seconds.                          |
  | `max_multiplexing`        | `int \| None`         | `None`  | Maximum request multiplexing.                        |
  | `max_concurrency`         | `int \| None`         | `None`  | Maximum concurrent runners.                          |
  | `min_concurrency`         | `int \| None`         | `None`  | Minimum concurrent runners.                          |
  | `concurrency_buffer`      | `int \| None`         | `None`  | -                                                    |
  | `concurrency_buffer_perc` | `int \| None`         | `None`  | -                                                    |
  | `scaling_delay`           | `int \| None`         | `None`  | -                                                    |
  | `request_timeout`         | `int \| None`         | `None`  | Request timeout in seconds.                          |
  | `startup_timeout`         | `int \| None`         | `None`  | Startup timeout in seconds.                          |
  | `machine_types`           | `Optional[list[str]]` | `None`  | List of allowed machine types (e.g., \["GPU-H100"]). |
  | `regions`                 | `Optional[list[str]]` | `None`  | List of allowed regions (e.g., \["us-east-1"]).      |
  | `environment_name`        | `str \| None`         | `None`  | -                                                    |

  **Returns:** `AliasInfo`

### RunnersNamespace

```python theme={null}
class fal.api.RunnersNamespace
```

Namespace for runner management operations. Corresponds to `fal runners ...` CLI commands.

Accessed via `client.runners`.

**Example:**

```python theme={null}
from fal.api import SyncServerlessClient

client = SyncServerlessClient()
runners = client.runners.list()
client.runners.stop("runner-id")
```

  | Name     | Type                   | Default | Description |
  | :------- | :--------------------- | :------ | :---------- |
  | `client` | `SyncServerlessClient` | -       | -           |

  #### kill

  ```python theme={null}
  def kill(self, runner_id: 'str') -> 'None'
  ```

  Forcefully kill a runner.

  | Parameter   | Type  | Default | Description                   |
  | :---------- | :---- | :------ | :---------------------------- |
  | `runner_id` | `str` | -       | The ID of the runner to kill. |

  **Returns:** `NoneType`

  #### list

  ```python theme={null}
  def list(self, *, since=None) -> 'List[RunnerInfo]'
  ```

  List all runners. Corresponds to `fal runners list`.

  **Example:**

  ```python theme={null}
  from datetime import datetime, timedelta

  all_runners = client.runners.list()
  recent = client.runners.list(since=datetime.now() - timedelta(minutes=10))
  ```

  | Parameter | Type | Default | Description                                      |
  | :-------- | :--- | :------ | :----------------------------------------------- |
  | `since`   | -    | `None`  | Only return runners started after this datetime. |

  **Returns:** `list[RunnerInfo]`

  #### stop

  ```python theme={null}
  def stop(self, runner_id: 'str') -> 'None'
  ```

  Gracefully stop a runner.

  | Parameter   | Type  | Default | Description                   |
  | :---------- | :---- | :------ | :---------------------------- |
  | `runner_id` | `str` | -       | The ID of the runner to stop. |

  **Returns:** `NoneType`

### KeysNamespace

```python theme={null}
class fal.api.KeysNamespace
```

Namespace for API key management. Corresponds to `fal keys ...` CLI commands. Accessed via `client.keys`.

**Example:**

```python theme={null}
from fal.api import SyncServerlessClient

client = SyncServerlessClient()
keys = client.keys.list()
key_id, key_secret = client.keys.create(scope="admin")
```

  | Name     | Type                   | Default | Description |
  | :------- | :--------------------- | :------ | :---------- |
  | `client` | `SyncServerlessClient` | -       | -           |

  #### create

  ```python theme={null}
  def create(self, *, scope: 'KeyScope', description: 'str | None' = None) -> 'tuple[str, str]'
  ```

  Create a new API key.

  | Parameter     | Type          | Default | Description                       |
  | :------------ | :------------ | :------ | :-------------------------------- |
  | `scope`       | `KeyScope`    | -       | Key scope (e.g., "admin").        |
  | `description` | `str \| None` | `None`  | Optional description for the key. |

  **Returns:** `tuple[str, str]`

  #### list

  ```python theme={null}
  def list(self) -> 'List[UserKeyInfo]'
  ```

  List all API keys.

  **Returns:** `list[UserKeyInfo]`

  #### revoke

  ```python theme={null}
  def revoke(self, key_id: 'str') -> 'None'
  ```

  Revoke an API key.

  | Parameter | Type  | Default | Description                  |
  | :-------- | :---- | :------ | :--------------------------- |
  | `key_id`  | `str` | -       | The ID of the key to revoke. |

  **Returns:** `NoneType`

### SecretsNamespace

```python theme={null}
class fal.api.SecretsNamespace
```

Namespace for secrets management. Corresponds to `fal secrets ...` CLI commands. Accessed via `client.secrets`.

**Example:**

```python theme={null}
from fal.api import SyncServerlessClient

client = SyncServerlessClient()
client.secrets.set("API_KEY", "my-secret-value")
secrets = client.secrets.list()
```

  | Name     | Type                   | Default | Description |
  | :------- | :--------------------- | :------ | :---------- |
  | `client` | `SyncServerlessClient` | -       | -           |

  #### list

  ```python theme={null}
  def list(self, environment_name: 'str | None' = None) -> 'List[ServerlessSecret]'
  ```

  List all secrets (names only, not values).

  | Parameter          | Type          | Default | Description |
  | :----------------- | :------------ | :------ | :---------- |
  | `environment_name` | `str \| None` | `None`  | -           |

  **Returns:** `list[ServerlessSecret]`

  #### set

  ```python theme={null}
  def set(self, name: 'str', value: 'str', environment_name: 'str | None' = None) -> 'None'
  ```

  Set a secret value.

  | Parameter          | Type          | Default | Description         |
  | :----------------- | :------------ | :------ | :------------------ |
  | `name`             | `str`         | -       | Name of the secret. |
  | `value`            | `str`         | -       | Value to store.     |
  | `environment_name` | `str \| None` | `None`  | -                   |

  **Returns:** `NoneType`

  #### unset

  ```python theme={null}
  def unset(self, name: 'str', environment_name: 'str | None' = None) -> 'None'
  ```

  Delete a secret.

  | Parameter          | Type          | Default | Description                   |
  | :----------------- | :------------ | :------ | :---------------------------- |
  | `name`             | `str`         | -       | Name of the secret to delete. |
  | `environment_name` | `str \| None` | `None`  | Optional environment name.    |

  **Returns:** `NoneType`

