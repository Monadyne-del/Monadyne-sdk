import { createHash } from 'crypto';

export type PubkeyStr = string;

export function isValidPubkey(pk: string): boolean {
  // Basic check: base58-like (alphanumeric except 0,O,I,l) and length 32-44
  if (typeof pk !== 'string') return false;
  if (pk.length < 32 || pk.length > 44) return false;
  const allowed = /^[A-HJ-NP-Za-km-z1-9]+$/; // rough base58 subset
  return allowed.test(pk);
}

export function sha256Hex(input: string | Buffer): string {
  return createHash('sha256').update(input).digest('hex');
}

export function deterministicSeed(...parts: Array<string|number|Buffer>): Buffer {
  const h = createHash('sha256');
  for (const p of parts) h.update(typeof p === 'string' || Buffer.isBuffer(p) ? p : String(p));
  return h.digest();
}
