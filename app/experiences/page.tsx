import { ObjectCard } from "@/components/object-card";
import { PageIntro } from "@/components/page-intro";
import { getCreatorName, getExperiences, getSurfaceLabel, getWorkTitle } from "@/lib/registry/repository";

export default function ExperiencesPage() {
  return (
    <>
      <PageIntro eyebrow="Experiences" title="Works become executable packages.">An Experience is the distribution object. Runtime deployments are projections of it, while third-party platforms retain authority over their own execution.</PageIntro>
      <section className="section"><div className="shell"><div className="grid two">
        {getExperiences().map((experience) => <ObjectCard key={experience.id} kind="Experience · Example" title={experience.name} summary={experience.summary} status={experience.publicationState} meta={[{label:"Creator",value:getCreatorName(experience.creatorId)},{label:"Source",value:experience.workIds.map(getWorkTitle).join(", ")},{label:"Package",value:experience.packageState},{label:"Surfaces",value:experience.surfaces.map(getSurfaceLabel).join(" · ")}]} />)}
      </div><p className="notice" style={{marginTop:24}}>VRChat is shown as the first reference execution surface. The R0.1 website does not implement or claim an operational VRChat Unity adapter.</p></div></section>
    </>
  );
}
