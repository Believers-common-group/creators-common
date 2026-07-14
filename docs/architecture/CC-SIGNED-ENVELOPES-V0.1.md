# Creators Common Signed Record Envelopes

**Document ID:** CC-SIGNED-ENVELOPES-V0.1  
**Status:** Controlled prototype architecture  
**Applies to:** Creator, Creation, Contribution, Licence and RiverOS records

## 1. Purpose

A signed record envelope binds a governed record identity to:

- a specific payload version;
- deterministic canonical bytes;
- a cryptographic content digest;
- one or more signature assertions;
- issuer and lifecycle metadata.

The envelope protects provenance and change detection. It does not, by itself, prove that a factual claim is true, that the signer had legal authority, or that the underlying creation is scientifically valid.

## 2. Identifier family

Signed envelopes use:

`CC-EN-...`

The envelope has its own version and lifecycle. It does not replace the identifier or version of the subject record.

## 3. Envelope boundary

The controlled envelope contains:

1. **Subject** — record type, governed record ID and record version.
2. **Payload reference** — the exact JSON payload being bound.
3. **Canonicalization profile** — the deterministic encoding rule.
4. **Digest** — SHA-256 of the canonical payload bytes.
5. **Signature assertions** — signer, key reference, algorithm, scope and verification state.
6. **Envelope status** — draft, issued, superseded, revoked or archived.
7. **Issuer metadata** — the authority that created the envelope record.

## 4. CC-CJSON-0.1 canonicalization profile

CC-CJSON-0.1 is the initial restricted canonical JSON profile used by this repository.

The algorithm is:

1. Parse a UTF-8 JSON document as a JSON object.
2. Reject duplicate object keys.
3. Reject non-standard constants such as `NaN` and `Infinity`.
4. Reject floating-point numbers in payloads intended for digest binding.
5. Represent decimal measurements as normalized strings until a cross-language numeric profile is adopted.
6. Sort object keys recursively in ascending Unicode order.
7. Preserve array order exactly.
8. Serialize without insignificant whitespace, using `,` and `:` separators.
9. Preserve Unicode characters as UTF-8 rather than forcing ASCII escapes.
10. Calculate SHA-256 over the resulting UTF-8 bytes.

This profile is deliberately narrower than general JSON. The restriction avoids ambiguous floating-point serialization between implementations during the prototype phase.

## 5. Digest rule

For payload object `P`:

```text
canonical_bytes = CC-CJSON-0.1(P)
payload_digest  = SHA-256(canonical_bytes)
```

The hexadecimal digest is stored in lowercase.

The repository validator recalculates the digest for local JSON payload references and rejects mismatches.

## 6. Signature scopes

Two signature scopes are reserved:

### `payload-digest`

The signer signs the digest and the minimum subject-binding context required by the issuing implementation.

### `envelope-without-signatures`

The signer signs a canonical representation of the envelope with the `signatures` array excluded.

A production profile must specify the exact signature input bytes, domain-separation string and key-resolution method. Until then, only `payload-digest` is demonstrated by the synthetic fixture.

## 7. Signature verification states

- **unverified** — a signature assertion is present but has not been verified against a trusted key.
- **verified** — verification succeeded against an approved trust anchor and policy.
- **failed** — verification was attempted and failed.
- **revoked** — the relevant key, signer authority or signature acceptance was revoked.

An envelope with status `issued` must have at least one verified signature. A `synthetic-test` signature must never be marked verified.

## 8. Algorithm registry

The schema reserves:

- Ed25519;
- ES256;
- RS256;
- external attestation;
- synthetic test assertions.

The presence of an algorithm name does not mean the repository currently performs that cryptographic verification. Production implementation requires a trusted key registry, key rotation, revocation, algorithm policy and secure signing service.

## 9. Lifecycle

```text
Draft → Issued → Superseded → Archived
             ↘ Revoked
```

- **Draft:** digest and signature assertions may still be under review.
- **Issued:** signature policy has passed and the envelope is accepted for governed use.
- **Superseded:** a later envelope binds a later record version or corrected issuance.
- **Revoked:** the envelope must no longer be relied upon for current authorization.
- **Archived:** retained for provenance and historical audit.

Supersession never deletes the prior envelope or its evidence trail.

## 10. Institutional responsibilities

| Layer | Responsibility |
|---|---|
| Creators Common | Defines the governed record and envelope semantics |
| DigitalMe | Resolves signer identity and institutional affiliation |
| RiverOS | Records envelope creation, verification, supersession and revocation events |
| Warden | Applies key, algorithm, role and restricted-use policy |
| EmpireOS | Issues governed licences that may reference verified envelopes |
| Synnergyze | Hosts APIs, validation services and registry storage |

## 11. Synthetic fixture boundary

`examples/records/record-envelope.creation.sample.json` contains a `synthetic-test` signature. It demonstrates structure and digest binding only.

It is not:

- a valid digital signature;
- evidence of a private-key operation;
- a legal attestation;
- a trusted timestamp;
- a certificate;
- proof of authorship, ownership or scientific validity.

## 12. Production gates

Before production issuance, the following must be completed:

- normative cross-language canonicalization test vectors;
- key and signer registry;
- key rotation and revocation contracts;
- Warden algorithm and authority policies;
- secure signing service or hardware-backed signing path;
- signature-verification implementation;
- trusted timestamp policy;
- audit and incident-response procedures;
- positive and negative cryptographic conformance tests.
