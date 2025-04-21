// src/server.ts
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { z } from "zod";

export function createServer() {
  const server = new McpServer({ name: "demo-server", version: "1.0.0" });

  // Resource: config://app
  server.resource("config", "config://app", async (uri) => ({
    contents: [{ uri: uri.href, text: "App configuration here" }],
  }));

  // Prompt: greet
  server.prompt("greet", { name: z.string() }, ({ name }) => ({
    messages: [
      {
        role: "user",
        content: { type: "text", text: `Greetings, ${name}!` },
      },
    ],
  }));

  // Tool: echo
  server.tool("echo", { message: z.string() }, async ({ message }) => ({
    content: [{ type: "text", text: message }],
  }));

  return server;
}
