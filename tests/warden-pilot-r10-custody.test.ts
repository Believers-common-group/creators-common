import { generateKeyPairSync, sign } from "node:crypto";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { DatabaseSync } from "node:sqlite";
import { afterEach, describe, expect, it } from "vitest";
import { examplePilotApplication } from "../lib/programs/warden-pilot-esomoire-fixture";
import { SyntheticEsomoireRegistryLab } from "../lib/programs/warden-pilot-r09-lab";
import {
  R10_GATES, SyntheticCustodyFixture, inspectSyntheticRecovery,
  syntheticProtectedCreate, verifyCustodyReceipt,
} from "../lib/programs/warden-pilot-r10-custody";

const identityKeys = generateKeyPairSync("ed25519");
const custodyKeys = generateKeyPairSync("ed25519");
const time = 1792627200;
const tenant = "EXAMPLE-TENANT-A";
const otherTenant = "EXAMPLE-TENANT-B";
const subject = "EXAMPLE-PROVIDER-A";
const candidate = "EXAMPLE-PILOT-001";
let seq = 0;
const open: Array<{close:()=>void}> = [];
const dirs: string[] = [];
const register = <T extends {close:()=>void}>(v:T):T => { open.push(v); return v; };
function token(options: { tenant?: string; candidate?: string; role?: string;
  subject?: string; action?: string; jti?: string; expires?: number } = {}) {
  const claims = {
    issuer: "EXAMPLE-LOCAL-LAB", audience: "CC-WARDEN-PILOT-R0.9-LAB",
    subject: options.subject ?? subject, tenant: options.tenant ?? tenant,
    resource: options.candidate ?? candidate, role: options.role ?? "pilot",
    action: options.action ?? "candidate:create",
    jti: options.jti ?? "EXAMPLE-R10-GRANT-" + String(++seq).padStart(4,"0"),
    iat: time-2, exp: options.expires ?? time+120,
  };
  const bytes = Buffer.from(JSON.stringify(claims));
  return Object.freeze({ payload: bytes.toString("base64url"),
    signature: sign(null, bytes, identityKeys.privateKey).toString("base64url") });
}
const local = (path=":memory:") => register(new SyntheticEsomoireRegistryLab(
  path, identityKeys.publicKey, () => time));
const custody = (path=":memory:") => register(new SyntheticCustodyFixture(
  path, identityKeys.publicKey, custodyKeys.privateKey, custodyKeys.publicKey, () => time));
function scratch():string {
  const dir = mkdtempSync(join(tmpdir(),"cc-r10-"));
  dirs.push(dir); return dir;
}
afterEach(()=>{
  for(const x of open.splice(0).reverse()){try{x.close();}catch{/*already closed*/}}
  for(const d of dirs.splice(0)) rmSync(d,{recursive:true,force:true});
});
describe("Warden R1.0 synthetic custody and reconciliation",()=>{
  it("keeps every production activation flag false",()=>{
    expect(Object.values(R10_GATES).every(v=>v===false)).toBe(true);
    expect(Object.keys(R10_GATES)).toContain("independentRiverCustody");
  });

  it("reserves a grant at separate custody, then records and commits synthetic local effect",()=>{
    const c=custody(), l=local(), g=token();
    const r=syntheticProtectedCreate(c,l,g,candidate,examplePilotApplication);
    expect(r.state).toBe("COMMITTED_SYNTHETIC");
    expect(r.custodyCommit).not.toBeNull();
    expect(verifyCustodyReceipt(r.custodyReservation,custodyKeys.publicKey).state).toBe("RESERVED");
    expect(verifyCustodyReceipt(r.custodyCommit,custodyKeys.publicKey).state).toBe("COMMITTED");
    expect(c.verifyAgainstCustody(r.custodyReservation)).toBe(true);
    expect(l.readOwned(token({action:"candidate:read"}),candidate)?.status).toBe("PREVIEW_ONLY");
  });

  it("holds before local write when custody is unavailable",()=>{
    const c=custody(), l=local();
    c.simulateCustodyOutage(true);
    expect(()=>syntheticProtectedCreate(c,l,token(),candidate,examplePilotApplication))
      .toThrow(/custodian unavailable/);
    expect(l.readOwned(token({action:"candidate:read"}),candidate)).toBeNull();
    c.simulateCustodyOutage(false);
  });

  it("blocks reservation for revoked subjects",()=>{
    const c=custody(), l=local();
    c.revokeSyntheticSubject(tenant,subject);
    expect(()=>syntheticProtectedCreate(c,l,token(),candidate,examplePilotApplication)).toThrow(/revoked/);
    expect(l.readOwned(token({action:"candidate:read"}),candidate)).toBeNull();
  });

  it("blocks commit after revocation; local record may already exist, so still HOLD",()=>{
    const c=custody(), l=local(), g=token();
    const r=c.reserve(g,candidate,examplePilotApplication);
    l.create(g,candidate,examplePilotApplication);
    c.revokeSyntheticSubject(tenant,subject);
    expect(()=>c.commit(r)).toThrow(/revoked before commit/);
    expect(inspectSyntheticRecovery(c,r)).toBe("RESERVED_REQUIRES_REVIEW");
    expect(l.readOwned(token({action:"candidate:read"}),candidate)?.status).toBe("PREVIEW_ONLY");
  });

  it("does not conflate a crash before custody commit with a lost post-commit receipt",()=>{
    const a=custody(),b=local();
    const first=syntheticProtectedCreate(a,b,token(),candidate,examplePilotApplication,
      {simulateCrashBeforeCommit:true});
    expect(first.state).toBe("HOLD_UNRECONCILED");
    expect(first.custodyCommit).toBeNull();
    expect(inspectSyntheticRecovery(a,first.custodyReservation)).toBe("RESERVED_REQUIRES_REVIEW");

    const c=custody(),d=local();
    const second=syntheticProtectedCreate(c,d,token(),candidate,examplePilotApplication,
      {simulateLostPostCommitAck:true});
    expect(second.state).toBe("HOLD_UNRECONCILED");
    expect(second.custodyCommit).toBeNull();
    expect(inspectSyntheticRecovery(c,second.custodyReservation)).toBe("COMMITTED_REQUIRES_REVIEW");
    expect(()=>syntheticProtectedCreate(c,d,token(),candidate,examplePilotApplication)).toThrow(/already reserved/);
  });

  it("rejects replay of same grant and new grant for same candidate",()=>{
    const c=custody(),l=local();
    const g=token();
    syntheticProtectedCreate(c,l,g,candidate,examplePilotApplication);
    expect(()=>syntheticProtectedCreate(c,l,g,candidate,examplePilotApplication)).toThrow(/already reserved/);
    expect(()=>syntheticProtectedCreate(c,l,token(),candidate,examplePilotApplication)).toThrow(/already reserved/);
  });

  it("protects against local database deletion while separate custody persists",()=>{
    const dir=scratch();
    const lPath=join(dir,"registry.synthetic.sqlite");
    const cPath=join(dir,"fixture.custody.synthetic.sqlite");
    const l=local(lPath),c=custody(cPath);
    const g=token();
    const completed=syntheticProtectedCreate(c,l,g,candidate,examplePilotApplication);
    l.close();open.splice(open.indexOf(l),1);
    const attacker=new DatabaseSync(lPath);
    attacker.exec("DELETE FROM lab_events; DELETE FROM consumed_tokens; DELETE FROM candidates;");
    attacker.close();
    const recreated=local(lPath);
    expect(recreated.readOwned(token({action:"candidate:read"}),candidate)).toBeNull();
    expect(()=>syntheticProtectedCreate(c,recreated,g,candidate,examplePilotApplication)).toThrow(/already reserved/);
    expect(()=>syntheticProtectedCreate(c,recreated,token(),candidate,examplePilotApplication))
      .toThrow(/already reserved/);
    expect(c.verifyAgainstCustody(completed.custodyReservation)).toBe(true);
  });

  it("persists custody across reopen independent of the registry",()=>{
    const dir=scratch(), cPath=join(dir,"fixture.custody.synthetic.sqlite");
    const c=custody(cPath),l=local();
    const done=syntheticProtectedCreate(c,l,token(),candidate,examplePilotApplication);
    c.close();open.splice(open.indexOf(c),1);
    const reopened=custody(cPath);
    expect(reopened.verifyAgainstCustody(done.custodyReservation)).toBe(true);
    expect(verifyCustodyReceipt(reopened.attestSyntheticHead(tenant,candidate),custodyKeys.publicKey).state)
      .toBe("COMMITTED");
    expect(()=>reopened.reserve(token(),candidate,examplePilotApplication)).toThrow(/already reserved/);
  });

  it("separates identical candidate references across synthetic tenant namespaces",()=>{
    const c=custody(), a=local();
    syntheticProtectedCreate(c,a,token(),candidate,examplePilotApplication);
    syntheticProtectedCreate(c,a,token({tenant:otherTenant}),candidate,examplePilotApplication);
    const head=c.attestSyntheticHead(otherTenant,candidate);
    expect(verifyCustodyReceipt(head,custodyKeys.publicKey).tenant).toBe(otherTenant);
  });

  it("enforces signed tenant/resource and role constraints rather than caller declarations",()=>{
    const c=custody();
    expect(()=>c.reserve(token({candidate:"EXAMPLE-PILOT-002"}),candidate,examplePilotApplication))
      .toThrow(/create intent/);
    expect(()=>c.reserve(token({role:"esomoire",action:"admin:read"}),candidate,examplePilotApplication))
      .toThrow(/create intent/);
    expect(()=>c.reserve(token({expires:time}),candidate,examplePilotApplication)).toThrow();
    expect(c.attestSyntheticHead(tenant,candidate)).toBeNull();
  });

  it("rejects falsified or incorrectly signed custody acknowledgements",()=>{
    const c=custody(),g=token();
    const r=c.reserve(g,candidate,examplePilotApplication);
    const wrongKey=generateKeyPairSync("ed25519");
    expect(()=>verifyCustodyReceipt(r,wrongKey.publicKey)).toThrow();
    const changedRaw=Buffer.from(r.payload,"base64url").toString("utf8")
      .replace("RESERVED","COMMITTED");
    expect(()=>verifyCustodyReceipt({...r,payload:Buffer.from(changedRaw).toString("base64url")},
      custodyKeys.publicKey)).toThrow(/altered/);
    expect(()=>verifyCustodyReceipt({...r,signature:"not+base64"},custodyKeys.publicKey)).toThrow();
    expect(()=>c.commit({...r,payload:Buffer.from(changedRaw).toString("base64url")}))
      .toThrow(/altered/);
    expect(c.commit(r)).toBeDefined();
    expect(()=>c.commit(r)).toThrow(/already committed/);
  });

  it("does not treat a custody signature as proof that an external effect occurred",()=>{
    const c=custody();
    // Intentionally commit with NO local Registry write. An important known lab limitation.
    const r=c.reserve(token(),candidate,examplePilotApplication);
    const ack=c.commit(r);
    expect(verifyCustodyReceipt(ack,custodyKeys.publicKey).state).toBe("COMMITTED");
    const l=local();
    expect(l.readOwned(token({action:"candidate:read"}),candidate)).toBeNull();
  });

  it("holds after post-write custodian outage, without retrying a prior effect",()=>{
    const c=custody(),l=local(),g=token();
    const r=c.reserve(g,candidate,examplePilotApplication);
    l.create(g,candidate,examplePilotApplication);
    c.simulateCustodyOutage(true);
    expect(()=>c.commit(r)).toThrow(/unavailable/);
    expect(()=>inspectSyntheticRecovery(c,r)).toThrow(/unavailable/);
    expect(l.readOwned(token({action:"candidate:read"}),candidate)).not.toBeNull();
    c.simulateCustodyOutage(false);
    expect(inspectSyntheticRecovery(c,r)).toBe("RESERVED_REQUIRES_REVIEW");
  });

  it("detects a wiped custody row against a previously held signed reservation",()=>{
    const dir=scratch(),cPath=join(dir,"fixture.custody.synthetic.sqlite");
    const c=custody(cPath),r=c.reserve(token(),candidate,examplePilotApplication);
    c.close();open.splice(open.indexOf(c),1);
    const attacker=new DatabaseSync(cPath);
    attacker.exec("DELETE FROM custody_claims;");
    attacker.close();
    const reopened=custody(cPath);
    expect(reopened.verifyAgainstCustody(r)).toBe(false);
    expect(inspectSyntheticRecovery(reopened,r)).toBe("CUSTODY_MISSING_HOLD");
  });

  it("admits the known failure: custody-store deletion permits re-reservation",()=>{
    const dir=scratch(),path=join(dir,"fixture.custody.synthetic.sqlite");
    const c=custody(path),g=token();
    const prior=c.reserve(g,candidate,examplePilotApplication);
    c.close();open.splice(open.indexOf(c),1);
    const attacker=new DatabaseSync(path);
    attacker.exec("DELETE FROM custody_claims; DELETE FROM subject_revocations;");
    attacker.close();
    const restored=custody(path);
    expect(restored.verifyAgainstCustody(prior)).toBe(false);
    expect(()=>restored.reserve(g,candidate,examplePilotApplication)).not.toThrow();
  });

  it("rejects real applicant changes and refuses a non-synthetic custody path",()=>{
    const c=custody();
    const modified=structuredClone(examplePilotApplication) as any;
    modified.company.displayName="REAL CORPORATION PRIVATE LTD";
    expect(()=>c.reserve(token(),candidate,modified)).toThrow(/synthetic/);
    expect(()=>custody("/var/lib/pilot.db")).toThrow(/custody lab path/);
  });
});
