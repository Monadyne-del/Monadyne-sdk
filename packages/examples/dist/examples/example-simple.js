"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_1 = require("@sdk/sdk");
const sdk_2 = require("@sdk/sdk");
const sdk_3 = require("@sdk/sdk");
async function main() {
    const instr1 = (0, sdk_1.createAtomicInstruction)({
        programId: 'Sys1111111111111111111111111111111111111',
        accounts: [
            { pubkey: 'FromA11111111111111111111111111111111111', writable: true, signer: true },
            { pubkey: 'ToA11111111111111111111111111111111111111', writable: true }
        ],
        data: { type: 'transfer', lamports: 1000 }
    });
    const instr2 = (0, sdk_1.createAtomicInstruction)({
        programId: 'Sys1111111111111111111111111111111111111',
        accounts: [
            { pubkey: 'FromB11111111111111111111111111111111111', writable: true, signer: true },
            { pubkey: 'ToB11111111111111111111111111111111111111', writable: true }
        ],
        data: { type: 'transfer', lamports: 2000 }
    });
    const schedule = (0, sdk_1.createSchedule)([instr1, instr2]);
    console.log('schedule id', schedule.id, 'hash', (0, sdk_1.hashSchedule)(schedule));
    const v = (0, sdk_2.validateSchedule)(schedule);
    console.log('validation:', v);
    const batches = (0, sdk_3.planParallelBatches)(schedule.instructions);
    console.log('planned batches:', batches.map(b => b.map(i => i.id)));
}
main().catch(e => { console.error(e); process.exit(1); });
//# sourceMappingURL=example-simple.js.map