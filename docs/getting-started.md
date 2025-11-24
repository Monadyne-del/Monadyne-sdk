# Getting Started

This quickstart walks you through installing and using the Solana Monad SDK in a development environment.

Prerequisites

- Node.js 18+ and `pnpm` installed
- A working Solana cluster endpoint for `example-send` (Devnet recommended)

Install & build

```bash
cd solana-monad-sdk
pnpm install
pnpm -w -r run build
pnpm -F @sdk/example build
```

Run examples

```bash
# Run the simple local example (no network required)
node packages/examples/dist/examples/example-simple.js

# Run the conflict detection example
node packages/examples/dist/examples/example-conflict.js

# Run example that sends to Devnet (requires network and a SOL-funded payer)
node packages/examples/dist/examples/example-send.js
```

Project layout

- `packages/sdk`: core TypeScript SDK (schedule, validator, executor, util)
- `packages/simulator`: DAG builder and deterministic simulator
- `packages/examples`: runnable examples that demonstrate common patterns
- `docs`: documentation (this folder)
- `public/banner.jpg`: professional banner image used in documentation

Support & contribution

- Open issues and PRs on the repository
- Follow code style: TypeScript, strict mode, no runtime side effects in core modules

Legal

Licensed under MIT.
