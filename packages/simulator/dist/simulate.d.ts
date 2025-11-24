export type AtomicInstruction = {
    id: string;
    programId: string;
    accounts: Array<{
        pubkey: string;
        writable: boolean;
        signer?: boolean;
    }>;
    data?: any;
};
export type InstructionSimulation = {
    id: string;
    computeUnits: number;
    latencyMs: number;
    success: boolean;
};
export type SimulationResult = {
    scheduleId: string;
    totalCompute: number;
    layers: string[][];
    perInstruction: InstructionSimulation[];
};
export declare function simulate(instructions: AtomicInstruction[], scheduleId: string): SimulationResult;
