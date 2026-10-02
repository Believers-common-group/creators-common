import type { Metadata } from "next";
import Link from "next/link";
import { PageIntro } from "@/components/page-intro";
import { proposedHeroMissions } from "@/lib/programs/byoh";

export const metadata: Metadata = {
  title: "Be Your Own Hero — Creator, Engineering & Innovation Programme",
  description:
    "Explore the proposed Be Your Own Hero programme at Creators Common: multidisciplinary missions, design, engineering, shared resource collaboration and creative projects.",
  alternates: { canonical: "/programs/be-your-own-hero" },
  robots: { index: true, follow: true },
};

const entryRoutes = [
  ["I have an idea", "Bring an invention, product, venture or creative concept needing collaborators."],
  ["I have a skill", "Contribute design, engineering, research, services, making or professional expertise."],
  ["I have resources", "Offer available facilities, equipment, mentoring, compute or specialist capability."],
  ["I have a challenge", "Propose an institutional, industrial, social or commercial problem to solve."],
] as const;

const disciplines = [
  "Engineers and inventors", "Designers and architects", "Researchers and educators",
  "Artists, filmmakers and writers", "Manufacturers and makers", "Business and service professionals",
  "Technicians and trades", "Students and career changers",
] as const;

export default function BeYourOwnHeroPage() {
  return (
    <>
      <PageIntro eyebrow="Creators Common · Proposed flagship programme" title="Be Your Own Hero.">
        Imagine it. Build it. Prove it. Own your contribution. A shared world of opportunities
        for people who create, build, solve and contribute across professions.
      </PageIntro>
      <section className="section" aria-labelledby="byoh-intro">
        <div className="shell">
          <div className="section-head">
            <div><div className="eyebrow">How it works</div><h2 id="byoh-intro">You bring the capability.</h2></div>
            <div>
              <p>Creators Common is developing a multidisciplinary programme connecting real challenges
              with eligible people and shared, provider-owned resources. The goal is a verifiable result:
              a prototype, research outcome, creative work, delivered service or commercial project.</p>
              <p className="small">This is a proposed programme preview. Enrolment, rewards and resource
              access are not open or guaranteed. Each mission requires separate verification and admission.</p>
            </div>
          </div>
          <div className="actions"><a className="button primary" href="#participation">See participation pathways</a>
            <a className="button secondary" href="#mission-concepts">Explore mission concepts</a></div>
        </div>
      </section>
      <section className="section" id="participation" aria-labelledby="byoh-paths">
        <div className="shell">
          <div className="section-head">
            <div><div className="eyebrow">Start with your purpose</div><h2 id="byoh-paths">Four ways to take part.</h2></div>
            <p>Everyone follows the same governed participation process, but not everyone needs the same role.
            Proposed pathways below explain the future intake; they are not functioning applications.</p>
          </div>
          <div className="grid two">
            {entryRoutes.map(([title, detail], index) => (
              <article className="card" key={title}>
                <div className="card-top"><span className="eyebrow">Path {String(index + 1).padStart(2, "0")}</span>
                  <span className="status" data-state="planned">Planned</span></div>
                <div><h3>{title}</h3><p>{detail}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section" aria-labelledby="byoh-disciplines">
        <div className="shell">
          <div className="section-head">
            <div><div className="eyebrow">Open disciplines</div><h2 id="byoh-disciplines">Not limited to students.</h2></div>
            <p>Profession, sector and age are not a competition boundary. Specific work may require
              accredited qualifications, appropriate supervision or additional safeguarding.</p>
          </div>
          <ul className="grid two" style={{listStyle:"none",padding:0}}>
            {disciplines.map((discipline) => (
              <li className="card" style={{minHeight:"auto"}} key={discipline}><strong>{discipline}</strong></li>
            ))}
          </ul>
        </div>
      </section>
      <section className="section" id="mission-concepts" aria-labelledby="byoh-missions">
        <div className="shell">
          <div className="section-head">
            <div><div className="eyebrow">Proposed first cohort</div><h2 id="byoh-missions">Three mission concepts.</h2></div>
            <p>Illustrative challenges for pilot planning. No sponsorship, production
              capacity, recruitment, compensation or live mission has been confirmed.</p>
          </div>
          <div className="grid">
            {proposedHeroMissions.map((mission) => (
              <article key={mission.id} className="card">
                <div className="card-top"><span className="eyebrow">Mission concept</span>
                  <span className="status" data-state="planned">Proposed</span></div>
                <div><h3>{mission.title}</h3><p>{mission.brief}</p>
                  <p className="small"><strong>Skills:</strong> {mission.disciplines.join(" · ")}</p>
                  <p className="small"><strong>Proposed outcome:</strong> {mission.outcome}</p></div>
              </article>
            ))}
          </div>
        </div>
      </section>
      <section className="section" aria-labelledby="byoh-assurance">
        <div className="shell">
          <div className="section-head">
            <div><div className="eyebrow">Rights and resources</div><h2 id="byoh-assurance">Shared, not assumed.</h2></div>
            <div><p>Every active mission will need qualified participants, approved capacity, explicit
              intellectual-property and compensation terms, Warden admission and River evidence.
              Providers retain control of their native tools, facilities, contractual capacity and safety rules.</p>
              <div className="notice">DigitalMe, Synnergyze, Warden, River and SILK are intended integration
                boundaries. This page does not perform identity checks, resource bookings, financial
                transactions or enrolment.</div></div>
          </div>
          <div className="actions"><Link className="button secondary" href="/commons">See the Commons</Link>
            <Link className="button secondary" href="/about">Understand the estate</Link></div>
        </div>
      </section>
    </>
  );
}
