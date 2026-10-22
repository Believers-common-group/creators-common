import { fork, type ChildProcess } from "node:child_process";
import { createHash, generateKeyPairSync, sign, verify } from "node:crypto";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, describe, expect, it } from "vitest";
import { examplePilotApplication } from "../lib/programs/warden-pilot-esomoire-fixture";
import { SyntheticEsomoireRegistryLab } from "../lib/programs/warden-pilot-r09-lab";

const identity = generateKeyPairSync("ed25519");
const fixtureClock = 1792627200;
const subject = "EXAMPLE-PROVIDER-A";
const candidate = "EXAMPLE-PILOT-001";
const tenant = "EXAMPLE-TENANT-A";
let counter=0;
const dirs:string[]=[];
const registries:SyntheticEsomoireRegistryLab[]=[];
const children:ChildProcess[]=[];
const registryPath=(dir:string)=>join(dir,"registry.ipc-registry.synthetic.sqlite");
const custodyPath=(dir:string)=>join(dir,"custody.ipc-custody.synthetic.sqlite");
const hash=(s:string)=>createHash("sha256").update(s).digest("hex");
const applicationDigest=(t:string=tenant,s:string=subject,id:string=candidate)=>
  hash(JSON.stringify([t,id,s,JSON.stringify(examplePilotApplication)]));
const identityPem=identity.publicKey.export({type:"spki",format:"pem"}).toString();

function grant(override:Record<string,unknown>={}) {
  const claims={
    issuer:"EXAMPLE-LOCAL-LAB",audience:"CC-WARDEN-PILOT-R0.9-LAB",
    subject,tenant,resource:candidate,role:"pilot",action:"candidate:create",
    jti:"EXAMPLE-IPC-GRANT-"+String(++counter).padStart(4,"0"),
    iat:fixtureClock-1,exp:fixtureClock+120,...override,
  };
  const raw=Buffer.from(JSON.stringify(claims),"utf8");
  return {payload:raw.toString("base64url"),
    signature:sign(null,raw,identity.privateKey).toString("base64url")};
}
type WorkerResult=Record<string,unknown>;
let requests=0;
function call(child:ChildProcess, body:Record<string,unknown>):Promise<any> {
  const id=++requests;
  return new Promise((resolve,reject)=>{
    const timeout=setTimeout(()=>done(new Error("worker timeout")),8000);
    const onExit=()=>done(new Error("worker unexpectedly exited"));
    const onMessage=(p:unknown)=>{
      if(!p||typeof p!=="object"||(p as any).id!==id)return;
      const m=p as {ok:boolean;result?:any;error?:string};
      if(m.ok)done(null,m.result); else done(new Error(m.error??"worker denied"));
    };
    function done(error:Error|null, result?:any) {
      clearTimeout(timeout);child.off("message",onMessage);child.off("exit",onExit);
      if(error)reject(error); else resolve(result);
    }
    child.on("message",onMessage);child.once("exit",onExit);
    child.send({id,body},err=>{if(err)done(err)});
  });
}
function spawn(role:"custody"|"witness") {
  const worker=fork(join(process.cwd(),"scripts/warden-r11-custody-worker.mjs"),[],{
    env:{...process.env,R11_LAB_ROLE:role},
    stdio:["ignore","ignore","ignore","ipc"],execArgv:[],
  });
  children.push(worker);
  return worker;
}
function verifyReceipt(value:any,pem:string) {
  const raw=Buffer.from(value.payload,"base64url");
  expect(verify(null,raw,pem,value.signature?Buffer.from(value.signature,"base64url"):Buffer.alloc(0))).toBe(true);
  return JSON.parse(raw.toString("utf8"));
}
async function setup() {
  const dir=mkdtempSync(join(tmpdir(),"cc-r11-"));dirs.push(dir);
  const store=new SyntheticEsomoireRegistryLab(registryPath(dir),identity.publicKey,()=>fixtureClock);
  registries.push(store);
  const witness=spawn("witness");
  const w=await call(witness,{op:"init",path:registryPath(dir),clock:fixtureClock,
    identityPublicPem:identityPem});
  const custody=spawn("custody");
  const c=await call(custody,{op:"init",path:custodyPath(dir),clock:fixtureClock,
    identityPublicPem:identityPem,witnessPublicPem:w.publicKey});
  await call(witness,{op:"pinCustodyKey",custodyPublicPem:c.publicKey});
  return {dir,store,witness,custody,custodyPublicPem:c.publicKey as string,
    witnessPublicPem:w.publicKey as string,custodyPid:c.pid as number,witnessPid:w.pid as number};
}
afterEach(async()=>{
  for(const child of children.splice(0)) {
    if(child.connected)child.disconnect();
    if(child.exitCode===null)child.kill("SIGTERM");
  }
  for(const db of registries.splice(0)) {try{db.close()}catch{/* already closed */}}
  for(const dir of dirs.splice(0))rmSync(dir,{recursive:true,force:true});
});
describe("Warden R1.1 distinct-process synthetic custody/witness lab",()=>{
  it("runs custody and witness in distinct child processes",async()=>{
    const x=await setup();
    expect(x.custodyPid).not.toBe(x.witnessPid);
    expect(x.custodyPid).not.toBe(process.pid);
    expect(x.witnessPid).not.toBe(process.pid);
  });

  it("produces a witnessed commit only after independently reading the exact local effect",async()=>{
    const x=await setup(),g=grant();
    const reservation=await call(x.custody,{op:"reserve",candidateId:candidate,
      grant:g,effectDigest:applicationDigest()});
    expect(verifyReceipt(reservation,x.custodyPublicPem).state).toBe("RESERVED");
    await expect(call(x.witness,{op:"observe",candidateId:candidate,reservation}))
      .rejects.toThrow(/effect absent/);
    x.store.create(g,candidate,examplePilotApplication);
    const witnessed=await call(x.witness,{op:"observe",candidateId:candidate,reservation});
    expect(verifyReceipt(witnessed,x.witnessPublicPem).state).toBe("OBSERVED_LOCAL");
    const committed=await call(x.custody,{op:"commit",reservation,witness:witnessed});
    const claims=verifyReceipt(committed,x.custodyPublicPem);
    expect(claims.state).toBe("COMMITTED_OBSERVED");
    expect(claims.effectDigest).toBe(applicationDigest());
    expect(x.store.verifyLocalAudit(tenant)).toBe(true);
  });

  it("refuses to commit a fabricated success claim from the coordinator",async()=>{
    const x=await setup(),g=grant();
    const reservation=await call(x.custody,{op:"reserve",candidateId:candidate,
      grant:g,effectDigest:applicationDigest()});
    await expect(call(x.custody,{op:"commit",reservation,witness:{
      payload:reservation.payload,signature:reservation.signature,
    }})).rejects.toThrow(/signature/);
    const head=await call(x.custody,{op:"head",tenant,candidateId:candidate});
    expect(verifyReceipt(head,x.custodyPublicPem).state).toBe("RESERVED");
  });

  it("denies tampered local effect, wrong owner and cross-tenant observation",async()=>{
    const x=await setup(),g=grant();
    const reservation=await call(x.custody,{op:"reserve",candidateId:candidate,
      grant:g,effectDigest:hash("wrong digest")});
    x.store.create(g,candidate,examplePilotApplication);
    await expect(call(x.witness,{op:"observe",candidateId:candidate,reservation}))
      .rejects.toThrow(/effect digest mismatch/);
    const other=grant({tenant:"EXAMPLE-TENANT-B",resource:"EXAMPLE-PILOT-002"});
    const otherReservation=await call(x.custody,{op:"reserve",candidateId:"EXAMPLE-PILOT-002",
      grant:other,effectDigest:applicationDigest("EXAMPLE-TENANT-B",subject,"EXAMPLE-PILOT-002")});
    await expect(call(x.witness,{op:"observe",candidateId:"EXAMPLE-PILOT-002",reservation:otherReservation}))
      .rejects.toThrow(/effect absent/);
  });

  it("separately checks provider authority before opening a reservation",async()=>{
    const x=await setup();
    const denied=[
      grant({role:"esomoire",action:"admin:read"}),
      grant({tenant:"REAL-COMPANY"}),
      grant({exp:fixtureClock}),
      grant({resource:"EXAMPLE-PILOT-002"}),
    ];
    for(const g of denied)await expect(call(x.custody,{op:"reserve",candidateId:candidate,
      grant:g,effectDigest:applicationDigest()})).rejects.toThrow();
    expect(await call(x.custody,{op:"head",tenant,candidateId:candidate})).toBeNull();
  });

  it("fails closed after revocation before reservation or before commit",async()=>{
    const x=await setup(),g=grant();
    const reservation=await call(x.custody,{op:"reserve",candidateId:candidate,
      grant:g,effectDigest:applicationDigest()});
    x.store.create(g,candidate,examplePilotApplication);
    const witnessed=await call(x.witness,{op:"observe",candidateId:candidate,reservation});
    await call(x.custody,{op:"revoke",tenant,subject});
    await expect(call(x.custody,{op:"commit",reservation,witness:witnessed}))
      .rejects.toThrow(/revoked/);
    await expect(call(x.custody,{op:"reserve",candidateId:"EXAMPLE-PILOT-002",
      grant:grant({resource:"EXAMPLE-PILOT-002"}),effectDigest:applicationDigest()}))
      .rejects.toThrow(/revoked/);
  });

  it("reports durable reserved head after lost ACK but never automatically repeats an effect",async()=>{
    const x=await setup(),g=grant();
    const reservation=await call(x.custody,{op:"reserve",candidateId:candidate,
      grant:g,effectDigest:applicationDigest()});
    x.store.create(g,candidate,examplePilotApplication);
    const witnessed=await call(x.witness,{op:"observe",candidateId:candidate,reservation});
    await call(x.custody,{op:"commit",reservation,witness:witnessed});
    // Simulated coordinator loses the response. A head query only inspects custody.
    const head=await call(x.custody,{op:"head",tenant,candidateId:candidate});
    expect(verifyReceipt(head,x.custodyPublicPem).state).toBe("COMMITTED_OBSERVED");
    await expect(call(x.custody,{op:"reserve",candidateId:candidate,
      grant:grant(),effectDigest:applicationDigest()})).rejects.toThrow(/already reserved/);
  });

  it("does not conflate an unobserved reservation with a completed registry effect",async()=>{
    const x=await setup(),g=grant();
    const reservation=await call(x.custody,{op:"reserve",candidateId:candidate,
      grant:g,effectDigest:applicationDigest()});
    expect(verifyReceipt(reservation,x.custodyPublicPem).state).toBe("RESERVED");
    const head=await call(x.custody,{op:"head",tenant,candidateId:candidate});
    expect(verifyReceipt(head,x.custodyPublicPem).state).toBe("RESERVED");
    await expect(call(x.witness,{op:"observe",candidateId:candidate,reservation}))
      .rejects.toThrow(/effect absent/);
  });

  it("cannot treat a restart with ephemeral receipt keys as trusted continuity",async()=>{
    const x=await setup(),g=grant();
    const reserve=await call(x.custody,{op:"reserve",candidateId:candidate,
      grant:g,effectDigest:applicationDigest()});
    const originalPublic=x.custodyPublicPem;
    x.custody.disconnect();x.custody.kill("SIGTERM");
    const restarted=spawn("custody");
    const c=await call(restarted,{op:"init",path:custodyPath(x.dir),clock:fixtureClock,
      identityPublicPem:identityPem,witnessPublicPem:x.witnessPublicPem});
    const recovered=await call(restarted,{op:"head",tenant,candidateId:candidate});
    expect(verifyReceipt(recovered,c.publicKey).state).toBe("RESERVED");
    expect(verify(null,Buffer.from(recovered.payload,"base64url"),
      originalPublic,Buffer.from(recovered.signature,"base64url"))).toBe(false);
    // The old reservation is signed by the original key; the restarted process fails closed.
    await expect(call(restarted,{op:"commit",reservation:reserve,
      witness:{payload:reserve.payload,signature:reserve.signature}})).rejects.toThrow();
  });

  it("rejects new request types that would give custodian a payment or licensing capability",async()=>{
    const x=await setup();
    for (const op of ["publish","pay","invoice","licence","book","registerRealCustomer"])
      await expect(call(x.custody,{op})).rejects.toThrow(/operation not available/);
  });

  it("cannot use witness to retrieve applicant personal or company records through IPC",async()=>{
    const x=await setup();
    for (const op of ["readApplicant","dumpRegistry","writeCandidate","listAll","readOwner"])
      await expect(call(x.witness,{op})).rejects.toThrow(/operation not available/);
  });
});
