import { AtomicInstruction, Schedule } from './schedule';
export type TransactionLike = {
    id: string;
    instructions: AtomicInstruction[];
};
export declare function planParallelBatches(instructions: AtomicInstruction[]): AtomicInstruction[][];
export declare function buildTransactions(schedule: Schedule): TransactionLike[];
export declare function executeBatches(batches: TransactionLike[], executorOptions?: {
    delayPerBatchMs?: number;
}): Promise<{
    batchId: string;
    ok: boolean;
    details: string[];
}[]>;
