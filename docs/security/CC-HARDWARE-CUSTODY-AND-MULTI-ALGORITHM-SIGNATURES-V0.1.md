# Creators Common Hardware Custody and Multi-Algorithm Signatures

**Document ID:** CC-HARDWARE-CUSTODY-AND-MULTI-ALGORITHM-SIGNATURES-V0.1  
**Status:** Controlled conformance architecture  
**Applies to:** Trusted Keys, Signer Authorities, Signed Record Envelopes and signing services

## 1. Purpose

This document extends the Creators Common trust layer with:

- a governed Key Custody Attestation record;
- an append-only Signing Operation record;
- an ES256 verification profile;
- an RS256 verification profile; and
- positive and negative conformance vectors for both algorithms.

It does not claim that the repository contains a hardware security module, secure enclave, trusted platform module, production key, manufacturer attestation or legally effective digital certificate.

## 2. New record families

### `CC-KA` — Key Custody Attestation

A Key Custody Attestation binds a Trusted Key to assertions about the boundary in which the private key is generated, stored and used. It records:

- attestation type and status;
- provider and device metadata;
- a privacy-preserving device serial hash;
- key-generation and signing-boundary claims;
- whether the private key is exportable;
- the attested public-key fingerprint;
- verifier identity and method;
- evidence references and validity period.

A synthetic attestation must carry `attestationType: synthetic-test` and `status: synthetic`. It cannot be represented as verified hardware evidence.

### `CC-SO` — Signing Operation

A Signing Operation records one signing request and result without exposing private-key material. It binds:

- key, signer authority and custody attestation;
- envelope and signature identifiers;
- algorithm and message profile;
- SHA-256 digest of the exact signed message;
- signature value;
- action, purpose, environment and timing;
- hardware-bound, user-presence and multi-party-control indicators;
- operation result and verification reference.

The operation record is append-only evidence. It does not replace the Signed Record Envelope or Signature Verification record.

## 3. Public-key fingerprint rules

For ES256 and RS256 keys, the fingerprint is:

```text
SHA-256(DER SubjectPublicKeyInfo)
```

The repository stores the public key as PEM-encoded SubjectPublicKeyInfo and stores the fingerprint as lowercase hexadecimal.

For Ed25519 raw keys, the previously defined raw-key fingerprint rule remains unchanged.

## 4. ES256 profile

The ES256 profile requires:

- elliptic-curve key type;
- NIST P-256 / `secp256r1` curve;
- SHA-256 hashing;
- a 64-byte JOSE signature represented as `r || s`;
- base64url encoding without padding.

The validator converts the JOSE `r || s` form into the DER ECDSA form required by the cryptography implementation before verification.

Keys on another curve, malformed signatures or signatures that do not contain exactly 32-byte `r` and `s` values are rejected.

## 5. RS256 profile

The RS256 profile requires:

- RSA public key;
- minimum modulus size of 2048 bits;
- RSASSA-PKCS1-v1_5 padding;
- SHA-256 hashing;
- base64url encoding without padding.

This profile does not treat RSA-PSS as RS256. A future PSS profile must use a separate algorithm identifier and policy decision.

## 6. Signing message

ES256 and RS256 use the same `CC-SIG-0.1` message profile already defined for Ed25519. The signed UTF-8 message binds:

- envelope identifier and version;
- subject record type, identifier and version;
- canonicalization profile;
- digest algorithm; and
- payload digest value.

The algorithm changes the signature operation, not the semantic message being signed.

## 7. Conformance vectors

`tools/validate_advanced_trust.py` contains public test keys and deterministic fixture signatures for:

1. valid ES256 signature;
2. tampered ES256 message with the original signature;
3. valid RS256 signature; and
4. tampered RS256 message with the original signature.

The validator also constructs and validates two synthetic Key Custody Attestations and two synthetic Signing Operations against the JSON Schema contracts.

No private key is committed. The public keys and signatures are test material only.

## 8. Fail-closed rules

The conformance validator rejects:

- malformed or duplicate schema definitions;
- non-P-256 ES256 keys;
- RSA keys below 2048 bits;
- public-key fingerprint mismatches;
- malformed ES256 JOSE signatures;
- tampered messages;
- exportable-key claims in the non-exportable conformance records;
- hardware-bound operations without boundary evidence;
- synthetic attestations used outside the named conformance purpose and environment.

## 9. Institutional responsibilities

| Layer | Responsibility |
|---|---|
| Creators Common | Defines record semantics and governed identifiers |
| Warden | Approves algorithms, signer authority, custody requirements and emergency denial rules |
| RiverOS | Preserves signing requests, attestations, verification outcomes and revocation evidence |
| Synnergyze | Operates signing and verification APIs without exposing private keys |
| EmpireOS | Requires verified envelopes and authority before effective licence issuance |
| DigitalMe | Resolves signer identity and institutional affiliation |

## 10. Production gates

Production use requires all of the following beyond this repository baseline:

- authenticated key registration ceremony;
- hardware-backed or HSM-generated production keys;
- manufacturer or provider attestation-chain verification;
- protected attestation roots and certificate validation;
- nonce freshness and replay protection;
- trusted time source;
- dual control for high-impact signing;
- emergency revocation and incident response;
- key backup and recovery policy appropriate to the custody mode;
- independent cryptographic and operational security review;
- RiverOS evidence retention and legal-hold integration.

## 11. Controlled limitation

Passing the conformance suite demonstrates that the schemas and public test vectors behave as specified. It does not establish the existence, identity, security certification or lawful authority of a production signer or hardware device.
