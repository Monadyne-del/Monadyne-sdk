"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.simulate = simulate;
const task_graph_1 = require("./task-graph");
const crypto_1 = require("crypto");
function deterministicSeed(...parts) {
    const h = (0, crypto_1.createHash)('sha256');
    for (const p of parts)
        h.update(typeof p === 'string' || Buffer.isBuffer(p) ? p : String(p));
    return h.digest();
}
function seededRandom(seed) {
    let s = 0n;
    for (const b of seed)
        s = (s << 8n) + BigInt(b);
    return function () {
        s = (s * 6364136223846793005n + 1442695040888963407n) & ((1n << 64n) - 1n);
        return Number(s % 1000000n) / 1000000;
    };
}
function simulate(instructions, scheduleId) {
    const graph = (0, task_graph_1.buildGraphFromInstructions)(instructions);
    const c = (0, task_graph_1.detectCycle)(graph);
    if (c.hasCycle)
        throw new Error('Cycle detected: ' + (c.cyclePath || []).join('->'));
    const layers = (0, task_graph_1.layersFromGraph)(graph);
    const seed = deterministicSeed(scheduleId);
    const rnd = seededRandom(seed);
    const perInstruction = [];
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
//# sourceMappingURL=simulate.js.map