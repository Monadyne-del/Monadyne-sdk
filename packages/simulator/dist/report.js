"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderReport = renderReport;
function renderReport(sim) {
    const lines = [];
    lines.push(`Simulation for schedule: ${sim.scheduleId}`);
    lines.push(`Total compute units: ${sim.totalCompute}`);
    lines.push(`Layers: ${sim.layers.map(l => `[${l.join(',')}]`).join(' | ')}`);
    lines.push('Per-instruction details:');
    for (const p of sim.perInstruction) {
        lines.push(` - ${p.id}: CU=${p.computeUnits}, latency=${p.latencyMs}ms, ok=${p.success}`);
    }
    return lines.join('\n');
}
//# sourceMappingURL=report.js.map