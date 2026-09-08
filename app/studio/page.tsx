import { PageIntro } from "@/components/page-intro";

const steps = [
  ["Establish creator relationship", "Resolve the creator relationship without treating this browser session as identity authority."],
  ["Register a Work", "Create or resolve a canonical Work record and its provenance relationship."],
  ["Create an Experience Package", "Package the Work into an executable or interactive distribution object."],
  ["Select an execution surface", "Choose an admitted target such as a platform runtime, Web surface, or VSR Room."],
  ["Qualify publication", "Apply the relevant Warden admission and evidence requirements outside this public client."],
  ["Publish through the platform adapter", "Project the admitted Experience into the third-party or estate runtime while preserving platform authority."],
] as const;

export default function StudioPage() {
  return (
    <>
      <PageIntro eyebrow="Studio" title="Prepare work for governed publication.">R0.1 Studio explains the operating sequence. It does not yet create accounts, mint DigitalMe identities, mutate the registry, or call Warden.</PageIntro>
      <section className="section"><div className="shell"><div className="steps">
        {steps.map(([title, copy]) => <article className="step" key={title}><div><h3>{title}</h3><p>{copy}</p></div></article>)}
      </div><div className="actions"><span className="button secondary" aria-disabled="true">Start qualification · workflow not yet active</span></div></div></section>
    </>
  );
}
