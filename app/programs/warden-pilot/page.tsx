import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { WARDEN_PILOT, productionConditions, additionalThirdPartyRoles } from "@/lib/programs/warden-pilot";

export const metadata: Metadata = {
  title: "Warden Pilot Partners — Programme Preview",
  description: "Review the proposed Creators Common Warden pilot-partner programme. Applications, bookings, sales and pilot admission are not open.",
  alternates: { canonical: "/programs/warden-pilot" },
  robots: { index: false, follow: false },
};

export default function WardenPilotPage() {
  return (
    <>
      <PageIntro eyebrow="Creators Common · Proposed first Warden product pilot" title="Warden pilot partners.">
        Warden is being prepared as the first product pilot through Creators Common, with
        Virtual Silk Road (VSR) and DigitalMe included by default in the proposed entry experience.
      </PageIntro>
      <section className="section" aria-labelledby="warden-status">
        <div className="shell">
          <div className="notice" role="status">
            <strong id="warden-status">Programme preview — applications are not open.</strong>
            <p>This is an editorial proposal, not a general-availability announcement,
              licence offer, booking interface, pilot admission or authority grant.
              Approved application details, privacy notice and participation terms
              must be published before any recruitment or data collection starts.</p>
          </div>
          <p className="small">State: {WARDEN_PILOT.state} · Intake: {WARDEN_PILOT.intakeState}
            · Product: {WARDEN_PILOT.productState}</p>
        </div>
      </section>
      <section className="section" aria-labelledby="warden-offer">
        <div className="shell">
          <div className="section-head">
            <div><div className="eyebrow">Entry package · Proposed</div><h2 id="warden-offer">One coordinated entry.</h2></div>
            <div><p><strong>Warden + VSR + DigitalMe</strong> form the proposed default pilot package.
              Inclusion does not transfer underlying IP rights, force migration to Genesis,
              imply production readiness or authorize access to personal devices.</p>
              <p>The initial work is a bounded partner pilot. Creator participation,
                attribution and any compensation follow separately verified rights and written terms.
                Ongoing creator assistance, if requested, is a distinct monthly service engagement.</p></div>
          </div>
        </div>
      </section>
      <section className="section" aria-labelledby="warden-partners">
        <div className="shell">
          <div className="section-head">
            <div><div className="eyebrow">Partner model</div><h2 id="warden-partners">Pilot providers serve their own customers.</h2></div>
            <div><p>Marketing agencies, consultancies, technology teams and qualified service companies
              may be considered once applications are approved. Each admitted pilot company signs
              its own customer service agreement, delivers its permitted service and invoices
              its customer directly.</p>
              <p><strong>Esomoire</strong> is proposed to manage registry, marketplace listing,
                booking and agreed reporting references. It is not thereby the product owner,
                distributor, contracting pilot provider, invoice issuer or payment recipient.</p>
              <p>Esomoire receives only contractually agreed administrative information,
                subject to customer privacy, security and consent controls.</p></div>
          </div>
        </div>
      </section>
      <section className="section" aria-labelledby="warden-production">
        <div className="shell">
          <div className="section-head">
            <div><div className="eyebrow">Four production conditions</div><h2 id="warden-production">Independent stack and producer choices.</h2></div>
            <p>The technology stack and the responsible production source are separate axes.
              A third-party contribution is recorded independently; it does not replace a base classification.</p>
          </div>
          <div className="grid two">
            {productionConditions.map(({ code, stack, production }) => (
              <article className="card" key={code}>
                <div className="card-top"><span className="eyebrow">{code}</span>
                  <span className="status" data-state="planned">Proposed</span></div>
                <div><h3>{stack} stack + {production} production</h3>
                  <p>Rights, admission and responsible providers are verified for this configuration.</p></div>
              </article>
            ))}
          </div>
          <p className="small">Additional third-party participation may include: {additionalThirdPartyRoles.join("; ")}.</p>
        </div>
      </section>
      <section className="section" aria-labelledby="warden-guardrails">
        <div className="shell">
          <div className="section-head">
            <div><div className="eyebrow">Authority and evidence</div><h2 id="warden-guardrails">Publication is not permission.</h2></div>
            <div><p>DigitalMe identity and Warden authority are not issued by this website.
              Warden independently admits permitted actions; Synnergyze coordinates authorized workflows;
              ARKs execute admitted capabilities; River preserves permitted evidence.
              The Commons projection cannot grant operational authority.</p>
              <p>Quantum Arc is a separate later product. Quantum Room belongs to the
                device line and cannot be commercially released without its validated physical device.</p>
              <div className="notice">No customer registration, WhatsApp invitation,
                personal-data collection, payment, provider booking or live service is active here.</div>
            </div>
          </div>
          <div className="actions">
            <Link className="button secondary" href="/programs/warden-pilot/administration">Preview Esomoire administration (synthetic)</Link>
            <Link className="button secondary" href="/commons">Explore the Commons</Link>
            <Link className="button secondary" href="/about">About the estate</Link>
          </div>
        </div>
      </section>
    </>
  );
}
