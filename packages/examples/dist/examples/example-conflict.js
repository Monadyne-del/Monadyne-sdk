"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sdk_1 = require("@sdk/sdk");
const sdk_2 = require("@sdk/sdk");
async function main() {
    const shared = 'SharedAcct111111111111111111111111111111111';
    const instr1 = (0, sdk_1.createAtomicInstruction)({
        programId: 'ProgX1111111111111111111111111111111111111',
        accounts: [
            { pubkey: shared, writable: true, signer: true },
            { pubkey: 'Other111111111111111111111111111111111111', writable: false }
        ],
        data: { op: 'writeA' }
    });
    const instr2 = (0, sdk_1.createAtomicInstruction)({
        programId: 'ProgY1111111111111111111111111111111111111',
        accounts: [
            { pubkey: shared, writable: true, signer: true },
            { pubkey: 'Other211111111111111111111111111111111111', writable: false }
        ],
        data: { op: 'writeB' }
    });
    const schedule = (0, sdk_1.createSchedule)([instr1, instr2]);
    const v = (0, sdk_2.validateSchedule)(schedule);
    console.log('validation:', JSON.stringify(v, null, 2));
    if (!v.ok)
        process.exit(2);
}
main().catch(e => { console.error(e); process.exit(1); });
//# sourceMappingURL=example-conflict.js.map