![Solana Monad SDK Banner](./public/banner.png)

# Solana Monad SDK

Elegant, production-ready utilities to build deterministic, parallel schedules for Solana programs.

This repository provides a focused TypeScript SDK and supporting tools that implement core Monad ideas adapted to Solana's account model:

- Optimistic parallel execution of non-conflicting instructions
- Deterministic validation and schedule hashing
- DAG-based scheduling for dependent writes
- Lightweight simulator for profiling compute and latency

Quick start

1. Install dependencies and build the monorepo:

```powershell
cd D:\Project\SDK-DATA\monadyne\solana-monad-sdk
pnpm install
pnpm -w -r run build
```

2. Run the examples (already compiled under `packages/examples/dist`):

```powershell
node packages\examples\dist\examples\example-simple.js
node packages\examples\dist\examples\example-conflict.js
```

Overview

- `packages/sdk` — Core APIs (schedule creation, validation, batching, execution helpers).
- `packages/simulator` — DAG builder and deterministic simulator to measure compute/latency.
- `packages/examples` — Practical examples demonstrating validation, batching, and a Devnet send example.
- `docs` — Complete written documentation and developer guides.

Documentation & Support

Comprehensive documentation lives in the `docs/` folder and is written for engineers integrating high-throughput transaction scheduling into Solana applications. A professional banner image is included at `public/banner.png` and is displayed above.

Contributing

We welcome contributions. Please follow TypeScript strict mode, include tests for new validation rules, and keep changes minimal and focused.

License

MIT

If you'd like, I can:
- generate a static HTML docs preview locally,
- add a `CHANGELOG.md`, or
- prepare a ready-to-push commit with a clear commit message.
