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
export type GraphNode = {
    id: string;
    instr: AtomicInstruction;
};
export type TaskGraph = {
    nodes: GraphNode[];
    edges: Map<string, Set<string>>;
};
export declare function buildGraphFromInstructions(instructions: AtomicInstruction[]): TaskGraph;
export declare function detectCycle(graph: TaskGraph): {
    hasCycle: boolean;
    cyclePath?: string[];
};
export declare function layersFromGraph(graph: TaskGraph): string[][];
