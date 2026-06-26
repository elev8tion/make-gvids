# Authentication

**Source:** https://fal.ai/docs/api-reference/platform-apis/authentication.md

> ## Documentation Index
> Fetch the complete documentation index at: https://fal.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Authentication

> Platform APIs require API keys for secure access to your user or team's data.

## Generating API Keys

Navigate to the dashboard keys page and generate a key from the UI: [fal.ai/dashboard/keys](https://fal.ai/dashboard/keys)

## Scopes

Platform APIs may require different API key scopes.

[Learn more about key-based authentication and scopes](/documentation/model-apis/authentication/key-based).

  Most Platform APIs accept **API scope** keys. This scope is suitable for most use cases including model discovery, pricing, and analytics.

  Some Platform APIs require **Admin scope** keys for access to sensitive data.

<Info>
  Check the specific Platform API documentation to see which scope is required. If you're unsure, start with an API scope key. You can always generate an Admin scope key later if needed.
</Info>

> **⚠️  Warning:** API keys should be kept secure and never exposed in client-side code or public repositories.

## Authentication Format

Include your API key in the `Authorization` header with the `Key` prefix:

```bash theme={null}
Authorization: Key YOUR_API_KEY
```

For endpoints requiring Admin scope:

```bash theme={null}
Authorization: Key YOUR_ADMIN_API_KEY
```

## Usage Examples

### cURL

Using an API scope key for model listing:

```bash theme={null}
curl -X GET "https://api.fal.ai/v1/models?limit=10" \
  -H "Authorization: Key YOUR_API_KEY"
```

Using an Admin scope key for usage data:

```bash theme={null}
curl -X GET "https://api.fal.ai/v1/models/usage" \
  -H "Authorization: Key YOUR_ADMIN_API_KEY"
```

### Python

Using an API scope key:

```python theme={null}
import requests

headers = {
    "Authorization": "Key YOUR_API_KEY"
}

response = requests.get(
    "https://api.fal.ai/v1/models",
    headers=headers,
    params={"limit": 10}
)

print(response.json())
```

### JavaScript

Using an API scope key:

```javascript theme={null}
const response = await fetch('https://api.fal.ai/v1/models?limit=10', {
  headers: {
    'Authorization': 'Key YOUR_API_KEY'
  }
});

const data = await response.json();
console.log(data);
```

## Best Practices

* Store API keys in environment variables
* Use the minimum required scope for your use case
* Rotate keys regularly
* Keep Admin API keys secure and never expose them client-side

## Troubleshooting

### 401 Unauthorized

* Verify your API key is correct
* Ensure the `Authorization` header includes the `Key` prefix
* Check that your API key hasn't been revoked

### 403 Forbidden

Your API key may not have the required scope for the endpoint. Check the endpoint documentation to determine if it requires an Admin scope key, and generate one from the dashboard if needed.
