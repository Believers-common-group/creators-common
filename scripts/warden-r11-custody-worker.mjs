/**
 * R1.1 synthetic lab worker. Fork twice with R11_LAB_ROLE=custody|witness.
 * IPC is a test-parent channel, NOT an authenticated production transport.
 * Separate processes, same OS user/host; no independent custody assertion.
 */
import { createHash, generateKeyPairSync, createPublicKey, sign, verify } from "node:crypto";
import { DatabaseSync } from "node:sqlite";

const role = process.env.R11_LAB_ROLE;
if (role !== "custody" && role !== "witness") process.exit(71);
const claimPattern = /^EXAMPLE-[A-Z0-9]+(?:-[A-Z0-9]+)*$/;
let db, publicKey, privateKey, identityKey, witnessKey, ready = false;
let clock = 0;

function deny(reason) { throw Error("R1.1_HOLD: " + reason); }
function validateId(v) {
  if (typeof v !== "string" || v.length > 70 || !claimPattern.test(v)) deny("synthetic ID required");
}
function plain(v) {
  return v !== null && typeof v === "object" && !Array.isArray(v) &&
    (Object.getPrototypeOf(v) === Object.prototype || Object.getPrototypeOf(v) === null);
}
function exact(v, keys) {
  if (!plain(v) || Object.keys(v).sort().join("|") !== [...keys].sort().join("|")) {
    deny("invalid envelope/claims");
  }
}
function decode(s, limit=4096) {
  if (typeof s !== "string" || !s.length || s.length > limit || !/^[A-Za-z0-9_-]+$/.test(s)) deny("invalid encoding");
  const b = Buffer.from(s, "base64url");
  if (b.toString("base64url") !== s) deny("noncanonical base64url");
  return b;
}
function signingKey(pem) {
  if (typeof pem !== "string" || pem.length > 2000) deny("invalid pinned public key");
  const key = createPublicKey(pem);
  if (key.asymmetricKeyType !== "ed25519") deny("Ed25519 required");
  return key;
}
function sha(s) { return createHash("sha256").update(s).digest("hex"); }
function signClaim(obj) {
  const b = Buffer.from(JSON.stringify(obj), "utf8");
  return { payload: b.toString("base64url"),
    signature: sign(null,b,privateKey).toString("base64url") };
}
function verifySigned(signed, key, keys) {
  exact(signed,["payload","signature"]);
  const bytes = decode(signed.payload), signature = decode(signed.signature,200);
  if (signature.length !== 64) deny("signature length");
  let obj;
  try { obj=JSON.parse(bytes.toString("utf8")); } catch { deny("JSON invalid"); }
  exact(obj,keys);
  if (JSON.stringify(obj) !== bytes.toString("utf8")) deny("noncanonical JSON");
  if (!verify(null,bytes,key,signature)) deny("untrusted signature");
  return obj;
}
const grantKeys=["issuer","audience","subject","tenant","resource","role","action","jti","iat","exp"];
function validateGrant(grant,candidate) {
  const claims=verifySigned(grant,identityKey,grantKeys);
  if (claims.issuer!=="EXAMPLE-LOCAL-LAB" || claims.audience!=="CC-WARDEN-PILOT-R0.9-LAB" ||
      claims.role!=="pilot" || claims.action!=="candidate:create" || claims.resource!==candidate) deny("grant scope denied");
  for (const k of ["tenant","subject","resource","jti"]) validateId(claims[k]);
  if (!Number.isSafeInteger(claims.iat)||!Number.isSafeInteger(claims.exp)||
      claims.iat>clock||claims.exp<=clock||claims.exp<=claims.iat||claims.exp-claims.iat>300) deny("grant lifetime");
  return claims;
}
const fields=["kind","version","tenant","candidateId","subject","jti","effectDigest","state","observedAt"];
function verifyReceipt(receipt,key,kind) {
  const c=verifySigned(receipt,key,fields);
  if (c.kind!==kind || c.version!=="R1.1" || !Number.isSafeInteger(c.observedAt) ||
      typeof c.effectDigest!=="string"||!/^[a-f0-9]{64}$/.test(c.effectDigest)) deny("invalid receipt");
  for(const k of ["tenant","candidateId","subject","jti"]) validateId(c[k]);
  if (kind==="EXAMPLE-CUSTODY-IPC" && !["RESERVED","COMMITTED_OBSERVED"].includes(c.state)) deny("unknown custody state");
  if (kind==="EXAMPLE-WITNESS-IPC" && c.state!=="OBSERVED_LOCAL") deny("unknown witness state");
  return c;
}
function snapshot(row,kind,state) {
  return signClaim({kind,version:"R1.1",tenant:row.tenant,candidateId:row.candidate,
    subject:row.subject,jti:row.jti,effectDigest:row.digest,
    state,observedAt:clock});
}
function init(msg) {
  if(ready) deny("already initialized");
  exact(msg,["op","path","clock","identityPublicPem",...(role==="custody"?["witnessPublicPem"]:[])]);
  if(!Number.isSafeInteger(msg.clock)) deny("invalid fixture clock");
  clock=msg.clock;
  identityKey=signingKey(msg.identityPublicPem);
  const suffix=role==="custody"?".ipc-custody.synthetic.sqlite":".ipc-registry.synthetic.sqlite";
  if(typeof msg.path!=="string"||!msg.path.endsWith(suffix)) deny("fixture path required");
  if(role==="custody") {
    witnessKey=signingKey(msg.witnessPublicPem);
    db=new DatabaseSync(msg.path);
    db.exec("PRAGMA busy_timeout=2500; PRAGMA foreign_keys=ON");
    db.exec("CREATE TABLE IF NOT EXISTS custody ("+
      "tenant TEXT NOT NULL, candidate TEXT NOT NULL, subject TEXT NOT NULL,"+
      "jti TEXT NOT NULL UNIQUE, digest TEXT NOT NULL, state TEXT NOT NULL CHECK(state IN ('RESERVED','COMMITTED_OBSERVED')),"+
      "PRIMARY KEY(tenant,candidate)) STRICT;"+
      "CREATE TABLE IF NOT EXISTS revoked (tenant TEXT NOT NULL, subject TEXT NOT NULL,"+
      "PRIMARY KEY(tenant,subject)) STRICT;");
  } else {
    // A separate process observes the R0.9 registry in read-only mode.
    db=new DatabaseSync(msg.path,{readOnly:true});
    db.exec("PRAGMA query_only=ON; PRAGMA busy_timeout=2500");
  }
  const keys=generateKeyPairSync("ed25519");publicKey=keys.publicKey;privateKey=keys.privateKey;
  ready=true;
  return {role,publicKey:publicKey.export({type:"spki",format:"pem"}),pid:process.pid,
    keyPersistence:false,productionIdentity:false};
}
function reserve(msg) {
  exact(msg,["op","candidateId","grant","effectDigest"]);
  validateId(msg.candidateId);
  if (typeof msg.effectDigest!=="string"||!/^[a-f0-9]{64}$/.test(msg.effectDigest)) deny("invalid effect digest");
  const c=validateGrant(msg.grant,msg.candidateId);
  db.exec("BEGIN IMMEDIATE");
  try {
    if(db.prepare("SELECT 1 FROM revoked WHERE tenant=? AND subject=?").get(c.tenant,c.subject)) deny("revoked");
    if(db.prepare("SELECT 1 FROM custody WHERE jti=? OR (tenant=? AND candidate=?)")
      .get(c.jti,c.tenant,msg.candidateId)) deny("already reserved");
    db.prepare("INSERT INTO custody(tenant,candidate,subject,jti,digest,state) VALUES (?,?,?,?,?,'RESERVED')")
      .run(c.tenant,msg.candidateId,c.subject,c.jti,msg.effectDigest);
    db.exec("COMMIT");
  } catch(e) { db.exec("ROLLBACK");throw e; }
  return snapshot({tenant:c.tenant,candidate:msg.candidateId,subject:c.subject,jti:c.jti,digest:msg.effectDigest},
    "EXAMPLE-CUSTODY-IPC","RESERVED");
}
let pinnedCustodyKey;
function witnessObserve(msg) {
  exact(msg,["op","candidateId","reservation"]);
  const c=verifyReceipt(msg.reservation,pinnedCustodyKey,"EXAMPLE-CUSTODY-IPC");
  if(c.state!=="RESERVED"||c.candidateId!==msg.candidateId)deny("reservation mismatch");
  const row=db.prepare("SELECT owner,payload,status FROM candidates WHERE tenant=? AND candidate=?")
    .get(c.tenant,c.candidateId);
  if(!row||row.status!=="PREVIEW_ONLY"||row.owner!==c.subject)deny("effect absent or wrong owner");
  // Read the durable effect from a different process; never accept a caller's success claim.
  const digest=sha(JSON.stringify([c.tenant,c.candidateId,c.subject,row.payload]));
  if(digest!==c.effectDigest)deny("effect digest mismatch");
  return snapshot({tenant:c.tenant,candidate:c.candidateId,subject:c.subject,
    jti:c.jti,digest},"EXAMPLE-WITNESS-IPC","OBSERVED_LOCAL");
}
function custodyCommit(msg) {
  exact(msg,["op","reservation","witness"]);
  const c=verifyReceipt(msg.reservation,publicKey,"EXAMPLE-CUSTODY-IPC");
  const w=verifyReceipt(msg.witness,witnessKey,"EXAMPLE-WITNESS-IPC");
  if(c.state!=="RESERVED"||c.tenant!==w.tenant||c.candidateId!==w.candidateId||
    c.subject!==w.subject||c.jti!==w.jti||c.effectDigest!==w.effectDigest)deny("witness mismatch");
  db.exec("BEGIN IMMEDIATE");
  let row;
  try {
    row=db.prepare("SELECT tenant,candidate,subject,jti,digest,state FROM custody WHERE tenant=? AND candidate=?")
      .get(c.tenant,c.candidateId);
    if(!row||row.state!=="RESERVED"||row.jti!==c.jti||row.digest!==c.effectDigest)deny("reservation not active");
    if(db.prepare("SELECT 1 FROM revoked WHERE tenant=? AND subject=?").get(c.tenant,c.subject))deny("subject revoked");
    db.prepare("UPDATE custody SET state='COMMITTED_OBSERVED' WHERE tenant=? AND candidate=?")
      .run(c.tenant,c.candidateId);
    db.exec("COMMIT");
  }catch(e){db.exec("ROLLBACK");throw e;}
  return snapshot(row,"EXAMPLE-CUSTODY-IPC","COMMITTED_OBSERVED");
}
function head(msg) {
  exact(msg,["op","tenant","candidateId"]);
  validateId(msg.tenant);validateId(msg.candidateId);
  const row=db.prepare("SELECT tenant,candidate,subject,jti,digest,state FROM custody WHERE tenant=? AND candidate=?")
    .get(msg.tenant,msg.candidateId);
  return row?snapshot(row,"EXAMPLE-CUSTODY-IPC",row.state):null;
}
function revoke(msg) {
  exact(msg,["op","tenant","subject"]);
  validateId(msg.tenant);validateId(msg.subject);
  db.prepare("INSERT OR IGNORE INTO revoked(tenant,subject) VALUES (?,?)").run(msg.tenant,msg.subject);
  return {revoked:true}; // test-parent operator, not an authenticated public control
}
function setCustodyPublicKey(msg) {
  exact(msg,["op","custodyPublicPem"]);
  if(pinnedCustodyKey)deny("already pinned");
  pinnedCustodyKey=signingKey(msg.custodyPublicPem);
  return {pinned:true};
}
function handle(msg) {
  if(!plain(msg)||typeof msg.op!=="string")deny("invalid IPC request");
  if(!ready) return msg.op==="init"?init(msg):deny("not initialized");
  if(msg.op==="init")deny("duplicate initialization");
  if(role==="custody") {
    if(msg.op==="reserve")return reserve(msg);
    if(msg.op==="commit")return custodyCommit(msg);
    if(msg.op==="head")return head(msg);
    if(msg.op==="revoke")return revoke(msg);
  } else {
    if(msg.op==="pinCustodyKey")return setCustodyPublicKey(msg);
    if(msg.op==="observe") {
      if(!pinnedCustodyKey)deny("custody key not pinned");
      return witnessObserve(msg);
    }
  }
  deny("operation not available to this process");
}
process.on("message", (packet) => {
  const id = packet?.id;
  try {
    if(!Number.isSafeInteger(id)||id<1||!plain(packet)||!plain(packet.body)||
      JSON.stringify(packet).length>32768) deny("malformed or oversized IPC request");
    const result=handle(packet.body);
    process.send?.({id,ok:true,result});
  } catch(e) {
    process.send?.({id:Number.isSafeInteger(id)?id:0,ok:false,
      error:String(e?.message??"unknown").slice(0,250)});
  }
});
process.on("disconnect",()=>{ try{db?.close()}catch{}; process.exit(0); });
