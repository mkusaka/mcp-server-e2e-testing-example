# MCP Server E2E Testing Example

A minimal example repository demonstrating two patterns for end‑to‑end (E2E) testing a TypeScript MCP (Model Context Protocol) server using [Vitest](https://vitest.dev/):

- **Raw approach**: Spawning the CLI with `tsx` and communicating over `stdio` (JSON‑RPC).
- **SDK approach**: Using the official MCP SDK’s `Client` and `InMemoryTransport` for in‑memory RPC.

Repository: https://github.com/mkusaka/mcp-server-e2e-testing-example

---

## 📁 Repository Layout

```
.
├── LICENSE
├── README.md
├── package.json
├── pnpm-lock.yaml
├── src
│   ├── cli.ts         # CLI entrypoint (tsx + stdio transport)
│   └── server.ts      # createServer() factory (resources, prompts, tools)
├── tests
│   └── e2e
│       ├── raw.spec.ts  # spawn‑based E2E tests
│       └── sdk.spec.ts  # SDK/InMemoryTransport‑based E2E tests
└── tsconfig.json
```

---

## 🚀 Getting Started

### Prerequisites

- Node.js ≥ 16
- [pnpm](https://pnpm.io/) installed globally
- Git

### Installation

```bash
# Clone the repo
git clone https://github.com/mkusaka/mcp-server-e2e-testing-example.git
cd mcp-server-e2e-testing-example

# Install dependencies
pnpm install
```

---

## 🧪 Running E2E Tests

### 1. Raw (spawn + stdio) tests

This suite launches the CLI (`src/cli.ts`) via `npx tsx` and sends JSON‑RPC over `stdin`/`stdout`.

```bash
pnpm vitest run tests/e2e/raw.spec.ts
```

### 2. SDK (in‑memory) tests

This suite uses the MCP SDK’s `Client` + `InMemoryTransport` to invoke the same server logic without spawning a child process.

```bash
pnpm vitest run tests/e2e/sdk.spec.ts
```

---

## 🛠️ Scripts

Add these to `package.json` if desired:

```jsonc
{
  "scripts": {
    "test:raw": "vitest run tests/e2e/raw.spec.ts",
    "test:sdk": "vitest run tests/e2e/sdk.spec.ts",
    "test": "vitest run"
  }
}
```

- `pnpm run test:raw` – Run only the raw/stdio tests  
- `pnpm run test:sdk` – Run only the in‑memory SDK tests  
- `pnpm run test` – Run all tests

---

## 📦 Publishing & Usage

This repository is intended as an example/template. Feel free to:

- Adapt the `src/server.ts` factory for your own MCP server  
- Expand `raw.spec.ts` and `sdk.spec.ts` with additional test cases  
- Integrate into your CI pipeline

---

## 📄 License

Released under the [MIT License](LICENSE).
