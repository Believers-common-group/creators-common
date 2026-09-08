import { FlowRail } from "@/components/flow-rail";
import { PageIntro } from "@/components/page-intro";

export default function AboutPage() {
  return (
    <>
      <PageIntro eyebrow="About" title="One creative relationship, many admitted surfaces.">Creators Common is the public creator and distribution surface within the connected estate. It avoids duplicating identity, authority, evidence, or third-party runtime systems.</PageIntro>
      <section className="section"><div className="shell"><div className="section-head"><div><div className="eyebrow">Non-duplication</div><h2>Use the right authority.</h2></div><p>Believers Common and Virtual Silk Road remain connected estate surfaces. Creators Common specializes in creator, Work, Experience, and execution-surface relationships; Warden remains the authority boundary.</p></div><FlowRail /><div className="actions"><a className="button secondary" href="https://believerscommon.com" rel="noopener noreferrer">Believers Common</a><a className="button secondary" href="https://virtualsilkroad.com" rel="noopener noreferrer">Virtual Silk Road</a></div></div></section>
    </>
  );
}
