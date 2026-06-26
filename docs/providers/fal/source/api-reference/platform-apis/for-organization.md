# Platform APIs for Organizations

**Source:** https://fal.ai/docs/api-reference/platform-apis/for-organization.md

> ## Documentation Index
> Fetch the complete documentation index at: https://fal.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Platform APIs for Organizations

> Programmatic access to organization-wide team listings and cross-team usage records

The **fal Platform APIs** provide programmatic access to organization-level data spanning every team and product line, including:

* **Team listings** - List all teams in your organization and identify the root team
* **Usage records** - Browse cross-team, cross-product usage attributed to each team and product line

## Available Operations

The Platform APIs provide the following endpoints for organization administration:

  - **[Organization Teams](/platform-apis/v1/organization/teams)** — List the teams in your organization with their details, including the root team

  - **[Organization Usage](/platform-apis/v1/organization/usage)** — Browse paginated usage records across all teams and product lines, with per-team and per-product attribution

> **📝  Note:** These endpoints are available to enterprise customers with organizations enabled, and must be called with an admin API key on the organization's root team. Contact your account team or [support@fal.ai](mailto:support@fal.ai) to request access.

