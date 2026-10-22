/**
 * Creators Common Warden R1.0 — local synthetic split-custody assurance lab.
 *
 * Two independently opened SQLite stores and separate test signing keys on one
 * host do NOT establish an independent operator, network isolation, production
 * trust or exactly-once external effects. No real identity, customer or booking.
 */
import { createHash, createPublicKey, sign, verify, type KeyObject } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import { type SignedLabGrant, SyntheticEsomoireRegistryLab, verifyLabGrant } from "./warden-pilot-r09-lab";
import { validateSyntheticPilotApplication } from "./warden-pilot-esomoire";

export const R10_GATES = Object.freeze({
  realIdentity: false, realIntake: false, publicListings: false,
  bookings: false, licences: false, payments: false,
  wardenExecution: false, independentRiverCustody: false,
});

export type CustodyState = "RESERVED" | "COMMITTED";
export type CustodyReceiptClaims = Readonly<{
  kind: "EXAMPLE-CUSTODY-RECEIPT";
  version: "R1.0";
  tenant: string;
  candidateId: string;
  subject: string;
  grantId: string;
  effectDigest: string;
  state: CustodyState;
  time: number;
}>;
export type SignedCustodyReceipt = Readonly<{ payload: string; signature: string }>;
type CustodyRow = {
  tenant: string; candidate: string; subject: string; jti: string;
  effect_digest: string; state: CustodyState;
};
const receiptFields = [
  "kind", "version", "tenant", "candidateId", "subject", "grantId", "effectDigest", "state", "time",
] as const;
const exampleId = /^EXAMPLE-[A-Z0-9]+(?:-[A-Z0-9]+)*$/;
const sha256 = (s: string) => createHash("sha256").update(s).digest("hex");

function reject(message: string): never { throw Error("R1.0_HOLD: " + message); }
function isPlain(v: unknown): v is Record<string, unknown> {
  return !!v && typeof v === "object" && !Array.isArray(v) &&
    (Object.getPrototypeOf(v) === Object.prototype || Object.getPrototypeOf(v) === null);
}
function keysExact(v: Record<string, unknown>, expected: readonly string[]) {
  return Object.keys(v).sort().join("|") === [...expected].sort().join("|");
}
function checkId(v: unknown): asserts v is string {
  if (typeof v !== "string" || v.length > 70 || !exampleId.test(v)) reject("synthetic ID required");
}
function decode(v: unknown, max: number) {
  if (typeof v !== "string" || !v.length || v.length > max ||
      !/^[A-Za-z0-9_-]+$/.test(v)) reject("invalid receipt encoding");
  const b = Buffer.from(v, "base64url");
  if (b.toString("base64url") !== v) reject("noncanonical receipt encoding");
  return b;
}
function verifyKey(key: KeyObject) {
  if (!key || key.type !== "public" || key.asymmetricKeyType !== "ed25519") reject("invalid custody verification key");
}
export function verifyCustodyReceipt(receipt: unknown, trustedCustodyKey: KeyObject): CustodyReceiptClaims {
  verifyKey(trustedCustodyKey);
  if (!isPlain(receipt) || !keysExact(receipt, ["payload", "signature"])) reject("receipt envelope malformed");
  const payload = decode(receipt.payload, 4096);
  const signature = decode(receipt.signature, 200);
  if (signature.length !== 64) reject("invalid custody signature length");
  let object: unknown;
  try { object = JSON.parse(payload.toString("utf8")); } catch { reject("invalid receipt JSON"); }
  if (!isPlain(object) || !keysExact(object, receiptFields)) reject("receipt shape malformed");
  if (object.kind !== "EXAMPLE-CUSTODY-RECEIPT" || object.version !== "R1.0" ||
      (object.state !== "RESERVED" && object.state !== "COMMITTED") ||
      typeof object.effectDigest !== "string" || !/^[0-9a-f]{64}$/.test(object.effectDigest) ||
      !Number.isSafeInteger(object.time)) reject("invalid receipt fields");
  for (const f of ["tenant","candidateId","subject","grantId"]) checkId(object[f]);
  if (JSON.stringify(object) !== payload.toString("utf8")) reject("noncanonical receipt JSON");
  if (!verify(null, payload, trustedCustodyKey, signature)) reject("untrusted or altered custody receipt");
  return Object.freeze(object as CustodyReceiptClaims);
}

export class SyntheticCustodyFixture {
  private readonly db: DatabaseSync;
  private available = true;

  constructor(path: string, private readonly labIdentityKey: KeyObject,
    private readonly fixtureSigningKey: KeyObject,
    readonly receiptVerificationKey: KeyObject,
    private readonly trustedNow: () => number) {
    if (path !== ":memory:" && (typeof path !== "string" ||
      !path.endsWith(".custody.synthetic.sqlite"))) reject("custody lab path required");
    verifyKey(labIdentityKey);
    verifyKey(receiptVerificationKey);
    if (!fixtureSigningKey || fixtureSigningKey.type !== "private" ||
        fixtureSigningKey.asymmetricKeyType !== "ed25519") reject("fixture signer must be Ed25519");
    if (!createPublicKey(fixtureSigningKey).export({ type: "spki", format: "der" })
      .equals(receiptVerificationKey.export({ type: "spki", format: "der" }))) {
      reject("custody signing and verification keys differ");
    }
    this.db = new DatabaseSync(path);
    this.db.exec("PRAGMA busy_timeout=2500; PRAGMA foreign_keys=ON;");
    this.db.exec(
      "CREATE TABLE IF NOT EXISTS custody_claims (" +
      "tenant TEXT NOT NULL,candidate TEXT NOT NULL,subject TEXT NOT NULL," +
      "jti TEXT NOT NULL UNIQUE,effect_digest TEXT NOT NULL," +
      "state TEXT NOT NULL CHECK(state IN ('RESERVED','COMMITTED'))," +
      "PRIMARY KEY(tenant,candidate)) STRICT;" +
      "CREATE TABLE IF NOT EXISTS subject_revocations (" +
      "tenant TEXT NOT NULL,subject TEXT NOT NULL,PRIMARY KEY(tenant,subject)) STRICT;"
    );
  }
  close(): void { this.db.close(); }

  /** Test-operator toggle only: simulates an unavailable independent custodian. */
  simulateCustodyOutage(unavailable: boolean): void { this.available = !unavailable; }
  private checkAvailable() { if (!this.available) reject("custodian unavailable: fail closed"); }
  /** Test-operator action; not a public revocation endpoint or a real IAM integration. */
  revokeSyntheticSubject(tenant: string, subject: string): void {
    this.checkAvailable(); checkId(tenant); checkId(subject);
    this.db.prepare("INSERT OR IGNORE INTO subject_revocations(tenant,subject) VALUES (?,?)")
      .run(tenant, subject);
  }
  private snapshot(row: CustodyRow): SignedCustodyReceipt {
    const time = this.trustedNow();
    if (!Number.isSafeInteger(time)) reject("invalid trusted clock");
    const claims: CustodyReceiptClaims = {
      kind: "EXAMPLE-CUSTODY-RECEIPT", version: "R1.0",
      tenant: row.tenant, candidateId: row.candidate,
      subject: row.subject, grantId: row.jti, effectDigest: row.effect_digest,
      state: row.state, time,
    };
    const payload = Buffer.from(JSON.stringify(claims), "utf8");
    return Object.freeze({
      payload: payload.toString("base64url"),
      signature: sign(null, payload, this.fixtureSigningKey).toString("base64url"),
    });
  }
  /**
   * Consume a signed candidate-create intent in the fixture custodian BEFORE
   * the separate R0.9 local registry write. The (tenant,candidate) unique key
   * defeats new-JTI retries after local registry deletion while custody survives.
   */
  reserve(grant: SignedLabGrant, candidateId: string, application: unknown): SignedCustodyReceipt {
    this.checkAvailable();
    const now = this.trustedNow();
    const claims = verifyLabGrant(grant, this.labIdentityKey, now);
    if (claims.action !== "candidate:create" || claims.role !== "pilot" ||
        claims.resource !== candidateId) reject("create intent not admitted");
    checkId(candidateId);
    validateSyntheticPilotApplication(application);
    const appJson = JSON.stringify(application);
    if (appJson.length > 16384) reject("synthetic application size exceeds limit");
    const effectDigest = sha256(JSON.stringify([claims.tenant, candidateId, claims.subject, appJson]));
    this.db.exec("BEGIN IMMEDIATE;");
    try {
      if (this.db.prepare("SELECT 1 FROM subject_revocations WHERE tenant=? AND subject=?")
        .get(claims.tenant, claims.subject)) reject("synthetic subject revoked");
      if (this.db.prepare("SELECT 1 FROM custody_claims WHERE jti=? OR (tenant=? AND candidate=?)")
        .get(claims.jti, claims.tenant, candidateId)) reject("effect or grant already reserved");
      this.db.prepare(
        "INSERT INTO custody_claims(tenant,candidate,subject,jti,effect_digest,state) " +
        "VALUES(?,?,?,?,?,'RESERVED')"
      ).run(claims.tenant, candidateId, claims.subject, claims.jti, effectDigest);
      this.db.exec("COMMIT;");
    } catch (err) { this.db.exec("ROLLBACK;"); throw err; }
    return this.snapshot({
      tenant: claims.tenant, candidate: candidateId, subject: claims.subject,
      jti: claims.jti, effect_digest: effectDigest, state: "RESERVED",
    });
  }
  /**
   * Acknowledges only a pre-existing reservation. No automatic reconciliation:
   * if a crash occurs after the local write but before commit ACK, the caller
   * remains in a HOLD state until independently reviewed.
   */
  commit(reservation: SignedCustodyReceipt): SignedCustodyReceipt {
    this.checkAvailable();
    const ack = verifyCustodyReceipt(reservation, this.receiptVerificationKey);
    if (ack.state !== "RESERVED") reject("commit requires a reservation receipt");
    this.db.exec("BEGIN IMMEDIATE;");
    let row: CustodyRow;
    try {
      const stored = this.db.prepare(
        "SELECT tenant,candidate,subject,jti,effect_digest,state FROM custody_claims WHERE tenant=? AND candidate=?"
      ).get(ack.tenant, ack.candidateId) as CustodyRow | undefined;
      if (!stored || stored.jti !== ack.grantId || stored.effect_digest !== ack.effectDigest ||
          stored.subject !== ack.subject || stored.state !== "RESERVED") {
        reject("reservation mismatch, missing or already committed");
      }
      if (this.db.prepare("SELECT 1 FROM subject_revocations WHERE tenant=? AND subject=?")
        .get(ack.tenant, ack.subject)) reject("synthetic subject revoked before commit");
      this.db.prepare("UPDATE custody_claims SET state='COMMITTED' WHERE tenant=? AND candidate=?")
        .run(ack.tenant, ack.candidateId);
      row = { ...stored, state: "COMMITTED" };
      this.db.exec("COMMIT;");
    } catch (err) { this.db.exec("ROLLBACK;"); throw err; }
    return this.snapshot(row);
  }
  /** Returns a signed fixture head on demand; not independently retained River evidence. */
  attestSyntheticHead(tenant: string, candidateId: string): SignedCustodyReceipt | null {
    this.checkAvailable(); checkId(tenant); checkId(candidateId);
    const row = this.db.prepare(
      "SELECT tenant,candidate,subject,jti,effect_digest,state FROM custody_claims WHERE tenant=? AND candidate=?"
    ).get(tenant, candidateId) as CustodyRow | undefined;
    return row ? this.snapshot(row) : null;
  }
  /** Compare a previously retained signed receipt to the fixture's current row. */
  verifyAgainstCustody(previous: SignedCustodyReceipt): boolean {
    this.checkAvailable();
    const claims = verifyCustodyReceipt(previous, this.receiptVerificationKey);
    const head = this.attestSyntheticHead(claims.tenant, claims.candidateId);
    if (!head) return false;
    const now = verifyCustodyReceipt(head, this.receiptVerificationKey);
    return ["tenant", "candidateId", "subject", "grantId", "effectDigest"].every(
      k => now[k as keyof CustodyReceiptClaims] === claims[k as keyof CustodyReceiptClaims]
    ) && (claims.state === "RESERVED" || now.state === "COMMITTED");
  }
}

/**
 * Safe *ordering* demonstration only. The local R0.9 registry remains directly
 * callable; this wrapper is not an OS/database enforcement perimeter.
 */
export function syntheticProtectedCreate(
  fixtureCustody: SyntheticCustodyFixture, localRegistry: SyntheticEsomoireRegistryLab,
  grant: SignedLabGrant, candidateId: string, application: unknown,
  options: { simulateCrashBeforeCommit?: boolean; simulateLostPostCommitAck?: boolean } = {},
): { custodyReservation: SignedCustodyReceipt; custodyCommit: SignedCustodyReceipt | null; state: "COMMITTED_SYNTHETIC" | "HOLD_UNRECONCILED" } {
  const reservation = fixtureCustody.reserve(grant, candidateId, application);
  localRegistry.create(grant, candidateId, application);
  if (options.simulateCrashBeforeCommit) {
    // Simulate process loss before custody commit. Reservation persists.
    return { custodyReservation: reservation, custodyCommit: null, state: "HOLD_UNRECONCILED" };
  }
  // Fails closed if custodian is unavailable, with local state possibly written.
  const commit = fixtureCustody.commit(reservation);
  if (options.simulateLostPostCommitAck) {
    // Commit persisted at custody but the response was lost to the actor.
    return { custodyReservation: reservation, custodyCommit: null, state: "HOLD_UNRECONCILED" };
  }
  return { custodyReservation: reservation, custodyCommit: commit, state: "COMMITTED_SYNTHETIC" };
}

/**
 * Read-only diagnostic: NEVER resubmit a lost effect or release the HOLD.
 * This can only inspect the same-host synthetic custody store.
 */
export function inspectSyntheticRecovery(
  custody: SyntheticCustodyFixture, reservation: SignedCustodyReceipt,
): "RESERVED_REQUIRES_REVIEW" | "COMMITTED_REQUIRES_REVIEW" | "CUSTODY_MISSING_HOLD" | "CUSTODY_MISMATCH_HOLD" {
  const expected = verifyCustodyReceipt(reservation, custody.receiptVerificationKey);
  if (expected.state !== "RESERVED") reject("recovery needs reservation receipt");
  const head = custody.attestSyntheticHead(expected.tenant, expected.candidateId);
  if (!head) return "CUSTODY_MISSING_HOLD";
  const current = verifyCustodyReceipt(head, custody.receiptVerificationKey);
  if (expected.grantId !== current.grantId ||
      expected.subject !== current.subject ||
      expected.effectDigest !== current.effectDigest) return "CUSTODY_MISMATCH_HOLD";
  return current.state === "COMMITTED" ? "COMMITTED_REQUIRES_REVIEW" : "RESERVED_REQUIRES_REVIEW";
}
