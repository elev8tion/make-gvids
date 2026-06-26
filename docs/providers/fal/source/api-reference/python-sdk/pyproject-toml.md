# pyproject.toml Reference

**Source:** https://fal.ai/docs/api-reference/python-sdk/pyproject-toml.md

> ## Documentation Index
> Fetch the complete documentation index at: https://fal.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# pyproject.toml Reference

> Configure fal Serverless apps in pyproject.toml for reusable app names, package entry points, runtime settings, scaling, and containers.

Use `pyproject.toml` to define one or more fal apps in a project. Each entry in `[tool.fal.apps]` gives an app a stable local name that you can pass to `fal run` or `fal deploy` instead of repeating a file path and class reference.

```toml theme={null}
[tool.fal.apps]
image-generator = { ref = "src/app.py::ImageGenerator", auth = "private", machine_type = "GPU-H100" }
```

```bash theme={null}
fal run image-generator
fal deploy image-generator
```

App paths are resolved from the directory that contains `pyproject.toml`.

> **📝  Note:** `fal deploy` respects `auth` from `pyproject.toml`. `fal run` currently defaults to `public` auth and only changes auth mode when you pass `--auth`.

## Package Entry Points

Use `python_entry_point` when your fal app is importable as a Python package and you want fal to load it by module path:

```toml theme={null}
[project]
name = "my-image-app"
version = "0.1.0"
dependencies = ["fal"]

[tool.fal.apps]
image-generator = {
  python_entry_point = "my_image_app.server:ImageGenerator",
  requirements = ["."],
  auth = "private",
  machine_type = "GPU-H100"
}
```

`python_entry_point` must use `<module>:<symbol>` format. It is mutually exclusive with `ref`.

## Multiple Apps

Define multiple apps in the same project by using app-specific tables:

```toml theme={null}
[tool.fal.apps.image-generator]
ref = "src/image_app.py::ImageGenerator"
auth = "private"
machine_type = "GPU-H100"

[tool.fal.apps.captioner]
python_entry_point = "my_package.captioner:Captioner"
requirements = ["."]
auth = "shared"
machine_type = "GPU-A100"
```

Deploy each app by its key:

```bash theme={null}
fal deploy image-generator
fal deploy captioner
```

## App Fields

| Field                              | Type                                   | Description                                                                                                                                                                     |
| :--------------------------------- | :------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ref`                              | `string`                               | File reference to load, such as `src/app.py::MyApp`. Mutually exclusive with `python_entry_point`. Required unless `python_entry_point` or image-only container config is used. |
| `python_entry_point`               | `string`                               | Import path in `<module>:<symbol>` format. Use with `requirements = ["."]` or with a container image that already includes the package. Mutually exclusive with `ref`.          |
| `name`                             | `string`                               | Deployed app name. Defaults to the `[tool.fal.apps]` key.                                                                                                                       |
| `auth`                             | `string`                               | Authentication mode: `private`, `public`, or `shared`.                                                                                                                          |
| `team`                             | `string`                               | Team slug to use when running or deploying this app. A CLI `--team` value overrides it.                                                                                         |
| `deployment_strategy`              | `string`                               | Deploy strategy: `rolling` or `recreate`.                                                                                                                                       |
| `app_scale_settings`               | `boolean`                              | When `true`, deploys with the scale settings from this config instead of inheriting runtime-tuned settings from the previous deployment.                                        |
| `requirements`                     | `list[string]` or `list[list[string]]` | Pip requirements. `.`, `.[extra]`, and `projects/foo[extra]` package a local project before installing it on the runner.                                                        |
| `requirements_context_dir`         | `string`                               | Base directory for resolving local-path `requirements`. Relative paths resolve from the `pyproject.toml` directory.                                                             |
| `python_version`                   | `string`                               | Python version for the runtime, such as `"3.12"`.                                                                                                                               |
| `machine_type`                     | `string` or `list[string]`             | Machine type or fallback list, such as `"GPU-H100"` or `["GPU-H100", "GPU-A100"]`.                                                                                              |
| `num_gpus`                         | `integer`                              | Number of GPUs to allocate for GPU machine types.                                                                                                                               |
| `regions`                          | `list[string]`                         | Allowed regions. Supported values are `us-west`, `us-central`, `us-east`, `eu-north`, and `eu-west`.                                                                            |
| `min_concurrency`                  | `integer`                              | Minimum warm runners.                                                                                                                                                           |
| `max_concurrency`                  | `integer`                              | Maximum runners to scale to.                                                                                                                                                    |
| `max_multiplexing`                 | `integer`                              | Maximum concurrent requests per runner.                                                                                                                                         |
| `concurrency_buffer`               | `integer`                              | Additional runners to keep warm above current load.                                                                                                                             |
| `concurrency_buffer_perc`          | `integer`                              | Percentage buffer of runners above current load.                                                                                                                                |
| `scaling_delay`                    | `integer`                              | Seconds to wait before scaling up for pending requests.                                                                                                                         |
| `keep_alive`                       | `integer`                              | Seconds to keep an idle runner alive.                                                                                                                                           |
| `request_timeout`                  | `integer`                              | Maximum seconds for a single request.                                                                                                                                           |
| `startup_timeout`                  | `integer`                              | Maximum seconds for runner startup and `setup()`.                                                                                                                               |
| `private_logs`                     | `boolean`                              | Restrict app logs to the owning account or team.                                                                                                                                |
| `app_files`                        | `list[string]`                         | Local files or directories to include with the app. Not supported for container apps.                                                                                           |
| `app_files_ignore`                 | `list[string]`                         | Regex patterns to exclude from `app_files`.                                                                                                                                     |
| `app_files_context_dir`            | `string`                               | Base directory for resolving `app_files`. Only valid when `app_files` is set. Relative paths resolve from the `pyproject.toml` directory.                                       |
| `exposed_port`                     | `integer`                              | HTTP port exposed by a custom server app.                                                                                                                                       |
| `skip_retry_conditions`            | `list[string]`                         | Retry conditions to skip. Supported values include `timeout`, `server_error`, and `connection_error`.                                                                           |
| `termination_grace_period_seconds` | `integer`                              | Grace period for runner shutdown.                                                                                                                                               |
| `secrets`                          | `list[string]`                         | Runtime fal secrets to mount into the app environment.                                                                                                                          |
| `data_mounts`                      | `list[string]`                         | Persistent data paths to mount.                                                                                                                                                 |
| `health_check`                     | `table`                                | Health check configuration. See [Health Check](#health-check).                                                                                                                  |
| `image`                            | `table`                                | Container image configuration. See [Container Image](#container-image).                                                                                                         |

> **⚠️  Warning:** `no_scale` is deprecated. Use `app_scale_settings` instead.

## Health Check

```toml theme={null}
[tool.fal.apps.image-generator.health_check]
path = "/health"
start_period_seconds = 30
timeout_seconds = 5
failure_threshold = 3
call_regularly = true
```

| Field                  | Type      | Description                                                 |
| :--------------------- | :-------- | :---------------------------------------------------------- |
| `path`                 | `string`  | Required health check endpoint path.                        |
| `start_period_seconds` | `integer` | Minimum runner age before failures count as unhealthy.      |
| `timeout_seconds`      | `integer` | Timeout for each health check request.                      |
| `failure_threshold`    | `integer` | Consecutive failures before the runner is marked unhealthy. |
| `call_regularly`       | `boolean` | Whether fal should call the health check periodically.      |

## Container Image

Use the `[tool.fal.apps.<app-name>.image]` section to configure a container from `pyproject.toml`. Build from a Dockerfile:

```toml theme={null}
[tool.fal.apps.container-app]
python_entry_point = "my_package.app:MyApp"
machine_type = "GPU-H100"

[tool.fal.apps.container-app.image]
dockerfile = "Dockerfile"
build_args = { CUDA_VERSION = "12.4" }
entrypoint = ["python", "-m", "my_package.app"]
cmd = ["--host", "0.0.0.0", "--port", "8080"]
secrets = { PIP_TOKEN = "$PIP_TOKEN" }
```

Or reference an existing image:

```toml theme={null}
[tool.fal.apps.container-app]
machine_type = "GPU-H100"
exposed_port = 8000

[tool.fal.apps.container-app.image]
image = "my-org/container-app:latest"
cmd = ["your-server", "--host", "0.0.0.0", "--port", "8000"]

[tool.fal.apps.container-app.image.registries."https://index.docker.io/v1/"]
username = "myuser"
password = "$DOCKERHUB_TOKEN"
```

| Field        | Type                       | Description                                                                                                          |
| :----------- | :------------------------- | :------------------------------------------------------------------------------------------------------------------- |
| `dockerfile` | `string`                   | Path to the Dockerfile. Relative paths resolve from the `pyproject.toml` directory. Mutually exclusive with `image`. |
| `image`      | `string`                   | Existing container image reference, such as `my-org/container-app:latest`. Mutually exclusive with `dockerfile`.     |
| `build_args` | `table`                    | Docker build arguments. Only valid with `dockerfile`.                                                                |
| `registries` | `table`                    | Private registry credentials for Dockerfile base images or referenced images.                                        |
| `secrets`    | `table`                    | Build-time secrets. Values prefixed with `$` resolve from fal secrets. Only valid with `dockerfile`.                 |
| `entrypoint` | `string` or `list[string]` | Docker ENTRYPOINT override.                                                                                          |
| `cmd`        | `string` or `list[string]` | Docker CMD override.                                                                                                 |

Set either `dockerfile` or `image` under `[tool.fal.apps.<app-name>.image]`.

Use `registries` when the Dockerfile pulls a private base image or when `image` references a private image.

Container apps can use `ref`, `python_entry_point`, or neither. If both `ref` and `python_entry_point` are omitted, fal treats the container as an image-only app and does not use the fal Python app loader.

When a container app uses `python_entry_point`, make sure the Dockerfile or existing image installs the package that contains the referenced module.
