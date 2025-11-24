export type PubkeyStr = string;
export declare function isValidPubkey(pk: string): boolean;
export declare function sha256Hex(input: string | Buffer): string;
export declare function deterministicSeed(...parts: Array<string | number | Buffer>): Buffer;
