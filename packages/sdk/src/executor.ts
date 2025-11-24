import { AtomicInstruction, Schedule } from './schedule';

export type TransactionLike = { id: string; instructions: AtomicInstruction[] };

export function planParallelBatches(instructions: AtomicInstruction[]): AtomicInstruction[][] {
  // Greedy batching: place each instruction into the first batch where it doesn't share writable accounts
  const batches: AtomicInstruction[][] = [];

  const writableOf = (instr: AtomicInstruction) => new Set(instr.accounts.filter(a => a.writable).map(a => a.pubkey));

  for (const instr of instructions) {
    const wi = writableOf(instr);
    let placed = false;
    for (const batch of batches) {
      let conflict = false;
      for (const bInstr of batch) {
        const bwi = writableOf(bInstr);
        for (const pk of wi) {
          if (bwi.has(pk)) {
            conflict = true;
            break;
          }
        }
        if (conflict) break;
      }
      if (!conflict) {
        batch.push(instr);
        placed = true;
        break;
      }
    }
    if (!placed) {
      batches.push([instr]);
    }
  }

  // Guarantee at least 1 batch
  if (batches.length === 0) batches.push([]);
  return batches;
}

export function buildTransactions(schedule: Schedule): TransactionLike[] {
  const batches = planParallelBatches(schedule.instructions);
  return batches.map((batch, idx) => ({ id: `${schedule.id}-batch-${idx}`, instructions: batch }));
}

export async function executeBatches(batches: TransactionLike[], executorOptions?: { delayPerBatchMs?: number }) {
  const delay = (ms: number) => new Promise(res => setTimeout(res, ms));
  const results: Array<{ batchId: string; ok: boolean; details: string[] }> = [];

  for (const b of batches) {
    // naive optimistic parallel execution: assume success if no conflicting write within batch
    // we simply return success for each instruction in the batch
    const details: string[] = [];
    for (const instr of b.instructions) {
      // Simulate instruction execution deterministically
      details.push(`exec:${instr.id}`);
    }
    results.push({ batchId: b.id, ok: true, details });
    if (executorOptions?.delayPerBatchMs) await delay(executorOptions.delayPerBatchMs);
  }

  return results;
}
