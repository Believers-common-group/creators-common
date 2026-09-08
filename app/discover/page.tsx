import { ObjectCard } from "@/components/object-card";
import { PageIntro } from "@/components/page-intro";
import { getCreatorName, getCreators, getExperiences, getWorks } from "@/lib/registry/repository";

export default function DiscoverPage() {
  const creators = getCreators();
  const works = getWorks();
  const experiences = getExperiences();
  return (
    <>
      <PageIntro eyebrow="Discover" title="Navigate the Common.">Browse demonstration Creators, Works, and Experiences as typed public objects rather than an undifferentiated social feed.</PageIntro>
      <section className="section"><div className="shell"><div className="grid">
        {creators.map((item) => <ObjectCard key={item.id} kind="Creator · Example" title={item.displayName} summary={item.summary} status={item.status} meta={[{label:"Category",value:item.category}]} />)}
        {works.map((item) => <ObjectCard key={item.id} kind="Work · Example" title={item.title} summary={item.summary} status={item.provenanceState} meta={[{label:"Creator",value:getCreatorName(item.creatorId)}]} />)}
        {experiences.map((item) => <ObjectCard key={item.id} kind="Experience · Example" title={item.name} summary={item.summary} status={item.publicationState} meta={[{label:"Creator",value:getCreatorName(item.creatorId)}]} />)}
      </div></div></section>
    </>
  );
}
