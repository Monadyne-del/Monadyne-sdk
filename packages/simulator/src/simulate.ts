import { TaskGraph, buildGraphFromInstructions, layersFromGraph, detectCycle } from './task-graph';
import { createHash } from 'crypto';

// Local minimal types to avoid cross-package compile dependency
export type AtomicInstruction = {
  id: string;
  programId: string;
  accounts: Array<{ pubkey: string; writable: boolean; signer?: boolean }>;
  data?: any;
};

function deterministicSeed(...parts: Array<string|number|Buffer>): Buffer {
  const h = createHash('sha256');
  for (const p of parts) h.update(typeof p === 'string' || Buffer.isBuffer(p) ? p : String(p));
  return h.digest();
}

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

function seededRandom(seed: Buffer) {
  let s = 0n;
  for (const b of seed) s = (s << 8n) + BigInt(b);
  return function () {
    s = (s * 6364136223846793005n + 1442695040888963407n) & ((1n << 64n) - 1n);
    return Number(s % 1000000n) / 1000000;
  };
}

export function simulate(instructions: AtomicInstruction[], scheduleId: string): SimulationResult {
  const graph = buildGraphFromInstructions(instructions);
  const c = detectCycle(graph);
  if (c.hasCycle) throw new Error('Cycle detected: ' + (c.cyclePath || []).join('->'));
  const layers = layersFromGraph(graph);

  const seed = deterministicSeed(scheduleId);
  const rnd = seededRandom(seed);

  const perInstruction: InstructionSimulation[] = [];
  let total = 0;
  for (const instr of instructions) {
    // Deterministic but pseudo-random compute and latency
    const computeUnits = Math.floor(100 + rnd() * 400); // 100-500
    const latencyMs = Math.floor(20 + rnd() * 200); // 20-220ms
    const success = true; // In this mock, all succeed
    perInstruction.push({ id: instr.id, computeUnits, latencyMs, success });
    total += computeUnits;
  }

  return { scheduleId, totalCompute: total, layers, perInstruction };
}
