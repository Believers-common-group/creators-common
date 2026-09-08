import { describe, expect, it } from "vitest";
import { getCreators, getExecutionSurfaces, getExperiences, getWorks } from "../lib/registry/repository";

const unique = (values: string[]) => new Set(values).size === values.length;

describe("public registry fixture integrity", () => {
  it("uses explicit non-authoritative example identifiers", () => {
    const all = [...getCreators(), ...getWorks(), ...getExperiences(), ...getExecutionSurfaces()];
    expect(all.every((record) => record.id.startsWith("EXAMPLE-") && record.isExample)).toBe(true);
    expect(unique(all.map((record) => record.id))).toBe(true);
  });

  it("keeps creator, work, experience and surface references resolvable", () => {
    const creators = getCreators();
    const works = getWorks();
    const experiences = getExperiences();
    const surfaces = getExecutionSurfaces();
    const creatorIds = new Set(creators.map((x) => x.id));
    const workIds = new Set(works.map((x) => x.id));
    const experienceIds = new Set(experiences.map((x) => x.id));
    const surfaceIds = new Set(surfaces.map((x) => x.id));

    expect(works.every((work) => creatorIds.has(work.creatorId) && work.experienceIds.every((id) => experienceIds.has(id)))).toBe(true);
    expect(experiences.every((exp) => creatorIds.has(exp.creatorId) && exp.workIds.every((id) => workIds.has(id)) && exp.surfaces.every((id) => surfaceIds.has(id)))).toBe(true);
    expect(creators.every((creator) => creator.workIds.every((id) => workIds.has(id)) && creator.experienceIds.every((id) => experienceIds.has(id)))).toBe(true);
  });

  it("keeps slugs unique within each object type", () => {
    expect(unique(getCreators().map((x) => x.slug))).toBe(true);
    expect(unique(getWorks().map((x) => x.slug))).toBe(true);
    expect(unique(getExperiences().map((x) => x.slug))).toBe(true);
  });
});
