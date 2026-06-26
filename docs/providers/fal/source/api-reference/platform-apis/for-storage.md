# Platform APIs for Storage

**Source:** https://fal.ai/docs/api-reference/platform-apis/for-storage.md

> ## Documentation Index
> Fetch the complete documentation index at: https://fal.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Platform APIs for Storage

> Manage access control, signed URLs, and lifecycle settings for fal CDN files

The **fal Platform APIs** for Storage provide programmatic control over files stored on the fal CDN, including:

* **File ACLs** - Read and replace the Access Control List of a CDN file to make it public, restrict it, or grant access to specific users
* **Signed URLs** - Mint time-limited URLs that grant temporary access to access-restricted files (valid up to 7 days)
* **Account storage settings** - Configure account-wide defaults for newly uploaded files, including auto-expiration and the initial ACL

## Available Operations

The Platform APIs provide the following endpoints for Storage:

  - **[Get File ACL](/platform-apis/v1/storage/files/acl/get)** — Retrieve the Access Control List currently applied to a fal CDN file

  - **[Set File ACL](/platform-apis/v1/storage/files/acl/set)** — Replace the Access Control List of a fal CDN file with a default decision and
    optional per-user rules

  - **[Sign File URL](/platform-apis/v1/storage/files/sign)** — Create a signed URL that grants temporary access to a file regardless of its
    ACL

  - **[Get Storage Settings](/platform-apis/v1/storage/settings/get)** — Read the account-level lifecycle settings applied to newly uploaded files

  - **[Update Storage Settings](/platform-apis/v1/storage/settings/update)** — Replace the account-level defaults for auto-expiration and the initial ACL of
    new uploads

## Access Control Lists

A file ACL is composed of a **default decision** plus optional **per-user rules** that override the default:

* `allow` - access is granted
* `forbid` - access is denied (the file returns an error)
* `hide` - access is denied and the file is treated as if it does not exist

Setting `default` to `allow` with no rules makes a file public. Using `forbid` or
`hide` restricts the file to only the users named in the rules.

> **📝  Note:** Rules that reference users who do not exist are dropped. The response always
  reflects the ACL actually applied, so verify it contains the rules you sent.

## Authentication

All Storage endpoints require authentication. Include your API key in the `Authorization` header:

```
Authorization: Key YOUR_API_KEY
```

Permissions are split by capability:

| Operation                    | Required permission      |
| ---------------------------- | ------------------------ |
| Get file ACL / Sign file URL | `assets:read`            |
| Set file ACL                 | `assets:write`           |
| Get storage settings         | `account:settings:read`  |
| Update storage settings      | `account:settings:write` |
