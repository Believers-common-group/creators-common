import { ObjectCard } from "@/components/object-card";
import { PageIntro } from "@/components/page-intro";
import { getCreators } from "@/lib/registry/repository";

export default function CreatorsPage() {
  return (
    <>
      <PageIntro eyebrow="Creators" title="Public creator projections.">A creator profile is a public operating record, not a DigitalMe identity record. Private identity attributes are outside this R0.1 surface.</PageIntro>
      <section className="section"><div className="shell"><div className="grid two">
        {getCreators().map((creator) => <ObjectCard key={creator.id} kind="Creator · Example" title={creator.displayName} summary={creator.summary} status={creator.status} meta={[{label:"Category",value:creator.category},{label:"Works",value:String(creator.workIds.length)},{label:"Experiences",value:String(creator.experienceIds.length)}]} />)}
      </div></div></section>
    </>
  );
}
