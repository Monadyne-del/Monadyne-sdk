"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidPubkey = isValidPubkey;
exports.sha256Hex = sha256Hex;
exports.deterministicSeed = deterministicSeed;
const crypto_1 = require("crypto");
function isValidPubkey(pk) {
    // Basic check: base58-like (alphanumeric except 0,O,I,l) and length 32-44
    if (typeof pk !== 'string')
        return false;
    if (pk.length < 32 || pk.length > 44)
        return false;
    const allowed = /^[A-HJ-NP-Za-km-z1-9]+$/; // rough base58 subset
    return allowed.test(pk);
}
function sha256Hex(input) {
    return (0, crypto_1.createHash)('sha256').update(input).digest('hex');
}
function deterministicSeed(...parts) {
    const h = (0, crypto_1.createHash)('sha256');
    for (const p of parts)
        h.update(typeof p === 'string' || Buffer.isBuffer(p) ? p : String(p));
    return h.digest();
}
//# sourceMappingURL=util.js.map