# Creators Common Trusted Keys and Signatures

**Document ID:** CC-TRUSTED-KEYS-AND-SIGNATURES-V0.1  
**Status:** Controlled prototype baseline  
**Applies to:** Creators Common, Warden, RiverOS, EmpireOS and Synnergyze

## 1. Purpose

This document defines the first trust architecture for verifying Creators Common record envelopes. It separates four questions that must not be collapsed:

1. Did the signature mathematically verify against the stated public key?
2. Was that key trusted and valid at the time of verification?
3. Was the signer authorised for the record type, action, purpose and signature scope?
4. Does the verified envelope remain connected to its governed payload and evidence?

A valid digital signature detects unauthorised change and identifies possession of a private key. It does not, by itself, prove authorship, ownership, scientific truth, regulatory approval, contractual authority or lawful purpose.

## 2. Governed records

| Record | Identifier | Function |
|---|---|---|
| Trusted Key | `CC-TK-...` | Public verification key, fingerprint, owner, status, purpose, validity and custody assertions |
| Signer Authority | `CC-SA-...` | Defines who may sign which record types, using which keys, actions and scopes |
| Key Lifecycle Event | `CC-KE-...` | Append-only registration, activation, rotation, suspension, revocation, expiry or retirement event |
| Signature Verification | `CC-SV-...` | Separates cryptographic result, trust result and final verification disposition |

## 3. Trust boundary

Private keys are never registry records. Creators Common stores public verification material, governed authority and lifecycle evidence. Production private keys should be generated and held in hardware-backed custody, an HSM or another approved signing service.

The repository fixtures contain public test keys and deterministic signatures only. They are not production trust anchors. No production private key is committed to the repository.

## 4. CC-SIG-0.1 message profile

For the `payload-digest` signature scope, the signed UTF-8 message is exactly:

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

- lines are separated by a single LF character;
- there is no trailing line break;
- values are copied exactly from the envelope;
- the payload digest is recalculated before signature verification;
- any field change produces a different signed message.

## 5. Verification order

The verifier must fail closed and execute this order:

1. Validate the envelope and referenced records against their schemas.
2. Recalculate the payload digest under `CC-CJSON-0.1`.
3. Reconstruct the `CC-SIG-0.1` message.
4. Resolve the Trusted Key and verify its fingerprint.
5. Verify the signature cryptographically.
6. Evaluate current key status and validity.
7. Resolve the Signer Authority.
8. Confirm record type, action, purpose, environment and signature scope.
9. Record the verification result and reason codes.
10. Emit RiverOS evidence where policy requires it.

Cryptographic validity and trust-policy validity are recorded separately. A cryptographically valid signature made with a revoked or unauthorised key must fail overall verification.

## 6. Key lifecycle

```text
register
   ↓
activate
   ↓
rotate ──────────────┐
   ↓                 │
suspend / reinstate  │
   ↓                 │
revoke, expire       │
or retire            │
                     ↓
               successor key
```

Key events are append-only and monotonically sequenced. Rotation does not erase the predecessor. Historical verification must preserve the signing time, verification time, key status and applicable authority record.

### 6.1 Rotation

A rotation event identifies both predecessor and successor keys. The successor receives a new permanent identifier. The predecessor is closed, retired or revoked according to policy; its historical fingerprints and events remain preserved.

### 6.2 Revocation

Revocation is effective at a recorded timestamp and requires a reason. Warden may require emergency revocation after suspected compromise, unauthorised use, custody failure or authority withdrawal. Revocation does not silently delete prior envelopes; it changes their current trust disposition and triggers review where required.

## 7. Signer authority

Signer authority is narrower than identity or organisational membership. Each permission is bounded by:

- allowed key identifiers;
- record types;
- actions such as sign, issue, approve or revoke;
- signature scope;
- purpose and environment;
- validity period;
- assurance and custody requirements;
- optional Warden decision requirements.

An institution may own a key without being authorised to sign every record family.

## 8. Conformance vectors

The repository includes:

1. a positive Ed25519 vector using an active key and authorised signer;
2. a negative tampered-message vector where the digest is changed while the signature remains unchanged;
3. a negative revoked-key vector where the mathematics is valid but current trust fails.

The validator uses the `cryptography` library to verify Ed25519 signatures and compares calculated results with the expected and observed values in each `CC-SV` record.

## 9. Production requirements

Production deployment requires, at minimum:

- hardware-backed or HSM custody;
- authenticated key registration and owner verification;
- dual control for high-impact signing authorities;
- secure clock and timestamp policy;
- auditable rotation and emergency revocation;
- RiverOS evidence for signing and verification;
- Warden policy evaluation before sensitive issuance;
- key-discovery caching with bounded expiry;
- algorithm-agility and migration planning;
- incident response and compromise recovery;
- periodic independent cryptographic review.

## 10. Controlled limitations

This baseline validates Ed25519 repository fixtures. ES256 and RS256 remain schema-reserved and are not yet implemented by the validator. The fixture keys are synthetic. Passing conformance checks does not establish legal enforceability, real-world identity assurance, production custody, trusted timestamping or regulatory acceptance.
