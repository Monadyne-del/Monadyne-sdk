# Developer Guide

This guide helps contributors understand the codebase conventions, build process, and how to extend the SDK.

Repository layout

- `packages/sdk/src`: core implementation. Keep modules focused: `schedule.ts`, `validator.ts`, `executor.ts`, `util.ts`.
- `packages/simulator/src`: DAG builder and simulator.
- `packages/examples`: runnable examples demonstrating validation, batching and execution.

Building and testing

- Use `pnpm` and compile with `tsc`.
- Keep TypeScript `strict` settings enabled; write runtime-safe code.

Extending the SDK

- To add a new validator check, add a function in `validator.ts` and include it in `validateSchedule`.
- To change batching behavior, implement a new planner in `executor.ts` and expose it from `index.ts`.

Coding conventions

- Prefer explicit types for exported functions and objects.
- Use `crypto.createHash('sha256')` for deterministic ids and hashes.

Release process

- Tag releases with semantic versioning.
- Update `CHANGELOG.md` (create one if absent) with summary of features and breaking changes.
