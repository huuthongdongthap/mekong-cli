---
name: stitch
description: Generate, edit, and iterate on UI screens from text prompts using the Stitch SDK. Manage projects, retrieve HTML/screenshots, upload images, and use the StitchToolClient for agent-driven workflows. Use when the user wants to generate UI, create design systems, or work with Stitch projects.
---

# Stitch SDK — UI Generation from Text

Generate UI screens from text prompts and extract their HTML and screenshots programmatically.

## Prerequisites

- `STITCH_API_KEY` environment variable set (or `STITCH_ACCESS_TOKEN` + `GOOGLE_CLOUD_PROJECT` for OAuth)
- Node.js >= 18
- Package installed: `npm install @google/stitch-sdk`

## Quick Start

```typescript
import { stitch } from "@google/stitch-sdk";

const project = await stitch.createProject("My App");
const screen = await project.generate("A login page with email and password fields");
const html = await screen.getHtml();       // download URL for HTML
const imageUrl = await screen.getImage();  // download URL for screenshot
```

The `stitch` singleton reads `STITCH_API_KEY` from the environment and connects on first use — no setup code required.

## Working with Projects

```typescript
import { stitch } from "@google/stitch-sdk";

// List all projects
const projects = await stitch.projects();

// Reference a project by ID (no network call)
const project = stitch.project("4044680601076201931");

// Create a new project
const newProject = await stitch.createProject("My App");
```

## Generating and Iterating on Screens

```typescript
// Generate a new screen from a prompt
const screen = await project.generate("Login page with email and password fields");

// Edit an existing screen
const edited = await screen.edit("Make the background dark and add a subtitle");

// Generate variants of a screen
const variants = await screen.variants("Try different color schemes", {
  variantCount: 2,
  creativeRange: "EXPLORE",
  aspects: ["COLOR_SCHEME", "LAYOUT"],
});
```

## Retrieving Screen Assets

```typescript
// Get screen HTML download URL
const html = await screen.getHtml();

// Get screen screenshot download URL
const imageUrl = await screen.getImage();
```

Both methods use cached data from the generation response when available, falling back to an API call when needed.

## Uploading Images

Upload an existing image file (PNG, JPG, JPEG, WEBP) to create a screen directly from a mockup or asset.

```typescript
import { stitch } from "@google/stitch-sdk";

const project = stitch.project("your-project-id");
const [screen] = await project.uploadImage("./mockup.png", {
  title: "Home Screen",
});
console.log(screen.id);
const html = await screen.getHtml();
const imageUrl = await screen.getImage();
```

**Supported formats:** `.png`, `.jpg`, `.jpeg`, `.webp`

## Design Systems

```typescript
// Create a design system for a project
const ds = await project.createDesignSystem({ displayName: "My Theme" });

// List design systems
const systems = await project.listDesignSystems();

// Reference by ID (no network call)
const dsRef = project.designSystem("existing-asset-id");

// Update a design system
const updated = await ds.update({ displayName: "Updated Theme" });

// Apply to screens
const screens = await ds.apply([
  { id: "instance-id", sourceScreen: "projects/123/screens/456" },
]);
```

## Tool Client (Agent Usage)

For agents and orchestration scripts that need direct MCP tool access:

```typescript
import { StitchToolClient } from "@google/stitch-sdk";

const client = new StitchToolClient({ apiKey: "your-api-key" });

// List available tools
const { tools } = await client.listTools();
for (const tool of tools) {
  console.log(tool.name, tool.description);
}

// Call a tool directly
import { CreateProjectResponse } from "@google/stitch-sdk";
const result = await client.callTool<CreateProjectResponse>("create_project", {
  title: "Agent Project",
});
console.log(result.project?.projectId);

await client.close();
```

The client auto-connects on the first `callTool` or `listTools` call. No explicit `connect()` needed.

## Dynamic Tool Client (Singleton)

```typescript
import { stitch } from "@google/stitch-sdk";

// Find available tools
const { tools } = await stitch.listTools();

// Call any tool by name with a JSON payload
const result = await stitch.callTool("generate_screen_from_text", {
  projectId: "123",
  prompt: "A login page",
});

await stitch.close();
```

## AI SDK Integration

For agents built on the Vercel AI SDK:

```typescript
import { stitchTools } from "@google/stitch-sdk/ai";
import { generateText } from "ai";
import { google } from "@ai-sdk/google";

const result = await generateText({
  model: google("gemini-2.0-flash"),
  tools: stitchTools(), // all tools
  // or: stitchTools({ include: ["create_project"] }) // filtered
  prompt: "Create a project called My App",
});
```

Install with: `npm install @google/stitch-sdk ai`

## Explicit Configuration

```typescript
import { Stitch, StitchToolClient } from "@google/stitch-sdk";

const client = new StitchToolClient({
  apiKey: "your-api-key",
  baseUrl: "https://stitch.googleapis.com/mcp",
  timeout: 300_000,
});

const sdk = new Stitch(client);
const projects = await sdk.projects();
```

| Option | Env Variable | Description |
|--------|-------------|-------------|
| `apiKey` | `STITCH_API_KEY` | API key for authentication |
| `accessToken` | `STITCH_ACCESS_TOKEN` | OAuth access token |
| `projectId` | `GOOGLE_CLOUD_PROJECT` | GCP project ID (required with OAuth) |
| `baseUrl` | — | MCP server URL (default: `https://stitch.googleapis.com/mcp`) |
| `timeout` | — | Request timeout in ms (default: 300000) |

## Error Handling

All SDK methods throw `StitchError` on failure:

```typescript
import { stitch, StitchError } from "@google/stitch-sdk";

try {
  const project = stitch.project("bad-id");
  await project.screens();
} catch (error) {
  if (error instanceof StitchError) {
    console.error(error.code);     // "AUTH_FAILED", "NOT_FOUND", etc.
    console.error(error.message);  // Human-readable description
    console.error(error.recoverable); // Whether retrying might succeed
  }
}
```

Error codes: `AUTH_FAILED`, `NOT_FOUND`, `PERMISSION_DENIED`, `RATE_LIMITED`, `NETWORK_ERROR`, `VALIDATION_ERROR`, `UNKNOWN_ERROR`.

## API Reference

### `Stitch` — Root class, manages projects

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `createProject(title)` | `title: string` | `Promise<Project>` | Create a new project |
| `projects()` | — | `Promise<Project[]>` | List all accessible projects |
| `project(id)` | `id: string` | `Project` | Reference a project by ID (no API call) |

### `Project` — A Stitch project containing screens

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `generate(prompt, deviceType?)` | `prompt: string`, `deviceType?: DeviceType` | `Promise<Screen>` | Generate a screen from text |
| `screens()` | — | `Promise<Screen[]>` | List all screens |
| `getScreen(screenId)` | `screenId: string` | `Promise<Screen>` | Retrieve a specific screen |
| `uploadImage(filePath, opts?)` | `filePath: string`, `opts?: object` | `Promise<Screen[]>` | Upload image and create screen |
| `createDesignSystem(config)` | `config: object` | `Promise<DesignSystem>` | Create a design system |
| `listDesignSystems()` | — | `Promise<DesignSystem[]>` | List design systems |
| `designSystem(id)` | `id: string` | `DesignSystem` | Reference by ID (no API call) |

`DeviceType`: `"MOBILE"` | `"DESKTOP"` | `"TABLET"` | `"AGNOSTIC"`

### `Screen` — A generated UI screen

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `getHtml()` | — | `Promise<string>` | Get HTML download URL |
| `getImage()` | — | `Promise<string>` | Get screenshot download URL |
| `edit(prompt, deviceType?, modelId?)` | `prompt: string` | `Promise<Screen>` | Edit screen with text prompt |
| `variants(prompt, options, deviceType?, modelId?)` | `prompt: string`, `options: object` | `Promise<Screen[]>` | Generate design variants |

`modelId`: `"GEMINI_3_PRO"` | `"GEMINI_3_FLASH"`

### `DesignSystem` — Project design theme

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `update(config)` | `config: object` | `Promise<DesignSystem>` | Update theme |
| `apply(selectedScreenInstances)` | `instances: array` | `Promise<Screen[]>` | Apply to screens |

### `StitchToolClient` — Low-level MCP tool pipe

| Method | Parameters | Returns | Description |
|--------|-----------|---------|-------------|
| `callTool<T>(name, args)` | `name: string`, `args: object` | `Promise<T>` | Call an MCP tool |
| `listTools()` | — | `Promise<{ tools }>` | List available tools |
| `connect()` | — | `Promise<void>` | Explicitly connect (auto-called) |
| `close()` | — | `Promise<void>` | Close the connection |

### `stitch` Singleton

Pre-configured `Stitch` instance reading `STITCH_API_KEY` from env. Lazily initialized.

```typescript
import { stitch } from "@google/stitch-sdk";
const projects = await stitch.projects();
```

### `toolMap` — Static tool schemas

```typescript
import { stitch } from "@google/stitch-sdk";

const tool = stitch.toolMap.get("generate_screen_from_text");
if (tool) {
  const required = tool.params.filter((p) => p.required);
  const optional = tool.params.filter((p) => !p.required);
}
```

Each `ToolParam` has: `name`, `type`, `description`, `required`, `enum`.

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `STITCH_API_KEY` | Yes (or OAuth) | API key for authentication |
| `STITCH_ACCESS_TOKEN` | No | OAuth access token (alternative) |
| `GOOGLE_CLOUD_PROJECT` | With OAuth | Google Cloud project ID |
| `STITCH_HOST` | No | Override the MCP server URL |
