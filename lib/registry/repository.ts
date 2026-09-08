import { creators, executionSurfaces, experiences, works } from "./fixtures";
import type { CreatorRecord, ExecutionSurfaceRecord, ExperienceRecord, WorkRecord } from "./types";

export const getCreators = (): CreatorRecord[] => [...creators];
export const getWorks = (): WorkRecord[] => [...works];
export const getExperiences = (): ExperienceRecord[] => [...experiences];
export const getExecutionSurfaces = (): ExecutionSurfaceRecord[] => [...executionSurfaces];

export const getCreatorName = (id: string): string =>
  creators.find((creator) => creator.id === id)?.displayName ?? "Unknown creator";

export const getWorkTitle = (id: string): string =>
  works.find((work) => work.id === id)?.title ?? "Unknown work";

export const getSurfaceLabel = (id: string): string =>
  executionSurfaces.find((surface) => surface.id === id)?.label ?? "Unknown surface";
