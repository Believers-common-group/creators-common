import { ObjectCard } from "@/components/object-card";
import { PageIntro } from "@/components/page-intro";
import { getCreatorName, getWorks } from "@/lib/registry/repository";

export default function WorksPage() {
  return (
    <>
      <PageIntro eyebrow="Works" title="Provenance before distribution.">Works are creative source objects with public provenance state. Attribution here is not a substitute for legal ownership evidence.</PageIntro>
      <section className="section"><div className="shell"><div className="grid two">
        {getWorks().map((work) => <ObjectCard key={work.id} kind="Work · Example" title={work.title} summary={work.summary} status={work.provenanceState} meta={[{label:"Creator",value:getCreatorName(work.creatorId)},{label:"Category",value:work.category},{label:"Provenance",value:"Demonstration registry projection"}]} />)}
      </div></div></section>
    </>
  );
}
