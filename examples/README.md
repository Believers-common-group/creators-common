# Creators Common registry examples

The files in `examples/records/` are synthetic conformance fixtures for the machine-readable registry contracts in `schemas/`.

They demonstrate a linked record set:

- one Creator Passport (`CC-CR`);
- one Creation Passport (`CC-CP`);
- one Contribution Record (`CC-CO`);
- one Licence Record (`CC-LR`).

The fixtures are not evidence of a real person, legal entity, ownership position, laboratory validation, regulatory approval, commercial licence or diagnostic authorisation. They must not be copied into a production registry without replacing the synthetic identities, evidence references, review decisions and authority records.

Validation is performed by `tools/validate_registry.py` and the repository-level GitHub Actions workflow at `.github/workflows/validate-registry.yml`.
