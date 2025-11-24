# Schedule Format (JSON)

A schedule is represented as JSON with the following structure:

- `id`: deterministic id of the schedule (string)
- `createdAt`: ISO timestamp
- `instructions`: array of atomic instructions

Each `AtomicInstruction` has:

- `id`: deterministic instruction id (string)
- `programId`: program public key (string)
- `accounts`: array of account meta objects
  - `pubkey`: account public key (string)
  - `writable`: boolean
  - `signer` (optional): boolean
- `data`: arbitrary payload interpreted by the program (object)

Example:

```json
{
  "id": "abc123...",
  "createdAt": "2025-11-24T12:00:00.000Z",
  "instructions": [
    {
      "id": "ins1",
      "programId": "Sys1111111111111111111111111111111111111",
      "accounts": [
        {"pubkey":"FromA...","writable":true,"signer":true},
        {"pubkey":"ToA...","writable":true}
      ],
      "data": {"type":"transfer","lamports":1000}
    }
  ]
}
```
