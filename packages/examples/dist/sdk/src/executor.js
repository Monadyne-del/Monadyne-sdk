"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.planParallelBatches = planParallelBatches;
exports.buildTransactions = buildTransactions;
exports.executeBatches = executeBatches;
function planParallelBatches(instructions) {
    // Greedy batching: place each instruction into the first batch where it doesn't share writable accounts
    const batches = [];
    const writableOf = (instr) => new Set(instr.accounts.filter(a => a.writable).map(a => a.pubkey));
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
                if (conflict)
                    break;
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
    if (batches.length === 0)
        batches.push([]);
    return batches;
}
function buildTransactions(schedule) {
    const batches = planParallelBatches(schedule.instructions);
    return batches.map((batch, idx) => ({ id: `${schedule.id}-batch-${idx}`, instructions: batch }));
}
async function executeBatches(batches, executorOptions) {
    const delay = (ms) => new Promise(res => setTimeout(res, ms));
    const results = [];
    for (const b of batches) {
        // naive optimistic parallel execution: assume success if no conflicting write within batch
        // we simply return success for each instruction in the batch
        const details = [];
        for (const instr of b.instructions) {
            // Simulate instruction execution deterministically
            details.push(`exec:${instr.id}`);
        }
        results.push({ batchId: b.id, ok: true, details });
        if (executorOptions?.delayPerBatchMs)
            await delay(executorOptions.delayPerBatchMs);
    }
    return results;
}
//# sourceMappingURL=executor.js.map