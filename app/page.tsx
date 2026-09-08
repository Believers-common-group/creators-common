import Link from "next/link";
import { FlowRail } from "@/components/flow-rail";
import { ObjectCard } from "@/components/object-card";
import { getCreators, getExperiences, getWorks } from "@/lib/registry/repository";

export default function HomePage() {
  const [creator] = getCreators();
  const [work] = getWorks();
  const [experience] = getExperiences();

  return (
    <>
      <section className="hero">
        <div className="shell hero-grid">
          <div>
            <div className="eyebrow">Operating & distribution common</div>
            <h1>Creators Common</h1>
            <p className="lede">Create work. Establish provenance. Build experiences. Publish across worlds.</p>
            <div className="actions">
              <Link className="button primary" href="/discover">Explore the Common</Link>
              <Link className="button secondary" href="/studio">Enter as a Creator</Link>
              <Link className="button secondary" href="/experiences">Build an Experience</Link>
            </div>
          </div>
          <aside>
            <div className="notice">R0.1 is a public demonstration projection. It does not mint identity, issue Warden authority, or claim that platform adapters are live.</div>
          </aside>
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-head">
            <div><div className="eyebrow">System grammar</div><h2>From creator to surface.</h2></div>
            <p>Creators Common keeps the canonical creative relationship legible while runtime platforms remain authoritative for their own execution and native commerce.</p>
          </div>
          <FlowRail />
        </div>
      </section>

      <section className="section">
        <div className="shell">
          <div className="section-head">
            <div><div className="eyebrow">Example projection</div><h2>One chain, clearly typed.</h2></div>
            <p>Every record below is example data, deliberately marked as non-authoritative until a verified registry source replaces the fixture repository.</p>
          </div>
          <div className="grid">
            <ObjectCard kind="Creator · Example" title={creator.displayName} summary={creator.summary} status={creator.status} />
            <ObjectCard kind="Work · Example" title={work.title} summary={work.summary} status={work.provenanceState} />
            <ObjectCard kind="Experience · Example" title={experience.name} summary={experience.summary} status={experience.publicationState} />
          </div>
        </div>
      </section>
    </>
  );
}
