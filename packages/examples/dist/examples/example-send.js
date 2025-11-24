"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const sdk_1 = require("@sdk/sdk");
const sdk_2 = require("@sdk/sdk");
const sdk_3 = require("@sdk/sdk");
async function main() {
    const payer = web3_js_1.Keypair.generate();
    const dest = web3_js_1.Keypair.generate();
    const instr1 = (0, sdk_1.createAtomicInstruction)({
        programId: web3_js_1.SystemProgram.programId.toBase58(),
        accounts: [
            { pubkey: payer.publicKey.toBase58(), writable: true, signer: true },
            { pubkey: dest.publicKey.toBase58(), writable: true }
        ],
        data: { type: 'transfer', lamports: 1000000 } // 0.001 SOL
    });
    const schedule = (0, sdk_1.createSchedule)([instr1]);
    const v = (0, sdk_2.validateSchedule)(schedule);
    if (!v.ok) {
        console.error('validation failed', v);
        process.exit(2);
    }
    const connection = new web3_js_1.Connection('https://api.devnet.solana.com', 'confirmed');
    // Airdrop some SOL to payer
    const sig = await connection.requestAirdrop(payer.publicKey, 2000000);
    await connection.confirmTransaction(sig, 'confirmed');
    const batches = (0, sdk_3.planParallelBatches)(schedule.instructions);
    for (const batch of batches) {
        const tx = new web3_js_1.Transaction();
        for (const instr of batch) {
            if (instr.data && instr.data.type === 'transfer') {
                const from = web3_js_1.Keypair.fromSecretKey(payer.secretKey); // payer is signer
                tx.add(web3_js_1.SystemProgram.transfer({ fromPubkey: payer.publicKey, toPubkey: dest.publicKey, lamports: instr.data.lamports }));
            }
            else {
                throw new Error('Unsupported instruction type in example-send');
            }
        }
        const res = await (0, web3_js_1.sendAndConfirmTransaction)(connection, tx, [payer]);
        console.log('batch sent, signature:', res);
    }
}
main().catch(e => { console.error(e); process.exit(1); });
//# sourceMappingURL=example-send.js.map