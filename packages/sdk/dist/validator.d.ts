import { AtomicInstruction, Schedule } from './schedule';
export type ValidationResult = {
    ok: boolean;
    issues: string[];
    warnings: string[];
};
export declare function validateInstruction(instr: AtomicInstruction): ValidationResult;
export declare function detectDuplicateIds(schedule: Schedule): string[];
export declare function detectAccountConflicts(schedule: Schedule): string[];
export declare function validateSchedule(schedule: Schedule): ValidationResult;
