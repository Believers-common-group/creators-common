import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { buildEsomoirePreview } from "@/lib/programs/warden-pilot-esomoire";
import { examplePilotApplication } from "@/lib/programs/warden-pilot-esomoire-fixture";

export const metadata: Metadata = {
  title: "Esomoire Administrative Preview — Warden Pilot",
  description: "Synthetic demonstration of Esomoire registry, listing and booking references, without live intake.",
  alternates: { canonical: "/programs/warden-pilot/administration" },
  robots: { index: false, follow: false },
};

const view = buildEsomoirePreview(examplePilotApplication, "EXAMPLE-PILOT-001");

const items = [
  ["Registry", view.registry.id, view.registry.status,
    "Administrative reference only. Not ownership evidence or a grant of pilot rights."],
  ["Listing", view.listing.id, view.listing.status,
    "Proposed marketplace listing reference. Not publicly published or available for sale."],
  ["Booking", view.booking.id, view.booking.status,
    "Proposed booking reference. No time reserved, client identified or service confirmed."],
] as const;

export default function EsomoireAdministrationPreviewPage() {
  return (
    <>
      <PageIntro eyebrow="Creators Common · Esomoire · R0.8 synthetic preview"
        title="Registry. Listings. Bookings.">
        Review how an independent pilot partner could be represented in an Esomoire administrative
        record without shifting customer billing, product ownership or execution authority.
      </PageIntro>
      <section className="section" aria-labelledby="preview-status">
        <div className="shell">
          <div className="notice" role="status">
            <strong id="preview-status">Synthetic demonstration only — applications are closed.</strong>
            <p>No business registration, application, listing publication, booking confirmation,
              licence, invoice, payment or live Warden action is created by this preview.</p>
          </div>
          <div className="section-head">
            <div><div className="eyebrow">Example company</div><h2>{view.candidate.company}</h2></div>
            <div>
              <p><strong>Proposed work:</strong> {view.candidate.title}</p>
              <p><strong>Stack/production classification:</strong> {view.candidate.productionCode}</p>
              <p><strong>Additional third-party participation:</strong> {view.candidate.additionalThirdPartyRoles.join(", ")}</p>
              <p><strong>Entry package:</strong> {view.candidate.productPackage.join(" + ")}</p>
              <p className="small">Candidate admission: {view.candidate.pilotAdmission}. Licence: {view.candidate.licenceStatus}.</p>
            </div>
          </div>
        </div>
      </section>
      <section className="section" aria-labelledby="preview-links">
        <div className="shell">
          <div className="section-head">
            <div><div className="eyebrow">Esomoire administration</div><h2 id="preview-links">Linked, not transacted.</h2></div>
            <p>These identifiers exist only in this example. No external registry, public marketplace,
              calendar, customer account or financial system is connected.</p>
          </div>
          <div className="grid">
            {items.map(([label, id, state, explanation]) => (
              <article className="card" key={id}>
                <div className="card-top"><span className="eyebrow">{label}</span>
                  <span className="status" data-state="planned">{state.replaceAll("_", " ")}</span></div>
                <div><h3>{id}</h3><p>{explanation}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section" aria-labelledby="preview-separation">
        <div className="shell">
          <div className="section-head">
            <div><div className="eyebrow">Commercial and technical separation</div>
              <h2 id="preview-separation">The pilot provider remains independent.</h2></div>
            <div>
              <p>The independent pilot company would contract with and invoice its own customer.
                Esomoire is not the invoice issuer or payment recipient and has no automatic view
                into customer transactions.</p>
              <p>DigitalMe identity issuance, Warden action admission, River evidence issuance
                and operational authority are not provided by this page.</p>
              <div className="notice">Every approval gate remains on HOLD. Changing a listing,
                registry or booking reference does not open intake or authorize execution.</div>
              <div className="actions">
                <Link className="button secondary" href="/programs/warden-pilot">Back to Warden programme</Link>
                <Link className="button secondary" href="/commons">Visit Commons</Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
