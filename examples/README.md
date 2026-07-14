# Creators Common registry examples

**Fixture release:** CC-FIXTURES-V0.3  
**Asset Lab fixture release:** CC-ASSET-LAB-FIXTURES-V0.1  
**Status:** Synthetic conformance data only

The files under `examples/` are non-production fixtures for the machine-readable contracts in `schemas/`.

## Linked fixture sets

### Core records

Under `examples/records/`:

- one Creator Passport (`CC-CR`);
- one Creation Passport (`CC-CP`);
- one Contribution Record (`CC-CO`);
- one Licence Record (`CC-LR`);
- one Signed Record Envelope (`CC-EN`).

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

## Demonstrated registry chain

```text
Creator Passport
      ↓ owns draft and receives contribution attribution
Asset Draft
      ├── Asset Component
      ├── Material Specification
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
        Signed Record Envelope
              ↓ registration evidence
        RiverOS Evidence Event
              ↓ retention assignment
        RiverOS Retention Policy
```

## Digest fixture

The qPCR Creation Passport fixture is canonicalized with `CC-CJSON-0.1` and bound to the SHA-256 digest recorded in:

- `records/record-envelope.creation.sample.json`; and
- `riveros/evidence-event.sample.json`.

The validator recalculates this digest. Any change to the Creation Passport fixture requires dependent digest values to be updated in the same controlled change.

## Asset Lab fixture boundary

The Asset Lab examples demonstrate record structure and cross-reference integrity only. References to recovered content, density, process temperature and validation disposition are synthetic values selected to exercise the contracts. They do not represent laboratory measurements, supplier declarations, certified environmental claims or production approval.

## Signature boundary

The signed-envelope fixture uses the algorithm value `synthetic-test` and is deliberately marked `unverified`. It is not a cryptographically valid signature and must never be marked verified.

## Non-production notice

The fixtures are not evidence of:

- a real person or legal entity;
- authorship or ownership;
- an executed licence or assignment;
- scientific or laboratory validation;
- safety acceptance;
- certified material composition;
- regulatory approval;
- diagnostic authorisation;
- a trusted timestamp;
- a private-key operation;
- a production retention policy.

They must not be copied into a production registry without replacing synthetic identities, evidence references, measurements, review decisions, authority records, legal terms, cryptographic keys and jurisdiction-specific retention rules.

Validation is performed by `tools/validate_registry.py` and the repository-level GitHub Actions workflow at `.github/workflows/validate-registry.yml`.
