# Platform APIs for Assets

**Source:** https://fal.ai/docs/api-reference/platform-apis/for-assets.md

> ## Documentation Index
> Fetch the complete documentation index at: https://fal.ai/docs/llms.txt
> Use this file to discover all available pages before exploring further.

# Platform APIs for Assets

> Programmatic access to fal Assets for browsing, searching, uploading, and organizing generated media

The **fal Platform APIs** provide programmatic access to fal Assets, including:

* **Browse and search** - List assets, filter by media type or source, and search with text or fal-hosted media
* **Uploads** - Add media to your Assets library from API or CLI-driven workflows
* **Collections** - Create manual collections and add or remove assets
* **Characters** - Create reusable character collections with reference images
* **Tags and favorites** - Organize assets with tags and favorite state

Use these APIs when you want generated outputs, uploaded references, and reusable creative assets to be available outside the dashboard. For generating new media, use the [Model APIs](/documentation/model-apis/overview), then use Assets to browse, search, and organize the media that belongs in your library.

## Available Operations

The Platform APIs provide the following endpoints for fal Assets:

  - **[Browse Assets](/platform-apis/v1/assets)** — Browse and semantically search assets across media, uploads, favorites, collections, tags, and character references

  - **[Upload Asset](/platform-apis/v1/assets/uploads)** — Upload fal-hosted media into your Assets library

  - **[Get Asset](/platform-apis/v1/assets/get)** — Retrieve a single asset by vector ID

  - **[Favorite Asset](/platform-apis/v1/assets/favorite)** — Favorite an asset by vector ID or request ID

## Collections

  - **[List Collections](/platform-apis/v1/assets/collections)** — List asset collections in your library

  - **[Create Collection](/platform-apis/v1/assets/collections/create)** — Create a collection for organizing related assets

  - **[Browse Collection Assets](/platform-apis/v1/assets/collections/assets)** — Browse assets inside a collection

  - **[Add Asset to Collection](/platform-apis/v1/assets/collections/assets/add)** — Add an asset to a collection by vector ID or request ID

## Characters

  - **[List Characters](/platform-apis/v1/assets/characters)** — List character collections in your library

  - **[Create Character](/platform-apis/v1/assets/characters/create)** — Create a reusable character from descriptions and reference images

  - **[Get Character](/platform-apis/v1/assets/characters/get)** — Retrieve a character collection

  - **[Favorite Character](/platform-apis/v1/assets/characters/favorite)** — Mark a character collection as a favorite

## Tags

  - **[List Tags](/platform-apis/v1/assets/tags)** — List tags in your Assets library

  - **[Create Tag](/platform-apis/v1/assets/tags/create)** — Create a tag for organizing assets

  - **[Set Tags for Asset](/platform-apis/v1/assets/tags/set-for-asset)** — Replace the full tag set for an asset

  - **[Assign Tag](/platform-apis/v1/assets/tags/assign)** — Assign a tag to an asset by vector ID or request ID

## Authentication

Assets endpoints require an API key in the `Authorization` header:

```bash theme={null}
Authorization: Key YOUR_API_KEY
```

> **📝  Note:** If generated media is not appearing in Assets, check your Assets settings in the dashboard and enable the request sources you want available in the library.

