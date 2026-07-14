# Creators Common Signed Record Envelopes

**Document ID:** CC-SIGNED-ENVELOPES-V0.1  
**Status:** Controlled prototype architecture  
**Applies to:** All governed Creators Common record families

## 1. Purpose

A Signed Record Envelope binds a governed record identity to:

- a specific payload version;
- deterministic canonical bytes;
- a cryptographic content digest;
- one or more signature assertions;
- trusted-key and verification references;
- issuer and lifecycle metadata.

The envelope protects provenance and change detection. It does not prove that a claim is true, that a signer owns the creation, that an institution has legal authority, or that the creation is scientifically or regulatorily valid.

## 2. Identifier family

Signed envelopes use `CC-EN-...`. The envelope has its own version and lifecycle and never replaces the identifier or version of the subject record.

## 3. Envelope boundary

A controlled envelope contains:

1. **Subject** — record type, governed record identifier and record version.
2. **Payload reference** — the exact JSON payload being bound.
3. **Canonicalisation profile** — the deterministic encoding rule.
4. **Digest** — SHA-256 of the canonical payload bytes.
5. **Signature assertions** — signer, algorithm, message profile, key, scope, signed time and verification reference.
6. **Envelope status** — draft, issued, superseded, revoked or archived.
7. **Issuer metadata** — the authority creating the envelope record.

## 4. CC-CJSON-0.1

The initial restricted canonical JSON profile:

1. parses a UTF-8 JSON object;
2. rejects duplicate keys;
3. rejects `NaN`, `Infinity` and other non-standard constants;
4. rejects floating-point values in digest-bound payloads;
5. represents decimal measurements as normalised strings;
6. sorts object keys recursively;
7. preserves array order;
8. serialises without insignificant whitespace;
9. preserves Unicode as UTF-8;
10. calculates SHA-256 over the resulting bytes.

```text
canonical_bytes = CC-CJSON-0.1(payload)
payload_digest  = SHA-256(canonical_bytes)
```

The lowercase hexadecimal digest is stored in the envelope. The validator recalculates local payload digests and rejects mismatches.

## 5. CC-SIG-0.1

The implemented `payload-digest` signing profile uses this exact UTF-8 message:

```text
CC-SIG-0.1
envelopeId=<envelope identifier>
envelopeVersion=<envelope version>
recordType=<subject record type>
recordId=<subject record identifier>
recordVersion=<subject record version>
canonicalization=CC-CJSON-0.1
digestAlgorithm=sha-256
digestValue=<64-character lowercase hexadecimal digest>
```

Rules:

- lines are separated by one LF character;
- there is no trailing line break;
- values are copied exactly from the envelope;
- message changes invalidate the signature;
- the payload digest is verified before trust acceptance.

The `envelope-without-signatures` scope remains reserved and is not yet implemented by the repository validator.

## 6. Signature verification states

- **unverified** — an assertion exists but has not passed trusted verification;
- **verified** — cryptographic verification and trust policy both passed;
- **failed** — verification was attempted and failed;
- **revoked** — relevant key, signer authority or acceptance was revoked.

An `issued` envelope requires at least one verified signature and a matching `CC-SV` Signature Verification record. A `synthetic-test` assertion must never be marked verified.

## 7. Verification order

The verifier must fail closed:

1. validate the envelope and payload schemas;
2. resolve and load the payload;
3. recalculate the `CC-CJSON-0.1` digest;
4. reconstruct the `CC-SIG-0.1` message;
5. resolve the Trusted Key (`CC-TK`);
6. verify its SHA-256 fingerprint;
7. verify the signature mathematically;
8. evaluate key status and validity time;
9. resolve the Signer Authority (`CC-SA`);
10. confirm record type, action, purpose, environment and scope;
11. compare the result with the Signature Verification (`CC-SV`) record;
12. emit RiverOS evidence where required.

Cryptographic result and trust result remain separate. A mathematically valid signature from a revoked or unauthorised key fails overall verification.

## 8. Algorithm registry

The schema reserves:

- Ed25519;
- ES256;
- RS256;
- external attestation;
- synthetic test assertions.

The current validator performs Ed25519 verification. ES256, RS256 and external-attestation verification remain future implementation work.

## 9. Lifecycle

```text
Draft → Issued → Superseded → Archived
             ↘ Revoked
```

- **Draft:** digest and assertions remain under review.
- **Issued:** signature and trust policy passed for governed use.
- **Superseded:** a later envelope binds a corrected or later record version.
- **Revoked:** the envelope must not be relied upon for current authorisation.
- **Archived:** retained for provenance and historical audit.

Supersession and revocation do not delete prior evidence.

## 10. Institutional responsibilities

| Layer | Responsibility |
|---|---|
| Creators Common | Defines record, envelope and signature semantics |
| DigitalMe | Resolves signer identity and affiliation |
| RiverOS | Records signing, verification, supersession and revocation evidence |
| Warden | Governs trusted keys, signer authority, algorithms and restricted use |
| EmpireOS | References verified envelopes during licence lifecycle operations |
| Synnergyze | Hosts registry, verification and signing-service integrations |

## 11. Fixture boundary

The repository contains two envelope patterns:

1. `examples/records/record-envelope.creation.sample.json` — draft structure and digest binding using an unverified `synthetic-test` assertion.
2. `examples/trust/record-envelope.creation.ed25519.sample.json` — an issued Ed25519 test envelope backed by Trusted Key, Signer Authority and Signature Verification fixtures.

The Ed25519 vector demonstrates actual mathematical verification against a public test key. It does not establish production private-key custody, identity certification, legal attestation, trusted timestamping, ownership or scientific validity.

## 12. Production gates

Before production issuance:

- use hardware-backed or HSM private-key custody;
- authenticate key owners and signing authorities;
- require Warden approval for high-impact authority grants;
- establish secure timestamps and clock policy;
- implement emergency suspension and revocation;
- preserve RiverOS signing and verification evidence;
- complete independent cryptographic review;
- add ES256/RS256 profiles where required;
- define incident response, compromise recovery and algorithm migration.

See [Trusted Keys and Signatures V0.1](../security/CC-TRUSTED-KEYS-AND-SIGNATURES-V0.1.md).
