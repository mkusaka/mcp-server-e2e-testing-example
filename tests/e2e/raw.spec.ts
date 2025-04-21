// tests/e2e/mcp.spec.ts

import { describe, it, beforeAll, afterAll, expect } from "vitest";
import { spawn, ChildProcessWithoutNullStreams } from "child_process";
import readline from "readline";

describe("MCP Server E2E (raw)", () => {
  let proc: ChildProcessWithoutNullStreams;
  let rl: readline.Interface;

  beforeAll(async () => {
    proc = spawn("npx", ["tsx", "src/cli.ts"], {
      stdio: ["pipe", "pipe", "pipe"],
    }) as ChildProcessWithoutNullStreams;
    rl = readline.createInterface({ input: proc.stdout });

    await new Promise<void>((resolve, reject) => {
      const onLine = (line: string) => {
        if (line.includes("Listening on stdio")) {
          rl.off("line", onLine);
          resolve();
        }
      };
      rl.on("line", onLine);
      setTimeout(() => {
        rl.off("line", onLine);
        reject(new Error("server start timeout"));
      }, 5000);
    });
  });

  afterAll(() => {
    rl.close();
    proc.kill();
  });

  function sendRequest<T = any>(
    id: number,
    method: string,
    params: Record<string, any>,
  ): Promise<T> {
    return new Promise<T>((resolve, reject) => {
      const req = { jsonrpc: "2.0", id, method, params };
      proc.stdin.write(JSON.stringify(req) + "\n");

      const onLine = (line: string) => {
        let obj: any;
        try {
          obj = JSON.parse(line);
        } catch {
          return;
        }
        if (obj.id === id) {
          rl.off("line", onLine);
          resolve(obj.result);
        }
      };
      rl.on("line", onLine);

      setTimeout(() => {
        rl.off("line", onLine);
        reject(new Error(`request ${id} timeout`));
      }, 5000);
    });
  }

  it("should return tools list", async () => {
    // Example request:
    // {"jsonrpc":"2.0","id":1,"method":"tools/list","params":{}}
    const res = await sendRequest<{ tools: unknown[] }>(1, "tools/list", {});
    expect(Array.isArray(res.tools)).toBe(true);
  });

  it("should execute echo tool", async () => {
    // Example request:
    // {"jsonrpc":"2.0","id":2,"method":"tools/call","params":{"name":"echo","arguments":{"message":"hello"}}}
    const res = await sendRequest<{ content: { text: string }[] }>(
      2,
      "tools/call",
      { name: "echo", arguments: { message: "hello" } },
    );
    expect(res.content[0].text).toBe("hello");
  });

  it("should execute greet prompt", async () => {
    // Example request:
    // {"jsonrpc":"2.0","id":3,"method":"prompts/get","params":{"name":"greet","arguments":{"name":"Masatomo"}}}
    const res = await sendRequest<{
      messages: { content: { text: string } }[];
    }>(3, "prompts/get", { name: "greet", arguments: { name: "Masatomo" } });
    expect(res.messages[0].content.text).toContain("Masatomo");
  });
});
