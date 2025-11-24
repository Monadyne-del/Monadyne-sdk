# Simulator

The simulator builds a task graph where vertices are instructions and directed edges represent write dependencies (when multiple instructions declare the same writable account). It then:

- Detects cycles and errors if present.
- Produces parallel layers via Kahn's algorithm: each layer can be executed in parallel.
- Runs a deterministic pseudo-random simulation that assigns compute units and latencies per instruction based on a schedule seed. This allows repeatable profiling and experimentation.

The simulator output includes total compute units, per-instruction compute and latency, and layer definitions for parallel execution planning.
