import { AccountMeta, AtomicInstruction, Schedule } from './schedule';
import { isValidPubkey } from './util';

export type ValidationResult = { ok: boolean; issues: string[]; warnings: string[] };

export function validateInstruction(instr: AtomicInstruction): ValidationResult {
  const issues: string[] = [];
  const warnings: string[] = [];

  if (!instr.id || typeof instr.id !== 'string') issues.push('Invalid or missing id');
  if (!instr.programId || typeof instr.programId !== 'string' || !isValidPubkey(instr.programId)) {
    issues.push(`programId invalid: ${String(instr.programId)}`);
  }

  if (!Array.isArray(instr.accounts) || instr.accounts.length === 0) {
    issues.push('accounts must be a non-empty array');
  } else {
    instr.accounts.forEach((a, idx) => {
      if (!a || typeof a.pubkey !== 'string' || !isValidPubkey(a.pubkey)) issues.push(`account[${idx}].pubkey invalid: ${String(a && a.pubkey)}`);
      if (typeof a.writable !== 'boolean') issues.push(`account[${idx}].writable must be boolean`);
    });
  }

  return { ok: issues.length === 0, issues, warnings };
}

export function detectDuplicateIds(schedule: Schedule): string[] {
  const seen = new Map<string, number>();
  const dupes: string[] = [];
  for (const instr of schedule.instructions) {
    const c = (seen.get(instr.id) || 0) + 1;
    seen.set(instr.id, c);
    if (c > 1) dupes.push(instr.id);
  }
  return dupes;
}

export function detectAccountConflicts(schedule: Schedule): string[] {
  // If two different instructions have the same writable account, that's a conflict
  const writableMap = new Map<string, string[]>();
  for (const instr of schedule.instructions) {
    for (const a of instr.accounts) {
      if (a.writable) {
        const arr = writableMap.get(a.pubkey) || [];
        arr.push(instr.id);
        writableMap.set(a.pubkey, arr);
      }
    }
  }
  const conflicts: string[] = [];
  for (const [pubkey, ids] of writableMap.entries()) {
    if (ids.length > 1) conflicts.push(`writable conflict on ${pubkey}: ${ids.join(',')}`);
  }
  return conflicts;
}

export function validateSchedule(schedule: Schedule): ValidationResult {
  const issues: string[] = [];
  const warnings: string[] = [];

  // individual instruction validation
  schedule.instructions.forEach((instr, idx) => {
    const r = validateInstruction(instr);
    r.issues.forEach(i => issues.push(`instr[${idx}]: ${i}`));
    r.warnings.forEach(w => warnings.push(`instr[${idx}]: ${w}`));
  });

  // duplicates
  const dupes = detectDuplicateIds(schedule);
  dupes.forEach(d => issues.push(`duplicate id: ${d}`));

  // conflicts
  const conflicts = detectAccountConflicts(schedule);
  conflicts.forEach(c => issues.push(c));

  return { ok: issues.length === 0, issues, warnings };
}
