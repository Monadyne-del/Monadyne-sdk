"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAtomicInstruction = createAtomicInstruction;
exports.createSchedule = createSchedule;
exports.serializeSchedule = serializeSchedule;
exports.deserializeSchedule = deserializeSchedule;
exports.hashSchedule = hashSchedule;
exports.generateDeterministicId = generateDeterministicId;
const util_1 = require("./util");
const crypto_1 = require("crypto");
function createAtomicInstruction(props) {
    const base = JSON.stringify({ programId: props.programId, accounts: props.accounts, data: props.data });
    const id = props.id || generateDeterministicId(base);
    return { id, programId: props.programId, accounts: props.accounts, data: props.data };
}
function createSchedule(instructions, id) {
    const createdAt = new Date().toISOString();
    const body = JSON.stringify({ instructions: instructions.map(i => i.id), createdAt });
    const scheduleId = id || generateDeterministicId(body);
    return { id: scheduleId, instructions, createdAt };
}
function serializeSchedule(schedule) {
    return JSON.stringify(schedule);
}
function deserializeSchedule(serialized) {
    const parsed = JSON.parse(serialized);
    if (!parsed.id || !Array.isArray(parsed.instructions))
        throw new Error('Invalid schedule');
    return parsed;
}
function hashSchedule(schedule) {
    return (0, util_1.sha256Hex)(serializeSchedule(schedule));
}
function generateDeterministicId(seed) {
    return (0, crypto_1.createHash)('sha256').update(seed).digest('hex').slice(0, 32);
}
//# sourceMappingURL=schedule.js.map