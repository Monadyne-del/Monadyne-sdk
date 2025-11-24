# Executor and Batching

The executor implements a simple, deterministic batching strategy:

- `planParallelBatches(instructions)`: Greedy algorithm that scans instructions and places each instruction into the first batch where it does not share any writable account with existing instructions in that batch. If none found, it creates a new batch.

- `buildTransactions(schedule)`: Transforms batches into `TransactionLike` descriptors where each batch becomes one transaction-like unit.

- `executeBatches(batches)`: Executes batches sequentially (but each batch contains instructions that are safe to run in parallel). Execution is optimistic — it assumes intra-batch instructions do not conflict because the validator and batcher ensured no shared writable accounts.

This approach is intentionally simple and deterministic while being practical: it maximizes parallelism without risking write conflicts inside the same batch.
