import { Connection, Keypair, SystemProgram, Transaction, sendAndConfirmTransaction } from '@solana/web3.js';
import { createAtomicInstruction, createSchedule } from '@sdk/sdk';
import { validateSchedule } from '@sdk/sdk';
import { planParallelBatches } from '@sdk/sdk';

async function main() {
  const payer = Keypair.generate();
  const dest = Keypair.generate();

  const instr1 = createAtomicInstruction({
    programId: SystemProgram.programId.toBase58(),
    accounts: [
      { pubkey: payer.publicKey.toBase58(), writable: true, signer: true },
      { pubkey: dest.publicKey.toBase58(), writable: true }
    ],
    data: { type: 'transfer', lamports: 1_000_000 } // 0.001 SOL
  });

  const schedule = createSchedule([instr1]);
  const v = validateSchedule(schedule);
  if (!v.ok) {
    console.error('validation failed', v);
    process.exit(2);
  }

  const connection = new Connection('https://api.devnet.solana.com', 'confirmed');

  // Airdrop some SOL to payer
  const sig = await connection.requestAirdrop(payer.publicKey, 2_000_000);
  await connection.confirmTransaction(sig, 'confirmed');

  const batches = planParallelBatches(schedule.instructions);

  for (const batch of batches) {
    const tx = new Transaction();
    for (const instr of batch) {
      if (instr.data && instr.data.type === 'transfer') {
        const from = Keypair.fromSecretKey(payer.secretKey); // payer is signer
        tx.add(SystemProgram.transfer({ fromPubkey: payer.publicKey, toPubkey: dest.publicKey, lamports: instr.data.lamports }));
      } else {
        throw new Error('Unsupported instruction type in example-send');
      }
    }
    const res = await sendAndConfirmTransaction(connection, tx, [payer]);
    console.log('batch sent, signature:', res);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
