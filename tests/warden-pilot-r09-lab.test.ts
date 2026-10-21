import { createHash, generateKeyPairSync, sign } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { afterEach, describe, expect, it } from "vitest";
import { examplePilotApplication } from "../lib/programs/warden-pilot-esomoire-fixture";
import { SyntheticEsomoireRegistryLab, verifyLabGrant } from "../lib/programs/warden-pilot-r09-lab";

const { publicKey, privateKey } = generateKeyPairSync("ed25519");
const now = 1792627200;
const tenantA = "EXAMPLE-TENANT-A";
const tenantB = "EXAMPLE-TENANT-B";
const providerA = "EXAMPLE-PROVIDER-A";
const providerB = "EXAMPLE-PROVIDER-B";
const esomoire = "EXAMPLE-ESOMOIRE";
const candidate = "EXAMPLE-PILOT-001";
let sequence = 0;
const resources: SyntheticEsomoireRegistryLab[] = [];
const directories: string[] = [];
function grant(
  action: string, tenant = tenantA, subject = providerA, role = "pilot",
  options: Record<string, unknown> = {},
) {
  const claims = {
    issuer: "EXAMPLE-LOCAL-LAB",
    audience: "CC-WARDEN-PILOT-R0.9-LAB",
    subject, tenant, resource: candidate, role, action,
    jti: "EXAMPLE-GRANT-" + String(++sequence).padStart(4, "0"),
    iat: now - 1, exp: now + 60,
    ...options,
  };
  const bytes = Buffer.from(JSON.stringify(claims));
  return { payload: bytes.toString("base64url"), signature: sign(null, bytes, privateKey).toString("base64url") };
}
const lab = (path = ":memory:") => {
  const instance = new SyntheticEsomoireRegistryLab(path, publicKey, () => now);
  resources.push(instance);
  return instance;
};
afterEach(() => {
  for (const instance of resources.splice(0)) { try { instance.close(); } catch { /* closed */ } }
  for (const dir of directories.splice(0)) rmSync(dir, { recursive: true, force: true });
});

describe("R0.9 local synthetic tenant and grant lab", () => {
  it("accepts a narrow valid Ed25519 grant with verified issuer, audience, clock and scope", () => {
    const c = verifyLabGrant(grant("candidate:create"), publicKey, now);
    expect(c.subject).toBe(providerA);
    expect(c.tenant).toBe(tenantA);
    expect(c.action).toBe("candidate:create");
    expect(Object.isFrozen(c)).toBe(true);
  });

  it("rejects a tampered payload and untrusted signing key", () => {
    const token = grant("candidate:create");
    const forged = Buffer.from(token.payload, "base64url").toString("utf8").replace(providerA, providerB);
    expect(() => verifyLabGrant({ ...token, payload: Buffer.from(forged).toString("base64url") }, publicKey, now)).toThrow();
    const other = generateKeyPairSync("ed25519");
    expect(() => verifyLabGrant(token, other.publicKey, now)).toThrow(/signature verification/);
  });

  it("rejects expired, future, over-long, and wrong-audience signed grants", () => {
    for (const attributes of [
      { exp: now }, { iat: now + 1 }, { iat: now - 10, exp: now + 400 },
      { audience: "NOT-CC" }, { issuer: "OTHER" },
    ]) expect(() => verifyLabGrant(grant("candidate:read", tenantA, providerA, "pilot", attributes), publicKey, now)).toThrow();
  });

  it("rejects disallowed actor action, fake subject, token extra fields, and noncanonical payload", () => {
    expect(() => verifyLabGrant(grant("candidate:create", tenantA, esomoire, "esomoire"), publicKey, now)).toThrow();
    expect(() => verifyLabGrant(grant("admin:read", tenantA, providerA, "pilot"), publicKey, now)).toThrow();
    expect(() => verifyLabGrant(grant("candidate:read", tenantA, "REAL-PERSON", "pilot"), publicKey, now)).toThrow();
    expect(() => verifyLabGrant(grant("candidate:read", tenantA, providerA, "pilot", { extra: "field" }), publicKey, now)).toThrow();
    const token = grant("candidate:read");
    const raw = Buffer.from(token.payload, "base64url").toString("utf8");
    const reordered = raw.replace('{"issuer":', '{"unexpected":null,"issuer":');
    const bytes = Buffer.from(reordered);
    expect(() => verifyLabGrant({ payload: bytes.toString("base64url"),
      signature: sign(null, bytes, privateKey).toString("base64url") }, publicKey, now)).toThrow();
  });

  it("creates a synthetically admitted registry record, not a booking, licence or Warden grant", () => {
    const db = lab();
    db.create(grant("candidate:create"), candidate, examplePilotApplication);
    const found = db.readOwned(grant("candidate:read"), candidate);
    expect(found?.tenant).toBe(tenantA);
    expect(found?.status).toBe("PREVIEW_ONLY");
    expect(found?.application).toEqual(examplePilotApplication);
    const admin = db.readAdministrative(grant("admin:read", tenantA, esomoire, "esomoire"), candidate);
    expect(admin).toEqual({
      tenant: tenantA, candidateId: candidate,
      registryReference: "EXAMPLE-REG-PILOT-001", listingReference: "EXAMPLE-LIST-PILOT-001",
      bookingReference: "EXAMPLE-BOOK-PILOT-001",
      recordState: "PREVIEW_ONLY", listingState: "NOT_PUBLISHED", bookingState: "NOT_BOOKABLE",
      productLicenceGranted: false, customerPaymentVisible: false,
    });
    expect(db.verifyLocalAudit(tenantA)).toBe(true);
  });

  it("denies cross-tenant and cross-owner reads and withdrawals", () => {
    const db = lab();
    db.create(grant("candidate:create"), candidate, examplePilotApplication);
    expect(db.readOwned(grant("candidate:read", tenantB, providerA), candidate)).toBeNull();
    expect(db.readOwned(grant("candidate:read", tenantA, providerB), candidate)).toBeNull();
    expect(db.readAdministrative(grant("admin:read", tenantB, esomoire, "esomoire"), candidate)).toBeNull();
    expect(() => db.withdraw(grant("candidate:withdraw", tenantB), candidate)).toThrow();
    expect(() => db.withdraw(grant("candidate:withdraw", tenantA, providerB), candidate)).toThrow();
    expect(db.readOwned(grant("candidate:read"), candidate)?.status).toBe("PREVIEW_ONLY");
  });

  it("supports same candidate reference across isolated synthetic tenants", () => {
    const db = lab();
    db.create(grant("candidate:create", tenantA), candidate, examplePilotApplication);
    db.create(grant("candidate:create", tenantB), candidate, examplePilotApplication);
    expect(db.readOwned(grant("candidate:read", tenantA), candidate)).not.toBeNull();
    expect(db.readOwned(grant("candidate:read", tenantB), candidate)).not.toBeNull();
    expect(db.verifyLocalAudit(tenantA)).toBe(true);
    expect(db.verifyLocalAudit(tenantB)).toBe(true);
  });

  it("cannot reuse a mutation token even across different tenants or targets", () => {
    const db = lab();
    const one = grant("candidate:create", tenantA);
    db.create(one, candidate, examplePilotApplication);
    expect(() => db.create(one, candidate, examplePilotApplication)).toThrow(/replayed/);
    expect(() => db.create(grant("candidate:create"), candidate, examplePilotApplication)).toThrow();
    expect(db.verifyLocalAudit(tenantA)).toBe(true);
  });

  it("restricts administrative visibility to the signed candidate reference", () => {
    const db = lab();
    db.create(grant("candidate:create"), candidate, examplePilotApplication);
    db.create(grant("candidate:create", tenantA, providerA, "pilot",
      { resource: "EXAMPLE-PILOT-002" }), "EXAMPLE-PILOT-002", examplePilotApplication);
    expect(() => db.readAdministrative(
      grant("admin:read", tenantA, esomoire, "esomoire", { resource: "EXAMPLE-PILOT-002" }),
      candidate,
    )).toThrow(/resource scope/);
    expect(db.readAdministrative(
      grant("admin:read", tenantA, esomoire, "esomoire", { resource: "EXAMPLE-PILOT-002" }),
      "EXAMPLE-PILOT-002",
    )?.candidateId).toBe("EXAMPLE-PILOT-002");
  });

  it("denies duplicated token ID across separately signed tenants", () => {
    const db = lab();
    const first = grant("candidate:create", tenantA, providerA, "pilot", { jti: "EXAMPLE-SAME-JTI" });
    db.create(first, candidate, examplePilotApplication);
    const sameIdOtherTenant = grant("candidate:create", tenantB, providerA, "pilot",
      { jti: "EXAMPLE-SAME-JTI" });
    expect(() => db.create(sameIdOtherTenant, candidate, examplePilotApplication)).toThrow(/replayed/);
  });

  it("does not permit a read token to create and an Esomoire admin to mutate", () => {
    const db = lab();
    expect(() => db.create(grant("candidate:read"), candidate, examplePilotApplication)).toThrow();
    expect(() => db.create(grant("admin:read", tenantA, esomoire, "esomoire"), candidate, examplePilotApplication)).toThrow();
    expect(() => db.readAdministrative(grant("candidate:read"), candidate)).toThrow();
    expect(db.readOwned(grant("candidate:read"), candidate)).toBeNull();
  });

  it("allows a single reversible synthetic withdrawal but not a resubmission", () => {
    const db = lab();
    db.create(grant("candidate:create"), candidate, examplePilotApplication);
    db.withdraw(grant("candidate:withdraw"), candidate);
    expect(db.readOwned(grant("candidate:read"), candidate)?.status).toBe("WITHDRAWN");
    const p = db.readAdministrative(grant("admin:read", tenantA, esomoire, "esomoire"), candidate);
    expect(p?.recordState).toBe("WITHDRAWN");
    expect(p?.bookingState).toBe("NOT_BOOKABLE");
    expect(() => db.withdraw(grant("candidate:withdraw"), candidate)).toThrow();
    expect(() => db.create(grant("candidate:create"), candidate, examplePilotApplication)).toThrow();
    expect(db.verifyLocalAudit(tenantA)).toBe(true);
  });

  it("rejects synthetic identity claims containing real proposal fields", () => {
    const db = lab();
    const app = structuredClone(examplePilotApplication) as any;
    app.company.displayName = "Not synthetic Acme";
    expect(() => db.create(grant("candidate:create"), candidate, app)).toThrow();
    expect(db.readOwned(grant("candidate:read"), candidate)).toBeNull();
  });

  it("persists records and replay state across a local SQLite reopen", () => {
    const dir = mkdtempSync(join(tmpdir(), "cc-r09-")); directories.push(dir);
    const path = join(dir, "pilot.synthetic.sqlite");
    const one = lab(path);
    const issue = grant("candidate:create");
    one.create(issue, candidate, examplePilotApplication);
    one.close(); resources.splice(resources.indexOf(one), 1);
    const reopened = lab(path);
    expect(reopened.readOwned(grant("candidate:read"), candidate)?.status).toBe("PREVIEW_ONLY");
    expect(() => reopened.create(issue, candidate, examplePilotApplication)).toThrow(/replayed/);
    expect(reopened.verifyLocalAudit(tenantA)).toBe(true);
  });

  it("detects local event alterations, but does not mistake the hash chain for external custody", () => {
    const dir = mkdtempSync(join(tmpdir(), "cc-r09-")); directories.push(dir);
    const path = join(dir, "pilot.synthetic.sqlite");
    const one = lab(path);
    one.create(grant("candidate:create"), candidate, examplePilotApplication);
    one.close(); resources.splice(resources.indexOf(one), 1);
    const raw = new DatabaseSync(path);
    raw.prepare("UPDATE lab_events SET event='TAMPERED' WHERE tenant=?").run(tenantA);
    raw.close();
    const reopened = lab(path);
    expect(reopened.verifyLocalAudit(tenantA)).toBe(false);
  });

  it("documents the uncaught trust limitation: a local SQLite writer can delete prior claims", () => {
    const dir = mkdtempSync(join(tmpdir(), "cc-r09-")); directories.push(dir);
    const path = join(dir, "pilot.synthetic.sqlite");
    const db = lab(path);
    const issued = grant("candidate:create");
    db.create(issued, candidate, examplePilotApplication);
    db.close(); resources.splice(resources.indexOf(db), 1);
    const localAttacker = new DatabaseSync(path);
    localAttacker.exec("DELETE FROM lab_events; DELETE FROM candidates; DELETE FROM consumed_tokens;");
    localAttacker.close();
    const reopened = lab(path);
    expect(reopened.verifyLocalAudit(tenantA)).toBe(true); // Empty local history is not independently anchored.
    expect(() => reopened.create(issued, candidate, examplePilotApplication)).not.toThrow();
  });

  it("keeps synthetic-only file naming and rejects real database paths", () => {
    expect(() => lab("/var/live-app.db")).toThrow();
    expect(() => lab(":memory:pretending-to-be-memory")).toThrow();
  });
});
