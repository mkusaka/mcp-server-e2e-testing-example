#!/usr/bin/env tsx

import { createServer } from "./server.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

async function main() {
  const server = createServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.log("Listening on stdio");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
