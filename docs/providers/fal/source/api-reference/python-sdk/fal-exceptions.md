# fal.exceptions

**Source:** https://fal.ai/docs/api-reference/python-sdk/fal-exceptions.md

> ## Documentation Index
> Fetch the complete documentation index at: https://fal.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# fal.exceptions

> API reference for fal.exceptions

```python theme={null}
from fal.exceptions import (
    FalServerlessException,
    AppException,
    FieldException,
    RequestCancelledException,
    FileTooLargeError,
    AppFileUploadException,
    CUDAOutOfMemoryException,
    UnauthenticatedException,
)
```

## Classes

### FalServerlessException

```python theme={null}
class fal.exceptions.FalServerlessException
```

Base exception type for fal Serverless related flows and APIs.

> **Inherits from:** `Exception`

  | Name     | Type | Default | Description |
  | :------- | :--- | :------ | :---------- |
  | `args`   | -    | -       | -           |
  | `kwargs` | -    | -       | -           |

### AppException

```python theme={null}
class fal.exceptions.AppException
```

Base exception class for application-specific errors.

> **Inherits from:** `FalServerlessException`

  | Name          | Type  | Default | Description                                     |
  | :------------ | :---- | :------ | :---------------------------------------------- |
  | `message`     | `str` | -       | A descriptive message explaining the error.     |
  | `status_code` | `int` | -       | The HTTP status code associated with the error. |

  | Name          | Type  | Default | Description                                     |
  | :------------ | :---- | :------ | :---------------------------------------------- |
  | `message`     | `str` | -       | A descriptive message explaining the error.     |
  | `status_code` | `int` | -       | The HTTP status code associated with the error. |

### FieldException

```python theme={null}
class fal.exceptions.FieldException
```

Exception raised for errors related to specific fields.

> **Inherits from:** `FalServerlessException`

  | Name             | Type                          | Default         | Description                                                     |
  | :--------------- | :---------------------------- | :-------------- | :-------------------------------------------------------------- |
  | `field`          | `str`                         | -               | The field that caused the error.                                |
  | `message`        | `str`                         | -               | A descriptive message explaining the error.                     |
  | `status_code`    | `int`                         | `422`           | The HTTP status code associated with the error. Defaults to 422 |
  | `type`           | `str`                         | `'value_error'` | The type of error. Defaults to "value\_error"                   |
  | `billable_units` | `int \| float \| str \| None` | `0`             | -                                                               |

  | Name             | Type                          | Default         | Description                                                     |
  | :--------------- | :---------------------------- | :-------------- | :-------------------------------------------------------------- |
  | `field`          | `str`                         | -               | The field that caused the error.                                |
  | `message`        | `str`                         | -               | A descriptive message explaining the error.                     |
  | `status_code`    | `int`                         | `422`           | The HTTP status code associated with the error. Defaults to 422 |
  | `type`           | `str`                         | `'value_error'` | The type of error. Defaults to "value\_error"                   |
  | `billable_units` | `int \| float \| str \| None` | `0`             | -                                                               |

  #### to\_pydantic\_format

  ```python theme={null}
  def to_pydantic_format(self) -> 'dict[str, list[dict]]'
  ```

  **Returns:** `dict[str, list[dict]]`

### RequestCancelledException

```python theme={null}
class fal.exceptions.RequestCancelledException
```

Exception raised when the request is cancelled by the client.

> **Inherits from:** `FalServerlessException`

  | Name      | Type  | Default                              | Description |
  | :-------- | :---- | :----------------------------------- | :---------- |
  | `message` | `str` | `'Request cancelled by the client.'` | -           |

  | Name      | Type  | Default                              | Description |
  | :-------- | :---- | :----------------------------------- | :---------- |
  | `message` | `str` | `'Request cancelled by the client.'` | -           |

### FileTooLargeError

```python theme={null}
class fal.exceptions.FileTooLargeError
```

Exception raised when the file is too large.

> **Inherits from:** `FalServerlessException`

  | Name      | Type  | Default                | Description |
  | :-------- | :---- | :--------------------- | :---------- |
  | `message` | `str` | `'File is too large.'` | -           |

  | Name      | Type  | Default                | Description |
  | :-------- | :---- | :--------------------- | :---------- |
  | `message` | `str` | `'File is too large.'` | -           |

### AppFileUploadException

```python theme={null}
class fal.exceptions.AppFileUploadException
```

Raised when file upload fails

> **Inherits from:** `FalServerlessException`

  | Name            | Type  | Default | Description |
  | :-------------- | :---- | :------ | :---------- |
  | `message`       | `str` | -       | -           |
  | `relative_path` | `str` | -       | -           |

  | Name            | Type  | Default | Description |
  | :-------------- | :---- | :------ | :---------- |
  | `message`       | `str` | -       | -           |
  | `relative_path` | `str` | -       | -           |

### CUDAOutOfMemoryException

```python theme={null}
class fal.exceptions.CUDAOutOfMemoryException
```

Exception raised when a CUDA operation runs out of memory.

> **Inherits from:** `AppException`

  | Name          | Type  | Default                       | Description |
  | :------------ | :---- | :---------------------------- | :---------- |
  | `message`     | `str` | `'CUDA error: out of memory'` | -           |
  | `status_code` | `int` | `503`                         | -           |

  | Name          | Type  | Default                       | Description |
  | :------------ | :---- | :---------------------------- | :---------- |
  | `message`     | `str` | `'CUDA error: out of memory'` | -           |
  | `status_code` | `int` | `503`                         | -           |

### UnauthenticatedException

```python theme={null}
class fal.exceptions.UnauthenticatedException
```

Base exception type for fal Serverless related flows and APIs.

> **Inherits from:** `FalServerlessException`
