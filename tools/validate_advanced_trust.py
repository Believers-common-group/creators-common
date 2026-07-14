#!/usr/bin/env python3
"""Validate CC hardware-custody contracts and ES256/RS256 conformance vectors."""

from __future__ import annotations

import base64
import hashlib
import json
import sys
from pathlib import Path
from typing import Any

from cryptography.exceptions import InvalidSignature
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import ec, padding, rsa, utils
from jsonschema import Draft202012Validator, FormatChecker

ROOT = Path(__file__).resolve().parents[1]
SCHEMA_PATHS = [
    ROOT / "schemas" / "key-custody-attestation.schema.json",
    ROOT / "schemas" / "signing-operation.schema.json",
]

ES_PUBLIC_PEM = """-----BEGIN PUBLIC KEY-----
MFkwEwYHKoZIzj0CAQYIKoZIzj0DAQcDQgAES3c4PQgqTPL2cvojR/r20ZXswtoL
ieYkre2hET01gGgh3vd9zu7C6pbouuO/usIu/7M4gPkGJaP/PcnkkxuWag==
-----END PUBLIC KEY-----
"""
RSA_PUBLIC_PEM = """-----BEGIN PUBLIC KEY-----
MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAnsXh4f3NPhLdsiyi+JBo
x2ATJuxJrgmTRWiUGkJxzn+3yUGPQ1T8OHtpb3GN9Irv2Bp/Q3SB01FCAwpYQ+M5
IxDWAHs3a4gI7KP6XNHpB7ImKfYVDPm5nGz1ifTOHAzlZvL8dZcNWBSYyS2NN9Nh
DwB8qtgidlVLaGmZHvsHCiLSMuNdNBj0S70xYKJtJEmIb0cZwn0Pb3WUEJPG6WOW
dyW4Bb6CCMdvOuPs4rHiC+JNW6bGr3j+ODClDbqHUVWJVEcdG13QC2zXThFJXqws
ht6znRzKT3QHsE2mbHFdpfEFhzyHuZXXtzalp9LtkebUGN5BGol/pkYPKgTG+qeJ
IwIDAQAB
-----END PUBLIC KEY-----
"""
ES_FINGERPRINT = "3af3646ca91a26f8c62c0fa69221b22928a72ea83f6b890044ba20aee14d1e9b"
RSA_FINGERPRINT = "a2988749e329cb2cf046c69fff94ea2c91aba902da9cd0db19b9c059da7ef1a2"
ES_MESSAGE = "CC-SIG-0.1\nenvelopeId=CC-EN-QPCR-CREATION-ES256-001\nenvelopeVersion=0.1.0\nrecordType=creation\nrecordId=CC-CP-QPCR-CREATOR-PROGRAMME-001\nrecordVersion=0.1.0\ncanonicalization=CC-CJSON-0.1\ndigestAlgorithm=sha-256\ndigestValue=fd09c2f02fd10d7bdfa3a200aab390794f495783ce74a2d8a8a8f66813cd66bd"
RSA_MESSAGE = "CC-SIG-0.1\nenvelopeId=CC-EN-QPCR-CREATION-RS256-001\nenvelopeVersion=0.1.0\nrecordType=creation\nrecordId=CC-CP-QPCR-CREATOR-PROGRAMME-001\nrecordVersion=0.1.0\ncanonicalization=CC-CJSON-0.1\ndigestAlgorithm=sha-256\ndigestValue=fd09c2f02fd10d7bdfa3a200aab390794f495783ce74a2d8a8a8f66813cd66bd"
ES_SIGNATURE = "Y8t3proYRzps0BVPSK9t5v1INKk2hl15TWeTKL1epTt7ZHdumN73NZpamcAORyuR3_Qrik_aVhkUfVx_YDFQjQ"
RSA_SIGNATURE = "RoIblGL27P1N2FfGMyZFrysjLkm0qk8dGw9VCVWzV52wNisri09JmgO8Bi3OZz_k7ZV49t7vq-7YzvjMmOuBsViEhv2HuJb_U9BchbPnQaVFWcSVzxdYGwtVhEBS8LX3fafhMhXlwqIdOgGk6hEAwhUWpaqkNnBceD-PkLIzGGYhrIswGi7iEHjvdAyFh6TwXyA5euC995kNR3qfrQK1mykXERh_ytMUsKb4B1-rqh8CAeDGWaNm_Mn4SlbwrBDns5Yk8Xt2nxM7oi6Ej3K_TZYbuBLUxIx3rjwjmQdEDHeE-95bG51N2XZAPchJipa44p3ri6Kx2W5DPJin3vImVQ"


def load_json(path: Path) -> dict[str, Any]:
    with path.open("r", encoding="utf-8") as handle:
        value = json.load(handle)
    if not isinstance(value, dict):
        raise ValueError(f"{path.relative_to(ROOT)}: JSON root must be an object")
    return value


def b64url_decode(value: str) -> bytes:
    return base64.urlsafe_b64decode(value + ("=" * (-len(value) % 4)))


def fingerprint(public_key: Any) -> str:
    der = public_key.public_bytes(
        serialization.Encoding.DER,
        serialization.PublicFormat.SubjectPublicKeyInfo,
    )
    return hashlib.sha256(der).hexdigest()


def verify_es256(public_key: ec.EllipticCurvePublicKey, message: str, signature: str) -> bool:
    raw = b64url_decode(signature)
    if len(raw) != 64:
        raise ValueError("ES256 signature must use 64-byte JOSE r||s form")
    r = int.from_bytes(raw[:32], "big")
    s = int.from_bytes(raw[32:], "big")
    try:
        public_key.verify(
            utils.encode_dss_signature(r, s),
            message.encode("utf-8"),
            ec.ECDSA(hashes.SHA256()),
        )
        return True
    except InvalidSignature:
        return False


def verify_rs256(public_key: rsa.RSAPublicKey, message: str, signature: str) -> bool:
    try:
        public_key.verify(
            b64url_decode(signature),
            message.encode("utf-8"),
            padding.PKCS1v15(),
            hashes.SHA256(),
        )
        return True
    except InvalidSignature:
        return False


def issuer() -> dict[str, str]:
    return {
        "issuerId": "CC-INST-WARDEN",
        "name": "Warden",
        "authorityRef": "docs/security/CC-HARDWARE-CUSTODY-AND-MULTI-ALGORITHM-SIGNATURES-V0.1.md",
    }


def attestation_record(key_ref: str, attestation_id: str, fp: str, service: str) -> dict[str, Any]:
    return {
        "schemaVersion": "0.1.0",
        "attestationId": attestation_id,
        "recordVersion": "0.1.0",
        "keyRef": key_ref,
        "attestationType": "synthetic-test",
        "status": "synthetic",
        "provider": {
            "providerId": "CC-SVC-SYNTHETIC-ATTESTATION",
            "name": "Synthetic Attestation Fixture",
            "service": service,
            "region": "conformance-only",
        },
        "device": {
            "manufacturer": "Synthetic Conformance Fixture",
            "model": "No physical hardware",
            "serialHash": hashlib.sha256(attestation_id.encode("utf-8")).hexdigest(),
            "firmwareVersion": "0.0-test",
            "certificationRefs": [],
        },
        "claims": {
            "keyGeneratedInBoundary": True,
            "privateKeyExportable": False,
            "signingOccursInBoundary": True,
            "userPresenceSupported": False,
            "multiPartyControlSupported": False,
            "publicKeyFingerprint": {"algorithm": "sha-256", "value": fp},
        },
        "nonceHash": hashlib.sha256((attestation_id + "-nonce").encode("utf-8")).hexdigest(),
        "evidenceRefs": [
            "docs/security/CC-HARDWARE-CUSTODY-AND-MULTI-ALGORITHM-SIGNATURES-V0.1.md"
        ],
        "issuedAt": "2026-07-14T10:31:00Z",
        "validUntil": "2027-07-14T10:31:00Z",
        "verifier": {
            "verifierId": "CC-SVC-ADVANCED-TRUST-VALIDATOR",
            "name": "Creators Common Advanced Trust Validator",
            "method": "synthetic-conformance",
            "verificationRef": "tools/validate_advanced_trust.py",
        },
        "issuer": issuer(),
        "provenance": {
            "sourceRecordRefs": [
                "docs/security/CC-HARDWARE-CUSTODY-AND-MULTI-ALGORITHM-SIGNATURES-V0.1.md"
            ],
            "changeReason": "Synthetic custody attestation; no production hardware claim",
        },
        "createdAt": "2026-07-14T10:31:00Z",
        "updatedAt": "2026-07-14T10:31:00Z",
    }


def signing_operation(
    operation_id: str,
    envelope_ref: str,
    signature_id: str,
    key_ref: str,
    authority_ref: str,
    attestation_ref: str,
    algorithm: str,
    message: str,
    signature: str,
    verification_ref: str,
) -> dict[str, Any]:
    return {
        "schemaVersion": "0.1.0",
        "operationId": operation_id,
        "recordVersion": "0.1.0",
        "requestRef": "REQ-QPCR-MULTI-ALG-001",
        "envelopeRef": envelope_ref,
        "signatureId": signature_id,
        "keyRef": key_ref,
        "authorityRef": authority_ref,
        "custodyAttestationRef": attestation_ref,
        "algorithm": algorithm,
        "messageProfile": "CC-SIG-0.1",
        "signedMessageDigest": {
            "algorithm": "sha-256",
            "value": hashlib.sha256(message.encode("utf-8")).hexdigest(),
        },
        "signatureValue": signature,
        "context": {
            "recordType": "creation",
            "action": "issue",
            "scope": "payload-digest",
            "purpose": "conformance-testing",
            "environment": "creators-common-registry",
            "requestedAt": "2026-07-14T10:31:30Z",
            "completedAt": "2026-07-14T10:32:00Z",
            "hardwareBound": True,
            "userPresence": False,
            "multiPartyApproval": False,
        },
        "result": {
            "status": "succeeded",
            "keyBoundaryEvidence": True,
            "reasonCodes": ["SYNTHETIC-ATTESTATION", "SIGNATURE-VERIFIED"],
            "details": "Conformance-only operation. No physical hardware or production private key is represented.",
        },
        "verificationRef": verification_ref,
        "issuer": issuer(),
        "provenance": {
            "sourceRecordRefs": [envelope_ref, attestation_ref, verification_ref],
            "changeReason": "Synthetic hardware-bound signing operation",
        },
        "createdAt": "2026-07-14T10:32:00Z",
    }


def main() -> int:
    try:
        schemas = [load_json(path) for path in SCHEMA_PATHS]
        for schema in schemas:
            Draft202012Validator.check_schema(schema)

        es_key = serialization.load_pem_public_key(ES_PUBLIC_PEM.encode("ascii"))
        rsa_key = serialization.load_pem_public_key(RSA_PUBLIC_PEM.encode("ascii"))
        if not isinstance(es_key, ec.EllipticCurvePublicKey) or not isinstance(
            es_key.curve, ec.SECP256R1
        ):
            raise ValueError("ES256 fixture is not a P-256 public key")
        if not isinstance(rsa_key, rsa.RSAPublicKey) or rsa_key.key_size < 2048:
            raise ValueError("RS256 fixture is not an RSA key of at least 2048 bits")
        if fingerprint(es_key) != ES_FINGERPRINT:
            raise ValueError("ES256 SPKI fingerprint mismatch")
        if fingerprint(rsa_key) != RSA_FINGERPRINT:
            raise ValueError("RS256 SPKI fingerprint mismatch")

        if not verify_es256(es_key, ES_MESSAGE, ES_SIGNATURE):
            raise ValueError("positive ES256 vector failed")
        if verify_es256(es_key, ES_MESSAGE + "-tampered", ES_SIGNATURE):
            raise ValueError("negative ES256 vector was accepted")
        if not verify_rs256(rsa_key, RSA_MESSAGE, RSA_SIGNATURE):
            raise ValueError("positive RS256 vector failed")
        if verify_rs256(rsa_key, RSA_MESSAGE + "-tampered", RSA_SIGNATURE):
            raise ValueError("negative RS256 vector was accepted")

        attestations = [
            attestation_record(
                "CC-TK-CREATORS-COMMON-ES256-001",
                "CC-KA-CREATORS-COMMON-ES256-001",
                ES_FINGERPRINT,
                "synthetic secure element",
            ),
            attestation_record(
                "CC-TK-CREATORS-COMMON-RS256-001",
                "CC-KA-CREATORS-COMMON-RS256-001",
                RSA_FINGERPRINT,
                "synthetic HSM",
            ),
        ]
        operations = [
            signing_operation(
                "CC-SO-QPCR-ES256-001",
                "CC-EN-QPCR-CREATION-ES256-001",
                "SIG-QPCR-CREATION-ES256-001",
                "CC-TK-CREATORS-COMMON-ES256-001",
                "CC-SA-CREATORS-COMMON-HARDWARE-001",
                "CC-KA-CREATORS-COMMON-ES256-001",
                "ES256",
                ES_MESSAGE,
                ES_SIGNATURE,
                "CC-SV-QPCR-CREATION-ES256-VALID-001",
            ),
            signing_operation(
                "CC-SO-QPCR-RS256-001",
                "CC-EN-QPCR-CREATION-RS256-001",
                "SIG-QPCR-CREATION-RS256-001",
                "CC-TK-CREATORS-COMMON-RS256-001",
                "CC-SA-CREATORS-COMMON-HARDWARE-001",
                "CC-KA-CREATORS-COMMON-RS256-001",
                "RS256",
                RSA_MESSAGE,
                RSA_SIGNATURE,
                "CC-SV-QPCR-CREATION-RS256-VALID-001",
            ),
        ]

        checker = FormatChecker()
        att_validator = Draft202012Validator(schemas[0], format_checker=checker)
        op_validator = Draft202012Validator(schemas[1], format_checker=checker)
        for record in attestations:
            errors = list(att_validator.iter_errors(record))
            if errors:
                raise ValueError(f"attestation schema failure: {errors[0].message}")
            if record["status"] == "synthetic" and record["attestationType"] != "synthetic-test":
                raise ValueError("synthetic status requires synthetic-test attestation")
            if record["claims"]["privateKeyExportable"]:
                raise ValueError("conformance custody record must be non-exportable")
        for record in operations:
            errors = list(op_validator.iter_errors(record))
            if errors:
                raise ValueError(f"signing-operation schema failure: {errors[0].message}")
            if record["context"]["purpose"] != "conformance-testing":
                raise ValueError("synthetic attestation escaped conformance purpose")
            if record["context"]["environment"] != "creators-common-registry":
                raise ValueError("synthetic attestation escaped conformance environment")
            if not record["context"]["hardwareBound"] or not record["result"]["keyBoundaryEvidence"]:
                raise ValueError("hardware-bound operation lacks boundary evidence")

        print(
            "Validated 2 custody/signing schemas, 2 synthetic attestations, "
            "2 signing operations and ES256/RS256 positive and negative vectors."
        )
        return 0
    except (ValueError, TypeError) as exc:
        print(f"Advanced trust validation failed:\n{exc}", file=sys.stderr)
        return 1


if __name__ == "__main__":
    raise SystemExit(main())
