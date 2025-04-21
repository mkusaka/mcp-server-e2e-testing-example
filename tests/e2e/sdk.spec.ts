// tests/e2e/mcp.spec.ts

import { describe, test, beforeEach, expect } from "vitest";
import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { InMemoryTransport } from "@modelcontextprotocol/sdk/inMemory.js";
import {
  ListToolsResultSchema,
  CallToolResultSchema,
  GetPromptResultSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { createServer } from "../../src/server.js"; // your server factory

describe("MCP Server E2E (in‐memory)", () => {
  let mcpServer: ReturnType<typeof createServer>;
  let client: Client;
  let clientTransport: ReturnType<typeof InMemoryTransport.createLinkedPair>[0];
  let serverTransport: ReturnType<typeof InMemoryTransport.createLinkedPair>[1];

  beforeEach(async () => {
    // instantiate your server (register resources/prompts/tools)
    mcpServer = createServer();

    client = new Client({ name: "test client", version: "1.0" });
    [clientTransport, serverTransport] = InMemoryTransport.createLinkedPair();

    // connect both sides
    await Promise.all([
      mcpServer.server.connect(serverTransport),
      client.connect(clientTransport),
    ]);
  });

  test("tools/list returns all tools", async () => {
    // {"method":"tools/list","params":{}}
    const res = await client.request(
      { method: "tools/list", params: {} },
      ListToolsResultSchema,
    );
    expect(Array.isArray(res.tools)).toBe(true);
    // optionally check names, count, etc.
  });

  test("tools/call echo works", async () => {
    // {"method":"tools/call","params":{"name":"echo","arguments":{"message":"hello"}}}
    const res = await client.request(
      {
        method: "tools/call",
        params: { name: "echo", arguments: { message: "hello" } },
      },
      CallToolResultSchema,
    );
    expect(res.content[0].text).toBe("hello");
  });

  test("prompts/get greet works", async () => {
    // {"method":"prompts/get","params":{"name":"greet","arguments":{"name":"Alice"}}}
    const res = await client.request(
      {
        method: "prompts/get",
        params: { name: "greet", arguments: { name: "Alice" } },
      },
      GetPromptResultSchema,
    );
    expect(res.messages[0].content.text).toContain("Alice");
  });
});
