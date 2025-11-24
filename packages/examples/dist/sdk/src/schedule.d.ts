export type AccountMeta = {
    pubkey: string;
    writable: boolean;
    signer?: boolean;
};
export type AtomicInstruction = {
    id: string;
    programId: string;
    accounts: AccountMeta[];
    data?: any;
};
export type Schedule = {
    id: string;
    instructions: AtomicInstruction[];
    createdAt: string;
};
export declare function createAtomicInstruction(props: {
    programId: string;
    accounts: AccountMeta[];
    data?: any;
    id?: string;
}): AtomicInstruction;
export declare function createSchedule(instructions: AtomicInstruction[], id?: string): Schedule;
export declare function serializeSchedule(schedule: Schedule): string;
export declare function deserializeSchedule(serialized: string): Schedule;
export declare function hashSchedule(schedule: Schedule): string;
export declare function generateDeterministicId(seed: string): string;
