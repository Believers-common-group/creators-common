import { ObjectCard } from "@/components/object-card";
import { PageIntro } from "@/components/page-intro";

const programs = [
  ["Creator × Creator", "Joint Works and Experiences with explicit attribution and provenance relationships."],
  ["Creator × Brand", "Governed activations that keep creative Work, Experience, and commercial runtime roles distinct."],
  ["Creator × Venue / Event", "Time- and place-bounded Experiences that can project into admitted physical or spatial surfaces."],
  ["Creator × Execution Platform", "Platform-specific publication packages without transferring canonical creator authority to the runtime."],
] as const;

export default function CommonsPage() {
  return (
    <>
      <PageIntro eyebrow="Commons" title="Collaboration without a social graph.">The Common organizes programs and production relationships. R0.1 intentionally introduces no follower graph, feed, messaging, or engagement scoring.</PageIntro>
      <section className="section"><div className="shell"><div className="grid two">
        {programs.map(([title, summary]) => <ObjectCard key={title} kind="Collaboration pattern" title={title} summary={summary} status="Planned" />)}
      </div></div></section>
    </>
  );
}
