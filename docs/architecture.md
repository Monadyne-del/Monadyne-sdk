# Architecture — Monad Concepts Adapted to Solana

This document explains how the core Monad technologies are adapted to Solana instruction execution model:

- Optimistic Parallel Execution: We assume instructions can be executed in parallel when they do not declare conflicting writable accounts. The SDK builds a schedule and applies greedy batching to group non-conflicting instructions into parallel batches for optimistic execution.

- Deterministic Validation: Before execution, the schedule is validated deterministically. Validation checks include instruction id uniqueness, account shape and pubkey format, program id format, and writable-account conflict detection. The validator returns an explicit set of issues and warnings so callers can decide to abort or reconcile.

- DAG Scheduling: When conflicts exist (shared writable accounts), the simulator can build a DAG representing write dependencies. The DAG is used to compute topological layers which represent safe parallel execution layers. This DAG approach ensures ordering where necessary and parallelism where possible.

- Account Conflict Detection: Conflict detection primarily focuses on writable accounts: if two instructions declare the same writable account, they conflict and cannot be placed in the same optimistic parallel batch. The validator reports those conflicts precisely.

The result is a lightweight, deterministic framework that maps Monad concepts into Solana's account-instruction model while remaining easy to simulate and to transform into real Solana transactions in examples.
