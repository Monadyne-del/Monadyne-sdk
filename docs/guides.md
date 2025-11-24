# Usage Guides

This section contains practical guides for common tasks when using the Solana Monad SDK.

## Building Schedules for High Throughput

1. Create small atomic instructions that declare only the accounts they touch.
2. Prefer making read-only accounts non-writable to maximize parallelism.
3. Use `createAtomicInstruction` and `createSchedule` to assemble and `validateSchedule` before execution.
4. Use `planParallelBatches` to group non-conflicting instructions into optimistic batches.

Example:

```ts
const instrA = createAtomicInstruction({ programId: 'ProgA...', accounts: [{ pubkey: 'A', writable: true }], data: { op: 'a' } });
const instrB = createAtomicInstruction({ programId: 'ProgB...', accounts: [{ pubkey: 'B', writable: true }], data: { op: 'b' } });
const schedule = createSchedule([instrA, instrB]);
const v = validateSchedule(schedule);
if (!v.ok) throw new Error(v.issues.join('\n'));
const batches = planParallelBatches(schedule.instructions);
```

## Handling Conflicts

- When `validateSchedule` reports `writable conflict`, you have two options:
  - Reorder instructions to serialize conflicting writes.
  - Split schedule into dependent schedules where conflicts are intentionally ordered.

## Integrating with Solana Transactions

- Each optimistic batch can be transformed into a single transaction containing multiple instructions.
- The example `example-send.ts` shows transforming a batch into a Solana `Transaction` and sending it with `sendAndConfirmTransaction`.

## Testing and Simulation

- Use `@sdk/simulator` to build a DAG from instructions and produce layered parallel execution plans.
- Run deterministic simulations with `simulate` to measure compute units and latency profiles.

## Best Practices

- Keep instruction payloads small.
- Prefer explicit account declaration and conservative writable flags.
- Validate schedules in CI to catch duplicates and format problems early.
