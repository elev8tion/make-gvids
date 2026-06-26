---
title: "MCP Server"
description: "Connect each::labs to Cursor, Claude Desktop, Windsurf, and other AI editors. Generate media right from your IDE."
---

The each::labs MCP server lets AI-powered editors and agents tap into 500+ AI models for image, video, audio, and 3D generation. All without leaving your IDE.

## Connect to Cursor

  
**Open Cursor Settings**
Go to **Cursor Settings > MCP** or press `Cmd+Shift+P` and search for "MCP".

  
**Add the each::labs MCP server**
Click **"Add new MCP server"** and paste this URL:

    ```
    https://docs.eachlabs.ai/mcp
    ```

  
**Start using it**
Ask Cursor to generate images, videos, or audio. The MCP server handles the rest.

## Connect to Claude Desktop

Add this to your Claude Desktop config file:

  
    Edit `~/Library/Application Support/Claude/claude_desktop_config.json`:

    ```json
    {
      "mcpServers": {
        "eachlabs": {
          "url": "https://docs.eachlabs.ai/mcp"
        }
      }
    }
    ```
  
  
    Edit `%APPDATA%\Claude\claude_desktop_config.json`:

    ```json
    {
      "mcpServers": {
        "eachlabs": {
          "url": "https://docs.eachlabs.ai/mcp"
        }
      }
    }
    ```
  

## Connect to Windsurf

Go to **Windsurf Settings > MCP** and add a new server with this URL:

```
https://docs.eachlabs.ai/mcp
```

## Connect to VS Code (Copilot)

Add to your VS Code `settings.json`:

```json
{
  "mcp": {
    "servers": {
      "eachlabs": {
        "url": "https://docs.eachlabs.ai/mcp"
      }
    }
  }
}
```

## Connect to Claude Code

```bash
claude mcp add eachlabs --transport sse https://docs.eachlabs.ai/mcp
```

## What You Can Do

Once connected, your AI assistant gets superpowers:

- **Generate images** with Flux, Nano Banana, Gemini Imagen, and more
- **Generate videos** with Veo 3, Kling 3.0, Sora 2, and more
- **Edit images** like background removal, upscaling, face swap, inpainting
- **Generate audio** with ElevenLabs TTS and Mureka music generation
- **Run workflows** to trigger multi-step AI pipelines
- **Chat with each::sense** for natural language media generation
