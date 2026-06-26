# OpenAPI Schema

**Source:** https://fal.ai/docs/api-reference/platform-apis/openapi-schema.md

> ## Documentation Index
> Fetch the complete documentation index at: https://fal.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# OpenAPI Schema

> The fal Platform API is documented using the OpenAPI 3.1 specification format.

## Download

Download the complete OpenAPI schema to integrate with your tools and workflows:

- **[OpenAPI Specification](https://api.fal.ai/v1/openapi.json)** — Download the OpenAPI 3.1 JSON schema

## Use Cases

The OpenAPI schema enables you to:

* **Generate Client SDKs**: Use tools like OpenAPI Generator to create client libraries in your preferred language
* **API Testing**: Import into testing tools like Postman or Insomnia
* **Code Generation**: Generate type definitions and API interfaces
* **Documentation**: Use with documentation generators and API explorers
* **Validation**: Validate API requests and responses against the schema

## Schema URL

```
https://api.fal.ai/v1/openapi.json
```

## Integration Examples

### Postman

1. Open Postman
2. Click **Import**
3. Select **Link** and paste the schema URL
4. Postman will generate a collection from the OpenAPI spec

### OpenAPI Generator

Generate a client library using the OpenAPI Generator:

```bash theme={null}
openapi-generator-cli generate \
  -i https://api.fal.ai/v1/openapi.json \
  -g python \
  -o ./fal-api-client
```

### Swagger UI

View the API documentation in Swagger UI:

```bash theme={null}
docker run -p 8080:8080 \
  -e SWAGGER_JSON_URL=https://api.fal.ai/v1/openapi.json \
  swaggerapi/swagger-ui
```

## Specification Details

* **Version**: OpenAPI 3.1.0
* **Format**: JSON
* **Authentication**: API Key (Admin keys required)
* **Base URL**: `https://api.fal.ai/v1`
