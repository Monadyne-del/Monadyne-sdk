import { createAtomicInstruction, createSchedule, hashSchedule } from '@sdk/sdk';
import { validateSchedule } from '@sdk/sdk';
import { planParallelBatches } from '@sdk/sdk';

async function main() {
  const instr1 = createAtomicInstruction({
    programId: 'Sys1111111111111111111111111111111111111',
    accounts: [
      { pubkey: 'FromA11111111111111111111111111111111111', writable: true, signer: true },
      { pubkey: 'ToA11111111111111111111111111111111111111', writable: true }
    ],
    data: { type: 'transfer', lamports: 1000 }
  });

  const instr2 = createAtomicInstruction({
    programId: 'Sys1111111111111111111111111111111111111',
    accounts: [
      { pubkey: 'FromB11111111111111111111111111111111111', writable: true, signer: true },
      { pubkey: 'ToB11111111111111111111111111111111111111', writable: true }
    ],
    data: { type: 'transfer', lamports: 2000 }
  });

  const schedule = createSchedule([instr1, instr2]);
  console.log('schedule id', schedule.id, 'hash', hashSchedule(schedule));

  const v = validateSchedule(schedule);
  console.log('validation:', v);

  const batches = planParallelBatches(schedule.instructions);
  console.log('planned batches:', batches.map(b => b.map(i => i.id)));
}

main().catch(e => { console.error(e); process.exit(1); });
