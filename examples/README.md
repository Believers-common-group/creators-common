# Creators Common registry examples

**Fixture release:** CC-FIXTURES-V0.5  
**Asset Lab fixture release:** CC-ASSET-LAB-FIXTURES-V0.1  
**Governance fixture release:** CC-GOVERNANCE-FIXTURES-V0.1  
**Trust fixture release:** CC-TRUST-FIXTURES-V0.1  
**Status:** Synthetic conformance data only

The files under `examples/` are non-production fixtures for the contracts in `schemas/`.

## Linked fixture sets

### Core records

Under `examples/records/`:

- one Creator Passport (`CC-CR`);
- one Creation Passport (`CC-CP`);
- one Contribution Record (`CC-CO`);
- one Licence Record (`CC-LR`);
- one draft synthetic Signed Record Envelope (`CC-EN`).

### RiverOS records

Under `examples/riveros/`:

- one Evidence Event (`CC-RV-EV`);
- one Evidence Retention Policy (`CC-RV-RP`).

### Asset Lab material-authoring records

Under `examples/asset-lab/`:

- one Asset Draft (`CC-AD`);
- one Asset Component (`CC-AC`);
- one Material Specification (`CC-MS`);
- one Process Recipe (`CC-PR`);
- one Asset Variant (`CC-AV`);
- one Validation Run (`CC-VR`);
- one Creation Claim (`CC-CL`);
- one Release Gate (`CC-RG`).

### Warden records

Under `examples/warden/`:

- one Warden Access Policy (`CC-WA`);
- one Warden Policy Decision (`CC-WD`).

The fixture permits a verified domain reviewer to review selected Material Specification fields inside Asset Lab while requiring evidence logging and prohibiting export.

### EmpireOS records

Under `examples/empireos/`:

- one proposed issuance event;
- one proposed amendment event;
- one proposed suspension event;
- one proposed termination event.

All four use the `CC-EO-LE` family and form a monotonically sequenced synthetic chain for the qPCR Research Licence fixture.

### Trusted-key and signature records

Under `examples/trust/`:

- one revoked predecessor Ed25519 Trusted Key (`CC-TK`);
- one active successor Ed25519 Trusted Key (`CC-TK`);
- one Signer Authority (`CC-SA`);
- registration, rotation and revocation Key Lifecycle Events (`CC-KE`);
- one issued Ed25519 Record Envelope (`CC-EN`);
- one positive Signature Verification vector (`CC-SV`);
- one tampered-message negative vector (`CC-SV`);
- one revoked-key negative vector (`CC-SV`).

The public-key fixtures are test vectors. No production private key is included in the repository.

## Demonstrated registry and trust chain

```text
Creator Passport
      ↓ owns draft and receives contribution attribution
Asset Draft
      ├── Asset Component
      ├── Material Specification
      │       ↓ field-level request
      │   Warden Access Policy
      │       ↓ matched rule
      │   Warden Policy Decision
      ├── Process Recipe
      ├── Asset Variant
      │       ↓
      ├── Validation Run
      │       ↓
      ├── Creation Claim
      │       ↓
      └── Release Gate
              ↓ controlled conversion
        Creation Passport
              ↓ CC-CJSON-0.1 + SHA-256
        Record Envelope
              ↓ CC-SIG-0.1
        Trusted Key + Signer Authority
              ↓ Ed25519 verification
        Signature Verification
              ↓ evidence and retention
        RiverOS Evidence Event

Licence Record
      ↓
EmpireOS issue → amend → suspend → terminate

Trusted Key 001
      ↓ register
      ↓ rotate to Trusted Key 002
      ↓ revoke predecessor
Trusted Key 002 → active signing and verification
```

## Digest and signature fixtures

The qPCR Creation Passport is canonicalised with `CC-CJSON-0.1`. Its SHA-256 digest is used by both the original draft envelope and the issued Ed25519 envelope.

The `CC-SIG-0.1` positive vector signs a domain-separated message containing:

- envelope identifier and version;
- subject record type, identifier and version;
- canonicalisation profile;
- digest algorithm and digest value.

The validator reconstructs the message and verifies the Ed25519 signature.

### Positive vector

The signature is mathematically valid, the successor key is active and the Signer Authority permits issuance of a Creation envelope for the stated purpose, environment and scope.

### Tampered-message vector

The first hexadecimal character of the payload digest is changed while the original signature is retained. Cryptographic verification must fail.

### Revoked-key vector

The signature is mathematically valid against the predecessor public key, but the key is revoked at verification time. Cryptographic validity is recorded as valid, trust validity as revoked and overall verification as failed.

## Controlled fixture boundaries

### Asset Lab

Recovered content, density, process temperature and validation disposition are synthetic values selected to exercise the contracts. They are not measurements, supplier declarations, certified environmental claims or production approval.

### Warden

The access policy and decision are conformance fixtures. They do not prove identity assurance, device trust, production enforcement or lawful permission to access confidential information.

### EmpireOS

All lifecycle events are marked `proposed`. They do not issue, amend, suspend or terminate a real licence.

### Cryptography

The original `synthetic-test` envelope remains deliberately unverified. The Ed25519 envelope demonstrates the verification implementation using public test keys and deterministic fixture signatures. The records do not establish production key custody, trusted identity, legal authority or a trusted timestamp.

## Non-production notice

The fixtures are not evidence of:

- a real person or legal entity;
- authorship or ownership;
- an executed licence or assignment;
- scientific or laboratory validation;
- safety acceptance or certified material composition;
- regulatory or diagnostic authorisation;
- trusted access-control enforcement;
- production private-key custody;
- a trusted timestamp;
- a production retention policy.

They must not be copied into production without replacing synthetic identities, measurements, evidence, review decisions, authority records, legal terms, cryptographic keys, custody controls, policy-engine controls and jurisdiction-specific retention rules.

Validation is performed by `tools/validate_registry.py` and `.github/workflows/validate-registry.yml`.
