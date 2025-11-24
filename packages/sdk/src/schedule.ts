import { sha256Hex, deterministicSeed } from './util';
import { createHash } from 'crypto';

export type AccountMeta = { pubkey: string; writable: boolean; signer?: boolean };

export type AtomicInstruction = {
  id: string;
  programId: string;
  accounts: AccountMeta[];
  data?: any;
};

export type Schedule = {
  id: string;
  instructions: AtomicInstruction[];
  createdAt: string;
};

export function createAtomicInstruction(props: {
  programId: string;
  accounts: AccountMeta[];
  data?: any;
  id?: string;
}): AtomicInstruction {
  const base = JSON.stringify({ programId: props.programId, accounts: props.accounts, data: props.data });
  const id = props.id || generateDeterministicId(base);
  return { id, programId: props.programId, accounts: props.accounts, data: props.data };
}

export function createSchedule(instructions: AtomicInstruction[], id?: string): Schedule {
  const createdAt = new Date().toISOString();
  const body = JSON.stringify({ instructions: instructions.map(i => i.id), createdAt });
  const scheduleId = id || generateDeterministicId(body);
  return { id: scheduleId, instructions, createdAt };
}

export function serializeSchedule(schedule: Schedule): string {
  return JSON.stringify(schedule);
}

export function deserializeSchedule(serialized: string): Schedule {
  const parsed = JSON.parse(serialized);
  if (!parsed.id || !Array.isArray(parsed.instructions)) throw new Error('Invalid schedule');
  return parsed as Schedule;
}

export function hashSchedule(schedule: Schedule): string {
  return sha256Hex(serializeSchedule(schedule));
}

export function generateDeterministicId(seed: string): string {
  return createHash('sha256').update(seed).digest('hex').slice(0, 32);
}
