import { ObjectCard } from "@/components/object-card";
import { PageIntro } from "@/components/page-intro";

const boundaries = [
  ["Genesis / Registry", "Canonical object and relationship records when integrated.", "Canonical"],
  ["DigitalMe", "Actor identity relationship; a public creator profile does not replace it.", "Identity"],
  ["Warden", "Admission and authority decisions. The website does not issue Warden authority.", "Authority"],
  ["River", "Evidence preservation when integrated. No unauthenticated client writes occur in R0.1.", "Evidence"],
  ["Creators Common", "Public creator operating and distribution projection.", "Projection"],
  ["Execution platforms", "Authoritative for their own runtime behavior and native commerce.", "Runtime"],
] as const;

export default function RegistryPage() {
  return (
    <>
      <PageIntro eyebrow="Registry" title="Authority stays explicit.">Creators Common makes object relationships visible without collapsing identity, governance, evidence, and runtime authority into one website.</PageIntro>
      <section className="section"><div className="shell"><div className="grid">
        {boundaries.map(([title, summary, status]) => <ObjectCard key={title} kind="Authority boundary" title={title} summary={summary} status={status} />)}
      </div></div></section>
    </>
  );
}
