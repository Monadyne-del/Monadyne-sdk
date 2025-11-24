# API Reference

This document describes the public API exported by `@sdk/sdk`.

## Exports

From `packages/sdk/src/index.ts` the SDK exports:

- `createAtomicInstruction(props)` → `AtomicInstruction`
- `createSchedule(instructions, id?)` → `Schedule`
- `serializeSchedule(schedule)` → `string`
- `deserializeSchedule(serialized)` → `Schedule`
- `hashSchedule(schedule)` → `string`
- `generateDeterministicId(seed)` → `string`
- `validateInstruction(instr)` → `{ ok, issues, warnings }`
- `detectDuplicateIds(schedule)` → `string[]`
- `detectAccountConflicts(schedule)` → `string[]`
- `validateSchedule(schedule)` → `{ ok, issues, warnings }`
- `planParallelBatches(instructions)` → `AtomicInstruction[][]`
- `buildTransactions(schedule)` → `TransactionLike[]`
- `executeBatches(batches, options?)` → `Promise<results>`


## Types

### AccountMeta
- `pubkey: string` (base58-like)
- `writable: boolean`
- `signer?: boolean`

### AtomicInstruction
- `id: string` deterministic id
- `programId: string` program pubkey
- `accounts: AccountMeta[]`
- `data?: any` program-defined payload

### Schedule
- `id: string`
- `instructions: AtomicInstruction[]`
- `createdAt: string` ISO timestamp

### ValidationResult
- `ok: boolean`
- `issues: string[]` critical problems
- `warnings: string[]` non-fatal issues

## Examples

Creating and validating a schedule:

```ts
import { createAtomicInstruction, createSchedule, validateSchedule } from '@sdk/sdk';

const instr = createAtomicInstruction({ programId: 'Sys1111111111111111111111111111111111111', accounts: [{ pubkey: 'A...', writable: true, signer: true }], data: { foo: 'bar' } });
const schedule = createSchedule([instr]);
const v = validateSchedule(schedule);
if (!v.ok) console.error(v.issues);
```

Batch planning and execution:

```ts
import { planParallelBatches, buildTransactions, executeBatches } from '@sdk/sdk';

const batches = planParallelBatches(schedule.instructions);
const txs = buildTransactions(schedule);
const results = await executeBatches(txs, { delayPerBatchMs: 50 });
```


## Notes on Determinism
- IDs are generated with sha256 of deterministic input and truncated.
- Simulation and hashing use Node `crypto` and are deterministic across runs.
