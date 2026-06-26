# Platform Metadata

**Source:** https://fal.ai/docs/api-reference/platform-apis/meta.md

> ## Documentation Index
> Fetch the complete documentation index at: https://fal.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Platform Metadata

> 
Returns platform metadata including webhook IP ranges for allowlisting.

If your infrastructure requires allowlisting IP addresses for incoming webhook
requests, this endpoint provides the current list of IP ranges used by fal.ai
webhooks in CIDR notation.
    

## OpenAPI

````yaml GET /meta
openapi: 3.1.0
info:
  title: Platform APIs
  version: v1
  description: fal REST API for programmatic access to platform resources.
servers:
  - url: https://api.fal.ai/v1
    description: Production server
security: []
paths:
  /meta:
    get:
      tags:
        - Meta
      summary: Get platform metadata
      description: >-

        Returns platform metadata including webhook IP ranges for allowlisting.

        If your infrastructure requires allowlisting IP addresses for incoming
        webhook

        requests, this endpoint provides the current list of IP ranges used by
        fal.ai

        webhooks in CIDR notation.
            
      operationId: getMeta
      responses:
        '200':
          description: Platform metadata
          content:
            application/json:
              schema:
                type: object
                properties:
                  webhook_ip_ranges:
                    type: array
                    items:
                      type: string
                    description: IP address ranges (CIDR notation) used by fal.ai webhooks
                required:
                  - webhook_ip_ranges
                description: Platform metadata including webhook IP ranges for allowlisting
                example:
                  webhook_ip_ranges:
                    - 34.123.59.101/32
                    - 34.135.41.243/32
                    - 35.239.83.87/32
                    - 104.198.204.37/32
                    - 34.56.20.205/32
                    - 34.170.94.127/32
                    - 35.224.184.236/32
                    - 136.114.56.197/32
                    - 34.29.37.237/32
                    - 35.225.160.28/32
                    - 34.56.205.145/32
                    - 34.59.170.72/32
                    - 34.10.147.45/32
                    - 104.198.64.245/32
                    - 34.9.1.255/32
              example:
                webhook_ip_ranges:
                  - 34.123.59.101/32
                  - 34.135.41.243/32
                  - 35.239.83.87/32
                  - 104.198.204.37/32
                  - 34.56.20.205/32
                  - 34.170.94.127/32
                  - 35.224.184.236/32
                  - 136.114.56.197/32
                  - 34.29.37.237/32
                  - 35.225.160.28/32
                  - 34.56.205.145/32
                  - 34.59.170.72/32
                  - 34.10.147.45/32
                  - 104.198.64.245/32
                  - 34.9.1.255/32
        '429':
          description: Rate limit exceeded
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: object
                    properties:
                      type:
                        type: string
                        enum:
                          - authorization_error
                          - validation_error
                          - not_found
                          - rate_limited
                          - server_error
                          - not_implemented
                        description: The category of error that occurred
                      message:
                        type: string
                        description: Human-readable error message
                      docs_url:
                        type: string
                        format: uri
                        description: Link to relevant documentation
                      request_id:
                        type: string
                        description: Unique request identifier for debugging
                    required:
                      - type
                      - message
                    description: Error details
                required:
                  - error
                description: Standard error response format
              example:
                error:
                  type: rate_limited
                  message: Rate limit exceeded
        '500':
          description: Internal server error
          content:
            application/json:
              schema:
                type: object
                properties:
                  error:
                    type: object
                    properties:
                      type:
                        type: string
                        enum:
                          - authorization_error
                          - validation_error
                          - not_found
                          - rate_limited
                          - server_error
                          - not_implemented
                        description: The category of error that occurred
                      message:
                        type: string
                        description: Human-readable error message
                      docs_url:
                        type: string
                        format: uri
                        description: Link to relevant documentation
                      request_id:
                        type: string
                        description: Unique request identifier for debugging
                    required:
                      - type
                      - message
                    description: Error details
                required:
                  - error
                description: Standard error response format
              example:
                error:
                  type: server_error
                  message: An unexpected error occurred

````