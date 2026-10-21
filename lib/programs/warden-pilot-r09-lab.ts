/**
 * Warden R0.9 — strictly synthetic, local-only, tenant-isolated intake lab.
 *
 * This is NOT a web endpoint, DigitalMe login, Warden decision, Esomoire appointment,
 * company registry or production data store. The local test issuer and subjects must
 * begin EXAMPLE-. Do not reuse these tokens/keys or store real applicant information.
 */
import { createHash, verify, type KeyObject } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import { buildEsomoirePreview, validateSyntheticPilotApplication } from "./warden-pilot-esomoire";

type Action = "candidate:create" | "candidate:read" | "candidate:withdraw" | "admin:read";
type Role = "pilot" | "esomoire";
type Claims = {
  issuer: "EXAMPLE-LOCAL-LAB";
  audience: "CC-WARDEN-PILOT-R0.9-LAB";
  subject: string;
  tenant: string;
  resource: string;
  role: Role;
  action: Action;
  jti: string;
  iat: number;
  exp: number;
};
export type SignedLabGrant = Readonly<{ payload: string; signature: string }>;
export type LabReader = {
  tenant: string;
  candidateId: string;
  status: "PREVIEW_ONLY" | "WITHDRAWN";
  application: unknown;
};
export type AdminProjection = {
  tenant: string;
  candidateId: string;
  registryReference: string;
  listingReference: string;
  bookingReference: string;
  recordState: "PREVIEW_ONLY" | "WITHDRAWN";
  listingState: "NOT_PUBLISHED";
  bookingState: "NOT_BOOKABLE";
  productLicenceGranted: false;
  customerPaymentVisible: false;
};
const roleActions: Record<Role, readonly Action[]> = {
  pilot: ["candidate:create", "candidate:read", "candidate:withdraw"],
  esomoire: ["admin:read"],
};
const claimKeys = ["issuer", "audience", "subject", "tenant", "resource", "role", "action", "jti", "iat", "exp"];
const example = /^EXAMPLE-[A-Z0-9]+(?:-[A-Z0-9]+)*$/;
function deny(reason: string): never { throw new Error("R0.9_DENY: " + reason); }
function isPlain(value: unknown): value is Record<string, unknown> {
  return value !== null && typeof value === "object" && !Array.isArray(value) &&
    (Object.getPrototypeOf(value) === Object.prototype || Object.getPrototypeOf(value) === null);
}
function matchesKeys(v: Record<string, unknown>, keys: readonly string[]): boolean {
  return Object.keys(v).sort().join("|") === [...keys].sort().join("|");
}
function synthetic(v: unknown): v is string {
  return typeof v === "string" && v.length <= 70 && example.test(v);
}
function decodeBase64url(input: unknown, maxLen: number): Buffer {
  if (typeof input !== "string" || input.length < 1 || input.length > maxLen ||
      !/^[A-Za-z0-9_-]+$/.test(input)) deny("invalid base64url token");
  const decoded = Buffer.from(input, "base64url");
  if (decoded.toString("base64url") !== input) deny("noncanonical base64url token");
  return decoded;
}
function requireClaimFields(payload: unknown): asserts payload is Claims {
  if (!isPlain(payload) || !matchesKeys(payload, claimKeys)) deny("invalid signed claim shape");
  if (payload.issuer !== "EXAMPLE-LOCAL-LAB" ||
      payload.audience !== "CC-WARDEN-PILOT-R0.9-LAB") deny("invalid issuer/audience");
  if (!synthetic(payload.subject) || !synthetic(payload.tenant) ||
      !synthetic(payload.resource) || !synthetic(payload.jti)) {
    deny("synthetic tenant, subject, resource and token ID required");
  }
  if (payload.role !== "pilot" && payload.role !== "esomoire") deny("unknown actor role");
  if (!roleActions[payload.role as Role].includes(payload.action as Action)) deny("role/action mismatch");
  if (!Number.isSafeInteger(payload.iat) || !Number.isSafeInteger(payload.exp)) deny("invalid token time");
}
/**
 * Validate a detached Ed25519 signature over exact canonical JSON bytes.
 * Caller supplies the trusted verification key, NEVER a key from untrusted claims.
 * This lab offers no token issuance, no real identity provider and no key rotation.
 */
export function verifyLabGrant(grant: unknown, trustedPublicKey: KeyObject, nowSeconds: number): Readonly<Claims> {
  if (!trustedPublicKey || trustedPublicKey.type !== "public" ||
      trustedPublicKey.asymmetricKeyType !== "ed25519") deny("trusted Ed25519 public key required");
  if (!Number.isSafeInteger(nowSeconds)) deny("invalid trusted clock");
  if (!isPlain(grant) || !matchesKeys(grant, ["payload", "signature"])) deny("invalid grant envelope");
  const raw = decodeBase64url(grant.payload, 4096);
  const signature = decodeBase64url(grant.signature, 200);
  if (signature.length !== 64) deny("invalid Ed25519 signature");
  const json = raw.toString("utf8");
  let claims: unknown;
  try { claims = JSON.parse(json); } catch { deny("invalid JSON"); }
  requireClaimFields(claims);
  // Reject duplicate JSON keys, alternative encodings, nonfinite values and reordered shapes.
  if (Buffer.from(JSON.stringify(claims), "utf8").compare(raw) !== 0) deny("noncanonical signed payload");
  if (!verify(null, raw, trustedPublicKey, signature)) deny("signature verification failed");
  if (claims.iat > nowSeconds || claims.exp <= nowSeconds ||
      claims.exp <= claims.iat || claims.exp - claims.iat > 300) deny("expired or excessive grant lifetime");
  return Object.freeze({ ...claims });
}
function checkGrant(grant: unknown, key: KeyObject, now: number, action: Action): Readonly<Claims> {
  const verified = verifyLabGrant(grant, key, now);
  if (verified.action !== action) deny("not authorized for this action");
  return verified;
}
function idValue(value: unknown): asserts value is string {
  if (!synthetic(value)) deny("candidate ID must be synthetic");
}
const digest = (v: string) => createHash("sha256").update(v, "utf8").digest("hex");

export class SyntheticEsomoireRegistryLab {
  private readonly db: DatabaseSync;
  constructor(path: string, private readonly trustedPublicKey: KeyObject,
    private readonly trustedNow: () => number) {
    if (typeof path !== "string" || (path !== ":memory:" && !path.endsWith(".synthetic.sqlite"))) {
      deny("only memory or explicitly named synthetic SQLite paths allowed");
    }
    this.db = new DatabaseSync(path);
    this.db.exec("PRAGMA foreign_keys = ON; PRAGMA busy_timeout = 2500;");
    this.db.exec(
      "CREATE TABLE IF NOT EXISTS candidates (" +
      "tenant TEXT NOT NULL, candidate TEXT NOT NULL, owner TEXT NOT NULL, " +
      "payload TEXT NOT NULL, projection TEXT NOT NULL, " +
      "status TEXT NOT NULL CHECK(status IN ('PREVIEW_ONLY','WITHDRAWN')), " +
      "PRIMARY KEY(tenant,candidate)) STRICT;" +
      "CREATE TABLE IF NOT EXISTS consumed_tokens (" +
      "jti TEXT PRIMARY KEY, tenant TEXT NOT NULL, action TEXT NOT NULL) STRICT;" +
      "CREATE TABLE IF NOT EXISTS lab_events (" +
      "seq INTEGER PRIMARY KEY AUTOINCREMENT, tenant TEXT NOT NULL, " +
      "candidate TEXT NOT NULL, actor TEXT NOT NULL, event TEXT NOT NULL, " +
      "previous_digest TEXT NOT NULL, digest TEXT NOT NULL) STRICT;"
    );
  }
  close(): void { this.db.close(); }
  private auth(grant: unknown, action: Action, candidateId: unknown): Readonly<Claims> {
    idValue(candidateId);
    const actor = checkGrant(grant, this.trustedPublicKey, this.trustedNow(), action);
    if (actor.resource !== candidateId) deny("resource scope mismatch");
    return actor;
  }
  private addEvent(actor: Claims, candidateId: string, event: string): void {
    const previous = this.db.prepare(
      "SELECT digest FROM lab_events WHERE tenant=? ORDER BY seq DESC LIMIT 1"
    ).get(actor.tenant) as { digest: string } | undefined;
    const prior = previous?.digest ?? "GENESIS-SYNTHETIC";
    const d = digest(JSON.stringify([actor.tenant, candidateId, actor.subject, event, prior]));
    this.db.prepare("INSERT INTO lab_events (tenant,candidate,actor,event,previous_digest,digest) VALUES (?,?,?,?,?,?)")
      .run(actor.tenant, candidateId, actor.subject, event, prior, d);
  }
  private consumed(actor: Claims): void {
    if (this.db.prepare("SELECT jti FROM consumed_tokens WHERE jti=?").get(actor.jti)) {
      deny("replayed mutation grant");
    }
    this.db.prepare("INSERT INTO consumed_tokens (jti,tenant,action) VALUES (?,?,?)")
      .run(actor.jti, actor.tenant, actor.action);
  }
  /** Always fail closed. A single-use signed fixture grant is consumed atomically. */
  create(grant: unknown, candidateId: unknown, application: unknown): void {
    const actor = this.auth(grant, "candidate:create", candidateId);
    idValue(candidateId);
    validateSyntheticPilotApplication(application);
    const preview = buildEsomoirePreview(application, candidateId);
    this.db.exec("BEGIN IMMEDIATE;");
    try {
      this.consumed(actor);
      this.db.prepare(
        "INSERT INTO candidates (tenant,candidate,owner,payload,projection,status) VALUES (?,?,?,?,?,'PREVIEW_ONLY')"
      ).run(actor.tenant, candidateId, actor.subject, JSON.stringify(application), JSON.stringify(preview));
      this.addEvent(actor, candidateId, "CREATED_SYNTHETIC");
      this.db.exec("COMMIT;");
    } catch (error) {
      this.db.exec("ROLLBACK;");
      throw error;
    }
  }
  /** Provider reads only its own synthetic record, even within its tenant. */
  readOwned(grant: unknown, candidateId: unknown): LabReader | null {
    const actor = this.auth(grant, "candidate:read", candidateId);
    idValue(candidateId);
    const row = this.db.prepare(
      "SELECT status,payload FROM candidates WHERE tenant=? AND candidate=? AND owner=?"
    ).get(actor.tenant, candidateId, actor.subject) as { status: LabReader["status"]; payload: string } | undefined;
    return row ? { tenant: actor.tenant, candidateId, status: row.status,
      application: JSON.parse(row.payload) } : null;
  }
  /** Esomoire sees references only, not customer, billing, contact or company proposal data. */
  readAdministrative(grant: unknown, candidateId: unknown): AdminProjection | null {
    const actor = this.auth(grant, "admin:read", candidateId);
    idValue(candidateId);
    const row = this.db.prepare(
      "SELECT status,projection FROM candidates WHERE tenant=? AND candidate=?"
    ).get(actor.tenant, candidateId) as { status: AdminProjection["recordState"]; projection: string } | undefined;
    if (!row) return null;
    const p = JSON.parse(row.projection) as ReturnType<typeof buildEsomoirePreview>;
    return {
      tenant: actor.tenant, candidateId, registryReference: p.registry.id,
      listingReference: p.listing.id, bookingReference: p.booking.id,
      recordState: row.status, listingState: "NOT_PUBLISHED", bookingState: "NOT_BOOKABLE",
      productLicenceGranted: false, customerPaymentVisible: false,
    };
  }
  withdraw(grant: unknown, candidateId: unknown): void {
    const actor = this.auth(grant, "candidate:withdraw", candidateId);
    idValue(candidateId);
    this.db.exec("BEGIN IMMEDIATE;");
    try {
      this.consumed(actor);
      const updated = this.db.prepare(
        "UPDATE candidates SET status='WITHDRAWN' " +
        "WHERE tenant=? AND candidate=? AND owner=? AND status='PREVIEW_ONLY'"
      ).run(actor.tenant, candidateId, actor.subject);
      if (updated.changes !== 1) deny("not owner, not found or already withdrawn");
      this.addEvent(actor, candidateId, "WITHDRAWN_SYNTHETIC");
      this.db.exec("COMMIT;");
    } catch (error) { this.db.exec("ROLLBACK;"); throw error; }
  }
  /** Local audit only. Not signed, notarized, River-acknowledged or cross-host verified. */
  verifyLocalAudit(tenant: unknown): boolean {
    if (!synthetic(tenant)) deny("synthetic tenant required");
    const entries = this.db.prepare(
      "SELECT candidate,actor,event,previous_digest,digest FROM lab_events WHERE tenant=? ORDER BY seq"
    ).all(tenant) as { candidate: string; actor: string; event: string;
      previous_digest: string; digest: string }[];
    let previous = "GENESIS-SYNTHETIC";
    for (const e of entries) {
      if (e.previous_digest !== previous ||
          digest(JSON.stringify([tenant, e.candidate, e.actor, e.event, previous])) !== e.digest) return false;
      previous = e.digest;
    }
    return true;
  }
}
